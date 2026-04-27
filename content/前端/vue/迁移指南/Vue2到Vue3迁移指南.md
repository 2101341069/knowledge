---
title: Vue2到Vue3迁移指南
tags:
  - 前端
  - Vue
  - Vue3
  - 迁移
created: 2026-04-27
---

# Vue2到Vue3迁移指南

## 破坏性变更

### 全局 API

#### Vue 实例创建

```javascript
// Vue2
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')

// Vue3
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

#### 全局配置

```javascript
// Vue2
Vue.config.productionTip = false
Vue.config.ignoredElements = [...]

// Vue3
app.config.productionTip = false // 已移除
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('my-')
```

### 全局 API Treeshaking

```javascript
// Vue2
import Vue from 'vue'

Vue.nextTick(() => {})
const obj = Vue.observable({})

// Vue3
import { nextTick, reactive } from 'vue'

nextTick(() => {})
const obj = reactive({})
```

## 组件选项变更

### data 选项

```javascript
// Vue2 - 支持对象和函数
{
  data: {
    count: 0
  }
}

// Vue3 - 只支持函数
{
  data() {
    return {
      count: 0
    }
  }
}
```

### Props

```javascript
// Vue2
{
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return ['small', 'medium', 'large'].indexOf(value) !== -1
      }
    }
  }
}

// Vue3 - 相同，但 default 函数不再接收 this
{
  props: {
    size: {
      type: String,
      default: 'medium'
    }
  }
}
```

## 指令变更

### v-model

```vue
<!-- Vue2 -->
<ChildComponent v-model="pageTitle" />
<!-- 相当于 -->
<ChildComponent :value="pageTitle" @input="pageTitle = $event" />

<!-- Vue3 -->
<ChildComponent v-model="pageTitle" />
<!-- 相当于 -->
<ChildComponent 
  :modelValue="pageTitle" 
  @update:modelValue="pageTitle = $event" 
/>
```

```javascript
// Vue2
{
  props: ['value'],
  methods: {
    updateValue(e) {
      this.$emit('input', e.target.value)
    }
  }
}

// Vue3
{
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    updateValue(e) {
      this.$emit('update:modelValue', e.target.value)
    }
  }
}
```

### v-bind 合并行为

```vue
<!-- Vue2 - 后面的覆盖前面的 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="blue"></div>

<!-- Vue3 - 声明顺序决定 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="blue"></div>

<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- 结果 -->
<div id="red"></div>
```

### v-if 和 v-for 优先级

```vue
<!-- Vue2 - v-for 优先级更高 -->
<!-- Vue3 - v-if 优先级更高 -->

<!-- 推荐：使用计算属性过滤 -->
<li v-for="user in activeUsers" :key="user.id">
  {{ user.name }}
</li>
```

## 生命周期钩子变更

| Vue2 | Vue3 |
|------|------|
| beforeDestroy | beforeUnmount |
| destroyed | unmounted |

```javascript
// Vue2
{
  beforeDestroy() {},
  destroyed() {}
}

// Vue3
{
  beforeUnmount() {},
  unmounted() {}
}
```

## 移除的 API

### $on, $off, $once

```javascript
// Vue2 - 事件总线
const eventBus = new Vue()
eventBus.$on('event', handler)
eventBus.$emit('event')

// Vue3 - 使用 mitt 或 tiny-emitter
import mitt from 'mitt'

const emitter = mitt()
emitter.on('event', handler)
emitter.emit('event')
```

### $children

```javascript
// Vue2
this.$children[0].someMethod()

// Vue3 - 使用 ref
<ChildComponent ref="child" />

const child = ref(null)
child.value.someMethod()
```

### $listeners

```javascript
// Vue2
{
  mounted() {
    console.log(this.$listeners)
  }
}

// Vue3 - $attrs 包含事件
{
  mounted() {
    console.log(this.$attrs)
  }
}
```

### $scopedSlots

```javascript
// Vue2
this.$scopedSlots.header

// Vue3 - 统一为 $slots
this.$slots.header
```

## 过滤器移除

```javascript
// Vue2
<template>
  <p>{{ message | capitalize }}</p>
</template>

filters: {
  capitalize(value) {
    return value.toUpperCase()
  }
}

// Vue3 - 使用方法或计算属性
<template>
  <p>{{ capitalize(message) }}</p>
</template>

<script setup>
function capitalize(value) {
  return value.toUpperCase()
}
</script>
```

## 异步组件

```javascript
// Vue2
const asyncPage = () => import('./NextPage.vue')

const asyncPage = () => ({
  component: import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
})

// Vue3
import { defineAsyncComponent } from 'vue'

const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))

const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

## 组合式 API 替换 Mixins

```javascript
// Vue2 - Mixin
const counterMixin = {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}

// Vue3 - Composable
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  
  function increment() {
    count.value++
  }
  
  return { count, increment }
}
```

## 路由升级

```javascript
// Vue2 + VueRouter 3
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [...]
})

// Vue3 + VueRouter 4
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})
```

## Vuex 升级

```javascript
// Vue2 + Vuex 3
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// Vue3 + Vuex 4
import { createStore } from 'vuex'

const store = createStore({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// 或者使用 Pinia（推荐）
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## 迁移步骤

1. **升级 Vue CLI 到最新版本**
2. **更新依赖** - vue, vue-router, vuex 等
3. **运行迁移工具**
   ```bash
   npx @vue/cli upgrade vue
   ```
4. **使用 @vue/compat 兼容模式**
5. **逐步修复警告**
6. **移除兼容模式**

## 迁移工具

```bash
# 安装迁移工具
npm install -g @vue/migrate

# 运行迁移
vue-migrate ./src
```

