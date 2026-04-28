---
title: Monorepo架构实战
tags:
  - 前端
  - 工程化
  - Monorepo
  - pnpm
  - Turborepo
created: 2026-04-28
---

# Monorepo 架构实战 - pnpm + Turborepo 最佳实践

## 一、Monorepo 核心概念

### 1.1 什么是 Monorepo？

**Monorepo（单一代码仓库）** 是指在一个 Git 仓库中管理多个项目/包的开发模式，与 Multi-repo（多仓库）相对。

| 对比项 | Monorepo | Multi-repo |
|--------|----------|-----------|
| **代码共享** | ✅ 极其方便，直接引用 | ❌ 需要 npm 发包/软链接 |
| **依赖管理** | ✅ 统一版本，节省空间 | ❌ 每个项目单独管理 |
| **原子提交** | ✅ 跨包改动一次提交 | ❌ 需跨仓库协调 |
| **统一工具链** | ✅ 一套构建/测试/发布流程 | ❌ 每个仓库单独配置 |
| **代码可见性** | ✅ 全局可见，方便重构 | ❌ 跨仓库难以发现 |
| **权限控制** | ⚠️ 粒度较粗 | ✅ 精细控制 |
| **Git 性能** | ⚠️ 超大型项目可能慢 | ✅ 各自独立 |

---

### 1.2 Monorepo 工具链对比

| 工具 | 包管理器 | 增量构建 | 任务调度 | 缓存 | 适用场景 |
|------|---------|---------|---------|------|---------|
| **pnpm Workspace** | ✅ pnpm | ❌ | ⚠️ 基础 | ⚠️ 软链接 | 小型项目 |
| **Turborepo** | ⚙️ 兼容所有 | ✅ 智能 | ✅ 有向无环图 | ✅ 本地/云端 | 所有项目 |
| **Nx** | ⚙️ 兼容所有 | ✅ 智能 | ✅ 高级调度 | ✅ 分布式缓存 | 大型企业 |
| **Lerna** | ⚙️ 兼容所有 | ⚠️ 基础 | ✅ 任务运行 | ⚠️ 基础 | 传统项目 |
| **Rush** | ✅ 内置 | ✅ | ✅ | ✅ | 超大型项目 |

**推荐组合：`pnpm workspaces + Turborepo`**
- 🚀 **pnpm**：极速、省空间的包管理器，workspace 体验最好
- ⚡ **Turborepo**：智能增量构建系统，任务调度与缓存

---

## 二、从零搭建 pnpm + Turborepo

### 2.1 初始化项目结构

```bash
# 创建仓库
mkdir my-monorepo
cd my-monorepo
git init

# 初始化 pnpm（需要先安装 pnpm）
pnpm init
```

**最终目录结构：**

```
my-monorepo/
├── 📁 apps/                    # 应用目录
│   ├── 📁 admin/               # 管理后台（Vue3）
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── 📁 web/                 # 门户网站（React）
│   │   ├── src/
│   │   ├── package.json
│   │   └── next.config.js
│   └── 📁 mobile/              # 移动端 H5
│
├── 📁 packages/                # 内部共享包
│   ├── 📁 ui/                  # 通用 UI 组件库
│   │   ├── src/
│   │   └── package.json
│   ├── 📁 utils/               # 工具函数库
│   │   ├── src/
│   │   └── package.json
│   ├── 📁 tsconfig/            # 通用 TS 配置
│   ├── 📁 eslint-config/       # 通用 ESLint 配置
│   └── 📁 tailwind-config/     # 通用 Tailwind 配置
│
├── 📁 docs/                    # 文档站点
│
├── turbo.json                  # Turborepo 配置
├── pnpm-workspace.yaml         # pnpm workspace 配置
├── package.json                # 根 package.json
└── .gitignore
```

---

### 2.2 核心配置文件

#### 1. pnpm-workspace.yaml

```yaml
# pnpm workspace 配置
packages:
  # 所有应用
  - 'apps/*'
  # 所有包
  - 'packages/*'
  # 文档
  - 'docs'
  
  # 排除示例和测试目录
  - '!**/test/**'
  - '!**/examples/**'
```

---

#### 2. 根 package.json

```json
{
  "name": "my-monorepo",
  "private": true,  // ⚠️ Monorepo 根目录必须设为私有
  "version": "0.0.0",
  "description": "My Monorepo Project",
  
  // ⭐ 统一的 scripts（Turborepo 接管执行）
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    
    // 单个应用/包执行（加 filter）
    "dev:web": "turbo run dev --filter=web",
    "build:ui": "turbo run build --filter=@myorg/ui",
    
    // 发布
    "publish-packages": "turbo run build && changeset publish"
  },
  
  // 🔧 所有子包共享的 devDependencies
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "@changesets/cli": "^2.0.0",
    "prettier": "^3.0.0"
  },
  
  // 📌 强制统一依赖版本
  "pnpm": {
    "overrides": {
      "vue": "^3.3.0",
      "react": "^18.2.0"
    },
    //  peerDependencies 自动安装
    "peerDependencyRules": {
      "ignoreMissing": ["@types/*"]
    }
  }
}
```

---

#### 3. turbo.json（核心！）

```json
{
  "$schema": "https://turbo.build/schema.json",
  
  // ⭐ 全局依赖变化会使缓存失效
  "globalDependencies": [
    "tsconfig.json",
    ".eslintrc.js",
    "package.json"
  ],
  
  // 全局环境变量（影响缓存）
  "globalEnv": [
    "NODE_ENV",
    "CI"
  ],
  
  "pipeline": {
    // ========== build 任务 ==========
    "build": {
      // 🔗 依赖关系：先构建依赖的包
      "dependsOn": ["^build"],
      
      // 📦 缓存输出（产物目录）
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      
      // 环境变量（不同值缓存不同）
      "env": ["VITE_*", "NEXT_PUBLIC_*"],
      
      // 缓存命中时的输出
      "outputLogs": "hash-only"
    },
    
    // ========== dev 任务（无缓存，并行）==========
    "dev": {
      "cache": false,      // 开发模式不缓存
      "persistent": true   // 长驻任务
    },
    
    // ========== test 任务 ==========
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "**/*.test.ts"]
    },
    
    // ========== lint 任务 ==========
    "lint": {
      "outputs": [],  // 无文件输出
      "cache": true
    },
    
    // ========== typecheck 任务 ==========
    "typecheck": {
      "cache": true
    },
    
    // ========== clean 任务 ==========
    "clean": {
      "cache": false
    }
  }
}
```

---

### 2.3 共享配置包（最佳实践）

#### packages/tsconfig/package.json

```json
{
  "name": "@myorg/tsconfig",
  "version": "0.0.0",
  "private": true,
  "main": "base.json"
}
```

#### packages/tsconfig/base.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**子项目中使用：**

```json
// apps/admin/tsconfig.json
{
  "extends": "@myorg/tsconfig/base.json",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

---

## 三、内部包引用与版本管理

### 3.1 包之间相互引用

```bash
# 给 admin 应用添加内部 ui 包依赖
pnpm add @myorg/ui --filter admin

# 或者手动配置（推荐 workspace:* 语法）
```

**apps/admin/package.json：**

```json
{
  "name": "admin",
  "dependencies": {
    // ⭐ 使用 workspace: * 表示引用本地 workspace 版本
    "@myorg/ui": "workspace:*",
    "@myorg/utils": "workspace:*",
    
    // 外部依赖
    "vue": "^3.3.0"
  }
}
```

**代码中直接使用：**

```typescript
// apps/admin/src/main.ts
import { Button, Card } from '@myorg/ui'
import { useDebounce, formatDate } from '@myorg/utils'
```

> 💡 **魔法时刻**：修改 `packages/ui` 的代码，`apps/admin` 中会**立即生效**（热更新），无需发布、无需 npm link！

---

### 3.2 内部包的导出配置

#### packages/ui/package.json

```json
{
  "name": "@myorg/ui",
  "version": "1.2.0",
  "type": "module",
  
  // ⭐ 正确的导出配置（关键！）
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/style.css"
  },
  
  // 兼容旧工具
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  
  // 哪些文件发布到 npm
  "files": ["dist"],
  
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "typecheck": "tsc --noEmit"
  },
  
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}
```

---

## 四、Changesets 版本管理与发布

### 4.1 初始化 Changesets

```bash
# 安装（根目录）
pnpm add -D @changesets/cli -w

# 初始化
pnpm changeset init
```

生成的 `.changeset/config.json`：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  
  // 📝 Changelog 生成
  "changelog": "@changesets/cli/changelog",
  
  // 提交时的 Git 信息
  "commit": false,
  
  // 哪些包被管理
  "fixed": [],
  
  // 哪些包一起变更版本
  "linked": [
    ["@myorg/ui", "@myorg/utils"]
  ],
  
  // 访问控制：public = 公开发布
  "access": "restricted",
  
  // 基准分支
  "baseBranch": "main",
  
  // 更新 package.json 中的依赖
  "updateInternalDependencies": "patch",
  
  // 忽略哪些包（不发布）
  "ignore": ["admin", "web", "mobile"]
}
```

---

### 4.2 完整的发布工作流

```bash
# ========== 开发时：记录改动 ==========
pnpm changeset
# 交互式选择：
# 1. 哪些包变更了？
# 2. 是 major/minor/patch？
# 3. 填写变更说明

# 自动生成 .changeset/xxx.md 文件

# ========== 发布前：生成版本号 ==========
pnpm changeset version
# 此命令会：
# - 读取所有 changeset
# - 更新 packages/*/package.json 的 version
# - 更新互相依赖的版本号
# - 生成 CHANGELOG.md

# ========== 构建 + 发布 ==========
pnpm build  # 所有包构建
pnpm publish --recursive  # 发布所有变更的包

# 或者一步到位（推荐）
pnpm publish-packages  # 在根 package.json 配置的脚本
```

---

## 五、高级 Turborepo 配置

### 5.1 Filter 筛选语法

```bash
# 构建单个包
pnpm build --filter=ui

# 构建多个包
pnpm build --filter=ui --filter=utils

# 构建所有包（除了 docs）
pnpm build --filter=!docs

# 构建 ui 及其依赖的包
pnpm build --filter=ui...

# 构建依赖 ui 的包（反向）
pnpm build --filter=...ui

# 按目录匹配
pnpm build --filter=./packages/*

# Git 变更增量构建（只构建改动的包）
pnpm build --filter=[HEAD^1]
```

---

### 5.2 远程缓存（云缓存）

```bash
# 登录 Turborepo 账号
npx turbo login

# 链接到团队
npx turbo link
```

**启用后效果：**
- CI 与开发者本地共享构建缓存
- 不同机器之间共享缓存
- 构建速度再提升 **50-80%**

**turbo.json 配置：**
```json
{
  "remoteCache": {
    "enabled": true,
    "timeout": 30
  }
}
```

---

### 5.3 并行任务与并发控制

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      // 测试可以并行，最多 4 个同时跑
      "outputs": ["coverage/**"],
      "concurrency": 4
    },
    "lint": {
      // Lint 可以全并行
      "concurrency": "100%"
    }
  }
}
```

---

## 六、实战：CI/CD 配置

### GitHub Actions 示例

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2  # Turborepo 需要 Git 历史
      
      # 安装 pnpm
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      # Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      # 安装依赖
      - name: Install dependencies
        run: pnpm install
      
      # Turborepo 远程缓存
      - name: Turbo Cache
        uses: dtinth/setup-github-actions-caching-for-turbo@v1
      
      # 构建（增量！）
      - name: Build
        run: pnpm build
      
      # 测试
      - name: Test
        run: pnpm test
      
      # Lint
      - name: Lint
        run: pnpm lint
```

---

## 七、性能优化最佳实践

### 7.1 依赖扁平化优化

```yaml
# .npmrc
# 提升公共依赖到根目录
public-hoist-pattern[]=*vue*
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*

# 严格的 peerDependencies
strict-peer-dependencies=false

# 自动安装 peerDependencies
auto-install-peers=true
```

---

### 7.2 构建性能优化

**turbo.json 缓存优化：**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      
      // ⭐ 只在源文件变化时重新构建
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "vite.config.ts"
      ],
      
      // ⭐ 环境变量白名单
      "env": ["VITE_API_URL"]
    }
  }
}
```

---

### 7.3 常用命令速查

```bash
# ========== 安装依赖 ==========
pnpm install              # 全量安装
pnpm install -w           # 仅根目录安装
pnpm add lodash -w        # 根目录添加（所有包共用）
pnpm add vue --filter ui  # 给 ui 包添加依赖
pnpm add -D typescript --filter=... --include-workspace-root

# ========== 执行脚本 ==========
pnpm dev                  # 所有应用启动
pnpm dev --filter web     # 只启动 web
pnpm build --filter=ui^  # 构建 ui 的依赖（不包括 ui 自己）

# ========== 查看依赖图 ==========
pnpm ls --graph
pnpm why react

# ========== 清理 ==========
pnpm store prune          # 清理 pnpm 缓存
pnpm clean                # 清理所有 node_modules 和 dist
```

---

## 八、常见问题与解决方案

### Q1：幽灵依赖（Phantom Dependencies）

**问题：** 代码中引用了没在 package.json 中声明的依赖。

**解决方案：**

```yaml
# .npmrc
# 开启严格模式，禁止幽灵依赖
hoist=false
strict-peer-dependencies=true
```

---

### Q2：依赖重复安装

**诊断：**
```bash
# 查看依赖重复情况
pnpm ls react
```

**解决：**
```yaml
# pnpm 强制统一版本
pnpm:
  overrides:
    react: "^18.2.0"
```

---

### Q3：跨包 TypeScript 类型报错

**解决：**

1. 使用 proper references：
```json
// apps/admin/tsconfig.json
{
  "references": [
    { "path": "../../packages/ui" }
  ]
}
```

2. 开启 TypeScript composite 模式：
```json
// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "composite": true
  }
}
```

---

## 总结

**Monorepo 成功三要素：**

1. **正确的工具链** - pnpm + Turborepo 是目前最佳组合
2. **清晰的边界** - packages/* 复用，apps/* 独立部署
3. **规范的流程** - Changesets 版本管理 + CI 自动化

**什么时候该用 Monorepo？**
- ✅ 多个项目需要共享大量代码
- ✅ 团队统一技术栈和工具链
- ✅ 需要频繁跨项目重构
- ✅ 组件库 + 多个消费应用

**什么时候不该用？**
- ❌ 项目之间完全独立，无共享代码
- ❌ 技术栈差异巨大（混用 Angular + React + Vue）
- ❌ 需要强隔离的独立团队

---

**下一篇：** [CICD与自动化部署](./06-CICD与自动化部署.md)
