---
title: 类型别名Type
tags:
  - 前端
  - TypeScript
  - 类型别名
created: 2026-04-29
---

# 类型别名（Type Alias）

## 一、什么是类型别名？

类型别名使用 `type` 关键字为任何类型起一个**新名字**，让代码更具可读性和复用性。

```typescript
// 基本语法
type 别名 = 类型

// 例如
type ID = string | number
type Username = string
type UserAge = number
```

> 💡 类型别名只是**起了个名字**，不会创建新类型，只是原类型的引用。

---

## 二、基础用法

### 2.1 原始类型别名

```typescript
// 让代码更有语义
type ID = number
type Name = string
type Flag = boolean

let userId: ID = 1
let userName: Name = 'Tom'
let isActive: Flag = true
```

---

### 2.2 联合类型别名

```typescript
// 常见的联合类型复用
type StringOrNumber = string | number
type Status = 'pending' | 'active' | 'inactive' | 'banned'
type Direction = 'up' | 'down' | 'left' | 'right'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 使用
let status: Status = 'active'   // ✅
let method: HttpMethod = 'GET'  // ✅
let wrong: Status = 'deleted'   // ❌ 不在允许范围内
```

---

### 2.3 对象类型别名

```typescript
// 对象结构
type User = {
  id: number
  name: string
  email: string
  age?: number     // 可选
  readonly createdAt: Date  // 只读
}

const user: User = {
  id: 1,
  name: 'Tom',
  email: 'tom@example.com',
  createdAt: new Date()
}
```

---

### 2.4 函数类型别名

```typescript
// 定义函数签名
type Add = (a: number, b: number) => number
type Callback = (err: Error | null, data?: any) => void
type EventHandler = (event: MouseEvent) => void

// 使用
const add: Add = (a, b) => a + b

function doAsync(cb: Callback) {
  try {
    cb(null, 'success')
  } catch (e) {
    cb(e as Error)
  }
}
```

---

## 三、类型别名的高级特性

### 3.1 泛型类型别名

```typescript
// 泛型类型别名
type Nullable<T> = T | null
type Optional<T> = T | undefined
type MaybeArray<T> = T | T[]
type Awaited<T> = T extends Promise<infer R> ? R : T

// 使用
type NullableString = Nullable<string>  // string | null
type OptionalUser = Optional<User>      // User | undefined

// 更实用的例子
type ApiData<T> = {
  code: number
  message: string
  data: Nullable<T>
}

type UserListResponse = ApiData<User[]>
// { code: number; message: string; data: User[] | null }
```

---

### 3.2 递归类型别名

```typescript
// 表示 JSON 值的类型（递归）
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

// 树形结构
type TreeNode<T> = {
  value: T
  children?: TreeNode<T>[]
}

const tree: TreeNode<string> = {
  value: 'root',
  children: [
    {
      value: 'child1',
      children: [
        { value: 'grandchild1' }
      ]
    },
    { value: 'child2' }
  ]
}
```

---

### 3.3 类型别名与交叉类型

```typescript
type HasId = { id: number }
type HasName = { name: string }
type HasEmail = { email: string }

// 组合成完整用户类型
type User = HasId & HasName & HasEmail

// 等同于
type User = {
  id: number
  name: string
  email: string
}

// 扩展已有类型
type AdminUser = User & {
  role: 'admin'
  permissions: string[]
}
```

---

## 四、Interface vs Type 详细对比

### 4.1 语法对比

```typescript
// 声明对象类型
interface UserI {
  name: string
  age: number
}

type UserT = {
  name: string
  age: number
}

// 两者在使用上完全相同
const u1: UserI = { name: 'Tom', age: 25 }
const u2: UserT = { name: 'Jerry', age: 30 }
```

---

### 4.2 关键区别

#### 区别 1：声明合并（interface 独有）

```typescript
// interface 同名会自动合并
interface Window {
  title: string
}
interface Window {
  ts: typeof import('typescript')
}
// 最终 Window = { title: string; ts: ... }

// type 同名会报错
type Window = { title: string }
type Window = { ts: any }  // ❌ Error: Duplicate identifier 'Window'
```

#### 区别 2：定义能力

```typescript
// type 可以定义原始类型别名
type ID = string | number   // ✅
type Name = string          // ✅

// interface 只能定义对象/函数结构
interface ID = string | number  // ❌ 语法错误

// type 可以定义元组
type Point = [number, number]

// type 可以使用 in 映射类型
type AllOptional<T> = { [P in keyof T]?: T[P] }  // ✅

// interface 不能使用 in 映射
interface AllOptional<T> { [P in keyof T]?: T[P] }  // ❌
```

#### 区别 3：继承方式

```typescript
// interface 用 extends 继承
interface Animal {
  name: string
}
interface Dog extends Animal {
  bark(): void
}

// type 用 & 交叉类型扩展
type Animal = { name: string }
type Dog = Animal & { bark(): void }
```

---

### 4.3 选择建议

| 场景 | 推荐 |
|------|------|
| 定义公共 API / 库的类型 | **interface** （声明合并，方便用户扩展） |
| 定义内部类型、联合类型 | **type** |
| 定义函数类型 | **type** 更简洁 |
| 需要泛型映射 | **type** |
| 类的结构约束（implements） | **interface** |

> 💡 在实际项目中，React 组件 Props 更倾向用 `interface`；工具函数的类型推导更倾向用 `type`。

---

## 五、类型别名实战示例

### 5.1 API 请求相关类型

```typescript
// HTTP 状态码
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500

// 请求配置
type RequestConfig = {
  url: string
  method: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, string | number>
  data?: unknown
  timeout?: number
}

// 统一响应格式
type ApiResponse<T = unknown> = {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页数据
type PaginatedData<T> = {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 使用
type UserListApi = ApiResponse<PaginatedData<User>>
```

---

### 5.2 组件 Props 类型

```typescript
// 按钮变体
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}
```

---

### 5.3 状态管理类型

```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error'

type AsyncState<T> = {
  status: LoadingState
  data: T | null
  error: string | null
}

// 使用
type UserState = AsyncState<User[]>

const initial: UserState = {
  status: 'idle',
  data: null,
  error: null
}
```

---

## 六、常见问题

### Q1：type 和 interface 哪个更好？

没有绝对答案。官方建议：
- 不确定时，优先用 `interface`
- 需要联合类型、映射类型、原始类型别名时，用 `type`

### Q2：type 可以重命名已有 type 吗？

```typescript
type A = string
type B = A  // ✅ B 是 A 的别名，都是 string
```

### Q3：type 能定义方法吗？

```typescript
type HasMethod = {
  greet(): string          // 方法签名
  greet: () => string      // 等价写法
}
```

---

## 总结

- `type` 关键字为任意类型创建别名
- 支持：原始类型、联合类型、对象、函数、元组、泛型
- **vs interface**：type 更灵活（支持联合/映射），interface 支持声明合并
- 实际项目中两者配合使用，各取所长

下一篇：**[联合类型与交叉类型](./05-联合类型与交叉类型.md)**
