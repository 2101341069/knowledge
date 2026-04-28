---
title: Webpack基础配置
tags:
  - 前端
  - 工程化
  - Webpack
  - 构建工具
created: 2026-04-27
---

# Webpack 基础配置完全指南

## 一、Webpack 核心概念

### 什么是 Webpack

Webpack 是一个**静态模块打包器**（static module bundler）。它递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

**核心价值：**
- ✅ 模块化支持（ES Module / CommonJS / AMD）
- ✅ 代码拆分（Code Splitting）
- ✅ 加载器（Loader）处理各种资源
- ✅ 插件（Plugin）体系扩展构建能力
- ✅ 开发体验优化（HMR、DevServer）

### 五大核心概念

| 概念 | 作用 |
|------|------|
| **Entry** | 入口：打包从哪个文件开始 |
| **Output** | 输出：打包产物放到哪，怎么命名 |
| **Loaders** | 加载器：处理非 JS 文件（CSS、图片、TS 等） |
| **Plugins** | 插件：执行更广的任务（打包优化、资源管理、注入环境变量） |
| **Mode** | 模式：development / production / none |

### Webpack 构建流程

```
入口文件 (Entry)
    ↓
递归解析依赖
    ↓
    ├─→ JS/TS → Babel/TS Loader → AST → 转译代码
    ├─→ CSS → style-loader/css-loader/postcss-loader → 注入页面
    ├─→ 图片/字体 → asset module → 输出文件/Base64
    └─→ Vue/React → 对应框架 Loader
    ↓
生成 Chunk（代码块）
    ↓
插件处理（Plugins）
    ↓
输出 Bundle 文件
```

---

## 二、快速开始

### 1. 从零搭建 Webpack 项目

```bash
# 1. 初始化项目
mkdir webpack-demo && cd webpack-demo
pnpm init -y

# 2. 安装核心依赖
pnpm add -D webpack webpack-cli webpack-dev-server

# 3. 创建项目结构
mkdir src
touch src/index.js
touch index.html
touch webpack.config.js
```

### 2. 最小配置

```javascript
// webpack.config.js
const path = require('path')

module.exports = {
  // 1. 入口
  entry: './src/index.js',
  
  // 2. 输出
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true  // 每次构建清除 dist 目录
  },
  
  // 3. 模式
  mode: 'development',  // 'production' / 'none'
  
  // 4. 开发工具
  devtool: 'inline-source-map'
}
```

### 3. 项目文件

```javascript
// src/index.js
function component() {
  const element = document.createElement('div')
  element.innerHTML = 'Hello Webpack!'
  return element
}

document.body.appendChild(component())
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Webpack Demo</title>
</head>
<body>
  <script src="./dist/main.js"></script>
</body>
</html>
```

### 4. 添加构建脚本

```json
{
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch",
    "dev": "webpack serve --open"
  }
}
```

```bash
# 构建生产版本
pnpm build

# 监听模式（文件变化自动重新构建）
pnpm watch

# 启动开发服务器
pnpm dev
```

---

## 三、核心配置详解

### 1. Entry 入口

**单入口：**
```javascript
module.exports = {
  entry: './src/index.js'
}
```

**多入口 - 对象形式：**
```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js',
    vendor: './src/vendor.js'
  }
}
```

**多入口 - 数组形式（合并打包）：**
```javascript
module.exports = {
  entry: ['./src/a.js', './src/b.js', './src/c.js']
  // 三个文件合并打包成一个 bundle
}
```

**动态入口（函数形式）：**
```javascript
module.exports = {
  entry: () => {
    // 可以返回 Promise，支持异步
    return new Promise((resolve) => {
      resolve({
        main: './src/main.js',
        admin: './src/admin.js'
      })
    })
  }
}
```

---

### 2. Output 输出

**基础配置：**
```javascript
const path = require('path')

module.exports = {
  output: {
    // 文件名
    filename: 'bundle.js',
    
    // 输出目录（必须是绝对路径）
    path: path.resolve(__dirname, 'dist'),
    
    // 静态资源公共路径
    publicPath: '/',
    // publicPath: 'https://cdn.example.com/assets/' // CDN 场景
    
    // 清理输出目录（Webpack 5+ 内置）
    clean: true,
    
    // 资源模块文件名
    assetModuleFilename: 'assets/[hash][ext][query]'
  }
}
```

**多入口输出（带 hash）：**
```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  output: {
    // [name]: chunk 名称
    // [contenthash]: 内容 hash，内容不变则不变（浏览器缓存友好）
    // [id]: chunk id
    // [hash]: 构建 hash
    filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
}
// 输出：app.abc12345.js, admin.def67890.js
```

**代码拆分输出：**
```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js', // 非入口 chunk
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
}
```

---

### 3. Loaders 加载器

Loaders 让 Webpack 能够处理其他类型的文件（如 CSS、图片、TS 等），并将它们转换为有效的模块，供应用程序使用，以及添加到依赖图中。

**Loader 配置结构：**
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,       // 匹配文件（正则）
        use: ['style-loader', 'css-loader'], // 使用的 loader 数组
        exclude: /node_modules/, // 排除目录
        include: path.resolve(__dirname, 'src') // 只处理指定目录
      }
    ]
  }
}
```

#### 常用 Loader 大全

**① CSS 相关：**
```bash
# 安装依赖
pnpm add -D style-loader css-loader less-loader sass-loader postcss-loader autoprefixer
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        // 执行顺序：从右到左 / 从下到上
        use: [
          'style-loader',   // 3. 将 CSS 注入到 DOM（style 标签）
          'css-loader'      // 2. 解析 CSS 中的 @import 和 url()
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',   // 3. JS → DOM
          'css-loader',     // 2. CSS → JS
          'less-loader'     // 1. Less → CSS
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // 2.5 PostCSS 处理（自动前缀等）
          'sass-loader'     // 1. SCSS → CSS
        ]
      }
    ]
  }
}
```

**② 提取 CSS 到单独文件（生产环境）：**
```bash
pnpm add -D mini-css-extract-plugin
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ]
}
```

**③ PostCSS 配置（自动前缀）：**
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    'autoprefixer': {} // 自动添加浏览器前缀
    // 'postcss-pxtorem': { rootValue: 16, propList: ['*'] } // px 转 rem
  }
}
```

**④ Babel 转译 JS/TS：**
```bash
# 安装依赖
pnpm add -D babel-loader @babel/core @babel/preset-env @babel/preset-typescript
pnpm add -D @babel/plugin-transform-runtime @babel/runtime
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/, // 排除第三方库
        use: {
          loader: 'babel-loader',
          options: {
            // 预设：一组 Babel 插件集合
            presets: [
              '@babel/preset-env',      // ES6+ → ES5
              '@babel/preset-typescript' // TS → JS
            ],
            plugins: [
              '@babel/plugin-transform-runtime' // 提取公共辅助代码
            ],
            cacheDirectory: true // 开启缓存，加快编译速度
          }
        }
      }
    ]
  }
}
```

```json
// babel.config.json 或 .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead", // 浏览器版本目标
      "useBuiltIns": "usage", // 按需引入 polyfill
      "corejs": 3
    }]
  ]
}
```

**⑤ TypeScript 专属配置（ts-loader）：**
```bash
pnpm add -D ts-loader typescript
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules()
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'] // 自动解析扩展名
  }
}
```

**⑥ 资源模块（Assets Module，Webpack 5 内置）：**

```javascript
module.exports = {
  module: {
    rules: [
      // 1. asset/resource: 输出单独文件
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      
      // 2. asset/inline: 转为 Data URL（Base64）
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体
        type: 'asset/inline'
      },
      
      // 3. asset/source: 导出源码（txt, md等）
      {
        test: /\.txt$/,
        type: 'asset/source'
      },
      
      // 4. asset: 自动选择（小于 limit 转 base64，否则输出文件）
      {
        test: /\.(png|jpg|jpeg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 小于 8KB 转 base64
          }
        }
      }
    ]
  }
}
```

**⑦ Vue Loader（Vue 单文件组件）：**
```bash
pnpm add -D vue-loader vue-template-compiler
```

```javascript
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

---

### 4. Plugins 插件

插件用于执行范围更广的任务：打包优化、资源管理、注入环境变量等。

**① HtmlWebpackPlugin - 自动生成 HTML：**
```bash
pnpm add -D html-webpack-plugin
```

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack App',
      template: './index.html', // 模板文件
      filename: 'index.html',    // 输出文件名
      minify: {
        collapseWhitespace: true,    // 压缩空格
        removeComments: true,        // 移除注释
        removeAttributeQuotes: true  // 移除属性引号
      },
      inject: 'body', // 注入 script 到 body
      hash: true      // 给静态资源加 hash，避免缓存
    })
  ]
}
```

**② DefinePlugin - 定义全局常量：**
```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VUE_OPTIONS_API__: true,    // Vue 3 特性开关
      __VUE_PROD_DEVTOOLS__: false,
      APP_VERSION: JSON.stringify('1.0.0'),
      IS_DEV: process.env.NODE_ENV === 'development'
    })
  ]
}
```

**③ MiniCssExtractPlugin - 提取 CSS 到单独文件：**
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    })
  ]
}
```

**④ CssMinimizerPlugin - CSS 压缩：**
```bash
pnpm add -D css-minimizer-webpack-plugin terser-webpack-plugin
```

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      `...`, // 扩展默认 minimizers（包括 TerserPlugin）
      new CssMinimizerPlugin(),  // 压缩 CSS
      new TerserPlugin({         // 压缩 JS（更强大）
        parallel: true, // 多进程
        terserOptions: {
          compress: {
            drop_console: true // 移除 console.log
          }
        }
      })
    ]
  }
}
```

**⑤ HotModuleReplacementPlugin - 热模块替换：**
```javascript
const webpack = require('webpack')

module.exports = {
  devServer: {
    hot: true // 开启 HMR
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

**⑥ CopyWebpackPlugin - 复制静态资源：**
```bash
pnpm add -D copy-webpack-plugin
```

```javascript
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'public' }, // 从 public 复制到 dist/public
        { from: 'static', to: 'static', noErrorOnMissing: true }
      ]
    })
  ]
}
```

**⑦ BundleAnalyzerPlugin - 打包体积分析：**
```bash
pnpm add -D webpack-bundle-analyzer
```

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server', // 启动服务器显示
      openAnalyzer: true,
      generateStatsFile: true // 生成 stats.json
    })
  ]
}
```

---

### 5. DevServer 开发服务器

```javascript
module.exports = {
  devServer: {
    // 静态文件目录
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/public'
    },
    
    // 端口号
    port: 8080,
    
    // 自动打开浏览器
    open: true,
    
    // 开启 HMR（热模块替换）
    hot: true,
    
    // 压缩
    compress: true,
    
    // 历史模式路由支持（SPA 必备）
    historyApiFallback: true,
    
    // 代理（解决跨域）
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    },
    
    // 自定义请求头
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    
    // 只在发生错误或警告时输出
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  }
}
```

---

### 6. Resolve 解析配置

```javascript
module.exports = {
  resolve: {
    // 自动解析扩展名（导入时可以省略后缀）
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    
    // 路径别名（简化导入路径）
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets')
    },
    
    // 优先查找 src 目录，再找 node_modules
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  }
}
```

使用：
```javascript
// 别名前
import Button from '../../components/Button'
import utils from '../utils'

// 别名后
import Button from '@components/Button'
import utils from '@utils'
```

---

### 7. Optimization 优化配置

**代码分割（Code Splitting）：**
```javascript
module.exports = {
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: 'all', // 'all' | 'async' | 'initial'
      
      // 最小字节数（超过才拆分）
      minSize: 20000, // 20KB
      
      // 共享模块的最小 chunk 数
      minChunks: 1,
      
      // 按需加载时最大并行请求数
      maxAsyncRequests: 30,
      
      // 初始加载时最大并行请求数
      maxInitialRequests: 30,
      
      // 强制拆分阈值
      enforceSizeThreshold: 50000,
      
      // 缓存组
      cacheGroups: {
        // 第三方库（node_modules）
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          reuseExistingChunk: true // 重用已有的 chunk
        },
        
        // UI 组件库
        antDesign: {
          test: /[\\/]node_modules[\\/](ant-design-vue|@ant-design)[\\/]/,
          name: 'ant-design',
          priority: 0
        },
        
        // 工具库
        utils: {
          test: /[\\/]node_modules[\\/](lodash-es|dayjs|axios)[\\/]/,
          name: 'utils',
          priority: 0
        },
        
        // 公共模块
        common: {
          name: 'common',
          minChunks: 2, // 至少被 2 个 chunk 引用
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    
    // 提取 runtime 代码（利于缓存）
    runtimeChunk: {
      name: 'runtime'
    },
    
    // 开启 tree shaking（生产环境默认开启）
    usedExports: true,
    
    // 代码压缩
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
  }
}
```

---

## 四、完整 Webpack 5 配置模板

### 1. 目录结构

```
webpack-demo/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   ├── utils/
│   ├── App.vue
│   └── main.ts
├── .browserslistrc
├── babel.config.json
├── tsconfig.json
├── package.json
└── webpack.config.js
```

### 2. 完整配置文件

```javascript
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  // 模式
  mode: isProduction ? 'production' : 'development',
  
  // 入口
  entry: {
    app: './src/main.ts'
  },
  
  // 输出
  output: {
    filename: isProduction ? 'js/[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction ? 'js/[name].[contenthash:8].chunk.js' : '[name].chunk.js',
    path: resolve('dist'),
    clean: true,
    publicPath: '/'
  },
  
  // 解析
  resolve: {
    extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
      '@components': resolve('src/components'),
      '@utils': resolve('src/utils'),
      '@assets': resolve('src/assets')
    }
  },
  
  // 开发工具
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  
  // 开发服务器
  devServer: {
    static: resolve('public'),
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    client: {
      overlay: { errors: true, warnings: false }
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  
  // 模块
  module: {
    rules: [
      // Vue 单文件
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      
      // TypeScript / JavaScript
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true }
        }
      },
      
      // CSS
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      
      // SCSS
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `
                @import "@/assets/styles/variables.scss";
                @import "@/assets/styles/mixins.scss";
              `
            }
          }
        ]
      },
      
      // 图片资源
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB 以下转 base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      
      // 字体资源
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  
  // 插件
  plugins: [
    // Vue 插件
    new VueLoaderPlugin(),
    
    // HTML 生成
    new HtmlWebpackPlugin({
      title: 'Webpack Vue App',
      template: resolve('public/index.html'),
      minify: isProduction && {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    
    // CSS 提取（生产环境）
    isProduction && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    }),
    
    // 环境变量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    
    // 开发环境进度条
    isDevelopment && new webpack.ProgressPlugin()
    
  ].filter(Boolean), // 过滤 false
  
  // 优化
  optimization: {
    // 开发环境不压缩
    minimize: isProduction,
    minimizer: isProduction ? [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ] : [],
    
    // 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'initial'
        },
        'vue-vendor': {
          test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
          name: 'vue-vendor',
          priority: 20,
          chunks: 'all'
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // Runtime 代码
    runtimeChunk: {
      name: 'runtime'
    }
  },
  
  // 性能提示阈值
  performance: {
    maxAssetSize: 500000, // 500KB
    maxEntrypointSize: 1000000 // 1MB
  }
}
```

### 3. package.json scripts

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:analyze": "webpack --mode production --profile --json=stats.json && npx webpack-bundle-analyzer stats.json dist"
  }
}
```

---

## 五、环境变量管理

### 1. .env 文件

```bash
# .env                # 所有环境加载
# .env.local          # 本地开发，被 git 忽略
# .env.development    # 开发环境
# .env.production     # 生产环境
```

```bash
# .env.development
API_BASE_URL=http://localhost:3000/api
APP_TITLE=我的应用（开发版）
```

```bash
# .env.production
API_BASE_URL=https://api.example.com
APP_TITLE=我的应用
```

### 2. 使用 dotenv-webpack 插件

```bash
pnpm add -D dotenv-webpack
```

```javascript
const Dotenv = require('dotenv-webpack')

module.exports = {
  plugins: [
    new Dotenv({
      path: `.env.${process.env.NODE_ENV || 'development'}`,
      defaults: '.env' // 加载默认值文件
    })
  ]
}
```

---

## 六、常见优化策略

### 1. 构建速度优化

```javascript
module.exports = {
  // 排除不需要处理的目录
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 不处理 node_modules
        use: ['babel-loader']
      }
    ]
  },
  
  // 开启缓存
  cache: {
    type: 'filesystem', // 持久化缓存到磁盘
    buildDependencies: {
      config: [__filename] // 配置文件变化时失效缓存
    }
  },
  
  // 多进程
  parallelism: 4, // 并发处理数
  
  // 优化 resolve 速度
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // 减少查找的后缀
    modules: [resolve('src'), 'node_modules'] // 减少查找范围
  }
}
```

### 2. 打包体积优化

- ✅ Tree Shaking（移除无用代码）
- ✅ 代码分割（Code Splitting）
- ✅ 按需加载（动态 import）
- ✅ 图片压缩、CDN 托管
- ✅ 第三方库单独打包（vendor）
- ✅ 移除 console.log、debugger

### 3. 缓存策略

**生产环境配置：**
```javascript
output: {
  filename: '[name].[contenthash:8].js',
  chunkFilename: '[name].[contenthash:8].chunk.js'
},
optimization: {
  runtimeChunk: 'single', // 提取 runtime
  moduleIds: 'deterministic' // 稳定的 module id，利于缓存
}
```

---

## 七、常见问题排查

### 1. 构建太慢？

- ✅ 检查是否 babel 处理了 node_modules
- ✅ 开启 cache: { type: 'filesystem' }
- ✅ 减少 resolve.extensions / resolve.modules
- ✅ 使用 thread-loader 多进程
- ✅ 升级到 Webpack 5（比 4 快很多）

### 2. HotModuleReplacement 不生效？

- ✅ 确保 devServer.hot = true
- ✅ 确保 mode = 'development'
- ✅ Vue 项目要配置 vue-loader
- ✅ CSS 需要 style-loader（不能用 MiniCssExtractPlugin）

### 3. Tree Shaking 没生效？

- ✅ 确保使用 ES Module（import/export）
- ✅ 确保 sideEffects 配置正确
- ✅ mode = 'production' 自动开启
- ✅ 检查 usedExports 配置

### 4. 路径别名找不到？

- ✅ webpack.config.js 配置了 resolve.alias
- ✅ TypeScript 项目要同步配置 tsconfig.json 的 paths

---

## 总结

| 特性 | Webpack 4 | Webpack 5 |
|------|----------|----------|
| 速度 | 一般 | 快很多（持久化缓存） |
| 资源处理 | file-loader/url-loader | 内置 Asset Modules |
| 持久化缓存 | 需要插件 | 内置 |
| Tree Shaking | 一般 | 更好（深度分析） |
| 配置复杂度 | 较高 | 中等（很多内置了） |

**Webpack 5 已经是目前的主流版本，新项目推荐直接用 Webpack 5。**

**什么时候选 Vite，什么时候选 Webpack：**
- 新项目、追求开发体验 → **Vite**
- 复杂构建需求、大量自定义插件 → **Webpack**
- 旧项目维护 → **Webpack**

**下一篇：** [前端项目脚手架搭建](./07-前端项目脚手架搭建.md)
