---
title: VueUse工具库详解
tags:
  - 前端
  - Vue
  - Vue3
  - VueUse
  - 工具库
created: 2026-04-27
---

# VueUse工具库详解

## 安装与配置

### 基础安装

```bash
npm install @vueuse/core
```

### Nuxt 集成

```bash
npm install @vueuse/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt']
})
```

### 自动导入

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['@vueuse/core', '@vueuse/components']
    })
  ]
})
```

## 状态管理类

### useLocalStorage / useSessionStorage

```typescript
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

// 本地存储
const settings = useLocalStorage('my-settings', {
  theme: 'dark',
  language: 'zh-CN'
})

// 会话存储
const formDraft = useSessionStorage('form-draft', {
  name: '',
  email: ''
})

// 使用
settings.value.theme = 'light' // 自动同步到 localStorage
```

### useStorage（自定义存储）

```typescript
import { useStorage, StorageSerializers } from '@vueuse/core'

// 自定义序列化
const complexData = useStorage('complex-key', {
  date: new Date(),
  regex: /test/g
}, undefined, {
  serializer: {
    read: (v) => {
      const data = JSON.parse(v)
      return {
        date: new Date(data.date),
        regex: new RegExp(data.regex)
      }
    },
    write: (v) => JSON.stringify({
      date: v.date.toISOString(),
      regex: v.regex.source
    })
  }
})
```

### useRefHistory（撤销/重做）

```typescript
import { ref } from 'vue'
import { useRefHistory } from '@vueuse/core'

const counter = ref(0)
const { history, undo, redo, canUndo, canRedo } = useRefHistory(counter, {
  capacity: 10, // 历史记录容量
  deep: true // 深度监听
})

counter.value++
counter.value++

undo() // counter.value === 1
redo() // counter.value === 2
```

## 浏览器 API 类

### useTitle

```typescript
import { useTitle } from '@vueuse/core'

const title = useTitle()
title.value = 'New Title' // 页面标题自动更新

// 带模板
const title = useTitle('Default Title', {
  titleTemplate: '%s | My App'
})
title.value = 'Home' // 页面标题: "Home | My App"
```

### useClipboard

```typescript
import { useClipboard } from '@vueuse/core'

const { text, copy, copied, isSupported } = useClipboard()

async function copyText(text: string) {
  try {
    await copy(text)
    console.log('Copied!')
  } catch (err) {
    console.error('Failed to copy')
  }
}
```

### useEventListener

```typescript
import { useEventListener } from '@vueuse/core'

// 监听窗口事件
useEventListener(window, 'resize', (e) => {
  console.log('Window resized')
})

// 监听元素事件
const button = ref<HTMLButtonElement>()
useEventListener(button, 'click', (e) => {
  console.log('Button clicked')
})

// 移除监听器
const cleanup = useEventListener(document, 'click', handler)
cleanup() // 手动移除
```

### useScriptTag

```typescript
import { useScriptTag } from '@vueuse/core'

const { scriptTag, load, unload } = useScriptTag(
  'https://example.com/script.js',
  () => {
    // 脚本加载完成回调
    console.log('Script loaded')
  },
  {
    manual: true, // 手动控制加载
    defer: true,
    async: true
  }
)

// 手动加载
await load()

// 卸载
unload()
```

## 传感器类

### useWindowScroll

```typescript
import { useWindowScroll } from '@vueuse/core'

const { x, y } = useWindowScroll()

// 监听滚动
watch(y, (scrollY) => {
  console.log(`Vertical scroll: ${scrollY}`)
})

// 使用行为
const { x, y, pause, resume, isActivated } = useWindowScroll({
  behavior: 'smooth',
  idle: 1000 // 1秒后进入空闲状态
})
```

### useWindowSize

```typescript
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

// 响应式使用
const isMobile = computed(() => width.value < 768)
const isTablet = computed(() => width.value >= 768 && width.value < 1024)
```

### useMouse

```typescript
import { useMouse } from '@vueuse/core'

const { x, y, sourceType } = useMouse()

// 追踪特定元素内的鼠标位置
const element = ref<HTMLElement>()
const { x, y } = useMouse({
  target: element,
  type: 'page', // 'page' | 'client'
  touch: true // 响应触摸事件
})
```

### useBattery

```typescript
import { useBattery } from '@vueuse/core'

const { charging, chargingTime, dischargingTime, level, isSupported } = useBattery()

// 显示电量
const batteryPercent = computed(() => Math.round(level.value * 100))

// 监听充电状态
watch(charging, (isCharging) => {
  if (isCharging) console.log('Charging...')
})
```

### useNetwork

```typescript
import { useNetwork } from '@vueuse/core'

const { isOnline, offlineAt, onlineAt, downlink, effectiveType, saveData } = useNetwork()

watch(isOnline, (online) => {
  if (!online) {
    showOfflineMessage()
  }
})
```

## 动画类

### useIntervalFn

```typescript
import { useIntervalFn } from '@vueuse/core'

const { pause, resume, isActive } = useIntervalFn(() => {
  console.log('Interval executed')
}, 1000, {
  immediate: true, // 立即执行
  immediateCallback: false // 不立即调用回调
})

// 暂停
pause()

// 恢复
resume()
```

### useTimeoutFn

```typescript
import { useTimeoutFn } from '@vueuse/core'

const { isPending, start, stop } = useTimeoutFn(() => {
  console.log('Timeout executed')
}, 3000)

// 提前执行
stop()
start() // 重新开始
```

### useRafFn (requestAnimationFrame)

```typescript
import { useRafFn } from '@vueuse/core'

const { pause, resume, isActive } = useRafFn((frame) => {
  // 每帧执行
  console.log(`Frame: ${frame}`)
})
```

### useTransition

```typescript
import { ref } from 'vue'
import { useTransition, TransitionPresets } from '@vueuse/core'

const source = ref(0)

// 基础过渡
const output = useTransition(source, {
  duration: 1000,
  transition: 'ease-out'
})

// 预设过渡
const bouncy = useTransition(source, {
  duration: 800,
  transition: TransitionPresets.bounce
})

// 贝塞尔曲线
const customEase = useTransition(source, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1]
})

// 数值变化
source.value = 100 // output.value 会平滑过渡到 100
```

## 工具函数类

### useDebounceFn

```typescript
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  console.log('Debounced function called')
}, 1000)

// 调用 - 1秒后执行
debouncedFn()

// 取消
debouncedFn.cancel()

// 立即执行
debouncedFn.flush()
```

### useThrottleFn

```typescript
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  console.log('Throttled function called')
}, 1000, {
  trailing: true, // 末尾执行
  leading: false // 开头不执行
})

// 1秒内多次调用只会执行一次
throttledFn()
throttledFn()
throttledFn()
```

### useDebounce (值防抖)

```typescript
import { useDebounce } from '@vueuse/core'

const input = ref('')
const debounced = useDebounce(input, 500)

// 使用：输入停止 500ms 后才会更新 debounced.value
watch(debounced, (value) => {
  // 执行搜索
  search(value)
})
```

### useThrottle (值节流)

```typescript
import { useThrottle } from '@vueuse/core'

const input = ref(0)
const throttled = useThrottle(input, 1000)

// 使用
watch(throttled, (value) => {
  // 最多每秒执行一次
  updateValue(value)
})
```

## 异步类

### useAsyncState

```typescript
import { useAsyncState } from '@vueuse/core'

const { state, isReady, isLoading, error, execute } = useAsyncState(
  // 异步函数
  async (id: number) => {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },
  // 初始状态
  { name: '', email: '' },
  {
    immediate: false, // 不立即执行
    delay: 100, // 延迟执行
    onError: (e) => console.error(e),
    onSuccess: (data) => console.log('Success', data),
    resetOnExecute: true // 每次执行前重置状态
  }
)

// 手动执行
execute(1)
```

### useFetch

```typescript
import { useFetch } from '@vueuse/core'

// 基础使用
const { data, isFetching, error } = useFetch('/api/users')

// 配置选项
const { data, execute, abort, canAbort } = useFetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John' }),
  headers: {
    'Content-Type': 'application/json'
  }
}, {
  immediate: false,
  refetch: true, // 响应式 URL 变化时自动重新获取
  timeout: 10000 // 超时
})

// 拦截器
const { data } = useFetch('/api/users', {
  beforeFetch({ options }) {
    // 添加认证 token
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token.value}`
    }
    return { options }
  },
  afterFetch({ data }) {
    // 处理响应
    return { data: JSON.parse(data) }
  },
  onFetchError(ctx) {
    // 处理错误
    console.error(ctx.error)
    return ctx
  }
})
```

## 响应式增强

### toReactive

```typescript
import { toReactive, ref } from '@vueuse/core'

const numRef = ref(0)
const reactiveNum = toReactive(numRef)

// 可以直接访问 value
console.log(reactiveNum.value) // 0
reactiveNum.value = 1

// 但也可以作为普通值使用（自动解包）
console.log(reactiveNum + 1) // 2
```

### useArray

```typescript
import { useArray } from '@vueuse/core'

const list = useArray([1, 2, 3])

list.push(4) // [1, 2, 3, 4]
list.pop() // [1, 2, 3]
list.shift() // [2, 3]
list.unshift(0) // [0, 2, 3]
list.remove(2) // [0, 3]
list.removeAt(0) // [3]
```

## 组件集成

### onClickOutside

```vue
<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const modal = ref<HTMLElement>()
const isOpen = ref(true)

onClickOutside(modal, () => {
  isOpen.value = false
})
</script>

<template>
  <div v-if="isOpen" ref="modal" class="modal">
    Click outside to close
  </div>
</template>
```

### onKeyStroke

```typescript
import { onKeyStroke } from '@vueuse/core'

// 监听特定按键
onKeyStroke('Escape', (e) => {
  closeModal()
})

// 监听多个按键
onKeyStroke(['ArrowUp', 'ArrowDown'], (e) => {
  console.log(`Pressed: ${e.key}`)
})

// 自定义目标
onKeyStroke('Enter', handler, {
  target: document.querySelector('input')
})
```

### onStartTyping

```typescript
import { onStartTyping } from '@vueuse/core'

const inputRef = ref<HTMLInputElement>()

// 当用户在可聚焦元素外开始输入时，自动聚焦到输入框
onStartTyping(() => {
  inputRef.value?.focus()
})
```

## 数学函数

### useCounter

```typescript
import { useCounter } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter(0, {
  min: 0,
  max: 10
})

inc() // 1
inc(5) // 6
dec() // 5
dec(2) // 3
set(10) // 10
reset() // 0
```

### useAverage

```typescript
import { useAverage } from '@vueuse/core'

const numbers = ref([1, 2, 3, 4, 5])
const average = useAverage(numbers) // 3
```

### useSum

```typescript
import { useSum } from '@vueuse/core'

const numbers = ref([1, 2, 3, 4, 5])
const sum = useSum(numbers) // 15
```

## 可组合函数的组合使用

### 搜索功能示例

```typescript
import { ref, computed } from 'vue'
import { useDebounce, useFetch, useLocalStorage } from '@vueuse/core'

// 搜索关键词（带防抖）
const searchKeyword = ref('')
const debouncedKeyword = useDebounce(searchKeyword, 300)

// 搜索历史（本地存储）
const searchHistory = useLocalStorage<string[]>('search-history', [])

// 搜索结果（自动请求）
const { data: results, isFetching } = useFetch(
  computed(() => `/api/search?q=${debouncedKeyword.value}`)
).json()

// 保存搜索历史
function saveSearch(keyword: string) {
  if (keyword && !searchHistory.value.includes(keyword)) {
    searchHistory.value.unshift(keyword)
    // 只保留最近 10 条
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}

watch(debouncedKeyword, (value) => {
  if (value) saveSearch(value)
})
```

## 创建自定义 Composable

### usePagination 示例

```typescript
// composables/usePagination.ts
import { ref, computed } from 'vue'

export function usePagination<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  options: {
    pageSize?: number
    immediate?: boolean
  } = {}
) {
  const { pageSize = 10, immediate = true } = options

  const page = ref(1)
  const total = ref(0)
  const items = ref<T[]>([])
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(total.value / pageSize))
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)

  async function fetch() {
    loading.value = true
    try {
      const result = await fetchFn(page.value, pageSize)
      items.value = result.data
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  function next() {
    if (hasNext.value) {
      page.value++
      fetch()
    }
  }

  function prev() {
    if (hasPrev.value) {
      page.value--
      fetch()
    }
  }

  function goTo(p: number) {
    if (p >= 1 && p <= totalPages.value) {
      page.value = p
      fetch()
    }
  }

  if (immediate) fetch()

  return {
    page,
    pageSize,
    total,
    totalPages,
    items,
    loading,
    hasNext,
    hasPrev,
    next,
    prev,
    goTo,
    refresh: fetch
  }
}
```

```typescript
// 使用
const {
  items: users,
  loading,
  page,
  totalPages,
  next,
  prev,
  goTo
} = usePagination<User>((page, pageSize) =>
  fetchUsers({ page, pageSize })
)
```

