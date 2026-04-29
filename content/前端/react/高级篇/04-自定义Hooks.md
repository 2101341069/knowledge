---
title: 自定义Hooks
tags:
  - 前端
  - React
  - 自定义Hooks
created: 2026-04-29
---

# 自定义 Hooks

## 一、什么是自定义 Hooks？

自定义 Hooks 是函数，名字以 `use` 开头，可以调用其他 Hooks，用来**封装和复用组件逻辑**。

> 自定义 Hooks 是 React Hooks 体系最强大的部分，让你把组件逻辑抽取成可复用的函数。

---

## 二、为什么需要自定义 Hooks？

### 问题：逻辑重复

```jsx
// UserList 组件
function UserList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
}

// ProductList 组件，几乎一样的逻辑！
function ProductList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
}
```

---

### 解决：抽取自定义 Hook

```jsx
// 抽取通用数据请求逻辑
function useData(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [fetchFn])

  return { data, loading, error }
}

// ✅ 现在两个组件都能复用了！
function UserList() {
  const { data: users, loading, error } = useData(fetchUsers)
}

function ProductList() {
  const { data: products, loading, error } = useData(fetchProducts)
}
```

---

## 三、常用自定义 Hooks 参考

### 3.1 useLocalStorage - 持久化状态

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = (newValue) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue]
}

// 使用
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
}
```

---

### 3.2 useDebounce - 防抖值

```jsx
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// 使用：搜索输入防抖
function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300) // 停止输入 300ms 后才变

  useEffect(() => {
    if (debouncedQuery) {
      fetchSearch(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

---

### 3.3 useToggle - 开关状态

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = () => setValue(v => !v)
  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)

  return [value, { toggle, setTrue, setFalse }]
}

// 使用
function ModalDemo() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false)

  return (
    <>
      <button onClick={setTrue}>打开弹窗</button>
      <Modal open={isOpen} onClose={setFalse}>
        <p>内容</p>
      </Modal>
    </>
  )
}
```

---

### 3.4 useMounted - 组件是否挂载

```jsx
function useMounted() {
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return mounted
}

// 使用：避免组件卸载后还调用 setState
function UserProfile() {
  const [user, setUser] = useState(null)
  const mounted = useMounted()

  useEffect(() => {
    fetchUser().then(data => {
      if (mounted.current) {  // 只在组件还挂载时才设置 state
        setUser(data)
      }
    })
  }, [])
}
```

---

### 3.5 useEventListener - 事件监听

```jsx
function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event)
    element.addEventListener(eventName, eventListener)
    return () => element.removeEventListener(eventName, eventListener)
  }, [eventName, element])
}

// 使用：监听滚动
function ScrollPosition() {
  const [y, setY] = useState(0)

  useEventListener('scroll', () => {
    setY(window.scrollY)
  })

  return <p>滚动距离：{y}px</p>
}
```

---

### 3.6 useMouse - 鼠标位置

```jsx
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// 使用
function MouseTracker() {
  const { x, y } = useMouse()
  return <p>鼠标位置：({x}, {y})</p>
}
```

---

### 3.7 useFetch - 通用请求 Hook

```jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(url, { ...options, signal: controller.signal })
        const json = await res.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [url])

  return { data, loading, error, refetch: () => fetchData() }
}

// 使用
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`)
  if (loading) return <div>加载中...</div>
  if (error) return <div>出错了：{error.message}</div>
  return <div>{data.name}</div>
}
```

---

## 四、自定义 Hooks 最佳实践

### 1. 命名以 `use` 开头

```jsx
// ✅ 正确
useLocalStorage
useFetch
useToggle

// ❌ 错误
getStorage
doFetch
```

### 2. 只在顶层调用自定义 Hooks

```jsx
function MyComponent() {
  // ✅ 正确：顶层调用
  const [theme, setTheme] = useLocalStorage('theme')

  if (condition) {
    // ❌ 错误：不要在条件语句里调用
    const [theme, setTheme] = useLocalStorage('theme')
  }
}
```

### 3. 依赖数组要写全

自定义 Hooks 内部用的 useEffect/useMemo 等，依赖数组要写准确。

### 4. 返回数组或对象，保持灵活

```jsx
// 返回数组（类似 useState）- 调用者可以随便命名
return [value, setValue]

// 返回对象 - 调用者可以只取需要的
return { data, loading, error }
```

### 5. 不要在自定义 Hooks 中写 JSX

自定义 Hooks 只封装逻辑，不负责渲染。渲染留给组件。

---

## 五、去哪里找现成的 Hooks？

不用重复造轮子，社区有大量优质自定义 Hooks 库：

| 库 | 说明 |
|-----|------|
| **ahooks** | 阿里开源，国内最常用，有 50+ 常用 Hooks |
| **usehooks-ts** | TypeScript 编写，质量高 |
| **react-use** | 老牌 Hooks 库，功能全 |

---

## 总结

✅ 自定义 Hooks 是复用组件逻辑的最佳方式
2. ✅ 命名必须以 `use` 开头
3. ✅ 常见场景：数据请求、本地存储、防抖节流、事件监听、状态管理等
4. ✅ 优先用社区成熟的 Hooks 库（ahooks 等），不要重复造轮子

下一篇：**[高阶组件 HOC](./05-高阶组件HOC.md)**
