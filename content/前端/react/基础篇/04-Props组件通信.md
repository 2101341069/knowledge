---
title: Props组件通信
tags:
  - 前端
  - React
  - Props
created: 2026-04-29
---

# Props 组件通信

## 一、什么是 Props？

Props = Properties，是**父组件向子组件传递数据**的方式。

> Props 是**只读**的，子组件不能修改父组件传来的 Props。

---

## 二、Props 基础用法

### 2.1 传递 Props

```jsx
// 父组件
function App() {
  return (
    <div>
      {/* 传递字符串 */}
      <Welcome name="Tom" />
      
      {/* 传递数字 */}
      <User age={25} />
      
      {/* 传递布尔值 */}
      <Button disabled={true} />
      <Button disabled />  {/* 简写等价于 true */}
      
      {/* 传递对象 */}
      <Profile user={{ id: 1, name: 'Tom', age: 25 }} />
      
      {/* 传递数组 */}
      <List items={['苹果', '香蕉', '橙子']} />
    </div>
  )
}
```

---

### 2.2 接收 Props

```jsx
// 方式一：整个 props 对象
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>
}

// 方式二：解构（推荐 ✅）
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>
}

// 多个 props
function UserCard({ name, age, avatar }) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{age} 岁</p>
    </div>
  )
}
```

---

## 三、Props 默认值

### 3.1 参数默认值

```jsx
function Button({ text = '点击', size = 'medium' }) {
  return <button className={`btn btn-${size}`}>{text}</button>
}

// 使用
<Button />                    {/* 显示"点击"，size = medium */}
<Button text="提交" size="large" />  {/* 显示"提交"，size = large */}
```

---

### 3.2 defaultProps（旧式写法）

```jsx
function Button({ text, size }) {
  return <button className={`btn btn-${size}`}>{text}</button>
}

Button.defaultProps = {
  text: '点击',
  size: 'medium'
}
```

> 💡 推荐使用**参数默认值**，更简洁直观。

---

## 四、children 属性

`children` 是特殊的 prop，表示组件的子内容：

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}  {/* 这里渲染子内容 */}
      </div>
    </div>
  )
}

// 使用
<Card title="用户信息">
  <p>姓名：Tom</p>      {/* 这些都是 children */}
  <p>年龄：25</p>
  <Button>编辑</Button>
</Card>
```

`children` 可以是任意类型：
- 字符串
- 数字
- JSX 元素
- 数组
- 函数（Render Props）

---

## 五、Props 类型校验（PropTypes）

运行时校验 props 的类型，帮助发现 bug：

```bash
# 安装
pnpm add prop-types
```

```jsx
import PropTypes from 'prop-types'

function UserCard({ name, age, isActive, onUpdate }) {
  return <div>...</div>
}

// 类型校验
UserCard.propTypes = {
  name: PropTypes.string.isRequired,   // 必需的字符串
  age: PropTypes.number,                // 可选数字
  isActive: PropTypes.bool,             // 布尔值
  onUpdate: PropTypes.func,             // 函数
  user: PropTypes.shape({               // 对象结构
    id: PropTypes.number,
    name: PropTypes.string
  }),
  items: PropTypes.arrayOf(PropTypes.string),  // 字符串数组
  status: PropTypes.oneOf(['pending', 'active', 'inactive']),  // 枚举
}

// 默认值
UserCard.defaultProps = {
  age: 0,
  isActive: false
}
```

> 💡 TypeScript 项目推荐用 TS 接口做类型检查，代替 PropTypes。

---

## 六、单向数据流

React 数据流是**单向**的：数据只能从父组件流向子组件。

```
父组件 → props → 子组件 → props → 孙组件
```

### 为什么是单向的？
- 数据流向清晰，容易追踪
- 避免子组件意外修改父组件状态
- 调试更简单

---

## 七、子组件向父组件通信

通过**回调函数**实现：

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0)

  // 定义回调函数，接收子组件的数据
  function handleChildChange(value) {
    setCount(value)
  }

  return (
    <div>
      <p>父组件计数：{count}</p>
      {/* 将回调函数传给子组件 */}
      <Child onCountChange={handleChildChange} />
    </div>
  )
}

// 子组件
function Child({ onCountChange }) {
  return (
    <button onClick={() => onCountChange(100)}>
      点击修改父组件状态
    </button>
  )
}
```

---

## 八、Props 展开传递

```jsx
function UserProfile({ name, age, email, avatar }) {
  return <div>...</div>
}

// ❌ 手动一个个传
<UserProfile 
  name={user.name}
  age={user.age}
  email={user.email}
  avatar={user.avatar}
/>

// ✅ 展开对象
<UserProfile {...user} />

// ✅ 部分展开 + 额外属性
<UserProfile {...user} isAdmin={true} />

// ✅ 覆盖属性（后面的会覆盖前面的）
<UserProfile {...user} name="Jerry" />  {/* name 会被覆盖为 Jerry */}
```

---

## 九、常见问题

### Q1：为什么不能直接修改 Props？

```jsx
// ❌ 错误：不能修改 props
function Button({ text }) {
  text = '新文本'  // ❌ 只读！
  return <button>{text}</button>
}
```

> 因为 React 要求组件是**纯函数**，相同输入应该产生相同输出。如果子组件能修改 props，数据流就乱了。

### Q2：组件层级太深，props 一层一层传太麻烦？

这叫 **Props 钻取（Props Drilling）**。

解决方案：
1. Context API（后面章节会讲）
2. Redux / Zustand 等状态管理库
3. 组件组合（Component Composition）

---

## 总结

✅ Props 是父传子的通信方式，**只读**
2. ✅ 使用**解构**接收 props，**参数默认值**设置默认
3. ✅ `children` 是特殊 prop，表示子内容
4. ✅ 子传父：子组件调用父组件传过来的回调函数
5. ✅ React 是**单向数据流**，数据从上往下流
6. ✅ `{...obj}` 展开传递，简化代码

下一篇：**[State状态管理](./05-State状态管理.md)**
