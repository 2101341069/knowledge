---
title: Pinia深度架构与高级实践
tags:
  - 前端
  - Vue
  - Vue3
  - Pinia
  - 状态管理
created: 2026-04-27
---

# Pinia深度架构与高级实践

## Pinia 核心架构设计

### 与 Vuex 的架构对比

| 特性 | Vuex 3/4 | Pinia |
|------|----------|-------|
| **核心概念** | State, Getters, Mutations, Actions | State, Getters, Actions |
| **TypeScript** | 需要复杂类型定义 | 原生完整支持 |
| **模块系统** | 嵌套命名空间模块 | 扁平 Store + 组合 |
| **热重载** | 复杂配置 | 开箱即用 |
| **DevTools** | 基础支持 | 完整时间旅行、组提交 |
| **代码分割** | 手动处理 | 自动懒加载 |
| **SSR** | 需要注入 context | 原生支持 |
| **插件系统** | 有限 | 完整生命周期钩子 |

### Pinia 内部架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        Pinia Instance                        │
├─────────────────────────────────────────────────────────────┤
│  State (Ref)   Getters (Computed)   Actions (Functions)     │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
             ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     Reactivity System     │   │      DevTools Plugin      │
│     (Vue 3 Core)          │   │  - Time Travel Debugging  │
│  - ref / reactive         │   │  - State Diff             │
│  - computed               │   │  - Action Timeline        │
│  - watch                  │   └───────────────────────────┘
└────────────┬──────────────┘
             │
             ▼
┌───────────────────────────┐
│     Plugin System         │
│  - state.subscribers      │
│  - action.subscribers     │
│  - getters.subscribers    │
└───────────────────────────┘
```

### Store 创建流程源码分析

```typescript
// Pinia 核心 createStore 逻辑
function createStore(id: string, options: StoreOptions) {
  const { state, getters, actions } = options
  
  // 1. 创建响应式 state
  const stateRef = ref(state ? state() : {})
  const state = stateRef.value
  
  // 2. 处理 getters - 转成 computed
  const computedGetters = {}
  for (const key in getters) {
    const getter = getters[key]
    computedGetters[key] = computed(() => getter(state))
  }
  
  // 3. 处理 actions - 绑定上下文
  const wrappedActions = {}
  for (const key in actions) {
    const action = actions[key]
    wrappedActions[key] = function(...args) {
      // 触发 action 订阅器
      triggerSubscribers(actionSubscribers, {
        name: key,
        store,
        args
      })
      
      // 执行原始 action
      return action.apply(store, args)
    }
  }
  
  // 4. 组合 store 对象
  const store = {
    $id: id,
    $state: state,
    ...computedGetters,
    ...wrappedActions,
    
    // 核心方法
    $patch,
    $reset,
    $subscribe,
    $onAction,
    $dispose
  }
  
  return store
}
```

## $patch 深度解析

### 两种调用方式的性能差异

```typescript
const store = useStore()

// 方式一：对象补丁（适合简单修改）
store.$patch({
  count: store.count + 1,
  name: 'New Name'
})

// 方式二：函数补丁（适合复杂修改）
store.$patch(state => {
  state.items.push({ id: 1, name: 'Item' })
  state.count++
  state.updatedAt = Date.now()
})
```

**性能对比：**

| 修改场景 | 直接赋值 | $patch 对象 | $patch 函数 |
|---------|---------|------------|------------|
| 单个属性 | 1x | 1.2x | 1.1x |
| 5 个属性 | 5x | 1.5x | 1.3x |
| 数组 push 10 项 | 10x | 1.8x | 1.2x |
| 复杂嵌套修改 | Nx | 2x | 1.5x |

**关键结论：** 修改超过 2 个属性时，使用 `$patch` 性能更优，因为只触发一次订阅通知。

### $patch 原子性与事务特性

```typescript
// $patch 是原子的：要么全部成功，要么全部失败（函数形式）
try {
  store.$patch(state => {
    state.user.name = 'Alice'
    state.user.age = 25
    throw new Error('Oops!') // 抛出异常
    state.count++ // 不会执行
  })
} catch (e) {
  // 之前的修改已经生效！
  // ⚠️ 注意：$patch 本身不提供回滚机制
  // 需要手动实现事务
}

// 自定义事务包装
function withRollback(store, mutation) {
  const snapshot = JSON.parse(JSON.stringify(store.$state))
  try {
    store.$patch(mutation)
  } catch (e) {
    store.$state = snapshot // 回滚
    throw e
  }
}
```

## Store 组合模式

### 横向分片（Feature-Based）

```
stores/
├── useUserStore.ts      # 用户相关
├── useCartStore.ts      # 购物车
├── useProductStore.ts   # 商品
├── useOrderStore.ts     # 订单
└── useUiStore.ts        # UI 状态
```

```typescript
// stores/useUserStore.ts
export const useUserStore = defineStore('user', () => {
  const profile = ref<User | null>(null)
  const preferences = ref<UserPreferences>({})
  
  const fullName = computed(() => 
    `${profile.value?.firstName} ${profile.value?.lastName}`
  )
  
  async function fetchProfile() {
    profile.value = await api.getUserProfile()
  }
  
  return { profile, preferences, fullName, fetchProfile }
})
```

### 纵向分层（Layered）

```typescript
// 底层：数据访问层
const useDataStore = defineStore('data', () => {
  const cache = ref(new Map())
  
  function getCached(key) {
    return cache.value.get(key)
  }
  
  function setCache(key, value) {
    cache.value.set(key, value)
  }
  
  return { getCached, setCache }
})

// 中间层：业务逻辑层
const useBusinessStore = defineStore('business', () => {
  const dataStore = useDataStore()
  
  function processData(input) {
    const cached = dataStore.getCached(input.id)
    if (cached) return cached
    
    const result = heavyProcessing(input)
    dataStore.setCache(input.id, result)
    return result
  }
  
  return { processData }
})

// 上层：UI 状态层
const useUiStore = defineStore('ui', () => {
  const businessStore = useBusinessStore()
  const isLoading = ref(false)
  
  async function loadData(id) {
    isLoading.value = true
    try {
      return await businessStore.processData({ id })
    } finally {
      isLoading.value = false
    }
  }
  
  return { isLoading, loadData }
})
```

### 依赖注入模式

```typescript
// 避免循环依赖的关键：使用惰性注入
export const useStoreA = defineStore('a', () => {
  // ❌ 不要在这里直接调用其他 store
  // const storeB = useStoreB() // 可能导致循环依赖
  
  // ✅ 在 action/getter 中惰性调用
  function someAction() {
    const storeB = useStoreB() // 运行时才解析
    return storeB.doSomething()
  }
  
  const someGetter = computed(() => {
    const storeB = useStoreB()
    return storeB.someValue
  })
  
  return { someAction, someGetter }
})
```

## 性能优化高级技巧

### 选择性订阅（Selective Subscription）

```typescript
// ❌ 整个 store 变化都触发
const store = useStore()
watch(() => store.$state, (newState) => {
  console.log('State changed!')
}, { deep: true })

// ✅ 只订阅需要的部分
watch(
  () => store.user.profile, // 只监听用户资料
  (profile) => {
    // 只有 profile 变化才触发
    localStorage.setItem('profile', JSON.stringify(profile))
  },
  { deep: true }
)

// ✅ 使用 $subscribe 过滤
store.$subscribe(
  (mutation, state) => {
    // mutation 包含变更信息
    console.log('Mutation type:', mutation.type) // 'direct' | 'patch object' | 'patch function'
    console.log('Events:', mutation.events) // 具体变更事件
    
    // 只处理特定类型的变更
    if (mutation.type === 'patch object' && mutation.storeId === 'user') {
      // 处理
    }
  },
  {
    detached: false, // false = 组件卸载自动移除
    deep: true
  }
)
```

### 状态规范化（State Normalization）

```typescript
// ❌ 嵌套数组结构，更新困难
const badState = {
  users: [
    { id: 1, name: 'Alice', posts: [{ id: 1, title: 'Post 1' }] },
    { id: 2, name: 'Bob', posts: [{ id: 2, title: 'Post 2' }] },
  ]
}

// ✅ 规范化结构，类数据库设计
const goodState = {
  users: {
    byId: {
      1: { id: 1, name: 'Alice', postIds: [1] },
      2: { id: 2, name: 'Bob', postIds: [2] },
    },
    allIds: [1, 2]
  },
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 1 },
      2: { id: 2, title: 'Post 2', authorId: 2 },
    },
    allIds: [1, 2]
  }
}

// Getters 按需组合
const getUsersWithPosts = computed(() => {
  return state.users.allIds.map(userId => {
    const user = state.users.byId[userId]
    return {
      ...user,
      posts: user.postIds.map(postId => state.posts.byId[postId])
    }
  })
})
```

**性能收益对比：**

| 操作 | 嵌套数组 | 规范化结构 | 提升 |
|------|---------|-----------|------|
| 查找单个用户 | O(n) | O(1) | ~100x |
| 更新用户名 | O(n) | O(1) | ~50x |
| 更新帖子标题 | O(n*m) | O(1) | ~1000x |
| 遍历所有用户 | O(n) | O(n) | 相同 |

### 计算属性缓存层级

```typescript
const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const filters = ref({
    category: 'all',
    minPrice: 0,
    maxPrice: Infinity,
    search: ''
  })
  
  // Level 1: 基础过滤 - 尽量细粒度
  const filteredByCategory = computed(() => {
    if (filters.value.category === 'all') return products.value
    return products.value.filter(p => p.category === filters.value.category)
  })
  
  const filteredByPrice = computed(() => {
    return filteredByCategory.value.filter(p => 
      p.price >= filters.value.minPrice && 
      p.price <= filters.value.maxPrice
    )
  })
  
  // Level 2: 搜索过滤 - 基于上一级结果
  const filteredProducts = computed(() => {
    if (!filters.value.search) return filteredByPrice.value
    const search = filters.value.search.toLowerCase()
    return filteredByPrice.value.filter(p => 
      p.name.toLowerCase().includes(search)
    )
  })
  
  // Level 3: 派生数据 - 基于最终过滤结果
  const totalPrice = computed(() => {
    return filteredProducts.value.reduce((sum, p) => sum + p.price, 0)
  })
  
  return { products, filters, filteredProducts, totalPrice }
})
```

**这样设计的好处：**
- 只变更价格范围时，`filteredByCategory` 不会重新计算
- 只变更搜索词时，`filteredByCategory` 和 `filteredByPrice` 都不会重新计算
- 每一层都缓存，避免重复计算

## 持久化插件深度定制

### pinia-plugin-persistedstate 高级配置

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 全局默认配置
pinia.use(({ options, store }) => {
  if (options.persist) {
    // 统一配置
    if (typeof options.persist === 'boolean') {
      options.persist = {
        key: store.$id,
        storage: localStorage,
        paths: undefined, // 全量持久化
        serializer: {
          serialize: (value) => {
            // 自定义序列化：处理 BigInt、Date、Map
            return JSON.stringify(value, (key, val) => {
              if (typeof val === 'bigint') return `__BigInt__:${val}`
              if (val instanceof Date) return `__Date__:${val.toISOString()}`
              if (val instanceof Map) return `__Map__:${JSON.stringify([...val])}`
              return val
            })
          },
          deserialize: (value) => {
            return JSON.parse(value, (key, val) => {
              if (typeof val === 'string' && val.startsWith('__BigInt__:')) {
                return BigInt(val.slice(10))
              }
              if (typeof val === 'string' && val.startsWith('__Date__:')) {
                return new Date(val.slice(8))
              }
              if (typeof val === 'string' && val.startsWith('__Map__:')) {
                return new Map(JSON.parse(val.slice(7)))
              }
              return val
            })
          }
        },
        beforeRestore: (context) => {
          console.log(`Restoring ${context.store.$id}`)
        },
        afterRestore: (context) => {
          console.log(`Restored ${context.store.$id}`)
        }
      }
    }
  }
})

pinia.use(piniaPluginPersistedstate)
```

### 部分持久化与排除

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    token: '',
    preferences: {},
    tempData: {}, // 不需要持久化
    loading: false // 不需要持久化
  }),
  
  persist: {
    // 只持久化指定路径
    paths: ['profile', 'token', 'preferences'],
    
    // 或者排除某些路径
    // paths: ['!tempData', '!loading']
  }
})
```

### 加密持久化

```typescript
// 使用 AES 加密敏感数据
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_STORE_ENCRYPTION_KEY

persist: {
  serializer: {
    serialize: (state) => {
      const json = JSON.stringify(state)
      return CryptoJS.AES.encrypt(json, SECRET_KEY).toString()
    },
    deserialize: (ciphertext) => {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
      const json = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(json)
    }
  }
}
```

## 插件开发完全指南

### 插件生命周期钩子

```typescript
function myPiniaPlugin(context) {
  const {
    pinia,      // Pinia 实例
    app,        // Vue 应用实例
    store,      // 当前 Store
    options     // Store 定义选项
  } = context
  
  // 1. Store 创建时执行一次
  console.log(`Store ${store.$id} created`)
  
  // 2. 给所有 Store 添加属性
  store.$router = app.config.globalProperties.$router
  
  // 3. 添加新方法
  store.$logState = () => {
    console.log(`[${store.$id}]`, store.$state)
  }
  
  // 4. 订阅状态变更
  const unsubscribe = store.$subscribe((mutation, state) => {
    // mutation: { type, storeId, events }
    // type: 'direct' | 'patch object' | 'patch function'
    console.log('State changed:', mutation)
  })
  
  // 5. 订阅 Action
  const unsubscribeAction = store.$onAction(
    ({
      name,      // action 名称
      store,     // store 实例
      args,      // 参数
      after,     // 成功回调
      onError    // 错误回调
    }) => {
      const startTime = Date.now()
      console.log(`Action ${name} started with args:`, args)
      
      after((result) => {
        console.log(`Action ${name} finished in ${Date.now() - startTime}ms`)
        console.log('Result:', result)
      })
      
      onError((error) => {
        console.error(`Action ${name} failed:`, error)
      })
    },
    true // 分离模式：组件卸载后仍保留订阅
  )
  
  // 6. Store 销毁时清理
  store.$onDispose(() => {
    unsubscribe()
    unsubscribeAction()
    console.log(`Store ${store.$id} disposed`)
  })
}
```

### 插件示例：操作日志

```typescript
function piniaLoggerPlugin() {
  // 存储所有 action 历史
  const actionHistory = []
  
  return ({ store }) => {
    store.$onAction(({ name, args, after, onError }) => {
      const entry = {
        time: new Date().toISOString(),
        storeId: store.$id,
        action: name,
        args: [...args],
        status: 'pending'
      }
      actionHistory.push(entry)
      
      after((result) => {
        entry.status = 'success'
        entry.result = result
      })
      
      onError((error) => {
        entry.status = 'error'
        entry.error = error.message
      })
    })
    
    // 暴露历史查询方法
    store.$actionHistory = computed(() => actionHistory)
    store.$clearHistory = () => actionHistory.length = 0
  }
}
```

### 插件示例：撤销/重做

```typescript
function piniaUndoRedoPlugin() {
  const history = new Map()
  const MAX_HISTORY = 50
  
  return ({ store }) => {
    const storeHistory = {
      past: [],
      future: []
    }
    history.set(store.$id, storeHistory)
    
    // 记录每次变更前的快照
    store.$subscribe((mutation, state) => {
      // 排除撤销/重做操作本身
      if (!mutation.isUndoRedo) {
        storeHistory.past.push(JSON.parse(JSON.stringify(state)))
        
        // 限制历史长度
        if (storeHistory.past.length > MAX_HISTORY) {
          storeHistory.past.shift()
        }
        
        // 新操作清除未来
        storeHistory.future = []
      }
    })
    
    // 添加撤销方法
    store.$undo = () => {
      if (storeHistory.past.length === 0) return
      
      const pastState = storeHistory.past.pop()
      storeHistory.future.push(JSON.parse(JSON.stringify(store.$state)))
      
      store.$patch({ ...pastState, isUndoRedo: true })
    }
    
    // 添加重做方法
    store.$redo = () => {
      if (storeHistory.future.length === 0) return
      
      const futureState = storeHistory.future.pop()
      storeHistory.past.push(JSON.parse(JSON.stringify(store.$state)))
      
      store.$patch({ ...futureState, isUndoRedo: true })
    }
    
    // 计算属性
    store.$canUndo = computed(() => storeHistory.past.length > 0)
    store.$canRedo = computed(() => storeHistory.future.length > 0)
  }
}
```

## SSR 模式下的 Pinia

### 服务端数据预取

```typescript
// server.ts
import { createPinia } from 'pinia'

app.get('*', async (req, res) => {
  const pinia = createPinia()
  
  // 预取数据
  const userStore = useUserStore(pinia)
  await userStore.fetchProfile()
  
  // 序列化状态注入 HTML
  const state = JSON.stringify(pinia.state.value)
  
  res.send(`
    <html>
      <body>
        <div id="app"></div>
        <script>
          window.__PINIA_STATE__ = ${state}
        </script>
      </body>
    </html>
  `)
})
```

### 客户端水合

```typescript
// client.ts
import { createPinia } from 'pinia'

const pinia = createPinia()

// 恢复服务端状态
if (window.__PINIA_STATE__) {
  pinia.state.value = JSON.parse(window.__PINIA_STATE__)
}

app.use(pinia)
```

## 测试策略

### Store 单元测试

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('User Store', () => {
  beforeEach(() => {
    // 创建一个新的 pinia 实例
    setActivePinia(createPinia())
  })
  
  it('initial state', () => {
    const store = useUserStore()
    expect(store.profile).toBeNull()
    expect(store.token).toBe('')
  })
  
  it('login action', async () => {
    // mock API
    vi.spyOn(api, 'login').mockResolvedValue({
      token: 'test-token',
      user: { id: 1, name: 'Test' }
    })
    
    const store = useUserStore()
    await store.login('email', 'pass')
    
    expect(store.token).toBe('test-token')
    expect(store.profile?.name).toBe('Test')
  })
  
  it('logout action', () => {
    const store = useUserStore()
    store.token = 'test-token'
    store.profile = { id: 1, name: 'Test' }
    
    store.logout()
    
    expect(store.token).toBe('')
    expect(store.profile).toBeNull()
  })
})
```

### $onAction 用于测试断言

```typescript
it('emits action with correct arguments', async () => {
  const store = useUserStore()
  
  let actionArgs = null
  store.$onAction(({ name, args, after }) => {
    if (name === 'login') {
      actionArgs = args
    }
  })
  
  await store.login('test@email.com', 'password123')
  
  expect(actionArgs).toEqual(['test@email.com', 'password123'])
})
```

## 常见问题与陷阱

### 解构丢失响应式

```typescript
const store = useStore()

// ❌ 错误：解构丢失响应式
const { count, name } = store

// ✅ 正确：使用 storeToRefs
import { storeToRefs } from 'pinia'
const { count, name } = storeToRefs(store)

// ✅ 方法可以直接解构
const { increment, updateName } = store
```

### 循环依赖解决方案

```typescript
// 问题：Store A 导入 Store B，Store B 导入 Store A

// 解决方案：惰性加载
export const useStoreA = defineStore('a', () => {
  function useStoreBInAction() {
    // 在 action 中动态导入，而不是顶部导入
    const storeB = useStoreB()
    return storeB.someValue
  }
  
  return { useStoreBInAction }
})

// 或者：提取共享逻辑
// sharedLogic.ts
export const sharedComputed = computed(() => /* ... */)
export const sharedAction = () => /* ... */
```

### 大对象更新性能

```typescript
// ❌ 每次更新都创建新对象，触发所有依赖
const bigObject = ref({
  /* 1000+ 个属性 */
})

function updateField(key, value) {
  bigObject.value = { ...bigObject.value, [key]: value }
}

// ✅ 使用 reactive 原地修改
const bigObject = reactive({
  /* 1000+ 个属性 */
})

function updateField(key, value) {
  bigObject[key] = value // 只触发该字段的依赖更新
}

// ✅ 或者使用 $patch 函数式更新
store.$patch(state => {
  state.bigObject[key] = value // 批量处理多个更新
})
```

## Pinia 2.1+ 新特性

### Setup Store 中的 $reset

```typescript
// Setup Store 现在也支持 $reset 了（需要手动配置）
const initialState = { count: 0, name: '' }

export const useStore = defineStore('test', () => {
  const state = reactive({ ...initialState })
  
  function $reset() {
    Object.assign(state, { ...initialState })
  }
  
  return { ...toRefs(state), $reset }
})
```

### Store 热重载（HMR）

```typescript
// stores/useUserStore.ts
export const useUserStore = defineStore(/* ... */)

// vite 环境下自动 HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
```

### 更好的 TypeScript 推断

```typescript
// Pinia 2.1 自动推断 Setup Store 类型
const store = useStore()
// store.count: Ref<number> ✓
// store.increment: (amount?: number) => void ✓
```
