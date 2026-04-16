---
title: NGINX 配置详解
tags:
  - 技术
  - Web服务器
  - NGINX
  - 配置
  - 详解
created: 2026-04-15
---

# NGINX 配置详解

> NGINX 配置文件深度解析：结构、指令、变量、最佳实践

---

## 目录

- [配置文件结构概览](#配置文件结构概览)
- [主配置文件 nginx.conf](#主配置文件-nginxconf)
- [Server 块详解](#server-块详解)
- [Location 块详解](#location-块详解)
- [Upstream 块详解](#upstream-块详解)
- [常用指令详解](#常用指令详解)
- [变量详解](#变量详解)
- [配置文件组织最佳实践](#配置文件组织最佳实践)
- [配置调试技巧](#配置调试技巧)

---

## 配置文件结构概览

NGINX 配置文件采用层级结构，主要包含以下几个上下文（Context）：

```
main（全局配置）
├── events（事件配置）
├── http（HTTP 配置）
│   ├── server（虚拟主机）
│   │   ├── location（URL 匹配规则）
│   │   └── location
│   └── server
├── mail（邮件代理配置）
└── stream（四层代理配置）
```

---

## 主配置文件 nginx.conf

### 完整示例配置

```nginx
# ========== 全局块（Global Block）==========

# 指定运行 worker 进程的用户和用户组
# 语法：user user [group]
user nginx nginx;

# worker 进程数量
# 建议设置为 CPU 核心数，auto 表示自动检测
worker_processes auto;

# 错误日志配置
# 语法：error_log file [level]
# 级别：debug | info | notice | warn | error | crit | alert | emerg
error_log /var/log/nginx/error.log warn;

# PID 文件存放位置
pid /run/nginx.pid;

# 单个 worker 进程的最大文件打开数
# 应大于 worker_connections
worker_rlimit_nofile 65535;

# 加载动态模块
load_module modules/ngx_http_geoip2_module.so;

# ========== Events 块 ==========
events {
    # 每个 worker 进程的最大并发连接数
    worker_connections 4096;
    
    # 使用的事件驱动模型
    # Linux 推荐 epoll，FreeBSD 推荐 kqueue
    use epoll;
    
    # 是否允许一个 worker 同时接受多个新连接
    multi_accept on;
    
    # 启用网络连接序列化（防止惊群）
    accept_mutex on;
    
    # accept_mutex 的等待时间
    accept_mutex_delay 500ms;
}

# ========== HTTP 块 ==========
http {
    # 包含 MIME 类型定义文件
    include /etc/nginx/mime.types;
    
    # 默认 MIME 类型
    default_type application/octet-stream;
    
    # 自定义日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '$request_time $upstream_response_time '
                        '"$http_referer" "$http_user_agent"';
    
    # 访问日志配置
    access_log /var/log/nginx/access.log main;
    
    # 高效文件传输模式
    # 启用后，数据直接在内核空间传输，减少拷贝
    sendfile on;
    
    # 与 sendfile 配合使用，提高网络包传输效率
    tcp_nopush on;
    
    # 禁用 Nagle 算法，减少延迟
    tcp_nodelay on;
    
    # 连接保持超时时间
    keepalive_timeout 65;
    
    # 单个连接最大请求数
    keepalive_requests 1000;
    
    # 隐藏 NGINX 版本号
    server_tokens off;
    
    # 客户端请求体大小限制
    client_max_body_size 20m;
    
    # 客户端请求头缓冲区大小
    client_header_buffer_size 4k;
    
    # 大型请求头缓冲区配置
    large_client_header_buffers 4 8k;
    
    # 包含其他配置文件
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

---

## Server 块详解

### 基础 Server 配置

```nginx
server {
    # 监听端口
    listen 80;
    
    # 监听 IPv6
    listen [::]:80;
    
    # 服务器名称（域名）
    server_name example.com www.example.com;
    
    # 网站根目录
    root /var/www/example.com;
    
    # 默认索引文件
    index index.html index.htm index.php;
    
    # 字符编码
    charset utf-8;
    
    # 访问日志（可覆盖全局设置）
    access_log /var/log/nginx/example.com.access.log detailed;
    
    # 错误日志
    error_log /var/log/nginx/example.com.error.log warn;
    
    # 包含其他配置片段
    include /etc/nginx/snippets/security.conf;
}
```

### Listen 指令详解

```nginx
# 基础监听
listen 80;

# 指定 IP 和端口
listen 192.168.1.100:80;

# 监听 IPv6
listen [::]:80;

# 监听特定 IPv6 地址
listen [2001:db8::1]:80;

# 设置为默认服务器
listen 80 default_server;

# 监听 HTTPS
listen 443 ssl;

# 启用 HTTP/2
listen 443 ssl http2;

# 监听 UDP（stream 模块）
listen 53 udp;

# 监听多个端口
listen 80;
listen 8080;
listen 443 ssl;
```

---

## Location 块详解

### Location 匹配规则

```nginx
server {
    # = 精确匹配（优先级最高）
    location = /exact {
        # 只匹配 /exact，不匹配 /exact/ 或 /exact/more
        return 200 "Exact match\n";
    }
    
    # ^~ 前缀匹配（优先于正则）
    location ^~ /static/ {
        # 匹配以 /static/ 开头的请求
        root /var/www/static;
    }
    
    # ~ 区分大小写的正则匹配
    location ~ \.(gif|jpg|png)$ {
        # 匹配以 .gif/.jpg/.png 结尾的请求
        root /var/www/images;
        expires 30d;
    }
    
    # ~* 不区分大小写的正则匹配
    location ~* \.(css|js)$ {
        # 匹配 .css/.js（不区分大小写）
        root /var/www/assets;
        expires 1y;
    }
    
    # 普通前缀匹配（优先级最低）
    location /api/ {
        # 匹配以 /api/ 开头的请求
        proxy_pass http://api_backend;
    }
    
    # @ 命名 location（内部重定向用）
    location @fallback {
        proxy_pass http://fallback_backend;
    }
}
```

### Location 匹配优先级

```
1. =               精确匹配
2. ^~              前缀匹配（匹配后停止搜索）
3. ~ 或 ~*         正则匹配（按配置顺序）
4. 无修饰符        普通前缀匹配
```

**匹配示例：**

| 请求 URI | 匹配 Location |
|---------|--------------|
| `/exact` | `= /exact` |
| `/static/file.css` | `^~ /static/` |
| `/image.jpg` | `~ \.(gif\|jpg\|png)$` |
| `/api/users` | `/api/` |

---

## Upstream 块详解

### 基础负载均衡配置

```nginx
# 定义后端服务器组
upstream backend {
    # 轮询算法（默认）
    server 192.168.1.10:8080 weight=5;
    server 192.168.1.11:8080 weight=5;
    
    # 备份服务器
    server 192.168.1.12:8080 backup;
    
    # 下线服务器
    server 192.168.1.13:8080 down;
    
    # 长连接配置
    keepalive 32;
    
    # 连接超时
    keepalive_timeout 30s;
    
    # 每个连接的请求数
    keepalive_requests 1000;
}

# 使用 upstream
server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### 高级 Upstream 配置

```nginx
upstream backend {
    # 会话保持（IP 哈希）
    ip_hash;
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

upstream backend {
    # 最少连接算法
    least_conn;
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

upstream backend {
    # 一致性哈希
    hash $request_uri consistent;
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

upstream backend {
    # 带权重的最少连接
    least_conn;
    
    server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 backup;
    
    # 健康检查间隔（需要模块支持）
    check interval=3000 rise=2 fall=3 timeout=1000 type=http;
    check_http_send "HEAD /health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}
```

---

## 常用指令详解

### 代理相关指令

```nginx
location /api/ {
    # 代理目标地址
    proxy_pass http://backend;
    
    # 设置代理请求头
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 连接超时
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # 缓冲区配置
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
    
    # 临时文件配置
    proxy_max_temp_file_size 1024m;
    proxy_temp_file_write_size 64k;
    
    # 重定向处理
    proxy_redirect off;
    
    # 错误处理
    proxy_intercept_errors on;
    error_page 500 502 503 504 /custom_error.html;
}
```

### 重写与重定向

```nginx
server {
    listen 80;
    server_name example.com;
    
    # return 指令（推荐用于简单重定向）
    location /old-page {
        return 301 /new-page;
    }
    
    # rewrite 指令
    location /products {
        # 重写 URL（内部重定向）
        rewrite ^/products/(.*)$ /items/$1 last;
        
        # 外部重定向（301）
        rewrite ^/old-products/(.*)$ /products/$1 permanent;
        
        # 临时重定向（302）
        rewrite ^/temp-products/(.*)$ /products/$1 redirect;
    }
    
    # break - 停止处理后续 rewrite
    location /special {
        rewrite ^/special/(.*)$ /handle/$1 break;
        proxy_pass http://backend;
    }
    
    # if 条件判断
    if ($http_user_agent ~* "mobile") {
        rewrite ^/$ /mobile/ redirect;
    }
    
    if ($request_method = POST) {
        return 405;
    }
}
```

### SSL/TLS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书配置
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # 证书链（用于 OCSP）
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
    
    # 协议版本
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 加密套件
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # 会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # 客户端证书验证（双向认证）
    ssl_client_certificate /etc/nginx/ssl/ca.crt;
    ssl_verify_client on;
    ssl_verify_depth 2;
}
```

### 缓存配置

```nginx
http {
    # 代理缓存路径配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:100m 
                     max_size=10g inactive=60m use_temp_path=off;
    
    server {
        location / {
            proxy_pass http://backend;
            
            # 启用缓存
            proxy_cache my_cache;
            
            # 缓存键定义
            proxy_cache_key "$scheme$request_method$host$request_uri";
            
            # 缓存有效期
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            
            # 缓存使用策略
            proxy_cache_use_stale error timeout updating http_500 http_502;
            
            # 后台更新
            proxy_cache_background_update on;
            
            # 缓存锁（防止缓存失效时的并发回源）
            proxy_cache_lock on;
            proxy_cache_lock_timeout 5s;
            
            # 添加缓存状态头
            add_header X-Cache-Status $upstream_cache_status;
            
            # 缓存绕过条件
            proxy_cache_bypass $cookie_session;
            proxy_no_cache $cookie_session;
        }
    }
}
```

### 限流配置

```nginx
http {
    # 定义限流区域
    # $binary_remote_addr：客户端 IP
    # zone=名称:内存大小
    # rate=速率（r/s 或 r/m）
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    
    # 连接数限制
    limit_conn_zone $binary_remote_addr zone=addr:10m;
    
    server {
        location / {
            # 应用限流
            # burst=桶容量，nodelay=不延迟处理突发请求
            limit_req zone=general burst=20 nodelay;
            
            # 连接数限制
            limit_conn addr 10;
            
            proxy_pass http://backend;
        }
        
        location /api/ {
            # API 更严格的限流
            limit_req zone=api burst=10 nodelay;
            
            proxy_pass http://api_backend;
        }
    }
}
```

### 访问控制

```nginx
server {
    # IP 访问控制
    location /admin/ {
        # 允许特定 IP
        allow 192.168.1.0/24;
        allow 10.0.0.0/8;
        allow 127.0.0.1;
        
        # 拒绝其他所有
        deny all;
        
        # 基本认证
        auth_basic "Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
    
    # 基于请求方法限制
    if ($request_method !~ ^(GET|POST|HEAD)$) {
        return 405;
    }
    
    # 基于 User-Agent 限制
    if ($http_user_agent ~* (bot|crawler|spider)) {
        return 403;
    }
    
    # 基于请求速率限制（使用 map）
    map $binary_remote_addr $limit {
        default "";
        ~^192\.168\. "limit";
    }
    
    limit_req_zone $limit zone=internal:10m rate=100r/s;
}
```

---

## 变量详解

### 内置变量

```nginx
# 客户端相关
$remote_addr          # 客户端 IP 地址
$remote_port          # 客户端端口
$remote_user          # 基本认证用户名
$http_user_agent      # 客户端 User-Agent
$http_referer         # 来源页面
$http_cookie          # Cookie 字符串

# 请求相关
$request              # 完整请求行
$request_method       # 请求方法（GET/POST等）
$request_uri          # 完整请求 URI（带参数）
$uri                  # 当前 URI（不带参数）
$document_uri         # 同 $uri
$args                 # 查询参数字符串
$query_string         # 同 $args
$arg_name             # 特定参数值
$content_length       # 请求体长度
$content_type         # 请求体类型

# 服务器相关
$host                 # 请求主机头
$server_name          # 匹配的 server_name
$server_addr          # 服务器 IP
$server_port          # 服务器端口
$hostname             # 服务器主机名
$nginx_version        # NGINX 版本

# 响应相关
$status               # HTTP 状态码
$body_bytes_sent      # 发送的字节数
$bytes_sent           # 总发送字节数
$connection           # 连接序号
$connection_requests  # 连接上的请求数

# 时间相关
$time_iso8601         # ISO 8601 格式时间
$time_local           # 本地时间
$request_time         # 请求处理时间（秒）
$msec                 # 当前时间戳（秒，毫秒精度）

# 代理相关
$upstream_addr        # 上游服务器地址
$upstream_status      # 上游响应状态码
$upstream_response_time    # 上游响应时间
$upstream_connect_time     # 上游连接时间
$upstream_cache_status     # 缓存状态（HIT/MISS等）
```

### 自定义变量

```nginx
http {
    # 使用 map 创建变量
    map $http_host $backend_pool {
        default         backend_default;
        api.example.com backend_api;
        app.example.com backend_app;
    }
    
    map $http_user_agent $is_mobile {
        default 0;
        ~*android|iphone|ipad 1;
    }
    
    server {
        location / {
            proxy_pass http://$backend_pool;
            
            # 使用自定义变量
            if ($is_mobile) {
                rewrite ^/$ /mobile/ redirect;
            }
        }
        
        # 使用 set 创建变量
        set $custom_var "value";
        
        # 变量拼接
        set $full_uri "$host$request_uri";
    }
}
```

---

## 配置文件组织最佳实践

### 目录结构

```
/etc/nginx/
├── nginx.conf              # 主配置
├── conf.d/                 # 通用配置片段
│   ├── gzip.conf
│   ├── ssl.conf
│   ├── security.conf
│   └── proxy.conf
├── sites-available/        # 可用站点
│   ├── example.com
│   ├── api.example.com
│   └── blog.example.com
├── sites-enabled/          # 启用站点（软链接）
│   ├── example.com -> ../sites-available/example.com
│   └── api.example.com -> ../sites-available/api.example.com
└── snippets/               # 可复用配置片段
    ├── ssl-params.conf
    ├── proxy-params.conf
    └── fastcgi-php.conf
```

### 配置片段示例

**conf.d/gzip.conf**
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
```

**conf.d/security.conf**
```nginx
# 隐藏版本号
server_tokens off;

# 安全响应头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 限制请求体大小
client_max_body_size 20M;
```

**snippets/proxy-params.conf**
```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;
```

**sites-available/example.com**
```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html;
    
    include snippets/ssl-params.conf;
    include snippets/security.conf;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api/ {
        include snippets/proxy-params.conf;
        proxy_pass http://api_backend;
    }
}
```

---

## 配置调试技巧

```nginx
# 启用调试日志（需编译时添加 --with-debug）
error_log /var/log/nginx/error.log debug;

# 特定 IP 调试
events {
    debug_connection 192.168.1.1;
    debug_connection 192.168.10.0/24;
}

# 添加调试头
add_header X-Debug-Message "Reached location /api" always;
add_header X-Request-URI $request_uri always;

# 使用 return 输出变量值（调试用）
location /debug {
    return 200 "Host: $host\nURI: $uri\nArgs: $args\n";
}
```

---

> 上一篇：[NGINX 运维指南](./nginx运维.md) | 下一篇：[NGINX 实战案例](./nginx实战.md)
