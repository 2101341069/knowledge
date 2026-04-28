---
title: Webpack深度进阶
tags:
  - 前端
  - 工程化
  - Webpack
  - 性能优化
created: 2026-04-28
---

# Webpack 深度进阶 - 原理、优化与实战

## 一、Webpack 核心原理深度解析

### 1.1 Webpack 构建流程全景图

```
┌─────────────────────────────────────────────────────────────────┐
│                        初始化阶段                                   │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │ 读取配置     │──▶│  注册插件    │──▶│  创建 Compiler 实例    │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                        编译构建阶段                                │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │  开始编译     │──▶│  构建 Module │──▶│  生成 Chunk 依赖图    │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│         │                  │                    │                │
│         │               ┌─────┐                 │                │
│         └──────────────▶│ AST │◀────────────────┘                │
│                         └─────┘                                   │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                        输出生成阶段                                │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │  Template   │──▶│  生成代码   │──▶│  写入文件系统        │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心概念深度解析

#### Compiler（编译器）
Webpack 的主引擎，负责启动整个构建流程，全局唯一。

```javascript
// Webpack 内部核心结构
class Compiler {
  constructor(options) {
    this.options = options
    this.hooks = {
      // 编译生命周期钩子
      done: new AsyncSeriesHook(['stats']),
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),
      emit: new AsyncSeriesHook(['compilation']),
      afterEmit: new AsyncSeriesHook(['compilation']),
      thisCompilation: new SyncHook(['compilation', 'params']),
      compilation: new SyncHook(['compilation', 'params']),
      // 还有 30+ 个钩子...
    }
  }
  
  run(callback) {
    // 1. 触发 beforeRun 钩子
    // 2. 创建 Compilation
    // 3. 调用 compile
    // 4. 处理编译结果
  }
}
```

#### Compilation（每次构建的单次编译对象）
负责整个构建过程，每个 watch 模式下的文件变化都会创建新的 Compilation。

```javascript
class Compilation {
  constructor(compiler) {
    this.compiler = compiler
    this.modules = []        // 所有模块
    this.chunks = []         // 所有代码块
    this.assets = {}         // 输出资源
    this.hooks = {}          // 编译阶段钩子
  }
  
  buildModule() { /* 构建单个模块 */ }
  processModuleDependencies() { /* 处理依赖 */ }
  seal() { /* 封装，生成最终 chunks */ }
}
```

#### Module（模块）
Webpack 万物皆模块，每个文件都是一个 Module。

```javascript
class NormalModule {
  constructor() {
    this.resource = ''           // 文件路径
    this.loaders = []            // 使用的 loaders
    this.dependencies = []       // 依赖的模块
    this.source = null           // 源码对象
    this._source = ''            // 转换后的代码
  }
  
  build() {
    // 1. 读取文件内容
    // 2. 依次调用 loader 处理
    // 3. 解析 AST，分析依赖
    // 4. 收集所有依赖
  }
}
```

#### Chunk（代码块）
多个 Module 组合成的输出单元。

| Chunk 类型 | 产生方式 | 场景 |
|-----------|---------|------|
| Entry | entry 配置的入口 | 页面入口 |
| Normal | import() 动态导入 | 懒加载 |
| Vendor | splitChunks 分割 | 第三方库拆分 |

---

## 二、Webpack 模块打包原理

### 2.1 Loader 工作机制

#### Loader 执行顺序
```
pre loader → normal loader → inline loader → post loader
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',      // 前置
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        enforce: 'post',     // 后置
        loader: 'babel-loader'
      }
    ]
  }
}
```

#### Pitch 机制（从右到左 pitch，从左到右 normal）
```
loader1.pitch → loader2.pitch → loader3.pitch 
          ↓ 资源文件 ↓
loader1.normal ← loader2.normal ← loader3.normal
```

Pitch 可以拦截和中断流程：
```javascript
module.exports = function(content) {
  return content
}

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  // 如果有返回值，流程中断
  if (someCondition) {
    return '// Interrupted by pitch'
  }
}
```

#### 手写一个简易 Loader
```javascript
// loaders/my-babel-loader.js
const babel = require('@babel/core')

module.exports = function(source) {
  // 获取 Webpack 配置的 options
  const options = this.getOptions()
  
  // 使用 Babel 转译
  const result = babel.transformSync(source, {
    presets: ['@babel/preset-env'],
    ...options,
    sourceMaps: true
  })
  
  // 异步回调（处理耗时操作）
  const callback = this.async()
  
  // 输出：转换后代码 + sourceMap
  callback(null, result.code, result.map)
}
```

### 2.2 Module Federation（模块联邦）原理

模块联邦允许多个独立的构建在运行时动态组合，是微前端架构的核心技术。

```javascript
// 主机应用（Host）
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // 引用远程应用
        cart: 'cart@http://localhost:3001/remoteEntry.js',
        product: 'product@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        // 共享依赖，避免重复加载
        vue: { singleton: true, eager: true },
        'element-plus': { singleton: true }
      }
    })
  ]
}
```

```javascript
// 远程应用（Remote）
new ModuleFederationPlugin({
  name: 'cart',
  filename: 'remoteEntry.js',
  exposes: {
    // 暴露的模块
    './Cart': './src/Cart.vue',
    './CartButton': './src/CartButton.vue'
  },
  shared: {
    vue: { singleton: true }
  }
})
```

使用远程模块：
```javascript
// 主机应用中使用
import('cart/Cart').then(module => {
  const Cart = module.default
  // 渲染 Cart 组件
})
```

---

## 三、Webpack 性能优化高级策略

### 3.1 构建速度优化

#### ① 缓存策略（Webpack 5 内置）
```javascript
module.exports = {
  cache: {
    type: 'filesystem',          // 文件系统缓存（推荐）
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    buildDependencies: {
      config: [__filename]       // 配置变更时失效缓存
    },
    name: 'production-cache',
    version: '1.0.0'
  }
}
```

**效果：** 第二次构建速度提升 **50-80%**

#### ② 多进程构建
```javascript
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,  // 开启多进程压缩
        workers: 4       // 进程数
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',  // 多进程 loader
            options: { workers: 3 }
          },
          'babel-loader'
        ]
      }
    ]
  }
}
```

#### ③ 缩小搜索范围
```javascript
module.exports = {
  resolve: {
    // 精确指定扩展名搜索范围
    extensions: ['.ts', '.tsx', '.js', '.json'],
    // 指定第三方库位置
    modules: [path.resolve(__dirname, 'node_modules')],
    // 别名，减少路径搜索
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 直接指定精确文件，避免递归查找
      vue$: 'vue/dist/vue.runtime.esm-bundler.js'
    },
    // 优先使用 package.json 中的哪个字段
    mainFields: ['module', 'browser', 'main']
  }
}
```

#### ④ 忽略大型库的无用文件
```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    // 忽略 moment 的 locale 目录
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    // 只引入中文语言包
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /zh-cn/
    )
  ]
}
```

### 3.2 产物体积优化

#### ① Tree Shaking 深度配置
Tree Shaking 依赖 ES Module 的静态结构特性，在 production 模式下自动开启。

```javascript
module.exports = {
  mode: 'production',
  
  // 确保副作用标记正确
  // package.json 中配置
  // "sideEffects": ["*.css", "*.scss", "*.vue"]
  
  optimization: {
    usedExports: true,      // 标记未使用的导出
    sideEffects: true,       // 启用副作用分析
    providedExports: true,   // 收集导出信息
    concatenateModules: true // 模块连接（Scope Hoisting）
  }
}
```

**Side Effects 标注说明：**
- `false` - 整个包无副作用，可安全 Tree Shaking
- `[]` - 指定有副作用的文件列表
- `true` - 整个包有副作用，不进行 Tree Shaking

#### ② 可视化分析 Bundle
```bash
# 安装分析工具
npm install -D webpack-bundle-analyzer
```

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',      // 生成静态 HTML
      reportFilename: 'report.html',
      openAnalyzer: false,         // 不自动打开
      generateStatsFile: true,     // 生成 stats.json
      statsFilename: 'stats.json'
    })
  ]
}
```

运行后打开 `dist/report.html`，重点关注：
- 🚨 体积超过 100KB 的模块
- 🔄 重复依赖（同一个包被多个地方引入）
- 📦 不必要的全量引入（如整个 lodash）

#### ③ 代码分割最佳实践
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',           // 同时分割初始和异步 chunks
      minSize: 20000,          // 最小 20KB 才分割
      minRemainingSize: 0,
      minChunks: 1,            // 至少被引用 1 次
      maxAsyncRequests: 30,    // 异步最大并行请求数
      maxInitialRequests: 30,  // 初始最大并行请求数
      enforceSizeThreshold: 50000, // 强制分割阈值
      
      cacheGroups: {
        // Vue 核心生态单独打包
        vue: {
          test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
          name: 'vue-vendor',
          priority: 40,
          chunks: 'all'
        },
        
        // UI 组件库单独打包
        ui: {
          test: /[\\/]node_modules[\\/](element-plus|@element-plus)[\\/]/,
          name: 'ui-vendor',
          priority: 30,
          chunks: 'all'
        },
        
        // 工具库单独打包
        utils: {
          test: /[\\/]node_modules[\\/](lodash-es|axios|dayjs)[\\/]/,
          name: 'utils-vendor',
          priority: 20,
          chunks: 'all'
        },
        
        // 其他第三方库统一打包
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'initial',
          reuseExistingChunk: true
        },
        
        // 公共业务代码
        common: {
          name: 'common',
          minChunks: 2,           // 至少被引用 2 次
          priority: 5,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    },
    
    // 运行时代码单独打包
    runtimeChunk: {
      name: 'runtime'
    }
  }
}
```

#### ④ 图片与资源优化
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  // 小于 8KB 转 Base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        },
        // 压缩图片（需要 image-webpack-loader）
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { progressive: true, quality: 75 },
              optipng: { enabled: false },
              pngquant: { quality: [0.65, 0.9], speed: 4 },
              gifsicle: { interlaced: false },
              webp: { quality: 75 }
            }
          }
        ]
      }
    ]
  }
}
```

---

## 四、手写核心 Plugin

### 4.1 Plugin 核心原理
Plugin 基于 Tapable 钩子系统，在编译的各个生命周期节点注入自定义逻辑。

### 4.2 手写一个 Zip 打包插件
```javascript
const jszip = require('jszip')
const path = require('path')

class ZipAssetsPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'dist.zip'
  }
  
  apply(compiler) {
    // emit 钩子：输出资源到 output 目录之前执行
    compiler.hooks.emit.tapPromise('ZipAssetsPlugin', async (compilation) => {
      const zip = new jszip()
      
      // 1. 遍历所有输出资源
      for (const [filename, source] of Object.entries(compilation.assets)) {
        // 2. 获取文件内容
        const content = source.source()
        // 3. 添加到 zip
        zip.file(filename, content)
      }
      
      // 4. 生成压缩包
      const zipBuffer = await zip.generateAsync({ 
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      })
      
      // 5. 作为新资源添加到 compilation
      compilation.assets[this.filename] = {
        source: () => zipBuffer,
        size: () => zipBuffer.length
      }
    })
    
    // done 钩子：编译完成后执行
    compiler.hooks.done.tap('ZipAssetsPlugin', (stats) => {
      console.log(`✅ Zip file generated: ${this.filename}`)
    })
  }
}

module.exports = ZipAssetsPlugin
```

### 4.3 手写一个清理 console 插件
```javascript
class CleanConsolePlugin {
  constructor(options = {}) {
    this.options = {
      methods: ['log', 'warn', 'info', 'error'],
      exclude: [],
      ...options
    }
  }
  
  apply(compiler) {
    // compilation 钩子：每次编译时调用
    compiler.hooks.compilation.tap('CleanConsolePlugin', (compilation) => {
      // optimizeChunkAssets 钩子：优化 chunk 资源时调用
      compilation.hooks.optimizeChunkAssets.tapAsync(
        'CleanConsolePlugin',
        (chunks, callback) => {
          chunks.forEach(chunk => {
            chunk.files.forEach(file => {
              if (/\.js$/.test(file)) {
                const asset = compilation.assets[file]
                let source = asset.source()
                
                // 移除指定的 console 方法
                this.options.methods.forEach(method => {
                  const regex = new RegExp(
                    `console\\.${method}\\([^)]*\\);?`, 
                    'g'
                  )
                  source = source.replace(regex, '')
                })
                
                // 更新资源
                compilation.assets[file] = {
                  source: () => source,
                  size: () => source.length
                }
              }
            })
          })
          
          callback()
        }
      )
    })
  }
}
```

### 4.4 常用 Plugin 集合推荐
| Plugin | 用途 | 场景 |
|--------|------|------|
| `html-webpack-plugin` | 生成 HTML 入口文件 | 必备 |
| `mini-css-extract-plugin` | 提取 CSS 到单独文件 | 生产环境 |
| `css-minimizer-webpack-plugin` | CSS 压缩 | 生产环境 |
| `terser-webpack-plugin` | JS 压缩、移除 console | 生产环境 |
| `webpack-bundle-analyzer` | Bundle 体积分析 | 性能优化 |
| `webpack-manifest-plugin` | 生成资源清单 | PWA、版本管理 |
| `copy-webpack-plugin` | 复制静态资源 | public 目录 |
| `compression-webpack-plugin` | gzip/brotli 压缩 | Nginx 配合 |
| `duplicate-package-checker-webpack-plugin` | 检查重复依赖 | 性能分析 |

---

## 五、高级特性与实战

### 5.1 DllPlugin 动态链接库（提前预构建大型库）
大型第三方库（如 Vue、React、Lodash）变动极少，可提前构建好，避免每次重复编译。

```javascript
// webpack.dll.js
const webpack = require('webpack')

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router', 'pinia', 'axios', 'lodash-es']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'dll'),
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.resolve(__dirname, 'dll/[name]-manifest.json')
    })
  ]
}
```

主配置中引用：
```javascript
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./dll/vendor-manifest.json')
    })
  ]
}
```

**效果：** 大型项目构建速度提升 **30-50%**

### 5.2 持久化缓存最佳配置（Webpack 5 核心）
```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    name: process.env.NODE_ENV || 'development',
    version: process.env.NODE_ENV === 'production' ? undefined : 'dev',
    
    // 缓存依赖，这些文件变化时缓存失效
    buildDependencies: {
      config: [__filename],
      tsconfig: [path.resolve(__dirname, 'tsconfig.json')]
    },
    
    // 缓存过期策略
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    compression: 'gzip',             // 压缩缓存文件
    profile: false                   // 不收集统计信息（更快）
  }
}
```

### 5.3 Module Federation 微前端实战架构
```
projects/
├── host/                    # 主应用（容器）
│   ├── src/
│   │   └── bootstrap.js     # 动态引入远程模块
│   └── webpack.config.js
├── cart/                    # 购物车微应用
│   └── webpack.config.js
├── product/                 # 商品微应用
│   └── webpack.config.js
└── shared/                  # 共享工具库
    └── utils.js
```

---

## 六、Vue + Webpack 生产环境完整配置
```javascript
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  
  entry: './src/main.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'js/[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction ? 'js/[name].[contenthash:8].chunk.js' : '[name].chunk.js',
    clean: true,
    publicPath: '/'
  },
  
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            hoistStatic: true         // 静态节点提升
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: isProduction && {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    isProduction && new BundleAnalyzerPlugin({ analyzerMode: 'static' })
  ].filter(Boolean),
  
  optimization: {
    minimize: isProduction,
    minimizer: isProduction ? [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info']
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ] : [],
    
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
          name: 'vue-vendor',
          priority: 40,
          chunks: 'all'
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'initial'
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: { name: 'runtime' }
  },
  
  devServer: {
    hot: true,
    open: true,
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
}
```

---

## 七、性能优化效果对比表

| 优化手段 | 效果 | 推荐指数 | 实施难度 |
|---------|------|---------|---------|
| mode=production | 体积减小 60-80% | ⭐⭐⭐⭐⭐ | ⭐ |
| Terser 压缩 | JS 体积减小 40-60% | ⭐⭐⭐⭐⭐ | ⭐ |
| CSS 提取压缩 | CSS 体积减小 50-70% | ⭐⭐⭐⭐⭐ | ⭐ |
| 代码分割 splitChunks | 首屏加载快 30-50% | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Tree Shaking | 减小 10-30% 无用代码 | ⭐⭐⭐⭐ | ⭐⭐ |
| 持久化缓存 filesystem | 二编速度提升 70-90% | ⭐⭐⭐⭐⭐ | ⭐ |
| 多进程压缩 parallel | 压缩时间减少 50-70% | ⭐⭐⭐⭐ | ⭐ |
| 图片压缩 | 图片体积减小 40-60% | ⭐⭐⭐⭐ | ⭐⭐ |
| DllPlugin 预构建 | 构建速度提升 30-50% | ⭐⭐⭐ | ⭐⭐⭐ |
| gzip/br 压缩 | 传输体积再减小 60-70% | ⭐⭐⭐⭐ | ⭐⭐ |

---

## 总结

**Webpack 5 核心优势：**
1. ✅ 持久化缓存 - 二次构建速度提升 90%
2. ✅ 内置资源模块（Asset Modules）- 替代 file-loader/url-loader
3. ✅ 更好的 Tree Shaking
4. ✅ Module Federation - 微前端官方方案
5. ✅ 性能全面优于 Webpack 4

**性能优化三驾马车：**
- **构建速度**：持久化缓存、多进程、缩小搜索范围
- **产物体积**：代码分割、Tree Shaking、图片/代码压缩
- **运行性能**：懒加载、预加载、预获取、gzip 压缩

**下一篇：** [Vite高级特性与原理](./02-Vite高级特性与原理.md)
