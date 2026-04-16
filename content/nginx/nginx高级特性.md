---
title: NGINX 高级特性
tags:
  - 技术
  - Web服务器
  - NGINX
  - 高级特性
  - 性能优化
  - 安全配置
created: 2026-04-15
---

# NGINX 高级特性

> NGINX 高级功能：Rewrite、访问控制、限流、缓存、性能优化、安全配置

---

## 目录

- [Rewrite 模块](#rewrite-模块)
- [访问控制](#访问控制)
- [限流配置](#限流配置)
- [缓存配置](#缓存配置)
- [性能优化](#性能优化)
- [安全配置](#安全配置)
- [日志定制](#日志定制)

---

## Rewrite 模块

### Rewrite 基础

Rewrite 模块用于 URL 重写和重定向，基于正则表达式匹配。

```nginx
server {
    listen 80;
    server_name example.com;
    
    # 简单重写（301 永久重定向）
    rewrite ^/old-path$ /new-path permanent;
    
    # 正则重写
    rewrite ^/product/(\d+)$ /item.php?id=$1 last;
    
    # 外部重定向（302 临时）
    rewrite ^/temp$ /new redirect;
}
```

### Rewrite 标志

| 标志 | 说明 |
|------|------|
| `last` | 停止处理当前 rewrite，重新搜索 location（默认） |
| `break` | 停止处理当前 rewrite，不再重新搜索 location |
| `redirect` | 返回 302 临时重定向 |
| `permanent` | 返回 301 永久重定向 |

### 常用 Rewrite 场景

#### URL 美化

```nginx
server {
    listen 80;
    server_name blog.example.com;
    
    # /post/123 -> /post.php?id=123
    rewrite ^/post/(\d+)$ /post.php?id=$1 last;
    
    # /category/tech -> /category.php?name=tech
    rewrite ^/category/([a-zA-Z0-9_-]+)$ /category.php?name=$1 last;
    
    # /user/username -> /profile.php?user=username
    rewrite ^/user/([a-zA-Z0-9_-]+)$ /profile.php?user=$1 last;
}
```

#### 旧网站迁移

```nginx
server {
    listen 80;
    server_name example.com;
    
    # 旧文章链接迁移
    rewrite ^/blog/2019/(.*)$ /archive/2019/$1 permanent;
    rewrite ^/blog/2020/(.*)$ /archive/2020/$1 permanent;
    
    # 产品页面迁移
    rewrite ^/products/item-(\d+).html$ /product/$1 permanent;
    
    # 整个目录迁移
    rewrite ^/old-site/(.*)$ /new-site/$1 permanent;
}
```

#### 伪静态（SEO 优化）

```nginx
server {
    listen 80;
    server_name shop.example.com;
    
    # 商品详情页
    rewrite ^/item/(\d+).html$ /item.php?id=$1 last;
    
    # 商品分类页
    rewrite ^/list/(\d+)-(\d+).html$ /list.php?cat=$1&page=$2 last;
    
    # 搜索页
    rewrite ^/search/(.*).html$ /search.php?keyword=$1 last;
}
```

### Return 指令

```nginx
server {
    listen 80;
    
    # 简单重定向（推荐用于简单场景）
    location /old-page {
        return 301 /new-page;
    }
    
    # 返回特定状态码
    location /forbidden {
        return 403;
    }
    
    # 返回自定义内容
    location /api/health {
        return 200 '{"status":"ok"}';
        add_header Content-Type application/json;
    }
    
    # 条件返回
    if ($http_user_agent ~* "bot") {
        return 403;
    }
}
```

### If 条件判断

```nginx
server {
    listen 80;
    
    # 基于 User-Agent
    if ($http_user_agent ~* "mobile|android|iphone|ipad") {
        rewrite ^/$ /mobile/ redirect;
    }
    
    # 基于请求方法
    if ($request_method !~ ^(GET|POST|HEAD)$) {
        return 405;
    }
    
    # 基于来源
    if ($http_referer ~* "spam-site.com") {
        return 403;
    }
    
    # 基于 Cookie
    if ($http_cookie ~* "debug=1") {
        add_header X-Debug "enabled";
    }
}
```

**注意**：在 location 中使用 if 要小心，某些情况下会有意外行为。

---

## 访问控制

### IP 访问控制

```nginx
server {
    listen 80;
    
    location /admin/ {
        # 允许特定 IP
        allow 192.168.1.0/24;
        allow 10.0.0.0/8;
        allow 127.0.0.1;
        
        # 拒绝其他所有
        deny all;
        
        # 代理到后端
        proxy_pass http://backend;
    }
    
    # 拒绝特定 IP
    location /api/ {
        deny 192.168.1.100;
        deny 10.0.0.50;
        allow all;
        
        proxy_pass http://api_backend;
    }
}
```

### 基本认证（Basic Auth）

```nginx
server {
    listen 80;
    
    location /admin/ {
        auth_basic "Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
        
        proxy_pass http://backend;
    }
}
```

创建密码文件：

```bash
# 安装 apache2-utils（Debian/Ubuntu）
sudo apt install apache2-utils

# 创建密码文件
sudo htpasswd -c /etc/nginx/.htpasswd username

# 添加更多用户
sudo htpasswd /etc/nginx/.htpasswd anotheruser
```

### 基于 GeoIP 的访问控制

```nginx
http {
    # 加载 GeoIP 模块
    geoip_country /usr/share/GeoIP/GeoIP.dat;
    geoip_city /usr/share/GeoIP/GeoLiteCity.dat;
    
    # 定义允许的国家
    map $geoip_country_code $allowed_country {
        default no;
        CN yes;
        US yes;
        JP yes;
    }
    
    server {
        listen 80;
        
        location / {
            if ($allowed_country = no) {
                return 403;
            }
            
            proxy_pass http://backend;
        }
    }
}
```

---

## 限流配置

### 请求限流（Rate Limiting）

```nginx
http {
    # 定义限流区域
    # $binary_remote_addr：客户端 IP
    # zone=名称:内存大小
    # rate=速率（r/s 每秒请求数，r/m 每分钟请求数）
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    server {
        listen 80;
        
        # 通用限流
        location / {
            limit_req zone=general burst=20 nodelay;
            proxy_pass http://backend;
        }
        
        # API 限流（更严格）
        location /api/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://api_backend;
        }
        
        # 登录接口（最严格）
        location /login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://auth_backend;
        }
    }
}
```

### 连接数限制

```nginx
http {
    # 定义连接数限制区域
    limit_conn_zone $binary_remote_addr zone=addr:10m;
    limit_conn_zone $server_name zone=servers:10m;
    
    server {
        listen 80;
        
        location / {
            # 单 IP 并发连接限制
            limit_conn addr 10;
            
            # 虚拟主机总连接限制
            limit_conn servers 1000;
            
            proxy_pass http://backend;
        }
        
        # 下载限速
        location /downloads/ {
            limit_conn addr 2;
            limit_rate 500k;
            
            alias /var/www/downloads/;
        }
    }
}
```

### 限流参数说明

| 参数 | 说明 |
|------|------|
| `burst` | 桶容量，允许突发请求数 |
| `nodelay` | 不延迟处理突发请求 |
| `delay` | 延迟处理超出速率的请求 |

### 自定义限流响应

```nginx
http {
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    
    server {
        listen 80;
        
        location / {
            limit_req zone=general burst=20 nodelay;
            
            # 自定义 503 响应
            limit_req_status 429;  # Too Many Requests
            
            proxy_pass http://backend;
        }
        
        # 自定义错误页面
        error_page 429 /rate_limit.html;
        location = /rate_limit.html {
            internal;
            return 429 '{"error":"Rate limit exceeded","retry_after":60}';
            add_header Content-Type application/json;
            add_header Retry-After 60;
        }
    }
}
```

---

## 缓存配置

### 代理缓存

```nginx
http {
    # 代理缓存路径配置
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
            
            # 缓存有效期
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            
            # 缓存使用策略（错误时也使用过期缓存）
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            
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

### 缓存状态

| 状态 | 说明 |
|------|------|
| `MISS` | 未命中缓存，从后端获取 |
| `HIT` | 命中缓存 |
| `EXPIRED` | 缓存过期，从后端获取 |
| `UPDATING` | 缓存过期，但返回旧内容（后台更新） |
| `STALE` | 命中过期缓存（后端出错时） |
| `BYPASS` | 显式绕过缓存 |

### FastCGI 缓存（PHP 等）

```nginx
http {
    fastcgi_cache_path /var/cache/nginx/fastcgi levels=1:2 
                       keys_zone=php_cache:100m inactive=60m max_size=1g;
    
    server {
        listen 80;
        
        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
            fastcgi_index index.php;
            include fastcgi_params;
            
            # FastCGI 缓存
            fastcgi_cache php_cache;
            fastcgi_cache_valid 200 302 10m;
            fastcgi_cache_valid 404 1m;
            fastcgi_cache_key "$scheme$request_method$host$request_uri";
            
            # 缓存条件（不缓存登录用户）
            fastcgi_cache_bypass $cookie_session;
            fastcgi_no_cache $cookie_session;
            
            add_header X-FastCGI-Cache $upstream_cache_status;
        }
    }
}
```

---

## 性能优化

### Gzip 压缩

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
        application/rss+xml
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/svg+xml
        image/x-icon
        text/css
        text/plain
        text/x-component;
    
    # 对代理请求也启用压缩
    gzip_proxied any;
    
    # 添加 Vary 头
    gzip_vary on;
    
    # 禁用对 IE6 的压缩
    gzip_disable "msie6";
}
```

### 连接优化

```nginx
http {
    # 长连接优化
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # TCP 优化
    tcp_nopush on;
    tcp_nodelay on;
    
    # 高效文件传输
    sendfile on;
    
    # 文件描述符限制
    worker_rlimit_nofile 65535;
    
    events {
        worker_connections 4096;
        use epoll;
        multi_accept on;
    }
}
```

### 文件缓存

```nginx
http {
    # 打开文件缓存
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

### 上游连接优化

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    
    # 保持连接
    keepalive 32;
    keepalive_timeout 30s;
    keepalive_requests 1000;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

---

## 安全配置

### 安全响应头

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
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # 引用策略
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 权限策略
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
```

### DDoS 防护

```nginx
http {
    # 定义限流区域
    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
    server {
        listen 80;
        
        # 全局限流
        limit_req zone=req_limit burst=20 nodelay;
        limit_conn conn_limit 10;
        
        # 大请求体限制
        client_max_body_size 10m;
        
        # 请求头限制
        client_header_buffer_size 4k;
        large_client_header_buffers 4 8k;
        
        location / {
            proxy_pass http://backend;
        }
    }
}
```

### 隐藏敏感信息

```nginx
http {
    # 隐藏版本号
    server_tokens off;
    
    server {
        listen 80;
        
        # 禁止访问敏感文件
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }
        
        location ~* \.(log|git|svn|env|ini|conf|sql|bak|backup)$ {
            deny all;
            access_log off;
            log_not_found off;
        }
        
        # 禁止访问版本控制目录
        location ~* /\.(svn|git|hg|bzr|cvs)/ {
            deny all;
            access_log off;
            log_not_found off;
        }
    }
}
```

---

## 日志定制

### 自定义日志格式

```nginx
http {
    # 详细日志格式
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time '
                        '$ssl_protocol $ssl_cipher';
    
    # JSON 日志格式
    log_format json '{"time":"$time_iso8601",'
                     '"remote_addr":"$remote_addr",'
                     '"request":"$request",'
                     '"status":$status,'
                     '"body_bytes_sent":$body_bytes_sent,'
                     '"request_time":$request_time,'
                     '"upstream_response_time":$upstream_response_time}';
    
    server {
        listen 80;
        
        access_log /var/log/nginx/access.log detailed;
        # access_log /var/log/nginx/access.log json;
    }
}
```

### 条件日志

```nginx
server {
    listen 80;
    
    # 不记录静态资源访问日志
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        access_log off;
        expires 30d;
    }
    
    # 不记录健康检查日志
    location /health {
        access_log off;
        return 200 "ok";
    }
}
```

### 日志分割

```nginx
http {
    # 按日期分割日志
    map $time_iso8601 $log_date {
        ~^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) ${year}-${month}-${day};
        default 'nodate';
    }
    
    server {
        listen 80;
        
        access_log /var/log/nginx/access-$log_date.log;
        error_log /var/log/nginx/error.log;
    }
}
```

---

> 上一篇：[NGINX HTTPS/SSL 配置](./nginx-https.md) | 下一篇：[NGINX 运维指南](./nginx运维.md)
