---
title: Vue3自定义指令
tags:
  - 前端
  - Vue
  - Vue3
  - 自定义指令
created: 2026-04-27
---

# Vue3自定义指令

## 指令钩子

```javascript
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {},

  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},

  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},

  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},

  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},

  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},

  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}
```

## 钩子参数

- `el`：指令绑定到的元素
- `binding`：对象，包含以下属性
  - `value`：传递给指令的值
  - `oldValue`：先前的值
  - `arg`：传递给指令的参数
  - `modifiers`：修饰符对象
  - `instance`：使用该指令的组件实例
  - `dir`：指令的定义对象
- `vnode`：绑定元素的 VNode
- `prevVnode`：之前的 VNode

## 示例：自动聚焦

```javascript
const vFocus = {
  mounted: (el) => el.focus()
}

// 使用
<input v-focus />
```

## 示例：拖拽指令

```javascript
const vDrag = {
  mounted(el) {
    el.style.cursor = 'move'
    el.onmousedown = function(e) {
      let disx = e.pageX - el.offsetLeft
      let disy = e.pageY - el.offsetTop
      document.onmousemove = function(e) {
        el.style.left = e.pageX - disx + 'px'
        el.style.top = e.pageY - disy + 'px'
      }
      document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null
      }
    }
  }
}
```

## 示例：图片懒加载

```javascript
const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        el.src = binding.value
        observer.unobserve(el)
      }
    })
    observer.observe(el)
  }
}
```

## 全局注册

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

app.mount('#app')
```

## 局部注册

```javascript
<script setup>
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

