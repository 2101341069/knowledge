---
title: TypeScript工程配置
tags:
  - 前端
  - 工程化
  - TypeScript
  - TSConfig
created: 2026-04-27
---

# TypeScript 工程配置完全指南

## 一、TS 工程化价值

### 为什么需要 TypeScript

| 维度 | JavaScript | TypeScript |
|------|-----------|-----------|
| **类型安全** | ❌ 运行时才发现 | ✅ 编译时检查 |
| **IDE 支持** | 基础提示 | 智能补全、跳转到定义、重构 |
| **代码可读性** | 依赖注释和命名 | 自文档化类型 |
| **维护成本** | 随项目指数增长 | 线性增长，大项目更友好 |
| **重构信心** | 容易改出 Bug | 类型检查保驾护航 |
| **团队协作** | 依赖文档约定 | 类型即约定 |

### 工程化场景

- ✅ 大型项目开发（>5万行代码）
- ✅ 团队协作开发
- ✅ 组件库 / 工具库开发
- ✅ 复杂度高的业务逻辑
- ✅ 长期维护的项目

---

## 二、快速初始化

### 1. 从零搭建 TS 项目

```bash
# 1. 初始化
pnpm init

# 2. 安装 TypeScript
pnpm add -D typescript

# 3. 生成配置文件
npx tsc --init

# 4. 安装类型声明
pnpm add -D @types/node @types/bun
```

### 2. Vite + TS 项目

```bash
pnpm create vite@latest my-app -- --template vue-ts
# 或 react-ts

cd my-app
pnpm install
pnpm run dev
```

**生成的目录结构：**
```
my-app/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── env.d.ts       # Vite 环境类型
│   └── vite-env.d.ts
├── tsconfig.json       # TS 配置
├── tsconfig.node.json  # Node 环境 TS 配置
└── vite.config.ts
```

---

## 三、tsconfig.json 完整配置详解

### 1. 最小配置

```json
{
  "compilerOptions": {
    "target": "ES2020",          // 编译目标版本
    "useDefineForClassFields": true,
    "module": "ESNext",           // 模块系统
    "lib": ["ES2020", "DOM", "DOM.Iterable"], // 类型库
    "skipLibCheck": true,        // 跳过声明文件类型检查

    /* 模块解析 */
    "moduleResolution": "bundler", // Vite/Rollup/Webpack 模式
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,     // 导入 JSON
    "isolatedModules": true,        // 每个文件独立模块
    "noEmit": true,                 // 不输出（构建工具负责）

    /* 严格类型检查 */
    "strict": true,                  // 启用所有严格检查
    "noUnusedLocals": true,         // 未使用的局部变量报错
    "noUnusedParameters": true,     // 未使用的函数参数报错
    "noFallthroughCasesInSwitch": true, // switch case 穿透检查

    /* Vue 项目需要 */
    "jsx": "preserve"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. 关键配置项详解

#### ① 目标与模块

```json
{
  "target": "ES2020",
  // 可选值: ES3, ES5, ES6/ES2015, ES2016-ES2022, ESNext
  
  "module": "ESNext",
  // 模块系统: CommonJS / AMD / UMD / System / ES6 / ES2020 / ESNext / NodeNext
  
  "lib": ["ES2020", "DOM", "DOM.Iterable"],
  // 包含的类型库：
  // ES5/6/7/2015~2020 - JS 标准库
  // DOM - 浏览器 API
  // DOM.Iterable - DOM 迭代器
  // WebWorker - WebWorker API
  // ESNext - 最新提案
  
  "moduleResolution": "bundler",
  // 模块解析策略：
  // - Classic: 旧版 TS 模式
  // - Node10/Node16/NodeNext: Node.js 模式
  // - Bundler: 构建工具模式（Vite/Webpack/Rollup）
  
  "resolveJsonModule": true,     // 允许 import json 文件
  "allowSyntheticDefaultImports": true, // 允许默认导入没有默认导出的模块
  "esModuleInterop": true,       // CommonJS / ES 模块互操作
}
```

#### ② 严格模式配置

```json
{
  "strict": true,  // 启用所有严格检查（推荐！）
  
  // 以下是 strict=true 时自动启用的选项
  
  "noImplicitAny": true,
  // 不允许隐式 any 类型
  // ❌ function add(a, b) { return a + b }
  // ✅ function add(a: number, b: number) { return a + b }
  
  "strictNullChecks": true,
  // 严格 null 检查
  // ❌ const name: string = null
  // ✅ const name: string | null = null
  
  "strictFunctionTypes": true,
  // 函数参数严格逆变
  
  "strictBindCallApply": true,
  // bind/call/apply 参数类型检查
  
  "strictPropertyInitialization": true,
  // 类属性必须在声明或构造函数中初始化
  
  "noImplicitThis": true,
  // this 不允许隐式 any
  
  "alwaysStrict": true
  // 自动加 'use strict'
}
```

#### ③ 代码质量检查

```json
{
  "noUnusedLocals": true,      // 未使用的局部变量报错
  "noUnusedParameters": true,  // 未使用的函数参数报错
  "noImplicitReturns": true,    // 函数所有分支必须有返回值
  "noFallthroughCasesInSwitch": true, // switch case 必须有 break 或注释
  "noUncheckedIndexedAccess": true, // 数组索引访问自动加 undefined
  "noImplicitOverride": true,   // 重写父类方法必须加 override
  "noPropertyAccessFromIndexSignature": true // 不能用 . 访问索引签名属性
}
```

#### ④ 输出配置

```json
{
  "outDir": "./dist",           // 输出目录
  "rootDir": "./src",           // 源码根目录
  "sourceMap": true,            // 生成 sourcemap
  "declaration": true,          // 生成 .d.ts 声明文件（库项目必备）
  "declarationMap": true,       // 声明文件的 sourcemap
  "removeComments": true,        // 移除注释
  "importHelpers": true,         // 引入 tslib 减少重复代码
  "downlevelIteration": true     // 降级迭代器（target < ES6 时）
}
```

#### ⑤ 文件包含与排除

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  "files": [
    // 精确指定文件
    "src/main.ts"
  ]
}
```

---

## 四、不同项目类型的推荐配置

### 1. Vite + Vue 3 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* 构建模式 */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* 严格模式 */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* 路径别名 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. Vite + React 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* 构建模式 */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",  // React 17+ 不需要 import React

    /* 严格模式 */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Node.js 后端项目

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### 4. 组件库/工具库项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "declaration": true,        // 生成声明文件
    "declarationMap": true,     // 声明文件 sourcemap
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "importHelpers": true,      // 使用 tslib
    "isolatedModules": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

---

## 五、类型声明

### 1. 第三方库类型

```bash
# 安装常用类型声明
pnpm add -D @types/node @types/lodash @types/axios
```

**DefinitelyTyped 社区：**
- 99% 的常用库都有官方/社区类型声明
- 搜索：https://www.typescriptlang.org/dt/search

### 2. 全局类型声明

```typescript
// src/types/global.d.ts

// 扩展 Window
declare global {
  interface Window {
    // 全局挂载的对象
    $utils: {
      log: (msg: string) => void
    }
    // 全局常量（构建时注入）
    __APP_VERSION__: string
    __DEV__: boolean
  }
}

// 扩展导入类型
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 资源文件声明
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.json' {
  const value: any
  export default value
}

// CSS Module
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

export {}
```

### 3. 类型目录结构

```
src/
├── types/
│   ├── index.ts        # 导出公共类型
│   ├── api.d.ts        # API 相关类型
│   ├── user.d.ts       # 用户类型
│   ├── product.d.ts    # 商品类型
│   └── global.d.ts     # 全局扩展
```

---

## 六、Vite 环境变量类型

### env.d.ts

```typescript
// src/env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 基础配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_URL: string
  
  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // 其他配置
  readonly VITE_ENABLE_MOCK: 'true' | 'false'
  readonly VITE_BUILD_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### .env 文件

```bash
# .env
VITE_APP_TITLE=我的应用
VITE_APP_BASE_URL=/
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_MOCK=true
```

---

## 七、TS 脚本运行工具

### 1. tsx（推荐）

```bash
# 安装
pnpm add -D tsx

# 运行 TS 文件
tsx src/main.ts

# 开发模式（监听文件变化）
tsx watch src/main.ts
```

### 2. ts-node

```bash
# 安装
pnpm add -D ts-node

# 运行
ts-node src/main.ts

# tsconfig.json 配置项
{
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node"
  }
}
```

### 3. bun（原生支持 TS）

```bash
# 无需额外安装，bun 原生支持 TS
bun run src/main.ts
```

---

## 八、Eslint 集成

参见 [ESLint代码规范指南](./02-ESLint代码规范指南.md) 中 TypeScript 部分

---

## 九、常见问题与最佳实践

### 1. TypeScript 配置最佳实践

✅ **推荐做法：**
- 启用 `strict: true`（最重要！）
- 使用 Vite 时开启 `noEmit: true`
- 配置路径别名 `@/*` 简化导入
- 单独的 `tsconfig.node.json` 处理构建脚本
- 类型文件集中在 `src/types/` 目录

❌ **不推荐做法：**
- 大面积使用 `any`（等于白用 TS）
- 使用 `// @ts-ignore` 跳过类型检查
- `strict: false` 放弃治疗
- 类型声明到处乱放

### 2. 类型体操原则

✅ **什么时候写复杂类型：**
- 工具库、组件库公共 API
- 多人协作的公共方法

❌ **什么时候不要过度使用：**
- 业务代码（能跑通就行，维护成本高）
- 一次性脚本
- 团队 TS 水平不高时

### 3. any vs unknown vs never

```typescript
// ❌ any: 完全跳过类型检查
let val: any = 123
val = 'abc'
val()    // 不报错（但运行时失败）
val.foo  // 不报错

// ✅ unknown: 类型安全的 any（推荐）
let val: unknown = 123
val = 'abc'
val()    // ❌ 报错，unknown 不能调用
val.foo  // ❌ 报错，unknown 不能访问属性

// 需要类型收窄后才能使用
if (typeof val === 'string') {
  val.toUpperCase() // ✅
}

// never: 不可能发生的类型
function throwError(): never {
  throw new Error('error')
}
```

### 4. 类型断言 vs 类型守卫

```typescript
// ❌ 类型断言（告诉编译器"我比你懂"）
const user = JSON.parse(data) as User
// 风险：数据结构不对时运行时炸

// ✅ 类型守卫（运行时也安全）
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object'
    && obj !== null
    && typeof obj.id === 'number'
    && typeof obj.name === 'string'
  )
}

const result = JSON.parse(data)
if (isUser(result)) {
  // result 在这里类型是 User ✅
  console.log(result.name)
}
```

### 5. 第三方库没有类型？

```typescript
// 方案一：自己写一个简单声明
declare module 'some-lib' {
  export function foo(): void
}

// 方案二：临时用 any
// @ts-ignore
import * as lib from 'some-lib'

// 方案三：帮忙给 DefinitelyTyped 提 PR 😄
```

### 6. 常见报错排查

**错误 1："Cannot find module './xxx' or its corresponding type declarations"**

解决：
- 检查路径是否正确
- 检查 `tsconfig.json` 的 `paths` 配置
- 检查是否有 `.d.ts` 声明文件

**错误 2："Type 'string | null' is not assignable to type 'string'"**

解决：
```typescript
// 方案一：非空断言（确定一定有值时）
func(name!)

// 方案二：给默认值
func(name ?? 'default')

// 方案三：提前判断返回
if (!name) return
func(name)
```

**错误 3："Property 'xxx' does not exist on type 'Window'"**

解决：见上面"全局类型声明"

---

## 十、TS 配置检查与升级

```bash
# 检查 tsconfig 是否有问题
npx tsc --showConfig

# 查看最终生效的配置
npx tsc --showConfig | jq .compilerOptions

# 只做类型检查，不生成文件
npx tsc --noEmit

# 监听模式
npx tsc --watch

# 升级 TypeScript
pnpm update typescript --latest
```

---

## 总结

| 场景 | 推荐配置 |
|------|---------|
| **Vite + Vue/React** | `noEmit: true`, `moduleResolution: bundler` |
| **Node 后端** | `module: NodeNext`, `declaration: true` |
| **组件库** | `declaration: true`, `declarationMap: true` |
| **所有项目** | `strict: true`（必须！） |

**配置建议顺序：**
1. 从 `strict: true` 开始
2. 团队受不了再逐步放宽（不推荐）
3. 业务代码可以适当宽松，工具库必须严格

**下一篇：** [Vite快速上手指南](./05-Vite快速上手指南.md)
