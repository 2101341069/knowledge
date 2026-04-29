---
title: React简介与环境搭建
tags:
  - 前端
  - React
  - 环境搭建
created: 2026-04-29
---

# React 简介与环境搭建

## 一、什么是 React？

### 1.1 React 定义

React 是由 Facebook（Meta）开发的开源 **JavaScript 库**，用于构建用户界面（UI）。

> React 专注于 MVC 架构中的 **View 层**，核心思想是：**组件化** + **声明式编程**。

### 1.2 React 的三大核心特性

#### 📦 组件化（Component-Based）
将 UI 拆分为独立、可复用的组件，每个组件封装自己的状态和逻辑。

```jsx
// 一个简单的按钮组件
function Button({ children, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  )
}
```

#### 📝 声明式编程（Declarative）
描述 UI 应该是什么样子，而不是手动操作 DOM。

```jsx
// 声明式：描述结果
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

对比**命令式**（原生 JS）：
```javascript
// 命令式：一步步操作
const ul = document.createElement('ul')
users.forEach(user => {
  const li = document.createElement('li')
  li.textContent = user.name
  ul.appendChild(li)
})
```

#### ⚡ 虚拟 DOM（Virtual DOM）
React 在内存中维护虚拟 DOM 树，状态变化时先比较新旧虚拟 DOM 的差异（Diff 算法），只更新实际变化的部分，最小化 DOM 操作。

---

## 二、开发环境搭建

### 2.1 环境要求

- **Node.js**: v18.0 或更高版本
- **包管理器**: npm、yarn 或 pnpm（推荐 pnpm）
- **IDE**: VS Code（推荐） + 相关插件

检查环境：
```bash
node -v   # 检查 Node 版本
npm -v    # 检查 npm 版本
```

---

### 2.2 使用 Vite 创建项目

Vite 是现代前端构建工具，启动快、热更新快，是创建 React 项目的首选。

```bash
# npm
npm create vite@latest my-react-app -- --template react

# pnpm（推荐）
pnpm create vite my-react-app --template react

# TypeScript 版本
pnpm create vite my-react-app --template react-ts
```

按照提示操作：
```bash
cd my-react-app
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
```

访问 `http://localhost:5173` 即可看到 React 项目。

---

### 2.3 项目目录结构

```
my-react-app/
├── node_modules/       # 依赖包
├── public/            # 静态资源
│   └── vite.svg
├── src/               # 源代码
│   ├── assets/        # 资源文件（图片、字体等）
│   │   └── react.svg
│   ├── App.css        # App 组件样式
│   ├── App.jsx        # App 根组件
│   ├── index.css      # 全局样式
│   └── main.jsx       # 入口文件
├── .gitignore
├── index.html         # HTML 入口
├── package.json
├── pnpm-lock.yaml
├── vite.config.js     # Vite 配置
└── README.md
```

---

### 2.4 入口文件解析

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 创建根节点并渲染 App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`<React.StrictMode>` - 严格模式，用于检测潜在问题：
- 识别不安全的生命周期
- 警告过时的 API
- 检测意外的副作用（开发环境下组件会渲染两次）

---

### 2.5 第一个组件：App.jsx

```jsx
// src/App.jsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // useState - React 状态 Hook
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* 点击事件 */}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

---

## 三、常用命令

```bash
# 开发模式
pnpm dev

# 生产构建
pnpm build

# 预览构建结果
pnpm preview

# 运行 eslint（如果配置了）
pnpm lint
```

---

## 四、VS Code 推荐插件

| 插件 | 用途 |
|------|------|
| **ES7+ React/Redux/React-Native snippets** | React 代码片段 |
| **ESLint** | 代码质量检查 |
| **Prettier** | 代码格式化 |
| **Auto Rename Tag** | 自动重命名标签 |
| **CSS Modules** | CSS Modules 支持 |
| **Error Lens** | 错误行内显示 |

---

## 五、React DevTools

浏览器开发者工具插件，用于调试 React 应用：

- **Chrome**: Chrome 应用商店搜索 "React Developer Tools"
- **Firefox**: 附加组件商店搜索

功能：
- 查看组件树结构
- 检查组件的 Props 和 State
- 查看组件渲染时间
- 手动触发组件重渲染
- Profiler 性能分析

---

## 六、React 版本说明

| 版本 | 重要特性 | 发布时间 |
|------|----------|----------|
| React 18 | 并发特性、Suspense、自动批处理 | 2022 年 3 月 |
| React 17 | 无新特性，JSX 转换优化 | 2020 年 10 月 |
| React 16.8 | Hooks 发布！ | 2019 年 2 月 |
| React 16 | Fiber 架构 | 2017 年 9 月 |

> 💡 目前主流使用 **React 18**，本知识库所有内容基于 React 18。

---

## 七、第一个练手小项目

修改 `App.jsx`，实现一个简单的计数器：

```jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>我的第一个 React 应用</h1>
      <div className="counter">
        <h2>计数: {count}</h2>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>
    </div>
  )
}

export default App
```

添加一些样式到 `App.css`：
```css
.app {
  text-align: center;
  padding: 40px;
}

.counter {
  margin-top: 30px;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
```

---

## 总结

✅ React = 组件化 + 声明式编程 + 虚拟 DOM
2. ✅ 使用 Vite 创建项目：`pnpm create vite@latest`
3. ✅ 核心命令：`pnpm dev` / `pnpm build`
4. ✅ 安装 React DevTools 插件调试
5. ✅ React 18 是当前主流版本

下一篇：**[JSX核心语法](./02-JSX核心语法.md)**
