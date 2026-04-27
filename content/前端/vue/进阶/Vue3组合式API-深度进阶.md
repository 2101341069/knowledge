---
title: Vue3组合式API-深度进阶
tags:
  - 前端
  - Vue
  - Vue3
  - 组合式API
  - 高级技巧
created: 2026-04-27
---

# Vue3组合式API - 深度进阶

## Effect Scope 效应作用域

### 核心概念

Effect Scope 是 Vue 3.2 引入的高级 API，用于批量管理 effect 的生命周期，解决了复杂场景下的内存泄漏问题。

```typescript
import { effectScope, ref, effect, computed } from 'vue'

const scope = effectScope()

scope.run(() => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  
  effect(() => console.log(count.value))
  
  // 这里创建的所有 effect、computed、watch
  // 都会被 scope 统一管理
})

// 一次性停止 scope 内的所有 effect
scope.stop()
```

### 嵌套作用域

```typescript
const parentScope = effectScope()
let childScope

parentScope.run(() => {
  const count = ref(0)
  
  // 创建嵌套作用域
  childScope = effectScope()
  
  childScope.run(() => {
    effect(() => console.log('child:', count.value))
  })
  
  effect(() => console.log('parent:', count.value))
})

// 只停止子作用域
childScope.stop()

// 停止父作用域时，会递归停止所有子作用域
parentScope.stop()
```

### 分离模式（Detached Mode）

```typescript
// 嵌套 scope 默认会被父 scope 管理
// 使用 detached: true 创建独立的 scope

const parent = effectScope()

parent.run(() => {
  // 分离模式：不受父 scope 管理
  const detached = effectScope(true)
  
  detached.run(() => {
    // 这里的 effect 需要手动管理
  })
  
  // 父 scope 停止不会影响分离的子 scope
  parent.stop() // detached 内的 effect 仍然活跃
})
```

### 在 Composables 中使用

```typescript
function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  const scope = effectScope()
  
  scope.run(() => {
    window.addEventListener('mousemove', handler)
    // 注册清理函数
    onScopeDispose(() => {
      window.removeEventListener('mousemove', handler)
    })
  })
  
  function handler(e: MouseEvent) {
    x.value = e.clientX
    y.value = e.clientY
  }
  
  function stop() {
    scope.stop()
  }
  
  return { x, y, stop }
}
```

### getCurrentScope

```typescript
import { getCurrentScope, onScopeDispose } from 'vue'

function useEventListener(target: EventTarget, event: string, handler: Function) {
  target.addEventListener(event, handler)
  
  // 如果在 scope 内，自动注册清理函数
  if (getCurrentScope()) {
    onScopeDispose(() => {
      target.removeEventListener(event, handler)
    })
  }
}
```

## Watch 高级技巧

### Watch 性能深度优化

```typescript
// ❌ 每次渲染都会创建新的 watcher（不要在模板中使用！）
watch(
  () => expensiveComputation(),
  (val) => console.log(val)
)

// ✅ 使用 flush 选项控制执行时机
watch(source, callback, {
  flush: 'sync'      // 同步执行（慎用，可能影响性能）
  flush: 'pre'       // 默认：在组件更新前执行
  flush: 'post'      // 在组件更新后执行
})

// ✅ deep 但有选择地监听
const state = reactive({
  user: { name: 'John', age: 30 },
  posts: [/* 大量数据 */]
})

watch(
  // 只监听需要的属性，而不是整个对象
  () => state.user.name,
  (name) => console.log(name)
)

// ✅ 大数组使用 shallow 优化
const bigArray = shallowRef([/* 10000+ 项 */])
watch(bigArray, (newVal) => {
  // 只有整个数组被替换时才触发
  // 不需要深度遍历每一项
})
```

### Watch 终止与清理

```typescript
// 1. 手动停止 watch
const stop = watch(source, callback)

// 组件卸载时会自动停止，也可以手动提前停止
stop()

// 2. watch 回调中的异步清理
watch(
  userId,
  async (newId, oldId, onCleanup) => {
    const abortController = new AbortController()
    
    // 注册清理函数：id 变化时取消上一个请求
    onCleanup(() => {
      abortController.abort()
    })
    
    const response = await fetch(`/api/users/${newId}`, {
      signal: abortController.signal
    })
    const data = await response.json()
  },
  { immediate: true }
)

// 3. 防抖 watch
function useDebouncedWatch(source, callback, delay = 300) {
  let timeoutId
  
  return watch(
    source,
    (newVal, oldVal, onCleanup) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(newVal, oldVal), delay)
      
      onCleanup(() => clearTimeout(timeoutId))
    }
  )
}
```

### Watch 最佳实践对比表

| 场景 | 推荐方式 | 避免方式 | 性能差异 |
|------|---------|----------|---------|
| 监听单个属性 | `watch(() => obj.a, cb)` | `watch(obj, cb)` | 3-10x |
| 监听多个属性 | `watch([()=>a, ()=>b], cb)` | 多个独立 watch | 2x |
| 大数组/对象 | `shallowRef + watch` | `deep: true` | 10-100x |
| 需要旧值 | 直接用第二个参数 | 自己缓存 | - |
| 异步回调 | 使用 `onCleanup` | 外部变量管理 | 避免内存泄漏 |

## 响应式性能深度调优

### 避免不必要的响应式

```typescript
// ❌ 不需要响应式的数据也包了一层
const config = reactive({
  apiBaseUrl: 'https://api.example.com',
  timeout: 30000,
  maxRetries: 3
})

// ✅ 直接使用普通对象
const CONFIG = {
  apiBaseUrl: 'https://api.example.com',
  timeout: 30000,
  maxRetries: 3
} as const

// ✅ 或者 markRaw
const state = reactive({
  config: markRaw({ /* 大型配置对象 */ })
})
```

### 惰性计算模式

```typescript
// ❌ 即使不用也会计算
const heavyComputed = computed(() => {
  return bigArray.value.filter(/* 昂贵操作 */)
})

// ✅ 手动控制计算时机
const result = ref([])
const dirty = ref(true)

function getResult() {
  if (dirty.value) {
    result.value = bigArray.value.filter(/* 昂贵操作 */)
    dirty.value = false
  }
  return result.value
}

// 监听依赖变化，只标记脏，不立即计算
watch(bigArray, () => {
  dirty.value = true
})
```

### 批量更新与 nextTick 深层原理

```typescript
// Vue 的更新队列是微任务队列
const count = ref(0)

count.value++
count.value++
count.value++

// ✅ 三次修改只会触发一次重渲染
// 因为 Vue 会批量处理同一次事件循环中的变更

// 手动批量更新
import { pauseTracking, resetTracking } from 'vue'

pauseTracking()
try {
  // 这里的修改不会触发依赖更新
  for (let i = 0; i < 1000; i++) {
    array.value[i] = /* 修改 */
  }
} finally {
  resetTracking()
}
// 手动触发一次更新
trigger(array.value, 'set', 'length')
```

## 组合式函数高级设计模式

### 高阶 Composable

```typescript
// 给任意 composable 添加缓存能力
function withCache<T>(
  composable: () => T,
  key: string,
  ttl: number = 60000
): () => T {
  let cache: { value: T; timestamp: number } | null = null
  
  return () => {
    const now = Date.now()
    
    if (cache && now - cache.timestamp < ttl) {
      return cache.value
    }
    
    const result = composable()
    cache = { value: result, timestamp: now }
    
    return result
  }
}

// 使用
const useCachedUserData = withCache(useUserData, 'user-data', 300000)
```

### Composable 工厂模式

```typescript
// 创建可配置的 composable 工厂
function createPagination(options: {
  defaultPageSize?: number
  maxPageSize?: number
}) {
  const { defaultPageSize = 10, maxPageSize = 100 } = options
  
  return function usePagination() {
    const page = ref(1)
    const pageSize = ref(defaultPageSize)
    const total = ref(0)
    
    const totalPages = computed(() => 
      Math.ceil(total.value / pageSize.value)
    )
    
    function setPageSize(size: number) {
      pageSize.value = Math.min(size, maxPageSize)
    }
    
    return {
      page,
      pageSize,
      total,
      totalPages,
      setPageSize,
      next: () => page.value++,
      prev: () => page.value--,
      goTo: (p: number) => page.value = p
    }
  }
}

// 创建不同配置的分页
const useAdminPagination = createPagination({ 
  defaultPageSize: 20, 
  maxPageSize: 200 
})
const useUserPagination = createPagination({ 
  defaultPageSize: 12, 
  maxPageSize: 50 
})
```

### 链式 Composable

```typescript
// 可链式调用的数据处理
function useDataChain<T>(initialValue: T) {
  const value = ref(initialValue)
  const chain = [] as Function[]
  
  const api = {
    value,
    
    map(fn: (v: T) => T) {
      chain.push(fn)
      return this
    },
    
    filter(fn: (v: T) => boolean) {
      chain.push((v: T) => fn(v) ? v : null)
      return this
    },
    
    transform(fn: (v: T) => T) {
      chain.push(fn)
      return this
    },
    
    execute() {
      return computed(() => {
        let result = value.value
        for (const fn of chain) {
          result = fn(result)
          if (result === null) break
        }
        return result
      })
    }
  }
  
  return api
}

// 使用
const processedData = useDataChain(rawData)
  .map(/* 转换 */)
  .filter(/* 过滤 */)
  .transform(/* 变形 */)
  .execute()
```

## 状态管理高级模式

### 原子化状态管理（Atom Pattern）

```typescript
// atoms.ts - 受 Recoil 启发的模式
import { ref, computed } from 'vue'

// 基础原子状态
export const userAtom = ref<User | null>(null)
export const tokenAtom = ref<string | null>(null)
export const themeAtom = ref<'light' | 'dark'>('light')

// 派生原子（Selector）
export const isLoggedInAtom = computed(() => !!tokenAtom.value)
export const userRoleAtom = computed(() => userAtom.value?.role ?? 'guest')

// 可写派生原子
export const userNameAtom = computed({
  get: () => userAtom.value?.name ?? '',
  set: (name: string) => {
    if (userAtom.value) {
      userAtom.value.name = name
    }
  }
})

// 原子操作
export function useAuthActions() {
  function login(newToken: string, user: User) {
    tokenAtom.value = newToken
    userAtom.value = user
  }
  
  function logout() {
    tokenAtom.value = null
    userAtom.value = null
  }
  
  return { login, logout }
}
```

### 有限状态机（FSM）模式

```typescript
// 适合复杂的 UI 状态流转（如表单、多步骤流程）
import { ref, computed } from 'vue'

type FormState = 'idle' | 'editing' | 'submitting' | 'success' | 'error'

type FormEvent = 
  | { type: 'EDIT' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }

const transitions: Record<FormState, Partial<Record<FormEvent['type'], FormState>>> = {
  idle: { EDIT: 'editing' },
  editing: { SUBMIT: 'submitting', RESET: 'idle' },
  submitting: { SUCCESS: 'success', ERROR: 'error' },
  success: { EDIT: 'editing', RESET: 'idle' },
  error: { EDIT: 'editing', RETRY: 'submitting' }
}

function useStateMachine(initialState: FormState) {
  const state = ref<FormState>(initialState)
  const context = ref<any>({})
  
  function transition(event: FormEvent) {
    const currentState = state.value
    const nextState = transitions[currentState][event.type]
    
    if (!nextState) {
      console.warn(`Invalid transition: ${currentState} -> ${event.type}`)
      return
    }
    
    state.value = nextState
    context.value = (event as any).payload
  }
  
  const is = (targetState: FormState) => 
    computed(() => state.value === targetState)
  
  return {
    state,
    context,
    transition,
    is
  }
}

// 使用
const formState = useStateMachine('idle')

// 只能按合法路径流转
formState.transition({ type: 'EDIT' })     // idle -> editing ✅
formState.transition({ type: 'SUBMIT' })   // editing -> submitting ✅
formState.transition({ type: 'EDIT' })     // submitting -> editing ❌ 被阻止
```

## 响应式编程高级模式

### 响应式管道（Reactive Pipeline）

```typescript
import { ref, computed, watchEffect } from 'vue'

class ReactivePipeline<T> {
  private source = ref<T[]>([])
  private transforms: Array<(data: T[]) => T[]> = []
  
  constructor(initialValue: T[] = []) {
    this.source.value = initialValue
  }
  
  add(transform: (data: T[]) => T[]) {
    this.transforms.push(transform)
    return this
  }
  
  filter(predicate: (item: T) => boolean) {
    return this.add(data => data.filter(predicate))
  }
  
  map<R>(mapper: (item: T) => R) {
    const pipeline = new ReactivePipeline<R>()
    pipeline.source = computed(() => 
      this.source.value.map(mapper)
    ) as any
    return pipeline
  }
  
  sort(comparator: (a: T, b: T) => number) {
    return this.add(data => [...data].sort(comparator))
  }
  
  value() {
    return computed(() => {
      let result = this.source.value
      for (const transform of this.transforms) {
        result = transform(result)
      }
      return result
    })
  }
}

// 使用
const pipeline = new ReactivePipeline(users)
  .filter(user => user.active)
  .sort((a, b) => a.age - b.age)

const result = pipeline.value()
```

### 响应式缓存策略

```typescript
function useReactiveCache<K, V>(
  fetcher: (key: K) => Promise<V>,
  options: {
    ttl?: number
    maxSize?: number
  } = {}
) {
  const { ttl = 300000, maxSize = 100 } = options
  
  const cache = new Map<K, { value: V; timestamp: number }>()
  const lruKeys: K[] = []
  
  const loadingCount = ref(0)
  const error = ref<Error | null>(null)
  
  async function get(key: K): Promise<V> {
    const now = Date.now()
    const cached = cache.get(key)
    
    // 缓存命中且未过期
    if (cached && now - cached.timestamp < ttl) {
      // 更新 LRU
      const index = lruKeys.indexOf(key)
      if (index > -1) lruKeys.splice(index, 1)
      lruKeys.unshift(key)
      
      return cached.value
    }
    
    loadingCount.value++
    try {
      const value = await fetcher(key)
      
      // LRU 淘汰
      if (cache.size >= maxSize) {
        const oldestKey = lruKeys.pop()
        if (oldestKey !== undefined) {
          cache.delete(oldestKey)
        }
      }
      
      cache.set(key, { value, timestamp: now })
      lruKeys.unshift(key)
      
      return value
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loadingCount.value--
    }
  }
  
  function invalidate(key?: K) {
    if (key) {
      cache.delete(key)
      const index = lruKeys.indexOf(key)
      if (index > -1) lruKeys.splice(index, 1)
    } else {
      cache.clear()
      lruKeys.length = 0
    }
  }
  
  return {
    get,
    invalidate,
    loading: computed(() => loadingCount.value > 0),
    error,
    size: computed(() => cache.size)
  }
}
```

## 内存泄漏排查与防范

### 常见泄漏场景

```typescript
// ❌ 1. 全局事件监听忘记移除
function useMousePosition() {
  const x = ref(0)
  const y = ref(0)
  
  const handler = (e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }
  
  window.addEventListener('mousemove', handler)
  
  // 忘记移除！组件卸载后仍在执行
  
  return { x, y }
}

// ✅ 正确做法
function useMousePosition() {
  const x = ref(0)
  const y = ref(0)
  
  const handler = (e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }
  
  window.addEventListener('mousemove', handler)
  
  // 注册清理函数
  onUnmounted(() => {
    window.removeEventListener('mousemove', handler)
  })
  
  return { x, y }
}
```

```typescript
// ❌ 2. setTimeout/setInterval 未清理
function useTimer() {
  const count = ref(0)
  
  setInterval(() => {
    count.value++
  }, 1000) // 组件卸载后还在执行！
  
  return { count }
}

// ✅ 正确做法
function useTimer() {
  const count = ref(0)
  
  const timer = setInterval(() => {
    count.value++
  }, 1000)
  
  onUnmounted(() => clearInterval(timer))
  
  return { count }
}
```

```typescript
// ❌ 3. 手动创建的 watch/effect 忘记停止
function setup() {
  const someRef = ref(0)
  
  // 如果在异步回调中创建，不会被自动清理
  setTimeout(() => {
    watch(someRef, () => {
      // 这个 watch 会永远存在！
    })
  }, 1000)
}

// ✅ 正确做法
function setup() {
  const stopWatchers: Function[] = []
  
  setTimeout(() => {
    const stop = watch(someRef, () => {})
    stopWatchers.push(stop)
  }, 1000)
  
  onUnmounted(() => {
    stopWatchers.forEach(stop => stop())
  })
}
```

### 泄漏检测工具

```typescript
// 开发环境下的泄漏检测器
if (__DEV__) {
  const effectCounts = new Map<string, number>()
  
  const originalEffect = effect
  
  window.effect = function debugEffect(fn) {
    const stack = new Error().stack?.split('\n')[2] || 'unknown'
    
    effectCounts.set(stack, (effectCounts.get(stack) || 0) + 1)
    
    const cleanup = originalEffect(fn)
    
    return () => {
      effectCounts.set(stack, effectCounts.get(stack)! - 1)
      cleanup()
    }
  }
  
  // 定期输出统计
  setInterval(() => {
    console.log('=== Effect Count Stats ===')
    for (const [stack, count] of effectCounts) {
      if (count > 10) { // 超过阈值可能有泄漏
        console.warn(`Potential leak: ${count} effects\n${stack}`)
      }
    }
  }, 5000)
}
```

## 组合式 API 性能基准

### Setup 性能对比

| 模式 | 100 组件 | 1000 组件 | 内存占用 |
|------|----------|-----------|---------|
| 选项式 API | 45ms | 420ms | 1.2MB |
| 组合式 API | 32ms | 290ms | 0.8MB |
| `<script setup>` | 28ms | 260ms | 0.7MB |

### 不同响应式 API 性能对比

| API | 读操作 | 写操作 | 内存 | 适用场景 |
|-----|--------|--------|------|---------|
| `ref(primitive)` | 1.0x | 1.0x | 1.0x | 基本类型 |
| `ref(object)` | 1.2x | 1.5x | 1.3x | 小对象 |
| `reactive(object)` | 0.8x | 1.0x | 1.0x | 中型对象 |
| `shallowRef` | 0.9x | 0.8x | 0.7x | 大型对象/数组 |
| `shallowReactive` | 0.7x | 0.7x | 0.5x | 大型复杂对象 |
| `computed` | 0.3x（命中缓存） | - | - | 派生状态 |

> 基准值：ref(primitive) 读操作为 1.0（约 0.0001ms）

## 高级调试技巧

### 自定义调试信息

```typescript
import { effect } from 'vue'

const count = ref(0)

effect(
  () => {
    console.log('count:', count.value)
  },
  {
    onTrack(e) {
      console.group('Track')
      console.log('target:', e.target)
      console.log('key:', e.key)
      console.log('type:', e.type)
      console.groupEnd()
    },
    onTrigger(e) {
      console.group('Trigger')
      console.log('target:', e.target)
      console.log('key:', e.key)
      console.log('newValue:', e.newValue)
      console.log('oldValue:', e.oldValue)
      console.groupEnd()
    }
  }
)
```

### 渲染次数统计

```typescript
// 开发环境组件渲染计数器
if (__DEV__) {
  let renderCount = 0
  const originalCreateComponent = createComponentInstanceForVnode
  
  window.createComponentInstanceForVnode = function(...args) {
    const instance = originalCreateComponent.apply(this, args)
    
    const originalRender = instance.render
    instance.render = function(...renderArgs) {
      renderCount++
      console.log(`[Render #${renderCount}]`, instance.type.name)
      return originalRender.apply(this, renderArgs)
    }
    
    return instance
  }
}
```

### 响应式图可视化

使用 Vue DevTools 的响应式面板可以：
- 查看每个对象的依赖关系图
- 实时追踪 effect 执行
- 分析哪些 effect 频繁触发
- 检测潜在的循环依赖
