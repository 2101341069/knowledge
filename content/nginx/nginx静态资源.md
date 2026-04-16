---
title: NGINX 静态资源服务
tags:
  - 技术
  - Web服务器
  - NGINX
  - 静态资源
created: 2026-04-15
---

# NGINX 静态资源服务

> NGINX 静态文件服务配置：缓存、防盗链、下载限速

---

## 目录

- [静态资源概述](#静态资源概述)
- [基础静态文件服务](#基础静态文件服务)
- [文件类型处理](#文件类型处理)
- [浏览器缓存配置](#浏览器缓存配置)
- [防盗链配置](#防盗链配置)
- [下载限速](#下载限速)
- [文件压缩](#文件压缩)
- [目录列表](#目录列表)

---

## 静态资源概述

### 什么是静态资源

静态资源是指不需要服务器动态生成的文件，包括：
- HTML/CSS/JavaScript 文件
- 图片（JPG、PNG、GIF、SVG、WebP）
- 字体文件（WOFF、WOFF2、TTF、EOT）
- 视频/音频文件
- 文档（PDF、DOC）

### NGINX 处理静态资源的优势

| 优势 | 说明 |
|------|------|
| **零拷贝** | sendfile 系统调用，数据不经过用户空间 |
| **高并发** | 单 worker 可处理数千静态请求 |
| **低内存** | 静态文件不占用应用服务器内存 |
| **缓存友好** | 完善的缓存控制机制 |

### 静态资源处理流程

```
Client Request
      ↓
NGINX Location 匹配
      ↓
检查文件存在性
      ↓
检查缓存有效性（304）
      ↓
sendfile 发送文件
      ↓
Client
```

---

## 基础静态文件服务

### 最简单的静态服务器

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    # 根目录
    root /var/www/static;
    
    # 默认索引文件
    index index.html;
    
    # 字符编码
    charset utf-8;
}
```

### 完整的静态资源配置

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    # 网站根目录
    root /var/www/static;
    
    # 默认索引文件
    index index.html index.htm;
    
    # 字符编码
    charset utf-8;
    
    # 自动索引（目录浏览）
    autoindex on;
    autoindex_exact_size off;    # 人性化文件大小
    autoindex_localtime on;      # 本地时间
    autoindex_format html;       # 格式：html/xml/json/jsonp
    
    # 日志配置
    access_log /var/log/nginx/static.access.log;
    error_log /var/log/nginx/static.error.log;
    
    # 禁用访问日志（高流量时）
    # access_log off;
    
    # 处理所有请求
    location / {
        # 尝试匹配文件，找不到返回 404
        try_files $uri $uri/ =404;
    }
    
    # 404 错误页面
    error_page 404 /404.html;
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 多目录静态资源服务

```nginx
server {
    listen 80;
    server_name assets.example.com;
    
    # 图片资源
    location /images/ {
        alias /var/www/assets/images/;  # 注意尾部斜杠
        expires 30d;
        access_log off;
    }
    
    # CSS/JS 资源
    location /assets/ {
        alias /var/www/assets/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 上传文件
    location /uploads/ {
        alias /var/www/uploads/;
        expires 7d;
        
        # 限制访问速度
        limit_rate 500k;
    }
    
    # 文档下载
    location /docs/ {
        alias /var/www/documents/;
        
        # 强制下载
        location ~* \.(pdf|doc|docx|xls|xlsx)$ {
            add_header Content-Disposition "attachment";
        }
    }
}
```

### root vs alias 区别

```nginx
server {
    listen 80;
    
    # root 指令：root + location
    location /images/ {
        root /var/www/;
        # 请求 /images/logo.png -> /var/www/images/logo.png
    }
    
    # alias 指令：alias 替换 location
    location /static/ {
        alias /var/www/assets/;
        # 请求 /static/logo.png -> /var/www/assets/logo.png
    }
}
```

| 指令 | 路径拼接方式 | 适用场景 |
|------|-------------|---------|
| `root` | root + location + uri | 目录结构与 URL 一致 |
| `alias` | alias + uri（去掉 location） | URL 与目录结构不同 |

**注意**：使用 `alias` 时，location 末尾有斜杠，alias 末尾也必须有斜杠。

---

## 文件类型处理

### MIME 类型配置

```nginx
http {
    # 包含 MIME 类型定义
    include /etc/nginx/mime.types;
    
    # 默认 MIME 类型
    default_type application/octet-stream;
    
    server {
        listen 80;
        
        # 为特定文件类型设置 MIME
        location ~* \.css$ {
            add_header Content-Type text/css;
        }
        
        location ~* \.js$ {
            add_header Content-Type application/javascript;
        }
    }
}
```

### 自定义 MIME 类型

```nginx
http {
    # 在 mime.types 文件中添加或修改
    types {
        text/html                             html htm shtml;
        text/css                              css;
        application/javascript                js;
        application/json                      json;
        image/jpeg                            jpeg jpg;
        image/png                             png;
        image/gif                             gif;
        image/svg+xml                         svg svgz;
        application/pdf                       pdf;
        font/woff                             woff;
        font/woff2                            woff2;
        
        # 自定义类型
        application/vnd.apple.mpegurl         m3u8;
        video/mp2t                            ts;
    }
}
```

### 按文件类型优化

```nginx
server {
    listen 80;
    server_name static.example.com;
    root /var/www/static;
    
    # 图片文件优化
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        
        # WebP 支持（如果浏览器支持）
        # 需要 ngx_http_image_filter_module
        # image_filter_webp_quality 80;
    }
    
    # CSS/JS 文件优化
    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        
        # 启用 Gzip
        gzip on;
        gzip_types text/css application/javascript;
    }
    
    # 字体文件
    location ~* \.(woff|woff2|ttf|eot|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";  # 允许跨域
        access_log off;
    }
    
    # 视频文件
    location ~* \.(mp4|webm|ogg|mp3|wav|flac)$ {
        expires 30d;
        add_header Cache-Control "public";
        
        # 支持视频流式传输（Range 请求）
        # NGINX 默认支持，无需额外配置
    }
    
    # 文档文件
    location ~* \.(pdf|doc|docx|xls|xlsx|ppt|pptx)$ {
        expires 7d;
        add_header Cache-Control "public";
        
        # 强制下载
        add_header Content-Disposition "attachment";
    }
}
```

---

## 浏览器缓存配置

### 缓存控制头

```nginx
server {
    listen 80;
    root /var/www/static;
    
    # 长期缓存（带哈希的资源）
    location ~* \.[0-9a-f]{8,}\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 中期缓存（静态资源）
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }
    
    # 短期缓存（HTML）
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # 不缓存（动态内容）
    location ~* \.(php|jsp|asp)$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }
}
```

### Cache-Control 指令说明

| 指令 | 说明 |
|------|------|
| `public` | 允许任何缓存 |
| `private` | 仅浏览器缓存 |
| `no-cache` | 必须重新验证 |
| `no-store` | 不缓存 |
| `max-age` | 缓存有效期（秒） |
| `immutable` | 内容不会改变 |
| `must-revalidate` | 过期后必须验证 |

### ETag 和 Last-Modified

```nginx
server {
    listen 80;
    root /var/www/static;
    
    # ETag 支持（默认开启）
    etag on;
    
    # 条件请求处理
    location / {
        # 如果文件未修改，返回 304
        if_modified_since exact;
    }
}
```

---

## 防盗链配置

### 基础防盗链

```nginx
server {
    listen 80;
    server_name static.example.com;
    root /var/www/static;
    
    # 图片防盗链
    location ~* \.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|webp)$ {
        # 验证来源
        valid_referers none blocked server_names *.example.com example.*;
        
        if ($invalid_referer) {
            # 返回 403
            return 403;
            
            # 或返回防盗链图片
            # rewrite ^/ /images/forbidden.png break;
        }
        
        expires 30d;
        access_log off;
    }
}
```

### 高级防盗链配置

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    # 定义允许的来源
    map $http_referer $allowed_referer {
        default 0;
        "~^https?://[^/]*example\.com" 1;
        "~^https?://[^/]*partner\.com" 1;
        "" 1;  # 允许空 referer
    }
    
    location ~* \.(jpg|jpeg|png|gif|webp)$ {
        # 检查 referer
        if ($allowed_referer = 0) {
            return 403;
        }
        
        root /var/www/images;
        expires 30d;
        access_log off;
    }
}
```

### 带签名的防盗链（安全下载）

```nginx
server {
    listen 80;
    server_name download.example.com;
    
    location /secure/ {
        # 使用 secure_link 模块验证签名
        secure_link $arg_md5,$arg_expires;
        secure_link_md5 "$secure_link_expires$uri$remote_addr secret_key";
        
        if ($secure_link = "") {
            return 403;
        }
        
        if ($secure_link = "0") {
            return 410;  # 链接过期
        }
        
        alias /var/www/secure_files/;
    }
}
```

---

## 下载限速

### 基础限速

```nginx
server {
    listen 80;
    server_name download.example.com;
    
    location /downloads/ {
        alias /var/www/downloads/;
        
        # 限速 200KB/s
        limit_rate 200k;
        
        # 前 10MB 不限速
        limit_rate_after 10m;
        
        # 单 IP 并发连接限制
        limit_conn addr 2;
    }
}
```

### 动态限速

```nginx
# 定义限速区域
limit_req_zone $binary_remote_addr zone=download:10m rate=1r/s;

server {
    listen 80;
    server_name download.example.com;
    
    location /downloads/ {
        alias /var/www/downloads/;
        
        # 应用限流
        limit_req zone=download burst=5 nodelay;
        
        # 根据文件大小动态限速
        location ~* \.(zip|rar|7z|iso)$ {
            limit_rate 500k;  # 大文件限速
        }
        
        location ~* \.(pdf|doc|docx)$ {
            limit_rate 1000k;  # 文档不限速
        }
    }
}
```

### 会员限速（不同用户不同速度）

```nginx
map $cookie_user_type $download_limit {
    default 100k;      # 普通用户：100KB/s
    "vip" 1000k;       # VIP 用户：1MB/s
    "svip" 0;          # SVIP：不限速
}

server {
    listen 80;
    
    location /downloads/ {
        alias /var/www/downloads/;
        limit_rate $download_limit;
    }
}
```

---

## 文件压缩

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

### Brotli 压缩（需要 ngx_brotli 模块）

```nginx
http {
    # 启用 Brotli
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/javascript
        application/json
        image/svg+xml;
}
```

### 压缩效果对比

| 文件类型 | 原始大小 | Gzip 后 | Brotli 后 |
|---------|---------|---------|----------|
| HTML | 100KB | 25KB | 20KB |
| CSS | 100KB | 20KB | 17KB |
| JavaScript | 100KB | 30KB | 25KB |
| JSON | 100KB | 25KB | 20KB |

---

## 目录列表

### 启用目录浏览

```nginx
server {
    listen 80;
    server_name files.example.com;
    root /var/www/files;
    
    # 启用自动索引
    autoindex on;
    
    # 文件大小显示格式
    autoindex_exact_size off;    # on=字节，off=人性化（KB/MB）
    
    # 时间格式
    autoindex_localtime on;      # on=本地时间，off=GMT
    
    # 输出格式
    autoindex_format html;       # html/xml/json/jsonp
    
    # 美化目录列表（需要第三方模块）
    # autoindex_style /path/to/style.css;
}
```

### 安全的目录列表

```nginx
server {
    listen 80;
    server_name files.example.com;
    
    location /public/ {
        alias /var/www/public/;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
    
    # 禁止访问敏感目录
    location /public/private/ {
        deny all;
        return 403;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 密码保护
    location /public/confidential/ {
        alias /var/www/confidential/;
        autoindex on;
        
        auth_basic "Restricted Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

---

## 完整配置示例

### 生产环境静态资源服务器

```nginx
# 定义缓存区域
proxy_cache_path /var/cache/nginx/static levels=1:2 
                 keys_zone=static_cache:100m 
                 max_size=10g inactive=60m;

server {
    listen 80;
    listen [::]:80;
    server_name static.example.com;
    
    # 根目录
    root /var/www/static;
    
    # 字符编码
    charset utf-8;
    
    # 日志
    access_log /var/log/nginx/static.access.log;
    error_log /var/log/nginx/static.error.log warn;
    
    # Gzip
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/javascript application/json 
               image/svg+xml font/woff font/woff2;
    
    # 带哈希的长期缓存资源（1年）
    location ~* \.[0-9a-f]{8,}\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
    }
    
    # CSS/JS（1个月）
    location ~* \.(css|js)$ {
        expires 30d;
        add_header Cache-Control "public";
        add_header Vary "Accept-Encoding";
        access_log off;
    }
    
    # 图片（30天）
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
        add_header Vary "Accept-Encoding";
        access_log off;
        
        # 防盗链
        valid_referers none blocked *.example.com example.com;
        if ($invalid_referer) {
            return 403;
        }
    }
    
    # 字体（1年）
    location ~* \.(woff|woff2|ttf|eot|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }
    
    # 文档下载
    location /downloads/ {
        alias /var/www/downloads/;
        
        # 限速
        limit_rate 500k;
        limit_rate_after 10m;
        
        # 强制下载
        add_header Content-Disposition "attachment";
    }
    
    # 禁止访问敏感文件
    location ~* \.(log|git|svn|env|ini|conf)$ {
        deny all;
        return 404;
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 主 location
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

> 上一篇：[NGINX 反向代理与负载均衡](./nginx反向代理与负载均衡.md) | 下一篇：[NGINX HTTPS/SSL 配置](./nginx-https.md)
