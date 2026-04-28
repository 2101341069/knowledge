---
title: 映射类型MappedTypes
tags:
  - 前端
  - TypeScript
  - 映射类型
created: 2026-04-28
---

# 映射类型（Mapped Types）

## 一、什么是映射类型？

映射类型可以基于**已有类型**创建**新类型**，遍历已有类型的属性进行转换。

```typescript
// 把所有属性变成只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 使用
interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
// { readonly name: string; readonly age: number }
```

> 💡 本质：遍历 keyof 得到的联合类型，逐个处理每个属性

---

## 二、基础映射模式

### 2.1 语法解析

```typescript
type MyMappedType<T> = {
  [P in keyof T]: T[P]
  // ↑    ↑       ↑
  // 属性名 遍历   原类型
}
```

| 部分 | 说明 |
|------|------|
| `P` | 循环变量，代表每个属性名 |
| `in keyof T` | 遍历 T 的所有键 |
| `T[P]` | 原类型中 P 属性的类型 |

---

### 2.2 基础变换

```typescript
interface A {
  x: number
  y: string
}

// 1️⃣ 原样复制
type Copy<T> = { [P in keyof T]: T[P] }
type B = Copy<A>  // { x: number; y: string }

// 2️⃣ 全部变成 string
type AllString<T> = { [P in keyof T]: string }
type C = AllString<A>  // { x: string; y: string }

// 3️⃣ 全部变成可选
type Partial<T> = { [P in keyof T]?: T[P] }
type D = Partial<A>  // { x?: number; y?: string }

// 4️⃣ 全部变成只读
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type E = Readonly<A>  // { readonly x: number; readonly y: string }
```

---

## 三、添加或移除修饰符

### 3.1 可选 `?` 修饰符

```typescript
// 添加 ?（内置 Partial）
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 移除 ?（内置 Required）
type Required<T> = {
  [P in keyof T]-?: T[P]  // -? 表示移除可选
}

// 测试
interface User {
  name?: string
  age?: number
}

type RequiredUser = Required<User>
// { name: string; age: number } - 都变成必需
```

---

### 3.2 只读 `readonly` 修饰符

```typescript
// 添加 readonly（内置 Readonly）
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 移除 readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]  // -readonly 表示移除只读
}

// 测试
interface RoUser {
  readonly name: string
  readonly age: number
}

type MutableUser = Mutable<RoUser>
// { name: string; age: number } - 都变成可写
```

---

### 3.3 组合使用

```typescript
// 既可选又只读
type PartialReadonly<T> = {
  readonly [P in keyof T]?: T[P]
}

// 先移除所有修饰符，再添加自己的
type Clean<T> = {
  -readonly [P in keyof T]-?: T[P]
}
```

---

## 四、键名重映射（Key Remapping）

### 4.1 `as` 语法（TS 4.1+）

```typescript
type MappedTypeWithNewKeys<T> = {
  [P in keyof T as NewKeyType]: T[P]
  //            ↑
  //       重映射
}
```

---

### 4.2 添加前缀/后缀

```typescript
// 添加前缀
type AddPrefix<T, Prefix extends string> = {
  [P in keyof T as `${Prefix}${Capitalize<string & P>}`]: T[P]
}

interface User {
  name: string
  age: number
}

type Prefixed = AddPrefix<User, 'get'>
// { getName: string; getAge: number }
```

---

### 4.3 过滤属性

```typescript
// 排除 string 类型的属性
type ExcludeStringKeys<T> = {
  [P in keyof T as T[P] extends string ? never : P]: T[P]
}

interface User {
  name: string
  age: number
  active: boolean
}

type NonStringUser = ExcludeStringKeys<User>
// { age: number; active: boolean }  - 排除了 name
```

```typescript
// 按属性名过滤（内置 Pick 的另一种实现）
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 用 as 实现 Omit
type MyOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

---

## 五、深层映射

### 5.1 深层只读

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>  // 对象递归处理
    : T[P]
}

interface Nested {
  a: {
    b: {
      c: number
    }
  }
}

type DeepRo = DeepReadonly<Nested>
// {
//   readonly a: {
//     readonly b: {
//       readonly c: number
//     }
//   }
// }
```

---

### 5.2 深层可选

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}
```

---

## 六、映射类型实战

### 6.1 Getters 自动生成

```typescript
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P]
}

interface User {
  name: string
  age: number
}

type UserGetters = Getters<User>
// {
//   getName: () => string
//   getAge: () => number
// }
```

### 6.2 Setters 自动生成

```typescript
type Setters<T> = {
  [P in keyof T as `set${Capitalize<string & P>}`]: (value: T[P]) => void
}

type UserSetters = Setters<User>
// {
//   setName: (value: string) => void
//   setAge: (value: number) => void
// }
```

### 6.3 Event Emitter 类型

```typescript
type Events = {
  click: { x: number; y: number }
  focus: { target: string }
  blur: { target: string }
}

type EventHandler<T> = {
  [P in keyof T as `on${Capitalize<string & P>}`]: (event: T[P]) => void
}

type Handler = EventHandler<Events>
// {
//   onClick: (event: { x: number; y: number }) => void
//   onFocus: (event: { target: string }) => void
//   onBlur: (event: { target: string }) => void
// }
```

---

## 七、总结

✅ 映射类型 = 遍历 + 转换
2. ✅ 基础：`[P in keyof T]: T[P]`
3. ✅ 修饰符：`?` / `-?`、`readonly` / `-readonly`
4. ✅ 重映射：`as` 改变键名
5. ✅ 递归：实现深层映射

下一篇：**[条件类型与infer](./03-条件类型与infer.md)**
