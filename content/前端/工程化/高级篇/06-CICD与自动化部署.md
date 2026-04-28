---
title: CICD与自动化部署
tags:
  - 前端
  - 工程化
  - CI/CD
  - GitHub Actions
  - 自动化部署
created: 2026-04-28
---

# CI/CD 与自动化部署 - 从零打造完整流水线

## 一、CI/CD 核心概念

### 1.1 什么是 CI/CD？

| 概念 | 全称 | 说明 |
|------|------|------|
| **CI** | Continuous Integration | 持续集成：频繁将代码合并到主干，自动构建和测试 |
| **CD** | Continuous Delivery | 持续交付：代码随时可发布到生产环境 |
| **CD** | Continuous Deployment | 持续部署：代码自动部署到生产环境（无需人工审批） |

---

### 1.2 理想的前端流水线

```
代码提交 → 🔍 静态检查 → 📦 构建 → 🧪 测试 → 🚀 部署
```

**阶段详解：**

1. **Install** - 安装依赖（缓存优化）
2. **Lint** - ESLint/StyleLint/TypeScript 检查
3. **Build** - 生产环境构建（缓存优化）
4. **Test** - 单元测试 / E2E 测试
5. **Preview** - 预览环境部署（Pull Request）
6. **Deploy** - 生产环境部署（tag/release）

---

### 1.3 主流 CI/CD 平台对比

| 平台 | 免费额度 | 配置方式 | 生态 | 推荐度 |
|------|---------|---------|------|-------|
| **GitHub Actions** | 2000 分钟/月 | YAML | ⭐⭐⭐⭐⭐ 最丰富 | ✅ 首选 |
| GitLab CI | 400 分钟/月 | YAML | ⭐⭐⭐⭐ | ✅ GitLab 仓库 |
| Jenkins | 免费 | Groovy | ⭐⭐⭐ | ⚠️ 需自建维护 |
| CircleCI | 250 分钟/月 | YAML | ⭐⭐⭐ | |
| Vercel | 无限（前端） | 零配置 | ⭐⭐⭐⭐ | ✅ 前端站点 |
| Netlify | 无限（前端） | 零配置 | ⭐⭐⭐⭐ | ✅ 前端站点 |

---

## 二、GitHub Actions 完整实战

### 2.1 基础配置结构

```yaml
# .github/workflows/ci.yml
name: CI  # 工作流名称

# 🎯 触发条件
on:
  # 推送时触发
  push:
    branches: [main, develop]
    # 忽略目录（变更这些文件不触发 CI）
    paths-ignore:
      - '**.md'
      - 'docs/**'
  
  # PR 时触发
  pull_request:
    branches: [main]
  
  # 定时执行（Cron 语法）
  schedule:
    - cron: '0 0 * * *'  # 每天 UTC 0 点（北京时间 8 点）
  
  # 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

# 权限配置
permissions:
  contents: read
  packages: write
  deployments: write

# 并发控制（避免重复运行）
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # 新提交进来，取消旧的运行

# ============== 任务定义 ==============
jobs:
  # 任务 1：代码检查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ...

  # 任务 2：构建
  build:
    runs-on: ubuntu-latest
    needs: lint  # 等待 lint 完成
    steps:
      - uses: actions/checkout@v4
      # ...

  # 任务 3：部署（仅 main 分支）
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      # ...
```

---

### 2.2 完整的前端 CI 配置

```yaml
# .github/workflows/ci.yml
name: Frontend CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ========== 🔍 代码质量检查 ==========
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      # ⭐ Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'  # 自动缓存 node_modules（npm/yarn/pnpm）
      
      # 📦 安装依赖
      - name: Install dependencies
        run: npm ci  # 比 npm install 更快更稳定
      
      # 🔍 ESLint 检查
      - name: Run ESLint
        run: npm run lint
      
      # 📘 TypeScript 类型检查
      - name: Type Check
        run: npm run typecheck

  # ========== 🧪 单元测试 ==========
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Tests
        run: npm run test:coverage
      
      # 📊 上传覆盖率报告（可选）
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}

  # ========== 📦 生产构建 ==========
  build:
    name: Production Build
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      # 🏗️ 构建
      - name: Build
        run: npm run build
        env:
          # 环境变量（在 GitHub Secrets 中配置）
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_APP_KEY: ${{ secrets.VITE_APP_KEY }}
      
      # ⬆️ 上传构建产物（供后续部署使用）
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
          retention-days: 7  # 保留 7 天

  # ========== 🎭 Playwright E2E 测试 ==========
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      # 下载构建产物
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      # 安装 Playwright 浏览器
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      # 启动预览服务器 + 运行 E2E
      - name: Run Playwright tests
        run: npm run test:e2e
      
      # 📸 上传测试截图（失败时）
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 30
```

---

## 三、自动化部署实战

### 3.1 部署到 GitHub Pages

```yaml
# .github/workflows/deploy-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_BASE_URL: '/repo-name/'  # GitHub Pages 子路径
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 3.2 部署到阿里云 OSS + CDN

```yaml
# .github/workflows/deploy-aliyun.yml
name: Deploy to Aliyun OSS

on:
  push:
    tags: ['v*']  # 打 tag 时触发部署

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.PROD_API_URL }}
      
      # ⬆️ 上传到 OSS
      - name: Upload to OSS
        uses: manyuanrong/setup-ossutil@v2.0
        with:
          endpoint: ${{ secrets.OSS_ENDPOINT }}
          access-key-id: ${{ secrets.OSS_ACCESS_KEY_ID }}
          access-key-secret: ${{ secrets.OSS_ACCESS_KEY_SECRET }}
      
      - name: Sync files to OSS
        run: |
          ossutil cp -rf dist oss://${{ secrets.OSS_BUCKET }}/
      
      # 🔄 刷新 CDN 缓存
      - name: Refresh CDN
        uses: hengkx/aliyun-cdn-action@v1
        with:
          accessKeyId: ${{ secrets.ALIYUN_ACCESS_KEY_ID }}
          accessKeySecret: ${{ secrets.ALIYUN_ACCESS_KEY_SECRET }}
          objectPath: 'https://example.com/*'
```

---

### 3.3 部署到 Vercel（零配置）

Vercel 会自动识别框架，无需配置：

```yaml
# 可选：自定义配置（vercel.json）
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  
  // 环境变量（在 Vercel 后台配置）
  "env": {
    "VITE_API_URL": "@api-url"
  },
  
  // 重写规则
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.example.com/:path*" }
  ],
  
  // SPA 路由回退
  "routes": [{ "handle": "filesystem" }, { "src": "/.*", "dest": "/index.html" }]
}
```

---

### 3.4 Docker + 容器化部署

#### Dockerfile

```dockerfile
# ========== 构建阶段 ==========
FROM node:18-alpine AS builder

WORKDIR /app

# 先装依赖（利用 Docker 缓存）
COPY package*.json ./
RUN npm ci

# 再构建（依赖不变时直接复用缓存）
COPY . .
RUN npm run build

# ========== 运行阶段（Nginx）==========
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

#### GitHub Actions 构建并推送镜像

```yaml
name: Build and Push Docker

on:
  push:
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      # 设置 Docker Buildx
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      # 登录 Docker Hub
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      # 构建并推送
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            username/my-app:latest
            username/my-app:${{ github.ref_name }}
          # 缓存优化
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 四、PR 预览环境（Preview Deployments）

每个 Pull Request 自动部署预览环境！

```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    branches: [main]

permissions:
  pull-requests: write  # 允许写 PR 评论

jobs:
  preview:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}
      
      # 🚀 部署到 Vercel Preview
      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        id: vercel-deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--no-wait-for-checks'
          working-directory: ./
      
      # 💬 在 PR 下评论预览链接
      - name: Comment PR
        uses: thollander/actions-comment-pull-request@v2
        with:
          message: |
            🚀 **Preview Deployment**
            
            ✅ Preview URL: ${{ steps.vercel-deploy.outputs.preview-url }}
            
            | Environment | URL |
            |-------------|-----|
            | Preview | ${{ steps.vercel-deploy.outputs.preview-url }} |
            
            *Build completed in ${{ steps.vercel-deploy.outputs.duration }}ms*
          comment_tag: preview-deployment
```

---

## 五、高级功能与最佳实践

### 5.1 缓存优化（关键！）

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          # ⭐ 自动缓存 npm/yarn/pnpm
          cache: 'npm'
      
      # 也可以自定义缓存策略
      - name: Cache node_modules
        uses: actions/cache@v4
        id: node-modules-cache
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      
      - name: Cache build output
        uses: actions/cache@v4
        with:
          path: dist
          key: ${{ runner.os }}-dist-${{ github.sha }}
```

---

### 5.2 矩阵测试（多版本兼容）

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    # 🧪 多平台 + 多 Node 版本矩阵
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
      
      # 一个失败不影响其他
      fail-fast: false
    
    name: Test (Node ${{ matrix.node-version }}, ${{ matrix.os }})
    runs-on: ${{ matrix.os }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Tests
        run: npm test
```

---

### 5.3 可复用工作流（DRY 原则）

```yaml
# .github/workflows/reusable-build.yml
name: Reusable Build Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '18'
    secrets:
      VITE_API_URL:
        required: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

**调用：**

```yaml
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '18'
    secrets: inherit
```

---

## 六、完整的生产级流水线示例

```yaml
# .github/workflows/full-pipeline.yml
name: Full Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  release:
    types: [published]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ========== 1. 代码检查 ==========
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # ========== 2. 单元测试 ==========
  unit-test:
    name: Unit Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage

  # ========== 3. 构建 ==========
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, unit-test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

  # ========== 4. E2E 测试 ==========
  e2e:
    name: E2E Test
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  # ========== 5. 预发环境（main 分支）==========
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      # 部署到 staging...

  # ========== 6. 生产环境（发布时）==========
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.event_name == 'release'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      # 部署到 production...
```

---

## 总结

**前端 CI/CD 最佳实践清单：**

✅ **缓存优化** - node_modules、构建产物都要缓存
✅ **并发控制** - concurrency 避免重复运行
✅ **分级部署** - PR → Staging → Production，逐级验证
✅ **环境隔离** - 不同环境使用不同的 Secrets
✅ **产物上传** - build 产出在 job 之间传递
✅ **矩阵测试** - 多 Node 版本、多系统兼容性
✅ **失败通知** - Slack/邮件通知构建失败
✅ **可视化看板** - 使用 GitHub 首页的 Actions 看板

**部署方案选择：**
- 🎯 **个人项目** → Vercel / Netlify（零配置）
- 🏢 **企业项目** → Docker + K8s / 阿里云 OSS + CDN
- 📚 **文档/静态站点** → GitHub Pages

---

**下一篇：** [微前端架构实战](./07-微前端架构实战.md)
