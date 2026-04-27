---
title: Vite快速上手指南
tags:
  - 前端
  - 工程化
  - Vite
  - 构建工具
created: 2026-04-27
---

# Vite 快速上手指南

## 一、Vite 是什么

### Vite 的两大核心

| 特性 | 说明 |
|------|------|
| **开发服务器** | 基于 ES 模块的开发服务器，**毫秒级冷启动** |
| **构建命令** | 基于 Rollup 的生产构建，预配置优化 |

### 为什么比 Webpack 快

| Webpack 问题 | Vite 解决方案 |
|-------------|-------------|
| ❌ 启动时需要遍历打包所有文件 | ✅ 按需编译，浏览器请求时才编译 |
| ❌ 修改后重新打包整个模块树 | ✅ 利用 HMR，只更新变更的模块 |
| ❌ bundle 体积越大，速度越慢 | ✅ 速度与项目大小无关 |
| ❌ 大量 loader 处理开销 | ✅ 利用浏览器原生 ESM，减少中间步骤 |

### 性能对比

| 指标 | Vite | Webpack |
|------|------|---------|
| 冷启动 | ~200ms | ~30s |
| 热更新 | 即时（<50ms） | 几秒到几十秒 |
| 内存占用 | 低 | 高 |
| 构建速度 | Rollup 优化 | 较慢 |

---

## 二、快速开始

### 创建项目

```bash
# npm
npm create vite@latest

# pnpm（推荐）
pnpm create vite

# yarn
yarn create vite

# 指定模板
pnpm create vite my-vue-app -- --template vue
pnpm create vite my-react-app -- --template react
pnpm create vite my-vanilla-app -- --template vanilla
```

**官方模板列表：**
- `vanilla` - 原生 JS
- `vue` / `vue-ts` - Vue 3
- `react` / `react-ts` - React
- `preact` / `preact-ts` - Preact
- `svelte` / `svelte-ts` - Svelte
- `solid` / `solid-ts` - SolidJS
- `lit` / `lit-ts` - Web Components
- `qwik` / `qwik-ts` - Qwik

### 项目结构

```
my-vue-app/
├── node_modules/
├── public/              # 静态资源，不被打包
│   └── favicon.ico
├── src/
│   ├── assets/          # 资源文件（会被打包处理）
│   │   └── vue.svg
│   ├── components/      # 组件
│   │   └── HelloWorld.vue
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   ├── style.css        # 全局样式
│   └── vite-env.d.ts    # Vite 类型声明
├── index.html           # 入口 HTML
├── package.json
├── tsconfig.json        # TS 配置
├── tsconfig.node.json   # 构建脚本 TS 配置
└── vite.config.ts       # Vite 配置
```

### 常用命令

```json
{
  "scripts": {
    "dev": "vite",                # 启动开发服务器
    "build": "vue-tsc && vite build",  # 生产构建
    "preview": "vite preview"     # 预览构建产物
  }
}
```

```bash
# 启动开发（默认端口 5173）
pnpm dev

# 构建生产版本
pnpm build

# 本地预览生产构建（测试构建结果）
pnpm preview
```

---

## 三、vite.config.ts 配置详解

### 基础配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 插件
  plugins: [vue()],
  
  // 项目根目录
  root: process.cwd(),
  
  // 开发或生产环境服务的公共基础路径
  base: '/',
  // base: '/sub-path/',  // 部署在子路径
  
  // 开发服务器配置
  server: {
    host: '0.0.0.0',   // 监听所有地址
    port: 3000,         // 端口
    open: true,         // 自动打开浏览器
    cors: true,         // 允许跨域
    
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true  // WebSocket 代理
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',           // 输出目录
    assetsDir: 'assets',       // 静态资源目录
    sourcemap: false,          // 生成 sourcemap
    minify: 'esbuild',         // 压缩方式：esbuild / terser / false
    target: 'modules',         // 目标浏览器：modules / es2020 / edge
    
    // 拆包配置
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-lib': ['ant-design-vue']
        }
      }
    },
    
    // 警告阈值（kb）
    chunkSizeWarningLimit: 500
  },
  
  // 预构建配置
  optimizeDeps: {
    include: ['lodash-es', 'axios'],  // 强制预构建
    exclude: ['some-esm-only-lib']    // 排除预构建
  }
})
```

### 路径别名配置

```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  }
})
```

**配套 tsconfig.json：**
```json
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

---

## 四、核心概念

### 1. 依赖预构建

**问题：**
- node_modules 中有大量 CommonJS 模块
- 一个包可能有几百个模块请求

**Vite 的解决：**
1. 启动时扫描代码中用到的依赖
2. 使用 esbuild 打包成单个 ESM 模块
3. 缓存到 `node_modules/.vite/`
4. 后续直接使用缓存

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // 强制预构建（可能 Vite 没自动检测到）
    include: ['some-dep', 'another-dep'],
    
    // 排除预构建
    exclude: ['some-esm-only-lib'],
    
    // 强制预构建（首次启动慢，后续快）
    force: true
  }
})
```

**清除预构建缓存：**
```bash
rm -rf node_modules/.vite
# 或
npx vite --force
```

### 2. 热模块替换（HMR）

Vite 的 HMR 基于 ESM，速度极快。

**组件 HMR（Vue 3）：**
```typescript
// vite 内置，vue 插件自动支持
// 保存组件时，不刷新页面，只更新组件状态
```

**自定义 HMR：**
```javascript
// my-module.js
export const count = 0

// 热更新处理
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    console.log('Module updated:', newModule)
  })
  
  import.meta.hot.dispose(() => {
    // 清理副作用
    console.log('Old module disposed')
  })
}
```

### 3. 环境变量

```bash
# .env                # 所有情况加载
# .env.local          # 所有情况加载，被 git 忽略
# .env.development    # 开发环境
# .env.production     # 生产环境
```

```bash
# .env.development
VITE_APP_TITLE=我的应用
VITE_API_BASE_URL=http://localhost:8080/api
DB_PASSWORD=123456  # 没有 VITE_ 前缀，不会暴露
```

**使用：**
```typescript
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.MODE)        // development / production
console.log(import.meta.env.DEV)         // true / false
console.log(import.meta.env.PROD)        // true / false
console.log(import.meta.env.SSR)         // 是否 SSR
```

**自定义环境变量类型：**
```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**指定模式运行：**
```bash
vite --mode staging
vite build --mode staging
```

---

## 五、功能特性

### 1. CSS 处理

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    // CSS Modules
    modules: {
      localsConvention: 'camelCaseOnly',
      scopeBehaviour: 'local'
    },
    
    // 预处理器配置
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `
      }
    }
  }
})
```

**使用 CSS Modules：**
```vue
<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Hello</h1>
  </div>
</template>

<style module>
.container { padding: 20px; }
.title { color: blue; }
</style>
```

### 2. 静态资源处理

```typescript
// 1. 导入资源
import logo from './assets/logo.png'
// logo = '/src/assets/logo.png'（开发）
// logo = '/assets/logo.xxxx.png'（生产）

// 2. 显式指定导入方式
import url from './assets/file?url'         // URL
import raw from './assets/file?raw'         // 字符串内容
import worker from './worker?worker'        // Web Worker
import wasm from './module.wasm?init'      // WebAssembly

// 3. 公共目录
// public/ 目录下的文件直接 /filename 访问
// public/favicon.ico → /favicon.ico
```

### 3. JSON 导入

```typescript
// 直接导入
import pkg from '../package.json'
console.log(pkg.version)

// 具名导入（Tree Shaking 友好）
import { version } from '../package.json'
console.log(version)
```

### 4. Glob 导入

```typescript
// 批量导入多个文件
const modules = import.meta.glob('./modules/*.ts')
// modules = { './modules/a.ts': () => import(...), ... }

// 立即导入
const modules = import.meta.glob('./modules/*.ts', { eager: true })

// 批量导入 Vue 组件
const components = import.meta.globEager('../components/*.vue')
Object.keys(components).forEach((path) => {
  const name = path.match(/\.\/components\/(.*)\.vue$/)[1]
  app.component(name, components[path].default)
})
```

---

## 六、插件生态

### 常用插件列表

| 插件 | 用途 |
|------|------|
| `@vitejs/plugin-vue` | Vue 3 支持 |
| `@vitejs/plugin-vue-jsx` | Vue JSX 支持 |
| `@vitejs/plugin-react` | React 支持 |
| `vite-plugin-pwa` | PWA 支持 |
| `vite-plugin-pages` | 基于文件系统的路由 |
| `vite-plugin-vue-layouts` | 布局系统 |
| `vite-plugin-inspect` | 检查中间状态 |
| `vite-plugin-compression` | 压缩 gzip/brotli |
| `vite-plugin-dts` | 生成 d.ts 声明文件 |

### 插件配置示例

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    vue(),
    
    // PWA 支持
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My App',
        short_name: 'App',
        icons: [/* ... */]
      }
    }),
    
    // 开发调试插件
    Inspect()
  ]
})
```

---

## 七、性能优化

### 1. 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 目标浏览器版本
    target: 'es2020',
    
    // 代码压缩（esbuild 比 terser 快 20-40x）
    minify: 'esbuild',
    
    // 拆包策略
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['ant-design-vue', '@ant-design/icons-vue'],
          'utils': ['lodash-es', 'date-fns']
        }
      }
    }
  }
})
```

### 2. 大体积分析

```bash
# 安装插件
pnpm add -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      filename: 'dist/stats.html'
    })
  ]
})
```

```bash
pnpm build
# 自动打开浏览器查看包体积分析
```

### 3. 常见优化点

1. ✅ 使用 `lodash-es` 代替 `lodash`
2. ✅ 按需引入 UI 组件
3. ✅ 路由懒加载
4. ✅ 大库用 CDN
5. ✅ 分析打包体积，移除冗余代码

---

## 八、常见问题

### 1. 依赖预构建导致的问题

**问题：** 某些包预构建后出问题

**解决：**
```bash
# 清除缓存重新构建
rm -rf node_modules/.vite
pnpm dev --force
```

### 2. 开发环境 vs 生产环境

| 特性 | 开发 | 生产 |
|------|------|------|
| 模块格式 | ESM（浏览器直接加载） | Rollup 打包 |
| 压缩 | 不压缩 | esbuild 压缩 |
| SourceMap | 完整 | 可配置 |
| 环境变量 | DEV = true | PROD = true |
| HMR | 支持 | 不支持 |

### 3. CommonJS 兼容性

Vite 开发环境只支持 ESM，CommonJS 包会被自动转换。

**遇到 CommonJS 问题：**
1. 找 ESM 版本的包
2. 配置 `optimizeDeps.include` 强制预构建
3. 使用插件 `@rollup/plugin-commonjs`

### 4. 代理不生效？

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    // 重要：前端请求 /api/users → 实际 http://localhost:8080/users
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### 5. 类型检查？

Vite 只做编译，**不做类型检查**。

**类型检查配置：**
```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build",
    "typecheck": "vue-tsc --noEmit --watch"
  }
}
```

---

## 总结

| 场景 | 最佳实践 |
|------|---------|
| **新项目** | 直接用 Vite |
| **开发模式** | 不用关心细节，快就完事了 |
| **环境变量** | 用 VITE_ 前缀，类型化 |
| **路径别名** | 配置 `@/*` → `src/*` |
| **构建优化** | 配置 manualChunks 拆包 |

**下一篇：** [Webpack基础配置](./06-Webpack基础配置.md)
