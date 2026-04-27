---
title: 前端工程化知识体系
tags:
  - 前端
  - 工程化
  - 目录
created: 2026-04-27
---

# 前端工程化知识体系

## 📚 文档总览

### 🌱 基础篇（入门必备）

| 序号 | 文档 | 核心内容 | 难度 |
|------|------|---------|------|
| 01 | **[包管理器完全指南](./基础篇/01-包管理器完全指南.md)** | npm/yarn/pnpm 对比、lock 文件、依赖版本、常用命令 | ⭐ |
| 02 | **[ESLint代码规范指南](./基础篇/02-ESLint代码规范指南.md)** | ESLint 配置、规则详解、Prettier 集成、VS Code 配置 | ⭐⭐ |
| 03 | **[Husky与Git钩子指南](./基础篇/03-Husky与Git钩子指南.md)** | 钩子工作原理、lint-staged、commitlint、Conventional Commits 规范 | ⭐⭐ |
| 04 | **[TypeScript工程配置](./基础篇/04-TypeScript工程配置.md)** | tsconfig 完整配置、类型声明、路径别名、环境变量类型 | ⭐⭐ |
| 05 | **[Vite快速上手指南](./基础篇/05-Vite快速上手指南.md)** | 配置文件、HMR、环境变量、插件生态、常见问题 | ⭐⭐ |
| 06 | **[Webpack基础配置](./基础篇/06-Webpack基础配置.md)** | 核心概念、Loader/Plugin、devServer、生产构建 | ⭐⭐⭐ |
| 07 | **[前端项目脚手架搭建](./基础篇/07-前端项目脚手架搭建.md)** | 从零到一搭建标准前端项目模板 | ⭐⭐⭐ |

### ⚡ 高级篇（架构能力）

| 序号 | 文档 | 核心内容 | 难度 |
|------|------|---------|------|
| 01 | **[Webpack深度进阶](./高级篇/01-Webpack深度进阶.md)** | 原理、性能优化、自定义 Loader/Plugin、Bundle 分析 | ⭐⭐⭐⭐ |
| 02 | **[Vite高级特性与原理](./高级篇/02-Vite高级特性与原理.md)** | 预构建、插件开发、SSR、源码分析 | ⭐⭐⭐⭐ |
| 03 | **[Rollup与库打包指南](./高级篇/03-Rollup与库打包指南.md)** | 组件库/工具库打包、Tree Shaking、产物格式 | ⭐⭐⭐ |
| 04 | **[esbuild与Rspack实战](./高级篇/04-esbuild与Rspack实战.md)** | 高性能构建工具、与 Webpack/Vite 对比 | ⭐⭐⭐ |
| 05 | **[Turbopack与下一代构建](./高级篇/05-Turbopack与下一代构建.md)** | Rust 工具链、Turborepo、增量构建 | ⭐⭐⭐⭐ |
| 06 | **[Monorepo工程架构](./高级篇/06-Monorepo工程架构.md)** | pnpm workspace、Nx、Lerna、版本管理 | ⭐⭐⭐⭐ |
| 07 | **[微前端架构实战](./高级篇/07-微前端架构实战.md)** | qiankun、Module Federation、应用隔离与通信 | ⭐⭐⭐⭐ |
| 08 | **[前端性能工程化](./高级篇/08-前端性能工程化.md)** | 性能指标、Lighthouse、包体积优化、加载优化 | ⭐⭐⭐ |
| 09 | **[前端测试工程化](./高级篇/09-前端测试工程化.md)** | Vitest、Jest、E2E 测试、测试金字塔、覆盖率 | ⭐⭐⭐ |
| 10 | **[前端CI/CD流水线](./高级篇/10-前端CI-CD流水线.md)** | GitHub Actions、GitLab CI、自动化部署、版本发布 | ⭐⭐⭐⭐ |
| 11 | **[组件库工程化体系](./高级篇/11-组件库工程化体系.md)** | 组件设计、文档站点、按需引入、版本管理 | ⭐⭐⭐⭐ |
| 12 | **[前端监控与埋点体系](./高级篇/12-前端监控与埋点体系.md)** | 性能监控、错误监控、业务埋点、数据可视化 | ⭐⭐⭐⭐ |

### 🎯 实战案例（完整项目实战）

| 序号 | 文档 | 核心内容 | 难度 |
|------|------|---------|------|
| 01 | **[Vue3组件库完整工程化](./实战案例/Vue3组件库完整工程化.md)** | 从 0 到 1 搭建企业级组件库 | ⭐⭐⭐⭐ |
| 02 | **[React Admin工程化实战](./实战案例/React Admin工程化实战.md)** | React 中后台完整工程实践 | ⭐⭐⭐⭐ |
| 03 | **[Monorepo多包管理实战](./实战案例/Monorepo多包管理实战.md)** | pnpm workspace 多包管理完整案例 | ⭐⭐⭐⭐ |

---

## 🛠️ 标准工程化配置清单

### ✅ 必备（所有项目）

| 工具 | 用途 |
|------|------|
| **pnpm** | 包管理器（比 npm/yarn 快，省空间） |
| **ESLint** | 代码质量检查 |
| **Prettier** | 代码格式化 |
| **Husky** | Git 钩子 |
| **lint-staged** | 只检查提交的文件 |
| **commitlint** | 提交信息规范 |
| **TypeScript** | 类型检查（推荐） |

### ✅ 推荐（大中型项目）

| 工具 | 用途 |
|------|------|
| **Vitest** | 单元测试 |
| **Sass/Less** | CSS 预处理器 |
| **unocss** | 原子化 CSS |
| **@antfu/eslint-config** | 一站式 ESLint 配置 |
| **changeset** | 版本管理 |

### ✅ 企业级（大型项目/团队）

| 工具 | 用途 |
|------|------|
| **Monorepo** | 多包架构（pnpm workspace / Nx） |
| **Micro-Frontend** | 微前端 |
| **CI/CD** | 自动化流水线 |
| **Sentry** | 错误监控 |
| **Design System** | 设计系统 |

---

## 📋 从零创建标准项目

### 1. 初始化 Vite + Vue 3 + TS

```bash
pnpm create vite my-app -- --template vue-ts
cd my-app
pnpm install
```

### 2. 配置代码规范

```bash
# 安装 ESLint + Prettier
pnpm add -D eslint @antfu/eslint-config
```

```typescript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false
  },
  typescript: true,
  vue: true
})
```

### 3. 配置 Git 钩子

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional

npx husky install
npm set-script prepare "husky install"

npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx --no -- commitlint --edit \"$1\""
```

### 4. 添加 lint-staged 配置

```json
{
  "lint-staged": {
    "*.{js,ts,vue}": "eslint --fix"
  }
}
```

### 5. commitlint 配置

```bash
echo "{ extends: ['@commitlint/config-conventional'] }" > .commitlintrc
```

---

## 🎯 学习路径建议

### 🌱 入门（1-2周）

1. 先搞懂包管理器：npm / pnpm
2. 学会 ESLint + Prettier 基础配置
3. 学会 Husky + lint-staged 工作流
4. 学会 Vite 基础使用

**目标：** 能独立搭建一个代码规范有保障的前端项目

### ⚡ 进阶（1个月）

1. 深入理解构建工具原理（Vite / Webpack 二选一）
2. 学会写简单的 Vite/Webpack 插件
3. 理解前端工程化完整链路（开发 → 测试 → 构建 → 部署）
4. 学会使用 CI/CD

**目标：** 能负责团队工程化配置和优化

### 🏆 专家（长期）

1. 深入研究打包原理（AST、模块系统）
2. 自研脚手架、CLI 工具
3. Monorepo、微前端架构设计
4. 性能监控体系建设

**目标：** 企业级前端架构师

---

## 🔗 配套资源

### 官方文档
- [Vite 官方文档](https://vitejs.dev/)
- [Webpack 官方文档](https://webpack.js.org/)
- [Rollup 官方文档](https://rollupjs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [ESLint 官方文档](https://eslint.org/)

### 推荐工具
- [@antfu/eslint-config](https://github.com/antfu/eslint-config) - 一站式 ESLint 配置
- [taze](https://github.com/antfu/taze) - 依赖版本检查
- [taze](https://github.com/antfu/taze) - 依赖版本检查
- [knip](https://github.com/webpro/knip) - 查找未使用文件/依赖

---

## 📝 更新日志

- 2026-04-27: 初始版本，完成基础篇核心文档

---

**下一篇开始学习：** [包管理器完全指南](./基础篇/01-包管理器完全指南.md) 🚀
