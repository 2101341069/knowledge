---
title: 接口Interface
tags:
  - 前端
  - TypeScript
  - 接口
created: 2026-04-28
---

# 接口 Interface

## 一、什么是接口？

接口（Interface）是 TypeScript 的核心特性之一，用于**定义对象的结构形状**。

```typescript
// 定义用户对象的结构
interface User {
  name: string
  age: number
}

// 使用接口
const user: User = {
  name: 'Tom',
  age: 25
}
```

> 💡 接口就像一份契约，规定了对象必须有什么属性、什么类型。

---

## 二、接口基础语法

### 2.1 属性定义

```typescript
interface Person {
  // 必需属性
  name: string
  age: number
  
  // 可选属性（加 ?）
  email?: string
  
  // 只读属性（加 readonly）
  readonly id: number
}

const p: Person = {
  name: 'Tom',
  age: 25,
  id: 1  // 必须有 id
  // email 可选
}

p.id = 2  // ❌ 只读，不能修改
```

---

### 2.2 任意属性（索引签名）

```typescript
interface Dictionary {
  // 键是 string，值是 any
  [key: string]: any
}

const dict: Dictionary = {
  a: 1,
  b: 'hello',
  c: true
}
```

```typescript
interface NumberArray {
  // 数字索引
  [index: number]: number
}

const arr: NumberArray = [1, 2, 3]
arr[0]  // ✅ number
```

---

## 三、函数类型接口

### 3.1 定义函数形状

```typescript
// 定义一个函数类型
interface AddFunc {
  (a: number, b: number): number
}

const add: AddFunc = (x, y) => x + y
```

### 3.2 带属性的函数

```typescript
interface Counter {
  (start: number): string  // 函数调用签名
  increment(): void        // 方法
  reset(): void            // 方法
  count: number            // 属性
}

function createCounter(): Counter {
  let count = 0
  
  const counter = ((start: number) => {
    count = start
    return `Count: ${count}`
  }) as Counter
  
  counter.increment = () => count++
  counter.reset = () => count = 0
  counter.count = count
  
  return counter
}
```

---

## 四、接口继承（Extends）

### 4.1 单继承

```typescript
interface Animal {
  name: string
  eat(): void
}

// Dog 继承 Animal 的所有属性
interface Dog extends Animal {
  bark(): void
}

const dog: Dog = {
  name: '旺财',
  eat() {},  // 必须实现继承来的
  bark() {}   // 自己的
}
```

---

### 4.2 多继承

```typescript
interface CanEat {
  eat(): void
}

interface CanRun {
  run(): void
}

// 继承多个接口，用逗号分隔
interface Robot implements CanEat, CanRun {
  eat() {}
  run() {}
}
```

---

## 五、接口 vs 类型别名（Type）

### 5.1 相同点

都能定义对象结构：

```typescript
// Interface
interface UserI {
  name: string
  age: number
}

// Type Alias
type UserT = {
  name: string
  age: number
}
```

### 5.2 区别

| 特性 | Interface | Type |
|------|-----------|------|
| 同名自动合并 | ✅ 声明合并 | ❌ 不能重名 |
| 继承 | 用 `extends` | 用 `&` 交叉类型 |
| 定义原始类型/联合类型 | ❌ | ✅ |
| 映射类型 | ❌ | ✅ |

**声明合并示例**：
```typescript
// 两个同名接口会自动合并！
interface User {
  name: string
}
interface User {
  age: number
}

// 相当于
interface User {
  name: string
  age: number
}
```

> 💡 一般原则：**公共 API 用 interface，方便扩展；内部用 type**

---

## 六、可索引类型

### 6.1 字符串索引

```typescript
interface StringMap {
  [key: string]: string
}

const map: StringMap = {
  a: '1',
  b: '2'
}
```

### 6.2 数字索引

```typescript
interface NumArray {
  [index: number]: string
}

const arr: NumArray = ['a', 'b', 'c']
```

### 6.3 两种索引同时存在

```typescript
interface Arr {
  [index: number]: string
  [key: string]: any  // 字符串索引必须包含数字索引的类型
}
```

---

## 七、类实现接口（Implements）

### 7.1 基础用法

```typescript
interface Flyable {
  fly(): void
  speed: number
}

// 类实现接口
class Bird implements Flyable {
  speed: number = 10
  
  fly() {
    console.log('Flying at', this.speed)
  }
}
```

### 7.2 实现多个接口

```typescript
interface Eatable {
  eat(): void
}
interface Runnable {
  run(): void
}

class Dog implements Eatable, Runnable {
  eat() {}
  run() {}
}
```

> ⚠️ 接口只定义**公共**部分，不检查私有属性

---

## 八、混合类型（Hybrid Types）

一个对象可以同时是函数和对象：

```typescript
interface Counter {
  (start: number): string  // 可以当函数调用
  increment(): void        // 有方法
  reset(): void            // 有方法
  count: number            // 有属性
}

function getCounter(): Counter {
  let count = 0
  const counter = ((start: number) => {
    count = start
    return `Count: ${count}`
  }) as Counter
  
  counter.increment = () => count++
  counter.reset = () => count = 0
  counter.count = count
  
  return counter
}
```

---

## 九、接口中的 this 类型

```typescript
interface Chainable {
  value: number
  add(n: number): this  // 返回 this 实现链式调用
  multiply(n: number): this
}

class Calculator implements Chainable {
  value: number = 0
  
  add(n: number) {
    this.value += n
    return this  // ✔
  }
  
  multiply(n: number) {
    this.value *= n
    return this
  }
}

// 链式调用！
new Calculator()
  .add(10)
  .multiply(2)
  .value  // 20
```

---

## 十、实战场景

### 10.1 API 响应类型

```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
}

// 使用
const response: ApiResponse<User> = {
  code: 200,
  message: 'success',
  data: { id: 1, name: 'Tom' }
}
```

### 10.2 配置对象

```typescript
interface Config {
  apiUrl: string
  timeout?: number
  retry?: number
  debug?: boolean
  headers?: {
    [key: string]: string
  }
}

const defaultConfig: Config = {
  apiUrl: '/api',
  timeout: 5000
}
```

---

## 总结

✅ 接口定义对象结构形状
2. ✅ 支持可选属性 `?`、只读属性 `readonly`
3. ✅ 支持继承 `extends`、多继承
4. ✅ 支持声明合并（同名接口自动合并）
5. ✅ 类用 `implements` 实现接口
6. ✅ 索引签名、函数类型接口、混合类型

下一篇：**[类型别名Type](./04-类型别名Type.md)**
