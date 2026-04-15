---
title: NGINX 教程
tags:
  - 技术
  - Web服务器
  - NGINX
  - 反向代理
  - 负载均衡
created: 2026-04-15
---

---

## 目录

1. [NGINX 简介](#一nginx-简介)
2. [安装与基础配置](#二安装与基础配置)
3. [核心概念与架构](#三核心概念与架构)
4. [基本配置详解](#四基本配置详解)
5. [虚拟主机配置](#五虚拟主机配置)
6. [反向代理与负载均衡](#六反向代理与负载均衡)
7. [静态资源服务](#七静态资源服务)
8. [HTTPS/SSL 配置](#八httpsssl-配置)
9. [高级特性](#九高级特性)
10. [性能优化](#十性能优化)
11. [安全配置](#十一安全配置)
12. [故障排查与监控](#十二故障排查与监控)
13. [实战案例](#十三实战案例)
14. [命令详解](#十四命令详解)
15. [配置文件详解](#十五配置文件详解)
16. [常见问题](#十六常见问题)

---

## 一、NGINX 简介

### 1.1 什么是 NGINX

NGINX（发音为 "engine-x"）是一个高性能的 **HTTP** 和 **反向代理** 服务器，同时也是一个 **IMAP/POP3/SMTP** 代理服务器。

### 1.2 NGINX 的核心优势

| 特性 | 说明 |
|------|------|
| **高并发** | 能够同时处理数万个并发连接（C10K 问题） |
| **低内存消耗** | 10,000 个非活动 HTTP 保持连接仅需 2.5MB 内存 |
| **高性能** | 事件驱动架构，异步非阻塞处理 |
| **热部署** | 支持配置热重载，无需重启服务 |
| **模块化** | 丰富的模块生态系统，可扩展性强 |

### 1.3 NGINX vs Apache

| 对比项 | NGINX | Apache |
|--------|-------|--------|
| 架构 | 事件驱动（异步） | 进程/线程驱动 |
| 静态内容 | 更快 | 较慢 |
| 动态内容 | 需配合后端 | 内置支持 |
| 内存使用 | 更低 | 较高 |
| 配置 | 简洁集中 | 分散复杂 |
| .htaccess | 不支持 | 支持 |

---

## 二、安装与基础配置

### 2.1 各种系统安装方法

#### CentOS/RHEL

```bash
# 安装 EPEL 源
sudo yum install epel-release

# 安装 NGINX
sudo yum install nginx

# 启动服务
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Ubuntu/Debian

```bash
# 更新包索引
sudo apt update

# 安装 NGINX
sudo apt install nginx

# 启动服务
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### macOS

```bash
# 使用 Homebrew
brew install nginx

# 启动服务
brew services start nginx
```

#### Docker 安装

```bash
# 拉取官方镜像
docker pull nginx:latest

# 运行容器
docker run -d -p 80:80 --name nginx nginx

# 挂载自定义配置
docker run -d -p 80:80 \
  -v /path/to/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v /path/to/html:/usr/share/nginx/html:ro \
  nginx
```

### 2.2 目录结构

```
/etc/nginx/
├── nginx.conf              # 主配置文件
├── conf.d/                 # 额外配置文件目录
│   └── default.conf
├── sites-available/        # 可用站点配置（Debian/Ubuntu）
├── sites-enabled/          # 启用站点配置（Debian/Ubuntu）
├── snippets/               # 配置片段
├── mime.types              # MIME 类型定义
└── modules/                # 动态模块

/var/log/nginx/
├── access.log              # 访问日志
└── error.log               # 错误日志

/usr/share/nginx/html/      # 默认网站根目录
```

---

## 三、核心概念与架构

### 3.1 架构模型

```
┌─────────────────────────────────────────────────────┐
│                    Master Process                   │
│              (读取配置、管理工作进程)                │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼───┐   ┌────▼───┐   ┌────▼───┐
   │ Worker │   │ Worker │   │ Worker │  ...
   │Process │   │Process │   │Process │
   └───┬────┘   └───┬────┘   └───┬────┘
       │            │            │
       └────────────┴────────────┘
              事件循环处理
```

### 3.2 核心进程模型

| 进程类型 | 数量 | 职责 |
|---------|------|------|
| Master | 1 | 管理 worker 进程，读取和评估配置 |
| Worker | 可配置 | 处理实际的 HTTP 请求 |
| Cache Loader | 1 | 加载缓存元数据 |
| Cache Manager | 1 | 管理缓存过期和大小 |

### 3.3 事件驱动模型

NGINX 使用异步非阻塞的事件驱动模型，相比传统的进程/线程模型，能够更高效地处理大量并发连接。

---

## 四、基本配置详解

### 4.1 nginx.conf 主配置结构

```nginx
# 定义运行 NGINX 的用户和用户组
user nginx;

# 设置 worker 进程数量，通常设置为 CPU 核心数
worker_processes auto;

# 错误日志位置和级别
error_log /var/log/nginx/error.log warn;

# PID 文件位置
pid /var/run/nginx.pid;

# 事件模块配置
events {
    # 每个 worker 进程的最大连接数
    worker_connections 1024;
    
    # 使用高效的 epoll 事件模型（Linux）
    use epoll;
    
    # 允许一个 worker 同时接受多个新连接
    multi_accept on;
}

# HTTP 模块配置
http {
    # 包含 MIME 类型定义
    include /etc/nginx/mime.types;
    
    # 默认 MIME 类型
    default_type application/octet-stream;
    
    # 访问日志格式定义
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 访问日志位置
    access_log /var/log/nginx/access.log main;
    
    # 高效文件传输
    sendfile on;
    
    # TCP 优化
    tcp_nopush on;
    tcp_nodelay on;
    
    # 连接保持超时时间
    keepalive_timeout 65;
    
    # Gzip 压缩
    gzip on;
    
    # 包含其他配置文件
    include /etc/nginx/conf.d/*.conf;
}
```

### 4.2 核心指令详解

#### 全局块指令

| 指令 | 示例 | 说明 |
|------|------|------|
| `user` | `user nginx;` | 设置运行 worker 进程的用户 |
| `worker_processes` | `worker_processes auto;` | worker 进程数 |
| `error_log` | `error_log /var/log/nginx/error.log;` | 错误日志路径和级别 |
| `pid` | `pid /run/nginx.pid;` | PID 文件路径 |

#### Events 块指令

| 指令 | 示例 | 说明 |
|------|------|------|
| `worker_connections` | `worker_connections 1024;` | 每个 worker 的最大连接数 |
| `use` | `use epoll;` | 事件驱动模型 |
| `multi_accept` | `multi_accept on;` | 是否同时接受多个连接 |

---

## 五、虚拟主机配置

### 5.1 基于域名的虚拟主机

```nginx
# 第一个站点: example.com
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 第二个站点: blog.example.com
server {
    listen 80;
    server_name blog.example.com;
    
    root /var/www/blog;
    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
```

### 5.2 基于端口的虚拟主机

```nginx
# HTTP 服务
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /var/www/html;
        index index.html;
    }
}

# 管理后台服务
server {
    listen 8080;
    server_name localhost;
    
    location / {
        root /var/www/admin;
        index index.html;
        
        # 限制访问 IP
        allow 192.168.1.0/24;
        deny all;
    }
}
```

### 5.3 默认服务器配置

```nginx
# 捕获所有未匹配的请求
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # 返回 444 无响应（直接断开连接）
    return 444;
}
```

---

## 六、反向代理与负载均衡

### 6.1 基础反向代理

```nginx
server {
    listen 80;
    server_name app.example.com;
    
    location / {
        # 后端服务器地址
        proxy_pass http://localhost:3000;
        
        # 设置代理请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 代理超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 6.2 负载均衡配置

#### 轮询（默认）

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
    }
}
```

#### 加权轮询

```nginx
upstream backend {
    # 权重越高，分配的请求越多
    server 192.168.1.10:8080 weight=5;
    server 192.168.1.11:8080 weight=3;
    server 192.168.1.12:8080 weight=2;
}
```

#### IP 哈希（会话保持）

```nginx
upstream backend {
    ip_hash;
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

#### 最少连接

```nginx
upstream backend {
    least_conn;
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

### 6.3 健康检查与故障转移

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
    
    # 备份服务器
    server 192.168.1.12:8080 backup;
    
    # 标记为下线
    server 192.168.1.13:8080 down;
}
```

### 6.4 WebSocket 代理

```nginx
upstream websocket_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name ws.example.com;
    
    location /ws {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # WebSocket 超时设置
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## 七、静态资源服务

### 7.1 基础静态文件服务

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    # 根目录
    root /var/www/static;
    
    # 默认索引文件
    index index.html;
    
    # 自动索引
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
    
    # 字符编码
    charset utf-8;
}
```

### 7.2 文件类型处理

```nginx
server {
    listen 80;
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        root /var/www/static;
        
        # 缓存控制
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # 访问日志禁用
        access_log off;
    }
    
    location ~* \.pdf$ {
        root /var/www/documents;
        
        # 强制下载
        add_header Content-Disposition "attachment";
    }
}
```

### 7.3 防盗链配置

```nginx
location ~* \.(gif|jpg|png|jpeg|bmp|swf|flv|mp4)$ {
    root /var/www/images;
    
    # 验证来源
    valid_referers none blocked server_names *.example.com example.*;
    
    if ($invalid_referer) {
        # 返回 403 或重定向到防盗链图片
        return 403;
    }
}
```

### 7.4 下载限速

```nginx
location /downloads/ {
    alias /var/www/downloads/;
    
    # 限速 200KB/s
    limit_rate 200k;
    
    # 前 10MB 不限速
    limit_rate_after 10m;
    
    # 单 IP 并发连接限制
    limit_conn addr 2;
}
```

---

## 八、HTTPS/SSL 配置

### 8.1 基础 HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # SSL 证书
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # 启用 HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    root /var/www/example.com;
    index index.html;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 8.2 SSL 安全优化

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书配置
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # SSL 协议版本（禁用不安全的 TLS 1.0/1.1）
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
}
```

### 8.3 Let's Encrypt 自动配置

```nginx
# 证书申请验证
server {
    listen 80;
    server_name example.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # 包含通用 SSL 配置
    include /etc/nginx/snippets/ssl-params.conf;
}
```

---

## 九、高级特性

### 9.1 Rewrite 模块

```nginx
server {
    listen 80;
    server_name example.com;
    
    # 简单重写
    rewrite ^/old-path$ /new-path permanent;
    
    # 正则重写
    rewrite ^/product/(\d+)$ /item.php?id=$1 last;
    
    # 条件重写
    if ($http_user_agent ~* "mobile") {
        rewrite ^/$ /mobile/ break;
    }
}
```

### 9.2 访问控制

```nginx
server {
    listen 80;
    
    # 基于 IP 的访问控制
    location /admin/ {
        allow 192.168.1.0/24;
        allow 10.0.0.0/8;
        deny all;
        
        # 密码认证
        auth_basic "Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

### 9.3 限流配置

```nginx
# 定义限流区域
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    listen 80;
    
    # 应用限流
    location /api/ {
        # 漏桶限流：平均 10r/s，突发 20 个请求
        limit_req zone=general burst=20 nodelay;
        
        # 连接数限制
        limit_conn addr 10;
        
        proxy_pass http://backend;
    }
}
```

### 9.4 缓存配置

```nginx
# 代理缓存路径
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:100m 
                 max_size=10g inactive=60m use_temp_path=off;

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
        
        # 启用缓存
        proxy_cache my_cache;
        
        # 缓存键定义
        proxy_cache_key "$scheme$request_method$host$request_uri";
        
        # 缓存策略
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        
        # 添加缓存状态头
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

---

## 十、性能优化

### 10.1 Gzip 压缩

```nginx
http {
    # 启用 Gzip
    gzip on;
    
    # 压缩级别（1-9，推荐 4-6）
    gzip_comp_level 5;
    
    # 最小压缩文件大小
    gzip_min_length 256;
    
    # 压缩类型
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        text/css
        text/plain;
    
    # 对代理请求也启用压缩
    gzip_proxied any;
    
    # 添加 Vary 头
    gzip_vary on;
}
```

### 10.2 连接优化

```nginx
http {
    # 长连接优化
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # TCP 优化
    tcp_nopush on;
    tcp_nodelay on;
    
    # 文件描述符限制
    worker_rlimit_nofile 65535;
    
    events {
        worker_connections 4096;
        use epoll;
        multi_accept on;
    }
}
```

### 10.3 文件缓存

```nginx
http {
    # 打开文件缓存
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

---

## 十一、安全配置

### 11.1 安全响应头

```nginx
server {
    listen 80;
    
    # 防止点击劫持
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # 防止 MIME 类型嗅探
    add_header X-Content-Type-Options "nosniff" always;
    
    # XSS 防护
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 内容安全策略
    add_header Content-Security-Policy "default-src 'self'" always;
    
    # 引用策略
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 11.2 DDoS 防护

```nginx
# 定义限流区域
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    listen 80;
    
    # 全局限流
    limit_req zone=req_limit burst=20 nodelay;
    limit_conn conn_limit 10;
}
```

### 11.3 隐藏敏感信息

```nginx
http {
    # 隐藏版本号
    server_tokens off;
    
    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~* \.(log|git|svn|env|ini|conf)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 十二、故障排查与监控

### 12.1 日志配置详解

```nginx
http {
    # 自定义日志格式
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time';
    
    # 访问日志
    access_log /var/log/nginx/access.log detailed;
    
    # 错误日志
    error_log /var/log/nginx/error.log warn;
}
```

### 12.2 状态监控

```nginx
server {
    listen 80;
    server_name status.localhost;
    
    # 启用 stub_status 模块
    location /nginx_status {
        stub_status on;
        
        # 只允许本地访问
        allow 127.0.0.1;
        deny all;
    }
}
```

### 12.3 常用排查命令

```bash
# 测试配置语法
nginx -t

# 测试并显示完整配置
nginx -T

# 重新加载配置
nginx -s reload

# 快速停止
nginx -s stop

# 优雅退出
nginx -s quit

# 查看运行状态
systemctl status nginx

# 查看错误日志（实时）
tail -f /var/log/nginx/error.log

# 查看连接数
ss -ant | grep :80 | wc -l

# 查看 worker 进程
ps aux | grep nginx
```

---

## 十三、实战案例

### 13.1 完整的 Web 应用配置

```nginx
# 应用服务器配置
upstream app_servers {
    least_conn;
    
    server 127.0.0.1:3000 weight=5 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3001 weight=5 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 backup;
    
    keepalive 32;
}

# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:100m 
                 max_size=1g inactive=60m use_temp_path=off;

server {
    listen 80;
    server_name myapp.com www.myapp.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.com www.myapp.com;
    
    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 静态文件
    location /static/ {
        alias /var/www/myapp/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        
        proxy_cache app_cache;
        proxy_cache_valid 200 5m;
        
        add_header X-Cache-Status $upstream_cache_status;
    }
    
    # 主应用
    location / {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 13.2 前端 SPA 配置

```nginx
server {
    listen 80;
    server_name spa.example.com;
    root /var/www/spa;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 所有路由指向 index.html（支持前端路由）
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 十四、常见问题

### Q1: 如何查看当前生效的配置？

```bash
nginx -T  # 查看完整配置
nginx -t  # 测试配置语法
```

### Q2: 配置更改后如何生效？

```bash
nginx -s reload  # 热重载（推荐）
systemctl reload nginx
```

### Q3: 为什么静态文件返回 403？

可能原因：
1. 文件权限不足：`chmod -R 755 /var/www/`
2. 用户权限错误：检查 `user` 指令配置
3. SELinux 限制：`setenforce 0` 或配置 SELinux 规则

### Q4: 如何配置跨域（CORS）？

```nginx
location /api/ {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    proxy_pass http://backend;
}
```

### Q5: 如何实现灰度发布？

```nginx
# 基于 Cookie 的灰度
upstream stable {
    server stable-backend:8080;
}

upstream canary {
    server canary-backend:8080;
}

map $cookie_canary $backend {
    default stable;
    "1" canary;
}

server {
    location / {
        proxy_pass http://$backend;
    }
}
```

---

## 附录

### A. 常用正则表达式

| 用途     | 正则表达式           |      |      |       |        |     |        |
| ------ | --------------- | ---- | ---- | ----- | ------ | --- | ------ |
| 图片文件   | `\.(jpg         | jpeg | png  | gif   | ico)$` |     |        |
| 静态资源   | `\.(css         | js   | woff | woff2 | ttf    | eot | svg)$` |
| API 版本 | `^/api/v(\d+)/` |      |      |       |        |     |        |

### B. 变量参考

| 变量 | 说明 |
|------|------|
| `$remote_addr` | 客户端 IP 地址 |
| `$remote_user` | 认证用户名 |
| `$time_local` | 本地时间 |
| `$request` | 完整请求行 |
| `$status` | HTTP 状态码 |
| `$body_bytes_sent` | 发送的字节数 |
| `$http_referer` | 来源页面 |
| `$http_user_agent` | 用户代理 |
| `$request_time` | 请求处理时间 |
| `$upstream_response_time` | 上游响应时间 |
| `$host` | 请求主机头 |
| `$uri` | 当前 URI |
| `$args` | 查询参数 |

### C. HTTP 状态码速查

| 状态码 | 含义 | 常见场景 |
|--------|------|---------|
| 200 | OK | 请求成功 |
| 301 | Moved Permanently | 永久重定向 |
| 302 | Found | 临时重定向 |
| 304 | Not Modified | 缓存有效 |
| 400 | Bad Request | 请求语法错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |
| 504 | Gateway Timeout | 网关超时 |

---

## 十四、命令详解

### 14.1 基础命令

#### nginx - 启动服务

```bash
# 直接启动（默认读取 /etc/nginx/nginx.conf）
nginx

# 指定配置文件启动
nginx -c /path/to/nginx.conf

# 指定前缀目录启动
nginx -p /usr/local/nginx/
```

| 参数 | 说明 |
|------|------|
| `-c` | 指定配置文件路径 |
| `-p` | 设置前缀路径（用于相对路径解析） |
| `-g` | 设置全局配置指令 |

**示例：**
```bash
# 以特定用户启动
nginx -g "daemon on; master_process on;"
```

---

#### nginx -t - 测试配置

```bash
# 测试默认配置文件语法
nginx -t

# 测试指定配置文件
nginx -t -c /path/to/nginx.conf
```

| 输出 | 含义 |
|------|------|
| `syntax is ok` | 配置语法正确 |
| `test is successful` | 配置文件测试通过 |
| `emerg` / `error` | 配置存在错误 |

**使用场景：**
- 修改配置后验证语法
- CI/CD 流程中自动检查
- 部署前预检

---

#### nginx -T - 查看完整配置

```bash
# 查看当前加载的所有配置（包括 include 的文件）
nginx -T

# 保存到文件
nginx -T > /tmp/full-config.txt
```

**输出内容包括：**
- 主配置文件内容
- 所有被 include 的文件内容
- 注释掉的配置也会显示

**用途：**
- 排查配置问题
- 确认 include 的文件是否正确加载
- 备份当前生效配置

---

#### nginx -s - 信号控制

```bash
# 重新加载配置（热重载）
nginx -s reload

# 快速停止（立即终止）
nginx -s stop

# 优雅退出（处理完当前请求后停止）
nginx -s quit

# 重新打开日志文件
nginx -s reopen
```

| 信号 | 作用 | 使用场景 |
|------|------|---------|
| `reload` | 热重载配置 | 修改配置后生效，不中断服务 |
| `stop` | 强制停止 | 紧急情况下立即停止 |
| `quit` | 优雅退出 | 正常停机，等待请求处理完成 |
| `reopen` | 重新打开日志 | 日志轮转时使用 |

**reload 工作流程：**
```
1. 检查新配置语法
2. 启动新的 worker 进程（使用新配置）
3. 旧 worker 进程停止接受新连接
4. 旧 worker 处理完当前请求后退出
5. 新 worker 接管流量
```

---

#### nginx -V - 查看版本和编译参数

```bash
# 查看版本
nginx -v

# 查看详细编译信息
nginx -V
```

**输出示例：**
```
nginx version: nginx/1.24.0
built by gcc 11.4.0
built with OpenSSL 3.0.8
TLS SNI support enabled
configure arguments: 
    --prefix=/etc/nginx 
    --sbin-path=/usr/sbin/nginx 
    --modules-path=/usr/lib/nginx/modules 
    --conf-path=/etc/nginx/nginx.conf 
    --error-log-path=/var/log/nginx/error.log 
    --http-log-path=/var/log/nginx/access.log 
    --with-http_ssl_module 
    --with-http_v2_module 
    --with-http_gzip_static_module
    ...
```

**用途：**
- 确认已安装的模块
- 排查功能缺失问题
- 升级前检查编译参数

---

### 14.2 Systemd 管理命令

#### systemctl 命令

```bash
# 启动 NGINX
systemctl start nginx

# 停止 NGINX
systemctl stop nginx

# 重启 NGINX
systemctl restart nginx

# 重载配置（推荐）
systemctl reload nginx

# 查看状态
systemctl status nginx

# 设置开机自启
systemctl enable nginx

# 禁用开机自启
systemctl disable nginx

# 查看是否开机自启
systemctl is-enabled nginx
```

**systemctl status 输出解读：**
```
● nginx.service - A high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Mon 2024-01-15 10:30:00 CST
  Process: 1234 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)
  Process: 1235 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)
 Main PID: 1236 (nginx)
    Tasks: 5 (limit: 4915)
   Memory: 5.2M
   CGroup: /system.slice/nginx.service
           ├─1236 nginx: master process /usr/sbin/nginx
           ├─1237 nginx: worker process
           ├─1238 nginx: worker process
           └─1239 nginx: worker process
```

| 字段 | 含义 |
|------|------|
| `Loaded` | 服务是否加载、是否开机自启 |
| `Active` | 运行状态、启动时间 |
| `Main PID` | 主进程 ID |
| `Tasks` | 进程数 |
| `Memory` | 内存使用 |

---

### 14.3 进程管理命令

#### 查看 NGINX 进程

```bash
# 查看所有 NGINX 进程
ps aux | grep nginx

# 树形结构查看
pstree -p | grep nginx

# 查看端口监听
ss -tlnp | grep nginx
# 或
netstat -tlnp | grep nginx
```

**典型输出：**
```
root      1236  0.0  0.1  ...  nginx: master process /usr/sbin/nginx
nginx     1237  0.0  0.0  ...  nginx: worker process
nginx     1238  0.0  0.0  ...  nginx: worker process
nginx     1239  0.0  0.0  ...  nginx: nginx: cache manager process
nginx     1240  0.0  0.0  ...  nginx: cache loader process
```

| 进程类型 | 说明 |
|---------|------|
| `master` | 主进程，管理其他进程 |
| `worker` | 工作进程，处理请求 |
| `cache manager` | 缓存管理进程 |
| `cache loader` | 缓存加载进程 |

---

#### 信号发送（kill）

```bash
# 获取主进程 PID
PID=$(cat /run/nginx.pid)

# 优雅退出
kill -QUIT $PID

# 快速停止
kill -TERM $PID
# 或
kill -INT $PID

# 重新加载配置
kill -HUP $PID

# 重新打开日志文件
kill -USR1 $PID

# 优雅地关闭 worker 进程（用于升级）
kill -WINCH $PID
```

| 信号 | 作用 |
|------|------|
| `TERM` / `INT` | 快速停止 |
| `QUIT` | 优雅退出 |
| `HUP` | 重新加载配置 |
| `USR1` | 重新打开日志文件 |
| `USR2` | 热升级可执行文件 |
| `WINCH` | 优雅地关闭 worker 进程 |

---

### 14.4 日志相关命令

#### 实时查看日志

```bash
# 查看错误日志（实时）
tail -f /var/log/nginx/error.log

# 查看访问日志（实时）
tail -f /var/log/nginx/access.log

# 查看最后 100 行
tail -n 100 /var/log/nginx/access.log

# 查看开头 50 行
head -n 50 /var/log/nginx/error.log
```

#### 日志分析

```bash
# 统计 IP 访问次数（取前 10）
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计状态码分布
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 查找 404 错误
awk '$9 == 404 {print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 统计响应时间大于 1 秒的请求
awk '$NF > 1 {print $7, $NF}' /var/log/nginx/access.log | sort -k2 -rn

# 按小时统计请求量
awk '{print $4}' /var/log/nginx/access.log | cut -d: -f2 | sort | uniq -c
```

#### 日志轮转

```bash
# 手动轮转日志
/usr/sbin/logrotate -f /etc/logrotate.d/nginx

# 测试日志轮转配置
/usr/sbin/logrotate -d /etc/logrotate.d/nginx
```

**logrotate 配置示例：**
```bash
/var/log/nginx/*.log {
    daily                    # 每天轮转
    missingok                # 日志不存在不报错
    rotate 14                # 保留 14 天
    compress                 # 压缩旧日志
    delaycompress            # 延迟压缩（保留最近一份未压缩）
    notifempty               # 空日志不轮转
    create 0640 www-data adm # 创建新日志的权限
    sharedscripts            # 共享脚本（只执行一次）
    postrotate               # 轮转后执行
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

---

### 14.5 性能监控命令

#### 连接数监控

```bash
# 查看当前连接数
ss -ant | grep :80 | wc -l

# 查看各状态连接数
ss -ant | awk '{print $1}' | sort | uniq -c

# 查看 NGINX 打开的文件数
lsof -p $(cat /run/nginx.pid) | wc -l

# 查看系统文件描述符限制
cat /proc/$(cat /run/nginx.pid)/limits | grep "Max open files"
```

#### 性能统计

```bash
# 查看 stub_status（需配置）
curl http://localhost/nginx_status

# 典型输出：
# Active connections: 291
# server accepts handled requests
#  16630948 16630948 31070465
# Reading: 6 Writing: 125 Waiting: 160
```

| 指标 | 说明 |
|------|------|
| `Active connections` | 当前活动连接数 |
| `accepts` | 总共接受的连接数 |
| `handled` | 总共处理的连接数 |
| `requests` | 总共处理的请求数 |
| `Reading` | 正在读取请求头的连接数 |
| `Writing` | 正在写入响应的连接数 |
| `Waiting` | 保持连接的空闲连接数 |

---

### 14.6 模块管理命令

#### 查看动态模块

```bash
# 列出已加载的动态模块
ls /usr/lib/nginx/modules/

# 查看模块详情
nginx -V 2>&1 | grep "configure arguments" | tr ' ' '\n' | grep "with"
```

#### 加载动态模块

```nginx
# 在 nginx.conf 中加载
dso {
    load ngx_http_geoip2_module.so;
    load ngx_stream_module.so;
}

# 或在配置中使用
load_module modules/ngx_http_image_filter_module.so;
```

---

### 14.7 调试命令

#### 调试模式启动

```bash
# 前台运行（调试模式）
nginx -g "daemon off;"

# 指定错误日志级别为 debug
nginx -g "error_log /var/log/nginx/error.log debug;"

# 完整调试启动
nginx -c /etc/nginx/nginx.conf -g "daemon off; master_process off; error_log /dev/stderr debug;"
```

#### 配置检查调试

```bash
# 查看配置解析过程（详细输出）
nginx -T 2>&1 | less

# 检查特定 include 文件
nginx -t -c /etc/nginx/conf.d/site.conf
```

---

### 14.8 常用命令速查表

| 命令 | 作用 | 使用频率 |
|------|------|---------|
| `nginx -t` | 测试配置 | ⭐⭐⭐⭐⭐ |
| `nginx -s reload` | 热重载 | ⭐⭐⭐⭐⭐ |
| `nginx -s stop` | 停止服务 | ⭐⭐⭐⭐ |
| `nginx -V` | 查看版本 | ⭐⭐⭐ |
| `systemctl status nginx` | 查看状态 | ⭐⭐⭐⭐⭐ |
| `systemctl reload nginx` | 重载服务 | ⭐⭐⭐⭐⭐ |
| `tail -f /var/log/nginx/error.log` | 查看错误 | ⭐⭐⭐⭐⭐ |
| `ss -tlnp \| grep nginx` | 查看端口 | ⭐⭐⭐⭐ |

---

## 十五、配置文件详解

### 15.1 配置文件结构概览

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

### 15.2 主配置文件 nginx.conf

#### 完整示例配置

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

### 15.3 Server 块详解

#### 基础 Server 配置

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

#### Listen 指令详解

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
default_server
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

### 15.4 Location 块详解

#### Location 匹配规则

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

#### Location 匹配优先级

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

### 15.5 Upstream 块详解

#### 基础负载均衡配置

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

#### 高级 Upstream 配置

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

### 15.6 常用指令详解

#### 代理相关指令

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

#### 重写与重定向

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

#### SSL/TLS 配置

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

#### 缓存配置

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

#### 限流配置

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

#### 访问控制

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

### 15.7 变量详解

#### 内置变量

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

#### 自定义变量

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

### 15.8 配置文件组织最佳实践

#### 目录结构

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

#### 配置片段示例

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

### 15.9 配置调试技巧

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

## 十六、常见问题

### Q1: 如何查看当前生效的配置？

```bash
nginx -T  # 查看完整配置
nginx -t  # 测试配置语法
```

### Q2: 配置更改后如何生效？

```bash
nginx -s reload  # 热重载（推荐）
systemctl reload nginx
```

### Q3: 为什么静态文件返回 403？

可能原因：
1. 文件权限不足：`chmod -R 755 /var/www/`
2. 用户权限错误：检查 `user` 指令配置
3. SELinux 限制：`setenforce 0` 或配置 SELinux 规则

### Q4: 如何配置跨域（CORS）？

```nginx
location /api/ {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    proxy_pass http://backend;
}
```

### Q5: 如何实现灰度发布？

```nginx
# 基于 Cookie 的灰度
upstream stable {
    server stable-backend:8080;
}

upstream canary {
    server canary-backend:8080;
}

map $cookie_canary $backend {
    default stable;
    "1" canary;
}

server {
    location / {
        proxy_pass http://$backend;
    }
}
```

---

## 附录

### A. 常用正则表达式

| 用途     | 正则表达式           |      |      |       |        |     |        |
| ------ | --------------- | ---- | ---- | ----- | ------ | --- | ------ |
| 图片文件   | `\.(jpg         | jpeg | png  | gif   | ico)$` |     |        |
| 静态资源   | `\.(css         | js   | woff | woff2 | ttf    | eot | svg)$` |
| API 版本 | `^/api/v(\d+)/` |      |      |       |        |     |        |

### B. 变量参考

| 变量                        | 说明        |
| ------------------------- | --------- |
| `$remote_addr`            | 客户端 IP 地址 |
| `$remote_user`            | 认证用户名     |
| `$time_local`             | 本地时间      |
| `$request`                | 完整请求行     |
| `$status`                 | HTTP 状态码  |
| `$body_bytes_sent`        | 发送的字节数    |
| `$http_referer`           | 来源页面      |
| `$http_user_agent`        | 用户代理      |
| `$request_time`           | 请求处理时间    |
| `$upstream_response_time` | 上游响应时间    |
| `$host`                   | 请求主机头     |
| `$uri`                    | 当前 URI    |
| `$args`                   | 查询参数      |

### C. HTTP 状态码速查

| 状态码 | 含义 | 常见场景 |
|--------|------|---------|
| 200 | OK | 请求成功 |
| 301 | Moved Permanently | 永久重定向 |
| 302 | Found | 临时重定向 |
| 304 | Not Modified | 缓存有效 |
| 400 | Bad Request | 请求语法错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |
| 504 | Gateway Timeout | 网关超时 |

---

> **版本**: 1.0  
> **更新日期**: 2026年  
> **建议 NGINX 版本**: 1.20+  

*本文档持续更新，如有疑问请参考 [NGINX 官方文档](https://nginx.org/en/docs/)*
