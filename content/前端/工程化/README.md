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

### 🌱 基础篇（7/7 ✅ 已完成）

| 序号 | 文档 | 核心内容 | 难度 |
|------|------|---------|------|
| 01 | **[包管理器完全指南](./基础篇/01-包管理器完全指南.md)** | npm/yarn/pnpm 对比、lock 文件机制、依赖版本管理、幽灵依赖问题、pnpm 硬链接+符号链接原理、Monorepo 支持、常用命令大全 | ⭐ |
| 02 | **[ESLint代码规范指南](./基础篇/02-ESLint代码规范指南.md)** | Flat Config 新格式、规则系统、Prettier 集成冲突解决、VS Code 配置、TypeScript/Vue/React 专属配置、自定义规则开发 | ⭐⭐ |
| 03 | **[Husky与Git钩子指南](./基础篇/03-Husky与Git钩子指南.md)** | Git 钩子工作原理、lint-staged 增量检查、commitlint 提交规范、Conventional Commits 标准、commitizen 交互式提交、prepare-commit-msg 自动添加 Jira 单号 | ⭐⭐ |
| 04 | **[TypeScript工程配置](./基础篇/04-TypeScript工程配置.md)** | tsconfig 30+ 配置项逐条解析、类型声明文件、.browserslistrc、ts-loader vs babel-loader、ts-node/tsx 运行工具、类型体操入门 | ⭐⭐ |
| 05 | **[Vite快速上手指南](./基础篇/05-Vite快速上手指南.md)** | 配置文件详解、依赖预构建原理、HMR 热更新、环境变量类型化、插件生态、CSS 处理、静态资源处理、Glob 导入、性能优化策略 | ⭐⭐ |
| 06 | **[Webpack基础配置](./基础篇/06-Webpack基础配置.md)** | 五大核心概念、Loader 大全、Plugin 实战、DevServer 代理、代码分割策略、Tree Shaking、缓存配置、完整 Vue 项目模板 | ⭐⭐⭐ |
| 07 | **[前端项目脚手架搭建](./基础篇/07-前端项目脚手架搭建.md)** | 企业级 Vue 3 完整模板、Axios 请求封装、路由守卫、Pinia 状态管理、通用 Composables、CLI 脚手架工具开发、交互式命令行设计 | ⭐⭐⭐ |

---

### ⚡ 高级篇（规划中）

| 序号 | 文档 | 核心内容 | 难度 |
|------|------|---------|------|
| 01 | **Webpack深度进阶.md | 原理剖析、性能优化、自定义 Loader/Plugin、Bundle 分析、联邦模块、Module Federation | ⭐⭐⭐⭐ |
| 02 | **Vite高级特性与原理.md | Esbuild 预构建深度解析、Rollup 插件兼容层、插件开发、SSR、HMR 原理、对比 Webpack HMR | ⭐⭐⭐⭐ |
| 03 | **Rollup与库打包指南.md | 组件库/工具库打包、Tree Shaking 深度解析、产物格式对比（ESM/CJS/UMD）、Vite Library 库模式 | ⭐⭐⭐ |
| 04 | **esbuild与Rspack实战.md | 高性能构建工具对比、Rust 工具链、Turbopack、增量构建原理、大型项目构建性能对比 | ⭐⭐⭐ |
| 05 | **Monorepo工程架构.md | pnpm workspace、Changesets 版本管理、Nx 增量构建、Lerna、pnpm filter、Turborepo、大规模 Monorepo | ⭐⭐⭐⭐ |
| 06 | **微前端架构实战.md | qiankun、Module Federation、应用隔离方案、样式隔离、JS 沙箱、父子应用通信策略 | ⭐⭐⭐⭐ |
| 07 | **前端性能工程化.md | Web Vitals 性能指标、Lighthouse 深度解读、包体积优化、首屏加载优化、图片优化、懒加载、预加载策略 | ⭐⭐⭐ |
| 08 | **前端测试工程化.md | Vitest 单元测试、Jest 配置、React Testing Library、E2E 测试 Playwright/Cypress、测试覆盖率、TDD 实践 | ⭐⭐⭐ |
| 09 | **前端CI/CD流水线.md | GitHub Actions、GitLab CI、自动化构建、自动化测试、自动化部署、版本发布流程、Semantic Release | ⭐⭐⭐⭐ |
| 10 | **组件库工程化体系.md | 组件设计原则、Monorepo 管理、VitePress 文档站点、按需引入、unplugin-vue-components、版本管理策略 | ⭐⭐⭐⭐ |
| 11 | **前端监控与埋点体系.md | 性能监控 SDK 开发、JS 错误监控、资源加载监控、业务埋点设计、数据可视化、Sentry 集成 | ⭐⭐⭐⭐ |

---

### 🎯 实战案例（规划中）

| 序号 | 文档 | 核心内容 | 难度 |
|------|------|---------|------|
| 01 | **Vue3组件库完整工程化.md** | 从 0 到 1 搭建企业级组件库、文档站点、按需引入、主题定制、版本发布 | ⭐⭐⭐⭐ |
| 02 | **React Admin工程化实战.md | React 18 + TypeScript 企业级中后台完整工程实践 | ⭐⭐⭐⭐ |
| 03 | **Monorepo多包管理实战.md | pnpm workspace 多包管理完整案例、Changesets 版本管理、跨包依赖管理 | ⭐⭐⭐⭐ |

---

## 🛠️ 标准工程化配置清单

### ✅ 必备（所有项目）

| 工具 | 用途 | 推荐配置 |
|------|------|---------|
| **包管理器** | 依赖管理 | pnpm（速度快、省磁盘、Monorepo 支持） |
| **ESLint** | 代码质量检查 | @antfu/eslint-config（一站式配置） |
| **Prettier** | 代码格式化 | 与 ESLint 配合使用 |
| **Husky** | Git 钩子 | pre-commit + commit-msg |
| **lint-staged** | 只检查提交的文件 | 配合 ESLint/Stylelint |
| **commitlint** | 提交信息规范 | Conventional Commits 标准 |
| **TypeScript** | 类型检查 | 严格模式（strict: true） |

### ✅ 推荐（大中型项目）

| 工具 | 用途 |
|------|------|
| **Vite** | 构建工具 |
| **Vitest** | 单元测试 |
| **Sass/Less** | CSS 预处理器 |
| **UnoCSS** | 原子化 CSS |
| **Changesets** | Monorepo 版本管理 |

### ✅ 企业级（大型项目/团队）

| 工具 | 用途 |
|------|------|
| **Monorepo** | 多包架构（pnpm workspace / Nx） |
| **Micro-Frontend** | 微前端架构 |
| **CI/CD Pipeline** | 自动化流水线 |
| **Sentry** | 错误监控 |
| **Design System** | 设计系统 |
| **CLI 工具** | 内部脚手架 |

---

## 🚀 从零创建标准项目（5 步快速上手）

### 1. 初始化 Vite + Vue 3 + TS 项目

```bash
pnpm create vite my-app -- --template vue-ts
cd my-app
```

### 2. 配置 ESLint + Prettier

```bash
pnpm add -D eslint @antfu/eslint-config
```

```javascript
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

### 3. 配置 Git Hooks（Husky + commitlint + lint-staged

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional

npx husky install
npm set-script prepare "husky install"

npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx --no -- commitlint --edit \"$1\""
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": "eslint --fix"
  }
}
```

```json
// .commitlintrc
{
  "extends": ["@commitlint/config-conventional"]
}
```

### 4. 路径别名配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@api': path.resolve(__dirname, './src/api'),
      '@stores': path.resolve(__dirname, './src/stores')
    }
  }
})
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

### 5. 添加常用脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "prepare": "husky install"
  }
}
```

---

## 🎯 学习路径建议

### 🌱 入门阶段（1-2周）

1. 先搞懂包管理器：npm / pnpm / yarn 区别与选择
2. 学会 ESLint + Prettier 规范配置
3. 掌握 Husky + lint-staged 代码提交规范工作流
4. TypeScript 工程化配置
5. 学会 Vite 基础使用和常用配置

**目标：** 能独立搭建一个代码规范有保障的前端项目

### ⚡ 进阶阶段（1个月）

1. 深入理解构建工具原理（Vite / Webpack二选一）
2. 学会写简单的 Vite/Webpack 插件
3. 理解前端工程化完整链路（开发 → 测试 → 构建 → 部署）
4. 学会使用 CI/CD 自动化流水线
5. 掌握前端性能优化工程化

**目标：** 能负责团队工程化配置和优化

### 🏆 专家阶段（长期）

1. 深入研究打包原理（AST、模块系统、HMR原理）
2. 自研脚手架、CLI 工具
3. Monorepo、微前端架构设计
4. 性能监控体系建设
5. 设计系统 + 组件库工程化

**目标：** 企业级前端架构师

---

## 🔗 配套资源

### 官方文档
- [Vite 官方文档](https://vitejs.dev/)
- [Webpack 官方文档](https://webpack.js.org/)
- [Rollup 官方文档](https://rollupjs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [ESLint 官方文档](https://eslint.org/)
- [pnpm 官方文档](https://pnpm.io/)

### 推荐工具库
- [@antfu/eslint-config](https://github.com/antfu/eslint-config) - 一站式 ESLint 配置
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) - 自动导入 API
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - 自动导入组件
- [changesets](https://github.com/changesets/changesets) - Monorepo 版本管理

---

## 📝 更新日志

- **2026-04-27** - 基础篇 7 篇文档全部完成，覆盖包管理器、代码规范、Git 钩子、TS 配置、Vite/Webpack 双构建、脚手架完整指南
- **2026-04-27** - 项目初始化，完成知识体系架构设计

---

## 💡 贡献指南

发现文档有错误或缺失？欢迎补充完善！

**下一篇开始学习：** [包管理器完全指南](./基础篇/01-包管理器完全指南.md) 🚀
