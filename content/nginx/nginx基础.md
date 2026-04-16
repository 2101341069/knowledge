---
title: NGINX 基础
tags:
  - 技术
  - Web服务器
  - NGINX
  - 基础
created: 2026-04-15
---

# NGINX 基础

> NGINX 入门指南：简介、安装、核心概念与基本配置

---

## 目录

- [NGINX 简介](#nginx-简介)
- [安装与基础配置](#安装与基础配置)
- [核心概念与架构](#核心概念与架构)
- [基本配置详解](#基本配置详解)
- [常用模块介绍](#常用模块介绍)
- [第一个网站配置](#第一个网站配置)

---

## NGINX 简介

### 什么是 NGINX

NGINX（发音为 "engine-x"）是一个高性能的 **HTTP** 和 **反向代理** 服务器，同时也是一个 **IMAP/POP3/SMTP** 代理服务器。由俄罗斯程序员 Igor Sysoev 于 2004 年创建，最初是为了解决 C10K 问题（同时处理 10,000 个并发连接）。

### NGINX 的核心优势

| 特性 | 说明 |
|------|------|
| **高并发** | 能够同时处理数万个并发连接（C10K 问题） |
| **低内存消耗** | 10,000 个非活动 HTTP 保持连接仅需 2.5MB 内存 |
| **高性能** | 事件驱动架构，异步非阻塞处理 |
| **热部署** | 支持配置热重载，无需重启服务 |
| **模块化** | 丰富的模块生态系统，可扩展性强 |
| **负载均衡** | 内置多种负载均衡算法 |
| **静态文件处理** | 处理静态文件速度极快 |

### NGINX vs Apache

| 对比项 | NGINX | Apache |
|--------|-------|--------|
| 架构 | 事件驱动（异步） | 进程/线程驱动 |
| 静态内容 | 更快 | 较慢 |
| 动态内容 | 需配合后端 | 内置支持 |
| 内存使用 | 更低 | 较高 |
| 配置 | 简洁集中 | 分散复杂 |
| .htaccess | 不支持 | 支持 |
| 模块加载 | 动态/静态 | 动态 |
| 并发处理 | 更高 | 较低 |

### 适用场景

**NGINX 更适合：**
- 高并发静态内容服务
- 反向代理和负载均衡
- 微服务网关
- 缓存服务器
- 流媒体服务

**Apache 更适合：**
- 需要 .htaccess 的共享主机
- 复杂的动态内容处理
- 需要丰富模块支持的遗留系统

---

## 安装与基础配置

### 各种系统安装方法

#### CentOS/RHEL

```bash
# 安装 EPEL 源
sudo yum install epel-release -y

# 安装 NGINX
sudo yum install nginx -y

# 启动服务
sudo systemctl start nginx
sudo systemctl enable nginx

# 查看版本
nginx -v
nginx -V  # 详细版本信息（包含编译参数和模块）
```

#### Ubuntu/Debian

```bash
# 更新包索引
sudo apt update

# 安装 NGINX
sudo apt install nginx -y

# 启动服务
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查防火墙
sudo ufw allow 'Nginx Full'
sudo ufw status
```

#### macOS

```bash
# 使用 Homebrew
brew install nginx

# 启动服务
brew services start nginx

# 或手动启动
sudo nginx

# 配置文件位置
/usr/local/etc/nginx/nginx.conf
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

# 使用 Docker Compose
# docker-compose.yml
version: '3'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./html:/usr/share/nginx/html:ro
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
```

#### 源码编译安装

```bash
# 安装依赖
sudo apt install build-essential libpcre3-dev zlib1g-dev libssl-dev

# 下载源码
wget https://nginx.org/download/nginx-1.24.0.tar.gz
tar -zxvf nginx-1.24.0.tar.gz
cd nginx-1.24.0

# 配置编译参数
./configure \
  --prefix=/usr/local/nginx \
  --with-http_ssl_module \
  --with-http_v2_module \
  --with-http_realip_module \
  --with-http_stub_status_module \
  --with-http_gzip_static_module

# 编译安装
make
sudo make install
```

### 目录结构

```
/etc/nginx/                 # 主配置目录
├── nginx.conf              # 主配置文件
├── conf.d/                 # 额外配置文件目录
│   └── default.conf
├── sites-available/        # 可用站点配置（Debian/Ubuntu）
├── sites-enabled/          # 启用站点配置（Debian/Ubuntu）
├── snippets/               # 配置片段
├── mime.types              # MIME 类型定义
├── modules/                # 动态模块
└── fastcgi.conf            # FastCGI 配置

/var/log/nginx/             # 日志目录
├── access.log              # 访问日志
└── error.log               # 错误日志

/var/cache/nginx/           # 缓存目录

/usr/share/nginx/html/      # 默认网站根目录

/var/www/                   # 网站根目录（常用）
```

### 配置文件结构

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

## 核心概念与架构

### 架构模型

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

### 核心进程模型

| 进程类型 | 数量 | 职责 |
|---------|------|------|
| Master | 1 | 管理 worker 进程，读取和评估配置，处理信号 |
| Worker | 可配置 | 处理实际的 HTTP 请求，执行事件循环 |
| Cache Loader | 1 | 加载缓存元数据（启动时运行一次） |
| Cache Manager | 1 | 管理缓存过期和大小 |

### Master 进程职责

- 读取并验证配置文件
- 创建、绑定和关闭 socket
- 启动 worker 进程
- 接收并处理信号（如 reload、stop）
- 监控 worker 进程状态

### Worker 进程职责

- 处理客户端连接
- 执行请求处理循环
- 读写数据到客户端
- 与后端服务器通信

### 事件驱动模型

NGINX 使用异步非阻塞的事件驱动模型：

```
传统模型（Apache Prefork）:
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Process │  │ Process │  │ Process │
│  Block  │  │  Block  │  │  Block  │
└─────────┘  └─────────┘  └─────────┘
每个连接一个进程/线程

NGINX 事件驱动模型:
┌─────────────────────────────────┐
│         Worker Process          │
│  ┌───────────────────────────┐  │
│  │      Event Loop           │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ │  │
│  │  │Conn1│ │Conn2│ │Conn3│ │  │
│  │  └─────┘ └─────┘ └─────┘ │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
单线程处理多个连接
```

**优势：**
- 更少的内存占用
- 更高的并发处理能力
- 避免了进程/线程切换开销

### 连接处理机制

```nginx
# events 块配置连接处理
events {
    # 每个 worker 的最大连接数
    worker_connections 1024;
    
    # 使用 epoll（Linux）或 kqueue（FreeBSD）
    use epoll;
    
    # 允许一个 worker 同时接受多个新连接
    multi_accept on;
}
```

**连接数计算：**
- 最大并发连接数 = worker_processes × worker_connections
- 实际连接数 = 浏览器连接 + 反向代理到后端的连接
- 建议：worker_connections 设置为 1024 或更高

---

## 基本配置详解

### nginx.conf 主配置结构

```nginx
# ========== 全局块（Global Block）==========

# 定义运行 NGINX 的用户和用户组
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
pid /var/run/nginx.pid;

# 单个 worker 进程的最大文件打开数
# 应大于 worker_connections
worker_rlimit_nofile 65535;

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
    
    # 包含其他配置文件
    include /etc/nginx/conf.d/*.conf;
}
```

### 核心指令详解

#### 全局块指令

| 指令 | 示例 | 说明 |
|------|------|------|
| `user` | `user nginx;` | 设置运行 worker 进程的用户 |
| `worker_processes` | `worker_processes auto;` | worker 进程数，建议设为 CPU 核心数 |
| `error_log` | `error_log /var/log/nginx/error.log warn;` | 错误日志路径和级别 |
| `pid` | `pid /run/nginx.pid;` | PID 文件路径 |
| `worker_rlimit_nofile` | `worker_rlimit_nofile 65535;` | worker 进程文件描述符限制 |
| `daemon` | `daemon on;` | 是否以守护进程方式运行 |
| `master_process` | `master_process on;` | 是否启动 master 进程 |

#### Events 块指令

| 指令 | 示例 | 说明 |
|------|------|------|
| `worker_connections` | `worker_connections 1024;` | 每个 worker 的最大连接数 |
| `use` | `use epoll;` | 事件驱动模型（epoll/kqueue/select/poll） |
| `multi_accept` | `multi_accept on;` | 是否同时接受多个新连接 |
| `accept_mutex` | `accept_mutex on;` | 是否启用连接序列化 |

#### HTTP 块核心指令

| 指令 | 示例 | 说明 |
|------|------|------|
| `sendfile` | `sendfile on;` | 启用高效文件传输 |
| `tcp_nopush` | `tcp_nopush on;` | 防止网络阻塞 |
| `tcp_nodelay` | `tcp_nodelay on;` | 实时发送数据 |
| `keepalive_timeout` | `keepalive_timeout 65;` | 长连接超时时间 |
| `keepalive_requests` | `keepalive_requests 1000;` | 单个连接最大请求数 |
| `client_max_body_size` | `client_max_body_size 20m;` | 客户端请求体大小限制 |
| `server_tokens` | `server_tokens off;` | 隐藏版本信息 |

---

## 常用模块介绍

### 核心模块

| 模块名 | 说明 | 默认启用 |
|--------|------|---------|
| `ngx_http_core_module` | HTTP 核心模块 | 是 |
| `ngx_http_log_module` | 访问日志模块 | 是 |
| `ngx_http_gzip_module` | Gzip 压缩模块 | 是 |
| `ngx_http_ssl_module` | SSL/TLS 支持 | 否 |
| `ngx_http_proxy_module` | 反向代理模块 | 是 |
| `ngx_http_rewrite_module` | URL 重写模块 | 是 |
| `ngx_http_upstream_module` | 负载均衡模块 | 是 |

### 查看已安装模块

```bash
# 查看编译参数和模块
nginx -V

# 输出示例：
# configure arguments: 
#   --prefix=/etc/nginx 
#   --with-http_ssl_module 
#   --with-http_v2_module
#   ...
```

### 常用第三方模块

- **ngx_pagespeed**：Google 开发的网页优化模块
- **ngx_brotli**：Brotli 压缩算法支持
- **headers-more-nginx-module**：更灵活的响应头控制
- **nginx-vts-module**：虚拟主机流量统计

---

## 第一个网站配置

### 创建网站目录

```bash
# 创建网站根目录
sudo mkdir -p /var/www/mywebsite

# 设置权限
sudo chown -R $USER:$USER /var/www/mywebsite
sudo chmod -R 755 /var/www/mywebsite

# 创建测试页面
echo "<h1>Hello, NGINX!</h1>" > /var/www/mywebsite/index.html
```

### 配置虚拟主机

```nginx
# /etc/nginx/conf.d/mywebsite.conf
server {
    listen 80;
    server_name mywebsite.com www.mywebsite.com;
    
    # 网站根目录
    root /var/www/mywebsite;
    
    # 默认索引文件
    index index.html index.htm;
    
    # 字符编码
    charset utf-8;
    
    # 访问日志
    access_log /var/log/nginx/mywebsite.access.log;
    error_log /var/log/nginx/mywebsite.error.log;
    
    # 处理所有请求
    location / {
        # 尝试匹配文件，找不到则返回 404
        try_files $uri $uri/ =404;
    }
    
    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### 测试并启用配置

```bash
# 测试配置语法
sudo nginx -t

# 重载配置
sudo nginx -s reload

# 或
sudo systemctl reload nginx
```

### 本地测试

```bash
# 修改 hosts 文件（本地测试用）
sudo echo "127.0.0.1 mywebsite.com" >> /etc/hosts

# 访问测试
curl http://mywebsite.com
```

---

## 常用命令速查

```bash
# 启动 NGINX
sudo nginx
sudo systemctl start nginx

# 停止 NGINX
sudo nginx -s stop
sudo systemctl stop nginx

# 优雅退出（处理完当前请求）
sudo nginx -s quit

# 重载配置（热重载）
sudo nginx -s reload
sudo systemctl reload nginx

# 测试配置
sudo nginx -t
sudo nginx -T  # 查看完整配置

# 查看状态
sudo systemctl status nginx

# 查看版本
nginx -v
nginx -V  # 详细版本

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

---

> 下一篇：[NGINX 虚拟主机配置](./nginx虚拟主机.md)
