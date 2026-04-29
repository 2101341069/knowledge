---
title: 类Class
tags:
  - 前端
  - TypeScript
  - 类
  - 面向对象
created: 2026-04-29
---

# 类（Class）

## 一、TypeScript 中的类

TypeScript 完全支持 ES6 的 `class` 语法，并在其基础上增加了**类型注解**、**访问修饰符**、**抽象类**等特性。

```typescript
// 基本类定义
class Animal {
  name: string     // 属性声明（TS 要求提前声明）

  constructor(name: string) {
    this.name = name
  }

  speak(): void {
    console.log(`${this.name} makes a noise.`)
  }
}

const animal = new Animal('Cat')
animal.speak()  // Cat makes a noise.
```

---

## 二、属性与构造函数

### 2.1 属性初始化

```typescript
class User {
  // 属性声明
  id: number
  name: string
  email: string
  age: number = 0       // 有默认值
  role: string = 'user' // 有默认值
  createdAt = new Date() // 类型自动推断

  constructor(id: number, name: string, email: string) {
    this.id = id
    this.name = name
    this.email = email
  }
}
```

---

### 2.2 构造函数参数简写

TypeScript 提供了一种简洁的**参数属性**语法：

```typescript
class User {
  // 在构造函数参数前加修饰符，自动声明并赋值
  constructor(
    public id: number,
    public name: string,
    private email: string,
    protected age: number = 0,
    readonly createdAt: Date = new Date()
  ) {}
  // 等同于在类体中声明并在构造函数中赋值
}

const user = new User(1, 'Tom', 'tom@example.com')
user.id    // ✅ public
user.email // ❌ private 外部不可访问
```

---

## 三、访问修饰符

TypeScript 提供三种访问修饰符：

| 修饰符 | 访问范围 |
|--------|----------|
| `public`（默认） | 任何地方都可以访问 |
| `protected` | 类本身及其子类 |
| `private` | 仅类内部 |

```typescript
class BankAccount {
  public readonly id: string          // 公开只读
  protected balance: number           // 子类可访问
  private password: string            // 仅内部

  constructor(id: string, initialBalance: number, password: string) {
    this.id = id
    this.balance = initialBalance
    this.password = password
  }

  public getBalance(): number {
    return this.balance              // ✅ 可以访问 protected
  }

  private validatePassword(pwd: string): boolean {
    return this.password === pwd     // ✅ 可以访问 private
  }
}

class SavingsAccount extends BankAccount {
  private interestRate: number

  constructor(id: string, balance: number, pwd: string, rate: number) {
    super(id, balance, pwd)
    this.interestRate = rate
  }

  addInterest() {
    this.balance *= (1 + this.interestRate)  // ✅ 可访问 protected
    // this.password  // ❌ 不能访问 private
  }
}

const account = new BankAccount('001', 1000, 'secret')
account.getBalance()  // ✅
// account.balance    // ❌
// account.password   // ❌
```

---

### 3.1 ES 原生私有字段 `#`

TypeScript 也支持 ES2022 的原生私有字段（运行时真正私有）：

```typescript
class Person {
  #name: string         // 真正的私有字段
  #age: number

  constructor(name: string, age: number) {
    this.#name = name
    this.#age = age
  }

  getName() {
    return this.#name   // ✅
  }
}

const p = new Person('Tom', 25)
// p.#name  // ❌ 语法错误，运行时也无法访问
```

> 💡 `private` 是编译时检查，`#` 是运行时真正私有。推荐用 `#` 来保证安全。

---

## 四、继承（Inheritance）

### 4.1 extends 关键字

```typescript
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance}m.`)
  }
}

class Dog extends Animal {
  breed: string

  constructor(name: string, breed: string) {
    super(name)  // 必须调用 super()
    this.breed = breed
  }

  // 重写父类方法
  move(distance: number = 5): void {
    console.log('Dog is running...')
    super.move(distance)  // 调用父类方法
  }

  bark(): void {
    console.log('Woof! Woof!')
  }
}

const dog = new Dog('Rex', 'Labrador')
dog.bark()      // ✅
dog.move(10)    // ✅
dog.name        // ✅ 继承自父类
```

---

### 4.2 方法重写（Override）

TypeScript 4.3 新增 `override` 关键字，显式标记重写：

```typescript
class Base {
  greet(): string {
    return 'Hello from Base'
  }
}

class Derived extends Base {
  // override 关键字：明确这是在重写父类方法
  // 如果父类没有这个方法，会报错（防止拼写错误）
  override greet(): string {
    return 'Hello from Derived'
  }
}
```

---

## 五、只读属性与静态成员

### 5.1 readonly 属性

```typescript
class Config {
  readonly appName: string = 'MyApp'
  readonly version: string

  constructor(version: string) {
    this.version = version  // ✅ 构造函数中可以赋值
  }

  updateVersion() {
    // this.version = '2.0'  // ❌ readonly 不能修改
  }
}
```

---

### 5.2 static 静态成员

```typescript
class MathHelper {
  // 静态属性
  static readonly PI: number = 3.14159

  // 静态方法
  static add(a: number, b: number): number {
    return a + b
  }

  static createInstance() {
    return new MathHelper()
  }
}

// 通过类名访问，不需要实例
MathHelper.PI          // 3.14159
MathHelper.add(1, 2)   // 3

// 静态工厂方法
class Singleton {
  private static instance: Singleton | null = null
  private constructor() {}  // 私有构造函数

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}
```

---

## 六、抽象类（Abstract Class）

### 6.1 定义与使用

抽象类不能直接实例化，只能被继承：

```typescript
// 抽象类 - 模板方法模式
abstract class Shape {
  // 抽象方法：没有实现，子类必须实现
  abstract getArea(): number
  abstract getPerimeter(): number

  // 具体方法：提供默认实现
  describe(): string {
    return `面积: ${this.getArea().toFixed(2)}, 周长: ${this.getPerimeter().toFixed(2)}`
  }

  // 模板方法
  print(): void {
    console.log(this.describe())
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }

  getArea(): number {
    return Math.PI * this.radius ** 2
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number
  ) {
    super()
  }

  getArea(): number {
    return this.width * this.height
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height)
  }
}

// const s = new Shape()  // ❌ 抽象类不能实例化

const circle = new Circle(5)
circle.print()  // 面积: 78.54, 周长: 31.42

const rect = new Rectangle(4, 6)
rect.print()    // 面积: 24.00, 周长: 20.00
```

---

### 6.2 抽象类 vs 接口

| 特性 | 抽象类 | 接口 |
|------|--------|------|
| 实例化 | ❌ 不能 | ❌ 不能 |
| 实现方法 | ✅ 可以有具体实现 | ❌ 不能（只有签名） |
| 构造函数 | ✅ 可以有 | ❌ 不能 |
| 继承 | 单继承（extends） | 多实现（implements） |
| 访问修饰符 | ✅ 支持 | ❌ 都是 public |

---

## 七、类实现接口

```typescript
interface Serializable {
  serialize(): string
}

interface Printable {
  print(): void
}

// 类可以同时实现多个接口
class Document implements Serializable, Printable {
  constructor(private title: string, private content: string) {}

  serialize(): string {
    return JSON.stringify({ title: this.title, content: this.content })
  }

  print(): void {
    console.log(`--- ${this.title} ---\n${this.content}`)
  }
}
```

---

## 八、泛型类

```typescript
// 泛型类
class Repository<T extends { id: number }> {
  private items: Map<number, T> = new Map()

  add(item: T): void {
    this.items.set(item.id, item)
  }

  findById(id: number): T | undefined {
    return this.items.get(id)
  }

  findAll(): T[] {
    return Array.from(this.items.values())
  }

  delete(id: number): boolean {
    return this.items.delete(id)
  }

  count(): number {
    return this.items.size
  }
}

// 使用
interface User { id: number; name: string; email: string }
interface Product { id: number; name: string; price: number }

const userRepo = new Repository<User>()
userRepo.add({ id: 1, name: 'Tom', email: 'tom@example.com' })
userRepo.findById(1)?.name  // 'Tom'

const productRepo = new Repository<Product>()
productRepo.add({ id: 1, name: 'iPhone', price: 9999 })
```

---

## 九、类型兼容与结构类型

TypeScript 使用**结构类型**（鸭子类型），只要结构相同就兼容：

```typescript
class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Vector {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

// 结构相同，可以互相赋值
let p: Point = new Vector(1, 2)  // ✅ 结构兼容
```

---

## 十、实战示例：状态机

```typescript
type State = 'idle' | 'loading' | 'success' | 'error'

type Transition = {
  from: State
  to: State
  action: string
}

class StateMachine {
  private current: State
  private transitions: Transition[]

  constructor(initial: State, transitions: Transition[]) {
    this.current = initial
    this.transitions = transitions
  }

  dispatch(action: string): boolean {
    const transition = this.transitions.find(
      t => t.from === this.current && t.action === action
    )

    if (!transition) {
      console.warn(`No transition from '${this.current}' with action '${action}'`)
      return false
    }

    this.current = transition.to
    return true
  }

  getState(): State {
    return this.current
  }
}

// 定义请求的状态机
const requestMachine = new StateMachine('idle', [
  { from: 'idle', to: 'loading', action: 'fetch' },
  { from: 'loading', to: 'success', action: 'resolve' },
  { from: 'loading', to: 'error', action: 'reject' },
  { from: 'error', to: 'loading', action: 'retry' },
  { from: 'success', to: 'loading', action: 'refetch' },
])

requestMachine.dispatch('fetch')    // idle -> loading
requestMachine.dispatch('resolve')  // loading -> success
console.log(requestMachine.getState()) // 'success'
```

---

## 总结

- **访问修饰符**：`public` / `protected` / `private` 控制访问范围
- **构造函数简写**：参数加修饰符自动声明属性
- **继承**：`extends` 单继承，`super()` 调用父类
- **抽象类**：不可实例化，定义模板方法
- **接口实现**：`implements` 实现多个接口
- **泛型类**：类也可以泛型化，类型安全的容器

下一篇：**[枚举Enum](./09-枚举Enum.md)**
