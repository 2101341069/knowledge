---
title: React组件基础
tags:
  - 前端
  - React
  - 组件
created: 2026-04-29
---

# React 组件基础

## 一、什么是组件？

组件是 React 应用的**基本构建块**，一个应用就是由大大小小的组件组合而成。

> 组件 = 视图（UI）+ 逻辑（Logic）+ 样式（Style）

```jsx
// 一个最简单的组件
function Button() {
  return <button>点击我</button>
}
```

---

## 二、组件的两种定义方式

### 2.1 函数组件（推荐 ✅）

现代 React 主流写法，使用函数 + Hooks：

```jsx
// 写法一：普通函数
function Welcome() {
  return <h1>Hello, React!</h1>
}

// 写法二：箭头函数
const Welcome = () => {
  return <h1>Hello, React!</h1>
}

// 简写（只有 return 时）
const Welcome = () => <h1>Hello, React!</h1>
```

---

### 2.2 类组件（旧式写法）

React 16.8 之前的主流写法，现在逐渐被 Hooks 取代：

```jsx
import React from 'react'

class Welcome extends React.Component {
  render() {
    return <h1>Hello, React!</h1>
  }
}
```

> 💡 除非维护老项目，否则优先使用**函数组件**。

---

## 三、组件的命名规范

### 3.1 首字母必须大写

```jsx
// ✅ 正确：首字母大写
function Button() {}
function UserProfile() {}

// ❌ 错误：首字母小写会被当作 HTML 标签
function button() {}
```

### 3.2 帕斯卡命名法（PascalCase）

```jsx
// ✅ 正确
MyComponent
UserProfile
AdminDashboard

// ❌ 不推荐
myComponent   // camelCase（JS 变量用）
my_component  // snake_case
```

---

## 四、组件的组合与嵌套

组件可以像 HTML 标签一样互相嵌套：

```jsx
// 子组件
function Header() {
  return <header>网站头部</header>
}

function Content() {
  return <main>主要内容</main>
}

function Footer() {
  return <footer>页脚</footer>
}

// 父组件组合子组件
function App() {
  return (
    <div className="app">
      <Header />
      <Content />
      <Footer />
    </div>
  )
}
```

---

## 五、组件的导出与导入

### 5.1 默认导出

```jsx
// Button.jsx
export default function Button() {
  return <button>点击</button>
}

// App.jsx
import Button from './Button'  // 不需要花括号
```

---

### 5.2 命名导出

```jsx
// components.js
export function Button() { return <button>按钮</button> }
export function Input() { return <input /> }
export function Card() { return <div className="card"></div> }

// App.jsx
import { Button, Input, Card } from './components'  // 需要花括号
```

---

### 5.3 混合导出

```jsx
// Modal.jsx
function Modal() { return <div>模态框</div> }
function ModalHeader() { return <div>标题</div> }
function ModalBody() { return <div>内容</div> }
function ModalFooter() { return <div>底部</div> }

export default Modal
export { ModalHeader, ModalBody, ModalFooter }

// 导入
import Modal, { ModalHeader, ModalBody } from './Modal'
```

---

## 六、组件目录结构建议

### 6.1 简单项目

```
src/
├── components/        # 通用可复用组件
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   └── Modal.jsx
├── pages/            # 页面组件
│   ├── Home.jsx
│   ├── About.jsx
│   └── User.jsx
├── App.jsx
└── main.jsx
```

---

### 6.2 组件文件结构

每个组件单独一个文件夹，相关文件放在一起：

```
src/components/
└── Button/
    ├── index.jsx          # 组件入口
    ├── Button.jsx         # 组件实现
    ├── Button.css         # 组件样式
    ├── Button.test.jsx    # 测试文件
    └── README.md          # 文档
```

---

## 七、组件分类

### 7.1 展示组件（Presentational）

专注于 UI 展示，不管理业务数据：

```jsx
// 只负责展示，数据通过 props 传入
function UserCard({ name, avatar, bio }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  )
}
```

---

### 7.2 容器组件（Container）

负责数据获取和业务逻辑：

```jsx
// 负责获取数据，然后传给展示组件
function UserCardContainer({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])

  if (loading) return <div>加载中...</div>
  if (!user) return <div>用户不存在</div>

  return <UserCard name={user.name} avatar={user.avatar} bio={user.bio} />
}
```

---

## 八、组件开发最佳实践

### 8.1 单一职责原则

一个组件只做一件事，保持简单。

```jsx
// ❌ 不好：一个组件做太多事
function UserPage() {
  // 获取用户数据
  // 获取文章列表
  // 处理点赞
  // 处理评论
  // 渲染整个页面...
}

// ✅ 好：拆分组件
function UserPage() {
  return (
    <div>
      <UserProfile />
      <UserArticles />
      <CommentList />
    </div>
  )
}
```

---

### 8.2 组件复用

相同的 UI 提取为公共组件：

```jsx
// ❌ 重复代码
<div className="card">
  <h3>标题1</h3>
  <p>内容1</p>
</div>
<div className="card">
  <h3>标题2</h3>
  <p>内容2</p>
</div>

// ✅ 提取组件
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}

<Card title="标题1">内容1</Card>
<Card title="标题2">内容2</Card>
```

---

### 8.3 保持组件纯净

纯函数组件：相同的输入（props）永远产生相同的输出。

```jsx
// ✅ 纯净：只依赖 props
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}

// ❌ 不纯净：依赖外部变量
const userName = 'Tom'
function Greeting() {
  return <h1>Hello, {userName}!</h1>
}
```

---

## 总结

✅ 组件是 React 的构建块 = UI + 逻辑 + 样式
2. ✅ 优先使用**函数组件**，类组件用于老项目
3. ✅ 组件名必须**首字母大写**（PascalCase）
4. ✅ 组件可以嵌套组合，像搭积木一样构建应用
5. ✅ 单一职责：一个组件只做一件事
6. ✅ 展示组件 vs 容器组件：分离 UI 和业务逻辑

下一篇：**[Props组件通信](./04-Props组件通信.md)**
