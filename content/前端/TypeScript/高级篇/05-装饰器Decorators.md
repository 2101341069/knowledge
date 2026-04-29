---
title: 装饰器Decorators
tags:
  - 前端
  - TypeScript
  - 装饰器
  - 元编程
created: 2026-04-29
---

# 装饰器（Decorators）

## 一、什么是装饰器？

装饰器是一种**元编程**特性，允许在不修改类源码的情况下，为类、方法、属性或参数添加额外功能。

> TypeScript 5.0 正式支持标准装饰器（TC39 Stage 3）。旧版装饰器（实验性）需要 `experimentalDecorators: true`。

---

### 1.1 启用装饰器

```json
// tsconfig.json（旧版实验性装饰器）
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // 需要 reflect-metadata
  }
}
```

```typescript
// 使用时需要安装
// npm install reflect-metadata
import 'reflect-metadata'
```

---

### 1.2 装饰器语法

```typescript
@decorator
class MyClass {}

class MyClass {
  @decorator
  property: string = ''

  @decorator
  method() {}

  method(@decorator param: string) {}
}
```

---

## 二、类装饰器

### 2.1 基础类装饰器

```typescript
// 类装饰器接收构造函数作为参数
function Component(target: Function) {
  console.log(`Component: ${target.name}`)
}

@Component
class UserCard {
  name: string = 'Tom'
}
// 打印: Component: UserCard
```

---

### 2.2 带参数的类装饰器（装饰器工厂）

```typescript
// 装饰器工厂：返回装饰器函数
function Component(selector: string) {
  return function(target: Function) {
    // 给类添加元数据
    Reflect.defineMetadata('selector', selector, target)
    console.log(`Registered component: ${selector}`)
  }
}

@Component('user-card')
class UserCard {}

@Component('nav-bar')
class NavBar {}
```

---

### 2.3 修改类

```typescript
// 给类添加属性或方法
function Serializable<T extends { new(...args: any[]): {} }>(Base: T) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this)
    }
    
    static deserialize(data: string): T {
      return Object.assign(new Base(), JSON.parse(data))
    }
  }
}

@Serializable
class User {
  constructor(
    public id: number,
    public name: string
  ) {}
}

const user = new User(1, 'Tom')
user.serialize()  // '{"id":1,"name":"Tom"}'
```

---

### 2.4 单例装饰器

```typescript
function Singleton<T extends { new(...args: any[]): {} }>(Base: T) {
  let instance: InstanceType<T> | null = null
  
  return class extends Base {
    constructor(...args: any[]) {
      if (instance) return instance
      super(...args)
      instance = this as any
    }
  }
}

@Singleton
class ConfigService {
  private config: Record<string, string> = {}
  
  set(key: string, value: string) {
    this.config[key] = value
  }
  
  get(key: string): string | undefined {
    return this.config[key]
  }
}

const s1 = new ConfigService()
const s2 = new ConfigService()
console.log(s1 === s2)  // true
```

---

## 三、方法装饰器

### 3.1 基础方法装饰器

```typescript
// 方法装饰器参数：
// - target: 类的原型（或构造函数，如果是静态方法）
// - propertyKey: 方法名
// - descriptor: 方法描述符
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}(${args.join(', ')})`)
    const result = originalMethod.apply(this, args)
    console.log(`${propertyKey} returned: ${result}`)
    return result
  }
  
  return descriptor
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b
  }
}

const calc = new Calculator()
calc.add(1, 2)
// Calling add(1, 2)
// add returned: 3
```

---

### 3.2 实用装饰器：性能监控

```typescript
function Measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  
  descriptor.value = async function(...args: any[]) {
    const start = performance.now()
    const result = await originalMethod.apply(this, args)
    const end = performance.now()
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`)
    return result
  }
  
  return descriptor
}

class DataService {
  @Measure
  async fetchUsers(): Promise<User[]> {
    const res = await fetch('/api/users')
    return res.json()
  }
}
```

---

### 3.3 实用装饰器：防抖

```typescript
function Debounce(delay: number = 300) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    let timeoutId: NodeJS.Timeout | null = null
    
    descriptor.value = function(...args: any[]) {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args)
      }, delay)
    }
    
    return descriptor
  }
}

class SearchBox {
  @Debounce(500)
  search(query: string): void {
    fetch(`/api/search?q=${query}`)
  }
}
```

---

### 3.4 实用装饰器：缓存

```typescript
function Memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const cache = new Map<string, any>()
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = originalMethod.apply(this, args)
    cache.set(key, result)
    return result
  }
  
  return descriptor
}

class MathService {
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n
    return this.fibonacci(n - 1) + this.fibonacci(n - 2)
  }
}
```

---

## 四、属性装饰器

```typescript
// 属性装饰器参数：
// - target: 类的原型
// - propertyKey: 属性名
function Required(target: any, propertyKey: string) {
  Reflect.defineMetadata('required', true, target, propertyKey)
}

function MinLength(min: number) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata('minLength', min, target, propertyKey)
  }
}

class UserForm {
  @Required
  @MinLength(2)
  name: string = ''

  @Required
  email: string = ''
  
  age: number = 0
}

// 使用 reflect-metadata 验证
function validate(obj: any): boolean {
  const proto = Object.getPrototypeOf(obj)
  const keys = Object.keys(obj)
  
  for (const key of keys) {
    const isRequired = Reflect.getMetadata('required', proto, key)
    if (isRequired && !obj[key]) {
      console.error(`${key} is required`)
      return false
    }
    
    const minLength = Reflect.getMetadata('minLength', proto, key)
    if (minLength && typeof obj[key] === 'string' && obj[key].length < minLength) {
      console.error(`${key} must be at least ${minLength} characters`)
      return false
    }
  }
  
  return true
}
```

---

## 五、参数装饰器

```typescript
// 参数装饰器参数：
// - target: 类的原型
// - propertyKey: 方法名
// - parameterIndex: 参数索引
function Validate(target: any, propertyKey: string, parameterIndex: number) {
  const existingValidators: number[] = 
    Reflect.getOwnMetadata('validate:params', target, propertyKey) || []
  existingValidators.push(parameterIndex)
  Reflect.defineMetadata('validate:params', existingValidators, target, propertyKey)
}

class UserController {
  createUser(
    @Validate name: string,
    @Validate email: string,
    age: number  // 不验证
  ) {
    console.log('Creating user:', name, email, age)
  }
}
```

---

## 六、装饰器执行顺序

```typescript
function ClassDec(target: Function) {
  console.log('ClassDec')
}

function MethodDec(target: any, key: string, desc: PropertyDescriptor) {
  console.log('MethodDec', key)
}

function PropDec(target: any, key: string) {
  console.log('PropDec', key)
}

@ClassDec
class Example {
  @PropDec
  name: string = ''

  @MethodDec
  greet() {}
}

// 执行顺序：
// PropDec name
// MethodDec greet
// ClassDec
// 属性 → 方法 → 类（从下到上、从内到外）
```

---

## 七、NestJS 风格的依赖注入

装饰器是框架中实现依赖注入的核心：

```typescript
// 简化版 DI 容器
const container = new Map<symbol, any>()

function Injectable() {
  return function(target: Function) {
    const token = Symbol(target.name)
    container.set(token, new (target as any)())
    Reflect.defineMetadata('injectable', token, target)
  }
}

function Inject(token: symbol) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return container.get(token)
      }
    })
  }
}

const USER_SERVICE = Symbol('UserService')

@Injectable()
class UserService {
  getAll(): User[] {
    return []
  }
}

class UserController {
  @Inject(USER_SERVICE)
  userService!: UserService

  getUsers() {
    return this.userService.getAll()
  }
}
```

---

## 总结

- **类装饰器**：修改或替换类的定义，常用于单例、序列化、注册
- **方法装饰器**：包装方法，实现日志、性能监控、防抖、缓存等
- **属性装饰器**：标记元数据，实现验证规则等
- **参数装饰器**：标记参数的元数据
- **执行顺序**：属性 → 方法 → 类，多个装饰器从下到上

装饰器是 Angular、NestJS 等框架的基础特性，理解它有助于深入框架开发。

下一篇：**[Mixins混入模式](./06-Mixins混入模式.md)**
