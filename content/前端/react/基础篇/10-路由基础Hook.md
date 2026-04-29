---
title: 路由基础与Hook
tags:
  - 前端
  - React
  - React Router
created: 2026-04-29
---

# React Router 基础与 Hook

## 一、什么是路由？

前端路由：**不同的 URL 路径对应渲染不同的组件**，不需要刷新页面，体验和原生应用一样。

```
首页       → https://example.com/       → <Home />
用户页     → https://example.com/users  → <Users />
用户详情   → https://example.com/users/1 → <UserDetail />
```

---

## 二、安装与基础配置

### 2.1 安装

```bash
pnpm add react-router-dom
```

---

### 2.2 基础配置

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. 导入 BrowserRouter
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* 2. 用 BrowserRouter 包裹 App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

```jsx
// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Users from './pages/Users'

function App() {
  return (
    <div className="app">
      {/* 导航链接 */}
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于我们</Link>
        <Link to="/users">用户列表</Link>
      </nav>

      {/* 路由匹配，匹配到就渲染对应的组件 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  )
}
```

---

## 三、核心组件

### 3.1 `<Link>` - 导航链接

```jsx
import { Link, NavLink } from 'react-router-dom'

// 基础用法
<Link to="/about">关于我们</Link>

// 带状态传递
<Link to="/about" state={{ from: 'home' }}>关于我们</Link>

// NavLink：自动加激活类名
<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  关于我们
</NavLink>
```

---

### 3.2 `<Routes>` + `<Route>` - 路由匹配

```jsx
<Routes>
  {/* 精确匹配 */}
  <Route path="/" element={<Home />} />
  
  {/* 动态路由（路径参数） */}
  <Route path="/users/:id" element={<UserDetail />} />
  
  {/* 嵌套路由 */}
  <Route path="/users" element={<Users />}>
    <Route index element={<UserList />} />      {/* /users */}
    <Route path=":id" element={<UserDetail />} /> {/* /users/1 */}
  </Route>
  
  {/* 404 页面，匹配所有路径（放在最后） */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

### 3.3 `<Navigate>` - 重定向

```jsx
import { Navigate } from 'react-router-dom'

// 访问 /old 自动跳转到 /new
<Route path="/old" element={<Navigate to="/new" replace />} />

// 登录守卫：未登录跳转到登录页
<Route 
  path="/dashboard" 
  element={
    isLogin ? <Dashboard /> : <Navigate to="/login" replace />
  } 
/>
```

---

### 3.4 `<Outlet>` - 嵌套路由的子组件渲染位置

```jsx
// src/pages/Users.jsx
import { Outlet, Link } from 'react-router-dom'

function Users() {
  return (
    <div className="users-layout">
      <div className="sidebar">
        <Link to="/users/1">用户1</Link>
        <Link to="/users/2">用户2</Link>
      </div>
      <div className="content">
        <Outlet />  {/* 嵌套路由的组件渲染在这里 */}
      </div>
    </div>
  )
}
```

---

## 四、常用 Hooks

### 4.1 `useParams` - 获取路径参数

```jsx
import { useParams } from 'react-router-dom'

// 路由定义：/users/:id
function UserDetail() {
  // 获取路径参数 { id: '123' }
  const { id } = useParams()

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(id).then(setUser)
  }, [id])  // id 变化重新请求

  if (!user) return <div>加载中...</div>
  return <div>用户 {user.name}</div>
}
```

---

### 4.2 `useNavigate` - 编程式导航

```jsx
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    await loginApi()
    // 跳转到首页
    navigate('/')
    // 跳转并替换历史记录（回退不会再到登录页）
    navigate('/', { replace: true })
    // 回退上一页
    navigate(-1)
    // 前进
    navigate(1)
  }

  return <button onClick={handleLogin}>登录</button>
}
```

---

### 4.3 `useSearchParams` - 获取查询参数

```jsx
// URL: /search?q=react&page=1&size=10
import { useSearchParams } from 'react-router-dom'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 获取参数
  const query = searchParams.get('q')  // 'react'
  const page = searchParams.get('page')  // '1'

  // 修改参数：/search?q=vue&page=2
  function handleSearch(newQuery) {
    setSearchParams({ q: newQuery, page: 1 })
  }

  return (
    <div>
      <p>搜索关键词：{query}</p>
      <button onClick={() => handleSearch('vue')}>搜索 vue</button>
    </div>
  )
}
```

---

### 4.4 `useLocation` - 获取当前位置信息

```jsx
import { useLocation } from 'react-router-dom'

function Analytics() {
  const location = useLocation()

  console.log(location.pathname)  // 当前路径：/users/1
  console.log(location.search)    // 查询字符串：?foo=bar
  console.log(location.state)     // <Link> 传递的 state

  // 页面访问埋点
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}
```

---

## 五、路由守卫（权限控制）

```jsx
// 封装受保护的路由组件
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const isLogin = checkAuth()  // 检查是否登录

  if (!isLogin) {
    // 未登录跳转到登录页，带上当前路径，登录后可以跳回来
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children  // 已登录，渲染子组件
}

// 使用
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 六、懒加载路由

配合 `React.lazy` 实现路由级别的代码分割：

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// 懒加载页面组件（打包时会分成单独的 chunk）
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Users = lazy(() => import('./pages/Users'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Suspense>
  )
}
```

> 💡 首屏加载更快，访问到哪个路由才加载对应的代码。

---

## 总结

✅ **基础三组件**：`<BrowserRouter>` 包裹根组件，`<Routes>` + `<Route>` 定义路由匹配
2. ✅ **导航**：`<Link>` / `<NavLink>` 声明式导航，`useNavigate` 编程式导航
3. ✅ **路由参数**：`useParams` 路径参数，`useSearchParams` 查询参数
4. ✅ **嵌套路由**：子路由内容渲染在 `<Outlet>` 位置
5. ✅ **路由守卫**：封装受保护组件，判断权限后决定渲染内容还是跳转
6. ✅ **懒加载**：`React.lazy` + `Suspense` 实现路由级代码分割

---

**🎉 恭喜！你已经完成了 React 基础篇的全部学习！**

接下来进入 **高级篇**，深入 Hooks、性能优化、设计模式等进阶内容。

→ **[高级篇：深入 Hooks](../高级篇/01-深入Hooks.md)**
