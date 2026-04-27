---
title: VueRouter4完全指南
tags:
  - 前端
  - Vue
  - VueRouter
  - 路由
created: 2026-04-27
---

# VueRouter4完全指南

## 一、安装与基础配置

### 安装

```bash
npm install vue-router@4
# 或 pnpm add vue-router@4
```

### 基础配置

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于我们' }
  },
  // 404 路由（放最后！）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

// 全局守卫：设置页面标题
router.beforeEach((to) => {
  document.title = `${to.meta.title || 'Vue App'} - My Application`
})

export default router
```

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
router.isReady().then(() => app.mount('#app'))
```

---

## 二、路由导航方式

### 1. 声明式导航（router-link）

```vue
<template>
  <!-- 基础用法 -->
  <router-link to="/about">关于我们</router-link>
  
  <!-- 绑定对象 -->
  <router-link :to="{ name: 'User', params: { id: 123 } }">
    用户详情
  </router-link>
  
  <!-- 带查询参数 -->
  <router-link :to="{ path: '/search', query: { q: 'vue' } }">
    搜索 Vue
  </router-link>
  
  <!-- 自定义渲染 -->
  <router-link to="/about" custom v-slot="{ navigate, isActive }">
    <button @click="navigate" :class="{ active: isActive }">
      自定义按钮
    </button>
  </router-link>
</template>
```

### 2. 编程式导航（useRouter）

```typescript
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 导航方法
router.push('/about')                          // 字符串路径
router.push({ name: 'User', params: { id: 1 } }) // 命名路由
router.push({ path: '/search', query: { q: 'vue' } }) // 查询参数
router.replace('/about')                       // 替换当前历史
router.back()                                  // 后退
router.forward()                               // 前进
router.go(-2)                                  // 后退 2 页

// 当前路由信息
console.log(route.path)      // '/users/123'
console.log(route.params)    // { id: '123' }
console.log(route.query)     // { tab: 'profile' }
console.log(route.hash)      // '#details'
console.log(route.meta)      // 路由元信息
```

---

## 三、动态路由与参数

### 路由配置

```typescript
const routes = [
  // 单参数
  {
    path: '/users/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true // 将 params 转为组件 props
  },
  
  // 多参数
  {
    path: '/users/:userId/posts/:postId',
    name: 'UserPost',
    component: () => import('@/views/UserPost.vue')
  },
  
  // 可选参数
  {
    path: '/users/:id?',
    name: 'UserList',
    component: () => import('@/views/UserList.vue')
  },
  
  // 重复参数（匹配多级路径）
  {
    path: '/categories/:path+',
    name: 'Categories',
    component: () => import('@/views/Categories.vue')
    // 匹配: /categories/a/b/c
    // params: { path: 'a/b/c' }
  }
]
```

### 组件内使用 Props（推荐方式）

```vue
<script setup>
// ✅ 不需要 useRoute，直接用 props
const props = defineProps<{
  id: string          // 从 params 来
  tab?: string        // 可以从 query 来
}>()

console.log('User ID:', props.id)
</script>
```

### 监听参数变化

```vue
<script setup>
import { watch } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()

// 方式一：watch 监听
watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log(`ID changed: ${oldId} -> ${newId}`)
    // 重新加载数据...
  }
)

// 方式二：路由更新守卫
onBeforeRouteUpdate(async (to, from, next) => {
  await loadData(to.params.id)
  next()
})
</script>
```

---

## 四、嵌套路由（子路由）

### 配置示例

```typescript
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/Layout.vue'),
    children: [
      // 默认子路由
      {
        path: '', // /dashboard
        name: 'DashboardHome',
        component: () => import('@/views/dashboard/Home.vue')
      },
      // 普通子路由
      {
        path: 'analytics', // /dashboard/analytics
        name: 'Analytics',
        component: () => import('@/views/dashboard/Analytics.vue')
      },
      // 带参数子路由
      {
        path: 'reports/:reportId', // /dashboard/reports/123
        name: 'Report',
        component: () => import('@/views/dashboard/Report.vue')
      }
    ]
  }
]
```

### 父组件布局

```vue
<template>
  <div class="dashboard-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <router-link to="/dashboard">首页</router-link>
      <router-link to="/dashboard/analytics">数据分析</router-link>
    </aside>
    
    <!-- 子路由视图 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>
```

---

## 五、完整的路由守卫系统

### 守卫执行顺序

```
导航开始
    ↓
beforeEach（全局前置）
    ↓
beforeRouteUpdate（组件复用）
    ↓
beforeEnter（路由独享）
    ↓
解析异步组件
    ↓
beforeRouteEnter（进入组件）
    ↓
beforeResolve（全局解析）
    ↓
导航确认
    ↓
afterEach（全局后置）
    ↓
DOM 更新
```

### 1. 全局前置守卫（认证示例）

```typescript
// router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // 白名单
    const whiteList = ['Login', 'Register', 'NotFound']
    if (whiteList.includes(to.name as string)) {
      next()
      return
    }
    
    // 未登录
    if (!authStore.isLoggedIn) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath } // 保存目标页面
      })
      return
    }
    
    // 角色校验
    if (to.meta.roles?.length) {
      const hasRole = to.meta.roles.some(role => 
        authStore.user.roles.includes(role)
      )
      if (!hasRole) {
        next({ name: 'Forbidden' }) // 403 页面
        return
      }
    }
    
    next()
  })
}
```

### 2. 路由独享守卫

```typescript
const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    // 单个守卫
    beforeEnter: (to, from, next) => {
      if (!isAdmin()) {
        next({ name: 'Forbidden' })
        return
      }
      next()
    }
  },
  {
    path: '/reports/:id',
    name: 'Report',
    component: () => import('@/views/Report.vue'),
    // 多个守卫数组
    beforeEnter: [checkAuth, checkReportPermission]
  }
]

// 可复用守卫
function checkAuth(to, from, next) {
  isAuthenticated() ? next() : next({ name: 'Login' })
}

async function checkReportPermission(to, from, next) {
  const hasAccess = await checkPermission(to.params.id)
  hasAccess ? next() : next({ name: 'Forbidden' })
}
```

### 3. 组件内守卫

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// 离开前确认（表单未保存提示）
onBeforeRouteLeave((to, from, next) => {
  if (formChanged.value && !confirm('确定要离开吗？未保存的内容将丢失。')) {
    next(false) // 取消导航
    return
  }
  next()
})

// 参数变化时重新加载数据
onBeforeRouteUpdate(async (to, from, next) => {
  loading.value = true
  try {
    await loadData(to.params.id)
  } finally {
    loading.value = false
  }
  next()
})
</script>
```

---

## 六、路由元信息（Meta）

### TypeScript 类型扩展

```typescript
// types/vue-router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    roles?: string[]
    layout?: 'default' | 'auth' | 'admin'
    cache?: boolean
    breadcrumb?: Array<{ name: string; to?: string }>
    transition?: 'fade' | 'slide-left' | 'slide-right'
  }
}
```

### Meta 使用示例

```typescript
const routes = [
  {
    path: '/users/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    meta: {
      title: '用户详情',
      requiresAuth: true,
      roles: ['admin', 'user'],
      layout: 'admin',
      cache: true,
      breadcrumb: [
        { name: '首页', to: '/' },
        { name: '用户列表', to: '/users' },
        { name: '用户详情' }
      ],
      transition: 'slide-left'
    }
  }
]
```

---

## 七、动态添加路由（权限控制）

### 动态路由加载

```typescript
// router/modules/dynamic.ts
import type { Router, RouteRecordRaw } from 'vue-router'

// 组件映射
const componentMap = {
  'Dashboard': () => import('@/views/dashboard/Home.vue'),
  'UserManage': () => import('@/views/admin/Users.vue'),
  'RoleManage': () => import('@/views/admin/Roles.vue')
}

// 后端菜单转路由
function menuToRoute(menus: any[]): RouteRecordRaw[] {
  return menus.map(menu => ({
    path: menu.path,
    name: menu.name,
    component: componentMap[menu.component],
    meta: { title: menu.title, icon: menu.icon },
    children: menu.children ? menuToRoute(menu.children) : undefined
  }))
}

// 添加动态路由
export async function addDynamicRoutes(router: Router) {
  const menus = await api.getUserMenus() // 从后端获取权限菜单
  const routes = menuToRoute(menus)
  routes.forEach(route => router.addRoute(route))
  return true
}

// 守卫中调用
let hasAddedRoutes = false

router.beforeEach(async (to, from, next) => {
  if (isAuthenticated() && !hasAddedRoutes) {
    await addDynamicRoutes(router)
    hasAddedRoutes = true
    next({ ...to, replace: true }) // 重新触发导航
    return
  }
  next()
})
```

---

## 八、KeepAlive 页面缓存

### 基础用法

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </KeepAlive>
  </router-view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const cachedViews = ref<string[]>([])

// 根据 meta.cache 决定是否缓存
watch(
  () => route.meta.cache,
  (shouldCache) => {
    if (shouldCache && !cachedViews.value.includes(route.name)) {
      cachedViews.value.push(route.name as string)
    }
  },
  { immediate: true }
)
</script>
```

### 缓存生命周期

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue-router'

// 每次进入（包括从缓存恢复）
onActivated(() => {
  console.log('页面激活')
  // 恢复滚动位置、刷新数据
})

// 每次离开（缓存中）
onDeactivated(() => {
  console.log('页面缓存')
  // 暂停定时器、取消请求
})
</script>
```

---

## 九、数据获取策略

### 策略一：导航后获取（显示加载）

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const data = ref(null)

async function fetchData(id) {
  loading.value = true
  try {
    data.value = await api.getData(id)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchData(route.params.id))
onBeforeRouteUpdate((to, from, next) => {
  fetchData(to.params.id).finally(next)
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>{{ data }}</div>
  </div>
</template>
```

### 策略二：导航前获取（守卫中获取）

```typescript
// 在路由守卫中获取数据
router.beforeEach(async (to, from, next) => {
  if (to.name === 'User') {
    try {
      to.meta.userData = await userApi.getById(to.params.id)
    } catch {
      next({ name: 'NotFound' })
      return
    }
  }
  next()
})
```

---

## 十、常见最佳实践

### 1. 路由按模块组织（大型项目）

```
src/router/
├── index.ts
├── guards.ts
├── helpers.ts
└── modules/
    ├── home.ts
    ├── user.ts
    ├── admin.ts
    └── dashboard.ts
```

### 2. 面包屑导航实现

```vue
<template>
  <div class="breadcrumb">
    <template v-for="(item, i) in breadcrumbs" :key="i">
      <router-link v-if="item.to" :to="item.to">{{ item.name }}</router-link>
      <span v-else>{{ item.name }}</span>
      <span v-if="i < breadcrumbs.length - 1">/</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  // 优先用 meta.breadcrumb，否则自动生成
  if (route.meta.breadcrumb) return route.meta.breadcrumb
  
  // 根据路径自动生成
  const paths = route.path.split('/').filter(Boolean)
  const result = [{ name: '首页', to: '/' }]
  let current = ''
  paths.forEach((seg, i) => {
    current += `/${seg}`
    result.push({
      name: seg.charAt(0).toUpperCase() + seg.slice(1),
      to: i < paths.length - 1 ? current : undefined
    })
  })
  return result
})
</script>
```

### 3. 路由转场动画

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-left-enter-from { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to { transform: translateX(-100%); opacity: 0; }
</style>
```

---

## 总结

**Vue Router 4 核心能力：**
- ✅ 灵活的导航方式（声明式/编程式）
- ✅ 强大的守卫系统（三级守卫）
- ✅ 动态路由（权限控制基础）
- ✅ 丰富的元信息（页面标题、权限、布局）
- ✅ KeepAlive 缓存（提升体验）
- ✅ 完整的 TypeScript 支持

**学习重点：**
1. 基础路由配置和导航
2. 理解守卫执行顺序和数据获取策略
3. 大型项目掌握动态路由和权限控制
4. 关注用户体验：懒加载、动画、缓存

