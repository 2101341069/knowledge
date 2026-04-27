---
title: Vue3性能优化指南
tags:
  - 前端
  - Vue
  - Vue3
  - 性能优化
created: 2026-04-27
---

# Vue3性能优化指南

## 编译时优化

### 静态提升

```vue
<!-- 优化前 -->
<div>
  <span>静态文本</span>
  <span>{{ dynamic }}</span>
</div>

<!-- 优化后：静态节点被提升到渲染函数之外 -->
```

### 打补丁标记

Vue3 会对动态绑定添加标记，diff 时只比较动态部分：

```vue
<div>
  <!-- 只比较 text -->
  <span>{{ text }}</span>
  
  <!-- 只比较 class -->
  <div :class="{ active }"></div>
  
  <!-- 比较 props: [ "id", "title" ] -->
  <div :id="id" :title="title"></div>
</div>
```

## 运行时优化

### v-once

只渲染元素和组件一次，之后视为静态内容：

```vue
<span v-once>This will never change: {{ msg }}</span>
```

### v-memo

缓存模板的一部分，用于性能敏感场景：

```vue
<div v-memo="[item.id, selected]">
  <!-- 只有当 item.id 或 selected 变化时才重新渲染 -->
  <span>ID: {{ item.id }}</span>
  <span>Selected: {{ selected }}</span>
</div>

<!-- 配合 v-for 使用 -->
<div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
  <!-- 只有选中状态改变时才重新渲染 -->
</div>
```

## 组件优化

### 合理使用 shallowRef / shallowReactive

```javascript
import { shallowRef, shallowReactive } from 'vue'

// 大型列表，只需要替换整个列表时
const bigList = shallowRef([])

// 深层对象不需要响应式
const config = shallowReactive({
  nested: { /* 大量数据 */ }
})
```

### 组件懒加载

```javascript
// 路由懒加载
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]

// 组件懒加载
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
</script>

<template>
  <HeavyComponent />
</template>
```

### Suspense

```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
```

## 列表优化

### 始终使用 key

```vue
<div v-for="item in items" :key="item.id">
  {{ item.text }}
</div>
```

### 虚拟滚动

对于长列表使用虚拟滚动（如 vue-virtual-scroller）：

```bash
npm install vue-virtual-scroller
```

```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="list"
    :item-size="32"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="user">{{ item.name }}</div>
  </RecycleScroller>
</template>
```

## 计算属性 vs 方法

```vue
<!-- ✅ 使用 computed - 有缓存 -->
<p>{{ reversedMessage }}</p>

<!-- ❌ 每次重新渲染都执行 -->
<p>{{ reverseMessage() }}</p>
```

```javascript
<script setup>
import { computed } from 'vue'

const message = ref('Hello')

const reversedMessage = computed(() => {
  return message.value.split('').reverse().join('')
})

function reverseMessage() {
  return message.value.split('').reverse().join('')
}
</script>
```

## 事件处理优化

### 事件委托

```vue
<!-- ❌ 每个元素都绑定事件 -->
<ul>
  <li v-for="item in items" :key="item.id" @click="handleClick(item)">
    {{ item.name }}
  </li>
</ul>

<!-- ✅ 父元素委托 -->
<ul @click="handleListClick">
  <li v-for="item in items" :key="item.id" :data-id="item.id">
    {{ item.name }}
  </li>
</ul>
```

```javascript
function handleListClick(e) {
  const id = e.target.dataset.id
  if (id) {
    // 处理点击
  }
}
```

## 减少响应式数据

```javascript
// ❌ 不需要响应式的大型数据也变成响应式
const bigData = reactive(loadHugeData())

// ✅ 使用 markRaw 标记非响应式对象
import { markRaw } from 'vue'

const bigData = markRaw(loadHugeData())
```

## 避免不必要的 watch

```javascript
// ❌ 可以用 computed 的时候不要用 watch
watch(firstName, () => {
  fullName.value = firstName.value + ' ' + lastName.value
})

// ✅ 使用 computed
const fullName = computed(() => 
  firstName.value + ' ' + lastName.value
)
```

## 开发环境提示

### Vue DevTools

使用 Vue DevTools 检查组件渲染次数

### Performance 面板

```javascript
// main.js
const app = createApp(App)
app.config.performance = true
```

然后在 Chrome DevTools Performance 面板中查看渲染时间。

