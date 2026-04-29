---
title: 列表与Key
tags:
  - 前端
  - React
  - 列表渲染
created: 2026-04-29
---

# 列表与 Key

## 一、渲染列表

使用 JavaScript 的 `map()` 方法渲染列表：

```jsx
const numbers = [1, 2, 3, 4, 5]

function NumberList() {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number.toString()}>
          {number}
        </li>
      ))}
    </ul>
  )
}
```

> 💡 JSX 中嵌入数组，React 会自动展开渲染。

---

## 二、为什么需要 Key？

### 2.1 Key 的作用

Key 帮助 React 识别哪些元素改变了，比如添加或删除。

```jsx
// ❌ 不写 key 会有警告！
{todos.map(todo => (
  <li>{todo.text}</li>
))}

// ✅ 加上 key
{todos.map(todo => (
  <li key={todo.id}>
    {todo.text}
  </li>
))}
```

---

### 2.2 没有 Key 的问题

```jsx
// 列表：[A, B, C] → [B, C]
// ❌ 没有 key：删除第一个 → React 以为是 C 被删了，A 和 B 都重渲染
// ✅ 有 key：React 知道 A 被删了，B 和 C 只是移上去，复用不重渲染
```

---

## 三、Key 的正确用法

### 3.1 用稳定唯一的 ID（最佳）

```jsx
const todos = [
  { id: 1, text: '学习 React' },
  { id: 2, text: '学习 Vue' },
  { id: 3, text: '学习 Angular' }
]

{todos.map(todo => (
  <li key={todo.id}>  {/* id 稳定唯一 ✅ */}
    {todo.text}
  </li>
))}
```

---

### 3.2 万不得已用数组下标 index

```jsx
// ❌ 不推荐！会有问题
{todos.map((todo, index) => (
  <li key={index}>
    {todo.text}
  </li>
))}
```

什么情况下用 index 会出 bug？

1. 列表会**重新排序**
2. 列表会**插入/删除**中间的项

```jsx
// 例子： [A, B, C] → 在头部插入 X
// 原 key: 0:A, 1:B, 2:C
// 新 key: 0:X, 1:A, 2:B, 3:C
// React 以为 A 变成 X，B 变成 A，C 变成 B，新增 C
// 结果：所有元素都被错误更新！
```

---

### 3.3 Key 不需要全局唯一

```jsx
// 只要在兄弟节点之间唯一就行
<ul>
  {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
</ul>

<ul>
  {users.map(user => <li key={user.id}>{user.name}</li>)}
</ul>
// todos.id 和 users.id 可以重复，没问题
```

---

### 3.4 Key 不会传给 Props

Key 是 React 内部用的，**不会**作为 props 传给组件：

```jsx
<ListItem key={item.id} item={item} />

// ListItem 组件内部拿不到 this.props.key！
function ListItem({ item }) {
  console.log(item.key)  // undefined
}
```

如果需要 id，显式传另一个 prop：

```jsx
<ListItem key={item.id} id={item.id} item={item} />
```

---

## 四、常见列表操作

### 4.1 基础渲染

```jsx
function UserList({ users }) {
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <img src={user.avatar} alt={user.name} />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
```

---

### 4.2 过滤 + 渲染

```jsx
function ActiveUserList({ users }) {
  return (
    <div>
      {users
        .filter(user => user.isActive)  // 只渲染活跃用户
        .map(user => (
          <div key={user.id}>{user.name}</div>
        ))
      }
    </div>
  )
}
```

---

### 4.3 排序 + 渲染

```jsx
function SortedUserList({ users }) {
  return (
    <div>
      {users
        .sort((a, b) => a.age - b.age)  // 按年龄排序
        .map(user => (
          <div key={user.id}>{user.name} - {user.age}岁</div>
        ))
      }
    </div>
  )
}
```

---

### 4.4 分页 + 渲染

```jsx
function PaginatedList({ items, page, pageSize }) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return (
    <div>
      {items
        .slice(start, end)  // 分页截取
        .map(item => (
          <div key={item.id}>{item.name}</div>
        ))
      }
    </div>
  )
}
```

---

## 五、空列表处理

```jsx
function TodoList({ todos }) {
  // 列表为空时显示提示
  if (todos.length === 0) {
    return <div className="empty">暂无任务</div>
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

---

## 六、列表性能优化

### 6.1 虚拟滚动（Virtual Scroll）

长列表（1000+ 条）不要全部渲染，只渲染可视区域内的部分。

推荐库：
- `react-window`（轻量）
- `react-virtualized`（功能全）

```jsx
// react-window 例子
import { FixedSizeList as List } from 'react-window'

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
)

const MyList = () => (
  <List
    height={400}
    itemCount={10000}
    itemSize={50}
    width={300}
  >
    {Row}
  </List>
)
```

---

### 6.2 避免不必要的重渲染

```jsx
// memo 包裹列表项，只有 props 变了才重渲染
const ListItem = React.memo(function ListItem({ item }) {
  return <div>{item.name}</div>
})

function List({ items }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

---

## 七、常见坑点

### Q1：为什么不要用 Math.random() 当 key？

```jsx
// ❌ 非常糟糕！
// 每次渲染 key 都变，React 会销毁重建所有元素！
{list.map(item => <li key={Math.random()}>{item}</li>)}
```

性能极差，状态也会丢失。

---

### Q2：列表项是组件，key 写在哪里？

```jsx
// ✅ key 写在 map 直接返回的元素上，不管是不是组件
{list.map(item => <TodoItem key={item.id} todo={item} />)}

// ❌ 不要写在组件内部的根元素上
function TodoItem({ todo }) {
  return <li key={todo.id}>...</li>  // ❌ 没用！
}
```

---

### Q3：key 重复会怎么样？

```jsx
// ❌ key 重复，React 会报警告
// 可能导致状态混乱（比如 input 的值串了）
{list.map(item => <li key="same">{item}</li>)}
```

---

## 总结

✅ 列表用 `map()` 渲染，**必须写 key**
2. ✅ key 原则：**稳定、唯一、同一兄弟层级内不重复**
3. ✅ 优先用数据 ID，万不得已用 index
4. ✅ key 是 React 内部用的，不会作为 props 传给组件
5. ✅ 长列表用虚拟滚动优化性能

下一篇：**[表单处理](./08-表单处理.md)**
