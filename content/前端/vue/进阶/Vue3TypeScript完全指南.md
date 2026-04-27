---
title: Vue3 TypeScript完全指南
tags:
  - 前端
  - Vue
  - Vue3
  - TypeScript
created: 2026-04-27
---

# Vue3 TypeScript完全指南

## 项目配置

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

## 单文件组件类型

### 基本类型标注

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 基本类型
const count = ref<number>(0)
const message = ref<string>('Hello')
const isActive = ref<boolean>(false)

// 联合类型
const status = ref<'pending' | 'success' | 'error'>('pending')

// 数组类型
const list = ref<string[]>([])
const items = ref<Array<{ id: number; name: string }>>([])
</script>
```

### reactive 类型标注

```vue
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

// 方式一：直接标注
const user = reactive<User>({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})

// 方式二：类型推断
const state = reactive({
  count: 0,
  user: {
    id: 1,
    name: 'John'
  }
})
// state 类型自动推断为 { count: number; user: { id: number; name: string } }
</script>
```

### computed 类型标注

```vue
<script setup lang="ts">
const count = ref(0)

// 自动推断
const double = computed(() => count.value * 2) // number

// 显式标注
const formatted = computed<string>(() => {
  return `Count: ${count.value}`
})

// 可写 computed
const writableComputed = computed<number>({
  get: () => count.value * 2,
  set: (val) => count.value = val / 2
})
</script>
```

## Props 类型定义

### 运行时类型

```vue
<script setup lang="ts">
const props = defineProps({
  name: String,
  age: {
    type: Number,
    required: true
  },
  status: {
    type: String as () => 'active' | 'inactive',
    default: 'active'
  }
})
</script>
```

### 类型声明式 Props

```vue
<script setup lang="ts">
interface Props {
  name?: string
  age: number
  status: 'active' | 'inactive'
}

const props = defineProps<Props>()
</script>
```

### 带默认值的 Props

```vue
<script setup lang="ts">
interface Props {
  name?: string
  age: number
  status?: 'active' | 'inactive'
  tags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  name: 'Anonymous',
  status: 'active',
  tags: () => []
})
</script>
```

### 响应式 Props 转换

```vue
<script setup lang="ts">
import { toRef, toRefs } from 'vue'

interface Props {
  count: number
  name: string
}

const props = defineProps<Props>()

// 单个 prop 转 ref
const count = toRef(props, 'count')

// 所有 props 转 ref
const { count, name } = toRefs(props)

// 使用时需要 .value
console.log(count.value)
</script>
```

## Emits 类型定义

### 类型声明式 Emits

```vue
<script setup lang="ts">
// 方式一：对象形式
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
  (e: 'delete', id: number, reason: string): void
}>()

// 方式二：接口形式
interface Emits {
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}

const emit = defineEmits<Emits>()
</script>
```

### 运行时验证

```vue
<script setup lang="ts">
const emit = defineEmits({
  change: (id: number) => typeof id === 'number',
  update: (value: string) => typeof value === 'string',
  delete: (id: number, reason: string) => {
    return typeof id === 'number' && typeof reason === 'string'
  }
})
</script>
```

## v-model 类型

### 单个 v-model

```vue
<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input :value="modelValue" @input="handleInput" />
</template>
```

### 多个 v-model

```vue
<script setup lang="ts">
interface Props {
  firstName: string
  lastName: string
  age: number
}

interface Emits {
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
  (e: 'update:age', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
```

## 插槽类型

### 插槽 Props 类型

```vue
<script setup lang="ts">
import type { SlotsType } from 'vue'

interface ListItemSlots {
  default: { item: { id: number; name: string } }
  header: { title: string }
  footer: { total: number }
}

defineSlots<SlotsType<ListItemSlots>>()
</script>

<template>
  <div>
    <slot name="header" :title="'List Title'" />
    <slot name="default" v-for="item in items" :key="item.id" :item />
    <slot name="footer" :total="items.length" />
  </div>
</template>
```

## provide/inject 类型

### 类型安全的 provide/inject

```typescript
// keys.ts
import type { InjectionKey, Ref } from 'vue'

export interface User {
  id: number
  name: string
}

export const UserKey: InjectionKey<Ref<User>> = Symbol('user')
export const ThemeKey: InjectionKey<string> = Symbol('theme')
```

```vue
<!-- 父组件 -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { UserKey, ThemeKey, type User } from './keys'

const user = ref<User>({ id: 1, name: 'John' })
provide(UserKey, user)
provide(ThemeKey, 'dark')
</script>
```

```vue
<!-- 子组件 -->
<script setup lang="ts">
import { inject } from 'vue'
import { UserKey, ThemeKey } from './keys'

const user = inject(UserKey) // Ref<User> | undefined
const theme = inject(ThemeKey, 'light') // string
</script>
```

## 自定义 Hooks 类型

### useCounter 示例

```typescript
// useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue: number = 0) {
  const count = ref(initialValue)
  
  const double = computed(() => count.value * 2)
  
  const increment = (step: number = 1) => {
    count.value += step
  }
  
  const decrement = (step: number = 1) => {
    count.value -= step
  }
  
  return {
    count,
    double,
    increment,
    decrement
  }
}

// 使用
const { count, double, increment } = useCounter(10)
```

### useFetch 示例

```typescript
// useFetch.ts
import { ref, isRef, unref, watchEffect, type Ref } from 'vue'

interface FetchResult<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
}

export function useFetch<T>(url: string | Ref<string>): FetchResult<T> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(unref(url))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  if (isRef(url)) {
    watchEffect(fetchData)
  } else {
    fetchData()
  }

  return { data, error, loading }
}

// 使用
interface User {
  id: number
  name: string
}

const { data, error, loading } = useFetch<User>('/api/user')
```

## 组件实例类型

### 获取组件实例类型

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
```

```vue
<!-- 父组件 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MyModal from './MyModal.vue'

type MyModalInstance = InstanceType<typeof MyModal>

const modal = ref<MyModalInstance | null>(null)

onMounted(() => {
  modal.value?.open()
})
</script>

<template>
  <MyModal ref="modal" />
</template>
```

## Pinia 类型

### Store 类型定义

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')
  
  const isLoggedIn = computed(() => !!token.value)
  
  function setUser(newUser: User) {
    user.value = newUser
  }
  
  function setToken(newToken: string) {
    token.value = newToken
  }
  
  function logout() {
    user.value = null
    token.value = ''
  }
  
  return { user, token, isLoggedIn, setUser, setToken, logout }
})
```

### Store 类型推断

```typescript
import { useUserStore } from './stores/user'

const store = useUserStore()

// 自动推断类型
store.user // User | null
store.token // string
store.isLoggedIn // boolean
store.setUser // (newUser: User) => void
```

## Vue Router 类型

### 路由配置类型

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    layout?: 'default' | 'admin'
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, title: 'Admin', layout: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### useRoute / useRouter 类型

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// route.params 类型
const id = route.params.id as string

// route.query 类型
const search = route.query.search as string

// 路由跳转
router.push({ name: 'Home' })
router.replace({ path: '/about' })
</script>
```

## 全局属性类型

### 扩展全局属性

```typescript
// main.ts
import { createApp } from 'vue'
import type { ComponentCustomProperties } from 'vue'
import App from './App.vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatDate: (date: Date) => string
    $api: {
      get: (url: string) => Promise<any>
      post: (url: string, data: any) => Promise<any>
    }
  }
}

const app = createApp(App)

app.config.globalProperties.$formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

app.config.globalProperties.$api = {
  get: (url) => fetch(url).then(res => res.json()),
  post: (url, data) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json())
}
```

## 常见问题

### ref 自动解包问题

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({
  count // 自动解包，不需要 .value
})

console.log(state.count) // 0，不需要 .value
console.log(count.value) // 0，需要 .value
</script>
```

### 泛型组件

```vue
<script setup lang="ts" generic="T extends { id: number }">
interface Props {
  items: T[]
  selectedId?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', item: T): void
}>()

function handleClick(item: T) {
  emit('select', item)
}
</script>
```

