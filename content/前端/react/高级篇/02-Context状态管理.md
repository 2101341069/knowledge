---
title: Context状态管理
tags:
  - 前端
  - React
  - Context
created: 2026-04-29
---

# Context 状态管理

## 一、为什么需要 Context？

**Props 钻取问题**：数据需要从顶层组件传递到深层子组件，中间每一层都要传 props，很麻烦。

```jsx
<App>
  <Layout theme={theme}>              {/* 不需要 theme */}
    <Sidebar theme={theme}>           {/* 不需要 theme */}
      <Nav theme={theme}>             {/* 不需要 theme */}
        <NavItem theme={theme} />     {/* 真正需要 theme */}
      </Nav>
    </Sidebar>
  </Layout>
</App>
```

**Context 解决**：数据放在 Context 里，任意层级的组件都能直接拿，不用层层传递。

---

## 二、Context 三步曲

### 步骤 1：创建 Context

```jsx
// src/contexts/ThemeContext.jsx
import { createContext, useState, useContext } from 'react'

// 1. 创建 Context，给个默认值
const ThemeContext = createContext('light')

// 2. 封装 Provider 组件
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // value 就是要传递下去的数据
  const value = {
    theme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. 封装自定义 Hook（可选但推荐，用起来更方便）
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用')
  }
  return context
}
```

---

### 步骤 2：根组件包裹 Provider

```jsx
// src/App.jsx
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Content from './components/Content'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        <Content />
      </div>
    </ThemeProvider>
  )
}
```

---

### 步骤 3：任意子组件中使用

```jsx
// 深层子组件，直接用，不用传 props
import { useTheme } from '../contexts/ThemeContext'

function NavItem() {
  // 直接获取 context 数据
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme}
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
    >
      切换主题
    </button>
  )
}
```

---

## 三、Context 高级用法

### 3.1 拆分 Context（避免不必要重渲染）

不要把所有数据都塞到一个 Context 里，按功能拆分：

```jsx
<ThemeProvider>
  <UserProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </UserProvider>
</ThemeProvider>
```

> 💡 为什么？Context 中任何数据变化，所有消费它的组件都会重渲染。拆成多个 Context 可以减少不必要的重渲染。

---

### 3.2 Context + useReducer（全局状态管理）

复杂状态用 useReducer 管理，逻辑更清晰：

```jsx
// src/contexts/AuthContext.jsx
const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    case 'LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false
  })

  const login = async (credentials) => {
    dispatch({ type: 'LOADING', payload: true })
    const user = await loginApi(credentials)
    dispatch({ type: 'LOGIN', payload: user })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

---

### 3.3 Context 性能优化

Context 最大的问题：**Provider 的 value 变化，所有消费组件都会重渲染**。

#### 优化 1：拆分 Context

把经常变的数据和不常变的数据分开：

```jsx
// 主题很少变 → ThemeContext
// 当前用户信息可能会变 → UserContext
// 购物车实时变化 → CartContext
```

#### 优化 2：拆分 value，useMemo 缓存

```jsx
function MyProvider({ children }) {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)

  // ❌ 每次渲染都创建新对象，导致所有消费组件都重渲染
  // const value = { a, b }

  // ✅ 只有 a 或 b 变化时才创建新对象
  const value = useMemo(() => ({ a, b }), [a, b])

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>
}
```

#### 优化 3：Context 选择器（Selectors）

只订阅 Context 的部分数据：

```jsx
// 用 useSyncExternalStore 实现选择器
// 或者用 Zustand/Jotai/Zustand 等库（自带优化）
```

---

## 四、什么时候用 Context？

✅ 适用场景：
- 主题（Theme）
- 用户认证信息（当前用户、登录状态）
- 语言国际化（i18n）
- 全局配置（应用设置）
- 路由数据

❌ 不要什么都放 Context：
- 表单数据（只在表单内用，放 useState）
- 列表数据（可能只在某几个页面用，用 React Query 更好）
- 频繁变化的数据（如滚动位置、鼠标位置）

---

## 五、Context vs 状态管理库

| | Context | Redux/Zustand |
|----|---------|---------------|
| 学习成本 | 低，React 内置 | 中等 |
| 性能优化 | 需要手动优化 | 自带优化 |
| DevTools | 无 | 有时间旅行等强大工具 |
| 中间件 | 没有 | 有（thunk/saga 等） |
| 适用 | 中小型应用全局数据 | 大型复杂应用 |

> 💡 建议：先 Context，复杂了再上状态管理库。很多项目 Context + useReducer 完全够用。

---

## 六、常见坑点

### Q1：为什么 useContext 返回 undefined？

原因：组件不在 Provider 包裹范围内。

```jsx
// ❌ 错误：App 用了 useContext，但 Provider 在 App 里面
function App() {
  const { theme } = useTheme()  // 这里还没被 Provider 包裹！
  return (
    <ThemeProvider>
      ...
    </ThemeProvider>
  )
}

// ✅ 正确：Provider 包裹在外面
// main.jsx
<ThemeProvider>
  <App />  {/* App 及其子组件才能用 useTheme */}
</ThemeProvider>
```

---

### Q2：怎么解决 Context 导致的多余重渲染？

1. 拆分 Context
2. useMemo 缓存 value
3. 子组件用 memo 包裹
4. 用状态管理库（Zustand/Jotai 等）

---

## 总结

✅ Context 解决 Props 钻取，跨层级传递数据
2. ✅ 三步：createContext 创建 → Provider 包裹根组件 → useContext 消费
3. ✅ 推荐封装 Provider 组件和自定义 Hook
4. ✅ Context + useReducer 可做轻量全局状态管理
5. ✅ 性能优化：拆分 Context、useMemo 缓存 value
6. ❌ 不要什么都放 Context，只放真正全局的数据

下一篇：**[性能优化](./03-性能优化.md)**
