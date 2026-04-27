---
title: Vue3模板语法
tags:
  - 前端
  - Vue
  - Vue3
  - 模板语法
created: 2026-04-27
---

# Vue3模板语法

## 文本插值

```vue
<span>Message: {{ msg }}</span>
```

## 原始 HTML

```vue
<p>Using v-html: <span v-html="rawHtml"></span></p>
```

## Attribute 绑定

```vue
<div v-bind:id="dynamicId"></div>
<div :id="dynamicId"></div>
```

### 布尔型 Attribute

```vue
<button :disabled="isButtonDisabled">Button</button>
```

### 动态绑定多个值

```javascript
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```

```vue
<div v-bind="objectOfAttrs"></div>
```

## 事件处理

```vue
<button v-on:click="doThis"></button>
<button @click="doThis"></button>
```

### 事件修饰符

```vue
<!-- 阻止单击事件冒泡 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<div @click.capture="doThis">...</div>

<!-- 只当事件在该元素本身 (而不是子元素) 触发时触发回调 -->
<div @click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a @click.once="doThis"></a>
```

## 条件渲染

```vue
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>

<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

## 列表渲染

```vue
<li v-for="item in items" :key="item.message">
  {{ item.message }}
</li>

<li v-for="(item, index) in items">
  {{ index }} - {{ item.message }}
</li>
```

## 表单输入绑定

### 文本

```vue
<input v-model="message" placeholder="edit me" />
<p>Message is: {{ message }}</p>
```

### 复选框

```vue
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

### 单选按钮

```vue
<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>
```

### 修饰符

```vue
<input v-model.number="age" type="number" />
<input v-model.trim="msg" />
<input v-model.lazy="msg" />
```

