---
title: NGINX 虚拟主机配置
tags:
  - 技术
  - Web服务器
  - NGINX
  - 虚拟主机
created: 2026-04-15
---

# NGINX 虚拟主机配置

> NGINX 虚拟主机配置详解：基于域名、端口、IP 的多种配置方式

---

## 目录

- [虚拟主机概述](#虚拟主机概述)
- [基于域名的虚拟主机](#基于域名的虚拟主机)
- [基于端口的虚拟主机](#基于端口的虚拟主机)
- [基于 IP 的虚拟主机](#基于-ip-的虚拟主机)
- [默认服务器配置](#默认服务器配置)
- [Server 块匹配规则](#server-块匹配规则)
- [虚拟主机管理实践](#虚拟主机管理实践)

---

## 虚拟主机概述

### 什么是虚拟主机

虚拟主机（Virtual Host）是指在一台物理服务器上运行多个网站，每个网站都有独立的域名、文档根目录和配置。NGINX 通过虚拟主机技术，可以高效地托管多个网站。

### 虚拟主机类型

| 类型 | 说明 | 使用场景 |
|------|------|---------|
| **基于域名** | 通过不同的 server_name 区分 | 最常见，多个域名指向同一 IP |
| **基于端口** | 通过不同的 listen 端口区分 | 管理后台、API 服务等 |
| **基于 IP** | 通过不同的 IP 地址区分 | 服务器有多个网卡或 IP |

### 虚拟主机配置结构

```nginx
http {
    # 第一个虚拟主机
    server {
        listen 80;
        server_name example.com;
        root /var/www/example;
    }
    
    # 第二个虚拟主机
    server {
        listen 80;
        server_name blog.example.com;
        root /var/www/blog;
    }
}
```

---

## 基于域名的虚拟主机

### 基本配置

```nginx
# 站点一：主站
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html index.htm;
    
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 站点二：博客
server {
    listen 80;
    server_name blog.example.com;
    
    root /var/www/blog;
    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    # PHP 处理
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}

# 站点三：API 服务
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### server_name 匹配规则

```nginx
# 精确匹配
server_name example.com;

# 多个域名
server_name example.com www.example.com;

# 通配符匹配（前缀）
server_name *.example.com;

# 通配符匹配（后缀）
server_name www.example.*;

# 正则表达式匹配
server_name ~^(?<user>\w+)\.example\.com$;

# 捕获组使用
server_name ~^(www\.)?(?<domain>.+)$;

# 空主机头（默认匹配）
server_name "";

# 匹配所有
server_name _;
```

### 匹配优先级

1. **精确匹配**：`example.com`
2. **最长前缀通配符**：`*.example.com`
3. **最长后缀通配符**：`www.example.*`
4. **第一个正则表达式匹配**（按配置顺序）
5. **default_server**

### 泛域名配置

```nginx
# 泛域名解析到不同目录
server {
    listen 80;
    server_name ~^(?<subdomain>.+)\.example\.com$;
    
    # 根据子域名设置根目录
    root /var/www/sites/$subdomain;
    
    # 或反向代理到不同端口
    location / {
        proxy_pass http://localhost:$subdomain;
    }
}

# 示例：
# user1.example.com -> /var/www/sites/user1
# user2.example.com -> /var/www/sites/user2
```

---

## 基于端口的虚拟主机

### 基本配置

```nginx
# HTTP 服务（默认端口）
server {
    listen 80;
    server_name localhost;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 管理后台（8080 端口）
server {
    listen 8080;
    server_name localhost;
    
    root /var/www/admin;
    index index.html;
    
    # IP 访问控制
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    allow 127.0.0.1;
    deny all;
    
    # 密码认证
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}

# API 服务（3000 端口）
server {
    listen 3000;
    server_name localhost;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 开发环境（8081 端口）
server {
    listen 8081;
    server_name localhost;
    
    root /var/www/dev;
    index index.html;
    
    # 禁用缓存
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### 端口配置选项

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

# 监听多个端口
listen 80;
listen 8080;
listen 443 ssl;

# 监听 UDP（stream 模块）
listen 53 udp;

# 监听 TCP + UDP
listen 53;
listen 53 udp;

# backlog 设置
listen 80 backlog=511;
```

---

## 基于 IP 的虚拟主机

### 多 IP 配置

```nginx
# 第一个 IP 地址
server {
    listen 192.168.1.10:80;
    server_name example.com;
    
    root /var/www/site1;
}

# 第二个 IP 地址
server {
    listen 192.168.1.11:80;
    server_name blog.example.com;
    
    root /var/www/site2;
}

# 第三个 IP 地址（HTTPS）
server {
    listen 192.168.1.12:443 ssl;
    server_name shop.example.com;
    
    ssl_certificate /etc/nginx/ssl/shop.crt;
    ssl_certificate_key /etc/nginx/ssl/shop.key;
    
    root /var/www/shop;
}
```

### 应用场景

- 服务器有多个公网 IP
- 需要为不同网站绑定不同 IP
- SSL 证书需要独立 IP（旧版浏览器）
- 网络隔离需求

---

## 默认服务器配置

### 捕获未匹配的请求

```nginx
# 默认服务器（捕获所有未匹配的请求）
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # 返回 444 无响应（直接断开连接）
    return 444;
}

# 或返回 404
server {
    listen 80 default_server;
    server_name _;
    
    return 404;
}

# 或重定向到指定页面
server {
    listen 80 default_server;
    server_name _;
    
    return 301 https://www.example.com$request_uri;
}

# 显示提示信息
server {
    listen 80 default_server;
    server_name _;
    
    default_type text/plain;
    return 200 "Unknown virtual host\n";
}
```

### 阻止 IP 直接访问

```nginx
# 阻止通过 IP 直接访问
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # 返回 444 或直接重定向
    return 444;
    # 或 return 301 https://www.example.com$request_uri;
}

# 正常虚拟主机配置
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example;
}
```

---

## Server 块匹配规则

### 匹配流程

```
1. 根据 IP:端口 找到匹配的 listen 指令
2. 在这些 server 块中查找匹配的 server_name
3. 如果没有匹配的 server_name，使用第一个 server 块
4. 如果有 default_server 标记，使用 default_server
```

### 匹配示例

```nginx
# 配置顺序
server {
    listen 80;
    server_name example.com;
    # A
}

server {
    listen 80 default_server;
    server_name _;
    # B（默认）
}

server {
    listen 80;
    server_name *.example.com;
    # C
}

# 请求匹配：
# example.com -> A
# www.example.com -> C
# other.com -> B（default_server）
```

### 复杂匹配场景

```nginx
# 精确匹配优先
server {
    listen 80;
    server_name example.com;  # 精确匹配
    # 配置 A
}

# 通配符匹配
server {
    listen 80;
    server_name *.example.com;  # 前缀通配
    # 配置 B
}

server {
    listen 80;
    server_name www.example.*;  # 后缀通配
    # 配置 C
}

# 正则匹配
server {
    listen 80;
    server_name ~^\w+\.example\.com$;  # 正则
    # 配置 D
}

# 默认
server {
    listen 80 default_server;
    server_name _;
    # 配置 E
}
```

---

## 虚拟主机管理实践

### 目录结构组织

```
/etc/nginx/
├── nginx.conf              # 主配置
├── conf.d/                 # 通用配置
│   ├── gzip.conf
│   ├── ssl.conf
│   └── proxy.conf
├── sites-available/        # 可用站点
│   ├── example.com
│   ├── blog.example.com
│   ├── api.example.com
│   └── default
└── sites-enabled/          # 启用站点（软链接）
    ├── example.com -> ../sites-available/example.com
    └── api.example.com -> ../sites-available/api.example.com
```

### 启用/禁用站点（Debian/Ubuntu）

```bash
# 启用站点（创建软链接）
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# 禁用站点（删除软链接）
sudo rm /etc/nginx/sites-enabled/example.com

# 测试配置
sudo nginx -t

# 重载配置
sudo nginx -s reload
```

### 完整的虚拟主机配置模板

```nginx
# /etc/nginx/sites-available/example.com

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    # Let's Encrypt 验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    
    # 根目录
    root /var/www/example.com;
    index index.html index.htm index.php;
    
    # 日志
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 主 location
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### 虚拟主机自动化脚本

```bash
#!/bin/bash
# create-vhost.sh - 创建虚拟主机

DOMAIN=$1
WEB_ROOT="/var/www/$DOMAIN"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

# 检查参数
if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain>"
    exit 1
fi

# 创建目录
sudo mkdir -p "$WEB_ROOT"
sudo chown -R $USER:$USER "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

# 创建测试页面
echo "<h1>Welcome to $DOMAIN</h1>" > "$WEB_ROOT/index.html"

# 创建配置文件
cat | sudo tee "$NGINX_AVAILABLE/$DOMAIN" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $WEB_ROOT;
    index index.html;
    
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

# 启用站点
sudo ln -s "$NGINX_AVAILABLE/$DOMAIN" "$NGINX_ENABLED/"

# 测试并重载
sudo nginx -t && sudo nginx -s reload

echo "Virtual host $DOMAIN created successfully!"
echo "Web root: $WEB_ROOT"
```

---

## 常见问题

### Q1: server_name 匹配不生效

**原因：** 请求被其他 server 块拦截

**解决：**
```nginx
# 确保 listen 指令包含 default_server
server {
    listen 80;
    server_name example.com;
    # ...
}

# 添加默认服务器捕获未匹配请求
server {
    listen 80 default_server;
    server_name _;
    return 444;
}
```

### Q2: 如何测试 server_name 匹配

```bash
# 使用 curl 指定 Host 头
curl -H "Host: example.com" http://localhost

# 使用不同的 Host 头测试
curl -H "Host: blog.example.com" http://localhost
```

### Q3: 通配符证书配置

```nginx
server {
    listen 443 ssl;
    server_name *.example.com;
    
    # 通配符证书
    ssl_certificate /etc/nginx/ssl/wildcard.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/wildcard.example.com.key;
}
```

---

> 上一篇：[NGINX 基础](./nginx基础.md) | 下一篇：[NGINX 反向代理与负载均衡](./nginx反向代理与负载均衡.md)
