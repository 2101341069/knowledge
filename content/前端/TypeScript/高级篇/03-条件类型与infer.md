---
title: 条件类型与infer
tags:
  - 前端
  - TypeScript
  - 条件类型
  - infer
created: 2026-04-28
---

# 条件类型与 infer

## 一、条件类型基础

### 1.1 语法

```typescript
// 类似于三元运算符
A extends B ? X : Y
```

> 如果 A 是 B 的子类型，返回 X，否则返回 Y

---

### 1.2 简单示例

```typescript
type IsString<T> = T extends string ? 'yes' : 'no'

type A = IsString<'hello'>  // 'yes'
type B = IsString<42>       // 'no'
type C = IsString<string>   // 'yes'
type D = IsString<any>      // 'yes' | 'no' （any 特殊处理）
```

---

### 1.3 泛型约束的另一种写法

```typescript
// 写法一：extends 约束
function name<T extends string>(x: T): number {
  return x.length
}

// 写法二：条件类型 + never
function name<T>(x: T): T extends string ? number : never {
  return x.length as any
}
```

---

## 二、分布式条件类型

### 2.1 什么是分布式？

当条件类型作用于**联合类型**时，会变成**分布式**的：

```typescript
// T = A | B | C
// T extends U ? X : Y
// 变成
// (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)
```

```typescript
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// 分布式展开：
// (string extends any ? string[] : never) | 
// (number extends any ? number[] : never)
// = string[] | number[]
```

---

### 2.2 内置 Exclude / Extract 实现

```typescript
// 从 T 中排除可赋值给 U 的类型
type MyExclude<T, U> = T extends U ? never : T

type E = MyExclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'

// 从 T 中提取可赋值给 U 的类型
type MyExtract<T, U> = T extends U ? T : never

type F = MyExtract<'a' | 'b' | 'c', 'a' | 'b'>  // 'a' | 'b'
```

---

### 2.3 避免分布式（用括号包裹）

```typescript
// 分布式：返回 string | number
type Distributed<T> = T extends any ? T : never
type D1 = Distributed<string | number>  // string | number

// 非分布式（用 [] 包裹）：返回整个联合
type NonDistributed<T> = [T] extends [any] ? T : never
type D2 = NonDistributed<string | number>  // string | number
```

---

## 三、infer 关键字

### 3.1 infer 是什么？

`infer` 用于在条件类型中**声明一个类型变量**，用来**推断/提取**某些类型信息。

```typescript
// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

> 💡 infer = 推断，告诉 TS：我要提取这个位置的类型

---

### 3.2 基础示例：提取函数返回值

```typescript
function add(a: number, b: number): number {
  return a + b
}

type AddReturn = ReturnType<typeof add>  // number
```

执行过程：
1. 检查 `typeof add` 是否是函数类型
2. 是：把返回值位置的类型**推断**出来，存入 `R`
3. 返回 `R`，即 `number`

---

### 3.3 提取函数参数类型

```typescript
// 提取第一个参数类型
type FirstParam<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never

type FP = FirstParam<typeof add>  // number
```

```typescript
// 提取所有参数类型（内置 Parameters）
type MyParameters<T> = T extends (...args: infer P) => any ? P : never

type Params = MyParameters<typeof add>  // [number, number]
```

---

### 3.4 提取 Promise 中的类型

```typescript
// 递归提取 Promise 类型
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

// 测试
type X = Awaited<Promise<string>>         // string
type Y = Awaited<Promise<Promise<number>>>  // number（递归）
type Z = Awaited<boolean>                  // boolean（不是 Promise 原样返回）
```

---

### 3.5 提取数组元素类型

```typescript
type ElementType<T> = T extends (infer E)[] ? E : never

type Num = ElementType<number[]>  // number
type Str = ElementType<string[]>  // string
```

---

### 3.6 提取构造函数参数类型

```typescript
class User {
  constructor(public name: string, public age: number) {}
}

// 提取构造函数参数（内置 ConstructorParameters）
type CtorParams<T extends new (...args: any[]) => any> = 
  T extends new (...args: infer P) => any ? P : never

type UserParams = CtorParams<typeof User>  // [name: string, age: number]
```

---

### 3.7 提取实例类型

```typescript
// 内置 InstanceType
type MyInstanceType<T extends new (...args: any[]) => any> = 
  T extends new (...args: any[]) => infer R ? R : never

type UserInstance = MyInstanceType<typeof User>  // User
```

---

## 四、infer 高级用法

### 4.1 多个 infer 变量

```typescript
// 交换元组
type Swap<T> = T extends [infer A, infer B] ? [B, A] : never

type S = Swap<[1, 2]>  // [2, 1]
```

```typescript
// 提取函数的参数和返回值
type FunctionInfo<T> = T extends (...args: infer P) => infer R ? { args: P; return: R } : never

type AddInfo = FunctionInfo<typeof add>
// { args: [number, number]; return: number }
```

---

### 4.2 infer 与模板字面量

```typescript
// 提取 'prefix-' 后面的部分
type WithoutPrefix<T> = T extends `prefix-${infer Rest}` ? Rest : never

type Test = WithoutPrefix<'prefix-hello'>  // 'hello'
```

```typescript
// 提取事件名：onClick -> click
type EventName<T> = T extends `on${infer Event}` ? Uncapitalize<Event> : never

type Click = EventName<'onClick'>  // 'click'
```

---

### 4.3 infer 递归

```typescript
// 把所有 string 变成 number
type StringToNumber<T> = T extends string ? number :
  T extends [infer A, ...infer Rest] ? [StringToNumber<A>, ...StringToNumber<Rest>] :
  T extends object ? { [K in keyof T]: StringToNumber<T[K]> } :
  T

type TestInput = ['a', { b: 'hello' }, 'c']
type TestOutput = StringToNumber<TestInput>
// [number, { b: number }, number]
```

---

## 五、实战：实现内置工具类型

### 5.1 实现 ReturnType

```typescript
type MyReturnType<T extends (...args: any[]) => any> = 
  T extends (...args: any[]) => infer R ? R : never
```

### 5.2 实现 Parameters

```typescript
type MyParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any ? P : never
```

### 5.3 实现 Awaited

```typescript
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T
```

### 5.4 实现 Flatten（数组扁平化）

```typescript
type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T

type F1 = Flatten<number[]>        // number
type F2 = Flatten<number[][][]>    // number
type F3 = Flatten<[1, [2, [3]]]>   // 1 | 2 | 3
```

---

## 六、总结

✅ 条件类型 = 类型世界的 if-else
2. ✅ 分布式条件类型：联合类型自动展开
3. ✅ infer = 类型世界的解构赋值
4. ✅ infer 可以提取函数、Promise、数组等类型信息
5. ✅ infer + 递归 = 强大的类型变换能力

下一篇：**[模板字面量类型](./04-模板字面量类型.md)**
