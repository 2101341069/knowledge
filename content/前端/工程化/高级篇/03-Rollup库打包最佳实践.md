---
title: Rollup库打包最佳实践
tags:
  - 前端
  - 工程化
  - Rollup
  - 组件库
created: 2026-04-28
---

# Rollup 库打包最佳实践 - 打造高质量组件库

## 一、Rollup 核心优势与定位

### 1.1 Rollup vs Webpack vs Vite 对比

| 特性 | Rollup | Webpack | Vite |
|------|--------|---------|------|
| **最佳场景** | 🔧 库打包 | 🌐 应用打包 | ⚡ 应用开发 |
| Tree Shaking | ✅ 原生支持，最彻底 | ⚠️ 需要配置 | ✅ Rollup 驱动 |
| 输出格式 | ESM/CJS/UMD/IIFE | 主要 ESM/CJS | ESM |
| 构建速度 | ⚡ 快 | 🐢 慢 | ⚡ 很快 |
| 代码分割 | ⚠️ 基础支持 | ✅ 强大 | ✅ 强大 |
| HMR | ❌ 不支持 | ✅ 支持 | ✅ 原生支持 |
| 插件生态 | 🔧 库插件丰富 | 🌐 全场景插件 | 🧩 兼容 Rollup |

> **黄金法则：** 写库用 Rollup，写应用用 Vite/Webpack

---

### 1.2 Rollup 支持的输出格式详解

| 格式 | 说明 | 使用场景 |
|------|------|---------|
| **es / esm** | ES Module | 现代构建工具、Vite、Webpack 5+、浏览器 `<script type="module">` |
| **cjs** | CommonJS | Node.js、旧版 Webpack、SSR 环境 |
| **umd** | Universal Module Definition | 同时支持浏览器 `<script>`、AMD、CommonJS，兼容所有环境 |
| **iife** | Immediately Invoked Function Expression | 纯浏览器 `<script>` 引入，全局变量挂载 |
| **system** | SystemJS 格式 | SystemJS 模块加载器、微前端场景 |

---

## 二、从零搭建一个 NPM 组件库

### 2.1 项目目录结构

```
my-ui-lib/
├── 📁 src/
│   ├── 📁 components/       # 组件目录
│   │   ├── 📁 Button/
│   │   │   ├── Button.vue
│   │   │   ├── index.ts
│   │   │   └── style.less
│   │   └── index.ts         # 组件导出入口
│   ├── 📁 hooks/            # 组合式函数
│   ├── 📁 utils/            # 工具函数
│   ├── 📁 styles/           # 全局样式
│   └── index.ts             # 库主入口
├── 📁 example/              # 示例项目（用于开发调试）
├── 📁 docs/                 # 文档
├── 📁 scripts/              # 构建脚本
├── rollup.config.ts         # Rollup 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 包信息
└── README.md                # 说明文档
```

---

### 2.2 基础 Rollup 配置

#### 安装依赖

```bash
# 核心依赖
npm i -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs

# Vue 支持
npm i -D rollup-plugin-vue @vitejs/plugin-vue @vue/compiler-sfc

# CSS 处理
npm i -D rollup-plugin-postcss postcss autoprefixer cssnano

# 压缩
npm i -D @rollup/plugin-terser

# 类型声明生成
npm i -D rollup-plugin-dts
```

---

#### 完整配置文件

```typescript
// rollup.config.ts
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const isProduction = process.env.NODE_ENV === 'production'

// ⭐ 外部依赖：不打包到产物中，让用户自己安装
const external = [
  'vue',
  'vue-router',
  'pinia',
  /^lodash-es/,  // 正则匹配
  /^dayjs/
]

// 全局变量映射（UMD 格式用）
const globals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  pinia: 'Pinia',
  'lodash-es': 'lodashEs'
}

// 插件配置
const plugins = [
  // 🔍 解析 node_modules 中的依赖
  resolve({
    extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.vue'],
    browser: true,  // 优先使用 package.json 的 browser 字段
    preferBuiltins: false
  }),
  
  // 🔄 CommonJS 转 ESM
  commonjs({
    include: /node_modules/,
    // 处理命名导出
    namedExports: {
      'lodash-es': ['debounce', 'throttle', 'cloneDeep']
    }
  }),
  
  // 🎨 Vue 单文件组件编译
  vue({
    target: 'browser',
    preprocessStyles: true,
    // 提取 CSS 到单独文件
    css: false  // 交给 postcss 处理
  }),
  
  // 💄 CSS 处理（Less/Sass/Stylus）
  postcss({
    plugins: [
      autoprefixer(),
      isProduction && cssnano({
        preset: ['default', {
          discardComments: { removeAll: true }
        }]
      })
    ].filter(Boolean),
    
    // 提取到单独的 CSS 文件
    extract: isProduction ? 'styles/index.css' : false,
    // 或内联到 JS
    // inject: true,
    
    // 支持 Less
    use: [
      ['less', {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            // 主题变量覆盖
          }
        }
      }]
    ],
    
    // 生成 sourcemap
    sourceMap: !isProduction,
    
    // 自动添加模块
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    }
  }),
  
  // 📘 TypeScript 编译
  typescript({
    tsconfig: './tsconfig.json',
    // 类型声明单独生成，由 rollup-plugin-dts 合并
    declaration: false,
    declarationDir: null,
    // 不检查类型（加快构建，交给 lint）
    check: false,
    sourceMap: !isProduction
  }),
  
  // 🗜️ 代码压缩
  isProduction && terser({
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info']
    },
    format: {
      comments: false  // 移除注释
    }
  })
].filter(Boolean)

// 🚀 导出多配置，同时构建多种格式
export default defineConfig([
  // ========== 1. ESM 格式（推荐）==========
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/es/index.js',
      format: 'es',
      sourcemap: !isProduction,
      // 保持目录结构（适合 tree shaking）
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external,
    plugins,
    // 开启缓存加速构建
    cache: true
  },
  
  // ========== 2. CommonJS 格式 ==========
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: !isProduction,
      exports: 'named'  // 导出方式
    },
    external,
    plugins
  },
  
  // ========== 3. UMD 格式 ==========
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'MyUILib',  // 全局变量名
      globals,
      sourcemap: !isProduction,
      exports: 'named'
    },
    external,
    plugins
  },
  
  // ========== 4. 合并类型声明 ==========
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    external,
    plugins: [
      dts({
        // 排除测试文件
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        // 递归解析
        respectExternal: true
      })
    ]
  }
])
```

---

### 2.3 package.json 配置

```json
{
  "name": "my-ui-lib",
  "version": "1.0.0",
  "description": "A Vue 3 UI Component Library",
  "keywords": ["vue", "vue3", "ui", "components"],
  "author": "Your Name",
  "license": "MIT",
  
  // ⭐ 入口配置（极其重要！）
  "type": "module",           // 声明为 ESM 模块
  "main": "dist/cjs/index.js",    // CommonJS 入口
  "module": "dist/es/index.js",   // ESM 入口（现代工具优先用这个）
  "jsdelivr": "dist/umd/index.js",  // jsdelivr CDN
  "unpkg": "dist/umd/index.js",      // unpkg CDN
  
  // ⭐ 类型声明入口
  "types": "dist/index.d.ts",
  
  // ⭐ 导出映射（Node 12+ 支持，最优先）
  "exports": {
    ".": {
      "import": "./dist/es/index.js",     // import 时
      "require": "./dist/cjs/index.js",   // require 时
      "types": "./dist/index.d.ts"        // 类型
    },
    // 按需引入：子模块导出
    "./button": {
      "import": "./dist/es/components/Button/index.js",
      "require": "./dist/cjs/components/Button/index.js",
      "types": "./dist/types/components/Button/index.d.ts"
    },
    // 样式导出
    "./style": "./dist/styles/index.css",
    "./style/*": "./dist/styles/*.css"
  },
  
  // ⭐ 发布到 npm 的文件列表
  "files": [
    "dist"
  ],
  
  // ⭐ 外部依赖（用户需要自己安装）
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  
  // 可选依赖提示
  "peerDependenciesMeta": {
    "vue-router": {
      "optional": true
    }
  },
  
  // ⭐ 构建脚本
  "scripts": {
    "dev": "rollup -c -w --environment NODE_ENV:development",
    "build": "rollup -c --environment NODE_ENV:production",
    "build:watch": "rollup -c -w --environment NODE_ENV:production",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.vue"
  },
  
  // 仓库信息
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/my-ui-lib.git"
  },
  
  // 官网/文档
  "homepage": "https://my-ui-lib.com",
  
  // issue 地址
  "bugs": {
    "url": "https://github.com/yourname/my-ui-lib/issues"
  },
  
  // 引擎版本要求
  "engines": {
    "node": ">=16.0.0"
  }
}
```

---

## 三、高级优化配置

### 3.1 Tree Shaking 最佳实践

#### 1. 保持 ESM 格式

```typescript
// tsconfig.json - 确保输出 ESM
{
  "compilerOptions": {
    "module": "ESNext",     // ⭐ 不要用 CommonJS
    "target": "ES2020",
    "moduleResolution": "bundler"
  }
}
```

#### 2. 标注副作用

```json
// package.json
{
  // ⭐ 告诉打包工具哪些文件有副作用
  // false = 整个包无副作用，可安全 tree shaking
  "sideEffects": [
    "*.css",
    "*.less",
    "*.scss",
    "dist/styles/*",
    "src/styles/global.css"
  ]
}
```

#### 3. 导出方式优化

```typescript
// ❌ 避免：这样会导致整个对象无法 tree shaking
export default {
  Button,
  Input,
  Select
}

// ✅ 推荐：命名导出，支持按需引入
export { Button } from './Button'
export { Input } from './Input'
export { Select } from './Select'

// 组件内部也要用命名导出
export const Button = defineComponent({
  // ...
})
```

---

### 3.2 按需引入（核心功能）

#### 方式 1：ESM 原生按需（推荐）

只要是 ESM 格式 + 命名导出，Vite/Webpack 5+ 自动按需引入：

```typescript
// 用户代码 - 只打包用到的 Button
import { Button } from 'my-ui-lib'
```

#### 方式 2：unplugin-vue-components 自动引入

```typescript
// 为你的库写一个 resolver
// my-ui-lib/resolver.ts
import type { ComponentResolver } from 'unplugin-vue-components/types'

export function MyUILibResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      // 匹配 MyButton, MyInput 等
      if (name.startsWith('My')) {
        const componentName = name.slice(2)  // 'Button'
        
        return {
          // 组件路径
          name: componentName,
          from: 'my-ui-lib',
          // 自动引入样式
          sideEffects: `my-ui-lib/style/${componentName.toLowerCase()}.css`
        }
      }
    }
  }
}
```

#### 方式 3：babel-plugin-import（传统方式）

```javascript
// babel.config.js - 兼容旧项目
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'my-ui-lib',
      libraryDirectory: 'dist/es/components',
      camel2DashComponentName: false,
      style: (name) => `${name}/style.css`
    }, 'my-ui-lib']
  ]
}
```

---

### 3.3 体积优化技巧

#### 1. 精确控制外部依赖

```typescript
// rollup.config.ts
const external = [
  // 整个外部化
  'vue',
  
  // 正则匹配
  /^lodash-es(\/.*)?$/,    // lodash-es + 子模块
  
  // 排除某些内部模块不要外部化
  id => {
    // 外部化所有 node_modules，但保留我们自己的 utils
    return id.includes('node_modules') && !id.includes('my-internal-utils')
  }
]
```

#### 2. 替换环境变量

```typescript
import replace from '@rollup/plugin-replace'

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__VERSION__': JSON.stringify(pkg.version),
      '__DEV__': 'false'
    }
  })
]
```

#### 3. 移除调试代码

```typescript
import { strip } from '@rollup/plugin-strip'

const plugins = [
  // 生产环境移除 console、debugger、assert
  isProduction && strip({
    include: ['**/*.ts', '**/*.js', '**/*.vue'],
    functions: ['console.log', 'console.info', 'assert.*']
  })
]
```

---

## 四、样式处理进阶

### 4.1 CSS 按需加载最佳方案

```
dist/
├── styles/
│   ├── index.css          # 全量样式
│   ├── base.css           # 基础样式
│   ├── button.css         # Button 样式
│   ├── input.css          # Input 样式
│   └── theme/
│       ├── default.css    # 默认主题
│       └── dark.css       # 暗黑主题
```

#### 组件样式导出

```typescript
// src/components/Button/index.ts
export * from './Button'

// ⭐ 单独导出样式路径
// unplugin-vue-components 可以自动引入这个
export const style = 'my-ui-lib/styles/button.css'
```

---

### 4.2 CSS 变量主题系统

```less
// src/styles/variables.less
// 🎨 主题变量（可被用户覆盖）
@primary-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #f5222d;

@font-size-base: 14px;
@border-radius-base: 6px;

// CSS 变量版本（运行时可修改）
:root {
  --my-primary-color: @primary-color;
  --my-success-color: @success-color;
}

// 暗黑主题
[data-theme="dark"] {
  --my-primary-color: #177ddc;
}
```

#### 组件中使用

```less
// Button.less
.my-button {
  background-color: var(--my-primary-color, #1890ff);
  
  &:hover {
    background-color: color-mix(
      in srgb,
      var(--my-primary-color),
      white 15%
    );
  }
}
```

---

## 五、TypeScript 类型声明

### 5.1 高质量类型定义

```typescript
// src/components/Button/Button.ts
import type { PropType } from 'vue'

// ⭐ 导出类型，方便用户使用
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'default'
export type ButtonSize = 'large' | 'middle' | 'small'

export const buttonProps = {
  /** 按钮类型 */
  type: {
    type: String as PropType<ButtonType>,
    default: 'default'
  },
  
  /** 按钮尺寸 */
  size: {
    type: String as PropType<ButtonSize>,
    default: 'middle'
  },
  
  /** 是否禁用 */
  disabled: Boolean,
  
  /** 点击事件 */
  onClick: {
    type: Function as PropType<(e: MouseEvent) => void>
  }
} as const

// ⭐ 提取 Props 类型并导出
export type ButtonProps = ExtractPropTypes<typeof buttonProps>
```

---

### 5.2 全局组件类型注册

```typescript
// src/global.d.ts
import type MyButton from './components/Button/Button.vue'
import type MyInput from './components/Input/Input.vue'

declare module 'vue' {
  // ⭐ 注册全局组件类型，在模板中获得自动补全
  export interface GlobalComponents {
    MyButton: typeof MyButton
    MyInput: typeof MyInput
  }
}

export {}
```

---

## 六、测试与开发流程

### 6.1 本地开发调试

#### 方案 1：npm link

```bash
# 在库目录
npm link

# 在测试项目
npm link my-ui-lib
```

#### 方案 2：pnpm workspace（推荐，更稳定）

```yaml
# pnpm-workspace.yaml
packages:
  - '.'              # 库本身
  - './example'      # 示例项目
```

```typescript
// example/vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      // 直接引用源码，热更新即时生效
      'my-ui-lib': '/../src/index.ts'
    }
  }
})
```

---

### 6.2 单元测试配置（Vitest）

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',  // 或 jsdom
    // 测试覆盖率
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 覆盖率要求
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80
      }
    }
  }
})
```

```typescript
// src/components/Button/__tests__/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' }
    })
    expect(wrapper.classes()).toContain('my-button--primary')
  })
  
  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

---

## 七、发布与版本管理

### 7.1 发布前 Checklist

✅ **构建测试** - `npm run build` 无错误
✅ **类型检查** - `npm run typecheck` 通过
✅ **单元测试** - `npm run test` 全部通过
✅ **Lint 检查** - `npm run lint` 无警告
✅ **版本号** - 遵循 Semantic Versioning：
  - `x.y.z` 中的：
  - **Major (x)** - 不兼容的 API 改动
  - **Minor (y)** - 向下兼容的功能性新增
  - **Patch (z)** - 向下兼容的问题修正

✅ **更新 Changelog** - CHANGELOG.md 记录改动
✅ **更新 README** - 文档与示例最新
✅ **Git Tag** - 为版本打标签

---

### 7.2 发布流程

```bash
# 1. 运行所有检查
npm run build
npm run test
npm run lint

# 2. 更新版本号
npm version patch  # or minor / major

# 3. 发布到 npm
npm publish --access public

# 4. 推送到 Git
git push origin main --tags
```

---

### 7.3 使用 changesets 管理版本（推荐）

```bash
# 安装
npm i -D @changesets/cli

# 初始化
npx changeset init

# 开发时记录改动
npx changeset

# 发布时生成版本
npx changeset version

# 发布
npm run build
npx changeset publish
```

---

## 八、实战：完整的组件库模板

### 现代组件库的 package.json 参考

```json
{
  "name": "@org/my-ui-lib",
  "version": "1.2.3",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/es/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/es/index.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/cjs/index.cjs"
      }
    },
    "./style": "./dist/style.css",
    "./dist/*": "./dist/*"
  },
  "sideEffects": ["*.css"],
  "files": ["dist"],
  "scripts": {
    "dev": "rollup -c -w",
    "build": "rimraf dist && rollup -c",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "lint": "eslint src --fix",
    "typecheck": "tsc --noEmit",
    "release": "changeset publish"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "rollup": "^4.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@changesets/cli": "^2.0.0"
  }
}
```

---

## 总结

**Rollup 库打包核心原则：**

1. 🎯 **输出多种格式** - ESM（优先）、CJS、UMD，兼容所有场景
2. 🌳 **Tree Shaking 友好** - ESM 格式 + 命名导出 + sideEffects
3. 📦 **精准外部依赖** - 第三方库不打包，让用户按需安装
4. 📘 **完善的类型声明** - TypeScript 类型是现代库的标配
5. 🧩 **按需引入支持** - 提供多种按需引入方式，减小用户产物体积
6. ✅ **严格的质量保证** - 测试、Lint、类型检查缺一不可

**发布质量标准：**
- ✅ 所有测试通过
- ✅ 覆盖率达标（>80%）
- ✅ 类型声明完整
- ✅ 文档齐全
- ✅ Changelog 清晰

---

**下一篇：** [ESBuild极速构建](./04-ESBuild极速构建.md)
