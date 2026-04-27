---
title: Vite与构建优化
tags:
  - 前端
  - Vue
  - Vue3
  - Vite
  - 构建优化
created: 2026-04-27
---

# Vite与构建优化

## Vite 配置基础

### 基础配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // 插件
  plugins: [vue()],

  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },

  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
```

## 开发环境优化

### 依赖预构建优化

```typescript
export default defineConfig({
  optimizeDeps: {
    // 强制预构建的依赖
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'lodash-es'
    ],
    // 排除预构建的依赖
    exclude: ['@myorg/awesome-lib'],
    // 预构建时的 esbuild 选项
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
```

### 热更新优化

```typescript
export default defineConfig({
  server: {
    hmr: {
      // 只在开发环境启用
      overlay: true, // 错误覆盖层
    },
    // 预热常用文件，减少首次加载时间
    warmup: {
      clientFiles: [
        './src/main.ts',
        './src/App.vue',
        './src/components/*.vue'
      ]
    }
  }
})
```

## 生产构建优化

### 代码分割

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心库
          vue: ['vue', '@vue/runtime-core'],
          // 路由和状态管理
          router: ['vue-router'],
          pinia: ['pinia'],
          // UI 库
          ui: ['ant-design-vue', '@ant-design/icons-vue'],
          // 工具库
          utils: ['lodash-es', 'date-fns', 'axios'],
          // 图表
          charts: ['echarts', 'vue-echarts']
        },
        // 资源文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop()
          if (ext === 'css') return 'css/[name]-[hash].css'
          if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext)) {
            return 'images/[name]-[hash].[ext]'
          }
          if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
            return 'fonts/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
})
```

### 压缩优化

```typescript
import terser from '@rollup/plugin-terser'

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true // Safari 10 兼容
      },
      format: {
        comments: false // 移除注释
      }
    },
    // 禁用 gzip 压缩大小报告，提高构建速度
    reportCompressedSize: false,
    // 增大 chunk 大小警告限制
    chunkSizeWarningLimit: 1000
  }
})
```

### CSS 优化

```typescript
export default defineConfig({
  css: {
    devSourcemap: true,
    // CSS 预处理器配置
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `,
        api: 'modern-compiler'
      }
    },
    // Lightning CSS (比 PostCSS 更快)
    transformer: 'lightningcss',
    lightningcss: {
      cssModules: {
        pattern: '[local]_[hash:base64:5]'
      }
    }
  }
})
```

## 图片优化

### 使用 vite-plugin-image-optimizer

```bash
npm install -D vite-plugin-image-optimizer
```

```typescript
import { imageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    vue(),
    imageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp)$/i,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: true
      },
      png: {
        quality: 80
      },
      jpeg: {
        quality: 80
      },
      webp: {
        lossless: true
      }
    })
  ]
})
```

### 图片自动转 WebP

```typescript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    vue(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ]
})
```

## 代码分析

### 打包分析

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true, // 自动打开浏览器
      filename: 'dist/stats.html',
      title: 'Bundle Analysis',
      // 可选: 'sunburst' | 'treemap' | 'network'
      template: 'treemap',
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

## 环境变量与模式

### 类型化环境变量

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ENABLE_MOCK: 'true' | 'false'
  readonly VITE_UPLOAD_MAX_SIZE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

```env
# .env
VITE_APP_TITLE=My Vue App

# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_MOCK=true

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MOCK=false
```

## 插件开发

### 自定义 Vite 插件

```typescript
// plugins/vite-plugin-vue-auto-import.ts
import type { Plugin } from 'vite'

export default function VueAutoImport(): Plugin {
  return {
    name: 'vite-plugin-vue-auto-import',
    enforce: 'pre',

    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        // 自动导入常用 composables
        const autoImports = `
          import { ref, reactive, computed, watch, onMounted } from 'vue'
          import { useRouter, useRoute } from 'vue-router'
        `
        const scriptSetupIndex = code.indexOf('<script setup')
        if (scriptSetupIndex > -1) {
          const closeTagIndex = code.indexOf('>', scriptSetupIndex)
          return (
            code.slice(0, closeTagIndex + 1) +
            autoImports +
            code.slice(closeTagIndex + 1)
          )
        }
      }
      return code
    },

    // 配置开发服务器
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义中间件
        console.log(`Request: ${req.url}`)
        next()
      })
    },

    // 构建完成钩子
    closeBundle() {
      console.log('Build completed!')
    }
  }
}
```

## 常用插件推荐

### 自动导入

```bash
npm install -D unplugin-auto-import unplugin-vue-components
```

```typescript
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [
            'useDebounce',
            'useThrottle',
            'useLocalStorage'
          ]
        }
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // CSS in JS
        })
      ],
      dts: 'src/components.d.ts'
    })
  ]
})
```

### PWA 支持

```bash
npm install -D vite-plugin-pwa
```

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'My Vue App',
        short_name: 'VueApp',
        description: 'My Awesome Vue App',
        theme_color: '#42b883',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 小时
              }
            }
          }
        ]
      }
    })
  ]
})
```

## 性能监控

### 构建性能分析

```bash
# 查看构建时间
npx vite build --profile

# 查看依赖大小
npx vite build --report
```

### 运行时性能检查

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 开发环境启用性能检查
if (import.meta.env.DEV) {
  app.config.performance = true
}

app.mount('#app')
```

## 高级优化技巧

### 懒加载组件

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(
      /* webpackChunkName: "about" */
      /* @vite-ignore */
      '@/views/About.vue'
    )
  },
  // 按功能分组懒加载
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(
      /* webpackChunkName: "admin" */
      '@/views/admin/Index.vue'
    ),
    children: [
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
      }
    ]
  }
]
```

### 条件导入

```typescript
// 根据环境条件导入
let mockService

if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
  mockService = await import('@/mocks/service')
} else {
  mockService = await import('@/services/real')
}
```

### 预获取策略

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 预获取关键 chunks
        experimentalMinChunkSize: 1000
      }
    }
  }
})
```

```html
<!-- HTML 中预加载关键资源 -->
<link rel="modulepreload" href="/modules/vendor.js">
<link rel="prefetch" href="/modules/about.js">
```

## 常见问题排查

### 依赖预构建问题

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      // 修复 CommonJS 依赖
      'some-cjs-dep',
      // 强制重新构建
      'problematic-dep'
    ],
    exclude: [
      // 排除 ESM-only 依赖
      'esm-only-package'
    ]
  }
})
```

### TypeScript 构建错误

```json
// tsconfig.json
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
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

