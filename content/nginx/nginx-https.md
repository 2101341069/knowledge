---
title: NGINX HTTPS/SSL 配置
tags:
  - 技术
  - Web服务器
  - NGINX
  - HTTPS
  - SSL
created: 2026-04-15
---

# NGINX HTTPS/SSL 配置

> NGINX HTTPS 配置指南：SSL 证书、安全优化、Let's Encrypt

---

## 目录

- [SSL/TLS 基础](#ssltls-基础)
- [基础 HTTPS 配置](#基础-https-配置)
- [SSL 安全优化](#ssl-安全优化)
- [HTTP/2 配置](#http2-配置)
- [Let's Encrypt 自动配置](#lets-encrypt-自动配置)
- [双向认证](#双向认证)
- [常见问题](#常见问题)

---

## SSL/TLS 基础

### 什么是 SSL/TLS

SSL（Secure Sockets Layer）和 TLS（Transport Layer Security）是用于加密网络通信的协议。TLS 是 SSL 的继任者，目前广泛使用的是 TLS 1.2 和 TLS 1.3。

### 为什么需要 HTTPS

| 优势 | 说明 |
|------|------|
| **数据加密** | 防止中间人窃听 |
| **身份验证** | 确认服务器身份 |
| **数据完整性** | 防止数据篡改 |
| **SEO 优化** | 搜索引擎优先排名 |
| **浏览器信任** | 避免"不安全"警告 |

### SSL 证书类型

| 类型 | 验证级别 | 适用场景 | 价格 |
|------|---------|---------|------|
| **DV** | 域名验证 | 个人网站、博客 | 免费-低 |
| **OV** | 组织验证 | 企业官网 | 中 |
| **EV** | 扩展验证 | 金融、电商 | 高 |
| **Wildcard** | 域名验证 | 泛域名 | 中 |
| **SAN** | 域名验证 | 多域名 | 中 |

### TLS 版本对比

| 版本 | 安全性 | 浏览器支持 | 建议 |
|------|--------|-----------|------|
| SSL 2.0/3.0 | 不安全 | 已禁用 | 禁用 |
| TLS 1.0/1.1 | 不安全 | 逐步禁用 | 禁用 |
| TLS 1.2 | 安全 | 广泛支持 | 启用 |
| TLS 1.3 | 最安全 | 现代浏览器 | 优先 |

---

## 基础 HTTPS 配置

### 最简单的 HTTPS 配置

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    # SSL 证书
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
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

### 完整的 HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # 网站根目录
    root /var/www/example.com;
    index index.html;
    
    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # 证书链（用于 OCSP）
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
    
    # SSL 协议版本
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 加密套件
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
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
    
    # HSTS（HTTP Strict Transport Security）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 日志
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}

# HTTP 重定向
server {
    listen 80;
    server_name example.com www.example.com;
    
    # Let's Encrypt 验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
```

### SSL 指令详解

| 指令 | 说明 | 示例 |
|------|------|------|
| `ssl_certificate` | 服务器证书路径 | `/etc/nginx/ssl/cert.pem` |
| `ssl_certificate_key` | 私钥路径 | `/etc/nginx/ssl/key.pem` |
| `ssl_protocols` | 启用的协议版本 | `TLSv1.2 TLSv1.3` |
| `ssl_ciphers` | 加密套件 | 见上方配置 |
| `ssl_prefer_server_ciphers` | 优先使用服务器套件 | `on/off` |
| `ssl_session_cache` | 会话缓存 | `shared:SSL:10m` |
| `ssl_session_timeout` | 会话超时 | `1d` |

---

## SSL 安全优化

### 现代安全配置（A+ 评级）

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # 仅启用 TLS 1.2 和 1.3
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 现代加密套件
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 会话票证
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/chain.pem;
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # 其他安全头
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 兼容性配置（支持旧浏览器）

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 兼容旧浏览器
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA;
    ssl_prefer_server_ciphers on;
    
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
}
```

### 证书格式转换

```bash
# PEM 转 DER
openssl x509 -in cert.pem -out cert.der -outform DER

# DER 转 PEM
openssl x509 -in cert.der -inform DER -out cert.pem

# PKCS#12 转 PEM
openssl pkcs12 -in cert.p12 -out cert.pem -nodes

# 合并证书链
cat server.crt intermediate.crt root.crt > fullchain.pem

# 生成自签名证书（测试用）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout localhost.key -out localhost.crt \
  -subj "/CN=localhost"
```

---

## HTTP/2 配置

### 启用 HTTP/2

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # HTTP/2 特定优化
    http2_push_preload on;  # 启用服务器推送
    
    # 流设置
    http2_max_field_size 16k;
    http2_max_header_size 32k;
    http2_max_requests 1000;
}
```

### HTTP/2 优势

| 特性 | HTTP/1.1 | HTTP/2 |
|------|---------|--------|
| 多路复用 | 不支持 | 支持 |
| 头部压缩 | 不支持 | HPACK |
| 服务器推送 | 不支持 | 支持 |
| 二进制分帧 | 不支持 | 支持 |
| 流优先级 | 不支持 | 支持 |

---

## Let's Encrypt 自动配置

### 使用 Certbot

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 自动获取并配置证书
sudo certbot --nginx -d example.com -d www.example.com

# 仅获取证书（手动配置）
sudo certbot certonly --nginx -d example.com

# 测试自动续期
sudo certbot renew --dry-run
```

### 手动配置 Let's Encrypt

```nginx
# 证书申请验证
server {
    listen 80;
    server_name example.com www.example.com;
    
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
    server_name example.com www.example.com;
    
    # Let's Encrypt 证书路径
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # 包含通用 SSL 配置
    include /etc/nginx/snippets/ssl-params.conf;
    
    root /var/www/example.com;
    index index.html;
}
```

### 自动续期脚本

```bash
#!/bin/bash
# /etc/cron.daily/certbot-renew

# 续期证书
certbot renew --quiet --nginx

# 如果续期成功，重载 NGINX
if [ $? -eq 0 ]; then
    nginx -s reload
fi
```

### 多域名证书

```nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com blog.example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    include /etc/nginx/snippets/ssl-params.conf;
    
    root /var/www/example.com;
}
```

---

## 双向认证

### 客户端证书验证

```nginx
server {
    listen 443 ssl;
    server_name secure.example.com;
    
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    
    # 客户端证书 CA
    ssl_client_certificate /etc/nginx/ssl/ca.crt;
    ssl_verify_client on;
    ssl_verify_depth 2;
    
    # 可选：验证失败时返回特定错误
    error_page 495 = @clientcert_required;
    
    location / {
        # 将客户端证书信息传递给后端
        proxy_set_header X-SSL-Client-S-DN $ssl_client_s_dn;
        proxy_set_header X-SSL-Client-I-DN $ssl_client_i_dn;
        proxy_set_header X-SSL-Client-Serial $ssl_client_serial;
        proxy_set_header X-SSL-Client-Verify $ssl_client_verify;
        
        proxy_pass http://backend;
    }
    
    location @clientcert_required {
        return 403 "Client certificate required\n";
    }
}
```

### 可选的客户端证书

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;
    
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    
    ssl_client_certificate /etc/nginx/ssl/ca.crt;
    ssl_verify_client optional;  # 可选验证
    
    location / {
        # 检查客户端证书
        if ($ssl_client_verify != SUCCESS) {
            return 403;
        }
        
        proxy_pass http://backend;
    }
}
```

---

## 常见问题

### Q1: 证书链不完整

**症状**：浏览器显示证书不受信任

**解决**：
```nginx
# 确保证书包含完整链
ssl_certificate /path/to/fullchain.pem;  # 包含服务器证书 + 中间证书
# 而不是
# ssl_certificate /path/to/server_only.crt;
```

### Q2: 弱加密套件警告

**症状**：SSL 测试显示弱加密

**解决**：
```nginx
# 禁用弱加密套件
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;
```

### Q3: OCSP Stapling 失败

**症状**：SSL 测试显示 OCSP 错误

**解决**：
```nginx
# 确保配置正确
ssl_stapling on;
sssl_stapling_verify on;
ssl_trusted_certificate /path/to/chain.pem;  # 包含根证书
resolver 8.8.8.8 1.1.1.1 valid=300s;
resolver_timeout 5s;

# 首次启动后可能需要时间获取 OCSP 响应
```

### Q4: 如何测试 SSL 配置

```bash
# 使用 SSL Labs 测试
# https://www.ssllabs.com/ssltest/

# 使用 OpenSSL 测试
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3

# 检查证书信息
openssl x509 -in cert.pem -text -noout

# 检查证书链
openssl crl2pkcs7 -nocrl -certfile fullchain.pem | openssl pkcs7 -print_certs -noout

# 测试加密套件
nmap --script ssl-enum-ciphers -p 443 example.com
```

---

## 完整配置示例

### 生产环境 HTTPS 配置

```nginx
# /etc/nginx/snippets/ssl-params.conf

# SSL 协议和加密套件
ssl_protocols TLSv1.2 TLSv1.3;
sssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
sssl_prefer_server_ciphers off;

# 会话缓存
ssl_session_timeout 1d;
sssl_session_cache shared:SSL:50m;
sssl_session_tickets off;

# OCSP Stapling
ssl_stapling on;
sssl_stapling_verify on;
resolver 8.8.8.8 1.1.1.1 valid=300s;
resolver_timeout 5s;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

```nginx
# 站点配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    
    # 证书
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    
    # 包含 SSL 参数
    include /etc/nginx/snippets/ssl-params.conf;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'" always;
    
    # 网站配置
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP 重定向
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
```

---

> 上一篇：[NGINX 静态资源服务](./nginx静态资源.md) | 下一篇：[NGINX 高级特性](./nginx高级特性.md)
