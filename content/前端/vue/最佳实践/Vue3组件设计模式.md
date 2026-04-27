---
title: Vue3组件设计模式
tags:
  - 前端
  - Vue
  - Vue3
  - 组件设计
  - 设计模式
created: 2026-04-27
---

# Vue3组件设计模式

## 容器组件与展示组件分离

### 原则

- **展示组件**：关心 UI 长什么样，通过 props 接收数据和回调
- **容器组件**：关心数据如何获取和业务逻辑，管理状态

### 展示组件

```vue
<!-- components/UserList.vue -->
<template>
  <div class="user-list">
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        <span>{{ user.name }}</span>
        <button @click="onSelect(user)">Select</button>
      </li>
    </ul>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
}

defineProps<{
  title: string
  users: User[]
  loading?: boolean
  error?: Error | null
}>()

const emit = defineEmits<{
  (e: 'select', user: User): void
}>()

function onSelect(user: User) {
  emit('select', user)
}
</script>
```

### 容器组件

```vue
<!-- containers/UserListContainer.vue -->
<template>
  <UserList
    title="Users"
    :users="users"
    :loading="loading"
    :error="error"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from '@/components/UserList.vue'
import { fetchUsers, type User } from '@/api/users'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<Error | null>(null)

async function loadUsers() {
  loading.value = true
  error.value = null
  try {
    users.value = await fetchUsers()
  } catch (e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
}

function handleSelect(user: User) {
  // 业务逻辑
  console.log('Selected user:', user)
}

onMounted(loadUsers)
</script>
```

## 高阶组件 (HOC)

### 基础 HOC

```typescript
// hocs/withLoading.ts
import { defineComponent, h, ref, watch } from 'vue'
import type { Component } from 'vue'

export function withLoading(
  WrappedComponent: Component,
  asyncFn: (props: any) => Promise<any>,
  dataKey: string = 'data'
) {
  return defineComponent({
    name: `WithLoading${WrappedComponent.name || ''}`,

    props: WrappedComponent.props,

    setup(props, { attrs, slots }) {
      const loading = ref(true)
      const error = ref<Error | null>(null)
      const data = ref<any>(null)

      async function loadData() {
        loading.value = true
        error.value = null
        try {
          data.value = await asyncFn(props)
        } catch (e) {
          error.value = e as Error
        } finally {
          loading.value = false
        }
      }

      loadData()

      // 响应 props 变化
      watch(() => props, () => loadData(), { deep: true })

      return () => {
        if (loading.value) {
          return h('div', { class: 'loading' }, 'Loading...')
        }

        if (error.value) {
          return h('div', { class: 'error' }, error.value.message)
        }

        return h(WrappedComponent, {
          ...props,
          ...attrs,
          [dataKey]: data.value
        }, slots)
      }
    }
  })
}
```

### 使用 HOC

```typescript
import UserList from './UserList.vue'
import { withLoading } from './hocs/withLoading'

const UserListWithLoading = withLoading(
  UserList,
  async (props) => {
    const response = await fetch(`/api/users?page=${props.page}`)
    return response.json()
  },
  'users'
)
```

## Render Props 模式

### 基础 Render Props

```vue
<!-- components/DataFetcher.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props<T> {
  url: string
  fetcher?: (url: string) => Promise<T>
}

const props = withDefaults(defineProps<Props<any>>(), {
  fetcher: (url) => fetch(url).then(res => res.json())
})

const slots = defineSlots<{
  default: (params: {
    data: any | null
    loading: boolean
    error: Error | null
    refetch: () => Promise<void>
  }) => any
}>()

const data = ref<any>(null)
const loading = ref(true)
const error = ref<Error | null>(null)

async function refetch() {
  loading.value = true
  error.value = null
  try {
    data.value = await props.fetcher(props.url)
  } catch (e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
}

onMounted(refetch)
watch(() => props.url, refetch)
</script>

<template>
  <slot :data="data" :loading="loading" :error="error" :refetch="refetch" />
</template>
```

### 使用 Render Props

```vue
<template>
  <DataFetcher url="/api/users" v-slot="{ data, loading, error }">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <ul v-else>
      <li v-for="user in data" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </DataFetcher>
</template>
```

## 自定义 Hook 模式

### useRequest Hook

```typescript
// composables/useRequest.ts
import { ref, onMounted, watch } from 'vue'

interface UseRequestOptions<T> {
  immediate?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useRequest<T>(
  url: string,
  options: UseRequestOptions<T> = {}
) {
  const {
    immediate = true,
    initialData = null,
    onSuccess,
    onError
  } = options

  const data = ref<T | null>(initialData)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      const result = await response.json()
      data.value = result
      onSuccess?.(result)
    } catch (e) {
      error.value = e as Error
      onError?.(e as Error)
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    onMounted(execute)
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh: execute
  }
}
```

### 使用自定义 Hook

```vue
<script setup lang="ts">
import { useRequest } from '@/composables/useRequest'

const { data: users, loading, error, refresh } = useRequest<User[]>('/api/users')
</script>

<template>
  <div>
    <button @click="refresh">Refresh</button>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>
```

## 受控组件与非受控组件

### 非受控组件

```vue
<!-- components/UncontrolledInput.vue -->
<template>
  <input
    :default-value="defaultValue"
    ref="inputRef"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement>()

interface Props {
  defaultValue?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

function handleChange(e: Event) {
  emit('change', (e.target as HTMLInputElement).value)
}

// 暴露获取值的方法
defineExpose({
  getValue: () => inputRef.value?.value
})
</script>
```

### 受控组件

```vue
<!-- components/ControlledInput.vue -->
<template>
  <input :value="modelValue" @input="handleInput" />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>
```

## 适配器模式

### API 适配器

```typescript
// adapters/userAdapter.ts
import type { User, UserDTO } from '@/types/user'

// 将 DTO 转换为视图模型
export function toViewModel(dto: UserDTO): User {
  return {
    id: dto.id,
    name: `${dto.firstName} ${dto.lastName}`,
    email: dto.email,
    avatar: dto.avatarUrl || '/default-avatar.png',
    createdAt: new Date(dto.createdAt),
    fullName: `${dto.firstName} ${dto.lastName}`
  }
}

// 将视图模型转换为 DTO
export function toDTO(user: Partial<User>): Partial<UserDTO> {
  const [firstName, ...lastNameParts] = (user.name || '').split(' ')
  return {
    id: user.id,
    firstName,
    lastName: lastNameParts.join(' '),
    email: user.email,
    avatarUrl: user.avatar
  }
}
```

### 在组件中使用

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { toViewModel, toDTO } from '@/adapters/userAdapter'
import { fetchUser, updateUser } from '@/api/users'

const userDTO = ref<UserDTO | null>(null)

const user = computed(() => userDTO.value ? toViewModel(userDTO.value) : null)

async function loadUser(id: number) {
  userDTO.value = await fetchUser(id)
}

async function saveUser(updatedUser: Partial<User>) {
  const dto = toDTO(updatedUser)
  await updateUser(dto)
}
</script>
```

## 代理模式（v-model）

### 多 v-model 绑定

```vue
<!-- components/UserForm.vue -->
<script setup lang="ts">
interface Props {
  modelValue: User
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: User): void
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
}>()

// 计算属性作为代理
const firstName = computed({
  get: () => props.modelValue.firstName,
  set: (value) => emit('update:firstName', value)
})

const lastName = computed({
  get: () => props.modelValue.lastName,
  set: (value) => emit('update:lastName', value)
})

const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value) => {
    const [first, ...last] = value.split(' ')
    firstName.value = first
    lastName.value = last.join(' ')
  }
})
</script>

<template>
  <input v-model="firstName" :disabled="disabled" placeholder="First name" />
  <input v-model="lastName" :disabled="disabled" placeholder="Last name" />
  <input v-model="fullName" :disabled="disabled" placeholder="Full name" />
</template>
```

## 工厂模式

### 组件工厂

```typescript
// factories/fieldFactory.ts
import { h } from 'vue'
import TextInput from './TextInput.vue'
import SelectInput from './SelectInput.vue'
import CheckboxInput from './CheckboxInput.vue'
import DateInput from './DateInput.vue'
import type { FieldConfig } from '@/types/forms'

export function createFieldComponent(field: FieldConfig) {
  const componentMap: Record<string, any> = {
    text: TextInput,
    select: SelectInput,
    checkbox: CheckboxInput,
    date: DateInput
  }

  const Component = componentMap[field.type] || TextInput

  return (props: any) => h(Component, {
    ...field,
    ...props
  })
}

// 动态表单组件
export function createForm(fields: FieldConfig[]) {
  return {
    name: 'DynamicForm',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup(props: any, { emit }) {
      const fieldComponents = fields.map(field => {
        const FieldComponent = createFieldComponent(field)
        return FieldComponent({
          modelValue: props.modelValue[field.key],
          'onUpdate:modelValue': (value: any) => {
            emit('update:modelValue', {
              ...props.modelValue,
              [field.key]: value
            })
          }
        })
      })

      return () => h('form', fieldComponents)
    }
  }
}
```

## 观察者模式（事件总线）

### 事件总线

```typescript
// utils/eventBus.ts
type EventHandler = (...args: any[]) => void

class EventBus {
  private events = new Map<string, Set<EventHandler>>()

  on(event: string, handler: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(handler)

    // 返回取消订阅函数
    return () => this.off(event, handler)
  }

  off(event: string, handler: EventHandler) {
    this.events.get(event)?.delete(handler)
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach(handler => handler(...args))
  }

  once(event: string, handler: EventHandler) {
    const wrapped = (...args: any[]) => {
      handler(...args)
      this.off(event, wrapped)
    }
    this.on(event, wrapped)
  }
}

export const eventBus = new EventBus()
```

### 在组件中使用

```vue
<!-- ComponentA.vue -->
<script setup>
import { eventBus } from '@/utils/eventBus'

function sendMessage() {
  eventBus.emit('message', { from: 'A', content: 'Hello!' })
}
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { eventBus } from '@/utils/eventBus'

const unsubscribe = eventBus.on('message', (data) => {
  console.log(`Received from ${data.from}: ${data.content}`)
})

onUnmounted(unsubscribe)
</script>
```

## 单例模式

### 全局状态单例

```typescript
// stores/auth.ts
import { ref, readonly } from 'vue'
import type { User } from '@/types/user'

// 单例状态
const token = ref<string | null>(localStorage.getItem('token'))
const user = ref<User | null>(null)
const isAuthenticated = ref(!!token.value)

// 只能通过 actions 修改
export function useAuthStore() {
  async function login(credentials: { email: string; password: string }) {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    token.value = data.token
    user.value = data.user
    isAuthenticated.value = true
    localStorage.setItem('token', data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout
  }
}
```

## 策略模式

### 验证策略

```typescript
// utils/validation.ts
export interface ValidationRule<T = any> {
  validate(value: T): boolean
  message: string
}

// 具体策略
export const required: ValidationRule<string> = {
  validate: (value) => value.trim().length > 0,
  message: '此字段为必填项'
}

export const email: ValidationRule<string> = {
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: '请输入有效的邮箱地址'
}

export const minLength = (min: number): ValidationRule<string> => ({
  validate: (value) => value.length >= min,
  message: `最少需要 ${min} 个字符`
})

export const maxLength = (max: number): ValidationRule<string> => ({
  validate: (value) => value.length <= max,
  message: `最多允许 ${max} 个字符`
})

// 验证器
export function createValidator<T>(rules: Record<keyof T, ValidationRule[]>) {
  return (data: T) => {
    const errors: Partial<Record<keyof T, string[]>> = {}

    for (const field in rules) {
      const fieldRules = rules[field]
      const value = data[field]

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          if (!errors[field]) errors[field] = []
          errors[field]!.push(rule.message)
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }
}
```

### 在表单中使用

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { createValidator, required, email, minLength } from '@/utils/validation'

const form = reactive({
  email: '',
  password: ''
})

const validate = createValidator<typeof form>({
  email: [required, email],
  password: [required, minLength(6)]
})

function handleSubmit() {
  const result = validate(form)
  if (!result.valid) {
    console.error('Validation errors:', result.errors)
    return
  }
  // 提交表单
}
</script>
```

