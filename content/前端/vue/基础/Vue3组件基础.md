---
title: Vue3组件基础
tags:
  - 前端
  - Vue
  - Vue3
  - 组件
created: 2026-04-27
---

# Vue3组件基础

## 组件定义

### 单文件组件 (SFC)

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>

<style scoped>
button {
  color: blue;
}
</style>
```

## Props

### 定义 Props

```javascript
<script setup>
const props = defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

### 带类型的 Props

```javascript
<script setup>
const props = defineProps({
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise
})
</script>
```

### TypeScript 语法

```typescript
<script setup lang="ts">
interface Props {
  title: string
  likes?: number
}

const props = defineProps<Props>()
</script>
```

### Props 默认值

```typescript
<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  likes?: number
}>(), {
  likes: 0
})
</script>
```

## 自定义事件

### 触发事件

```vue
<!-- ChildComponent.vue -->
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

### 父组件监听

```vue
<BlogPost @enlarge-text="postFontSize += 0.1" />
```

### 带类型的事件

```typescript
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

## v-model

### 基础用法

```vue
<!-- 子组件 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

### 多个 v-model 绑定

```vue
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

```javascript
<script setup>
const props = defineProps({
  firstName: String,
  lastName: String
})

const emit = defineEmits(['update:firstName', 'update:lastName'])
</script>
```

## 插槽

### 默认插槽

```vue
<!-- FancyButton.vue -->
<button class="fancy-btn">
  <slot></slot>
</button>
```

```vue
<FancyButton>
  Click me! <!-- 插槽内容 -->
</FancyButton>
```

### 具名插槽

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

```vue
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

### 作用域插槽

```vue
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

```vue
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

## provide / inject

### 提供值

```javascript
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

provide('location', location)
</script>
```

### 注入值

```javascript
<script setup>
import { inject } from 'vue'

const location = inject('location', 'default value')
</script>
```

