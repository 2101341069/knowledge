---
title: Vue3渲染函数与JSX
tags:
  - 前端
  - Vue
  - Vue3
  - 渲染函数
  - JSX
created: 2026-04-27
---

# Vue3渲染函数与JSX

## 基础渲染函数

### h() 函数基础

```javascript
import { h } from 'vue'

// 语法: h(tag, props, children)
const vnode = h(
  'div', // 标签
  { id: 'app', class: 'container' }, // 属性
  'Hello Vue3' // 子节点
)
```

### 组件中使用渲染函数

```javascript
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    const increment = () => count.value++

    return () =>
      h('div', { class: 'counter' }, [
        h('p', `Count: ${count.value}`),
        h('button', {
          onClick: increment,
          class: 'btn'
        }, 'Increment')
      ])
  }
}
```

### <script setup> 中使用

```vue
<script setup>
import { ref, h } from 'vue'

const count = ref(0)

const increment = () => count.value++

// 返回渲染函数
const render = () => h('div', [
  h('p', `Count: ${count.value}`),
  h('button', { onClick: increment }, '+1')
])
</script>

<template>
  <render />
</template>
```

## VNode 结构

### VNode 类型

```javascript
import { h, Fragment, Teleport, Suspense } from 'vue'

// 普通元素
h('div', 'Hello')

// 组件
import MyComponent from './MyComponent.vue'
h(MyComponent, { prop: 'value' })

// Fragment
h(Fragment, [
  h('li', 'Item 1'),
  h('li', 'Item 2')
])

// Teleport
h(Teleport, { to: '#modal' }, [
  h('div', 'Modal content')
])

// Suspense
h(Suspense, null, {
  default: h(AsyncComponent),
  fallback: h('div', 'Loading...')
})
```

### Props 对象详解

```javascript
h('div', {
  // 普通属性
  id: 'my-id',
  class: ['class-a', 'class-b'],
  style: { color: 'red', fontSize: '14px' },

  // DOM 属性
  innerHTML: '<span>HTML content</span>',
  innerText: 'Text content',

  // 事件
  onClick: (e) => console.log('Clicked', e),
  onKeyup: (e) => console.log('Key up', e),

  // 事件修饰符
  onClickCapture: () => {}, // capture 模式
  onKeyupOnce: () => {},     // once 修饰符
  onMouseoutPassive: () => {}, // passive 修饰符

  // 自定义指令
  directives: [
    {
      name: 'my-directive',
      value: 'directive value',
      arg: 'argument',
      modifiers: { foo: true }
    }
  ],

  // 插槽
  slots: {
    default: () => h('span', 'Default slot'),
    header: (props) => h('header', `Header: ${props.title}`)
  },

  // 特殊属性
  key: 'unique-key',
  ref: 'elementRef',
  ref_for: true,
  ref_key: 'customRefKey'
})
```

## 条件渲染与列表渲染

### 条件渲染

```javascript
import { ref, h } from 'vue'

export default {
  setup() {
    const show = ref(true)
    const user = ref({ name: 'John', isAdmin: true })

    return () => h('div', [
      // if
      show.value && h('p', 'Show is true'),

      // if-else
      user.value.isAdmin
        ? h('button', 'Admin Panel')
        : h('span', 'Guest user'),

      // switch
      h('div', [
        user.value.role === 'admin' && h('button', 'Manage Users'),
        user.value.role === 'editor' && h('button', 'Edit Content'),
        user.value.role === 'viewer' && h('span', 'View only')
      ])
    ])
  }
}
```

### 列表渲染

```javascript
import { ref, h } from 'vue'

export default {
  setup() {
    const items = ref([
      { id: 1, text: 'Item 1' },
      { id: 2, text: 'Item 2' },
      { id: 3, text: 'Item 3' }
    ])

    return () => h('ul',
      items.value.map(item =>
        h('li', { key: item.id }, item.text)
      )
    )
  }
}
```

## 插槽处理

### 使用插槽

```javascript
// 子组件
export default {
  setup(props, { slots }) {
    return () => h('div', { class: 'card' }, [
      // 默认插槽
      h('div', { class: 'card-body' }, slots.default?.()),

      // 具名插槽
      slots.header && h('div', { class: 'card-header' }, slots.header()),
      slots.footer && h('div', { class: 'card-footer' }, slots.footer())
    ])
  }
}
```

### 作用域插槽

```javascript
// 子组件
export default {
  setup(props, { slots }) {
    const items = ref([1, 2, 3])

    return () => h('ul',
      items.value.map(item =>
        h('li', { key: item },
          // 将数据传递给插槽
          slots.default?.({ item })
        )
      )
    )
  }
}

// 父组件使用
h(ListComponent, null, {
  default: ({ item }) => h('span', `Item ${item}`)
})
```

## JSX 语法

### 基础 JSX

```tsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    const increment = () => count.value++

    return () => (
      <div class="counter">
        <p>Count: {count.value}</p>
        <button onClick={increment}>Increment</button>
      </div>
    )
  }
})
```

### JSX 中的指令

```tsx
import { defineComponent, ref, vShow, withDirectives } from 'vue'

export default defineComponent({
  setup() {
    const show = ref(true)
    const inputValue = ref('')

    return () => (
      <div>
        {/* v-show */}
        {withDirectives(<p>Hello</p>, [[vShow, show.value]])}

        {/* v-model */}
        <input
          value={inputValue.value}
          onInput={(e) => inputValue.value = e.target.value}
        />

        {/* v-model (语法糖) */}
        <input v-model={inputValue.value} />
      </div>
    )
  }
})
```

### JSX 中的 Props

```tsx
interface Props {
  title: string
  count: number
  disabled?: boolean
}

export default defineComponent({
  props: {
    title: String,
    count: Number,
    disabled: Boolean
  },
  emits: ['update', 'delete'],
  setup(props: Props, { emit }) {
    return () => (
      <div>
        <h1>{props.title}</h1>
        <p>Count: {props.count}</p>
        <button
          disabled={props.disabled}
          onClick={() => emit('update', props.count + 1)}
        >
          Update
        </button>
      </div>
    )
  }
})
```

## 高级渲染模式

### 动态组件

```javascript
import { ref, h, resolveComponent } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

export default {
  setup() {
    const currentComponent = ref('ComponentA')
    const components = {
      ComponentA,
      ComponentB
    }

    return () => h('div', [
      h('select', {
        onChange: (e) => currentComponent.value = e.target.value
      }, [
        h('option', { value: 'ComponentA' }, 'Component A'),
        h('option', { value: 'ComponentB' }, 'Component B')
      ]),
      h(components[currentComponent.value])
    ])
  }
}
```

### 递归组件

```javascript
// TreeNode.js
import { h } from 'vue'

export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    return () => h('div', { class: 'tree-node' }, [
      h('span', props.node.name),
      props.node.children && h('div', { class: 'children' },
        props.node.children.map(child =>
          h(TreeNode, { node: child, key: child.id })
        )
      )
    ])
  }
}
```

### 函数式组件

```javascript
// 无状态函数式组件
const FunctionalButton = (props, { slots, attrs, emit }) => {
  return h('button', {
    class: ['btn', props.type],
    disabled: props.disabled,
    onClick: () => emit('click'),
    ...attrs
  }, slots.default?.())
}

FunctionalButton.props = {
  type: {
    type: String,
    default: 'primary'
  },
  disabled: Boolean
}

FunctionalButton.emits = ['click']
```

## 渲染优化

### memo 缓存

```javascript
import { h, memo } from 'vue'

const MemoizedComponent = memo((props) => {
  // 只有当 props.item 改变时才重新渲染
  return h('div', props.item.name)
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.item.id === nextProps.item.id
})
```

### 静态提升

```javascript
// 静态节点会被提升到渲染函数外
const staticHeader = h('header', { class: 'header' }, [
  h('h1', 'Static Title'),
  h('nav', 'Navigation')
])

export default {
  setup() {
    const dynamic = ref(0)

    return () => h('div', [
      staticHeader, // 静态，不会重新渲染
      h('p', `Dynamic: ${dynamic.value}`)
    ])
  }
}
```

### 内联模板

```javascript
// 避免不必要的函数调用
export default {
  setup() {
    const items = ref([1, 2, 3])

    // 内联方式 - 性能更好
    return () => h('ul',
      items.value.map(item => h('li', item))
    )
  }
}
```

## 自定义渲染器

### 创建自定义渲染器

```javascript
import { createRenderer } from 'vue'

const { createApp, render } = createRenderer({
  insert(el, parent, anchor) {
    // 自定义插入逻辑
    parent.insertBefore(el, anchor)
  },

  remove(el) {
    // 自定义删除逻辑
    const parent = el.parentNode
    if (parent) parent.removeChild(el)
  },

  createElement(type) {
    // 自定义元素创建
    return document.createElement(type)
  },

  createText(text) {
    // 自定义文本创建
    return document.createTextNode(text)
  },

  createComment(text) {
    // 自定义注释创建
    return document.createComment(text)
  },

  setText(node, text) {
    // 自定义文本设置
    node.nodeValue = text
  },

  setElementText(el, text) {
    // 自定义元素文本设置
    el.textContent = text
  },

  parentNode(node) {
    return node.parentNode
  },

  nextSibling(node) {
    return node.nextSibling
  },

  patchProp(el, key, prevValue, nextValue) {
    // 自定义属性设置
    if (key === 'style') {
      // 处理样式
    } else if (key.startsWith('on')) {
      // 处理事件
    } else {
      // 处理普通属性
      el.setAttribute(key, nextValue)
    }
  }
})

// 使用自定义渲染器
createApp(App).mount('#app')
```

## 实际应用场景

### 动态表格生成

```tsx
import { defineComponent, h, computed } from 'vue'

interface Column {
  key: string
  title: string
  render?: (row: any, index: number) => any
}

interface Props {
  columns: Column[]
  data: any[]
}

export default defineComponent({
  props: {
    columns: {
      type: Array as () => Column[],
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  setup(props: Props) {
    return () => (
      <table class="data-table">
        <thead>
          <tr>
            {props.columns.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((row, rowIndex) => (
            <tr key={row.id}>
              {props.columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
})
```

### 表单构建器

```tsx
import { defineComponent, ref, h, reactive } from 'vue'

interface Field {
  type: 'text' | 'select' | 'checkbox' | 'textarea'
  key: string
  label: string
  options?: { value: string; label: string }[]
}

export default defineComponent({
  props: {
    fields: {
      type: Array as () => Field[],
      required: true
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const formData = reactive({})

    const renderField = (field: Field) => {
      switch (field.type) {
        case 'text':
          return h('input', {
            type: 'text',
            value: formData[field.key],
            onInput: (e) => formData[field.key] = e.target.value
          })

        case 'select':
          return h('select', {
            value: formData[field.key],
            onChange: (e) => formData[field.key] = e.target.value
          }, field.options?.map(opt =>
            h('option', { value: opt.value }, opt.label)
          ))

        case 'checkbox':
          return h('input', {
            type: 'checkbox',
            checked: formData[field.key],
            onChange: (e) => formData[field.key] = e.target.checked
          })

        case 'textarea':
          return h('textarea', {
            value: formData[field.key],
            onInput: (e) => formData[field.key] = e.target.value
          })
      }
    }

    return () => h('form', {
      onSubmit: (e) => {
        e.preventDefault()
        emit('submit', { ...formData })
      }
    }, [
      props.fields.map(field =>
        h('div', { class: 'form-group', key: field.key }, [
          h('label', field.label),
          renderField(field)
        ])
      ),
      h('button', { type: 'submit' }, 'Submit')
    ])
  }
})
```

