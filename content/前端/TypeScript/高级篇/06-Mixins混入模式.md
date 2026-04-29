---
title: Mixins混入模式
tags:
  - 前端
  - TypeScript
  - Mixins
  - 设计模式
created: 2026-04-29
---

# Mixins 混入模式

## 一、为什么需要 Mixins？

TypeScript（和 JavaScript）的类**只支持单继承**。当需要从多个来源组合功能时，Mixin 模式提供了一种优雅的解决方案。

```typescript
// ❌ TS 不支持多继承
class C extends A, B {}  // 语法错误！

// ✅ Mixin 模式
class C extends applyMixins(A, B) {}
```

---

## 二、基础 Mixin 实现

### 2.1 函数式 Mixin（推荐）

```typescript
// Mixin 是一个接收基类并返回扩展类的函数
type Constructor<T = {}> = new (...args: any[]) => T

// 可飞行的 Mixin
function Flyable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    fly(height: number = 100): string {
      return `Flying at ${height}m!`
    }
    
    land(): string {
      return 'Landed safely.'
    }
  }
}

// 可游泳的 Mixin
function Swimmable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    swim(speed: number = 5): string {
      return `Swimming at ${speed}m/s!`
    }
    
    dive(depth: number = 10): string {
      return `Diving to ${depth}m!`
    }
  }
}

// 可攀爬的 Mixin
function Climbable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    climb(surface: string): string {
      return `Climbing ${surface}!`
    }
  }
}

// 基础类
class Animal {
  constructor(public name: string) {}
  
  eat(): string {
    return `${this.name} is eating.`
  }
}

// 组合多个能力
const FlyingSwimmingAnimal = Flyable(Swimmable(Animal))

class Duck extends FlyingSwimmingAnimal {
  quack(): string {
    return 'Quack!'
  }
}

const duck = new Duck('Donald')
duck.eat()        // 'Donald is eating.' （来自 Animal）
duck.fly()        // 'Flying at 100m!'   （来自 Flyable）
duck.swim()       // 'Swimming at 5m/s!' （来自 Swimmable）
duck.quack()      // 'Quack!'            （来自 Duck 自身）
```

---

### 2.2 使用接口声明类型

Mixin 类的类型不会自动合并，需要用接口声明：

```typescript
// 声明 Mixin 的接口
interface Flyable {
  fly(height?: number): string
  land(): string
}

interface Swimmable {
  swim(speed?: number): string
  dive(depth?: number): string
}

// 同名接口 + 类，TS 会合并类型
interface Duck extends Flyable, Swimmable {}

class Duck extends FlyingSwimmingAnimal {
  // ...
}
```

---

## 三、带约束的 Mixin

### 3.1 约束基类必须有特定属性

```typescript
// 要求基类必须有 name 属性
type WithName = Constructor<{ name: string }>

function Greetable<TBase extends WithName>(Base: TBase) {
  return class extends Base {
    greet(): string {
      return `Hello, I'm ${this.name}!`
    }
    
    farewell(): string {
      return `Goodbye from ${this.name}!`
    }
  }
}

class Person {
  constructor(public name: string, public age: number) {}
}

class GreetablePerson extends Greetable(Person) {}

const p = new GreetablePerson('Tom', 25)
p.greet()    // 'Hello, I'm Tom!'
p.farewell() // 'Goodbye from Tom!'
p.name       // 'Tom'
p.age        // 25
```

---

### 3.2 Mixin 之间共享状态

```typescript
// 日志 Mixin：记录操作历史
function WithHistory<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private history: string[] = []
    
    protected record(action: string): void {
      const timestamp = new Date().toISOString()
      this.history.push(`[${timestamp}] ${action}`)
    }
    
    getHistory(): string[] {
      return [...this.history]
    }
    
    clearHistory(): void {
      this.history = []
    }
  }
}

// 可撤销操作 Mixin
function Undoable<TBase extends Constructor<{ record(action: string): void }>>(Base: TBase) {
  return class extends Base {
    private undoStack: (() => void)[] = []
    
    protected pushUndo(action: () => void): void {
      this.undoStack.push(action)
    }
    
    undo(): boolean {
      const action = this.undoStack.pop()
      if (action) {
        action()
        this.record('Undo')
        return true
      }
      return false
    }
  }
}
```

---

## 四、Mixin 的实际应用

### 4.1 验证 Mixin

```typescript
type ValidationError = { field: string; message: string }

function Validatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private errors: ValidationError[] = []
    
    protected addError(field: string, message: string): void {
      this.errors.push({ field, message })
    }
    
    protected clearErrors(): void {
      this.errors = []
    }
    
    getErrors(): ValidationError[] {
      return [...this.errors]
    }
    
    isValid(): boolean {
      return this.errors.length === 0
    }
    
    validate(): boolean {
      this.clearErrors()
      // 子类可以调用 addError 添加验证错误
      return this.isValid()
    }
  }
}

class UserForm extends Validatable(class {}) {
  email: string = ''
  password: string = ''
  
  validate(): boolean {
    this.clearErrors()
    
    if (!this.email.includes('@')) {
      this.addError('email', '请输入有效的邮箱地址')
    }
    
    if (this.password.length < 8) {
      this.addError('password', '密码至少需要8位')
    }
    
    return this.isValid()
  }
}

const form = new UserForm()
form.email = 'invalid-email'
form.password = '123'
form.validate()           // false
form.getErrors()          // [{ field: 'email', ... }, { field: 'password', ... }]
```

---

### 4.2 事件发射器 Mixin

```typescript
type EventCallback<T = any> = (data: T) => void

function EventEmitter<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private listeners: Map<string, EventCallback[]> = new Map()
    
    on<T>(event: string, callback: EventCallback<T>): this {
      const callbacks = this.listeners.get(event) || []
      callbacks.push(callback)
      this.listeners.set(event, callbacks)
      return this
    }
    
    off(event: string, callback?: EventCallback): this {
      if (!callback) {
        this.listeners.delete(event)
      } else {
        const callbacks = this.listeners.get(event) || []
        this.listeners.set(event, callbacks.filter(cb => cb !== callback))
      }
      return this
    }
    
    emit<T>(event: string, data?: T): void {
      const callbacks = this.listeners.get(event) || []
      callbacks.forEach(cb => cb(data))
    }
    
    once<T>(event: string, callback: EventCallback<T>): this {
      const wrapper: EventCallback<T> = (data) => {
        callback(data)
        this.off(event, wrapper)
      }
      return this.on(event, wrapper)
    }
  }
}

class Store extends EventEmitter(class {}) {
  private state: Record<string, any> = {}
  
  set(key: string, value: any): void {
    const oldValue = this.state[key]
    this.state[key] = value
    this.emit('change', { key, oldValue, newValue: value })
  }
  
  get(key: string): any {
    return this.state[key]
  }
}

const store = new Store()
store.on('change', ({ key, newValue }) => {
  console.log(`${key} changed to ${newValue}`)
})
store.set('count', 42)  // count changed to 42
```

---

## 五、与接口的结合

```typescript
// 更完整的 Mixin 类型声明方式
interface Serializable {
  serialize(): string
}

interface Deserializable<T> {
  deserialize(json: string): T
}

// Mixin 实现
function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Serializable {
    serialize(): string {
      return JSON.stringify(this)
    }
  }
}

// 接口声明扩充
interface MyModel extends Serializable {}
class MyModel extends Serializable(class {
  id: number = 0
  name: string = ''
}) {}

const model = new MyModel()
model.serialize()  // '{"id":0,"name":""}'
```

---

## 六、Mixin vs 其他模式比较

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Mixin** | 灵活组合、代码复用 | 类型需要额外声明 |
| **多接口实现** | 类型清晰 | 每个类都要实现，不能共享实现 |
| **组合（Composition）** | 最灵活 | 需要手动委托 |
| **继承链** | 简单 | 单继承限制，耦合强 |

---

## 总结

- Mixin 解决了 TypeScript 单继承的限制，允许组合多个独立功能
- **实现方式**：接收基类的泛型函数，返回扩展后的新类
- **约束**：用 `Constructor<T>` 约束基类必须具备特定属性
- **类型声明**：用 `interface` 配合声明 Mixin 提供的类型
- **使用场景**：验证、日志、事件发射、序列化等横切关注点

下一篇：**[类型体操实战](./07-类型体操实战.md)**
