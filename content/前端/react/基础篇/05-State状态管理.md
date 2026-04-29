---
title: State状态管理
tags:
  - 前端
  - React
  - State
  - useState
created: 2026-04-29
---

# State 状态管理

## 一、什么是 State？

State 是组件的**内部数据**，可以理解为组件的"记忆"。当 State 变化时，组件会**自动重新渲染**。

> State vs Props：
> - **State**：组件内部私有数据，组件自己管理
> - **Props**：父组件传来的数据，只读

---

## 二、useState Hook

`useState` 是 React 最基础的 Hook，用于在函数组件中声明状态。

### 2.1 基本用法

```jsx
import { useState } from 'react'

function Counter() {
  // 声明一个状态变量 count，初始值为 0
  // setCount 是更新状态的函数
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

---

### 2.2 useState 语法解析

```jsx
const [state, setState] = useState(initialValue)
```

- `state`：当前状态值
- `setState`：更新状态的函数（调用会触发重渲染）
- `initialValue`：初始值

> 💡 `[a, b]` 是数组解构语法，不是 React 特有的。

---

## 三、状态更新的两种方式

### 3.1 直接传新值

```jsx
const [count, setCount] = useState(0)

setCount(100)  // 直接设置为 100
```

---

### 3.2 函数式更新（基于旧状态）

```jsx
// 当新状态依赖旧状态时，必须用函数式更新！
setCount(prevCount => prevCount + 1)

// ❌ 错误：连续多次更新可能不生效
function increment3() {
  setCount(count + 1)  // count 是旧值
  setCount(count + 1)  // 还是同一个旧值！
  setCount(count + 1)
}
// 结果：只 +1，不是 +3

// ✅ 正确：函数式更新，每次拿到最新值
function increment3() {
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
}
// 结果：+3 ✓
```

---

## 四、各种类型的 State

### 4.1 数字、字符串、布尔值

```jsx
const [count, setCount] = useState(0)           // 数字
const [name, setName] = useState('Tom')          // 字符串
const [isLoading, setIsLoading] = useState(false) // 布尔值
```

---

### 4.2 数组状态

```jsx
const [todos, setTodos] = useState(['吃饭', '睡觉'])

// 添加
function addTodo(newTodo) {
  // ✅ 创建新数组（不可变）
  setTodos([...todos, newTodo])
}

// 删除
function deleteTodo(index) {
  setTodos(todos.filter((_, i) => i !== index))
}

// 修改
function updateTodo(index, newValue) {
  const newTodos = [...todos]
  newTodos[index] = newValue
  setTodos(newTodos)
}
```

> ❌ 不能直接修改原数组：`todos.push('xx')`、`todos.splice()`、`todos[0] = 'xx'`
> ✅ 必须返回**新数组**。

---

### 4.3 对象状态

```jsx
const [user, setUser] = useState({
  name: 'Tom',
  age: 25,
  address: {
    city: '北京',
    street: 'xxx路'
  }
})

// 修改部分属性（展开 + 覆盖）
function updateName(newName) {
  setUser({
    ...user,          // 复制原有所有属性
    name: newName     // 覆盖要修改的
  })
}

// 修改嵌套对象（逐层展开！）
function updateCity(newCity) {
  setUser({
    ...user,
    address: {
      ...user.address,   // 先复制嵌套对象
      city: newCity      // 再覆盖
    }
  })
}
```

> ⚠️ 同样不可直接修改：`user.name = 'Jerry'`（不会触发重渲染）

---

## 五、状态的不可变性

React 状态更新的核心原则：**永远不要直接修改原状态，永远返回新值**。

### 为什么？

1. **性能优化**：React 通过比较引用变化判断是否需要重渲染
2. **时间旅行**：Redux DevTools 等依赖不可变数据
3. **可预测**：不会产生意外的副作用

```jsx
// ❌ 直接修改（错误）
const user = { name: 'Tom' }
user.name = 'Jerry'  // 同一个对象，引用没变
setUser(user)         // ❌ React 以为没变，不重渲染

// ✅ 创建新对象（正确）
const newUser = { ...user, name: 'Jerry' }
setUser(newUser)      // ✅ 新引用，触发重渲染
```

---

## 六、状态提升（State Lifting）

当多个组件需要共享状态时，将状态提升到最近的公共父组件：

```jsx
// ❌ 各自管理自己的状态：没法共享
function InputA() { const [value, setValue] = useState('') }
function InputB() { const [value, setValue] = useState('') }

// ✅ 提升到父组件
function Parent() {
  const [value, setValue] = useState('')  // 状态在父组件

  return (
    <div>
      <InputA value={value} onChange={setValue} />
      <InputB value={value} onChange={setValue} />
    </div>
  )
}
```

> 谁使用状态，谁就拥有这个状态。需要共享就往上提。

---

## 七、常见问题

### Q1：更新状态后立刻读取，为什么还是旧值？

```jsx
function handleClick() {
  setCount(count + 1)
  console.log(count)  // 还是旧值！
}
```

因为 `setState` 是**异步**的，不会立刻更新。下一次渲染时 `count` 才是新值。

---

### Q2：初始值需要计算怎么办？

```jsx
// 传函数：惰性初始化，只在第一次渲染时执行
const [data, setData] = useState(() => {
  return expensiveCalculation()  // 昂贵的计算
})

// ❌ 直接传值：每次渲染都会执行计算
const [data, setData] = useState(expensiveCalculation())
```

---

### Q3：状态更新后怎么执行后续操作？

用 `useEffect`（后面章节会详细讲）：

```jsx
useEffect(() => {
  console.log('count 变化了：', count)
}, [count])
```

---

## 八、使用 State 的最佳实践

1. **该拆就拆**：不相关的状态分成多个 useState
   ```jsx
   // ✅ 好
   const [name, setName] = useState('')
   const [age, setAge] = useState(0)
   
   // ❌ 没必要放一起
   const [state, setState] = useState({ name: '', age: 0 })
   ```

2. **保持状态最小化**：能计算的就不要存状态
   ```jsx
   const [list, setList] = useState([1, 2, 3])
   // ✅ 计算出来，不要单独存 count
   const count = list.length
   ```

3. **避免冗余状态**：如果一个值可以从 props 或其他 state 算出，就不要单独存。

---

## 总结

✅ `useState` 声明状态，返回 `[state, setState]`
2. ✅ setState 两种方式：直接传值 / 函数式更新（依赖旧值时）
3. ✅ **状态不可变**：数组/对象要创建新的，不能直接改原数据
4. ✅ 状态更新是**异步**的，更新后立刻读还是旧值
5. ✅ 多个组件共享状态 → **状态提升**到最近公共父组件
6. ✅ 初始值昂贵计算 → 用函数惰性初始化

下一篇：**[事件处理](./06-事件处理.md)**
