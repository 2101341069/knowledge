---
title: JSX核心语法
tags:
  - 前端
  - React
  - JSX
created: 2026-04-29
---

# JSX 核心语法

## 一、什么是 JSX？

JSX = JavaScript XML，是 React 发明的一种**在 JS 中编写类似 HTML 语法**的扩展。

```jsx
// JSX - 在 JS 中写 HTML
const element = <h1>Hello, React!</h1>
```

> 💡 JSX 最终会被编译成普通的 JavaScript 函数调用（Babel 编译）。

---

## 二、为什么用 JSX？

### 2.1 直观、可读性强

```jsx
// JSX 写法（直观）
function Profile({ user }) {
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  )
}
```

对比不用 JSX（原生 `React.createElement`）：
```javascript
// 不直观，嵌套深了可读性差
function Profile({ user }) {
  return React.createElement('div', { className: 'profile' },
    React.createElement('img', { src: user.avatar, alt: user.name }),
    React.createElement('h2', null, user.name),
    React.createElement('p', null, user.bio)
  )
}
```

---

## 三、JSX 基本语法

### 3.1 在 JSX 中嵌入表达式

使用 `{ }` 包裹 JavaScript 表达式：

```jsx
const name = 'Tom'
const greeting = <h1>Hello, {name}!</h1>  // 变量

function formatName(user) {
  return user.firstName + ' ' + user.lastName
}

const user = { firstName: 'John', lastName: 'Doe' }
const element = <h1>Hello, {formatName(user)}!</h1>  // 函数调用

// 运算表达式
const a = 10, b = 20
const sum = <p>{a} + {b} = {a + b}</p>

// 三元运算符
const isLogin = true
const loginStatus = <p>{isLogin ? '已登录' : '未登录'}</p>
```

---

### 3.2 JSX 本身也是表达式

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>
  }
  return <h1>Hello, Stranger.</h1>
}

// 可以赋值给变量
const element = getGreeting(user)
```

---

## 四、JSX 属性

### 4.1 基本用法

```jsx
// 字符串字面量属性
const avatar = <img src="avatar.jpg" alt="avatar" />

// 表达式属性
const imgUrl = 'avatar.jpg'
const avatar2 = <img src={imgUrl} alt="avatar" />

// 布尔属性
const input = <input type="checkbox" disabled={true} />
// 简写：只要属性名存在就为 true
const input2 = <input type="checkbox" disabled />
```

---

### 4.2 className（注意不是 class）

因为 `class` 是 JavaScript 关键字，JSX 中使用 `className`：

```jsx
// ❌ 错误
<div class="container">...</div>

// ✅ 正确
<div className="container">...</div>
```

---

### 4.3 style 属性（对象）

style 属性接收一个对象（驼峰命名）：

```jsx
const style = {
  color: 'red',
  backgroundColor: 'lightgray',  // background-color → backgroundColor
  fontSize: '16px'
}

<div style={style}>Hello</div>

// 或内联写法
<div style={{ color: 'blue', fontSize: '14px' }}>Hello</div>
```

---

### 4.4 展开属性（Spread Attributes）

```jsx
const props = {
  id: 'my-input',
  type: 'text',
  placeholder: '请输入内容',
  className: 'form-input'
}

// 展开所有属性
<input {...props} />

// 等价于
<input
  id="my-input"
  type="text"
  placeholder="请输入内容"
  className="form-input"
/>

// 也可以部分展开，再加其他属性
<input {...props} disabled onChange={handleChange} />
```

---

## 五、JSX 中的子元素

### 5.1 嵌套元素

```jsx
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
)
```

> 💡 多行 JSX 建议用括号包裹，避免自动分号陷阱。

---

### 5.2 空标签（Fragment）

当不需要额外的 DOM 节点时，使用空标签 `<></>`：

```jsx
// ❌ 多了一层无用的 div
return (
  <div>
    <dt>{term}</dt>
    <dd>{description}</dd>
  </div>
)

// ✅ 使用 Fragment，不产生额外 DOM
return (
  <>
    <dt>{term}</dt>
    <dd>{description}</dd>
  </>
)

// 或使用 React.Fragment（需要 key 时）
return (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
)
```

---

### 5.3 子元素可以是多种类型

```jsx
// 字符串
<p>Hello World</p>

// 数字
<p>{123}</p>

// 数组
<ul>
  {[<li key="1">Item 1</li>, <li key="2">Item 2</li>]}
</ul>

// 布尔值、null、undefined 不会渲染
<p>{true}</p>          {/* 空 */}
<p>{false}</p>         {/* 空 */}
<p>{null}</p>          {/* 空 */}
<p>{undefined}</p>     {/* 空 */}
```

---

## 六、条件渲染

### 6.1 if/else

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来！</h1>
  }
  return <h1>请先登录</h1>
}
```

---

### 6.2 三元运算符（常用）

```jsx
function Status({ isLoggedIn }) {
  return (
    <p>
      用户当前状态：{isLoggedIn ? '已登录' : '未登录'}
    </p>
  )
}
```

---

### 6.3 逻辑与 `&&`（常用）

```jsx
// 条件为 true 时渲染后面的内容，否则不渲染
function UserPanel({ user, isAdmin }) {
  return (
    <div>
      <p>欢迎, {user.name}</p>
      {isAdmin && <button>管理后台</button>}
    </div>
  )
}

// ❌ 注意：如果条件是 0，会渲染 0！
// 因为 0 是 falsy 值，但 React 会渲染数字
{count && <p>共 {count} 条</p>}  // count = 0 时会显示 0

// ✅ 改为布尔值
{count > 0 && <p>共 {count} 条</p>}  // count = 0 时不显示
```

---

### 6.4 || 提供默认值

```jsx
// 当 username 为空时显示 '访客'
<p>用户名：{username || '访客'}</p>
```

---

## 七、JSX 自动转义

JSX 会自动转义内容，防止 XSS 攻击：

```jsx
const userInput = '<script>alert("hacked")</script>'

// ✅ 安全，内容会被转义，不会执行
<p>{userInput}</p>
// 渲染为：<p>&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;</p>

// ❌ 危险！除非你完全信任内容
<p dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## 八、常见坑点总结

| 坑点 | 错误写法 | 正确写法 |
|------|---------|----------|
| class 关键字 | `<div class="box">` | `<div className="box">` |
| style 必须是对象 | `<div style="color: red">` | `<div style={{ color: 'red' }}>` |
| 标签必须闭合 | `<input>` | `<input />` |
| 首字母大写表示组件 | `<myComponent>` | `<MyComponent>` |
| 0 && 会渲染 0 | `{count && <p>...</p>}` | `{count > 0 && <p>...</p>}` |
| 一个组件只能返回一个根元素 | 两个同级标签 | 用 `<>` 包裹 |

---

## 总结

✅ JSX = JavaScript + XML，直观描述 UI
2. ✅ `{ }` 嵌入任意 JS 表达式
3. ✅ `className`、`style={{ }}` 特殊语法
4. ✅ 条件渲染：三元、`&&`、`||`
5. ✅ Fragment `<></>` 避免多余 DOM 节点
6. ✅ JSX 自动转义，安全防 XSS

下一篇：**[React组件基础](./03-React组件基础.md)**
