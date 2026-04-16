---
title: NGINX 运维指南
tags:
  - 技术
  - Web服务器
  - NGINX
  - 运维
  - 命令
created: 2026-04-15
---

# NGINX 运维指南

> NGINX 运维实战：故障排查、监控、命令详解

---

## 目录

- [常用命令详解](#常用命令详解)
- [故障排查与监控](#故障排查与监控)
- [性能监控](#性能监控)
- [日志分析](#日志分析)
- [常见问题解决](#常见问题解决)
- [性能调优](#性能调优)
- [安全配置检查](#安全配置检查)

---

## 常用命令详解

### 基础命令

#### nginx - 启动服务

```bash
# 直接启动（默认读取 /etc/nginx/nginx.conf）
nginx

# 指定配置文件启动
nginx -c /path/to/nginx.conf

# 指定前缀目录启动
nginx -p /usr/local/nginx/

# 设置全局配置指令
nginx -g "worker_processes 4;"
```

| 参数 | 说明 |
|------|------|
| `-c` | 指定配置文件路径 |
| `-p` | 设置前缀路径（用于相对路径解析） |
| `-g` | 设置全局配置指令 |
| `-t` | 测试配置文件 |
| `-T` | 测试并打印完整配置 |
| `-v` | 显示版本 |
| `-V` | 显示详细版本和编译参数 |
| `-s` | 发送信号到主进程 |

#### nginx -t - 测试配置

```bash
# 测试默认配置文件语法
nginx -t

# 测试指定配置文件
nginx -t -c /path/to/nginx.conf

# 输出示例：
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

| 输出 | 含义 |
|------|------|
| `syntax is ok` | 配置语法正确 |
| `test is successful` | 配置文件测试通过 |
| `emerg` / `error` | 配置存在错误 |

#### nginx -T - 查看完整配置

```bash
# 测试并显示完整配置（包含所有 include 的文件）
nginx -T

# 保存到文件
nginx -T > /tmp/full-config.txt
```

#### nginx -s - 信号控制

```bash
# 重新加载配置（热重载）
nginx -s reload

# 快速停止（立即终止）
nginx -s stop

# 优雅退出（处理完当前请求后停止）
nginx -s quit

# 重新打开日志文件（用于日志切割）
nginx -s reopen
```

### Systemd 管理命令

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

# 查看启动日志
journalctl -u nginx

# 实时查看日志
journalctl -u nginx -f
```

### Docker 管理命令

```bash
# 启动 NGINX 容器
docker run -d -p 80:80 --name nginx nginx

# 停止容器
docker stop nginx

# 重启容器
docker restart nginx

# 重载配置
docker exec nginx nginx -s reload

# 查看日志
docker logs nginx
docker logs -f nginx

# 进入容器
docker exec -it nginx /bin/bash
```

---

## 故障排查与监控

### 配置检查流程

```bash
# 1. 测试配置语法
nginx -t

# 2. 查看详细配置
nginx -T | grep -E "(listen|server_name|root)"

# 3. 检查配置文件权限
ls -la /etc/nginx/nginx.conf
ls -la /etc/nginx/conf.d/

# 4. 检查网站目录权限
ls -la /var/www/

# 5. 查看错误日志
tail -f /var/log/nginx/error.log
```

### 状态监控模块

```nginx
server {
    listen 80;
    server_name status.localhost;
    
    # 启用 stub_status 模块
    location /nginx_status {
        stub_status on;
        
        # 只允许本地访问
        allow 127.0.0.1;
        allow 10.0.0.0/8;
        deny all;
    }
}
```

访问 `http://status.localhost/nginx_status` 返回：

```
Active connections: 291
server accepts handled requests
 16630948 16630948 31070465
Reading: 6 Writing: 125 Waiting: 160
```

| 字段 | 说明 |
|------|------|
| `Active connections` | 当前活动连接数 |
| `accepts` | 总共接受的连接数 |
| `handled` | 总共处理的连接数 |
| `requests` | 总共处理的请求数 |
| `Reading` | 正在读取请求头的连接数 |
| `Writing` | 正在写入响应的连接数 |
| `Waiting` | 空闲等待的连接数 |

### 健康检查配置

```nginx
server {
    listen 80;
    
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
```

---

## 性能监控

### 关键性能指标

| 指标 | 说明 | 检查命令 |
|------|------|---------|
| 活跃连接数 | 当前处理的连接 | `curl localhost/nginx_status` |
| 请求处理速率 | 每秒请求数 | 计算 `requests` 差值 |
| 连接等待数 | Waiting 数量 | `stub_status` |
| 错误率 | 5xx 错误比例 | 日志分析 |
| 响应时间 | 平均响应时间 | 日志分析 |
| CPU 使用率 | NGINX 进程 CPU | `top` / `htop` |
| 内存使用 | NGINX 内存占用 | `ps aux \| grep nginx` |

### 连接数监控脚本

```bash
#!/bin/bash
# nginx-monitor.sh

STATUS_URL="http://localhost/nginx_status"
LOG_FILE="/var/log/nginx/monitor.log"

# 获取状态
STATUS=$(curl -s $STATUS_URL)

# 提取指标
ACTIVE=$(echo "$STATUS" | grep "Active connections" | awk '{print $3}')
REQUESTS=$(echo "$STATUS" | awk 'NR==3{print $3}')

# 记录日志
echo "$(date '+%Y-%m-%d %H:%M:%S') - Active: $ACTIVE, Requests: $REQUESTS" >> $LOG_FILE

# 告警检查
if [ "$ACTIVE" -gt 1000 ]; then
    echo "ALERT: High active connections: $ACTIVE" | mail -s "NGINX Alert" admin@example.com
fi
```

### 使用 Prometheus + Grafana 监控

```nginx
# 安装 nginx-prometheus-exporter
# https://github.com/nginxinc/nginx-prometheus-exporter

server {
    listen 9113;
    
    location /metrics {
        # 返回 Prometheus 格式的指标
        # 需要配合 nginx-prometheus-exporter 使用
    }
}
```

---

## 日志分析

### 常用日志分析命令

```bash
# 统计 IP 访问次数（取前 10）
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计状态码分布
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 查找 404 错误
awk '$9 == 404 {print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计响应时间大于 1 秒的请求
awk '$NF > 1 {print $7, $NF}' /var/log/nginx/access.log | sort -k2 -rn | head -10

# 统计 User-Agent
awk -F'"' '{print $6}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计每小时请求量
awk '{print $4}' /var/log/nginx/access.log | cut -d: -f1,2 | sort | uniq -c

# 查找慢请求（假设日志格式包含 $request_time）
awk '$NF > 5 {print $0}' /var/log/nginx/access.log | tail -20
```

### 日志切割配置

```bash
#!/bin/bash
# /etc/logrotate.d/nginx

/var/log/nginx/*.log {
    daily                    # 每天切割
    missingok                # 文件不存在不报错
    rotate 14                # 保留 14 天
    compress                 # 压缩旧日志
    delaycompress            # 延迟压缩（保留最近一份未压缩）
    notifempty               # 空文件不切割
    create 0640 www-data adm # 创建新日志文件权限
    sharedscripts            # 共享脚本（只执行一次）
    postrotate
        # 通知 NGINX 重新打开日志文件
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}
```

### 使用 GoAccess 实时分析

```bash
# 安装 GoAccess
sudo apt install goaccess

# 实时终端分析
goaccess /var/log/nginx/access.log

# 生成 HTML 报告
goaccess /var/log/nginx/access.log -o /var/www/html/report.html --log-format=COMBINED

# 实时 WebSocket 报告
goaccess /var/log/nginx/access.log -o /var/www/html/report.html --real-time-html --log-format=COMBINED
```

---

## 常见问题解决

### Q1: 502 Bad Gateway

**原因：**
- 后端服务未启动
- 后端服务崩溃
- 连接超时

**解决：**
```bash
# 检查后端服务状态
systemctl status php7.4-fpm
systemctl status gunicorn

# 检查端口监听
ss -tlnp | grep :9000

# 检查错误日志
tail -f /var/log/nginx/error.log

# 增加超时时间
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

### Q2: 504 Gateway Timeout

**原因：**
- 后端处理时间过长
- 网络问题

**解决：**
```nginx
location / {
    proxy_pass http://backend;
    
    # 增加超时时间
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    
    # 或禁用超时（不推荐）
    # proxy_read_timeout 86400s;
}
```

### Q3: 403 Forbidden

**原因：**
- 文件权限不足
- 用户权限错误
- SELinux 限制

**解决：**
```bash
# 检查文件权限
ls -la /var/www/

# 修复权限
sudo chown -R www-data:www-data /var/www/
sudo chmod -R 755 /var/www/

# 检查 NGINX 用户
ps aux | grep nginx

# SELinux 检查
getenforce
setenforce 0  # 临时禁用（测试用）

# 或配置 SELinux
chcon -R -t httpd_sys_content_t /var/www/
```

### Q4: 404 Not Found

**原因：**
- 文件不存在
- root/alias 配置错误
- location 匹配问题

**解决：**
```bash
# 检查文件是否存在
ls -la /var/www/html/index.html

# 测试配置
nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log

# 使用 try_files
try_files $uri $uri/ /index.html;
```

### Q5: 内存不足

**原因：**
- worker 进程过多
- 缓存配置过大
- 连接泄漏

**解决：**
```nginx
# 减少 worker 进程数
worker_processes auto;  # 或设置为 CPU 核心数

# 减少连接数
worker_connections 1024;

# 限制缓存大小
proxy_cache_path /var/cache/nginx max_size=1g;

# 限制请求体大小
client_max_body_size 10m;
```

### Q6: 高 CPU 使用率

**原因：**
- 配置错误导致循环
- 攻击或爬虫
- 日志过大

**解决：**
```bash
# 查看 NGINX 进程
top -p $(pgrep -d',' nginx)

# 检查访问日志
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head

# 禁用访问日志
access_log off;

# 或限制日志
access_log /var/log/nginx/access.log combined buffer=32k;
```

---

## 性能调优

### 系统级优化

```bash
# 增加文件描述符限制
# /etc/security/limits.conf
* soft nofile 65535
* hard nofile 65535

# 增加系统连接数
# /etc/sysctl.conf
net.core.somaxconn = 65535
net.ipv4.tcp_max_tw_buckets = 6000
net.ipv4.tcp_sack = 1
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_rmem = 4096 87380 4194304
net.ipv4.tcp_wmem = 4096 16384 4194304

# 应用配置
sysctl -p
```

### NGINX 配置优化

```nginx
# /etc/nginx/nginx.conf

user nginx;
worker_processes auto;           # 根据 CPU 核心数自动设置
worker_rlimit_nofile 65535;      # 文件描述符限制

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    use epoll;                   # Linux 高性能网络模型
    worker_connections 4096;     # 每个 worker 的连接数
    multi_accept on;             # 同时接受多个连接
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main buffer=32k;
    
    # 高效文件传输
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 连接保持
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # Gzip
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 文件缓存
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    include /etc/nginx/conf.d/*.conf;
}
```

### 压测工具

```bash
# 安装 wrk
sudo apt install wrk

# 基础压测
wrk -t12 -c400 -d30s http://example.com/

# 参数说明：
# -t12: 12 个线程
# -c400: 400 个连接
# -d30s: 持续 30 秒

# 使用 ab (Apache Bench)
ab -n 10000 -c 100 http://example.com/

# 参数说明：
# -n 10000: 总请求数
# -c 100: 并发数
```

---

## 安全配置检查

### 安全检查清单

```bash
#!/bin/bash
# nginx-security-check.sh

echo "=== NGINX 安全检查 ==="

# 1. 检查版本
echo "1. NGINX 版本:"
nginx -v

# 2. 检查是否隐藏版本号
echo -e "\n2. 版本号隐藏:"
grep -i "server_tokens" /etc/nginx/nginx.conf

# 3. 检查 SSL 配置
echo -e "\n3. SSL 协议版本:"
grep -i "ssl_protocols" /etc/nginx/conf.d/*

# 4. 检查敏感文件访问
echo -e "\n4. 敏感文件保护:"
grep -r "location.*\\." /etc/nginx/conf.d/ | grep -E "(git|svn|env)"

# 5. 检查日志配置
echo -e "\n5. 日志配置:"
grep -i "access_log" /etc/nginx/nginx.conf

# 6. 检查文件权限
echo -e "\n6. 配置文件权限:"
ls -la /etc/nginx/nginx.conf

echo -e "\n=== 检查完成 ==="
```

### SSL 安全扫描

```bash
# 使用 testssl.sh
./testssl.sh https://example.com

# 使用 nmap
nmap --script ssl-enum-ciphers -p 443 example.com

# 使用 OpenSSL
openssl s_client -connect example.com:443 -tls1_2
```

---

> 上一篇：[NGINX 高级特性](./nginx高级特性.md) | 下一篇：[NGINX 配置详解](./nginx配置详解.md)
