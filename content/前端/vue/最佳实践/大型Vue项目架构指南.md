---
title: 大型Vue项目架构指南
tags:
  - 前端
  - Vue
  - Vue3
  - 项目架构
  - 最佳实践
created: 2026-04-27
---

# 大型Vue项目架构指南

## 项目目录结构

### 推荐结构

```
src/
├── assets/              # 静态资源
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   └── styles/
│       ├── variables.scss
│       ├── mixins.scss
│       ├── reset.scss
│       └── global.scss
├── components/          # 通用组件
│   ├── base/           # 基础组件（Button, Input, Modal...）
│   ├── common/         # 业务通用组件
│   ├── layout/         # 布局组件
│   └── ui/             # UI 组件库
├── composables/         # 组合式函数
│   ├── useAuth.ts
│   ├── useTable.ts
│   ├── useForm.ts
│   └── index.ts
├── directives/          # 自定义指令
│   ├── permission.ts
│   ├── loading.ts
│   └── index.ts
├── api/                # API 层
│   ├── modules/
│   │   ├── user.ts
│   │   ├── order.ts
│   │   └── product.ts
│   ├── request.ts      # 请求封装
│   └── types.ts        # API 类型定义
├── stores/             # 状态管理
│   ├── modules/
│   │   ├── user.ts
│   │   ├── app.ts
│   │   └── permission.ts
│   └── index.ts
├── router/             # 路由配置
│   ├── modules/
│   │   ├── user.ts
│   │   ├── admin.ts
│   │   └── dashboard.ts
│   ├── guards.ts       # 路由守卫
│   └── index.ts
├── views/              # 页面视图
│   ├── dashboard/
│   ├── user/
│   ├── admin/
│   └── error/          # 错误页面
├── utils/              # 工具函数
│   ├── request.ts
│   ├── storage.ts
│   ├── validate.ts
│   ├── format.ts
│   └── index.ts
├── hooks/              # 自定义 Hooks
│   ├── usePagination.ts
│   ├── useExport.ts
│   └── useUpload.ts
├── types/              # TypeScript 类型定义
│   ├── index.d.ts
│   ├── api.d.ts
│   └── global.d.ts
├── constants/          # 常量定义
│   ├── enum.ts
│   └── config.ts
├── plugins/            # 插件
│   ├── ant-design.ts
│   └── i18n.ts
├── App.vue
└── main.ts
```

## 分层架构设计

### API 层设计

```typescript
// api/request.ts
import axios, { type AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/user'

const baseURL = import.meta.env.VITE_API_BASE_URL

const service: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data
    
    if (code === 200) {
      return data
    }
    
    // 业务错误处理
    if (code === 401) {
      // 未授权，退出登录
      useAuthStore().logout()
    }
    
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error: AxiosError) => {
    // HTTP 错误处理
    const status = error.response?.status
    
    switch (status) {
      case 400:
        message.error('请求参数错误')
        break
      case 401:
        message.error('未授权，请重新登录')
        break
      case 403:
        message.error('没有权限访问')
        break
      case 500:
        message.error('服务器错误')
        break
      default:
        message.error(`请求失败: ${error.message}`)
    }
    
    return Promise.reject(error)
  }
)

export default service
```

### API 模块组织

```typescript
// api/modules/user.ts
import request from '@/api/request'
import type { User, UserQuery, UserCreate, UserUpdate } from '@/types/user'

// 用户 API 封装
export const userApi = {
  // 获取用户列表
  getList: (params: UserQuery) => request.get<PageResult<User>>('/users', { params }),
  
  // 获取用户详情
  getDetail: (id: number) => request.get<User>(`/users/${id}`),
  
  // 创建用户
  create: (data: UserCreate) => request.post<User>('/users', data),
  
  // 更新用户
  update: (id: number, data: UserUpdate) => request.put<User>(`/users/${id}`, data),
  
  // 删除用户
  delete: (id: number) => request.delete(`/users/${id}`),
  
  // 批量操作
  batchDelete: (ids: number[]) => request.post('/users/batch-delete', { ids })
}
```

## 状态管理架构

### 模块化 Store

```typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/modules/user'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => roles.value.includes('admin'))

  // Actions
  async function login(credentials: { email: string; password: string }) {
    const response = await userApi.login(credentials)
    token.value = response.token
    user.value = response.user
    roles.value = response.roles
    permissions.value = response.permissions
    localStorage.setItem('token', response.token)
    return response
  }

  function logout() {
    token.value = ''
    user.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    try {
      user.value = await userApi.getCurrent()
    } catch (error) {
      logout()
    }
  }

  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  return {
    // 状态
    user,
    token,
    roles,
    permissions,
    // 计算属性
    isLoggedIn,
    isAdmin,
    // 方法
    login,
    logout,
    fetchCurrentUser,
    hasPermission,
    hasRole
  }
})
```

### Store 自动导入

```typescript
// stores/index.ts
export * from './modules/user'
export * from './modules/app'
export * from './modules/permission'

// 全局注册
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
```

## 路由架构

### 模块化路由

```typescript
// router/modules/dashboard.ts
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/Index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
      requiresAuth: true,
      roles: ['admin', 'user']
    }
  },
  {
    path: '/dashboard/analytics',
    name: 'Analytics',
    component: () => import('@/views/dashboard/Analytics.vue'),
    meta: {
      title: '数据分析',
      icon: 'chart',
      requiresAuth: true,
      roles: ['admin']
    }
  }
]

export default dashboardRoutes
```

### 路由守卫

```typescript
// router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()

    // 设置页面标题
    document.title = `${to.meta.title || 'Vue App'} | My Application`

    // 不需要登录的页面
    const whiteList = ['/login', '/register', '/404', '/500']
    if (whiteList.includes(to.path)) {
      next()
      return
    }

    // 检查登录状态
    if (!authStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // 获取用户信息（如果还没获取）
    if (!authStore.user) {
      try {
        await authStore.fetchCurrentUser()
      } catch (error) {
        next({ name: 'Login' })
        return
      }
    }

    // 检查角色权限
    if (to.meta.roles && to.meta.roles.length > 0) {
      const hasRole = to.meta.roles.some((role) =>
        authStore.hasRole(role)
      )
      if (!hasRole) {
        next({ name: '403' })
        return
      }
    }

    // 检查权限
    if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
      next({ name: '403' })
      return
    }

    next()
  })
}
```

### 路由索引

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import dashboardRoutes from './modules/dashboard'
import userRoutes from './modules/user'
import adminRoutes from './modules/admin'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  ...dashboardRoutes,
  ...userRoutes,
  ...adminRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

setupRouterGuards(router)

export default router
```

## 权限控制架构

### 权限指令

```typescript
// directives/permission.ts
import type { App, Directive } from 'vue'
import { useAuthStore } from '@/stores/user'

const permission: Directive = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const permission = binding.value
    
    if (permission && !authStore.hasPermission(permission)) {
      el.parentNode?.removeChild(el)
    }
  }
}

const role: Directive = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const role = binding.value
    
    if (role && !authStore.hasRole(role)) {
      el.parentNode?.removeChild(el)
    }
  }
}

export function setupPermissionDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('role', role)
}
```

### 权限组合式函数

```typescript
// composables/usePermission.ts
import { useAuthStore } from '@/stores/user'

export function usePermission() {
  const authStore = useAuthStore()

  function hasPermission(permission: string): boolean {
    return authStore.hasPermission(permission)
  }

  function hasRole(role: string): boolean {
    return authStore.hasRole(role)
  }

  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => hasPermission(p))
  }

  function hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => hasPermission(p))
  }

  function hasAnyRole(roles: string[]): boolean {
    return roles.some(r => hasRole(r))
  }

  function hasAllRoles(roles: string[]): boolean {
    return roles.every(r => hasRole(r))
  }

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    hasAllRoles
  }
}
```

## 组件分层设计

### Base 组件层

```vue
<!-- components/base/BaseButton.vue -->
<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Icon v-if="icon" :type="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: string
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  block: false
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClass = computed(() => [
  'base-button',
  `base-button--${props.type}`,
  `base-button--${props.size}`,
  {
    'base-button--block': props.block,
    'base-button--disabled': props.disabled
  }
])
</script>
```

### 业务组件层

```vue
<!-- components/common/UserSelect.vue -->
<template>
  <BaseSelect
    v-model="selectedValue"
    :options="userOptions"
    :loading="loading"
    placeholder="请选择用户"
    show-search
    filter-option
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userApi } from '@/api/modules/user'
import type { User } from '@/types/user'

interface Props {
  modelValue: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const users = ref<User[]>([])
const loading = ref(false)

const userOptions = computed(() =>
  users.value.map(user => ({
    label: user.name,
    value: user.id
  }))
)

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

async function fetchUsers() {
  loading.value = true
  try {
    users.value = await userApi.getList({ pageSize: 1000 })
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
```

## 代码规范与约束

### ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/require-explicit-emits': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

### 命名规范

```typescript
/**
 * 组件命名: PascalCase
 * UserProfile, OrderList
 */

/**
 * 组合式函数: use 前缀 + 驼峰
 * useAuth, useTable, usePagination
 */

/**
 * 类型定义: PascalCase
 * User, Order, PageResult
 */

/**
 * 常量: 大写蛇形
 * API_BASE_URL, MAX_PAGE_SIZE
 */

/**
 * 枚举: PascalCase
 * UserRole, OrderStatus
 */

/**
 * 文件命名
 * - 组件: PascalCase (UserProfile.vue)
 * - 组合式函数: camelCase (useAuth.ts)
 * - 工具函数: camelCase (formatDate.ts)
 * - 类型: camelCase (user.types.ts)
 */
```

## 性能优化策略

### 路由懒加载

```typescript
// 路由配置中使用动态导入
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/Index.vue')
  }
]
```

### 组件懒加载

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
)
</script>

<template>
  <Suspense>
    <template #default>
      <HeavyChart />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

### 虚拟列表

```vue
<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = ref([]) // 大量数据
</script>

<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>
```

## 测试架构

### 单元测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [Vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/composables/**/*.ts',
        'src/utils/**/*.ts',
        'src/stores/**/*.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### 组件测试示例

```typescript
// components/__tests__/UserList.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserList from '../UserList.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('UserList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders user list', async () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ]

    const wrapper = mount(UserList, {
      props: {
        users: mockUsers,
        loading: false
      }
    })

    expect(wrapper.findAll('.user-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('John')
    expect(wrapper.text()).toContain('Jane')
  })

  it('emits select event when user is clicked', async () => {
    const mockUsers = [{ id: 1, name: 'John', email: 'john@example.com' }]
    const wrapper = mount(UserList, {
      props: { users: mockUsers, loading: false }
    })

    await wrapper.find('.user-item').trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([mockUsers[0]])
  })
})
```

## 部署与构建优化

### 构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['ant-design-vue', '@ant-design/icons-vue'],
          'utils-vendor': ['lodash-es', 'date-fns', 'axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 环境配置

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_MOCK=true

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MOCK=false
```

