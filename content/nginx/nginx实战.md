---
title: NGINX 实战案例
tags:
  - 技术
  - Web服务器
  - NGINX
  - 实战
  - 案例
created: 2026-04-15
---

# NGINX 实战案例

> NGINX 实战配置：完整案例、常见问题、附录速查

---

## 目录

- [实战案例](#实战案例)
- [常见问题](#常见问题)
- [附录](#附录)

---

## 实战案例

### 完整的 Web 应用配置

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

### 前端 SPA 配置

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

## 常见问题

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

| 用途 | 正则表达式 |
|------|-----------|
| 图片文件 | `\.(jpg\|jpeg\|png\|gif\|ico)$` |
| 静态资源 | `\.(css\|js\|woff\|woff2\|ttf\|eot\|svg)$` |
| API 版本 | `^/api/v(\d+)/` |

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

> **版本**: 1.0  
> **更新日期**: 2026年  
> **建议 NGINX 版本**: 1.20+  

*本文档持续更新，如有疑问请参考 [NGINX 官方文档](https://nginx.org/en/docs/)*

---

> 上一篇：[NGINX 配置详解](./nginx配置详解.md)
