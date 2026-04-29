---
title: 枚举Enum
tags:
  - 前端
  - TypeScript
  - 枚举
created: 2026-04-29
---

# 枚举（Enum）

## 一、什么是枚举？

枚举（Enum）是 TypeScript 特有的特性，用于定义**一组命名的常量**，使代码更具可读性和可维护性。

```typescript
// 没有枚举时，容易出错
const STATUS_PENDING = 0
const STATUS_ACTIVE = 1
const STATUS_INACTIVE = 2

// ❌ 允许传入任意数字，容易出错
function setStatus(status: number) {}
setStatus(99)  // 不会报错，但 99 没有意义

// ✅ 用枚举，限制合法值
enum Status {
  Pending,
  Active,
  Inactive
}

function setStatus(status: Status) {}
setStatus(Status.Active)  // ✅
setStatus(99)             // ❌ 报错
```

---

## 二、数字枚举（Numeric Enum）

### 2.1 基本用法

```typescript
// 从 0 开始自动递增
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right   // 3
}

console.log(Direction.Up)    // 0
console.log(Direction.Down)  // 1

// 访问方式
const dir: Direction = Direction.Left
```

---

### 2.2 自定义起始值

```typescript
// 指定起始值
enum Month {
  Jan = 1,  // 从 1 开始
  Feb,      // 2
  Mar,      // 3
  Apr,      // 4
  // ...
  Dec = 12  // 可以显式指定
}

console.log(Month.Jan)  // 1
console.log(Month.Feb)  // 2
```

---

### 2.3 反向映射

数字枚举有一个特性：可以通过值反向找到名称。

```typescript
enum Status {
  Pending = 0,
  Active = 1,
  Inactive = 2
}

// 正向：名称 -> 值
console.log(Status.Active)   // 1

// 反向：值 -> 名称
console.log(Status[1])       // 'Active'
console.log(Status[0])       // 'Pending'

// 常见用途：将后端返回的数字转为可读字符串
function getStatusText(code: number): string {
  return Status[code] ?? 'Unknown'
}
```

---

## 三、字符串枚举（String Enum）

### 3.1 基本用法

```typescript
// 字符串枚举：每个成员必须显式初始化
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

console.log(Color.Red)    // 'RED'
console.log(Color.Green)  // 'GREEN'
```

---

### 3.2 字符串枚举的优势

```typescript
enum ApiEndpoint {
  Users = '/api/users',
  Products = '/api/products',
  Orders = '/api/orders',
  Auth = '/api/auth'
}

// 语义清晰，调试时看到的是字符串而不是数字
async function fetchData(endpoint: ApiEndpoint) {
  const res = await fetch(endpoint)
  return res.json()
}

fetchData(ApiEndpoint.Users)      // ✅ 请求 /api/users
fetchData('/api/users')           // ❌ 不能用字符串
```

> 💡 字符串枚举没有反向映射，但更易读、调试友好。

---

## 四、常量枚举（Const Enum）

### 4.1 const enum 的作用

普通枚举编译后会生成一个对象，`const enum` 在编译时**直接内联值**，减少运行时开销：

```typescript
// 普通枚举编译后：
enum Directions {
  Up = 1,
  Down,
  Left,
  Right
}
// 编译结果：
// var Directions;
// (function (Directions) {
//   Directions[Directions["Up"] = 1] = "Up";
//   ...
// })(Directions || (Directions = {}));

// 使用处
const dir = Directions.Up  // 编译为：var dir = Directions.Up (1)

// ========================

// const 枚举编译后：
const enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

// 使用处 - 直接内联为字面量
const dir = Direction.Up  // 编译为：var dir = 1 /* Up */
// 完全不生成对象！
```

---

### 4.2 使用场景

```typescript
// 适合用 const enum 的场景：只需要值，不需要运行时对象
const enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalError = 500
}

function handleResponse(status: HttpStatus) {
  if (status === HttpStatus.OK) {
    // 编译后变为 if (status === 200)
  }
}
```

> ⚠️ `const enum` 不能反向映射，不能动态访问，不能在 `.d.ts` 中单独使用。

---

## 五、外部枚举（Declare Enum）

用于在声明文件中描述已经存在的枚举（通常来自 JS 库）：

```typescript
// 声明文件 .d.ts
declare enum ExternalEnum {
  A = 1,
  B,
  C
}

// 使用已有库中的枚举
declare const enum GlobalStatus {
  Active = 'active',
  Inactive = 'inactive'
}
```

---

## 六、枚举的高级用法

### 6.1 枚举成员作为类型

```typescript
enum ShapeKind {
  Circle,
  Square
}

interface Circle {
  kind: ShapeKind.Circle  // 限制为枚举的特定值
  radius: number
}

interface Square {
  kind: ShapeKind.Square
  sideLength: number
}

type Shape = Circle | Square

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case ShapeKind.Circle:
      return Math.PI * shape.radius ** 2
    case ShapeKind.Square:
      return shape.sideLength ** 2
  }
}
```

---

### 6.2 枚举的位运算（Flags）

```typescript
// 用于权限系统
enum Permission {
  None    = 0,
  Read    = 1 << 0,  // 1 (001)
  Write   = 1 << 1,  // 2 (010)
  Execute = 1 << 2,  // 4 (100)
  Admin   = Read | Write | Execute  // 7 (111)
}

// 组合权限
const userPermission = Permission.Read | Permission.Write  // 3 (011)

// 检查权限
function hasPermission(user: Permission, perm: Permission): boolean {
  return (user & perm) === perm
}

hasPermission(userPermission, Permission.Read)     // true
hasPermission(userPermission, Permission.Execute)  // false
hasPermission(Permission.Admin, Permission.Write)  // true
```

---

### 6.3 枚举迭代

```typescript
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

// 获取所有枚举值
const colorValues = Object.values(Color)
// ['RED', 'GREEN', 'BLUE']

// 获取所有枚举键
const colorKeys = Object.keys(Color)
// ['Red', 'Green', 'Blue']

// 检查值是否是枚举成员
function isColor(value: string): value is Color {
  return Object.values(Color).includes(value as Color)
}
```

---

## 七、枚举 vs 字面量联合类型

在现代 TypeScript 开发中，字面量联合类型经常替代枚举：

```typescript
// Enum 方式
enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}
function move(dir: Direction) {}
move(Direction.Up)

// ===========================

// 字面量联合方式
type Direction = 'up' | 'down' | 'left' | 'right'
function move(dir: Direction) {}
move('up')  // ✅ 更简洁
```

| 对比维度 | Enum | 字面量联合 |
|----------|------|------------|
| 代码量 | 较多 | 较少 |
| 可读性 | 高（有命名空间） | 中 |
| 运行时存在 | ✅ | ❌ 只在编译时 |
| 反向映射 | ✅（数字枚举） | ❌ |
| 可扩展（声明合并）| ❌ | ✅（type union） |
| IDE 自动补全 | ✅ | ✅ |

> 💡 **建议**：简单场景用字面量联合；需要迭代、反向映射、位运算时用枚举。

---

## 八、实战示例

### 8.1 HTTP 方法枚举

```typescript
const enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface RequestConfig {
  url: string
  method: HttpMethod
  data?: unknown
}

function request(config: RequestConfig) {
  return fetch(config.url, {
    method: config.method,
    body: JSON.stringify(config.data)
  })
}
```

---

### 8.2 用户角色权限

```typescript
enum UserRole {
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin'
}

const roleHierarchy: Record<UserRole, number> = {
  [UserRole.Guest]: 0,
  [UserRole.User]: 1,
  [UserRole.Moderator]: 2,
  [UserRole.Admin]: 3
}

function hasHigherRole(role: UserRole, minRole: UserRole): boolean {
  return roleHierarchy[role] >= roleHierarchy[minRole]
}

hasHigherRole(UserRole.Admin, UserRole.User)      // true
hasHigherRole(UserRole.Guest, UserRole.Moderator) // false
```

---

## 总结

- **数字枚举**：自动递增，支持反向映射，适合状态码
- **字符串枚举**：语义清晰，调试友好，不支持反向映射
- **常量枚举**：编译时内联，零运行时开销
- **位枚举**：用于权限等组合标志位场景
- **vs 字面量联合**：简单场景选联合类型，需要运行时对象/迭代时选枚举

下一篇：**[类型断言与类型守卫](./10-类型断言与类型守卫.md)**
