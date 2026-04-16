---
title: NGINX 反向代理与负载均衡
tags:
  - 技术
  - Web服务器
  - NGINX
  - 反向代理
  - 负载均衡
created: 2026-04-15
---

# NGINX 反向代理与负载均衡

> NGINX 反向代理配置与负载均衡算法详解

---

## 目录

- [反向代理概述](#反向代理概述)
- [基础反向代理](#基础反向代理)
- [负载均衡配置](#负载均衡配置)
- [健康检查与故障转移](#健康检查与故障转移)
- [WebSocket 代理](#websocket-代理)
- [高级代理配置](#高级代理配置)
- [负载均衡算法详解](#负载均衡算法详解)

---

## 反向代理概述

### 什么是反向代理

反向代理（Reverse Proxy）是指代理服务器接收客户端请求，然后将请求转发给内部网络的服务器，并将从服务器得到的结果返回给客户端。对外表现为一个服务器，隐藏了内部的真实服务器架构。

### 反向代理 vs 正向代理

| 特性 | 反向代理 | 正向代理 |
|------|---------|---------|
| 服务对象 | 服务器 | 客户端 |
| 隐藏对象 | 内部服务器 | 客户端 |
| 典型用途 | 负载均衡、安全防护、缓存 | 翻墙、匿名访问 |
| 客户端感知 | 无感知 | 需要配置 |

### 反向代理的优势

- **负载均衡**：将请求分发到多台服务器
- **安全防护**：隐藏真实服务器 IP，提供 WAF 保护
- **SSL 终端**：集中处理 HTTPS 加密解密
- **缓存加速**：缓存静态内容减少后端压力
- **压缩优化**：统一进行 Gzip/Brotli 压缩
- **灰度发布**：支持 A/B 测试和金丝雀发布

---

## 基础反向代理

### 最简单的反向代理

```nginx
server {
    listen 80;
    server_name app.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

### 完整的反向代理配置

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
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # 代理超时设置
        proxy_connect_timeout 60s;    # 连接超时
        proxy_send_timeout 60s;       # 发送超时
        proxy_read_timeout 60s;       # 读取超时
        
        # 缓冲区配置
        proxy_buffering on;           # 启用缓冲
        proxy_buffer_size 4k;         # 缓冲区大小
        proxy_buffers 8 4k;           # 缓冲区数量和大小
        proxy_busy_buffers_size 8k;   # 忙碌缓冲区大小
        
        # 重定向处理
        proxy_redirect off;
        
        # 错误处理
        proxy_intercept_errors on;
    }
}
```

### 代理请求头详解

| 请求头 | 说明 | 示例值 |
|--------|------|--------|
| `Host` | 原始请求的主机名 | `app.example.com` |
| `X-Real-IP` | 客户端真实 IP | `192.168.1.100` |
| `X-Forwarded-For` | 客户端 IP 链 | `192.168.1.100, 10.0.0.1` |
| `X-Forwarded-Proto` | 原始协议 | `https` |
| `X-Forwarded-Host` | 原始主机头 | `app.example.com` |
| `X-Forwarded-Port` | 原始端口 | `443` |

---

## 负载均衡配置

### Upstream 基础配置

```nginx
# 定义后端服务器组
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 负载均衡算法

#### 1. 轮询（Round Robin）- 默认

```nginx
upstream backend {
    # 默认轮询，请求依次分发
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

#### 2. 加权轮询（Weighted Round Robin）

```nginx
upstream backend {
    # 权重越高，分配的请求越多
    server 192.168.1.10:8080 weight=5;  # 50%
    server 192.168.1.11:8080 weight=3;  # 30%
    server 192.168.1.12:8080 weight=2;  # 20%
}
```

#### 3. IP 哈希（IP Hash）- 会话保持

```nginx
upstream backend {
    ip_hash;  # 基于客户端 IP 的哈希
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**适用场景**：需要保持会话（Session）的应用

#### 4. 最少连接（Least Connections）

```nginx
upstream backend {
    least_conn;  # 将请求发送到当前连接数最少的服务器
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**适用场景**：长连接应用，如 WebSocket、数据库连接池

#### 5. 加权最少连接

```nginx
upstream backend {
    least_conn;
    
    server 192.168.1.10:8080 weight=5;
    server 192.168.1.11:8080 weight=3;
    server 192.168.1.12:8080 weight=2;
}
```

#### 6. 一致性哈希（Consistent Hash）

```nginx
upstream backend {
    hash $request_uri consistent;  # 基于请求 URI 的哈希
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**适用场景**：缓存服务器，确保相同请求总是路由到同一服务器

#### 7. 随机算法

```nginx
upstream backend {
    random;  # 随机选择
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

# 随机 + 最少连接
upstream backend {
    random two least_conn;
    
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

### 服务器参数

```nginx
upstream backend {
    server 192.168.1.10:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=5 max_fails=3 fail_timeout=30s;
    
    # 备份服务器（主服务器不可用时启用）
    server 192.168.1.12:8080 backup;
    
    # 标记为下线（维护中）
    server 192.168.1.13:8080 down;
    
    # 长连接配置
    keepalive 32;
    keepalive_timeout 30s;
    keepalive_requests 1000;
}
```

| 参数 | 说明 |
|------|------|
| `weight` | 权重，默认 1 |
| `max_fails` | 最大失败次数，默认 1 |
| `fail_timeout` | 失败超时时间，默认 10s |
| `backup` | 备份服务器 |
| `down` | 标记为下线 |
| `slow_start` | 缓慢启动时间 |

---

## 健康检查与故障转移

### 被动健康检查

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 backup;
}
```

**工作原理**：
- 当某服务器失败次数达到 `max_fails`，在 `fail_timeout` 时间内认为不可用
- 超时后再次尝试，如果成功则恢复服务

### 主动健康检查（需要 nginx_upstream_check_module）

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    
    # 主动健康检查
    check interval=3000 rise=2 fall=3 timeout=1000 type=http;
    check_http_send "HEAD /health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}
```

| 参数 | 说明 |
|------|------|
| `interval` | 检查间隔（毫秒） |
| `rise` | 连续成功次数标记为可用 |
| `fall` | 连续失败次数标记为不可用 |
| `timeout` | 检查超时时间 |
| `type` | 检查类型（tcp/http/ssl_hello/mysql） |

---

## WebSocket 代理

### 基础 WebSocket 代理

```nginx
upstream websocket_backend {
    server localhost:3000;
    
    # WebSocket 长连接配置
    keepalive 32;
}

server {
    listen 80;
    server_name ws.example.com;
    
    location /ws {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        
        # WebSocket 必需头
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 其他代理头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # WebSocket 超时设置（长连接）
        proxy_read_timeout 86400s;   # 24小时
        proxy_send_timeout 86400s;
        
        # 禁用缓冲
        proxy_buffering off;
    }
}
```

### 完整的 WebSocket 配置

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream websocket_backend {
    least_conn;
    
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
    
    keepalive 64;
}

server {
    listen 80;
    server_name ws.example.com;
    
    location /socket.io/ {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        proxy_buffering off;
        
        # 支持分片传输
        proxy_set_header X-NginX-Proxy true;
    }
}
```

---

## 高级代理配置

### 多路径代理

```nginx
upstream api_backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

upstream web_backend {
    server 192.168.1.20:3000;
    server 192.168.1.21:3000;
}

upstream static_backend {
    server 192.168.1.30:80;
}

server {
    listen 80;
    server_name app.example.com;
    
    # API 代理
    location /api/ {
        proxy_pass http://api_backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 静态资源
    location /static/ {
        proxy_pass http://static_backend/;
        proxy_cache static_cache;
        expires 30d;
    }
    
    # 主应用
    location / {
        proxy_pass http://web_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 基于域名的后端选择

```nginx
map $http_host $backend_pool {
    default         backend_default;
    api.example.com backend_api;
    app.example.com backend_app;
}

upstream backend_default {
    server 192.168.1.10:8080;
}

upstream backend_api {
    server 192.168.1.20:8080;
}

upstream backend_app {
    server 192.168.1.30:8080;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://$backend_pool;
        proxy_set_header Host $host;
    }
}
```

### 灰度发布配置

```nginx
# 基于 Cookie 的灰度
map $cookie_canary $backend {
    default stable;
    "1"     canary;
}

upstream stable {
    server stable-backend:8080;
}

upstream canary {
    server canary-backend:8080;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://$backend;
        proxy_set_header Host $host;
    }
}
```

### 基于权重的灰度

```nginx
split_clients "${remote_addr}AAA" $variant {
    10%     canary;
    *       stable;
}

upstream stable {
    server stable-backend:8080;
}

upstream canary {
    server canary-backend:8080;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://$variant;
    }
}
```

---

## 负载均衡算法详解

### 算法对比

| 算法 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| 轮询 | 通用场景 | 简单公平 | 不考虑服务器性能 |
| 加权轮询 | 服务器性能不同 | 按能力分配 | 需要手动配置权重 |
| IP 哈希 | 需要会话保持 | 会话一致性 | 可能造成负载不均 |
| 最少连接 | 长连接应用 | 动态平衡 | 计算开销稍大 |
| 一致性哈希 | 缓存场景 | 缓存命中率高 | 配置复杂 |
| 随机 | 通用场景 | 实现简单 | 可能不够均匀 |

### 选择建议

- **无状态应用**：轮询或加权轮询
- **有状态应用（Session）**：IP 哈希 + Session 共享
- **长连接应用**：最少连接
- **缓存服务器**：一致性哈希
- **性能差异大**：加权轮询或加权最少连接

---

## 完整配置示例

### 生产环境负载均衡配置

```nginx
# 定义上游服务器
upstream app_servers {
    least_conn;
    
    server 192.168.1.10:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 weight=3 max_fails=3 fail_timeout=30s backup;
    
    keepalive 32;
    keepalive_timeout 30s;
    keepalive_requests 1000;
}

# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:100m 
                 max_size=1g inactive=60m use_temp_path=off;

server {
    listen 80;
    server_name app.example.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    # SSL 配置
    ssl_certificate /etc/nginx/ssl/app.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/app.example.com.key;
    include /etc/nginx/snippets/ssl-params.conf;
    
    # 日志
    access_log /var/log/nginx/app.access.log;
    error_log /var/log/nginx/app.error.log warn;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        root /var/www/app/static;
        expires 30d;
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
        
        # 缓存
        proxy_cache app_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        add_header X-Cache-Status $upstream_cache_status;
        
        # 超时
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
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

---

> 上一篇：[NGINX 虚拟主机配置](./nginx虚拟主机.md) | 下一篇：[NGINX 静态资源服务](./nginx静态资源.md)
