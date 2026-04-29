---
title: 生命周期与useEffect
tags:
  - 前端
  - React
  - 生命周期
  - useEffect
created: 2026-04-29
---

# 生命周期与 useEffect

## 一、类组件生命周期回顾

### 1.1 三大阶段

```
挂载（Mount）：组件第一次出现在页面
更新（Update）：props 或 state 变化，重新渲染
卸载（Unmount）：组件从页面移除
```

```jsx
class LifecycleDemo extends React.Component {
  // 1. 挂载阶段
  constructor(props) { super(props) }
  componentDidMount() { console.log('挂载完成') }

  // 2. 更新阶段
  componentDidUpdate(prevProps, prevState) { console.log('更新完成') }

  // 3. 卸载阶段
  componentWillUnmount() { console.log('即将卸载') }
}
```

---

## 二、函数组件：useEffect

`useEffect` 是函数组件处理副作用的 Hook，可以替代类组件的生命周期方法。

> **副作用**：数据获取、订阅、DOM 操作、定时器等，和渲染无关的操作。

---

### 2.1 基本用法

```jsx
import { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  // 每次渲染完成后执行
  useEffect(() => {
    document.title = `点击了 ${count} 次`
  })

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
    </div>
  )
}
```

---

### 2.2 依赖数组（控制执行时机）

```jsx
// 1️⃣ 没有依赖数组 → 每次渲染后都执行
useEffect(() => {
  console.log('每次渲染都执行')
})

// 2️⃣ 空数组 [] → 只在挂载后执行一次（等价 componentDidMount）
useEffect(() => {
  console.log('只在挂载时执行一次')
}, [])

// 3️⃣ 有依赖 [a, b] → 挂载时 + a/b 变化时执行
useEffect(() => {
  console.log('a 或 b 变了')
}, [a, b])
```

---

### 2.3 清理副作用（Cleanup）

返回一个函数，在组件卸载或依赖变化前执行（等价 componentWillUnmount）：

```jsx
useEffect(() => {
  // 1. 挂载/更新时执行：设置定时器
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)

  // 2. 返回清理函数：卸载/重渲染前执行
  return () => {
    clearInterval(timer)
    console.log('清理定时器')
  }
}, [])
```

---

## 三、useEffect 常见场景

### 3.1 数据获取（API 请求）

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 异步函数
    async function fetchUser() {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()
      setUser(data)
      setLoading(false)
    }

    fetchUser()
  }, [userId])  // userId 变了重新获取

  if (loading) return <div>加载中...</div>
  return <div>{user.name}</div>
}
```

> 💡 注意不能直接给 useEffect 传 async：`useEffect(async () => {})` 是错误写法。

---

### 3.2 订阅事件

```jsx
function ScrollPosition() {
  const [y, setY] = useState(0)

  useEffect(() => {
    function handleScroll() {
      setY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    
    // 清理：移除监听器
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <p>滚动距离：{y}px</p>
}
```

---

### 3.3 防抖搜索

```jsx
function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      // 用户停止输入 500ms 后才请求
      fetchSearchResults(query).then(setResults)
    }, 500)

    // 每次 query 变化先清掉上次的定时器
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {results.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## 四、类组件 vs 函数组件生命周期对比

| 类组件 | 函数组件 Hooks 写法 |
|--------|-------------------|
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [依赖])` |
| `componentWillUnmount` | `useEffect` return 的清理函数 |
| 三者组合 | 一个 `useEffect` 搞定 ✅ |

---

## 五、依赖数组的注意事项

### 5.1 依赖必须准确

```jsx
// ❌ 错误：count 变了但没在依赖中，effect 不会更新
useEffect(() => {
  document.title = `点击了 ${count} 次`
}, [])  // 漏掉了 count！

// ✅ 正确：所有 effect 中用到的变量都要加依赖
useEffect(() => {
  document.title = `点击了 ${count} 次`
}, [count])
```

---

### 5.2 函数作为依赖

```jsx
function Demo() {
  const [count, setCount] = useState(0)

  // ❌ 每次渲染都会创建新函数，effect 每次都执行
  const fetchData = () => {
    console.log('请求数据', count)
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])  // fetchData 每次都变
}

// ✅ 解决方案：用 useCallback 包起来
const fetchData = useCallback(() => {
  console.log('请求数据', count)
}, [count])
```

---

## 六、常见坑点

### Q1：为什么 useEffect 执行了两次？

开发模式下 React 会故意执行两次 effect，帮助你发现没有正确清理副作用的 bug。这是正常的。

```
挂载 → effect 执行
模拟卸载 → 清理函数执行
重新挂载 → effect 再次执行
```

生产模式只会执行一次。

---

### Q2：无限循环怎么回事？

```jsx
// ❌ 无限循环！
useEffect(() => {
  setCount(count + 1)  // effect 里更新了 count
}, [count])  // count 变化又触发 effect
```

原因：effect 内部更新了自己的依赖变量 → 触发重渲染 → 再触发 effect → 循环。

---

### Q3：怎么只在更新时执行，首次不执行？

用 ref 记录是否是首次：

```jsx
const isFirst = useRef(true)

useEffect(() => {
  if (isFirst.current) {
    isFirst.current = false
    return  // 首次跳过
  }
  
  // 只有更新时才执行
  console.log('更新了')
}, [count])
```

---

## 七、useEffect 最佳实践

1. **一个 useEffect 只做一件事**，职责单一，方便维护
2. **依赖数组要写全**，ESLint 的 `exhaustive-deps` 规则会帮你检查
3. **记得清理副作用**，定时器、事件监听、订阅都要在 return 中清理
4. **不要在循环/条件语句里写 useEffect**，Hooks 调用顺序必须一致

---

## 总结

✅ `useEffect` 处理函数组件的副作用
2. ✅ 依赖数组控制执行时机：`无依赖` → 每次渲染，`[]` → 仅挂载，`[a,b]` → a/b 变化
3. ✅ return 清理函数：组件卸载/依赖变化前执行
4. ✅ 常用场景：API 请求、事件监听、定时器、DOM 操作
5. ✅ 依赖必须写全，否则会有闭包陷阱

下一篇：**[React Router 基础](./10-路由基础Hook.md)**
