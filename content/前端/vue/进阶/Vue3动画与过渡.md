---
title: Vue3动画与过渡
tags:
  - 前端
  - Vue
  - Vue3
  - 动画
  - 过渡
created: 2026-04-27
---

# Vue3动画与过渡

## Transition 组件基础

### 单元素过渡

```vue
<template>
  <button @click="show = !show">Toggle</button>
  
  <Transition name="fade">
    <p v-if="show">Hello Vue3!</p>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 过渡类名详解

| 类名 | 阶段 | 说明 |
|------|------|------|
| `v-enter-from` | 进入开始 | 插入前生效，插入后下一帧移除 |
| `v-enter-active` | 进入中 | 整个进入过渡阶段生效 |
| `v-enter-to` | 进入结束 | 插入后下一帧生效，过渡完成后移除 |
| `v-leave-from` | 离开开始 | 离开过渡触发时生效，下一帧移除 |
| `v-leave-active` | 离开中 | 整个离开过渡阶段生效 |
| `v-leave-to` | 离开结束 | 离开过渡触发后下一帧生效，过渡完成后移除 |

### CSS 过渡示例

```vue
<template>
  <Transition name="slide">
    <div v-if="show" class="box">
      Slide Transition
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```

### CSS 动画示例

```vue
<template>
  <Transition name="bounce">
    <p v-if="show">Bounce Animation</p>
  </Transition>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

## 自定义过渡类名

```vue
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">Hello Animate.css!</p>
</Transition>
```

## JavaScript 钩子

```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
    :css="false"
  >
    <div v-if="show">JavaScript Hooks</div>
  </Transition>
</template>

<script setup>
function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el, done) {
  const duration = 1000
  
  setTimeout(() => {
    el.style.opacity = 1
    el.style.height = 'auto'
  }, 10)
  
  setTimeout(done, duration)
}

function onAfterEnter(el) {
  console.log('Enter completed!')
}

function onBeforeLeave(el) {
  el.style.opacity = 1
  el.style.height = el.offsetHeight + 'px'
}

function onLeave(el, done) {
  const duration = 1000
  
  setTimeout(() => {
    el.style.opacity = 0
    el.style.height = 0
  }, 10)
  
  setTimeout(done, duration)
}
</script>
```

## TransitionGroup

### 列表过渡

```vue
<template>
  <button @click="addItem">Add</button>
  <button @click="removeItem">Remove</button>
  <button @click="shuffle">Shuffle</button>
  
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' }
])

let nextId = 4

function addItem() {
  const index = Math.floor(Math.random() * (items.value.length + 1))
  items.value.splice(index, 0, {
    id: nextId++,
    text: `Item ${nextId - 1}`
  })
}

function removeItem() {
  items.value.pop()
}

function shuffle() {
  items.value.sort(() => Math.random() - 0.5)
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}

.list-move {
  transition: transform 0.5s ease;
}
</style>
```

### 交错列表动画

```vue
<template>
  <TransitionGroup
    name="staggered"
    tag="ul"
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <li v-for="(item, index) in items" :key="item.id" :data-index="index">
      {{ item.text }}
    </li>
  </TransitionGroup>
</template>

<script setup>
function beforeEnter(el) {
  el.style.opacity = 0
  el.style.transform = 'translateY(20px)'
}

function enter(el, done) {
  const delay = el.dataset.index * 150
  
  setTimeout(() => {
    el.style.transition = 'all 0.3s ease'
    el.style.opacity = 1
    el.style.transform = 'translateY(0)'
    
    setTimeout(done, 300)
  }, delay)
}

function leave(el, done) {
  const delay = el.dataset.index * 150
  
  setTimeout(() => {
    el.style.transition = 'all 0.3s ease'
    el.style.opacity = 0
    el.style.transform = 'translateY(20px)'
    
    setTimeout(done, 300)
  }, delay)
}
</script>
```

## 状态过渡

### 数字动画

```vue
<template>
  <input v-model.number="targetNumber" type="number" step="20">
  <p>Animated number: {{ animatedNumber }}</p>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import gsap from 'gsap'

const targetNumber = ref(0)
const animatedNumber = ref(0)

watch(targetNumber, (newValue) => {
  gsap.to(animatedNumber, {
    value: newValue,
    duration: 0.5,
    ease: 'power2.out'
  })
})
</script>
```

### 颜色过渡

```vue
<template>
  <div
    class="color-box"
    :style="{ backgroundColor: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})` }"
  >
    <input v-model.number="r" type="range" min="0" max="255">
    <input v-model.number="g" type="range" min="0" max="255">
    <input v-model.number="b" type="range" min="0" max="255">
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import gsap from 'gsap'

const state = reactive({ r: 0, g: 128, b: 255 })
const { r, g, b } = reactiveGsap(state)

function reactiveGsap(target) {
  const animated = { ...target }
  
  for (const key in target) {
    watch(() => target[key], (newValue) => {
      gsap.to(animated, {
        [key]: newValue,
        duration: 0.5,
        ease: 'power2.out'
      })
    })
  }
  
  return animated
}
</script>
```

## 路由过渡

### 基础路由过渡

```vue
<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 基于路由的动态过渡

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </router-view>
</template>
```

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: Home,
    meta: { transition: 'fade' }
  },
  {
    path: '/about',
    component: About,
    meta: { transition: 'slide-left' }
  },
  {
    path: '/contact',
    component: Contact,
    meta: { transition: 'slide-right' }
  }
]
```

### 基于历史的过渡方向

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('fade')

// 记录历史深度
const historyDepth = ref(window.history.length)

watch(() => route.path, (to, from) => {
  const currentDepth = window.history.length
  
  if (currentDepth > historyDepth.value) {
    transitionName.value = 'slide-left'
  } else if (currentDepth < historyDepth.value) {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = 'fade'
  }
  
  historyDepth.value = currentDepth
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </router-view>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
```

## 可复用过渡

### 创建可复用过渡组件

```vue
<!-- transitions/FadeTransition.vue -->
<template>
  <Transition
    name="fade"
    enter-active-class="fade-enter-active"
    leave-active-class="fade-leave-active"
    enter-from-class="fade-enter-from"
    leave-to-class="fade-leave-to"
  >
    <slot />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

```vue
<!-- 使用 -->
<template>
  <FadeTransition>
    <div v-if="show">Content</div>
  </FadeTransition>
</template>

<script setup>
import FadeTransition from './transitions/FadeTransition.vue'
</script>
```

### 带参数的过渡组件

```vue
<!-- transitions/ScaleTransition.vue -->
<template>
  <Transition name="scale" :duration="duration">
    <slot />
  </Transition>
</template>

<script setup>
defineProps({
  duration: {
    type: Number,
    default: 300
  }
})
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all v-bind(duration + 'ms') ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
```

## 性能优化

### 使用 transform 和 opacity

```css
/* ✅ 性能好 - 触发 GPU 加速 */
.good-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

/* ❌ 性能差 - 触发重排 */
.bad-enter-from {
  margin-left: 100px;
  opacity: 0;
}
```

### will-change 提示

```css
.animated-element {
  will-change: transform, opacity;
}
```

### 避免布局抖动

```javascript
// ✅ 读取后统一写入
function onEnter(el, done) {
  // 读取阶段
  const height = el.offsetHeight
  
  // 写入阶段
  requestAnimationFrame(() => {
    el.style.height = height + 'px'
  })
}
```

## 调试动画

### 减慢动画速度

```javascript
// main.js 开发环境
const app = createApp(App)

if (process.env.NODE_ENV === 'development') {
  app.config.globalProperties.$slowAnimations = true
}
```

```css
/* 开发环境减慢动画 */
@media (prefers-reduced-motion: no-preference) {
  .debug-animations * {
    transition-duration: 3s !important;
    animation-duration: 3s !important;
  }
}
```

