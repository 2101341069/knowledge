---
title: Pinia状态管理
tags:
  - 前端
  - Vue
  - Pinia
  - 状态管理
created: 2026-04-27
---

# Pinia状态管理

## 安装与配置

```bash
npm install pinia
```

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

## 定义 Store

### Option Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    doubleCountPlusOne() {
      return this.doubleCount + 1
    }
  },

  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
})
```

### Setup Store

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }

  return { count, name, doubleCount, increment, decrement }
})
```

## 使用 Store

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// 使用 storeToRefs 保持响应式
const { count, doubleCount } = storeToRefs(store)

// 可以直接调用 action
const { increment, decrement } = store
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

## 解构与响应式

```javascript
// ❌ 这样解构会失去响应式
const { count, name } = store

// ✅ 使用 storeToRefs
const { count, name } = storeToRefs(store)
```

## 修改 State

### 直接修改

```javascript
const store = useCounterStore()
store.count++
```

### $patch

```javascript
// 对象形式
store.$patch({
  count: store.count + 1,
  name: 'A new name'
})

// 函数形式
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

### 替换 State

```javascript
store.$state = { count: 24, name: 'Pif' }
```

### 重置 State

```javascript
store.$reset()
```

## Getters

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    users: [
      { id: 1, active: true },
      { id: 2, active: false }
    ]
  }),

  getters: {
    activeUsers: (state) => {
      return state.users.filter(user => user.active)
    },
    // 接收参数
    getUserById: (state) => {
      return (userId) => state.users.find(user => user.id === userId)
    },
    // 访问其他 getter
    activeUsersCount() {
      return this.activeUsers.length
    }
  }
})
```

## Actions

### 异步 Actions

```javascript
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchUser(userId) {
      this.loading = true
      try {
        const response = await fetch(`/api/users/${userId}`)
        this.userData = await response.json()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
```

## 订阅 State

```javascript
const unsubscribe = store.$subscribe((mutation, state) => {
  console.log(mutation.type)
  console.log(mutation.storeId)
  console.log(mutation.payload)
  
  // 持久化到 localStorage
  localStorage.setItem('cart', JSON.stringify(state))
})

// 停止订阅
unsubscribe()
```

## 插件

### 持久化插件

```javascript
// pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

pinia.use(piniaPluginPersistedstate)
```

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0
  }),
  persist: true
})
```

## 组合式 Store

```javascript
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  
  async function fetchUser(id) {
    user.value = await api.getUser(id)
  }
  
  return { user, fetchUser }
})

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const items = ref([])
  
  function addItem(item) {
    if (!userStore.user) {
      throw new Error('User must be authenticated')
    }
    items.value.push(item)
  }
  
  return { items, addItem }
})
```

