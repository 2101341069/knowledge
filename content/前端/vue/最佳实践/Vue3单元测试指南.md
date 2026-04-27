---
title: Vue3单元测试指南
tags:
  - 前端
  - Vue
  - Vue3
  - 单元测试
  - Vitest
created: 2026-04-27
---

# Vue3单元测试指南

## 环境配置

### 安装依赖

```bash
npm install -D vitest @vue/test-utils @vitejs/plugin-vue happy-dom
```

### vite.config.ts 配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### package.json 脚本

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 基础组件测试

### 测试渲染内容

```vue
<!-- components/HelloWorld.vue -->
<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'

defineProps<{
  msg: string
}>()

const count = ref(0)
</script>
```

```typescript
// components/__tests__/HelloWorld.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Hello Vitest' }
    })
    expect(wrapper.text()).toContain('Hello Vitest')
  })

  it('renders with props', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test Message' }
    })
    expect(wrapper.find('h1').text()).toBe('Test Message')
  })
})
```

### 测试用户交互

```typescript
describe('HelloWorld', () => {
  it('updates count when button is clicked', async () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test' }
    })

    expect(wrapper.find('button').text()).toContain('count is: 0')

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').text()).toContain('count is: 1')

    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').text()).toContain('count is: 3')
  })
})
```

## Props 测试

### Props 验证

```vue
<!-- components/PropsComponent.vue -->
<script setup>
const props = withDefaults(defineProps<{
  title: string
  count?: number
  disabled?: boolean
  items?: string[]
}>(), {
  count: 0,
  disabled: false,
  items: () => []
})
</script>
```

```typescript
// components/__tests__/PropsComponent.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropsComponent from '../PropsComponent.vue'

describe('PropsComponent', () => {
  it('renders with required props', () => {
    const wrapper = mount(PropsComponent, {
      props: {
        title: 'Test Title'
      }
    })
    expect(wrapper.props('title')).toBe('Test Title')
  })

  it('uses default props', () => {
    const wrapper = mount(PropsComponent, {
      props: {
        title: 'Test'
      }
    })
    expect(wrapper.props('count')).toBe(0)
    expect(wrapper.props('disabled')).toBe(false)
    expect(wrapper.props('items')).toEqual([])
  })

  it('accepts all props', () => {
    const wrapper = mount(PropsComponent, {
      props: {
        title: 'Test',
        count: 10,
        disabled: true,
        items: ['a', 'b', 'c']
      }
    })
    expect(wrapper.props('count')).toBe(10)
    expect(wrapper.props('disabled')).toBe(true)
    expect(wrapper.props('items')).toEqual(['a', 'b', 'c'])
  })
})
```

## Emits 测试

### 测试自定义事件

```vue
<!-- components/EmitComponent.vue -->
<script setup>
const emit = defineEmits<{
  (e: 'submit', data: { name: string; email: string }): void
  (e: 'cancel'): void
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = defineModel<string>()

function handleSubmit() {
  emit('submit', { name: 'John', email: 'john@example.com' })
}
</script>

<template>
  <button @click="handleSubmit">Submit</button>
  <button @click="emit('cancel')">Cancel</button>
  <input v-model="modelValue" />
</template>
```

```typescript
// components/__tests__/EmitComponent.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmitComponent from '../EmitComponent.vue'

describe('EmitComponent', () => {
  it('emits submit event with data', async () => {
    const wrapper = mount(EmitComponent)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')[0]).toEqual([
      { name: 'John', email: 'john@example.com' }
    ])
  })

  it('emits cancel event', async () => {
    const wrapper = mount(EmitComponent)

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(EmitComponent)
    const input = wrapper.find('input')

    await input.setValue('test value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
  })
})
```

## 响应式状态测试

```typescript
import { describe, it, expect } from 'vitest'
import { ref, reactive, computed, nextTick } from 'vue'

describe('Reactivity', () => {
  it('ref updates', () => {
    const count = ref(0)
    expect(count.value).toBe(0)

    count.value++
    expect(count.value).toBe(1)
  })

  it('reactive updates', () => {
    const state = reactive({ count: 0 })
    expect(state.count).toBe(0)

    state.count++
    expect(state.count).toBe(1)
  })

  it('computed updates', () => {
    const count = ref(0)
    const double = computed(() => count.value * 2)

    expect(double.value).toBe(0)

    count.value = 5
    expect(double.value).toBe(10)
  })
})
```

## Composables 测试

### useCounter 测试

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const double = computed(() => count.value * 2)

  const increment = (step = 1) => {
    count.value += step
  }

  const decrement = (step = 1) => {
    count.value -= step
  }

  const reset = () => {
    count.value = initialValue
  }

  return { count, double, increment, decrement, reset }
}
```

```typescript
// composables/__tests__/useCounter.spec.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('increments', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
    increment(5)
    expect(count.value).toBe(6)
  })

  it('decrements', () => {
    const { count, decrement } = useCounter(10)
    decrement()
    expect(count.value).toBe(9)
    decrement(5)
    expect(count.value).toBe(4)
  })

  it('resets', () => {
    const { count, increment, reset } = useCounter(5)
    increment(5)
    expect(count.value).toBe(10)
    reset()
    expect(count.value).toBe(5)
  })

  it('calculates double', () => {
    const { count, double, increment } = useCounter(0)
    expect(double.value).toBe(0)
    increment(5)
    expect(double.value).toBe(10)
  })
})
```

### useFetch 测试

```typescript
// composables/__tests__/useFetch.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { useFetch } from '../useFetch'

// Mock fetch
global.fetch = vi.fn()

describe('useFetch', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { data, loading, error } = useFetch('/api/test')

    expect(loading.value).toBe(true)
    expect(data.value).toBe(null)

    // Wait for fetch to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(data.value).toEqual(mockData)
  })

  it('handles fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    const { data, loading, error } = useFetch('/api/test')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value.message).toBe('Network error')
    expect(data.value).toBe(null)
  })
})
```

## Pinia Store 测试

```typescript
// stores/__tests__/counter.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    expect(store.name).toBe('Counter')
  })

  it('increments', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
    store.increment(5)
    expect(store.count).toBe(6)
  })

  it('decrements', () => {
    const store = useCounterStore()
    store.increment(10)
    store.decrement()
    expect(store.count).toBe(9)
  })

  it('resets', () => {
    const store = useCounterStore()
    store.increment(10)
    store.reset()
    expect(store.count).toBe(0)
  })

  it('computes double', () => {
    const store = useCounterStore()
    store.increment(5)
    expect(store.double).toBe(10)
  })
})
```

## 路由测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import App from '@/App.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('Router', () => {
  it('navigates to home', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(Home).exists()).toBe(true)
  })

  it('navigates to about', async () => {
    router.push('/about')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(About).exists()).toBe(true)
  })
})
```

## 表单测试

```vue
<!-- components/LoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit" :disabled="!isValid">Login</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'login', data: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')
const error = ref('')

const isValid = computed(() => {
  return email.value.includes('@') && password.value.length >= 6
})

function handleSubmit() {
  if (isValid.value) {
    emit('login', { email: email.value, password: password.value })
  }
}
</script>
```

```typescript
// components/__tests__/LoginForm.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '../LoginForm.vue'

describe('LoginForm', () => {
  it('disables button when form is invalid', async () => {
    const wrapper = mount(LoginForm)
    const button = wrapper.find('button')

    expect(button.attributes('disabled')).toBeDefined()

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('emits login event with form data', async () => {
    const wrapper = mount(LoginForm)

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('login')).toBeTruthy()
    expect(wrapper.emitted('login')[0]).toEqual([{
      email: 'test@example.com',
      password: 'password123'
    }])
  })

  it('validates email format', async () => {
    const wrapper = mount(LoginForm)
    const button = wrapper.find('button')

    await wrapper.find('input[type="email"]').setValue('invalid-email')
    await wrapper.find('input[type="password"]').setValue('password123')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('validates password length', async () => {
    const wrapper = mount(LoginForm)
    const button = wrapper.find('button')

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('12345')

    expect(button.attributes('disabled')).toBeDefined()
  })
})
```

## 提供/注入测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ChildComponent from '../ChildComponent.vue'

describe('Provide/Inject', () => {
  it('receives injected values', () => {
    const theme = ref('dark')

    const wrapper = mount(ChildComponent, {
      global: {
        provide: {
          theme: theme.value
        }
      }
    })

    expect(wrapper.text()).toContain('dark')
  })
})
```

## 测试工具配置

### 全局配置

```typescript
// tests/setup.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createI18n } from 'vue-i18n'

// Global plugins
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'Hello' }
  }
})

config.global.plugins = [i18n]
config.global.stubs = {
  'router-link': true,
  'router-view': true
}

// Mock global properties
config.global.mocks = {
  $t: (key: string) => key
}
```

## 常见测试模式

### 异步更新

```typescript
it('waits for async operations', async () => {
  const wrapper = mount(Component)
  
  // Trigger an action that causes async update
  await wrapper.find('button').trigger('click')
  
  // Wait for next tick
  await wrapper.vm.$nextTick()
  
  // Or use find with timeout
  expect(await wrapper.find('.loaded').exists()).toBe(true)
})
```

### 查找元素

```typescript
it('finds elements', () => {
  const wrapper = mount(Component)

  // By tag
  wrapper.find('button')

  // By class
  wrapper.find('.btn-primary')

  // By data-testid (recommended)
  wrapper.find('[data-testid="submit-button"]')

  // By text
  wrapper.find('button:contains("Submit")')
})
```

### 测试类名和样式

```typescript
it('has correct classes', async () => {
  const wrapper = mount(Component)
  
  expect(wrapper.classes()).toContain('active')
  expect(wrapper.classes()).not.toContain('disabled')
  
  expect(wrapper.attributes('style')).toContain('color: red')
})
```

## 覆盖率目标

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      // 覆盖率目标
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
})
```

