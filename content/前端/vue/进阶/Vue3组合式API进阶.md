---
title: Vue3组合式API进阶
tags:
  - 前端
  - Vue
  - Vue3
  - 组合式API
created: 2026-04-27
---

# Vue3组合式API进阶

## 响应式进阶

### shallowRef

```javascript
import { shallowRef } from 'vue'

const state = shallowRef({ count: 0 })

// 不会触发更新
state.value.count = 1

// 会触发更新
state.value = { count: 1 }
```

### shallowReactive

```javascript
import { shallowReactive } from 'vue'

const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 更改状态的自有 property 是响应式的
state.foo++

// 嵌套对象不是响应式的
state.nested.bar++ // 非响应式
```

### readonly

```javascript
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

original.count++ // 正常工作
copy.count++ // 警告: "Set operation on key 'count' failed: target is readonly."
```

### toRef / toRefs

```javascript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  foo: 1,
  bar: 2
})

// toRef - 创建单个 ref
const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3

// toRefs - 创建多个 ref
const { foo, bar } = toRefs(state)
```

## watch 进阶用法

### watchEffect

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

count.value++
// -> logs 1
```

### 停止侦听器

```javascript
const stop = watchEffect(() => {})

// 停止
stop()
```

### 清理副作用

```javascript
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value)
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前未完成的请求
  onCleanup(cancel)
  data.value = await response
})
```

### watch 多个源

```javascript
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})
```

### 深层侦听器

```javascript
const state = reactive({ count: 0 })

watch(
  () => state,
  (newValue, oldValue) => {},
  { deep: true }
)
```

### 立即执行

```javascript
watch(
  source,
  (newValue, oldValue) => {},
  { immediate: true }
)
```

## 自定义 Hooks

### useCounter

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const double = computed(() => count.value * 2)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    double,
    increment,
    decrement,
    reset
  }
}

// 使用
<script setup>
import { useCounter } from './useCounter'

const { count, double, increment, decrement, reset } = useCounter(10)
</script>
```

### useFetch

```javascript
// useFetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    data.value = null
    error.value = null
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    watchEffect(doFetch)
  } else {
    doFetch()
  }

  return { data, error }
}
```

### useDebounce

```javascript
// useDebounce.js
import { ref, watch } from 'vue'

export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  
  let timeout
  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  
  return debouncedValue
}
```

