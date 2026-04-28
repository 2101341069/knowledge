---
title: Vite高级特性与原理
tags:
  - 前端
  - 工程化
  - Vite
  - 性能优化
created: 2026-04-28
---

# Vite 高级特性与原理 - 从入门到精通

## 一、Vite 核心架构深度解析

### 1.1 Vite 设计哲学与核心优势

#### 为什么 Vite 这么快？

| 特性 | Webpack | Vite | 提升幅度 |
|------|---------|------|---------|
| 冷启动时间 | 全量打包构建依赖图 | 按需编译，浏览器原生 ESM | **10-100x** |
| 热更新速度 | 重新构建整个模块链 | HMR 边界精确到模块 | **5-20x** |
| 内存占用 | 高（完整依赖图） | 低（按需加载） | **降低 50-70%** |

---

### 1.2 Vite 双引擎架构全景

```
┌─────────────────────────────────────────────────────────────────┐
│                        开发环境（Dev Server）                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Koa + Connect 中间件层                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │  插件系统  │──│  依赖预构建 │──│  转换请求   │──│  HMR    │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓ 原生 ESM 导入                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      现代浏览器                             │   │
│  │  <script type="module" src="/src/main.js"></script>      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        生产环境（Rollup 构建）                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │  Tree Shaking │──│  代码分割    │──│  压缩与优化        │    │
│  └─────────────┘  └─────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.3 开发服务器核心原理

#### 请求处理流水线

```javascript
// Vite 内部中间件执行顺序
const middlewares = [
  // 1. 时间统计
  timeStatsMiddleware,
  
  // 2. 日志与报错美化
  launchEditorMiddleware,
  
  // 3. 代理（优先处理）
  proxyMiddleware,
  
  // 4. CORS 支持
  corsMiddleware,
  
  // 5. 插件：transformIndexHtml（处理 HTML）
  htmlFallbackMiddleware,
  indexHtmlMiddleware,
  
  // 6. 处理 public 目录资源
  servePublicMiddleware,
  
  // 7. 插件：resolveId / load / transform
  transformMiddleware,  // ⭐ 核心转换
  
  // 8. 模块解析缓存
  cachedTransformMiddleware,
  
  // 9. 静态资源服务
  serveStaticMiddleware,
]
```

#### 核心请求处理流程

```typescript
// transformMiddleware 核心逻辑
async function transformMiddleware(req, res, next) {
  const url = req.url
  
  // 1. 跳过非 JS/TS/Vue 等资源
  if (!isTransformRequest(url)) return next()
  
  // 2. 检查缓存（内存 + 磁盘）
  const cacheKey = getCacheKey(url)
  const cached = await moduleGraph.getModuleByUrl(url)
  if (cached && cached.lastHMRTimestamp < mtime) {
    return send(cached.code)
  }
  
  // 3. 调用插件管道处理
  const result = await pluginContainer.transform(url, source)
  
  // 4. 注入 import 分析
  const code = await injectHMRRuntime(result.code)
  
  // 5. 发送响应，设置缓存头
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'application/javascript')
  res.end(code)
}
```

---

## 二、依赖预构建（Dep Optimization）深度解析

### 2.1 为什么需要预构建？

**三大核心问题：**

1. **CommonJS 兼容** - 浏览器只支持 ESM，第三方库大量使用 CommonJS
2. **路径重写** - `import 'lodash'` → `import '/node_modules/lodash-es/lodash.js'`
3. **性能优化** - 将多个小模块合并，减少 HTTP 请求数

---

### 2.2 预构建完整流程

```
┌─────────────────────────────────────────────────────────┐
│                    预构建扫描阶段                          │
│  1. 扫描所有入口文件                                     │
│  2. 静态分析 import 语句                                 │
│  3. 收集第三方依赖列表（node_modules 中的包）              │
│  4. 排除优化白名单 exclude                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    ESBuild 打包阶段                       │
│  1. esbuild.build() 打包每个依赖                         │
│  2. CommonJS → ESM 转换                                  │
│  3. 打包产物写入 cache 目录                              │
│  4. 生成 _metadata.json 元数据                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    运行时重写阶段                          │
│  import { ref } from 'vue'                               │
│                          ↓                                │
│  import { ref } from '/node_modules/.vite/deps/vue.js'   │
└─────────────────────────────────────────────────────────┘
```

---

### 2.3 高级配置详解

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // ⭐ 强制预构建的依赖（动态导入的包不会被自动扫描）
    include: [
      'lodash-es',
      'dayjs',
      'dayjs/plugin/relativeTime',  // 动态导入的子模块
      '@vueuse/core > @vueuse/shared'  // 嵌套依赖
    ],
    
    // ⭐ 跳过预构建（用于 ESM 原生支持的包）
    exclude: [
      'vue',          // Vue 3 已是纯 ESM
      '@vue/runtime-core'
    ],
    
    // ⭐ ESBuild 自定义配置
    esbuildOptions: {
      target: 'es2020',
      define: {
        __VERSION__: JSON.stringify('1.0.0')
      },
      plugins: [
        // 自定义 esbuild 插件
      ]
    },
    
    // ⭐ 强制重新构建（清除缓存）
    force: true
  }
})
```

#### 预构建缓存机制

```
node_modules/.vite/
├── deps/
│   ├── vue.js              # 打包后的 vue
│   ├── vue.js.map          # sourcemap
│   ├── lodash-es.js
│   └── ...
├── deps/_metadata.json     # 元数据，记录 hash
└── deps_temp/              # 临时构建目录
```

**缓存失效条件：**
- `package.json` 依赖变更
- `vite.config.*` 中 `optimizeDeps` 变更
- 锁文件（package-lock.json/yarn.lock/pnpm-lock.yaml）变更
- `NODE_ENV` 变更
- `force: true` 强制刷新

---

### 2.4 常见问题与解决方案

**问题 1：动态导入的依赖未被预构建**
```typescript
// ❌ 这样的动态导入不会被扫描到
const loadModule = async (name) => {
  return import(`./modules/${name}.ts`)  // 变量导入
}

// ✅ 解决方案：在 optimizeDeps.include 中手动添加
optimizeDeps: {
  include: ['./modules/*']  // 支持 glob
}
```

**问题 2：依赖有循环引用导致构建失败**
```typescript
optimizeDeps: {
  exclude: ['problematic-package']  // 排除有问题的包
}
```

---

## 三、HMR（热模块替换）深度原理

### 3.1 HMR 完整通信流程

```
┌─────────────┐     WebSocket     ┌─────────────┐
│   浏览器      │◀────────────────▶│  Vite Server │
│  (Client)    │                   │             │
└─────────────┘                   └─────────────┘
       │                                │
       │  1. import.meta.hot 连接       │
       │───────────────────────────────▶│
       │                                │
       │  2. 文件变化（chokidar 监听）   │
       │◀───────────────────────────────│
       │     type: "update"             │
       │                                │
       │  3. 请求更新后的模块            │
       │───────────────────────────────▶│
       │     GET /src/Component.vue     │
       │                                │
       │  4. 执行模块重加载             │
       │◀───────────────────────────────│
       │     调用 accept 回调            │
```

---

### 3.2 HMR API 高级用法

```typescript
// 基础用法
if (import.meta.hot) {
  import.meta.hot.accept('./module.ts', (newModule) => {
    // 模块更新后的回调
    console.log('Module updated!', newModule)
  })
}

// 🔴 自接受（Self Accept）
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // 当前模块更新时触发
    // 常用于 UI 组件的重新渲染
  })
}

// 🟡 处置旧模块（Dispose）
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // 清理副作用
    clearInterval(timer)
    eventBus.off('event', handler)
    
    // 传递数据给新模块
    data.savedState = currentState
  })
  
  // 接收上一个模块的数据
  const prevData = import.meta.hot.data
}

// 🟢 自定义 HMR 事件
if (import.meta.hot) {
  // 发送到服务端
  import.meta.hot.send('custom-event', { foo: 'bar' })
  
  // 监听服务端事件
  import.meta.hot.on('server-event', (payload) => {
    console.log('From server:', payload)
  })
}
```

---

### 3.3 Vue 单文件组件 HMR 实现

```typescript
// @vitejs/plugin-vue 核心逻辑
function vueHMRPlugin() {
  return {
    name: 'vite:vue-hmr',
    
    async transform(code, id) {
      if (!/\.vue$/.test(id)) return
      
      // 1. 生成唯一 ID
      const instanceId = JSON.stringify(hash(id))
      
      // 2. 注入 HMR 运行时代码
      const hmrCode = `
        import { createHotContext } from "/@vite/client"
        import.meta.hot = createHotContext(${instanceId})
        
        if (import.meta.hot) {
          const api = __VUE_HMR_RUNTIME__
          
          // 模板更新：重新渲染
          if (isTemplateChange) {
            api.rerender(${instanceId}, render)
          }
          
          // 脚本更新：销毁重建
          if (isScriptChange) {
            api.reload(${instanceId}, component)
          }
          
          // 样式更新：内联替换
          if (isStyleChange) {
            updateStyle(id, newStyles)
          }
        }
      `
      
      return code + hmrCode
    }
  }
}
```

---

## 四、插件系统深度解析

### 4.1 插件钩子完整生命周期

```
                     服务启动
                        │
         ┌──────────────┴──────────────┐
         │        config 钩子           │  解析配置
         │        configResolved        │  配置确定
         │        configureServer       │  配置开发服务器
         │        buildStart            │  构建开始
         └──────────────┬──────────────┘
                        │
┌───────────────────────┼───────────────────────┐
│     每个请求 / 模块    │                       │
│         ↓             │                       │
│  resolveId 钩子  ───→ │  解析模块路径          │
│         ↓             │                       │
│  load 钩子       ───→ │  加载模块源码          │
│         ↓             │                       │
│  transform 钩子  ───→ │  转换代码（TS→JS等）  │
│         ↓             │                       │
│  moduleParsed   ───→ │  模块解析完成          │
└───────────────────────┼───────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │    transformIndexHtml       │  转换 HTML
         │    buildEnd                 │  构建结束
         │    generateBundle           │  生成 bundle
         │    writeBundle              │  写入文件
         │    closeBundle              │  关闭打包
         └─────────────────────────────┘
```

---

### 4.2 手写一个功能完整的插件

```typescript
// plugins/vite-plugin-xxx.ts
import type { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'

export default function myPlugin(options = {}): Plugin {
  const filter = createFilter(
    options.include || /\.ts$/,
    options.exclude || /node_modules/
  )
  
  let config: ResolvedConfig
  
  return {
    name: 'vite-plugin-xxx',
    
    // 🔧 修改 Vite 配置
    config(config, env) {
      return {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '../src')
          }
        }
      }
    },
    
    // 📌 获取最终解析后的配置
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    
    // 🖥️ 配置开发服务器
    configureServer(server) {
      // 添加自定义中间件
      server.middlewares.use('/api', (req, res) => {
        res.end('Hello from custom middleware!')
      })
      
      // 监听服务器事件
      server.httpServer?.on('listening', () => {
        console.log('Server started!')
      })
    },
    
    // 🔍 自定义模块解析
    resolveId(source, importer, options) {
      if (source === 'virtual-module') {
        // 返回虚拟模块 ID（加 \0 是约定）
        return '\0virtual-module'
      }
    },
    
    // 📥 加载模块内容
    load(id, options) {
      if (id === '\0virtual-module') {
        // 返回虚拟模块的代码
        return `
          export const message = 'Hello from virtual module!'
          export const version = ${JSON.stringify(config.env.VITE_VERSION)}
        `
      }
    },
    
    // ✨ 转换代码
    transform(code, id, options) {
      if (!filter(id)) return
      
      // 只在开发环境生效
      if (config.command !== 'serve') return
      
      // 代码转换逻辑
      const transformed = code
        .replace(/__ENV__/g, JSON.stringify(config.mode))
        .replace(/__DEV__/g, String(config.isDevelopment))
      
      return {
        code: transformed,
        map: null  // 可以生成 sourcemap
      }
    },
    
    // 📄 转换 HTML
    transformIndexHtml(html, ctx) {
      return html
        .replace(
          '<head>',
          `<head>
            <meta name="app-version" content="${config.env.VITE_VERSION}">
          `
        )
    },
    
    // 📦 构建结束钩子
    closeBundle() {
      console.log('✅ Build completed!')
    }
  }
}
```

---

### 4.3 常用插件推荐与最佳配置

#### 🎨 CSS 相关插件

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    
    // 🚀 自动导入 API（useRouter, ref 等）
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',  // 生成类型声明
      eslintrc: { enabled: true }     // 生成 eslint 配置
    }),
    
    // 🧩 自动注册组件
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ prefix: 'icon' })
      ],
      dirs: ['src/components'],
      dts: 'src/components.d.ts'
    }),
    
    // 🎯 图标按需加载（支持 100+ 图标库）
    Icons({
      autoInstall: true,
      compiler: 'vue3'
    })
  ]
})
```

---

## 五、生产环境构建优化

### 5.1 Rollup 构建调优

```typescript
export default defineConfig({
  build: {
    // ⭐ 构建目标
    target: 'es2020',  // 现代浏览器：es2020，兼容：modules
    
    // ⭐ 代码分割策略
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          // Vue 生态单独打包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          
          // UI 库单独打包
          'ui-vendor': ['element-plus'],
          
          // 工具库
          'utils': ['lodash-es', 'dayjs', 'axios'],
          
          // 图表库（体积大）
          'charts': ['echarts']
        },
        
        // 自定义输出文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop()
          if (['css'].includes(ext)) {
            return `css/[name]-[hash].[ext]`
          }
          if (['png', 'jpg', 'svg', 'gif'].includes(ext)) {
            return `img/[name]-[hash].[ext]`
          }
          return `assets/[name]-[hash].[ext]`
        }
      }
    },
    
    // ⭐ 压缩配置
    minify: 'terser',  // 或 'esbuild'（更快，压缩率略低）
    
    terserOptions: {
      compress: {
        drop_console: true,      // 移除 console
        drop_debugger: true,     // 移除 debugger
        pure_funcs: ['console.log', 'console.info']
      }
    },
    
    // ⭐ 报告分析
    reportCompressedSize: true,  // 显示 gzip 后大小
    chunkSizeWarningLimit: 500,  // 警告阈值（KB）
    
    // ⭐ 生成 sourcemap（生产环境可选）
    sourcemap: false
  }
})
```

---

### 5.2 高级性能优化配置

```typescript
export default defineConfig({
  // ⭐ 依赖预构建优化
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'lodash-es',
      'dayjs',
      'echarts/core',
      'echarts/charts',
      'echarts/renderers'
    ]
  },
  
  // ⭐ CSS 代码分割
  css: {
    codeSplit: true,  // 按模块分割 CSS
    
    // CSS 预处理器配置
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixins.scss" as *;
        `,
        javascriptEnabled: true
      }
    },
    
    // PostCSS 配置（也可放 postcss.config.js）
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true }
          }]
        })
      ]
    }
  },
  
  // ⭐ 预加载提示
  modulePreload: {
    polyfill: true,  // 注入 ES Module preload polyfill
    
    // 自定义预加载策略
    resolveDependencies(filename, deps, context) {
      // 排除某些大 chunk 自动预加载
      if (filename.includes('charts')) {
        return []
      }
      return deps
    }
  }
})
```

---

### 5.3 构建产物分析

```bash
# 安装分析工具
npm i -D rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    // 📊 可视化分析报告
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

**分析重点关注：**
1. 🚨 单个 chunk > 200KB - 考虑拆分
2. 🔄 重复依赖 - 检查是否多次打包
3. 📦 大型第三方库 - 考虑 CDN 引入
4. 🧩 未使用的代码 - Tree Shaking 检查

---

## 六、SSR / SSG 服务端渲染

### 6.1 Vite SSR 基础架构

```
┌─────────────────────────────────────────────────────────┐
│                     客户端 Entry                          │
│  src/entry-client.ts → 挂载到 DOM                        │
└─────────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────────┐
│                     同构 App 代码                         │
│  src/App.vue, src/router.ts, src/store.ts               │
│  ⚠️ 注意：避免浏览器 API 在服务端执行                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     服务端 Entry                          │
│  src/entry-server.ts → 返回渲染函数                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     Node.js 服务器                        │
│  server.js → 调用 renderToString → 返回 HTML             │
└─────────────────────────────────────────────────────────┘
```

---

### 6.2 服务端渲染完整实现

```typescript
// server.js
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()
  
  // 创建 Vite 开发服务器（中间件模式）
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'  // 不使用 Vite 内置 HTML 处理
  })
  
  // 使用 Vite 中间件
  app.use(vite.middlewares)
  
  // 处理所有请求
  app.use('*', async (req, res) => {
    const url = req.originalUrl
    
    try {
      // 1. 读取模板 HTML
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )
      
      // 2. 应用 Vite HTML 转换
      template = await vite.transformIndexHtml(url, template)
      
      // 3. 加载服务端入口
      //    vite.ssrLoadModule 自动处理转换！
      const { render } = await vite.ssrLoadModule(
        '/src/entry-server.ts'
      )
      
      // 4. 渲染应用 HTML
      const { appHtml, headTags, initialState } = await render(url)
      
      // 5. 注入渲染结果到模板
      const html = template
        .replace('<!--app-html-->', appHtml)
        .replace('<!--head-tags-->', headTags)
        .replace(
          '<!--initial-state-->',
          `<script>window.__INITIAL_STATE__=${JSON.stringify(initialState)}</script>`
        )
      
      // 6. 返回响应
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      
    } catch (e) {
      // 美化错误栈
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
  
  app.listen(3000, () => {
    console.log('http://localhost:3000')
  })
}

createServer()
```

---

## 七、常见问题与性能调优

### 7.1 开发环境慢？检查这些配置

```typescript
export default defineConfig({
  // ⚡ 开启预构建强缓存
  optimizeDeps: {
    force: false,  // 不要强制刷新
    // 把大型依赖加入 include，提前预构建
    include: ['element-plus', 'echarts', 'lodash']
  },
  
  // 🚀 使用更快的文件监听（Windows 尤其重要）
  server: {
    watch: {
      usePolling: false,  // 关闭轮询，快很多
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**'
      ]
    },
    
    // 启动时不自动打开浏览器
    open: false,
    
    // CORS 支持
    cors: true
  },
  
  // 💡 关闭不必要的功能
  css: {
    devSourcemap: false  // 开发环境 CSS sourcemap 影响性能
  }
})
```

---

### 7.2 依赖预构建问题排查

**问题：启动时 "new dependencies optimized" 频繁出现**

这是因为动态导入的依赖在运行时才被发现，导致重新预构建和页面刷新。

**解决方案：**
```typescript
optimizeDeps: {
  // 把所有动态导入的依赖都提前列出来
  include: [
    'vue',
    'vue-router',
    'pinia',
    // 动态导入的路由组件中的依赖
    'echarts',
    'xlsx',
    'dayjs'
  ]
}
```

---

### 7.3 常用性能优化插件

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 🚀 压缩图片
import viteImagemin from 'vite-plugin-imagemin'

// 📦 gzip / brotli 压缩
import viteCompression from 'vite-plugin-compression'

// ⚡ CDN 外部化（externals）
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    vue(),
    
    // 🖼️ 图片压缩
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.9] }
    }),
    
    // 💨 gzip 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,  // 大于 10KB 压缩
      algorithm: 'gzip',
      ext: '.gz'
    }),
    
    // 🌐 CDN 引入大体积库
    importToCDN({
      modules: [
        {
          name: 'echarts',
          var: 'echarts',
          path: 'dist/echarts.min.js'
        }
      ]
    })
  ]
})
```

---

## 八、与 Webpack 迁移指南

### 8.1 常见功能迁移对照表

| 功能 | Webpack | Vite |
|------|---------|------|
| 路径别名 | resolve.alias | resolve.alias |
| CSS 预处理器 | loader | css.preprocessorOptions |
| 代理 | devServer.proxy | server.proxy |
| 环境变量 | DefinePlugin | import.meta.env |
| 代码分割 | splitChunks | build.rollupOptions.output |
| 构建分析 | webpack-bundle-analyzer | rollup-plugin-visualizer |
| 热更新 | HMR plugin | 内置 HMR |
| 静态资源 | asset modules | 内置支持 |

---

### 8.2 迁移 checklist

✅ **项目结构** - 保持不变，Vite 不需要特殊目录结构

✅ **入口文件** - index.html 移到根目录（而不是 public）

✅ **环境变量** - `process.env` → `import.meta.env`

```typescript
// 旧代码
const API_URL = process.env.VUE_APP_API_URL

// 新代码
const API_URL = import.meta.env.VITE_API_URL
```

✅ **动态 import 路径** - Vite 不支持变量路径，需要 glob 导入

```typescript
// ❌ 不支持
import(`./locales/${lang}.json`)

// ✅ 使用 glob 导入
const modules = import.meta.glob('./locales/*.json')
const langModule = modules[`./locales/${lang}.json`]
```

✅ **CommonJS 依赖** - 大部分自动处理，有问题加 `optimizeDeps.include`

---

## 总结

**Vite 核心优势回顾：**
1. ⚡ **开发体验** - 冷启动快，热更新即时，真正的按需编译
2. 🎯 **现代化** - 原生 ESM、HTTP2、ESBuild 前沿技术
3. 🧩 **插件化** - Rollup 兼容的插件 API，生态丰富
4. 📦 **生产优化** - 内置最佳实践，开箱即用

**性能优化三大方向：**
- **开发速度** - 合理配置 `optimizeDeps`，减少重复预构建
- **产物体积** - 代码分割、Tree Shaking、压缩、CDN
- **运行性能** - 懒加载、预加载、资源优化

---

**下一篇：** [Rollup库打包最佳实践](./03-Rollup库打包最佳实践.md)
