---
title: Vue3核心概念
tags:
  - 前端
  - Vue
  - Vue3
  - 基础
created: 2026-04-27
---

# Vue3核心概念

## 一、组合式 API 设计哲学

### 为什么需要组合式 API？

Vue 2 的选项式 API（Options API）在简单场景下非常直观，但在复杂组件中存在以下问题：

1. **代码分散**：相关逻辑分散在 data、methods、computed、watch 等选项中，维护困难
2. **复用困难**：mixins 容易导致命名冲突、来源不清晰
3. **类型推断差**：TypeScript 支持不够友好
4. **上下文丢失**：函数内的 this 指向可能不符合预期

**组合式 API 的优势：**
- 逻辑内聚：相关代码放在一起
- 灵活复用：组合式函数可以任意组合
- 类型友好：天然适合 TypeScript
- 树摇友好：未使用的代码可以被优化掉

### 两种 API 风格对比

| 特性 | 选项式 API | 组合式 API |
|------|-----------|-----------|
| 学习曲线 | 平缓 | 有一定坡度 |
| 代码组织 | 按选项分类 | 按功能组织 |
| TS 支持 | 一般 | 优秀 |
| 复用方式 | mixins | composables |
| 适用场景 | 中小型组件 | 大型/复杂组件 |
| `<script setup>` | 不支持 | 原生支持 |

---

## 二、setup 函数详解

### 基础用法

```javascript
import { ref, reactive, computed, toRefs } from 'vue'

export default {
  name: 'MyComponent',
  
  // props 是响应式的，但不要直接解构
  props: {
    title: String,
    count: {
      type: Number,
      default: 0
    }
  },
  
  // context 包含 attrs、slots、emit、expose
  setup(props, context) {
    // ❌ 直接解构 props 会丢失响应式！
    // const { title, count } = props
    
    // ✅ 使用 toRefs 保持响应式
    const { title, count } = toRefs(props)
    
    // 响应式状态
    const localCount = ref(count.value)
    
    // 计算属性
    const doubleCount = computed(() => localCount.value * 2)
    
    // 方法
    const increment = () => {
      localCount.value++
    }
    
    // 生命周期
    onMounted(() => {
      console.log('Component mounted!')
    })
    
    // 暴露给模板
    return {
      title,
      localCount,
      doubleCount,
      increment
    }
  }
}
```

### setup 执行时机

**调用顺序：**
1. `beforeCreate` 之前调用（Vue 3 中已废弃，直接用 setup）
2. 组件实例创建之前
3. 此时 `this` 不指向组件实例（为 undefined）
4. 只能访问 props、attrs、slots、emit

**不能在 setup 中访问的：**
- data
- computed
- methods
- this（组件实例）

### context 对象详解

```javascript
setup(props, context) {
  // 1. attrs - 非 props 的属性（非响应式对象）
  console.log(context.attrs.id)
  console.log(context.attrs.class)
  
  // 2. slots - 插槽（非响应式对象）
  console.log(context.slots.default?.())
  console.log(context.slots.header?.())
  
  // 3. emit - 触发事件（函数）
  context.emit('update', { value: 123 })
  
  // 4. expose - 暴露给父组件的属性/方法
  context.expose({
    publicMethod: () => console.log('public'),
    publicValue: ref(42)
  })
}
```

---

## 三、`<script setup>` 语法糖完全指南

### 基础语法

```vue
<script setup>
// 直接导入，不需要注册
import { ref, computed, onMounted } from 'vue'
import MyComponent from './MyComponent.vue'
import { useRouter } from 'vue-router'

// 响应式状态
const count = ref(0)
const router = useRouter()

// 计算属性
const double = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('Mounted!')
})

// 顶层 await - 组件会变为异步组件
const post = await fetch('/api/post/1').then(res => res.json())
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">+1</button>
    <!-- 导入的组件自动注册 -->
    <MyComponent />
  </div>
</template>
```

### defineProps - 声明 Props

```vue
<script setup>
// 方式一：运行时声明（简单场景）
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
    required: true,
    validator: (value) => value >= 0
  }
})

// 方式二：TypeScript 类型声明（推荐）
interface Props {
  title?: string
  count: number
  list: string[]
  user?: {
    id: number
    name: string
  }
}

const props = defineProps<Props>()

// 方式三：带默认值的类型声明（Vue 3.3+）
const props = withDefaults(defineProps<Props>(), {
  title: 'Default Title',
  list: () => ['a', 'b', 'c'] // 对象/数组需要函数返回
})
</script>
```

### defineEmits - 声明事件

```vue
<script setup>
// 方式一：数组形式
const emit = defineEmits(['change', 'update', 'delete'])

// 方式二：对象形式（带验证）
const emit = defineEmits({
  change: (id) => typeof id === 'number',
  update: (value) => true,
  delete: (id, reason) => typeof id === 'number'
})

// 方式三：TypeScript 类型声明（推荐）
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string, timestamp: number): void
  (e: 'delete', id: number, reason: string): void
}>()

// 使用
function handleClick() {
  emit('change', 123)
  emit('update', 'hello', Date.now())
}
</script>
```

### defineExpose - 暴露给父组件

```vue
<script setup>
import { ref } from 'vue'

const internalValue = ref('secret')
const publicValue = ref('public')

function internalMethod() {
  console.log('internal')
}

function publicMethod() {
  console.log('public')
}

// 只暴露指定的属性和方法
defineExpose({
  publicValue,
  publicMethod
})
</script>
```

父组件使用：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = ref(null)

onMounted(() => {
  console.log(childRef.value.publicValue) // ✅ 可以访问
  console.log(childRef.value.internalValue) // ❌ undefined
  childRef.value.publicMethod() // ✅ 可以调用
})
</script>

<template>
  <Child ref="childRef" />
</template>
```

### defineModel - 简化 v-model（Vue 3.4+）

**之前的写法：**

```vue
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

**新的写法（defineModel）：**

```vue
<script setup>
// 单行搞定！
const modelValue = defineModel()

// 带类型和选项
const modelValue = defineModel<string>({
  required: true,
  default: 'hello'
})

// 多个 v-model
const firstName = defineModel('firstName', { default: '' })
const lastName = defineModel('lastName', { default: '' })
</script>

<template>
  <input v-model="modelValue" />
</template>
```

---

## 四、响应式基础：ref 详解

### ref 的核心概念

ref 用于创建一个**响应式的引用对象**，它包含一个 `.value` 属性指向内部的值。

**为什么需要 .value？**
- JavaScript 中基本类型（Number、String、Boolean）是按值传递的
- 没有办法追踪原始值的变化
- 需要用一个对象包装，通过属性访问器拦截读写操作

```javascript
// ref 内部实现原理（简化版）
function ref(value) {
  return {
    __v_isRef: true,
    get value() {
      track(this, 'get', 'value') // 依赖收集
      return value
    },
    set value(newValue) {
      if (hasChanged(newValue, value)) {
        value = newValue
        trigger(this, 'set', 'value') // 触发更新
      }
    }
  }
}
```

### ref 的各种用法

```javascript
import { ref, shallowRef, triggerRef, customRef } from 'vue'

// 1. 基本类型 ref
const count = ref(0)
const message = ref('Hello Vue3')
const isActive = ref(false)

// 2. 对象 ref（内部会转成 reactive！）
const user = ref({
  name: 'Alice',
  age: 25,
  address: {
    city: 'Beijing'
  }
})

// ✅ 可以直接修改嵌套属性（响应式）
user.value.name = 'Bob'
user.value.address.city = 'Shanghai'

// 3. 数组 ref
const list = ref([1, 2, 3])

// ✅ 所有数组方法都支持响应式
list.value.push(4)
list.value.pop()
list.value[0] = 100

// 4. shallowRef - 浅层 ref（只有 .value 赋值才响应）
const bigObject = shallowRef({
  data: /* 大量数据 */,
  metadata: /* ... */
})

// ❌ 这样不会触发更新
bigObject.value.data = newData

// ✅ 这样才会触发更新
bigObject.value = { ...bigObject.value, data: newData }

// 或者手动触发
triggerRef(bigObject)
```

### ref 自动解包场景

**在模板中自动解包（不需要 .value）：**

```vue
<script setup>
const count = ref(0)
</script>

<template>
  <!-- ✅ 自动解包，不需要 .value -->
  <p>{{ count }}</p>
  <button @click="count++">+1</button>
</template>
```

**在 reactive 中自动解包：**

```javascript
const count = ref(0)
const state = reactive({
  count, // 自动解包
  nested: {
    value: ref(42) // 嵌套也会解包
  }
})

// ✅ 不需要 .value
console.log(state.count) // 0
console.log(state.nested.value) // 42

state.count++ // ✅ 正常工作
```

**不会自动解包的场景：**

```javascript
// ❌ 从数组访问不会解包
const state = reactive([ref(0), ref(1)])
console.log(state[0].value) // 需要 .value

// ❌ 解构后不会解包
const count = ref(0)
const { value } = count // 这是普通的 JS 解构
console.log(value) // 0，但不是响应式的
```

### toRef / toRefs - 保持响应式解构

```javascript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue3',
  user: {
    id: 1,
    name: 'Alice'
  }
})

// ❌ 普通解构丢失响应式
const { count, name } = state // 这两个变量不是响应式的

// ✅ toRefs 解构保持响应式
const { count, name } = toRefs(state)
console.log(count.value) // 0
count.value++ // ✅ 会触发更新

// ✅ toRef 提取单个属性
const userId = toRef(state.user, 'id')
userId.value = 2 // ✅ 会更新原对象
```

---

## 五、响应式基础：reactive 详解

### reactive vs ref 对比

| 特性 | reactive | ref |
|------|----------|-----|
| 适用类型 | 对象/数组/Map/Set | 任意类型 |
| 访问方式 | 直接访问属性 | 需要 .value |
| 响应式深度 | 默认深层 | 对象会转 reactive |
| 替换整个对象 | 会丢失代理引用 | 不会 |
| 解构 | 会丢失响应式 | 同样会丢失 |
| TS 支持 | 良好 | 良好 |

**选择建议：**
- 基本类型 → ref
- 单个对象 → ref 或 reactive 都可以
- 多个相关属性组成的对象 → reactive
- 需要替换整个对象 → ref
- 不确定选什么 → 优先用 ref

### reactive 常见用法

```javascript
import { reactive, readonly, shallowReactive } from 'vue'

// 1. 普通对象
const state = reactive({
  count: 0,
  name: 'Vue3',
  user: {
    id: 1,
    name: 'Alice'
  },
  tags: ['js', 'vue']
})

// ✅ 所有层级都是响应式的
state.count++
state.user.name = 'Bob'
state.tags.push('ts')

// 2. 数组
const list = reactive([1, 2, 3])
list.push(4) // ✅ 响应式
list[0] = 100 // ✅ Vue3 支持索引修改！
list.length = 5 // ✅ 也支持 length 修改

// 3. Map/Set
const map = reactive(new Map())
map.set('key', 'value') // ✅ 响应式
console.log(map.get('key'))

const set = reactive(new Set())
set.add(1) // ✅ 响应式

// 4. 只读代理
const original = reactive({ count: 0 })
const copy = readonly(original)
copy.count++ // ❌ 开发环境警告，不生效

// 5. 浅层 reactive（只有第一层响应式）
const shallowState = shallowReactive({
  foo: 1,
  nested: {
    bar: 2 // ❌ 这层不是响应式的！
  }
})

shallowState.foo++ // ✅ 响应式
shallowState.nested.bar++ // ❌ 不会触发更新
```

### reactive 的局限性

**1. 不能直接替换整个对象**

```javascript
let state = reactive({ count: 0 })

// ❌ 这样会丢失响应式引用！
state = reactive({ count: 1 })

// ✅ 用 ref 包装对象
const state = ref({ count: 0 })
state.value = { count: 1 } // 正常工作
```

**2. 解构会丢失响应式**

```javascript
const state = reactive({ count: 0, name: 'Vue' })

// ❌ 解构后不是响应式的
const { count, name } = state

// ✅ 用 toRefs
const { count, name } = toRefs(state)
```

**3. 对基本类型无效**

```javascript
// ❌ 不能用 reactive 包装基本类型
const count = reactive(0) // 没有效果
```

---

## 六、computed 计算属性

### 基础用法

```javascript
import { ref, computed } from 'vue'

const count = ref(1)

// 只读 computed
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value) // 2
count.value = 2
console.log(doubleCount.value) // 4

// 可写 computed
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (newValue) => {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

fullName.value = 'John Doe' // 会触发 setter
```

### computed 的缓存特性

**computed vs 方法的核心区别：缓存！**

```javascript
const count = ref(0)

// computed - 有缓存，只有依赖变化才重新计算
const doubleCount = computed(() => {
  console.log('Computed executed!')
  return count.value * 2
})

console.log(doubleCount.value) // 执行一次，输出 0
console.log(doubleCount.value) // 不执行，直接返回缓存 0
console.log(doubleCount.value) // 不执行

count.value = 1 // 依赖变化
console.log(doubleCount.value) // 重新执行，输出 2

// 方法 - 每次调用都执行
function getDouble() {
  console.log('Function executed!')
  return count.value * 2
}

console.log(getDouble()) // 执行
console.log(getDouble()) // 执行
console.log(getDouble()) // 执行
```

### computed 最佳实践

**✅ 正确用法：**
- getter 应该是纯函数（相同输入产生相同输出）
- 不要在 getter 中执行副作用（API 调用、修改其他状态）
- 依赖应该是响应式的

**❌ 错误用法：**

```javascript
// ❌ 有副作用
const badComputed = computed(() => {
  fetch('/api/data') // 不要在 computed 中调用 API
  count.value++ // 不要修改其他状态
  return value
})

// ❌ 依赖非响应式值
let externalValue = 0
const notReactive = computed(() => externalValue) // externalValue 变化不会触发更新
```

---

## 七、watch 侦听器

### 四种侦听源

```javascript
import { ref, reactive, watch, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')
const state = reactive({
  count: 0,
  user: { name: 'Alice' }
})

// 1. 侦听单个 ref
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})

// 2. 侦听多个源（数组形式）
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log(`count: ${oldCount} -> ${newCount}`)
  console.log(`name: ${oldName} -> ${newName}`)
})

// 3. 侦听 getter 函数
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`state.count: ${oldVal} -> ${newVal}`)
  }
)

// 4. 侦听整个 reactive 对象（自动 deep）
watch(state, (newVal, oldVal) => {
  // 注意：newVal 和 oldVal 是同一个对象！
  console.log('State changed')
})
```

### 配置选项详解

```javascript
watch(source, callback, {
  // 1. deep: 深度侦听（嵌套对象变化也能检测到）
  // 默认：reactive 自动 deep: true，ref 默认为 false
  deep: true,
  
  // 2. immediate: 立即执行（创建时就调用一次 callback）
  // 默认：false
  immediate: true,
  
  // 3. flush: 回调执行时机
  // 'pre' - 默认，在组件更新前执行
  // 'sync' - 同步执行（慎用，可能影响性能）
  // 'post' - 在组件更新后执行，可以访问更新后的 DOM
  flush: 'post',
  
  // 4. once: 只执行一次
  once: false
})
```

### watchEffect - 自动追踪依赖

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')

// watchEffect 会自动追踪其内部使用的所有响应式依赖
watchEffect((onCleanup) => {
  // 这里用到的所有响应式变量都会被追踪
  console.log(`count: ${count.value}, name: ${name.value}`)
  
  // 清理函数：依赖变化或组件卸载时执行
  onCleanup(() => {
    console.log('Cleanup!')
  })
})

count.value++ // 触发执行
name.value = 'Vue3' // 也会触发执行
```

### watch vs watchEffect 对比

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 依赖追踪 | 手动指定 | 自动追踪 |
| 获取旧值 | ✅ 可以 | ❌ 不能 |
| 惰性执行 | ✅ 默认是 | ❌ 默认立即执行 |
| 异步清理 | ✅ 支持 | ✅ 支持 |
| 适用场景 | 需要精确控制依赖 | 自动追踪所有依赖 |

### 实用场景：防抖 watch

```javascript
import { ref, watch, onUnmounted } from 'vue'

const searchText = ref('')
const results = ref([])
const loading = ref(false)

let timeoutId = null

async function search(query) {
  loading.value = true
  try {
    const res = await fetch(`/api/search?q=${query}`)
    results.value = await res.json()
  } finally {
    loading.value = false
  }
}

watch(searchText, (newText) => {
  // 清除上一个定时器
  if (timeoutId) clearTimeout(timeoutId)
  
  // 300ms 防抖
  timeoutId = setTimeout(() => {
    if (newText) search(newText)
  }, 300)
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
```

---

## 八、生命周期钩子完整指南

### 所有钩子对比表

| Vue 2 选项式 | Vue 3 组合式 | 调用时机 | 常见用途 |
|-------------|-------------|---------|---------|
| `beforeCreate` | ❌（使用 setup） | 实例创建前 | - |
| `created` | ❌（使用 setup） | 实例创建后，挂载前 | 初始化数据、调用 API |
| `beforeMount` | `onBeforeMount` | 首次渲染前 | - |
| `mounted` | `onMounted` | 首次渲染后 | DOM 操作、初始化第三方库 |
| `beforeUpdate` | `onBeforeUpdate` | 响应式数据变化，重新渲染前 | - |
| `updated` | `onUpdated` | 重新渲染后 | 访问更新后的 DOM |
| `beforeUnmount` | `onBeforeUnmount` | 组件卸载前 | 清理定时器、取消订阅 |
| `unmounted` | `onUnmounted` | 组件卸载后 | - |
| `errorCaptured` | `onErrorCaptured` | 捕获子孙组件错误 | 错误上报、降级 UI |
| `renderTracked` | `onRenderTracked` | 渲染时收集到依赖 | 调试 |
| `renderTriggered` | `onRenderTriggered` | 依赖变化触发重渲染 | 调试 |
| `activated` | `onActivated` | KeepAlive 组件激活 | 恢复状态、重新计算 |
| `deactivated` | `onDeactivated` | KeepAlive 组件失活 | 清理、暂停 |

### 生命周期执行顺序

**单个组件：**
```
setup
↓
onBeforeMount
↓
[ 组件渲染 ]
↓
onMounted
↓
[ 数据变更 ]
  ↓
  onBeforeUpdate
  ↓
  [ 重新渲染 ]
  ↓
  onUpdated
↓
[ 组件卸载 ]
  ↓
  onBeforeUnmount
  ↓
  onUnmounted
```

**父子组件：**
```
父 setup
  ↓
子 setup
  ↓
子 onBeforeMount
  ↓
父 onBeforeMount
  ↓
[ 子渲染 ]
  ↓
子 onMounted
  ↓
父 onMounted
```

### 常用钩子最佳实践

**onMounted - DOM 操作和第三方库初始化：**

```javascript
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  // ✅ 此时 DOM 已经渲染完成
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({ /* 配置 */ })
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

function handleResize() {
  chartInstance?.resize()
}

onBeforeUnmounted(() => {
  // ✅ 清理资源
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
```

---

## 九、Provide / Inject 依赖注入

### 基础用法

**父组件提供数据：**

```javascript
import { provide, ref, readonly } from 'vue'

// 1. 提供普通值
provide('message', 'Hello from parent')

// 2. 提供响应式数据
const count = ref(0)
provide('count', count)

// 3. 提供只读的响应式数据（推荐，防止子组件意外修改）
provide('count', readonly(count))

// 4. 提供方法
function increment() {
  count.value++
}
provide('increment', increment)

// 5. 提供整个对象
const state = reactive({
  user: null,
  theme: 'light'
})
provide('appState', state)
```

**子组件注入：**

```javascript
import { inject } from 'vue'

// 1. 简单注入
const message = inject('message')

// 2. 带默认值
const theme = inject('theme', 'light')

// 3. 注入响应式数据
const count = inject('count')
console.log(count.value) // 0

// 4. 注入方法
const increment = inject('increment')
```

### Symbol 作为 key（避免命名冲突）

```javascript
// keys.ts - 统一管理 key
export const ThemeKey = Symbol('theme')
export const UserKey = Symbol('user')
export const RouterKey = Symbol('router')
```

```javascript
// 父组件
import { provide } from 'vue'
import { ThemeKey, UserKey } from './keys'

provide(ThemeKey, 'dark')
provide(UserKey, ref({ name: 'Alice' }))
```

```javascript
// 子组件
import { inject } from 'vue'
import { ThemeKey, UserKey } from './keys'

const theme = inject(ThemeKey)
const user = inject(UserKey)
```

### 类型安全的 Provide/Inject

```typescript
// types.ts
import type { InjectionKey, Ref } from 'vue'

export interface User {
  id: number
  name: string
  email: string
}

export const UserKey: InjectionKey<Ref<User>> = Symbol('user')
```

```typescript
// 父组件
import { provide, ref } from 'vue'
import { UserKey, type User } from './types'

const user = ref<User>({ id: 1, name: 'Alice', email: 'a@b.com' })
provide(UserKey, user) // ✅ 类型正确
```

```typescript
// 子组件
import { inject } from 'vue'
import { UserKey } from './types'

const user = inject(UserKey) // 类型推断为 Ref<User> | undefined
```

---

## 十、组合式函数（Composables）

### 什么是组合式函数？

**组合式函数是利用 Vue 响应式 API 封装的、可复用的逻辑单元。**

命名约定：**use 开头的驼峰命名

### 示例 1：useCounter

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  // 状态
  const count = ref(initialValue)
  
  // 计算属性
  const double = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  
  // 方法
  const increment = (step = 1) => {
    count.value += step
  }
  
  const decrement = (step = 1) => {
    count.value -= step
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  // 暴露给使用者
  return {
    count,
    double,
    isEven,
    increment,
    decrement,
    reset
  }
}
```

**使用：**

```vue
<script setup>
import { useCounter } from './composables/useCounter'

const { count, double, isEven, increment, reset } = useCounter(10)
</script>

<template>
  <p>Count: {{ count }}</p>
  <p>Double: {{ double }}</p>
  <button @click="increment()">+1</button>
  <button @click="increment(5)">+5</button>
  <button @click="reset">Reset</button>
</template>
```

### 示例 2：useFetch 异步请求

```javascript
// composables/useFetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const status = ref('idle') // idle, loading, success, error
  
  async function fetchData() {
    // 重置状态
    loading.value = true
    status.value = 'loading'
    error.value = null
    
    try {
      const response = await fetch(toValue(url), options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      data.value = await response.json()
      status.value = 'success'
    } catch (e) {
      error.value = e
      status.value = 'error'
    } finally {
      loading.value = false
    }
  }
  
  // 如果 url 是响应式的，自动重新请求
  if (typeof url === 'function' || isRef(url)) {
    watchEffect(fetchData)
  } else {
    fetchData()
  }
  
  return {
    data,
    error,
    loading,
    status,
    refetch: fetchData
  }
}
```

**使用：**

```vue
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from './composables/useFetch'

const userId = ref(1)

// url 是响应式的，userId 变化时自动重新请求
const { data: user, loading, error, refetch } = useFetch(
  computed(() => `/api/users/${userId.value}`)
)
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <h2>{{ user?.name }}</h2>
    <p>{{ user?.email }}</p>
  </div>
  <button @click="userId++">Next User</button>
  <button @click="refetch">Refresh</button>
</template>
```

### 组合式函数最佳实践

1. **命名规范**：use 开头，驼峰命名（useXxx）
2. **参数处理**：支持 Ref 或原始值，使用 `toValue()` 统一处理
3. **返回对象**：保持返回结构的一致性，通常返回对象而非数组
4. **副作用清理**：在内部管理副作用的清理
5. **类型安全**：为 TypeScript 用户提供良好的类型定义
6. **单一职责**：每个组合式函数只做一件事

---

## 十一、常见问题与最佳实践

### 1. 什么时候用 ref，什么时候用 reactive？

**✅ 用 ref：**
- 基本类型（number, string, boolean）
- 需要替换整个对象时
- 不确定是什么类型，先写 ref

**✅ 用 reactive：**
- 有多个相关属性的对象（如表单数据）
- 深层嵌套的对象，需要全部响应式

**❌ 不要混用：**
```javascript
// ❌ 这样写很混乱
const count = ref(0)
const state = reactive({ count }) // count 会被解包，失去引用关联
```

### 2. 响应式数据解构的正确姿势

```javascript
const state = reactive({ count: 0, name: 'Vue' })

// ❌ 错误：丢失响应式
const { count, name } = state

// ✅ 正确：使用 toRefs
const { count, name } = toRefs(state)
count.value++ // ✅ 正常工作

// ✅ 正确：只需要单个属性时用 toRef
const count = toRef(state, 'count')
```

### 3. 避免过度使用响应式

```javascript
// ❌ 不需要响应式的数据也包一层
const config = reactive({
  apiBaseUrl: 'https://api.example.com',
  timeout: 30000
})

// ✅ 直接用常量或普通对象
const CONFIG = {
  apiBaseUrl: 'https://api.example.com',
  timeout: 30000
} as const

// ✅ 或者 markRaw
const state = reactive({
  config: markRaw({ /* 大型配置对象 */ })
})
```

### 4. 避免在 watch 中做太多事

```javascript
// ❌ 一个 watch 做太多事情
watch([a, b, c], () => {
  updateX()
  updateY()
  callApi()
  // ... 更多逻辑
})

// ✅ 拆分成多个 watch，职责单一
watch(a, updateX)
watch(b, updateY)
watch(c, callApi)
```

### 5. 合理使用 shallowRef/shallowReactive 优化性能

```javascript
// ❌ 大型列表不需要深度响应式时用了 ref
const bigList = ref([/* 10000 项 */])

// ✅ 用 shallowRef 减少代理开销
const bigList = shallowRef([/* 10000 项 */])

// 需要更新时替换整个数组
bigList.value = [...newItems]
```

### 6. 组件 props 处理原则

```javascript
// ❌ 直接修改 props（违反单向数据流）
const props = defineProps(['user'])
props.user.name = 'New Name' // ❌ 不要这样做！

// ✅ 使用 v-model 或 emit 事件
const emit = defineEmits(['update:user'])
emit('update:user', newUser)

// ✅ 或者用本地副本
const localUser = ref({ ...props.user })
```

### 7. 组合式函数命名约定

```javascript
// ✅ use 开头
function useMouse() { /* ... */ }
function useLocalStorage() { /* ... */ }
function useDebounce() { /* ... */ }

// ❌ 不要用其他前缀
function getMouse() { /* ... */ } // 容易混淆
function withMouse() { /* ... */ } // HOC 风格
```

### 8. 组件逻辑组织建议

**按功能组织代码（推荐）：**

```javascript
<script setup>
// ============= 导入部分 =============
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../stores'

// ============= 响应式状态 =============
const count = ref(0)
const searchText = ref('')
const loading = ref(false)

// ============= 计算属性 =============
const doubleCount = computed(() => count.value * 2)
const filteredList = computed(() => /* ... */)

// ============= 方法 =============
function increment() {
  count.value++
}

async function fetchData() {
  loading.value = true
  try {
    // ...
  } finally {
    loading.value = false
  }
}

// ============= watch =============
watch(searchText, debounceSearch)

// ============= 生命周期 =============
onMounted(fetchData)
</script>
```

**❌ 不要按 API 类型分类（如把所有 ref 放一起，所有 computed 放一起），这样相关逻辑还是分散的。**

---

## 十二、性能优化技巧

### 1. 合理使用 shallowRef/shallowReactive

对于大型对象/数组，如果只需要整体替换的响应性，可以使用浅层 API 减少代理开销。

### 2. 避免不必要的 watch

```javascript
// ❌ 可以用 computed 的时候不要用 watch
watch(firstName, () => {
  fullName.value = `${firstName.value} ${lastName.value}`
})

// ✅ 用 computed
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### 3. 长列表优化

```javascript
// ❌ 渲染 10000 项，没有优化
<div v-for="item in bigList" :key="item.id">
  {{ item.name }}
</div>

// ✅ 使用虚拟滚动
import { RecycleScroller } from 'vue-virtual-scroller'

<RecycleScroller
  class="scroller"
  :items="bigList"
  :item-size="50"
  key-field="id"
  v-slot="{ item }"
>
  <div>{{ item.name }}</div>
</RecycleScroller>
```

### 4. v-memo 缓存模板

```vue
<!-- 只有当 item.id 或 selected 变化时才重新渲染 -->
<div v-memo="[item.id, selected]">
  <span>{{ item.name }}</span>
  <!-- 复杂的渲染内容 -->
</div>
```

### 5. 组件懒加载

```javascript
// ❌ 一次性导入所有组件
import HeavyComponent from './HeavyComponent.vue'

// ✅ 动态导入，按需加载
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// ✅ 带加载状态和错误处理
const HeavyComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200, // 延迟显示 loading
  timeout: 10000 // 超时时间
})
```

---

## 十三、调试技巧

### 1. watch 调试

```javascript
watch(source, callback, {
  onTrack(e) {
    // 触发依赖收集时调用
    console.log('Tracked:', e.target, e.key, e.type)
  },
  onTrigger(e) {
    // 触发更新时调用
    console.log('Triggered:', e.target, e.key, e.newValue, e.oldValue)
  }
})
```

### 2. 渲染调试钩子

```javascript
onRenderTracked((e) => {
  console.log('Render tracked:', e)
})

onRenderTriggered((e) => {
  console.log('Render triggered:', e)
})
```

### 3. Vue DevTools

- 检查组件树和 props
- 查看响应式状态变化
- 时间旅行调试
- 性能面板分析渲染时间

---

## 总结

**组合式 API 的核心价值：**

1. **更好的逻辑复用** - 通过组合式函数实现，替代 mixins
2. **更灵活的代码组织** - 相关逻辑放在一起，而非分散在选项中
3. **更好的类型推断** - 天然适合 TypeScript
4. **更小的生产包体积** - 模板和 `<script setup>` 配合更高效

**学习路径建议：**

1. 先掌握基础：ref, reactive, computed, watch
2. 然后学习：生命周期、`<script setup>` 语法糖
3. 进阶学习：组合式函数封装、Provide/Inject
4. 深入理解：响应式原理源码、性能优化技巧

**最重要的是多写代码，在实践中体会组合式 API 的优势！**
