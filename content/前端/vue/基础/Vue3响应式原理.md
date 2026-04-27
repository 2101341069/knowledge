---
title: Vue3响应式原理
tags:
  - 前端
  - Vue
  - Vue3
  - 响应式原理
created: 2026-04-27
---

# Vue3响应式原理

## Proxy vs Object.defineProperty

### Vue2 的局限性

```javascript
// Vue2 使用 Object.defineProperty
const data = { count: 0 }

Object.defineProperty(data, 'count', {
  get() {
    // 依赖收集
    return value
  },
  set(newValue) {
    // 触发更新
    value = newValue
  }
})

// ❌ 无法监听新增属性
data.newProp = 'value' // 非响应式

// ❌ 无法监听数组索引和长度
data.arr[0] = 'new' // 非响应式
data.arr.length = 5 // 非响应式
```

### Vue3 的 Proxy

```javascript
const data = { count: 0 }

const proxy = new Proxy(data, {
  get(target, key, receiver) {
    // 依赖收集
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    // 触发更新
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  },
  deleteProperty(target, key) {
    // 监听删除
    const result = Reflect.deleteProperty(target, key)
    trigger(target, key)
    return result
  },
  has(target, key) {
    // 监听 in 操作符
    track(target, key)
    return Reflect.has(target, key)
  },
  ownKeys(target) {
    // 监听 Object.keys()
    track(target, 'length')
    return Reflect.ownKeys(target)
  }
})
```

## reactive 实现原理

### 简化版实现

```javascript
function reactive(target) {
  return createReactiveObject(target)
}

function createReactiveObject(target) {
  // 如果已经是代理，直接返回
  if (target['__v_isReactive']) {
    return target
  }
  
  // 只处理对象和数组
  if (typeof target !== 'object' || target === null) {
    return target
  }
  
  const proxy = new Proxy(target, {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
  })
  
  proxy['__v_isReactive'] = true
  return proxy
}
```

### 依赖收集 (Track)

```javascript
const targetMap = new WeakMap()
let activeEffect = null

function track(target, key) {
  if (!activeEffect) return
  
  // 获取对象的依赖映射
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  
  // 获取属性的依赖集合
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  
  // 收集当前副作用
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
}
```

### 触发更新 (Trigger)

```javascript
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  
  const effects = depsMap.get(key)
  if (effects) {
    effects.forEach(effect => {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    })
  }
}
```

## ref 实现原理

```javascript
function ref(value) {
  return createRef(value)
}

function createRef(rawValue, shallow = false) {
  // 如果已经是 ref，直接返回
  if (rawValue['__v_isRef']) {
    return rawValue
  }
  
  return new RefImpl(rawValue, shallow)
}

class RefImpl {
  constructor(value, shallow) {
    this.__v_isRef = true
    this._rawValue = value
    this._value = shallow ? value : toReactive(value)
    this.dep = new Set()
  }
  
  get value() {
    // 依赖收集
    trackRefValue(this)
    return this._value
  }
  
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = this._shallow ? newValue : toReactive(newValue)
      // 触发更新
      triggerRefValue(this)
    }
  }
}
```

## computed 实现原理

```javascript
function computed(getterOrOptions) {
  let getter, setter
  
  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions
    setter = () => {
      console.warn('computed is readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  
  return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
  constructor(getter, setter) {
    this.__v_isRef = true
    this._dirty = true // 脏标记
    this._value = undefined
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
  }
  
  get value() {
    trackRefValue(this)
    
    // 只有脏的时候才重新计算
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    
    return this._value
  }
  
  set value(newValue) {
    this.setter(newValue)
  }
}
```

## Effect 副作用

```javascript
class ReactiveEffect {
  constructor(fn, scheduler = null) {
    this.fn = fn
    this.scheduler = scheduler
    this.active = true
    this.deps = []
  }
  
  run() {
    if (!this.active) {
      return this.fn()
    }
    
    // 设置当前激活的 effect
    activeEffect = this
    
    try {
      // 执行函数，触发依赖收集
      return this.fn()
    } finally {
      activeEffect = null
    }
  }
  
  stop() {
    if (this.active) {
      // 清除所有依赖
      cleanupEffect(this)
      this.active = false
    }
  }
}

function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn)
  
  if (options.scheduler) {
    _effect.scheduler = options.scheduler
  }
  
  // 立即执行一次
  _effect.run()
  
  // 返回 runner
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
```

## 响应式转换规则

| 原始值 | reactive | ref |
|--------|----------|-----|
| 基本类型 | ❌ | ✅ |
| 普通对象 | ✅ | ✅ |
| 数组 | ✅ | ✅ |
| Map/Set | ✅ | ✅ |
| Date | ✅ | ✅ |

## 响应式检测 API

```javascript
import { isReactive, isReadonly, isProxy, isRef } from 'vue'

const reactiveObj = reactive({ count: 0 })
const refValue = ref(0)
const readonlyObj = readonly(reactiveObj)

isReactive(reactiveObj) // true
isReactive(refValue)    // false
isReadonly(readonlyObj) // true
isProxy(reactiveObj)    // true
isProxy(readonlyObj)    // true
isRef(refValue)         // true
isRef(reactiveObj)      // false
```

## 调试响应式

### onTrack / onTrigger

```javascript
watchEffect(
  () => {
    /* 副作用 */
  },
  {
    onTrack(e) {
      // 当响应式属性被追踪时调用
      console.log('Tracked:', e.target, e.key)
    },
    onTrigger(e) {
      // 当响应式属性变更触发时调用
      console.log('Triggered:', e.target, e.key, e.newValue)
    }
  }
)
```

## 常见问题

### 解构丢失响应式

```javascript
// ❌ 解构会丢失响应式
const { count } = reactive({ count: 0 })
count++ // 不会触发更新

// ✅ 使用 toRefs 保持响应式
const state = reactive({ count: 0 })
const { count } = toRefs(state)
count.value++ // 正常工作
```

### 替换整个对象

```javascript
// ❌ 替换整个对象会丢失响应式
let state = reactive({ count: 0 })
state = reactive({ count: 1 }) // 这是一个新的代理

// ✅ 使用 ref 包裹对象
const state = ref({ count: 0 })
state.value = { count: 1 } // 保持响应式
```

### 数组直接修改索引

```javascript
const arr = reactive([1, 2, 3])

// ✅ Vue3 支持，Vue2 不支持
arr[0] = 100 // 响应式更新
arr.length = 5 // 响应式更新
```

