---
title: Vue 2 高级教程
tags:
  - 前端
  - Vue
  - Vue2
  - 框架
  - 高级
  - 教程
created: 2026-04-17
---

# Vue 2 高级教程

> 本教程深入讲解 Vue 2 的高级特性，包括动态组件、过渡动画、状态管理、路由等核心概念。

## 目录

1. [动态组件与异步组件](#1-动态组件与异步组件)
2. [过渡与动画](#2-过渡与动画)
3. [混入](#3-混入)
4. [自定义指令](#4-自定义指令)
5. [渲染函数与 JSX](#5-渲染函数与-jsx)
6. [插件](#6-插件)
7. [过滤器](#7-过滤器)
8. [状态管理 (Vuex)](#8-状态管理-vuex)
9. [路由 (Vue Router)](#9-路由-vue-router)
10. [服务端渲染 (SSR)](#10-服务端渲染-ssr)
11. [测试](#11-测试)
12. [最佳实践](#12-最佳实践)

---

## 1. 动态组件与异步组件

### 1.1 在动态组件上使用 keep-alive

#### 基础示例

```html
<!-- 动态组件切换 -->
<div id="app">
  <button @click="currentComponent = 'Home'">Home</button>
  <button @click="currentComponent = 'Posts'">Posts</button>
  <button @click="currentComponent = 'Archive'">Archive</button>

  <!-- 不使用 keep-alive：组件会被销毁 -->
  <component v-bind:is="currentComponent"></component>

  <!-- 使用 keep-alive：组件会被缓存 -->
  <keep-alive>
    <component v-bind:is="currentComponent"></component>
  </keep-alive>
</div>

<script>
new Vue({
  el: '#app',
  data: {
    currentComponent: 'Home'
  },
  components: {
    Home: {
      template: '<div>Home Component</div>',
      created() {
        console.log('Home created')
      },
      destroyed() {
        console.log('Home destroyed')
      }
    },
    Posts: {
      template: '<div>Posts Component</div>'
    },
    Archive: {
      template: '<div>Archive Component</div>'
    }
  }
})
</script>
```

#### keep-alive 的属性

```html
<!-- include：只有名称匹配的组件会被缓存 -->
<keep-alive include="Home,Posts">
  <component :is="currentComponent"></component>
</keep-alive>

<!-- exclude：任何名称匹配的组件都不会被缓存 -->
<keep-alive exclude="Archive">
  <component :is="currentComponent"></component>
</keep-alive>

<!-- max：最多可以缓存多少组件实例 -->
<keep-alive :max="10">
  <component :is="currentComponent"></component>
</keep-alive>

<!-- 正则表达式或数组 -->
<keep-alive :include="/Home|Posts/">
  <component :is="currentComponent"></component>
</keep-alive>

<keep-alive :include="['Home', 'Posts']">
  <component :is="currentComponent"></component>
</keep-alive>
```

#### 生命周期钩子

被 keep-alive 缓存的组件会新增两个生命周期钩子：

```javascript
export default {
  name: 'CachedComponent',
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
  },
  activated() {
    // 在被 keep-alive 缓存的组件激活时调用
    console.log('activated')
  },
  deactivated() {
    // 在被 keep-alive 缓存的组件停用时调用
    console.log('deactivated')
  }
}
```

### 1.2 异步组件

#### 基础用法

```javascript
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

#### 使用 Webpack 的代码分割功能

```javascript
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的编译代码分割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})
```

#### 使用 import() 语法

```javascript
// 推荐方式
Vue.component(
  'async-component',
  () => import('./AsyncComponent.vue')
)

// 局部注册
new Vue({
  components: {
    AsyncComponent: () => import('./AsyncComponent.vue')
  }
})
```

#### 高级异步组件

```javascript
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})

Vue.component('async-component', AsyncComponent)
```

#### 处理加载状态

```javascript
const AsyncComponent = {
  component: () => import('./MyComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
}

// 使用
new Vue({
  data: {
    showComponent: false
  },
  components: {
    AsyncComponent
  },
  template: `
    <div>
      <button @click="showComponent = true">Load Component</button>
      <async-component v-if="showComponent"></async-component>
    </div>
  `
})
```

---

## 2. 过渡与动画

### 2.1 单元素/组件的过渡

#### 过渡类名

Vue 提供了 `transition` 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡：
- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)
- 动态组件
- 组件根节点

```html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>

<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>

<style>
/* 进入和离开动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
```

#### 过渡类名详解

在进入/离开的过渡中，会有 6 个 class 切换：

1. `v-enter`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
3. `v-enter-to`：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter` 被移除)，在过渡/动画完成之后移除。
4. `v-leave`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
6. `v-leave-to`：定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave` 被删除)，在过渡/动画完成之后移除。

```
进入过渡：
v-enter → v-enter-active → v-enter-to

离开过渡：
v-leave → v-leave-active → v-leave-to
```

### 2.2 CSS 过渡

```html
<div id="example-1">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>

<script>
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
</script>

<style>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
```

### 2.3 CSS 动画

```html
<div id="example-2">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </transition>
</div>

<script>
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
</script>

<style>
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

### 2.4 自定义过渡类名

```html
<!-- 使用第三方动画库 Animate.css -->
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>

<script>
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
</script>
```

### 2.5 同时使用过渡和动画

```html
<transition
  type="transition"
  name="fade"
>
  <p v-if="show">hello</p>
</transition>

<!-- 或者显式指定持续时间 -->
<transition :duration="1000">...</transition>

<!-- 分别指定进入和离开的持续时间 -->
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### 2.6 JavaScript 钩子

```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>

<script>
new Vue({
  methods: {
    // 进入中
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    // 当与 CSS 结合使用时，回调函数 done 是可选的
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    afterEnter: function (el) {
      // ...
    },
    enterCancelled: function (el) {
      // ...
    },

    // 离开时
    beforeLeave: function (el) {
      // ...
    },
    // 当与 CSS 结合使用时，回调函数 done 是可选的
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    },
    afterLeave: function (el) {
      // ...
    },
    // leaveCancelled 只用于 v-show 中
    leaveCancelled: function (el) {
      // ...
    }
  }
})
</script>
```

### 2.7 初始渲染的过渡

```html
<!-- appear 属性设置初始渲染的过渡 -->
<transition appear>
  <!-- ... -->
</transition>

<!-- 自定义 CSS 类名 -->
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class"
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>

<!-- 自定义 JavaScript 钩子 -->
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

### 2.8 多个元素的过渡

```html
<!-- 使用 key 属性区分元素 -->
<transition>
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>

<!-- 过渡模式 -->
<transition name="fade" mode="out-in">
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>

<!-- mode="in-out" -->
<transition name="fade" mode="in-out">
  <!-- ... -->
</transition>
```

### 2.9 多个组件的过渡

```html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="currentComponent"></component>
</transition>

<script>
new Vue({
  el: '#transition-components-demo',
  data: {
    currentComponent: 'comp-a'
  },
  components: {
    'comp-a': {
      template: '<div>Component A</div>'
    },
    'comp-b': {
      template: '<div>Component B</div>'
    }
  }
})
</script>

<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
```

### 2.10 列表过渡

```html
<div id="list-demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>

<script>
new Vue({
  el: '#list-demo',
  data: {
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    }
  }
})
</script>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 1s;
}
</style>
```

### 2.11 列表的排序过渡

```html
<div id="flip-list-demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" v-bind:key="item">
      {{ item }}
    </li>
  </transition-group>
</div>

<script>
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
</style>
```

---

## 3. 混入

### 3.1 基础

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被"混合"进入该组件本身的选项。

```javascript
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

### 3.2 选项合并

#### 数据对象合并

```javascript
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

**规则**：当组件和混入对象含有同名选项时，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

#### 钩子函数合并

```javascript
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})

// => "混入对象的钩子被调用"
// => "组件钩子被调用"
```

**规则**：同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。

#### 值为对象的选项合并

```javascript
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

**规则**：值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

### 3.3 全局混入

```javascript
// 为自定义的选项注入一个处理器
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```

**⚠️ 注意**：全局混入会影响所有之后创建的 Vue 实例，包括第三方组件库。谨慎使用！

### 3.4 自定义选项合并策略

```javascript
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // 返回合并后的值
}

// 使用 Vue 提供的策略
Vue.config.optionMergeStrategies.myOption = Vue.config.optionMergeStrategies.methods
```

---

## 4. 自定义指令

### 4.1 简介

除了核心功能默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令。

```javascript
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 局部注册
new Vue({
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
})
```

### 4.2 钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

| 钩子函数 | 说明 |
|---------|------|
| `bind` | 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。 |
| `inserted` | 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。 |
| `update` | 所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。 |
| `componentUpdated` | 指令所在组件的 VNode **及其子 VNode** 全部更新后调用。 |
| `unbind` | 只调用一次，指令与元素解绑时调用。 |

### 4.3 钩子函数参数

```javascript
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

#### 参数说明

| 参数 | 说明 |
|------|------|
| `el` | 指令所绑定的元素，可以用来直接操作 DOM。 |
| `binding` | 一个对象，包含以下属性：<br>- `name`：指令名，不包括 `v-` 前缀。<br>- `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。<br>- `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。<br>- `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。<br>- `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。<br>- `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。 |
| `vnode` | Vue 编译生成的虚拟节点。 |
| `oldVnode` | 上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。 |

### 4.4 函数简写

```javascript
// 在 bind 和 update 时触发相同行为
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

### 4.5 对象字面量

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>

<script>
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
</script>
```

### 4.6 实用自定义指令示例

#### 权限指令

```javascript
// 权限检查指令
Vue.directive('permission', {
  inserted: function (el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = permissions.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-permission="['admin','editor']"`)
    }
  }
})

// 使用
<button v-permission="['admin']">删除</button>
```

#### 防抖指令

```javascript
// 防抖指令
Vue.directive('debounce', {
  inserted: function (el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, binding.arg || 500)
    })
  }
})

// 使用
<button v-debounce:1000="handleClick">点击</button>
```

#### 复制指令

```javascript
// 复制到剪贴板指令
Vue.directive('copy', {
  bind(el, { value }) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        console.log('无复制内容')
        return
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘
      textarea.readOnly = 'readonly'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      const result = document.execCommand('Copy')
      if (result) {
        console.log('复制成功')
      }
      document.body.removeChild(textarea)
    }
    // 绑定点击事件
    el.addEventListener('click', el.handler)
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  }
})

// 使用
<button v-copy="copyText">复制</button>
```

---

## 5. 渲染函数与 JSX

### 5.1 基础

Vue 推荐在绝大多数情况下使用模板来创建 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程能力。这时你可以用**渲染函数**，它比模板更接近编译器。

```javascript
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### 5.2 虚拟 DOM

Vue 通过建立一个**虚拟 DOM** 来追踪自己要如何改变真实 DOM。

```javascript
return createElement('h1', this.blogTitle)
```

`createElement` 返回的不是实际的 DOM 元素，而是虚拟节点 (virtual node)，简写为 **VNode**。

### 5.3 createElement 参数

```javascript
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // 解析上述任一内容的 async 异步函数。必需参数。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成"文本虚拟节点"。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### 5.4 深入数据对象

```javascript
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    active: true,
    'text-danger': false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```

### 5.5 约束

#### VNode 必须唯一

```javascript
// ❌ 错误：重复的 VNode
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误 - 重复的 VNode
    myParagraphVNode, myParagraphVNode
  ])
}

// ✅ 正确：创建多个相同的 VNode
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

### 5.6 使用 JavaScript 代替模板功能

#### v-if 和 v-for

```javascript
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

#### v-model

```javascript
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

### 5.7 JSX

如果你写了很多 render 函数，可能会觉得下面这样的代码写起来很痛苦：

```javascript
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

可以使用 JSX 语法：

```javascript
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

**配置 JSX**：

```javascript
// babel.config.js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
```

---

## 6. 插件

### 6.1 插件的作用

插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：

1. 添加全局方法或者 property。如：vue-custom-element
2. 添加全局资源：指令/过滤器/过渡等。如：vue-touch
3. 通过全局混入来添加一些组件选项。如：vue-router
4. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如：vue-router

### 6.2 使用插件

```javascript
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

// 传入选项
Vue.use(MyPlugin, { someOption: true })

// 自动调用 Vue.use()
import Vue from 'vue'
import VueRouter from 'vue-router'

// VueRouter 会自动调用 Vue.use()
```

### 6.3 开发插件

```javascript
// MyPlugin.js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    // ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    // ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}

export default MyPlugin
```

### 6.4 实用插件示例

#### Loading 插件

```javascript
// loading/index.js
import LoadingComponent from './Loading.vue'

let $vm

export default {
  install(Vue, options) {
    if (!$vm) {
      const LoadingPlugin = Vue.extend(LoadingComponent)

      $vm = new LoadingPlugin({
        el: document.createElement('div')
      })

      document.body.appendChild($vm.$el)
    }

    $vm.show = false

    let loading = {
      show(text) {
        $vm.show = true
        $vm.text = text
      },
      hide() {
        $vm.show = false
      }
    }

    if (!Vue.$loading) {
      Vue.$loading = loading
    }

    Vue.mixin({
      created() {
        this.$loading = Vue.$loading
      }
    })
  }
}

// main.js
import Loading from './loading'
Vue.use(Loading)

// 使用
this.$loading.show('加载中...')
this.$loading.hide()
```

---

## 7. 过滤器

### 7.1 基础

Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：**双花括号插值和 `v-bind` 表达式** (后者从 2.1.0+ 开始支持)。过滤器应该被添加在 JavaScript 表达式的尾部，由"管道"符号指示：

```html
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

### 7.2 定义过滤器

#### 全局过滤器

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

#### 局部过滤器

```javascript
new Vue({
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

### 7.3 过滤器可以串联

```html
{{ message | filterA | filterB }}

<script>
new Vue({
  filters: {
    filterA: function (value) {
      return value.toUpperCase()
    },
    filterB: function (value) {
      return value.split('').reverse().join('')
    }
  }
})
</script>
```

### 7.4 过滤器是 JavaScript 函数

```html
{{ message | filterA('arg1', arg2) }}

<script>
new Vue({
  filters: {
    filterA: function (value, arg1, arg2) {
      // value 是 message 的值
      // arg1 是字符串 'arg1'
      // arg2 是变量 arg2 的值
      return value + arg1 + arg2
    }
  }
})
</script>
```

### 7.5 实用过滤器示例

```javascript
// 日期格式化
Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
  if (!value) return ''
  return dayjs(value).format(format)
})

// 数字格式化
Vue.filter('numberFormat', function (value, decimals = 2) {
  if (!value) return '0'
  return Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
})

// 金钱格式化
Vue.filter('moneyFormat', function (value, symbol = '¥') {
  if (!value) return symbol + '0.00'
  return symbol + Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// 截断文本
Vue.filter('truncate', function (value, length = 100) {
  if (!value) return ''
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
})

// 使用
{{ date | dateFormat('YYYY-MM-DD HH:mm:ss') }}
{{ price | moneyFormat }}
{{ text | truncate(50) }}
```

---

## 8. 状态管理 (Vuex)

### 8.1 什么是 Vuex

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

### 8.2 核心概念

#### State

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: {
      name: '张三',
      age: 25
    }
  }
})

// 组件中使用
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.state.count
    }
  }
}
</script>

// 使用 mapState 辅助函数
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['count', 'user'])
  }
}
```

#### Getter

```javascript
// store/index.js
export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    // 通过方法访问
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
})

// 组件中使用
computed: {
  doneTodos() {
    return this.$store.getters.doneTodos
  }
}

// 使用 mapGetters 辅助函数
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['doneTodos', 'doneTodosCount'])
  }
}
```

#### Mutation

```javascript
// store/index.js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    },
    incrementBy(state, payload) {
      state.count += payload.amount
    }
  }
})

// 组件中使用
methods: {
  increment() {
    this.$store.commit('increment')
  },
  incrementBy() {
    this.$store.commit('incrementBy', {
      amount: 10
    })
  }
}

// 使用 mapMutations 辅助函数
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['increment', 'incrementBy'])
  }
}
```

**⚠️ 注意**：Mutation 必须是同步函数。

#### Action

```javascript
// store/index.js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    },
    // 解构参数
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    // 异步操作
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId)
      commit('setUser', user)
    }
  }
})

// 组件中使用
methods: {
  increment() {
    this.$store.dispatch('increment')
  },
  incrementAsync() {
    this.$store.dispatch('incrementAsync')
  }
}

// 使用 mapActions 辅助函数
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['increment', 'incrementAsync'])
  }
}
```

#### Module

```javascript
// store/modules/user.js
const userModule = {
  namespaced: true,
  state: {
    name: '',
    email: ''
  },
  mutations: {
    setName(state, name) {
      state.name = name
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const user = await api.login(credentials)
      commit('setName', user.name)
    }
  },
  getters: {
    isLoggedIn: state => !!state.name
  }
}

export default userModule

// store/index.js
import userModule from './modules/user'

export default new Vuex.Store({
  modules: {
    user: userModule
  }
})

// 组件中使用
computed: {
  ...mapState('user', ['name', 'email']),
  ...mapGetters('user', ['isLoggedIn'])
},
methods: {
  ...mapMutations('user', ['setName']),
  ...mapActions('user', ['login'])
}
```

### 8.3 项目结构

```
store/
├── index.js          # 组装模块并导出 store
├── actions.js        # 根级别的 action
├── mutations.js      # 根级别的 mutation
├── getters.js        # 根级别的 getter
└── modules/
    ├── cart.js       # 购物车模块
    ├── products.js   # 产品模块
    └── user.js       # 用户模块
```

---

## 9. 路由 (Vue Router)

### 9.1 基础

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue')  // 路由懒加载
  }
]

const router = new VueRouter({
  mode: 'history',  // 或 'hash'
  base: process.env.BASE_URL,
  routes
})

export default router
```

### 9.2 动态路由匹配

```javascript
const routes = [
  // 动态字段以冒号开始
  { path: '/user/:id', component: User },
  // 可重复的参数
  { path: '/user/:id+', component: User },  // 匹配 /user/1, /user/1/2
  { path: '/user/:id*', component: User },  // 匹配 /user, /user/1, /user/1/2
  // 可选参数
  { path: '/user/:id?', component: User },  // 匹配 /user, /user/1
  // 自定义正则
  { path: '/user/:id(\\d+)', component: User }  // 只匹配数字
]

// 组件中获取参数
export default {
  computed: {
    userId() {
      return this.$route.params.id
    }
  },
  watch: {
    '$route.params.id'(newId, oldId) {
      // 响应路由参数的变化
    }
  }
}
```

### 9.3 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        path: 'profile',
        component: UserProfile
      },
      {
        // 当 /user/:id/posts 匹配成功
        path: 'posts',
        component: UserPosts
      }
    ]
  }
]

// User.vue
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view></router-view>
  </div>
</template>
```

### 9.4 编程式导航

```javascript
// 字符串路径
this.$router.push('/home')

// 对象
this.$router.push({ path: '/home' })

// 命名的路由
this.$router.push({ name: 'user', params: { userId: '123' } })

// 带查询参数，变成 /register?plan=private
this.$router.push({ path: '/register', query: { plan: 'private' } })

// 替换当前路由（不留历史记录）
this.$router.replace('/home')

// 前进/后退
this.$router.go(1)   // 前进 1 页
this.$router.go(-1)  // 后退 1 页
this.$router.go(3)   // 前进 3 页
```

### 9.5 命名路由

```javascript
const routes = [
  {
    path: '/user/:id',
    name: 'user',
    component: User
  }
]

// 使用
<router-link :to="{ name: 'user', params: { id: 123 } }">User</router-link>

// 编程式导航
this.$router.push({ name: 'user', params: { id: 123 } })
```

### 9.6 命名视图

```javascript
const routes = [
  {
    path: '/',
    components: {
      default: Home,
      sidebar: Sidebar,
      footer: Footer
    }
  }
]

// 使用
<router-view></router-view>
<router-view name="sidebar"></router-view>
<router-view name="footer"></router-view>
```

### 9.7 重定向和别名

```javascript
const routes = [
  // 重定向
  { path: '/a', redirect: '/b' },
  { path: '/a', redirect: { name: 'foo' } },
  { path: '/a', redirect: to => {
    // 方法接收目标路由作为参数
    // return 重定向的字符串路径/路径对象
    return { path: '/b', query: { q: to.params.q } }
  }},
  
  // 别名
  { path: '/a', component: A, alias: '/b' },
  { path: '/a', component: A, alias: ['/b', '/c', '/d'] }
]
```

### 9.8 路由组件传参

```javascript
const routes = [
  // 布尔模式
  { path: '/user/:id', component: User, props: true },
  
  // 对象模式
  { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } },
  
  // 函数模式
  { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
]

// User.vue
export default {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
```

### 9.9 导航守卫

#### 全局前置守卫

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  // to: 即将进入的目标
  // from: 当前导航正要离开的路由
  // next: 必须调用该方法来 resolve 这个钩子
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

#### 全局解析守卫

```javascript
router.beforeResolve((to, from, next) => {
  // 在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后
  next()
})
```

#### 全局后置钩子

```javascript
router.afterEach((to, from) => {
  // 没有 next 函数
  console.log('导航完成')
})
```

#### 路由独享守卫

```javascript
const routes = [
  {
    path: '/foo',
    component: Foo,
    beforeEnter: (to, from, next) => {
      // ...
      next()
    }
  }
]
```

#### 组件内守卫

```javascript
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('确定要离开吗？')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
```

### 9.10 完整的导航解析流程

1. 导航被触发。
2. 调用失活组件的 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

---

## 10. 服务端渲染 (SSR)

### 10.1 什么是 SSR

Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

### 10.2 为什么使用 SSR

| 优势 | 说明 |
|------|------|
| **更好的 SEO** | 搜索引擎爬虫可以直接查看完全渲染的页面 |
| **更快的内容到达时间** | 无需等待 JavaScript 加载完成 |
| **更好的用户体验** | 首屏渲染更快 |

### 10.3 基础示例

#### 服务器端

```javascript
// server.js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是：{{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

#### 使用页面模板

```javascript
// template.html
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>

// server.js
const renderer = createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})
```

### 10.4 使用 Nuxt.js

Nuxt.js 是一个基于 Vue.js 的通用应用框架，它简化了 SSR 的配置过程。

```bash
# 创建项目
npx create-nuxt-app my-project

# 或使用 yarn
yarn create nuxt-app my-project
```

**项目结构**：

```
my-project/
├── assets/           # 资源文件
├── components/       # 组件
├── layouts/          # 布局
├── middleware/       # 中间件
├── pages/            # 页面（自动生成路由）
├── plugins/          # 插件
├── static/           # 静态文件
├── store/            # Vuex 状态树
├── nuxt.config.js    # Nuxt.js 配置
└── package.json
```

---

## 11. 测试

### 11.1 单元测试

使用 Jest + Vue Test Utils 进行单元测试。

```bash
# 安装依赖
npm install --save-dev jest @vue/test-utils vue-jest babel-jest
```

#### 测试组件

```javascript
// Counter.vue
<template>
  <div>
    <span class="count">{{ count }}</span>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

// Counter.spec.js
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('renders count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('increments count when button is clicked', () => {
    const wrapper = mount(Counter)
    wrapper.find('button').trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
  })
})
```

#### 测试 Props

```javascript
// Message.vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  props: ['message']
}
</script>

// Message.spec.js
import { mount } from '@vue/test-utils'
import Message from '@/components/Message.vue'

describe('Message.vue', () => {
  it('renders props.message', () => {
    const message = 'new message'
    const wrapper = mount(Message, {
      propsData: { message }
    })
    expect(wrapper.text()).toMatch(message)
  })
})
```

#### 测试事件

```javascript
// Button.vue
<template>
  <button @click="$emit('click', 'hello')">Click me</button>
</template>

// Button.spec.js
import { mount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button.vue', () => {
  it('emits click event with hello', () => {
    const wrapper = mount(Button)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click[0]).toEqual(['hello'])
  })
})
```

#### 测试 Vuex

```javascript
// store.spec.js
import mutations from '@/store/mutations'

describe('mutations', () => {
  it('increment', () => {
    const state = { count: 0 }
    mutations.increment(state)
    expect(state.count).toBe(1)
  })
})

// 组件测试
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Component from '@/components/Component.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Component.vue', () => {
  let store
  let actions

  beforeEach(() => {
    actions = {
      increment: jest.fn()
    }
    store = new Vuex.Store({
      state: {},
      actions
    })
  })

  it('dispatches increment', () => {
    const wrapper = mount(Component, {
      store,
      localVue
    })
    wrapper.find('button').trigger('click')
    expect(actions.increment).toHaveBeenCalled()
  })
})
```

### 11.2 端到端测试 (E2E)

使用 Cypress 进行端到端测试。

```bash
# 安装 Cypress
npm install --save-dev cypress
```

```javascript
// cypress/integration/example.spec.js
describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Welcome to Your Vue.js App')
  })

  it('Clicks the increment button', () => {
    cy.visit('/')
    cy.get('button').click()
    cy.get('.count').should('contain', '1')
  })
})
```

---

## 12. 最佳实践

### 12.1 组件设计原则

#### 单一职责原则

```javascript
// ❌ 错误：一个组件做太多事情
<user-profile
  :user="user"
  @update="updateUser"
  @delete="deleteUser"
  :show-posts="true"
  :show-friends="true"
/>

// ✅ 正确：拆分为多个组件
<user-card :user="user" @update="updateUser" @delete="deleteUser" />
<user-posts :user-id="user.id" />
<user-friends :user-id="user.id" />
```

#### 组件命名

```javascript
// 组件名应该始终是多个单词
// ❌ 错误
Vue.component('todo', {})

// ✅ 正确
Vue.component('todo-item', {})

// 基础组件名以 Base 开头
BaseButton.vue
BaseInput.vue
BaseCard.vue

// 单例组件以 The 开头
TheHeading.vue
TheSidebar.vue
TheFooter.vue

// 紧密耦合的组件名
TodoList.vue
TodoListItem.vue
TodoListItemButton.vue
```

#### Props 定义

```javascript
// ✅ 正确：详细的 props 定义
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}

// ❌ 错误：简单的数组形式
props: ['status']
```

### 12.2 性能优化

#### 路由懒加载

```javascript
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

#### 按需加载组件

```javascript
import Vue from 'vue'

// 完整引入
// import ElementUI from 'element-ui'

// 按需引入
import {
  Button,
  Select,
  Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
```

#### 使用计算属性缓存

```javascript
// ❌ 错误：每次都计算
<template>
  <div>{{ expensiveOperation() }}</div>
</template>

// ✅ 正确：使用计算属性缓存
<template>
  <div>{{ computedValue }}</div>
</template>

<script>
export default {
  computed: {
    computedValue() {
      return this.expensiveOperation()
    }
  }
}
</script>
```

#### 使用 v-once 渲染静态内容

```html
<div v-once>
  <h1>静态标题</h1>
  <p>这段内容不会被更新</p>
</div>
```

#### 使用 Object.freeze 冻结数据

```javascript
// 不需要响应式的数据
this.bigList = Object.freeze(bigList)
```

### 12.3 代码规范

#### 使用 ESLint + Prettier

```json
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}

// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none"
}
```

#### 组件风格指南

```vue
<!-- 组件模板 -->
<template>
  <div class="my-component">
    <!-- 内容 -->
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  
  components: {},
  
  props: {},
  
  data() {
    return {}
  },
  
  computed: {},
  
  watch: {},
  
  created() {},
  
  mounted() {},
  
  methods: {}
}
</script>

<style scoped>
.my-component {
  /* 样式 */
}
</style>
```

### 12.4 安全性

#### 避免 XSS 攻击

```html
<!-- ❌ 危险：直接渲染 HTML -->
<div v-html="userInput"></div>

<!-- ✅ 安全：使用文本插值 -->
<div>{{ userInput }}</div>

<!-- ✅ 安全：使用 DOMPurify 清理 -->
<div v-html="sanitize(userInput)"></div>

<script>
import DOMPurify from 'dompurify'

export default {
  methods: {
    sanitize(html) {
      return DOMPurify.sanitize(html)
    }
  }
}
</script>
```

#### 验证用户输入

```javascript
// 在提交前验证用户输入
methods: {
  submitForm() {
    if (!this.validateInput(this.form.username)) {
      alert('用户名格式错误')
      return
    }
    // 提交表单
  },
  validateInput(value) {
    const pattern = /^[a-zA-Z0-9_-]{3,16}$/
    return pattern.test(value)
  }
}
```

### 12.5 项目结构推荐

```
src/
├── api/              # API 请求
├── assets/           # 资源文件
├── components/       # 通用组件
│   ├── base/         # 基础组件
│   └── ui/           # UI 组件
├── directives/       # 自定义指令
├── filters/          # 过滤器
├── layouts/          # 布局组件
├── mixins/           # 混入
├── plugins/          # 插件
├── router/           # 路由
├── store/            # Vuex
│   ├── modules/      # 模块
│   ├── actions.js
│   ├── mutations.js
│   └── getters.js
├── styles/           # 全局样式
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue
└── main.js
```

---

## 总结

### Vue 2 高级教程核心要点

| 章节 | 核心概念 | 重要程度 |
|------|----------|----------|
| 动态组件与异步组件 | keep-alive、异步加载、代码分割 | ⭐⭐⭐⭐⭐ |
| 过渡与动画 | transition、CSS 过渡、JavaScript 钩子 | ⭐⭐⭐⭐ |
| 混入 | 选项合并、全局混入、自定义策略 | ⭐⭐⭐ |
| 自定义指令 | 钩子函数、参数、实用示例 | ⭐⭐⭐⭐ |
| 渲染函数与 JSX | createElement、虚拟 DOM、JSX | ⭐⭐⭐ |
| 插件 | 开发插件、使用插件 | ⭐⭐⭐⭐ |
| 过滤器 | 全局/局部过滤器、实用示例 | ⭐⭐⭐ |
| 状态管理 (Vuex) | State、Getter、Mutation、Action、Module | ⭐⭐⭐⭐⭐ |
| 路由 (Vue Router) | 动态路由、嵌套路由、导航守卫 | ⭐⭐⭐⭐⭐ |
| 服务端渲染 (SSR) | 基本概念、Nuxt.js | ⭐⭐⭐ |
| 测试 | 单元测试、端到端测试 | ⭐⭐⭐⭐ |
| 最佳实践 | 组件设计、性能优化、代码规范 | ⭐⭐⭐⭐⭐ |

### 学习路径建议

1. **掌握基础**：确保已掌握 Vue 2 基础教程内容
2. **深入学习**：重点学习 Vuex 和 Vue Router
3. **实战练习**：开发一个完整的单页应用
4. **进阶提升**：学习自定义指令、渲染函数
5. **性能优化**：掌握性能优化技巧
6. **测试实践**：编写单元测试和 E2E 测试

### 参考资源

- [Vue 2 官方文档](https://v2.cn.vuejs.org/)
- [Vuex 官方文档](https://v3.vuex.vuejs.org/zh/)
- [Vue Router 官方文档](https://v3.router.vuejs.org/zh/)
- [Vue Test Utils 文档](https://vue-test-utils.vuejs.org/)
- [Nuxt.js 官方文档](https://nuxtjs.org/)
