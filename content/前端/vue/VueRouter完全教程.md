---
title: VueRouter 完全教程
tags:
  - 前端
  - Vue
  - Vue Router
  - 路由
  - 教程
created: 2026-04-17
---

# VueRouter 完全教程

> Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。

## 目录

1. [路由基础](#1-路由基础)
2. [动态路由匹配](#2-动态路由匹配)
3. [嵌套路由](#3-嵌套路由)
4. [编程式导航](#4-编程式导航)
5. [命名路由](#5-命名路由)
6. [命名视图](#6-命名视图)
7. [重定向和别名](#7-重定向和别名)
8. [路由组件传参](#8-路由组件传参)
9. [HTML5 History 模式](#9-html5-history-模式)
10. [导航守卫](#10-导航守卫)
11. [路由元信息](#11-路由元信息)
12. [数据获取](#12-数据获取)
13. [滚动行为](#13-滚动行为)
14. [路由懒加载](#14-路由懒加载)
15. [导航故障](#15-导航故障)
16. [动态路由](#16-动态路由)

---

## 1. 路由基础

### 1.1 什么是路由

路由是一种将 URL 映射到组件的机制。在单页面应用（SPA）中，路由允许我们在不刷新页面的情况下，根据不同的 URL 显示不同的内容。

### 1.2 安装

#### 直接下载 / CDN

```html
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```

#### NPM

```bash
npm install vue-router
```

### 1.3 基础示例

```html
<!-- HTML -->
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航 -->
    <!-- 通过传入 `to` 属性指定链接 -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

```javascript
// JavaScript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')
```

### 1.4 router-link

`<router-link>` 是 Vue Router 提供的导航组件，用于声明式导航。

```html
<!-- 基础用法 -->
<router-link to="/home">首页</router-link>

<!-- 绑定对象 -->
<router-link :to="{ path: '/home' }">首页</router-link>

<!-- 命名路由 -->
<router-link :to="{ name: 'user', params: { userId: 123 } }">
  用户
</router-link>

<!-- 带查询参数 -->
<router-link :to="{ path: '/register', query: { plan: 'private' } }">
  注册
</router-link>

<!-- replace 属性：不会留下 history 记录 -->
<router-link to="/home" replace>首页</router-link>

<!-- append 属性：在当前路径前添加路径 -->
<router-link to="home" append>首页</router-link>

<!-- tag 属性：指定渲染的标签 -->
<router-link to="/foo" tag="li">foo</router-link>

<!-- active-class 属性：激活时应用的 CSS 类名 -->
<router-link to="/foo" active-class="active">foo</router-link>

<!-- exact 属性：精确匹配 -->
<router-link to="/" exact>首页</router-link>

<!-- event 属性：触发导航的事件 -->
<router-link to="/foo" event="mouseover">foo</router-link>
```

### 1.5 router-view

`<router-view>` 是路由出口组件，路由匹配到的组件将渲染在这里。

```html
<!-- 基础用法 -->
<router-view></router-view>

<!-- 命名视图 -->
<router-view class="view one"></router-view>
<router-view class="view two" name="sidebar"></router-view>
<router-view class="view three" name="footer"></router-view>

<!-- 过渡效果 -->
<transition name="fade" mode="out-in">
  <router-view></router-view>
</transition>

<!-- keep-alive 缓存 -->
<keep-alive>
  <router-view></router-view>
</keep-alive>
```

---

## 2. 动态路由匹配

### 2.1 基础示例

```javascript
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```

### 2.2 多个参数

```javascript
const router = new VueRouter({
  routes: [
    // 匹配 /user/123/posts
    { path: '/user/:id/posts', component: UserPosts },
    
    // 匹配 /user/123/posts/456
    { path: '/user/:userId/posts/:postId', component: UserPost }
  ]
})

// 组件中使用
const UserPost = {
  template: `
    <div>
      User ID: {{ $route.params.userId }}
      Post ID: {{ $route.params.postId }}
    </div>
  `
}
```

### 2.3 参数变化监听

当路由参数变化时，组件会被复用，不会重新创建。如果需要响应参数变化：

```javascript
// 方式一：watch $route
const User = {
  template: '...',
  watch: {
    '$route'(to, from) {
      // 对路由变化作出响应...
    }
  }
}

// 方式二：使用 beforeRouteUpdate 导航守卫
const User = {
  template: '...',
  beforeRouteUpdate(to, from, next) {
    // 对路由变化作出响应...
    // 不要忘记调用 next()
    next()
  }
}
```

### 2.4 捕获所有路由或 404 路由

```javascript
const router = new VueRouter({
  routes: [
    // 匹配所有路径
    { path: '*', component: NotFound },
    
    // 匹配以 `/user-` 开头的任意路径
    { path: '/user-*', component: UserNotFound },
    
    // 404 路由（必须放在最后）
    { path: '*', redirect: '/404' }
  ]
})
```

### 2.5 高级匹配模式

```javascript
const router = new VueRouter({
  routes: [
    // 可选参数
    { path: '/optional/:id?', component: OptionalParam },
    
    // 可重复参数（+ 表示一次或多次）
    { path: '/repeat/:id+', component: RepeatParam },
    
    // 可重复参数（* 表示零次或多次）
    { path: '/repeat-zero/:id*', component: RepeatZeroParam },
    
    // 自定义正则
    { path: '/number/:id(\\d+)', component: NumberParam },
    
    // 匹配多个参数
    { path: '/multi/:id+', component: MultiParam }
  ]
})

// 示例：
// /optional        -> 匹配，id 为 undefined
// /optional/123    -> 匹配，id 为 '123'
// /repeat/123      -> 匹配，id 为 ['123']
// /repeat/123/456  -> 匹配，id 为 ['123', '456']
// /number/123      -> 匹配
// /number/abc      -> 不匹配
```

---

## 3. 嵌套路由

### 3.1 基础示例

```javascript
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}

const UserHome = { template: '<div>Home</div>' }
const UserProfile = { template: '<div>Profile</div>' }
const UserPosts = { template: '<div>Posts</div>' }

const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome },
        
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        { path: 'profile', component: UserProfile },
        
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        { path: 'posts', component: UserPosts }
      ]
    }
  ]
})
```

### 3.2 多层嵌套

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          path: 'profile',
          component: UserProfile,
          children: [
            {
              path: 'settings',
              component: ProfileSettings
            }
          ]
        }
      ]
    }
  ]
})

// URL: /user/123/profile/settings
// 渲染: User > UserProfile > ProfileSettings
```

---

## 4. 编程式导航

### 4.1 router.push()

导航到不同的 URL，会向 history 栈添加一个新的记录。

```javascript
// 字符串路径
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' } })

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' } })

// 在组件中使用
this.$router.push('/home')
this.$router.push({ name: 'user', params: { userId: '123' } })
```

**注意**：如果提供了 `path`，`params` 会被忽略：

```javascript
// ❌ params 会被忽略
router.push({ path: '/user', params: { userId: '123' } })

// ✅ 使用完整路径
router.push({ path: `/user/${userId}` })

// ✅ 使用命名路由
router.push({ name: 'user', params: { userId: '123' } })
```

### 4.2 router.replace()

替换当前路由，不会向 history 添加新记录。

```javascript
router.replace('home')
router.replace({ path: 'home' })
router.replace({ name: 'user', params: { userId: '123' } })

// 在 <router-link> 中使用 replace 属性
<router-link to="/home" replace>首页</router-link>
```

### 4.3 router.go()

在 history 记录中前进或后退多少步。

```javascript
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```

### 4.4 router.back() 和 router.forward()

```javascript
// 后退一步
router.back()

// 前进一步
router.forward()

// 等同于
router.go(-1)
router.go(1)
```

---

## 5. 命名路由

### 5.1 定义命名路由

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

### 5.2 使用命名路由

```html
<!-- <router-link> 中使用 -->
<router-link :to="{ name: 'user', params: { userId: 123 } }">
  User
</router-link>

<!-- 编程式导航 -->
router.push({ name: 'user', params: { userId: 123 } })
```

### 5.3 命名路由的好处

```javascript
// ❌ 硬编码 URL
router.push('/user/123')

// ✅ 使用命名路由，URL 变化时只需修改路由配置
router.push({ name: 'user', params: { userId: 123 } })
```

---

## 6. 命名视图

### 6.1 基础示例

```html
<router-view class="view one"></router-view>
<router-view class="view two" name="sidebar"></router-view>
<router-view class="view three" name="footer"></router-view>
```

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        sidebar: Sidebar,
        footer: Footer
      }
    }
  ]
})
```

### 6.2 嵌套命名视图

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/settings',
      // 你也可以在顶级路由就配置命名视图
      component: UserSettings,
      children: [
        {
          path: 'emails',
          component: UserEmailsSubscriptions
        },
        {
          path: 'profile',
          components: {
            default: UserProfile,
            helper: UserProfilePreview
          }
        }
      ]
    }
  ]
})
```

---

## 7. 重定向和别名

### 7.1 重定向

```javascript
const router = new VueRouter({
  routes: [
    // 重定向到字符串路径
    { path: '/a', redirect: '/b' },
    
    // 重定向到命名路由
    { path: '/a', redirect: { name: 'foo' } },
    
    // 重定向到动态方法
    { 
      path: '/a', 
      redirect: to => {
        // 方法接收目标路由作为参数
        // return 重定向的字符串路径/路径对象
        return '/b'
      }
    },
    
    // 带参数的重定向
    {
      path: '/search/:searchQuery',
      redirect: to => {
        return { path: '/results', query: { q: to.params.searchQuery } }
      }
    }
  ]
})
```

### 7.2 别名

```javascript
const router = new VueRouter({
  routes: [
    // /a 的别名是 /b，意味着当用户访问 /b 时，URL 会保持为 /b，但路由匹配为 /a
    { path: '/a', component: A, alias: '/b' },
    
    // 多个别名
    { path: '/a', component: A, alias: ['/b', '/c', '/d'] },
    
    // 嵌套路由的别名
    { 
      path: '/user/:id', 
      component: User,
      children: [
        { path: 'profile', component: UserProfile, alias: 'p' }
      ]
    }
  ]
})
```

---

## 8. 路由组件传参

### 8.1 布尔模式

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      props: true
    }
    
    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})

// 组件定义
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
```

### 8.2 对象模式

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: { newsletterPopup: false }
    }
  ]
})

// 组件定义
const Promotion = {
  props: ['newsletterPopup'],
  template: '<div>Newsletter Popup: {{ newsletterPopup }}</div>'
}
```

### 8.3 函数模式

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: (route) => ({ query: route.query.q })
    }
  ]
})

// URL: /search?q=vue
// 会将 { query: 'vue' } 作为 props 传给 SearchUser 组件
```

### 8.4 高级用法

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      props: (route) => ({
        id: route.params.id,
        query: route.query,
        hash: route.hash
      })
    }
  ]
})

// 组件定义
const User = {
  props: {
    id: {
      type: String,
      required: true
    },
    query: {
      type: Object,
      default: () => ({})
    },
    hash: {
      type: String,
      default: ''
    }
  },
  template: `
    <div>
      <p>User ID: {{ id }}</p>
      <p>Query: {{ query }}</p>
      <p>Hash: {{ hash }}</p>
    </div>
  `
}
```

---

## 9. HTML5 History 模式

### 9.1 启用 History 模式

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

### 9.2 History 模式 vs Hash 模式

| 对比项 | Hash 模式 | History 模式 |
|--------|----------|-------------|
| URL 格式 | `http://example.com/#/user` | `http://example.com/user` |
| 美观度 | ❌ 有 # 号 | ✅ 无 # 号，更美观 |
| SEO | ❌ 不利于 SEO | ✅ 更利于 SEO |
| 服务器配置 | ✅ 无需配置 | ⚠️ 需要服务器配置 |
| 兼容性 | ✅ 兼容所有浏览器 | ⚠️ 需要 HTML5 History API |

### 9.3 服务器配置

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Node.js (Express)

```javascript
const history = require('connect-history-api-fallback')

app.use(history())
```

#### Caddy

```
rewrite {
    if {path} not_match ^/api
    to {path} {path}/ /
}
```

### 9.4 警告

在服务器上添加一个简单的回退路由，如果 URL 匹配不到任何静态资源，它应该提供与你的应用程序中的 `index.html` 相同的页面。

---

## 10. 导航守卫

### 10.1 完整的导航解析流程

1. 导航被触发。
2. 调用失活组件里 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 10.2 全局前置守卫

```javascript
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // to: 即将进入的目标 路由对象
  // from: 当前导航正要离开的路由
  // next: 必须调用该方法来 resolve 这个钩子
  
  // 登录验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

**注意**：`next` 函数必须被调用：

```javascript
next()        // 进行管道中的下一个钩子
next(false)   // 中断当前的导航
next('/')     // 跳转到一个不同的地址
next(error)   // 导航终止且该错误会被传递给 router.onError()
```

### 10.3 全局解析守卫

```javascript
// 在 2.5.0+ 你可以用 router.beforeResolve 注册一个全局守卫
// 这和 router.beforeEach 类似，区别是在导航被确认之前
// 同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
router.beforeResolve((to, from, next) => {
  // ...
  next()
})
```

### 10.4 全局后置钩子

```javascript
// 和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
router.afterEach((to, from) => {
  // ...
  // 可以用来发送页面访问统计
  analytics.pageview(to.fullPath)
})
```

### 10.5 路由独享守卫

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
        next()
      }
    }
  ]
})
```

### 10.6 组件内守卫

```javascript
const Foo = {
  template: '...',
  
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    
    // 但是可以通过传一个回调给 next 来访问组件实例
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.loadData()
    })
  },
  
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.name = to.params.name
    next()
  },
  
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 这个离开守卫通常用来禁止用户在还未保存修改前突然离开
    // 可以通过 next(false) 来取消导航
    
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('确定要离开吗？您有未保存的更改！')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
```

### 10.7 实用示例

#### 登录验证

```javascript
// router/index.js
import store from '@/store'

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    if (to.path === '/login' && isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }
})
```

#### 页面标题

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  // 从路由元信息获取标题
  const title = to.meta.title
  
  if (title) {
    document.title = title + ' - My App'
  } else {
    document.title = 'My App'
  }
  
  next()
})

// 路由配置
const routes = [
  {
    path: '/home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/user',
    component: User,
    meta: { title: '用户中心' }
  }
]
```

#### 进度条

```javascript
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
```

---

## 11. 路由元信息

### 11.1 定义元信息

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      meta: {
        requiresAuth: true,
        title: 'Foo Page',
        roles: ['admin', 'editor']
      }
    },
    {
      path: '/bar',
      component: Bar,
      meta: {
        requiresAuth: false,
        title: 'Bar Page'
      }
    }
  ]
})
```

### 11.2 访问元信息

```javascript
// 导航守卫中访问
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录
    if (!isAuthenticated()) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

// 组件中访问
export default {
  computed: {
    meta() {
      return this.$route.meta
    }
  }
}
```

### 11.3 元信息的继承

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/parent',
      component: Parent,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'child',
          component: Child,
          // meta 默认不继承，需要手动设置
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

### 11.4 实用示例

```javascript
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: '仪表盘',
      icon: 'dashboard'
    }
  },
  {
    path: '/user',
    component: User,
    meta: {
      requiresAuth: true,
      title: '用户管理',
      roles: ['admin'],
      icon: 'user'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录',
      hidden: true  // 不在菜单中显示
    }
  }
]

// 权限验证
router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 检查角色权限
      const roles = to.meta.roles
      if (roles && !roles.some(role => store.getters.roles.includes(role))) {
        next('/403')
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

// 生成菜单
const menuRoutes = routes.filter(route => !route.meta.hidden)
```

---

## 12. 数据获取

### 12.1 导航完成后获取数据

```javascript
export default {
  data() {
    return {
      post: null,
      error: null
    }
  },
  
  watch: {
    // 在路由参数变化时重新获取数据
    '$route': 'fetchData'
  },
  
  created() {
    this.fetchData()
  },
  
  methods: {
    fetchData() {
      this.error = this.post = null
      this.loading = true
      
      // 替换为实际的数据获取 API
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

### 12.2 导航完成前获取数据

```javascript
export default {
  data() {
    return {
      post: null,
      error: null
    }
  },
  
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 此时组件实例还没被创建，不能访问 this
    
    getPost(to.params.id, (err, post) => {
      if (err) {
        // 显示错误页面
        next(err => {
          // 组件实例已创建，可以访问 this
          this.error = err.toString()
        })
      } else {
        next(vm => {
          // 通过 `vm` 访问组件实例
          vm.post = post
        })
      }
    })
  },
  
  // 当路由参数变化时
  beforeRouteUpdate(to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
      next()
    })
  }
}
```

### 12.3 使用 async/await

```javascript
export default {
  data() {
    return {
      post: null,
      error: null,
      loading: false
    }
  },
  
  async beforeRouteEnter(to, from, next) {
    try {
      const post = await getPost(to.params.id)
      next(vm => {
        vm.post = post
      })
    } catch (error) {
      next(vm => {
        vm.error = error
      })
    }
  },
  
  async beforeRouteUpdate(to, from, next) {
    this.loading = true
    try {
      this.post = await getPost(to.params.id)
    } catch (error) {
      this.error = error
    } finally {
      this.loading = false
      next()
    }
  }
}
```

### 12.4 使用 Vuex

```javascript
// store/modules/post.js
export default {
  state: {
    post: null,
    loading: false,
    error: null
  },
  
  mutations: {
    SET_POST(state, post) {
      state.post = post
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchPost({ commit }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const post = await getPost(id)
        commit('SET_POST', post)
      } catch (error) {
        commit('SET_ERROR', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}

// 组件中使用
export default {
  computed: {
    ...mapState('post', ['post', 'loading', 'error'])
  },
  
  watch: {
    '$route.params.id': {
      handler(id) {
        this.fetchPost(id)
      },
      immediate: true
    }
  },
  
  methods: {
    ...mapActions('post', ['fetchPost'])
  }
}
```

---

## 13. 滚动行为

### 13.1 基础用法

```javascript
const router = new VueRouter({
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个位置
    
    // 始终滚动到顶部
    return { x: 0, y: 0 }
    
    // 始终滚动到指定位置
    return { x: 0, y: 100 }
    
    // 返回 savedPosition，当且仅当通过浏览器前进/后退按钮触发时
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
```

### 13.2 滚动到锚点

```javascript
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        // 添加偏移量
        offset: { x: 0, y: 60 }
      }
    }
  }
})

// URL: /foo#section
// 会滚动到 id="section" 的元素
```

### 13.3 异步滚动

```javascript
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 500)
    })
  }
})
```

### 13.4 平滑滚动

```javascript
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          x: 0,
          y: 0,
          behavior: 'smooth'
        })
      }, 500)
    })
  }
})
```

---

## 14. 路由懒加载

### 14.1 基础用法

```javascript
// 非懒加载
import Home from './views/Home.vue'

const routes = [
  {
    path: '/',
    component: Home
  }
]

// 懒加载
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./views/About.vue')
  },
  {
    path: '/user/:id',
    component: () => import('./views/User.vue')
  }
]
```

### 14.2 把组件按组分块

```javascript
const routes = [
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "admin" */ './views/Dashboard.vue')
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "admin" */ './views/Users.vue')
      }
    ]
  }
]

// webpack 会将带有相同 chunkName 的组件打包到同一个 JS 文件中
```

### 14.3 预加载/预获取

```javascript
// 预加载 (preload)：当前页面加载完成后，立即加载
const routes = [
  {
    path: '/about',
    component: () => import(/* webpackPrefetch: true */ './views/About.vue')
  }
]

// 预获取 (prefetch)：浏览器空闲时加载
const routes = [
  {
    path: '/contact',
    component: () => import(/* webpackPrefetch: true */ './views/Contact.vue')
  }
]
```

### 14.4 加载状态

```javascript
// 使用 loading 组件
const routes = [
  {
    path: '/user/:id',
    component: () => ({
      component: import('./views/User.vue'),
      loading: LoadingComponent,
      error: ErrorComponent,
      delay: 200,
      timeout: 3000
    })
  }
]

// 或者在全局处理
router.beforeEach((to, from, next) => {
  store.commit('SET_LOADING', true)
  next()
})

router.afterEach(() => {
  store.commit('SET_LOADING', false)
})
```

---

## 15. 导航故障

### 15.1 检测导航故障

```javascript
// 导航失败时，会在 Promise 中捕获
router.push('/dashboard').catch(failure => {
  if (VueRouter.isNavigationFailure(failure)) {
    // navigation failures (导航故障)
    console.log('failed navigation', failure)
  } else {
    // other errors (其他错误)
    console.log('error', failure)
  }
})
```

### 15.2 导航故障类型

```javascript
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

// aborted：在导航守卫中返回 false 中断了本次导航
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    console.log('导航被中止')
  }
})

// cancelled：在当前导航完成之前又有了一个新的导航
router.push('/dashboard').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    console.log('导航被取消')
  }
})

// duplicated：导航被阻止，因为我们已经在目标位置了
router.push('/home').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    console.log('重复导航')
  }
})
```

### 15.3 检测所有导航故障

```javascript
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure)) {
    // 任何类型的导航故障
    console.log('导航失败', failure)
  }
})
```

---

## 16. 动态路由

### 16.1 添加路由

```javascript
// 动态添加路由
router.addRoutes([route])

// 示例
const route = {
  path: '/dynamic',
  component: DynamicComponent
}

router.addRoutes([route])

// 添加嵌套路由
router.addRoutes([
  {
    path: '/parent',
    component: Parent,
    children: [
      {
        path: 'child',
        component: Child
      }
    ]
  }
])
```

### 16.2 根据权限动态添加路由

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

// 动态路由（根据权限加载）
export const asyncRoutes = [
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: { title: '仪表盘', roles: ['admin', 'editor'] }
  },
  {
    path: '/user',
    component: () => import('@/views/user/index'),
    meta: { title: '用户管理', roles: ['admin'] }
  },
  // 404 页面必须放在最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router

// permission.js
import router, { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  
  return res
}

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo')
          
          // 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          
          // 动态添加路由
          router.addRoutes(accessRoutes)
          
          // hack method 确保 addRoutes 已完成
          next({ ...to, replace: true })
        } catch (error) {
          // 移除 token
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    // 白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
```

### 16.3 删除路由

```javascript
// Vue Router 3.5.0+ 支持
router.removeRoute('routeName')

// 示例
router.addRoute({
  path: '/about',
  name: 'about',
  component: () => import('./views/About.vue')
})

// 删除路由
router.removeRoute('about')
```

### 16.4 查看现有路由

```javascript
// 获取所有路由记录
router.getRoutes()

// 返回路由记录数组
[
  {
    path: '/foo',
    name: 'foo',
    component: Foo,
    // ...
  },
  {
    path: '/bar',
    name: 'bar',
    component: Bar,
    // ...
  }
]
```

---

## 总结

### Vue Router 核心概念速查表

| 概念 | 说明 | 示例 |
|------|------|------|
| 路由映射 | URL 到组件的映射 | `{ path: '/user', component: User }` |
| 动态路由 | 带参数的路由 | `{ path: '/user/:id', component: User }` |
| 嵌套路由 | 组件内的路由 | `children: [{ path: 'profile', component: Profile }]` |
| 编程式导航 | 通过代码导航 | `router.push('/home')` |
| 命名路由 | 给路由命名 | `{ path: '/user/:id', name: 'user', component: User }` |
| 命名视图 | 多个 router-view | `components: { default: Home, sidebar: Sidebar }` |
| 重定向 | URL 重定向 | `{ path: '/a', redirect: '/b' }` |
| 别名 | URL 别名 | `{ path: '/a', alias: '/b' }` |
| 路由组件传参 | 解耦路由参数 | `props: true` |
| 导航守卫 | 控制导航 | `beforeEach`, `beforeEnter`, `beforeRouteEnter` |
| 路由元信息 | 附加信息 | `meta: { requiresAuth: true }` |
| 懒加载 | 按需加载 | `() => import('./views/Home.vue')` |

### 最佳实践

1. **使用命名路由**：避免硬编码 URL，便于维护
2. **路由懒加载**：提升首屏加载速度
3. **合理使用导航守卫**：统一处理权限、登录验证
4. **使用路由元信息**：管理页面标题、权限等信息
5. **处理 404**：始终在路由配置末尾添加 404 路由
6. **History 模式**：服务器需要配置回退路由

### 参考资源

- [Vue Router 官方文档](https://v3.router.vuejs.org/zh/)
- [Vue Router API 文档](https://v3.router.vuejs.org/zh/api/)
- [Vue Router 示例](https://github.com/vuejs/vue-router/tree/dev/examples)
