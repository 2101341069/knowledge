---
title: TypeScript简介与环境搭建
tags:
  - 前端
  - TypeScript
  - 环境搭建
created: 2026-04-28
---

# TypeScript 简介与环境搭建

## 一、什么是 TypeScript？

### 1.1 TypeScript 定义

TypeScript 是由微软开发的开源编程语言，它是 JavaScript 的**超集**，意味着：

> 所有合法的 JavaScript 代码都是合法的 TypeScript 代码。

```
┌─────────────────────────────────┐
│         TypeScript            │
│  ┌───────────────────────┐  │
│  │      JavaScript       │  │
│  │  (所有 JS 都有效    │  │
│  └───────────────────────┘  │
│                               │
│  + 类型系统                  │
│  + 高级特性                  │
│  + 工具支持                  │
└─────────────────────────────────┘
```

---

### 1.2 为什么需要 TypeScript？

#### 🔴 JavaScript 的痛点：
```javascript
// JS 代码
function add(a, b) {
  return a + b
}

add(1, 2)      // 3 ✅
add('1', '2')  // '12' ❌ 字符串拼接
add(1)         // NaN ❌
add(1, 2, 3)   // 3 多传也不管
```

🟢 TypeScript 的解决：
```typescript
// TS 代码 - 类型安全
function add(a: number, b: number): number {
  return a + b
}

add(1, 2)      // 3 ✅
add('1', '2')  // ❌ 编译时报错！
add(1)         // ❌ 编译时报错！
```

---

### 1.3 TypeScript 的核心优势

| 优势 | 说明 |
|------|------|
| **🐛 **类型安全** | 在编译阶段发现错误，而不是运行时 |
| **📝 **更好的 IDE 支持** | 智能提示、自动补全、跳转到定义 |
| **📖 **类型即文档** | 看类型就知道怎么用，不用看注释 |
| **🔧 **大型项目必备** | 多人协作、代码重构更安全 |
| **🚀 **渐进式接入** | 可以和 JS 项目混合使用 |

---

## 二、环境搭建

### 2.1 安装 TypeScript

#### 方式一：全局安装（推荐）

```bash
# npm
npm install -g typescript

# yarn
yarn global add typescript

# pnpm
pnpm add -g typescript

# 验证安装
tsc -v  # 查看版本，如 Version 5.4.0
```

#### 方式二：项目本地安装

```bash
# 在项目中安装
npm install -D typescript

# 使用 npx 运行
npx tsc -v
```

---

### 2.2 第一个 TypeScript 编译器（TS -> JS 编译

创建 `hello.ts`：

```typescript
// hello.ts
function greet(name: string): string {
  return `Hello, ${name}!`
}

const message = greet('TypeScript')
console.log(message)
```

编译为 JS：
```bash
# 编译单个文件
tsc hello.ts

# 输出 hello.js
```

编译结果 `hello.js`：
```javascript
function greet(name) {
  return "Hello, ".concat(name, "!");
}
var message = greet('TypeScript');
console.log(message);
```

运行：
```bash
node hello.js
# 输出: Hello, TypeScript!
```

---

### 2.3 tsconfig.json 配置文件

#### 生成配置文件

```bash
tsc --init
```

会生成 `tsconfig.json`，核心配置：

```json
{
  "compilerOptions": {
    /* 基本配置 */
    "target": "ES2020",          // 编译目标 JS 版本
    "module": "ESNext",         // 模块系统
    "lib": ["ES2020", "DOM"],  // 编译时引入的库
    "outDir": "./dist",          // 输出目录
    "rootDir": "./src",          // 源码目录
    
    /* 严格类型检查 */
    "strict": true,               // 启用所有严格类型检查
    "noImplicitAny": true,       // 禁止隐式 any
    "strictNullChecks": true,      // 严格 null 检查
    
    /* 模块解析 */
    "moduleResolution": "bundler", // 模块解析策略
    "baseUrl": ".",               // 基础路径
    "paths": {                   // 路径映射
      "@/*": ["src/*"]
    },
    
    /* 其他 */
    "sourceMap": true,            // 生成 sourcemap
    "declaration": true,          // 生成 .d.ts 声明文件
    "esModuleInterop": true,     // 兼容 ES 和 ES 模块
    "skipLibCheck": true,        // 跳过库检查
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],       // 要编译的文件
  "exclude": ["node_modules", "dist"]  // 排除的文件
}
```

---

### 2.4 常用编译选项

| 选项 | 说明 |
|------|------|
| `tsc` | 编译所有文件 |
| `tsc --watch` 或 `tsc -w` | 监听模式，文件变化自动编译 |
| `tsc --noEmit` | 只做类型检查，不输出文件 |
| `tsc --target ES2020` | 指定编译目标 |
| `tsc --strict` | 严格模式 |

---

## 三、开发环境配置（VS Code）

### 3.1 必备插件

1. **TypeScript and JavaScript Language Features** - VS Code 内置
2. **Error Lens** - 错误行内显示
3. **Pretty TypeScript Errors** - 更友好的错误提示

### 3.2 推荐设置

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",  // 使用项目版本
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## 四、与构建工具集成

### 4.1 Vite + TypeScript

```bash
# 创建 Vite + TS 项目
npm create vite@latest my-app -- --template vanilla-ts
# 或 vue-ts / react-ts
```

### 4.2 Webpack + TypeScript

```bash
# 安装 loader
npm install -D ts-loader
```

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}
```

---

## 五、类型检查运行时

### 5.1 类型擦除

> 重要概念：TypeScript 是**静态类型系统**

```typescript
// TypeScript 类型只在编译时存在，运行时完全擦除！

```

```typescript
// TS 源码
let num: number = 42
let str: string = 'hello'

// 编译后 JS
let num = 42
let str = 'hello'
// 类型信息完全消失了！
```

---

### 5.2 编译不影响运行时

```typescript
interface User {
  name: string
  age: number
}

// ❌ 错误：运行时不能用 typeof 判断类型
function isUser(obj: any): obj is User {
  return obj instanceof User  // ❌ User 不是值不存在！
}

// ✅ 正确：用属性判断
function isUser(obj: any): obj is User {
  return typeof obj.name === 'string' && 
         typeof obj.age === 'number'
}
```

---

## 六、常见问题

### Q1：TS 能在浏览器直接运行吗？

不能，浏览器只能运行 JS。需要先编译。

### Q2：必须给 JS 项目能渐进式接入 TS？

可以，把 `.js` 改成 `.ts` 逐步迁移，配置 `allowJs: true`。

### Q3：any 类型是什么？

`any` 表示任意类型，用了 `any` 就回到了 JS 的世界。尽量避免使用。

---

## 总结

✅

TypeScript 是 JavaScript 的超集，提供了类型系统。
2. 编译时类型检查，运行时类型擦除
3. 渐进式接入，成本低收益高
4. 现代前端项目必备技能

下一篇：**[基础类型详解](./02-基础类型详解.md**
