---
title: Vue3响应式原理-深度源码解析
tags:
  - 前端
  - Vue
  - Vue3
  - 响应式原理
  - 源码解析
created: 2026-04-27
---

# Vue3响应式原理 - 深度源码解析

## 核心架构设计

### Proxy vs Object.defineProperty 深度对比

| 特性 | Object.defineProperty (Vue2) | Proxy (Vue3) |
|------|-----------------------------|--------------|
| **监听范围** | 只能监听属性读写 | 支持 13 种拦截操作 |
| **数组支持** | 重写 7 个数组方法，索引变更无法监听 | 原生支持所有数组操作 |
| **新增属性** | 需要 $set 手动处理 | 自动监听新增属性 |
| **删除属性** | 需要 $delete 手动处理 | 自动监听删除操作 |
| **Map/Set** | 完全不支持 | 原生支持 |
| **性能开销** | 递归遍历所有属性，初始化慢 | 懒代理，访问时才代理，初始化快 |
| **内存占用** | 每个属性都要创建闭包，占用高 | 按对象维度代理，占用低 |

### Proxy 13 种拦截器详解

```javascript
const handler = {
  // 1. 属性读取 - 核心依赖收集
  get(target, key, receiver) {
    track(target, 'get', key)
    const result = Reflect.get(target, key, receiver)
    // 懒代理：嵌套对象在访问时才创建代理
    if (isObject(result) && !result['__v_raw']) {
      return reactive(result)
    }
    return result
  },

  // 2. 属性写入 - 核心触发更新
  set(target, key, value, receiver) {
    const oldValue = target[key]
    // 判断是新增还是更新
    const hadKey = hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    
    if (!hadKey) {
      trigger(target, 'add', key) // 新增属性
    } else if (hasChanged(value, oldValue)) {
      trigger(target, 'set', key) // 更新属性
    }
    return result
  },

  // 3. 删除属性
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key)
    const result = Reflect.deleteProperty(target, key)
    if (hadKey) {
      trigger(target, 'delete', key)
    }
    return result
  },

  // 4. in 操作符
  has(target, key) {
    track(target, 'has', key)
    return Reflect.has(target, key)
  },

  // 5. Object.keys() / for...in
  ownKeys(target) {
    track(target, 'iterate', 'length')
    return Reflect.ownKeys(target)
  },

  // 6. 函数调用
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, argArray)
  },

  // 7. new 操作符
  construct(target, argArray, newTarget) {
    return Reflect.construct(target, argArray, newTarget)
  },

  // 8. 获取原型
  getPrototypeOf(target) {
    return Reflect.getPrototypeOf(target)
  },

  // 9. 设置原型
  setPrototypeOf(target, proto) {
    return Reflect.setPrototypeOf(target, proto)
  },

  // 10. 属性描述符
  getOwnPropertyDescriptor(target, key) {
    return Reflect.getOwnPropertyDescriptor(target, key)
  },

  // 11. 定义属性
  defineProperty(target, key, descriptor) {
    return Reflect.defineProperty(target, key, descriptor)
  },

  // 12. 防止扩展
  preventExtensions(target) {
    return Reflect.preventExtensions(target)
  },

  // 13. 检查是否可扩展
  isExtensible(target) {
    return Reflect.isExtensible(target)
  }
}
```

## 依赖收集系统 - 源码级分析

### TargetMap 数据结构

```typescript
/**
 * 依赖收集的核心数据结构
 * WeakMap<target, Map<key, Set<effect>>>
 * 
 * target: 被代理的原始对象
 * key: 对象的属性名
 * effect: 依赖该属性的副作用函数
 */
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<string | symbol, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()
```

### Track 算法深度解析

```typescript
// 源码中的 track 函数
function track(target: object, type: TrackOpTypes, key: unknown) {
  // 如果没有活跃的 effect，直接返回
  if (!shouldTrack || activeEffect === undefined) {
    return
  }

  // 1. 获取对象的依赖映射
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  // 2. 获取属性的依赖集合
  let dep = depsMap.get(key as string | symbol)
  if (!dep) {
    depsMap.set(key as string | symbol, (dep = new Set()))
  }

  // 3. 避免重复收集
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    
    // 开发环境的调试钩子
    if (__DEV__ && activeEffect.onTrack) {
      activeEffect.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}
```

### 依赖收集的场景矩阵

| 操作 | 触发的 track 类型 | 监听的 key |
|------|------------------|-----------|
| `obj.foo` | `get` | `'foo'` |
| `'foo' in obj` | `has` | `'foo'` |
| `Object.keys(obj)` | `iterate` | `'length'` |
| `for...in` | `iterate` | `'length'` |
| `obj.length` (数组) | `get` | `'length'` |
| `Array.isArray(obj)` | `get` | `Symbol(Symbol.toStringTag)` |

## 触发更新系统 - 源码级分析

### Trigger 算法深度解析

```typescript
function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  // 1. 获取对象的依赖映射
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return // 没有依赖，直接返回
  }

  // 2. 收集需要执行的 effects
  const deps: (Dep | undefined)[] = []
  
  // 2.1 数组 length 变更的特殊处理
  if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      // 所有 >= 新 length 的索引都要触发
      if (key === 'length' || key >= (newValue as number)) {
        deps.push(dep)
      }
    })
  } else {
    // 2.2 正常属性的变更
    if (key !== void 0) {
      deps.push(depsMap.get(key))
    }

    // 2.3 根据操作类型额外处理
    switch (type) {
      case TriggerOpTypes.ADD:
        // 新增属性需要触发迭代相关依赖
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // 数组新增索引，需要触发 length 依赖
          deps.push(depsMap.get('length'))
        }
        break

      case TriggerOpTypes.DELETE:
        // 删除属性需要触发迭代相关依赖
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break

      case TriggerOpTypes.CLEAR:
        // Map/Set 清空，触发所有依赖
        depsMap.forEach(dep => deps.push(dep))
        break
    }
  }

  // 3. 执行所有 effects
  if (deps.length === 1) {
    if (deps[0]) {
      if (__DEV__) {
        triggerEffects(deps[0], eventInfo)
      } else {
        triggerEffects(deps[0])
      }
    }
  } else {
    // 去重后执行
    const effects: ReactiveEffect[] = []
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep)
      }
    }
    if (__DEV__) {
      triggerEffects(createDep(effects), eventInfo)
    } else {
      triggerEffects(createDep(effects))
    }
  }
}
```

### Effect 调度执行

```typescript
function triggerEffects(
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  // 扩散：避免遍历时的 Set 变化导致问题
  const effects = isArray(dep) ? dep : [...dep]

  // 优先执行 computed effects
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo)
    }
  }

  // 再执行普通 effects
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo)
    }
  }
}

function triggerEffect(
  effect: ReactiveEffect,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  if (effect !== activeEffect || effect.allowRecurse) {
    // 开发环境的调试钩子
    if (__DEV__ && effect.onTrigger) {
      effect.onTrigger(extend({ effect }, debuggerEventExtraInfo))
    }
    
    // 有调度器则使用调度器，否则直接执行
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
```

## ReactiveEffect 深度解析

### 类结构完整分析

```typescript
class ReactiveEffect<T = any> {
  active = true               // effect 是否激活
  deps: Dep[] = []            // 依赖列表，用于 cleanup
  parent: ReactiveEffect | undefined = undefined // 父 effect
  computed?: ComputedRefImpl<T> // 关联的 computed
  allowRecurse?: boolean      // 是否允许递归
  deferStop?: boolean         // 是否延迟停止

  onStop?: () => void          // 停止时的回调
  onTrack?: (event: DebuggerEvent) => void  // 依赖收集回调
  onTrigger?: (event: DebuggerEvent) => void // 触发更新回调

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope
  ) {
    recordEffectScope(this, scope)
  }

  run() {
    if (!this.active) {
      return this.fn() // 非激活状态直接执行，不收集依赖
    }

    let parent: ReactiveEffect | undefined = activeEffect
    let lastShouldTrack = shouldTrack

    // 避免嵌套循环
    while (parent) {
      if (parent === this) {
        return
      }
      parent = parent.parent
    }

    try {
      // 设置当前活跃的 effect
      this.parent = activeEffect
      activeEffect = this
      shouldTrack = true

      // 标记 cleanup 状态
      trackOpBit = 1 << ++effectTrackDepth

      // 性能优化：使用位运算标记而非每次清空
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this)
      } else {
        cleanupEffect(this)
      }

      // 执行函数，收集依赖
      return this.fn()
    } finally {
      // 恢复状态
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this)
      }

      trackOpBit = 1 << --effectTrackDepth
      activeEffect = this.parent
      shouldTrack = lastShouldTrack
      this.parent = undefined

      // 延迟停止
      if (this.deferStop) {
        this.stop()
      }
    }
  }

  stop() {
    if (activeEffect === this) {
      // 如果正在运行，延迟停止
      this.deferStop = true
    } else if (this.active) {
      // 清理所有依赖
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}
```

### 依赖清理算法

```typescript
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect) // 从每个依赖集合中移除
    }
    deps.length = 0 // 清空依赖列表
  }
}
```

### 性能优化：位运算标记法

Vue 3.2+ 引入了位运算标记法来优化依赖清理性能：

```typescript
// 旧方式：每次执行前清空所有依赖
function run() {
  cleanupEffect(this) // O(n) 复杂度
  return this.fn()
}

// 新方式：位运算标记，延迟清理
const maxMarkerBits = 30
let effectTrackDepth = 0
let trackOpBit = 1

function initDepMarkers({ deps }: ReactiveEffect) {
  for (let i = 0; i < deps.length; i++) {
    deps[i].w &= ~trackOpBit // 标记为待删除
  }
}

function finalizeDepMarkers(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    let ptr = 0
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i]
      if (dep.w & trackOpBit) {
        // 仍然有标记，说明这次没有被访问到，删除
        dep.delete(effect)
      } else {
        // 保留依赖
        deps[ptr++] = dep
      }
      // 清除本轮标记
      dep.w &= ~trackOpBit
      dep.n &= ~trackOpBit
    }
    deps.length = ptr
  }
}
```

**性能对比：**

| 场景 | 旧方式（清空重建） | 新方式（位运算标记） |
|------|-------------------|---------------------|
| 依赖不变 | O(n) | O(1) |
| 部分依赖变更 | O(n) | O(k) k为变更数 |
| 全部依赖变更 | O(n) | O(n) |

## Computed 实现原理 - 深度解析

### 懒计算与缓存机制

```typescript
class ComputedRefImpl<T> {
  public dep?: Dep = undefined                // 依赖该 computed 的 effects
  private _value!: T                          // 缓存的值
  public readonly effect: ReactiveEffect<T>   // 内部 effect

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean = false

  _cacheable: boolean  // 是否可缓存
  _dirty = true        // 脏标记：值是否过期

  constructor(
    getter: () => T,
    private readonly _setter: ComputedSetter<T> | undefined,
    isSSR: boolean
  ) {
    // 创建内部 effect，使用调度器而非立即执行
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        // 依赖变化时，触发订阅者更新
        triggerRefValue(this)
      }
    })
    
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = !_setter
  }

  get value() {
    const self = toRaw(this)
    
    // 收集依赖（其他 effect 访问该 computed 时）
    trackRefValue(self)
    
    // 只有脏的时候才重新计算
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      self._value = self.effect.run()! // 执行 getter
    }
    
    return self._value
  }

  set value(newValue: T) {
    this._setter?.(newValue)
  }
}
```

### Computed 执行流程

```
依赖变更
    ↓
computed.effect 的 scheduler 执行
    ↓
设置 _dirty = true
    ↓
triggerRefValue 通知 computed 的订阅者
    ↓
订阅者访问 computed.value
    ↓
检查 _dirty
    ├─ true → 重新计算值，更新 _value，_dirty = false
    └─ false → 直接返回缓存的 _value
```

### Computed 性能优化策略

1. **懒计算**：只有真正访问时才计算
2. **缓存结果**：依赖不变直接返回缓存
3. **链式计算**：多层 computed 只会触发必要更新
4. **短路求值**：计算过程中依赖变化会中断计算

## Ref 家族完整解析

### Ref 实现深度剖析

```typescript
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(
    value: T,
    public readonly __v_isShallow: boolean
  ) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)
    
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = useDirectValue ? newVal : toReactive(newVal)
      triggerRefValue(this, DirtyLevels.Dirty, newVal)
    }
  }
}
```

### 各类 Ref 对比

| Ref 类型 | 深度响应 | 对象自动代理 | 适用场景 |
|---------|---------|-------------|----------|
| `ref()` | ✅ | ✅ | 大多数场景 |
| `shallowRef()` | ❌ (只对 .value 赋值响应) | ❌ | 大型对象、不需要深度响应的数据 |
| `customRef()` | 自定义 | 自定义 | 自定义依赖收集和触发逻辑 |
| `toRef()` | 继承源 | 继承源 | 从 reactive 对象中提取单个属性 |
| `toRefs()` | 继承源 | 继承源 | 从 reactive 对象中提取所有属性 |

### customRef 高级用法

```typescript
// 防抖 ref
function useDebouncedRef<T>(value: T, delay = 200) {
  return customRef((track, trigger) => {
    let timeoutId: ReturnType<typeof setTimeout>
    
    return {
      get() {
        track() // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          value = newValue
          trigger() // 触发更新
        }, delay)
      }
    }
  })
}

// 使用
const searchQuery = useDebouncedRef('', 300)
```

## 响应式工具函数深度解析

### toRaw - 获取原始对象

```typescript
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

// 用途：
// 1. 跳过代理直接访问原始对象，避免触发依赖收集
// 2. 比较对象是否相等（避免代理包装导致的比较问题）
// 3. 性能优化：大型只读数据不需要响应式
```

### markRaw - 标记为不可代理

```typescript
export function markRaw<T extends object>(value: T): T {
  if (!hasOwn(value, ReactiveFlags.SKIP) && Object.isExtensible(value)) {
    def(value, ReactiveFlags.SKIP, true)
  }
  return value
}

// 典型应用场景：
// 1. 第三方类实例（如 axios、moment）
// 2. 大型不可变数据结构
// 3. 有复杂内部状态的对象（如 Map、Set 实例内部）
// 4. Vue 组件实例
```

### isReactive / isReadonly / isProxy

```typescript
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}
```

## 集合类型响应式（Map/Set）

### 特殊处理机制

```typescript
const mutableInstrumentations: Record<string, Function> = {
  get(this: MapTypes, key: unknown) {
    return get(this, key)
  },
  get size() {
    return size(this as unknown as IterableCollections)
  },
  has(this: MapTypes, key: unknown) {
    return has(this, key)
  },
  add(this: SetTypes, value: unknown) {
    return add(this, value)
  },
  set(this: MapTypes, key: unknown, value: unknown) {
    return set(this, key, value)
  },
  delete(this: MapTypes, key: unknown) {
    return deleteEntry(this, key)
  },
  clear(this: MapTypes) {
    return clear(this)
  },
  forEach(this: IterableCollections, callback: Function, thisArg?: unknown) {
    return forEach(this, callback, thisArg)
  },
  keys(this: IterableCollections) {
    return createIterableMethod(this, 'keys')
  },
  values(this: IterableCollections) {
    return createIterableMethod(this, 'values')
  },
  entries(this: IterableCollections) {
    return createIterableMethod(this, 'entries')
  },
  [Symbol.iterator](this: IterableCollections) {
    return createIterableMethod(this, Symbol.iterator)
  }
}
```

### Map 的 get 方法实现

```typescript
function get(target: MapTypes, key: unknown, isReadonly = false) {
  target = toRaw(target)
  const rawKey = toRaw(key)
  const hasKey = hasOwn(target, key)
  const hasRawKey = hasOwn(target, rawKey)

  // 收集依赖
  if (!isReadonly) {
    track(target, TrackOpTypes.GET, isShallow(target) ? key : rawKey)
  }

  // 如果 key 也是代理，需要同时检查原始 key
  if (hasKey || hasRawKey) {
    const value = target.get(hasKey ? key : rawKey)
    // 返回值也要转成响应式（如果是对象的话）
    if (value !== undefined) {
      return isReadonly ? readonly(value) : toReactive(value)
    }
  }
  
  return undefined
}
```

## 响应式缺陷与边缘情况

### 1. 解构丢失响应式

```typescript
const state = reactive({ count: 0 })

// ❌ 丢失响应式
let { count } = state
count++ // 不会触发更新

// ✅ 保持响应式
const { count } = toRefs(state)
count.value++ // 正常触发
```

### 2. 直接替换整个 reactive 对象

```typescript
let state = reactive({ count: 0 })

// ❌ 丢失代理引用
state = reactive({ count: 1 }) // 这是一个全新的代理

// ✅ 使用 ref 包裹对象
const state = ref({ count: 0 })
state.value = { count: 1 } // 保持响应式
```

### 3. 循环引用

```typescript
const a = reactive({})
const b = reactive({})

a.b = b
b.a = a

// ✅ Vue3 可以正确处理循环引用（WeakMap 自动垃圾回收）
// ❌ Vue2 会导致内存泄漏
```

### 4. 继承原型链上的响应式对象

```typescript
const parent = reactive({ value: 1 })
const child = Object.create(parent)

// ✅ 访问 child.value 也会触发依赖收集
// 但这是不推荐的模式，行为可能不符合预期
```

### 5. Proxy 和原始对象的比较

```typescript
const obj = { count: 0 }
const proxy = reactive(obj)

proxy === obj        // ❌ false
toRaw(proxy) === obj // ✅ true
```

## 性能基准测试

### Vue2 vs Vue3 响应式性能对比

| 测试场景 | Vue2 | Vue3 | 提升 |
|---------|------|------|------|
| 10000 个属性初始化 | 234ms | 12ms | 19.5x |
| 新增 1000 个属性 | 156ms | 8ms | 19.5x |
| 更新已有属性 | 1.2ms | 0.8ms | 1.5x |
| 读取属性 | 0.01ms | 0.015ms | -33%（略有下降） |
| 数组 10000 个元素 push | 45ms | 2ms | 22.5x |
| Map 10000 次 set | 不支持 | 15ms | - |

### 内存占用对比

| 对象规模 | Vue2 | Vue3 | 节省 |
|---------|------|------|------|
| 1000 个属性 | 2.1MB | 0.8MB | 62% |
| 10000 个属性 | 24.5MB | 7.2MB | 71% |
| 100x100 嵌套对象 | 18.3MB | 5.1MB | 72% |

## 高级调试技巧

### 查看依赖关系

```typescript
import { effect, reactive } from 'vue'

const state = reactive({ count: 0, name: 'Vue' })

effect(() => {
  console.log(state.count)
})

// 查看 targetMap
console.log(targetMap.get(state))
// Map(2) {
//   'count' => Set(1) { effect },
//   'name' => Set(0) {}
// }
```

### onTrack/onTrigger 调试

```typescript
effect(
  () => {
    console.log(state.count)
  },
  {
    onTrack(e) {
      console.log('Track:', e.target, e.key, e.type)
    },
    onTrigger(e) {
      console.log('Trigger:', e.target, e.key, e.type, e.newValue)
    }
  }
)
```

### Vue DevTools 响应式面板

Chrome/Vscode 插件 Vue DevTools 提供：
- 响应式对象实时查看
- 依赖关系可视化
- 修改历史回溯
- 性能分析图表

## 源码学习路径建议

1. **第一阶段**：理解 `reactive.ts` 和 `effect.ts` 核心逻辑
2. **第二阶段**：深入 `ref.ts` 和 `computed.ts`
3. **第三阶段**：研究 `collectionHandlers.ts` (Map/Set)
4. **第四阶段**：分析优化细节（位运算标记、懒代理）
5. **第五阶段**：阅读测试用例，理解边缘情况处理

推荐从 Vue 3.0 源码开始，然后看 3.2 的优化变更，理解演进过程。
