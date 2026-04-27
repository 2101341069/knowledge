---
title: Vue 2 基础教程
tags:
  - 前端
  - Vue
  - Vue2
  - 框架
  - 教程
created: 2026-04-17
---

# Vue 2 基础教程

> Vue.js 是一套用于构建用户界面的渐进式框架。本教程系统讲解 Vue 2 的基础概念和核心特性。

## 目录

1. [Vue 简介](#1-vue-简介)
2. [安装与配置](#2-安装与配置)
3. [模板语法](#3-模板语法)
4. [计算属性和侦听器](#4-计算属性和侦听器)
5. [Class 与 Style 绑定](#5-class-与-style-绑定)
6. [条件渲染](#6-条件渲染)
7. [列表渲染](#7-列表渲染)
8. [事件处理](#8-事件处理)
9. [表单输入绑定](#9-表单输入绑定)
10. [组件基础](#10-组件基础)
11. [组件注册](#11-组件注册)
12. [Props](#12-props)
13. [自定义事件](#13-自定义事件)
14. [插槽](#14-插槽)

---

## 1. Vue 简介

### 1.1 什么是 Vue

Vue（读音 /vjuː/，类似于 view）是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。

### 1.2 Vue 的核心特性

| 特性 | 说明 |
|------|------|
| **声明式渲染** | 使用模板语法将数据声明式地渲染进 DOM |
| **响应式系统** | 数据变化时，视图自动更新 |
| **组件化** | 通过组件构建可复用的界面 |
| **虚拟 DOM** | 提高性能，减少直接 DOM 操作 |
| **渐进式** | 可以作为库使用，也可以作为完整框架 |

### 1.3 Vue 2 与 Vue 3 的区别

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| API 风格 | Options API | Composition API + Options API |
| 响应式原理 | Object.defineProperty | Proxy |
| 生命周期 | beforeCreate/created 等 | setup + onMounted 等 |
| 性能 | 较慢 | 更快 |
| TypeScript 支持 | 较弱 | 更好 |
| 组合式函数 | mixin | Composables |

### 1.4 渐进式框架的理解

```
声明式渲染 → 组件系统 → 客户端路由 → 大规模状态管理 → 构建工具
    ↓            ↓           ↓              ↓              ↓
  核心库      组件化        Vue Router      Vuex          Vue CLI
```

---

## 2. 安装与配置

### 2.1 直接引入 CDN

```html
<!-- 开发环境版本，包含帮助命令与警告 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>

<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.min.js"></script>
```

### 2.2 使用 Vue CLI 创建项目

```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 创建项目
vue create my-project

# 选择配置
? Please pick a preset:
  default (babel, eslint)
❯ Manually select features

# 手动选择特性
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

### 2.3 项目结构

```
my-project/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── router/
│   ├── store/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── .gitignore
├── babel.config.js
├── package.json
└── vue.config.js
```

### 2.4 第一个 Vue 应用

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Vue 示例</title>
</head>
<body>
  <div id="app">
    {{ message }}
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!'
      }
    })
  </script>
</body>
</html>
```

### 2.5 main.js 入口文件

```javascript
// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

---

## 3. 模板语法

### 3.1 插值

#### 文本插值

```html
<!-- 使用双大括号 -->
<span>消息: {{ msg }}</span>

<!-- v-once 只渲染一次 -->
<span v-once>这个将不会改变: {{ msg }}</span>
```

#### 原始 HTML

```html
<!-- v-html 输出原始 HTML -->
<div v-html="rawHtml"></div>

<script>
new Vue({
  data: {
    rawHtml: '<strong style="color: red;">这是红色文字</strong>'
  }
})
</script>
```

**⚠️ 安全警告**：在网站上动态渲染任意 HTML 是非常危险的，容易导致 XSS 攻击。只对可信内容使用 HTML 插值。

#### 属性绑定

```html
<!-- v-bind 绑定属性 -->
<div v-bind:id="dynamicId"></div>

<!-- 缩写 -->
<div :id="dynamicId"></div>

<!-- 布尔型属性 -->
<button v-bind:disabled="isButtonDisabled">按钮</button>

<!-- 动态绑定多个属性 -->
<div v-bind="objectOfAttrs"></div>

<script>
new Vue({
  data: {
    dynamicId: 'my-id',
    isButtonDisabled: true,
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper',
      style: 'color: red'
    }
  }
})
</script>
```

#### 使用 JavaScript 表达式

```html
<!-- 在模板中使用表达式 -->
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<!-- 在属性中使用 -->
<div v-bind:id="'list-' + id"></div>

<!-- 错误示例：这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 错误示例：流控制不会生效 -->
{{ if (ok) { return message } }}
```

### 3.2 指令

指令是带有 `v-` 前缀的特殊属性。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。

#### 参数

```html
<!-- v-bind 指令的参数是属性名 -->
<a v-bind:href="url">链接</a>

<!-- v-on 指令的参数是事件名 -->
<button v-on:click="doSomething">点击</button>
```

#### 动态参数

```html
<!-- 动态属性名 -->
<a v-bind:[attributeName]="url">链接</a>

<!-- 动态事件名 -->
<button v-on:[eventName]="doSomething">按钮</button>

<!-- 缩写形式 -->
<a :[attributeName]="url">链接</a>
<button @[eventName]="doSomething">按钮</button>

<script>
new Vue({
  data: {
    attributeName: 'href',
    eventName: 'click',
    url: 'https://vuejs.org'
  },
  methods: {
    doSomething() {
      alert('事件触发了')
    }
  }
})
</script>
```

**⚠️ 注意**：动态参数表达式有语法约束，不能使用空格、引号，且避免使用大写字符（浏览器会强制转为小写）。

#### 修饰符

```html
<!-- .prevent 修饰符表示调用 event.preventDefault() -->
<form v-on:submit.prevent="onSubmit">...</form>

<!-- .stop 修饰符阻止事件冒泡 -->
<button @click.stop="doThis">按钮</button>

<!-- .once 修饰符只触发一次 -->
<button @click.once="doThis">按钮</button>

<!-- .capture 使用事件捕获模式 -->
<div @click.capture="doThis">...</div>

<!-- .self 只当事件在该元素本身触发时触发 -->
<div @click.self="doThat">...</div>
```

### 3.3 指令缩写

```html
<!-- v-bind 缩写 -->
<a v-bind:href="url">...</a>
<a :href="url">...</a>

<!-- v-on 缩写 -->
<button v-on:click="doSomething">...</button>
<button @click="doSomething">...</button>
```

---

## 4. 计算属性和侦听器

### 4.1 计算属性

#### 基础示例

```html
<div id="example">
  <p>原始消息: "{{ message }}"</p>
  <p>计算后的反转消息: "{{ reversedMessage }}"</p>
</div>

<script>
new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
```

#### 计算属性缓存 vs 方法

```html
<!-- 计算属性 -->
<p>{{ reversedMessage }}</p>

<!-- 方法 -->
<p>{{ reversedMessageMethod() }}</p>

<script>
new Vue({
  data: {
    message: 'Hello'
  },
  computed: {
    reversedMessage: function () {
      console.log('计算属性被调用')
      return this.message.split('').reverse().join('')
    }
  },
  methods: {
    reversedMessageMethod: function () {
      console.log('方法被调用')
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
```

**区别**：
- **计算属性**：基于依赖缓存，只有依赖变化时才重新计算
- **方法**：每次调用都会执行

#### 计算属性的 setter

```html
<script>
new Vue({
  data: {
    firstName: 'John',
    lastName: 'Doe'
  },
  computed: {
    fullName: {
      // getter
      get: function () {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set: function (newValue) {
        var names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      }
    }
  }
})
</script>
```

### 4.2 侦听器

#### 基础示例

```html
<div id="watch-example">
  <p>
    问一个问题：
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>

<script>
new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: '先问一个问题！'
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      this.answer = '等待输入停止...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer: function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = '问题需要包含问号'
        return
      }
      this.answer = '思考中...'
      // 模拟 API 调用
      setTimeout(() => {
        this.answer = '这是一个示例答案'
      }, 1000)
    }
  }
})
</script>
```

#### 侦听器的选项

```javascript
new Vue({
  data: {
    user: {
      name: '张三',
      age: 25
    }
  },
  watch: {
    // 深度监听
    user: {
      handler: function (val, oldVal) {
        console.log('user 发生变化')
      },
      deep: true  // 深度监听对象内部变化
    },

    // 立即执行
    question: {
      handler: function (val) {
        console.log('question: ' + val)
      },
      immediate: true  // 立即执行一次
    }
  }
})
```

#### 计算属性 vs 侦听器

| 对比项 | 计算属性 | 侦听器 |
|--------|----------|--------|
| 适用场景 | 派生数据 | 异步操作、开销较大操作 |
| 缓存 | ✅ 有缓存 | ❌ 无缓存 |
| 返回值 | 必须返回值 | 不需要返回值 |
| 声明式 | ✅ 声明式 | 命令式 |
| 性能 | 更好 | 一般 |

---

## 5. Class 与 Style 绑定

### 5.1 绑定 HTML Class

#### 对象语法

```html
<!-- 激活 class -->
<div v-bind:class="{ active: isActive }"></div>

<!-- 多个 class -->
<div 
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>

<!-- 绑定对象 -->
<div v-bind:class="classObject"></div>

<script>
new Vue({
  data: {
    isActive: true,
    hasError: false,
    classObject: {
      active: true,
      'text-danger': false
    }
  }
})
</script>
```

#### 数组语法

```html
<!-- 数组语法 -->
<div v-bind:class="[activeClass, errorClass]"></div>

<!-- 条件切换 -->
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>

<!-- 数组中使用对象 -->
<div v-bind:class="[{ active: isActive }, errorClass]"></div>

<script>
new Vue({
  data: {
    activeClass: 'active',
    errorClass: 'text-danger',
    isActive: true
  }
})
</script>
```

#### 用在组件上

```html
<my-component class="baz boo"></my-component>

<my-component v-bind:class="{ active: isActive }"></my-component>

<script>
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})

new Vue({
  data: {
    isActive: true
  }
})
</script>

<!-- 渲染结果 -->
<p class="foo bar baz boo active">Hi</p>
```

### 5.2 绑定内联样式

#### 对象语法

```html
<!-- 对象语法 -->
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<!-- 绑定对象 -->
<div v-bind:style="styleObject"></div>

<script>
new Vue({
  data: {
    activeColor: 'red',
    fontSize: 30,
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
})
</script>
```

#### 数组语法

```html
<!-- 数组语法：应用多个样式对象 -->
<div v-bind:style="[baseStyles, overridingStyles]"></div>

<script>
new Vue({
  data: {
    baseStyles: {
      color: 'blue',
      fontSize: '14px'
    },
    overridingStyles: {
      color: 'red'  // 会覆盖 baseStyles 的 color
    }
  }
})
</script>
```

#### 自动添加前缀

```html
<!-- Vue 会自动添加浏览器前缀 -->
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

---

## 6. 条件渲染

### 6.1 v-if

```html
<!-- 单条件 -->
<div v-if="type === 'A'">
  A
</div>

<!-- v-else-if -->
<div v-else-if="type === 'B'">
  B
</div>

<div v-else-if="type === 'C'">
  C
</div>

<!-- v-else -->
<div v-else>
  Not A/B/C
</div>

<script>
new Vue({
  data: {
    type: 'A'
  }
})
</script>
```

### 6.2 用 key 管理可复用的元素

```html
<!-- 不使用 key：元素会被复用 -->
<template v-if="loginType === 'username'">
  <label>用户名</label>
  <input placeholder="输入用户名">
</template>
<template v-else>
  <label>邮箱</label>
  <input placeholder="输入邮箱">
</template>

<!-- 使用 key：元素会被重新创建 -->
<template v-if="loginType === 'username'">
  <label>用户名</label>
  <input placeholder="输入用户名" key="username-input">
</template>
<template v-else>
  <label>邮箱</label>
  <input placeholder="输入邮箱" key="email-input">
</template>
```

### 6.3 v-show

```html
<!-- v-show：切换 display 属性 -->
<h1 v-show="ok">Hello!</h1>

<script>
new Vue({
  data: {
    ok: true
  }
})
</script>
```

### 6.4 v-if vs v-show

| 对比项 | v-if | v-show |
|--------|------|--------|
| 渲染方式 | 条件为真才渲染 | 始终渲染 |
| 切换开销 | 高（销毁和重建） | 低（只切换 display） |
| 初始渲染开销 | 低（条件为假时不渲染） | 高（总是渲染） |
| 适用场景 | 条件很少改变 | 需要频繁切换 |
| 支持 v-else | ✅ 支持 | ❌ 不支持 |
| 支持 template | ✅ 支持 | ❌ 不支持 |

### 6.5 v-if 与 v-for 一起使用

```html
<!-- ❌ 不推荐：v-for 优先级高于 v-if -->
<ul>
  <li v-for="user in users" v-if="user.isActive">
    {{ user.name }}
  </li>
</ul>

<!-- ✅ 推荐：使用计算属性 -->
<ul>
  <li v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </li>
</ul>

<script>
new Vue({
  data: {
    users: [
      { id: 1, name: '张三', isActive: true },
      { id: 2, name: '李四', isActive: false },
      { id: 3, name: '王五', isActive: true }
    ]
  },
  computed: {
    activeUsers() {
      return this.users.filter(user => user.isActive)
    }
  }
})
</script>
```

---

## 7. 列表渲染

### 7.1 用 v-for 把一个数组映射为一组元素

```html
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>

<!-- 带索引 -->
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ index }} - {{ item.message }}
  </li>
</ul>

<script>
new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
</script>
```

### 7.2 在 v-for 里使用对象

```html
<!-- 遍历对象 -->
<ul id="v-for-object">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>

<!-- 带键名 -->
<div v-for="(value, key) in object">
  {{ key }}: {{ value }}
</div>

<!-- 带索引 -->
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>

<script>
new Vue({
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
</script>
```

### 7.3 维护状态 (key)

```html
<!-- ✅ 正确：使用唯一标识作为 key -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>

<!-- ❌ 错误：不要使用索引作为 key -->
<ul>
  <li v-for="(item, index) in items" :key="index">
    {{ item.name }}
  </li>
</ul>
```

**为什么不建议用索引作为 key？**
- 当列表项被删除或插入时，索引会变化
- Vue 会复用错误的 DOM 元素
- 导致状态混乱和性能问题

### 7.4 数组更新检测

#### 变更方法

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。

```javascript
new Vue({
  data: {
    items: ['a', 'b', 'c']
  },
  methods: {
    // ✅ 这些方法会触发视图更新
    pushItem() {
      this.items.push('d')  // 在数组末尾添加元素
    },
    popItem() {
      this.items.pop()  // 删除数组最后一个元素
    },
    shiftItem() {
      this.items.shift()  // 删除数组第一个元素
    },
    unshiftItem() {
      this.items.unshift('x')  // 在数组开头添加元素
    },
    spliceItem() {
      this.items.splice(1, 1, 'y')  // 删除并插入元素
    },
    sortItems() {
      this.items.sort()  // 排序
    },
    reverseItems() {
      this.items.reverse()  // 反转
    }
  }
})
```

#### 替换数组

变更方法会改变原始数组，而非变更方法会返回一个新数组。

```javascript
new Vue({
  data: {
    items: [1, 2, 3, 4, 5]
  },
  methods: {
    filterItems() {
      // ✅ 使用新数组替换旧数组
      this.items = this.items.filter(item => item % 2 === 0)
    },
    concatItems() {
      // ✅ 合并数组
      this.items = this.items.concat([6, 7, 8])
    },
    sliceItems() {
      // ✅ 切片
      this.items = this.items.slice(1, 3)
    }
  }
})
```

#### 注意事项

```javascript
new Vue({
  data: {
    items: ['a', 'b', 'c']
  },
  methods: {
    // ❌ 错误：Vue 不能检测以下变动
    badMethod1() {
      this.items[0] = 'x'  // 通过索引直接设置项
    },
    badMethod2() {
      this.items.length = 2  // 修改数组长度
    },

    // ✅ 正确：解决方法
    goodMethod1() {
      // Vue.set 或 this.$set
      this.$set(this.items, 0, 'x')
    },
    goodMethod2() {
      // splice
      this.items.splice(0, 1, 'x')
    },
    goodMethod3() {
      // 清空数组
      this.items.splice(0)
    }
  }
})
```

### 7.5 对象变更检测注意事项

```javascript
new Vue({
  data: {
    user: {
      name: '张三',
      age: 25
    }
  },
  methods: {
    // ❌ 错误：Vue 不能检测对象属性的添加
    badMethod() {
      this.user.email = 'zhangsan@example.com'
    },

    // ✅ 正确：Vue.set 或 this.$set
    goodMethod1() {
      this.$set(this.user, 'email', 'zhangsan@example.com')
    },

    // ✅ 正确：Object.assign 创建新对象
    goodMethod2() {
      this.user = Object.assign({}, this.user, {
        email: 'zhangsan@example.com'
      })
    },

    // ✅ 正确：展开运算符
    goodMethod3() {
      this.user = { ...this.user, email: 'zhangsan@example.com' }
    }
  }
})
```

### 7.6 显示过滤/排序后的结果

```html
<!-- 使用计算属性 -->
<ul>
  <li v-for="n in evenNumbers" :key="n">{{ n }}</li>
</ul>

<!-- 在计算属性不适用的情况下使用方法 -->
<ul>
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
</ul>

<script>
new Vue({
  data: {
    numbers: [1, 2, 3, 4, 5]
  },
  computed: {
    evenNumbers() {
      return this.numbers.filter(number => number % 2 === 0)
    }
  },
  methods: {
    even(numbers) {
      return numbers.filter(number => number % 2 === 0)
    }
  }
})
</script>
```

### 7.7 在 v-for 里使用值范围

```html
<!-- v-for 也可以接受整数 -->
<div>
  <span v-for="n in 10" :key="n">{{ n }} </span>
</div>
<!-- 输出：1 2 3 4 5 6 7 8 9 10 -->
```

### 7.8 在 template 上使用 v-for

```html
<!-- 在 template 上使用 v-for -->
<ul>
  <template v-for="item in items" :key="item.id">
    <li>{{ item.name }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

---

## 8. 事件处理

### 8.1 监听事件

```html
<!-- 简单事件处理 -->
<button v-on:click="counter += 1">加 1</button>
<p>按钮被点击了 {{ counter }} 次。</p>

<!-- 缩写形式 -->
<button @click="counter += 1">加 1</button>

<script>
new Vue({
  data: {
    counter: 0
  }
})
</script>
```

### 8.2 事件处理方法

```html
<!-- 调用方法 -->
<button v-on:click="greet">Greet</button>

<script>
new Vue({
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      // `this` 在方法里指向当前 Vue 实例
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM 事件
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
```

### 8.3 在内联语句中调用方法

```html
<!-- 内联处理器 -->
<button v-on:click="say('hi')">Say hi</button>
<button v-on:click="say('what')">Say what</button>

<!-- 访问原始 DOM 事件 -->
<button v-on:click="warn('表单不能提交', $event)">
  Submit
</button>

<script>
new Vue({
  methods: {
    say: function (message) {
      alert(message)
    },
    warn: function (message, event) {
      // 现在我们可以访问原生事件对象
      if (event) {
        event.preventDefault()
      }
      alert(message)
    }
  }
})
</script>
```

### 8.4 事件修饰符

```html
<!-- 阻止默认行为 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 阻止事件冒泡 -->
<div v-on:click.stop="doThis"></div>

<!-- 事件捕获模式 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当事件在该元素本身触发时触发 -->
<div v-on:click.self="doThat">...</div>

<!-- 只触发一次 -->
<button v-on:click.once="doThis"></button>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<div v-on:scroll.passive="onScroll">...</div>

<!-- 链式调用 -->
<div @click.stop.prevent="doThat"></div>
```

**修饰符顺序**：修饰符的顺序很重要，相应的代码会以顺序产生。

### 8.5 按键修饰符

```html
<!-- 按键别名 -->
<input v-on:keyup.enter="submit">
<input v-on:keyup.tab="submit">
<input v-on:keyup.delete="submit">
<input v-on:keyup.esc="submit">
<input v-on:keyup.space="submit">
<input v-on:keyup.up="submit">
<input v-on:keyup.down="submit">
<input v-on:keyup.left="submit">
<input v-on:keyup.right="submit">

<!-- 缩写 -->
<input @keyup.enter="submit">

<!-- 系统修饰键 -->
<!-- Ctrl + Enter -->
<input @keyup.ctrl.enter="submit">
<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>

<!-- Alt -->
<input @keyup.alt.enter="clear">
<!-- Shift -->
<input @keyup.shift.tab="nextInput">
<!-- Meta (Mac: Command, Windows: Win) -->
<input @keyup.meta="submit">

<!-- exact 修饰符：精确匹配组合键 -->
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>

<!-- 鼠标按钮修饰符 -->
<button @click.left="leftClick">左键</button>
<button @click.right="rightClick">右键</button>
<button @click.middle="middleClick">中键</button>
```

### 8.6 自定义按键修饰符

```javascript
// 全局配置
Vue.config.keyCodes = {
  v: 86,
  f1: 112,
  // camelCase 不可用
  mediaPlayPause: 179,
  // 取而代之的是 kebab-case 且用双引号括起来
  'media-play-pause': 179,
  up: [38, 87]
}
```

---

## 9. 表单输入绑定

### 9.1 基础用法

#### 文本

```html
<input v-model="message" placeholder="编辑我">
<p>消息是: {{ message }}</p>

<!-- 多行文本 -->
<textarea v-model="message" placeholder="多行文本"></textarea>
<p style="white-space: pre-line;">{{ message }}</p>

<script>
new Vue({
  data: {
    message: ''
  }
})
</script>
```

#### 复选框

```html
<!-- 单个复选框 -->
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>

<!-- 多个复选框绑定到同一个数组 -->
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>选中的名字: {{ checkedNames }}</span>
</div>

<script>
new Vue({
  data: {
    checked: false,
    checkedNames: []
  }
})
</script>
```

#### 单选按钮

```html
<div id="example-4">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>选中: {{ picked }}</span>
</div>

<script>
new Vue({
  data: {
    picked: ''
  }
})
</script>
```

#### 选择框

```html
<!-- 单选 -->
<div id="example-5">
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>选择: {{ selected }}</span>
</div>

<!-- 多选 -->
<div id="example-6">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>选择: {{ selected }}</span>
</div>

<!-- 动态渲染选项 -->
<select v-model="selected">
  <option v-for="option in options" :value="option.value" :key="option.value">
    {{ option.text }}
  </option>
</select>

<script>
new Vue({
  data: {
    selected: '',
    selected: [],
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
```

### 9.2 值绑定

```html
<!-- 复选框 -->
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>

<!-- 单选按钮 -->
<input type="radio" v-model="pick" v-bind:value="a">

<!-- 选择框选项 -->
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>

<script>
new Vue({
  data: {
    toggle: 'yes',  // 选中时为 'yes'，未选中时为 'no'
    pick: '',       // 选中时 vm.pick === vm.a
    selected: ''    // 选中时 typeof vm.selected === 'object'
  }
})
</script>
```

### 9.3 修饰符

#### .lazy

```html
<!-- 在 change 事件后同步更新而不是 input -->
<input v-model.lazy="msg">
```

#### .number

```html
<!-- 自动将用户输入转换为数值类型 -->
<input v-model.number="age" type="number">
```

#### .trim

```html
<!-- 自动过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg">
```

### 9.4 在组件上使用 v-model

```html
<!-- 自定义组件的 v-model -->
<custom-input v-model="searchText"></custom-input>

<script>
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

new Vue({
  data: {
    searchText: ''
  }
})
</script>
```

---

## 10. 组件基础

### 10.1 组件的定义

```javascript
// 全局注册
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">你点击了 {{ count }} 次。</button>'
})

// 局部注册
new Vue({
  el: '#app',
  components: {
    'button-counter': {
      data: function () {
        return {
          count: 0
        }
      },
      template: '<button v-on:click="count++">你点击了 {{ count }} 次。</button>'
    }
  }
})
```

### 10.2 组件的复用

```html
<!-- 可以复用任意多次 -->
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

**⚠️ 注意**：每用一次组件，就会有一个它的新**实例**被创建。

### 10.3 data 必须是一个函数

```javascript
// ❌ 错误：data 是对象
Vue.component('my-component', {
  data: {
    count: 0
  },
  template: '<button>{{ count }}</button>'
})

// ✅ 正确：data 是函数
Vue.component('my-component', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button>{{ count }}</button>'
})
```

### 10.4 组件的组织

```
components/
├── base/
│   ├── Button.vue
│   ├── Input.vue
│   └── Card.vue
├── layout/
│   ├── Header.vue
│   ├── Footer.vue
│   └── Sidebar.vue
└── features/
    ├── UserCard.vue
    └── ProductList.vue
```

---

## 11. 组件注册

### 11.1 组件名

```javascript
// kebab-case (推荐)
Vue.component('my-component-name', { /* ... */ })

// PascalCase
Vue.component('MyComponentName', { /* ... */ })
```

**最佳实践**：
- 注册组件时使用 PascalCase
- 在 DOM 中使用 kebab-case

### 11.2 全局注册

```javascript
// 全局注册：在所有组件中都可用
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

**优点**：方便，无需重复导入
**缺点**：打包时未被使用的组件也会打包进去

### 11.3 局部注册

```javascript
// 局部注册：只在当前组件中可用
import ComponentA from './ComponentA.vue'

new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA
  }
})

// 或者在模块系统中
export default {
  components: {
    ComponentA
  }
}
```

### 11.4 模块系统中的注册

#### 自动全局注册

```javascript
// src/components/base/index.js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

// require.context 是 Webpack 的 API
const requireComponent = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```

---

## 12. Props

### 12.1 Props 的基本用法

```html
<!-- 传递静态或动态 Prop -->
<blog-post title="我的旅程"></blog-post>
<blog-post v-bind:title="post.title"></blog-post>

<script>
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
</script>
```

### 12.2 Props 的类型

```javascript
// 简单数组形式
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']

// 对象形式，指定类型
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise
}
```

### 12.3 传递静态或动态 Prop

```html
<!-- 传递静态值 -->
<blog-post title="我的旅程"></blog-post>

<!-- 动态赋值 -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- 动态赋值一个复杂表达式 -->
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>

<!-- 传入一个数字 -->
<blog-post v-bind:likes="42"></blog-post>
<blog-post :likes="42"></blog-post>

<!-- 传入一个布尔值 -->
<blog-post v-bind:is-published="false"></blog-post>
<blog-post :is-published="false"></blog-post>

<!-- 传入一个数组 -->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 传入一个对象 -->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- 传入一个对象的所有属性 -->
<blog-post v-bind="post"></blog-post>

<!-- 等价于 -->
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### 12.4 单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。

```javascript
// ❌ 错误：直接修改 prop
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter++
  }
}

// ✅ 正确：使用 data 定义局部变量
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}

// ✅ 正确：使用计算属性
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

**⚠️ 注意**：在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身**将会**影响到父组件的状态。

### 12.5 Prop 验证

```javascript
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

#### 类型检查

`type` 可以是下列原生构造函数中的一个：
- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

额外的，`type` 还可以是一个自定义的构造函数，并且通过 `instanceof` 来进行检查确认。

```javascript
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}

Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

### 12.6 非 Prop 的属性

#### 替换/合并已有的属性

```html
<!-- 传入的属性会替换组件内部的属性 -->
<bootstrap-date-input
  data-date-picker="activated"
  class="date-picker-theme-dark"
></bootstrap-date-input>

<!-- 组件内部 -->
<input type="date" class="form-control">

<!-- 渲染结果 -->
<input type="date" class="date-picker-theme-dark" data-date-picker="activated">
```

#### 禁用属性继承

```javascript
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```

---

## 13. 自定义事件

### 13.1 事件名

不同于组件和 prop，事件名不存在任何自动化的大小写转换。而是触发的事件名需要完全匹配监听这个事件所用的名称。

```javascript
// ❌ 错误：无法监听
this.$emit('myEvent')

// ✅ 正确
this.$emit('my-event')
```

**推荐**：始终使用 kebab-case 的事件名。

### 13.2 自定义组件的 v-model

```javascript
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

// 使用
<custom-input v-model="searchText"></custom-input>
```

### 13.3 将原生事件绑定到组件

```html
<!-- 监听组件根元素的原生事件 -->
<base-input v-on:focus.native="onFocus"></base-input>

<!-- $listeners 属性 -->
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作正常
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

### 13.4 .sync 修饰符

```html
<!-- 2.3.0+ 新增 -->
<text-document v-bind:title.sync="doc.title"></text-document>

<!-- 等价于 -->
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>

<!-- 组件内部 -->
this.$emit('update:title', newTitle)

<!-- 同时设置多个 -->
<text-document v-bind.sync="doc"></text-document>
```

---

## 14. 插槽

### 14.1 插槽内容

```html
<!-- 组件定义 -->
<navigation-link url="/profile">
  Your Profile
</navigation-link>

<!-- 组件模板 -->
<a v-bind:href="url" class="nav-link">
  <slot></slot>
</a>

<!-- 渲染结果 -->
<a href="/profile" class="nav-link">
  Your Profile
</a>
```

### 14.2 编译作用域

```html
<!-- 父级模板里的所有内容都是在父级作用域中编译的 -->
<navigation-link url="/profile">
  Logged in as {{ user.name }}
  <!-- 这里访问的是父组件的 user -->
</navigation-link>

<!-- 子模板里的所有内容都是在子作用域中编译的 -->
<a v-bind:href="url" class="nav-link">
  <slot></slot>
  <!-- 这里如果使用 user，访问的是子组件的 user -->
</a>
```

### 14.3 后备内容

```html
<!-- 组件定义 -->
<submit-button></submit-button>

<!-- 组件模板 -->
<button type="submit">
  <slot>Submit</slot>
</button>

<!-- 渲染结果 -->
<button type="submit">Submit</button>

<!-- 如果提供了内容 -->
<submit-button>Save</submit-button>

<!-- 渲染结果 -->
<button type="submit">Save</button>
```

### 14.4 具名插槽

```html
<!-- 组件定义 -->
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>

<!-- 组件模板 -->
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

<!-- 渲染结果 -->
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>

<!-- 缩写 -->
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

### 14.5 作用域插槽

```html
<!-- 组件定义 -->
<todo-list v-bind:todos="todos">
  <template v-slot:todo="slotProps">
    <span v-if="slotProps.todo.isComplete">✓</span>
    {{ slotProps.todo.text }}
  </template>
</todo-list>

<!-- 组件模板 -->
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    <slot name="todo" v-bind:todo="todo">
      {{ todo.text }}
    </slot>
  </li>
</ul>

<!-- 解构插槽 Prop -->
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

### 14.6 独占默认插槽的缩写语法

```html
<!-- 完整语法 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>

<!-- 缩写语法 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>

<!-- ⚠️ 注意：默认插槽的缩写语法不能和具名插槽混用 -->
<!-- ❌ 错误写法 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>

<!-- ✅ 正确写法 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

---

## 总结

### Vue 2 基础教程核心要点

| 章节 | 核心概念 | 重要程度 |
|------|----------|----------|
| Vue 简介 | 渐进式框架、响应式系统 | ⭐⭐⭐ |
| 安装与配置 | CDN、Vue CLI、项目结构 | ⭐⭐⭐ |
| 模板语法 | 插值、指令、修饰符 | ⭐⭐⭐⭐⭐ |
| 计算属性 | 缓存、getter/setter、vs 方法 | ⭐⭐⭐⭐ |
| Class 与 Style 绑定 | 对象语法、数组语法 | ⭐⭐⭐⭐ |
| 条件渲染 | v-if vs v-show、key 管理 | ⭐⭐⭐⭐ |
| 列表渲染 | v-for、key、数组更新检测 | ⭐⭐⭐⭐⭐ |
| 事件处理 | 事件修饰符、按键修饰符 | ⭐⭐⭐⭐ |
| 表单输入绑定 | v-model、修饰符 | ⭐⭐⭐⭐⭐ |
| 组件基础 | 组件定义、复用、data 函数 | ⭐⭐⭐⭐⭐ |
| 组件注册 | 全局注册、局部注册 | ⭐⭐⭐⭐ |
| Props | 类型验证、单向数据流 | ⭐⭐⭐⭐⭐ |
| 自定义事件 | $emit、v-model、.sync | ⭐⭐⭐⭐⭐ |
| 插槽 | 默认插槽、具名插槽、作用域插槽 | ⭐⭐⭐⭐⭐ |

### 下一步学习

完成基础教程后，建议学习：
- **Vue 2 高级教程**：动态组件、过渡动画、Vuex、Vue Router
- **Vue 3 教程**：Composition API、新特性
- **实战项目**：Todo List、电商后台管理系统

### 参考资源

- [Vue 2 官方文档](https://v2.cn.vuejs.org/)
- [Vue 2 API 文档](https://v2.cn.vuejs.org/v2/api/)
- [Vue 2 示例](https://v2.cn.vuejs.org/v2/examples/)
- [Vue CLI 文档](https://cli.vuejs.org/zh/)
