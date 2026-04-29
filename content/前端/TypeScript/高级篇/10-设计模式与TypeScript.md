---
title: 设计模式与TypeScript
tags:
  - 前端
  - TypeScript
  - 设计模式
  - 架构
created: 2026-04-29
---

# 设计模式与 TypeScript

TypeScript 的类型系统让经典设计模式的实现更加安全和清晰。本章介绍常用设计模式的 TypeScript 实现。

---

## 一、创建型模式

### 1.1 单例模式（Singleton）

确保一个类只有一个实例：

```typescript
class Database {
  private static instance: Database | null = null
  private connection: string = ''

  // 私有构造函数，防止外部实例化
  private constructor(url: string) {
    this.connection = url
    console.log(`Connected to ${url}`)
  }

  // 获取唯一实例
  static getInstance(url: string = 'mongodb://localhost:27017'): Database {
    if (!Database.instance) {
      Database.instance = new Database(url)
    }
    return Database.instance
  }

  query(sql: string): any {
    console.log(`Executing: ${sql} on ${this.connection}`)
    return []
  }

  // 测试时重置实例（仅测试环境）
  static reset(): void {
    Database.instance = null
  }
}

const db1 = Database.getInstance()
const db2 = Database.getInstance()
console.log(db1 === db2)  // true - 同一个实例
```

---

### 1.2 工厂方法模式（Factory Method）

定义创建对象的接口，由子类决定实例化哪个类：

```typescript
// 抽象产品
interface Logger {
  log(message: string): void
  error(message: string): void
  warn(message: string): void
}

// 具体产品
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`)
  }
  error(message: string): void {
    console.error(`[ERROR] ${message}`)
  }
  warn(message: string): void {
    console.warn(`[WARN] ${message}`)
  }
}

class FileLogger implements Logger {
  constructor(private filePath: string) {}
  
  log(message: string): void {
    // 写入文件...
    console.log(`Writing to ${this.filePath}: [LOG] ${message}`)
  }
  error(message: string): void {
    console.log(`Writing to ${this.filePath}: [ERROR] ${message}`)
  }
  warn(message: string): void {
    console.log(`Writing to ${this.filePath}: [WARN] ${message}`)
  }
}

// 工厂
type LoggerType = 'console' | 'file'

interface LoggerConfig {
  type: LoggerType
  filePath?: string
}

function createLogger(config: LoggerConfig): Logger {
  switch (config.type) {
    case 'console':
      return new ConsoleLogger()
    case 'file':
      if (!config.filePath) throw new Error('filePath is required for file logger')
      return new FileLogger(config.filePath)
    default:
      const _: never = config.type
      throw new Error(`Unknown logger type: ${config.type}`)
  }
}

const logger = createLogger({ type: 'console' })
logger.log('Server started')
```

---

### 1.3 建造者模式（Builder）

分步构建复杂对象：

```typescript
interface QueryConfig {
  table: string
  conditions: string[]
  orderBy?: string
  limit?: number
  offset?: number
  select: string[]
}

class QueryBuilder {
  private config: Partial<QueryConfig> = {
    conditions: [],
    select: ['*']
  }

  from(table: string): this {
    this.config.table = table
    return this
  }

  select(...fields: string[]): this {
    this.config.select = fields
    return this
  }

  where(condition: string): this {
    this.config.conditions!.push(condition)
    return this
  }

  orderBy(field: string): this {
    this.config.orderBy = field
    return this
  }

  limit(n: number): this {
    this.config.limit = n
    return this
  }

  offset(n: number): this {
    this.config.offset = n
    return this
  }

  build(): string {
    if (!this.config.table) throw new Error('table is required')

    let query = `SELECT ${this.config.select!.join(', ')} FROM ${this.config.table}`

    if (this.config.conditions!.length > 0) {
      query += ` WHERE ${this.config.conditions!.join(' AND ')}`
    }
    if (this.config.orderBy) {
      query += ` ORDER BY ${this.config.orderBy}`
    }
    if (this.config.limit !== undefined) {
      query += ` LIMIT ${this.config.limit}`
    }
    if (this.config.offset !== undefined) {
      query += ` OFFSET ${this.config.offset}`
    }

    return query
  }
}

// 链式调用构建复杂查询
const query = new QueryBuilder()
  .from('users')
  .select('id', 'name', 'email')
  .where('age > 18')
  .where('active = true')
  .orderBy('created_at')
  .limit(10)
  .offset(0)
  .build()
// SELECT id, name, email FROM users WHERE age > 18 AND active = true ORDER BY created_at LIMIT 10 OFFSET 0
```

---

## 二、结构型模式

### 2.1 适配器模式（Adapter）

将不兼容的接口转换为兼容接口：

```typescript
// 目标接口（我们期望的格式）
interface UserProfile {
  userId: string
  displayName: string
  avatarUrl: string
  email: string
}

// 遗留数据格式
interface LegacyUser {
  id: number
  first_name: string
  last_name: string
  photo: string
  email_address: string
}

// 第三方 OAuth 用户格式
interface OAuthUser {
  sub: string
  name: string
  picture: string
  email: string
}

// 适配器：将不同格式统一为 UserProfile
function adaptLegacyUser(user: LegacyUser): UserProfile {
  return {
    userId: String(user.id),
    displayName: `${user.first_name} ${user.last_name}`,
    avatarUrl: user.photo,
    email: user.email_address
  }
}

function adaptOAuthUser(user: OAuthUser): UserProfile {
  return {
    userId: user.sub,
    displayName: user.name,
    avatarUrl: user.picture,
    email: user.email
  }
}

// 统一处理
function renderUserProfile(user: UserProfile): void {
  console.log(`Name: ${user.displayName}, Email: ${user.email}`)
}

const legacyUser: LegacyUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  photo: 'avatar.jpg',
  email_address: 'john@example.com'
}

renderUserProfile(adaptLegacyUser(legacyUser))  // ✅
```

---

### 2.2 装饰器模式（Decorator Pattern，非 TS 装饰器）

动态地为对象添加职责：

```typescript
interface TextFormatter {
  format(text: string): string
}

// 基础实现
class PlainTextFormatter implements TextFormatter {
  format(text: string): string {
    return text
  }
}

// 装饰器基类
abstract class TextFormatterDecorator implements TextFormatter {
  constructor(protected wrapped: TextFormatter) {}
  
  abstract format(text: string): string
}

// 具体装饰器：加粗
class BoldDecorator extends TextFormatterDecorator {
  format(text: string): string {
    return `**${this.wrapped.format(text)}**`
  }
}

// 具体装饰器：斜体
class ItalicDecorator extends TextFormatterDecorator {
  format(text: string): string {
    return `_${this.wrapped.format(text)}_`
  }
}

// 具体装饰器：添加前缀
class PrefixDecorator extends TextFormatterDecorator {
  constructor(wrapped: TextFormatter, private prefix: string) {
    super(wrapped)
  }

  format(text: string): string {
    return `${this.prefix}${this.wrapped.format(text)}`
  }
}

// 组合装饰器
const formatter = new BoldDecorator(
  new ItalicDecorator(
    new PrefixDecorator(
      new PlainTextFormatter(),
      '> '
    )
  )
)

formatter.format('Hello, World!')
// **_> Hello, World!_**
```

---

### 2.3 代理模式（Proxy）

控制对对象的访问：

```typescript
interface UserService {
  getUser(id: number): Promise<User>
  updateUser(id: number, data: Partial<User>): Promise<User>
  deleteUser(id: number): Promise<void>
}

// 真实服务
class RealUserService implements UserService {
  async getUser(id: number): Promise<User> {
    const res = await fetch(`/api/users/${id}`)
    return res.json()
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return res.json()
  }

  async deleteUser(id: number): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
  }
}

// 缓存代理
class CachedUserService implements UserService {
  private cache = new Map<number, User>()

  constructor(private real: UserService) {}

  async getUser(id: number): Promise<User> {
    if (this.cache.has(id)) {
      console.log(`Cache hit for user ${id}`)
      return this.cache.get(id)!
    }
    const user = await this.real.getUser(id)
    this.cache.set(id, user)
    return user
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const updated = await this.real.updateUser(id, data)
    this.cache.set(id, updated)  // 更新缓存
    return updated
  }

  async deleteUser(id: number): Promise<void> {
    await this.real.deleteUser(id)
    this.cache.delete(id)  // 清除缓存
  }
}
```

---

## 三、行为型模式

### 3.1 观察者模式（Observer）

```typescript
type Observer<T> = (data: T) => void

class EventEmitter<EventMap extends Record<string, any>> {
  private listeners: Partial<{
    [K in keyof EventMap]: Observer<EventMap[K]>[]
  }> = {}

  on<K extends keyof EventMap>(event: K, observer: Observer<EventMap[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(observer)

    // 返回取消订阅函数
    return () => this.off(event, observer)
  }

  off<K extends keyof EventMap>(event: K, observer: Observer<EventMap[K]>): void {
    const list = this.listeners[event]
    if (list) {
      this.listeners[event] = list.filter(l => l !== observer) as any
    }
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.listeners[event]?.forEach(observer => observer(data))
  }
}

// 使用：类型安全的事件系统
interface AppEvents {
  userLogin: { userId: string; timestamp: number }
  userLogout: { userId: string }
  dataUpdate: { key: string; value: unknown }
  error: { message: string; code: number }
}

const appEmitter = new EventEmitter<AppEvents>()

// 类型完全推断
const unsubscribe = appEmitter.on('userLogin', ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`)
})

appEmitter.emit('userLogin', { userId: '123', timestamp: Date.now() })

// 取消订阅
unsubscribe()
```

---

### 3.2 策略模式（Strategy）

```typescript
// 排序策略
interface SortStrategy<T> {
  sort(data: T[]): T[]
}

class BubbleSort<T> implements SortStrategy<T> {
  constructor(private comparator: (a: T, b: T) => number) {}

  sort(data: T[]): T[] {
    const arr = [...data]
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (this.comparator(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}

class NativeSort<T> implements SortStrategy<T> {
  constructor(private comparator: (a: T, b: T) => number) {}

  sort(data: T[]): T[] {
    return [...data].sort(this.comparator)
  }
}

// 使用策略的上下文
class DataProcessor<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy
  }

  process(data: T[]): T[] {
    return this.strategy.sort(data)
  }
}

const numberComparator = (a: number, b: number) => a - b

const processor = new DataProcessor(new NativeSort(numberComparator))
processor.process([3, 1, 4, 1, 5, 9, 2, 6])
// [1, 1, 2, 3, 4, 5, 6, 9]

// 切换策略
processor.setStrategy(new BubbleSort(numberComparator))
```

---

### 3.3 命令模式（Command）

将操作封装为对象，支持撤销/重做：

```typescript
interface Command {
  execute(): void
  undo(): void
}

class TextEditor {
  private text: string = ''
  private history: Command[] = []
  private future: Command[] = []

  executeCommand(command: Command): void {
    command.execute()
    this.history.push(command)
    this.future = []  // 执行新命令后清空重做栈
  }

  undo(): void {
    const command = this.history.pop()
    if (command) {
      command.undo()
      this.future.push(command)
    }
  }

  redo(): void {
    const command = this.future.pop()
    if (command) {
      command.execute()
      this.history.push(command)
    }
  }

  getText(): string {
    return this.text
  }

  setText(text: string): void {
    this.text = text
  }
}

class InsertTextCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string,
    private position: number
  ) {}

  execute(): void {
    const current = this.editor.getText()
    const newText = current.slice(0, this.position) + this.text + current.slice(this.position)
    this.editor.setText(newText)
  }

  undo(): void {
    const current = this.editor.getText()
    const newText = current.slice(0, this.position) + current.slice(this.position + this.text.length)
    this.editor.setText(newText)
  }
}

const editor = new TextEditor()
editor.executeCommand(new InsertTextCommand(editor, 'Hello', 0))
editor.executeCommand(new InsertTextCommand(editor, ' World', 5))
console.log(editor.getText())  // 'Hello World'

editor.undo()
console.log(editor.getText())  // 'Hello'

editor.redo()
console.log(editor.getText())  // 'Hello World'
```

---

## 四、TypeScript 特有的模式

### 4.1 类型安全的事件总线

```typescript
// 完整的类型安全事件系统（见观察者模式）
// 关键：用泛型约束事件类型映射
```

---

### 4.2 依赖注入容器

```typescript
type Constructor<T> = new (...args: any[]) => T
type Token<T> = string | symbol | Constructor<T>

class Container {
  private bindings = new Map<any, any>()

  bind<T>(token: Token<T>, factory: () => T): void {
    this.bindings.set(token, factory)
  }

  bindSingleton<T>(token: Token<T>, factory: () => T): void {
    let instance: T | undefined
    this.bindings.set(token, () => {
      if (!instance) instance = factory()
      return instance
    })
  }

  resolve<T>(token: Token<T>): T {
    const factory = this.bindings.get(token)
    if (!factory) {
      throw new Error(`No binding found for ${String(token)}`)
    }
    return factory()
  }
}

// 使用
const container = new Container()

const USER_SERVICE = Symbol('UserService')
const LOGGER = Symbol('Logger')

container.bind(LOGGER, () => new ConsoleLogger())
container.bindSingleton(USER_SERVICE, () => new RealUserService())

const logger = container.resolve<Logger>(LOGGER)
const userService = container.resolve<UserService>(USER_SERVICE)
```

---

## 五、总结

| 模式 | 解决的问题 | TypeScript 优势 |
|------|------------|-----------------|
| 单例 | 全局唯一实例 | 私有构造函数强制约束 |
| 工厂方法 | 创建多态对象 | 返回类型精确推断 |
| 建造者 | 复杂对象构建 | `this` 返回类型支持子类链式 |
| 适配器 | 接口不兼容 | 接口明确契约 |
| 观察者 | 事件驱动 | 泛型约束事件类型安全 |
| 策略 | 算法可替换 | 接口约束策略结构 |
| 命令 | 操作对象化 | 接口统一 execute/undo |

设计模式 + TypeScript 类型系统 = 更安全、更易维护的代码架构。

---

**恭喜！** 你已经完成了 TypeScript 从入门到精通的全部学习内容！

→ 建议接下来：**参与 [TypeScript Challenges](https://github.com/type-challenges/type-challenges)** 挑战，巩固类型体操技能。
