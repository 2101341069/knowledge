---
title: 深入Hooks
tags:
  - 前端
  - React
  - Hooks
created: 2026-04-29
---

# 深入 Hooks

## 一、Hooks 核心规则

### 1.1 只在顶层调用 Hooks

```jsx
// ✅ 正确：函数组件顶层
function MyComponent() {
  const [count, setCount] = useState(0)
  useEffect(() => { ... })
}

// ❌ 错误：不要在条件语句中调用
if (x > 0) {
  const [count, setCount] = useState(0)
}

// ❌ 错误：不要在循环中调用
for (let i = 0; i < 10; i++) {
  useEffect(() => { ... })
}

// ❌ 错误：不要在嵌套函数中调用
function handleClick() {
  const [count, setCount] = useState(0)
}
```

> 💡 原因：React 依赖 Hooks 调用顺序来识别每个 state。顺序变了就乱了。

---

## 二、核心 Hooks 详解

### 2.1 useState - 状态管理

```jsx
// 惰性初始化：初始值需要计算时用函数
const [state, setState] = useState(() => {
  return expensiveCalculation()  // 只执行一次
})

// 函数式更新：新值依赖旧值时用
setState(prevState => {
  return { ...prevState, ...newValues }
})
```

---

### 2.2 useEffect - 副作用

#### 执行时机

```
渲染 → 浏览器绘制 → 执行 effect
```

#### 四种使用模式

```jsx
// 1️⃣ 每次渲染后执行（没依赖数组）
useEffect(() => {
  console.log('每次渲染都执行')
})

// 2️⃣ 只在挂载后执行一次（空数组）
useEffect(() => {
  console.log('只执行一次，类似 componentDidMount')
}, [])

// 3️⃣ 挂载 + 依赖变化执行
useEffect(() => {
  console.log('a 或 b 变化时执行')
}, [a, b])

// 4️⃣ 挂载执行 + 卸载前清理
useEffect(() => {
  const subscription = subscribe()
  return () => {
    subscription.unsubscribe()  // 卸载前执行
  }
}, [])
```

---

### 2.3 useRef - 引用

三种用法：

```jsx
// 1️⃣ 访问 DOM 元素
function InputFocus() {
  const inputRef = useRef(null)

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        聚焦输入框
      </button>
    </>
  )
}

// 2️⃣ 保存可变值（类似实例变量，修改不会触发重渲染）
function Timer() {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => { ... }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])
}

// 3️⃣ 保存上一次的 props/state
function PrevValue({ value }) {
  const prevValueRef = useRef(value)

  useEffect(() => {
    prevValueRef.current = value
  }, [value])

  return <div>当前: {value}, 上次: {prevValueRef.current}</div>
}
```

---

### 2.4 useMemo - 缓存计算结果

```jsx
function ExpensiveList({ items, filter }) {
  // 只有 items 或 filter 变化时才重新计算过滤结果
  const filteredItems = useMemo(() => {
    return items.filter(item => item.includes(filter))
  }, [items, filter])  // 依赖数组

  return (
    <ul>
      {filteredItems.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}
```

> 💡 什么时候用？计算真正昂贵的时候（比如遍历大数组、复杂计算）。不要什么都包 useMemo，反而会变慢。

---

### 2.5 useCallback - 缓存函数

```jsx
function Parent() {
  const [count, setCount] = useState(0)

  // 缓存函数，只有 count 变化时才创建新函数
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1)
  }, [count])

  return <Child onIncrement={handleIncrement} />
}

// 子组件用 memo 包裹，props 没变就不重渲染
const Child = memo(function Child({ onIncrement }) {
  return <button onClick={onIncrement}>+</button>
})
```

> 💡 useCallback 配合 memo 使用，才能避免子组件不必要的重渲染。单独用 useCallback 没意义。

---

### 2.6 useContext - 跨层级传递数据

```jsx
// 1. 创建 Context
const ThemeContext = createContext('light')

// 2. Provider 提供值
function App() {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// 3. 任意层级的子组件消费值
function Button() {
  const theme = useContext(ThemeContext)
  return <button style={{ background: theme === 'dark' ? '#333' : '#fff' }} />
}
```

---

### 2.7 useReducer - 复杂状态管理

适合状态逻辑复杂、有多个子值、下一个状态依赖上一个状态的场景：

```jsx
// 定义 reducer：(state, action) => newState
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: action.payload }
    default:
      throw new Error('未知 action')
  }
}

function Counter() {
  // useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>重置</button>
    </div>
  )
}
```

> 💡 useState 是简化版的 useReducer。状态复杂时用 useReducer，逻辑集中在 reducer 里好维护。

---

## 三、自定义 Hooks

提取和复用组件逻辑：

```jsx
// 自定义 Hook：useCounter
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}

// 使用
function Counter() {
  const { count, increment, decrement, reset } = useCounter(10)
  return (
    <div>
      {count}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

---

### 常用自定义 Hooks 举例

```jsx
// useLocalStorage - 自动同步到 localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  const setStoredValue = (newValue) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue]
}

// useMounted - 是否挂载
function useMounted() {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  return mounted
}

// useDebounce - 防抖值
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

---

## 四、闭包陷阱

### 问题

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // ❌ 问题：三秒后打印的永远是 0！
  // 因为 effect 只执行一次，里面的 count 永远是第一次渲染时的值
  useEffect(() => {
    setTimeout(() => {
      console.log(count)
    }, 3000)
  }, [])

  return <div>{count}</div>
}
```

---

### 解决方法

```jsx
// ✅ 方法1：加依赖
useEffect(() => {
  setTimeout(() => {
    console.log(count)
  }, 3000)
}, [count])  // 加 count 到依赖里

// ✅ 方法2：函数式更新（只适用于更新 state）
setCount(prev => prev + 1)  // prev 永远是最新的

// ✅ 方法3：用 ref 保存最新值
const countRef = useRef(count)
useEffect(() => {
  countRef.current = count
}, [count])

useEffect(() => {
  setTimeout(() => {
    console.log(countRef.current)  // 永远最新
  }, 3000)
}, [])
```

---

## 总结

✅ **Hooks 规则**：只在组件顶层调用，命名以 use 开头
2. ✅ **核心 Hooks**：`useState`/`useEffect`/`useRef`/`useMemo`/`useCallback`/`useContext`/`useReducer`
3. ✅ **自定义 Hooks**：提取复用逻辑，这是 Hooks 最大的价值
4. ✅ **闭包陷阱**：理解闭包 + 正确写依赖数组 + useRef 变通

下一篇：**[Context状态管理](./02-Context状态管理.md)**
