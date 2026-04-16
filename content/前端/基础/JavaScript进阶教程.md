---
title: JavaScript 进阶教程
tags:
  - 前端
  - JavaScript
  - 进阶
  - ES6+
created: 2026-04-16
---

# JavaScript 进阶教程

> 本教程深入讲解 JavaScript 进阶特性，包括原型链、this 绑定、异步编程模式、模块化、性能优化等内容。

## 目录

1. [深入理解 this](#1-深入理解-this)
2. [原型与原型链详解](#2-原型与原型链详解)
3. [执行上下文与作用域链](#3-执行上下文与作用域链)
4. [异步编程进阶](#4-异步编程进阶)
5. [Promise 高级用法](#5-promise-高级用法)
6. [模块化开发](#6-模块化开发)
7. [错误处理最佳实践](#7-错误处理最佳实践)
8. [性能优化](#8-性能优化)
9. [函数式编程](#9-函数式编程)
10. [常用内置对象详解](#10-常用内置对象详解)
11. [常见面试题精讲](#11-常见面试题精讲)

---

## 1. 深入理解 this

### 1.1 this 的四种绑定规则

```javascript
// 规则一：默认绑定（独立函数调用）
function showThis() {
  'use strict';
  console.log(this);  // undefined（严格模式）/ Window（非严格）
}
showThis();

// 规则二：隐式绑定（作为对象方法调用）
const user = {
  name: '张三',
  greet() {
    console.log(this.name);  // '张三'
  },
};
user.greet();

// 规则三：显式绑定（call/apply/bind）
const person = { name: '李四' };
function intro(city) {
  console.log(`${this.name} 来自 ${city}`);
}
intro.call(person, '北京');   // "李四 来自 北京"
intro.apply(person, ['上海']); // "李四 来自 上海"
const boundIntro = intro.bind(person, '广州');
boundIntro();  // "李四 来自 广州"

// 规则四：new 绑定
function Cat(name) {
  this.name = name;
}
const cat = new Cat('咪咪');
cat.name;  // '咪咪'
```

### 1.2 绑定优先级

```
new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定
```

```javascript
// 显式绑定优先级高于隐式绑定
const obj = { name: '对象' };
function foo() {
  console.log(this.name);
}
obj.fn = foo;
obj.fn();           // '对象'（隐式绑定）

const otherObj = { name: '其他对象' };
obj.fn.call(otherObj);  // '其他对象'（显式绑定覆盖）

// new 绑定优先级高于显式绑定
function Person(name) {
  this.name = name;
}
const boundPerson = Person.bind({ name: '绑定对象' });
const p = new boundPerson('新实例');  // new 生效，忽略 bind
p.name;  // '新实例'
```

### 1.3 箭头函数的 this

```javascript
// 箭头函数没有自己的 this，捕获定义时外层的 this
const team = {
  members: ['张三', '李四'],
  manager: '王经理',

  // ❌ 普通 function 的 this 问题
  getNamesBad: function() {
    this.members.forEach(function(member) {
      console.log(this.manager);  // undefined！
    });
  },

  // ✅ 箭头函数正确捕获外层 this
  getNamesGood: function() {
    this.members.forEach((member) => {
      console.log(`${member} - ${this.manager}`);
    });
  },
};

// ⚠️ 注意：对象字面量中的箭头方法
const obj = {
  name: '对象',
  fn: () => {
    console.log(this.name);  // undefined！箭头函数的 this 是定义时的词法作用域
  },
};
obj.fn();  // undefined
```

### 1.4 this 丢失的常见场景

```javascript
// 场景一：解构导致 this 丢失
const { getName } = user;
getName();  // ❌ this 不再指向 user

// 解决方案
const getNameBound = user.getName.bind(user);

// 场景二：回调函数中的 this 丢失
const timer = {
  seconds: 0,
  start() {
    setInterval(function() {
      this.seconds++;  // ❌ this 是 Window
    }, 1000);

    // ✅ 方案1：箭头函数
    setInterval(() => {
      this.seconds++;
    }, 1000);

    // ✅ 方案2：bind
    setInterval(function() {
      this.seconds++;
    }.bind(this), 1000);

    // ✅ 方案3：保存 this
    const self = this;
    setInterval(function() {
      self.seconds++;
    }, 1000);
  },
};

// 场景三：事件监听中的 this
const button = document.querySelector('button');

// ✅ 普通 function，this 是元素
button.addEventListener('click', function() {
  console.log(this);  // <button>
});

// ❌ 箭头函数，this 不是元素
button.addEventListener('click', () => {
  console.log(this);  // 不是 button！
});

// ✅ 使用 event.currentTarget
button.addEventListener('click', (event) => {
  event.currentTarget.textContent = '已点击';
});
```

### 1.5 call / apply / bind 详解

```javascript
// call — 立即调用，参数逐个传入
func.call(thisArg, arg1, arg2, arg3);

// apply — 立即调用，参数以数组传入
func.apply(thisArg, [arg1, arg2, arg3]);

// bind — 返回新函数（不立即调用）
const boundFunc = func.bind(thisArg, arg1, arg2);

// 实际应用

// 借用方法
const arr = [3, 1, 4, 1, 5];
Math.max.apply(null, arr);  // 5
Array.prototype.slice.call(document.querySelectorAll('div'));  // NodeList 转 Array

// 预设参数（偏函数）
function discount(price, rate) {
  return price * rate;
}
const tenPercentOff = discount.bind(null, 0.9);
tenPercentOff(100);  // 90

// 手动实现 bind
Function.prototype.myBind = function(context, ...args1) {
  const fn = this;
  return function(...args2) {
    // 支持作为构造函数使用（new 调用时 this 指向新实例）
    if (new.target) {
      return new fn(...args1, ...args2);
    }
    return fn.apply(context, [...args1, ...args2]);
  };
};
```

---

## 2. 原型与原型链详解

### 2.1 原型对象

```javascript
// 每个函数都有一个 prototype 属性，指向原型对象
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `你好, ${this.name}`;
};

const p = new Person('张三');

// 原型关系
p.__proto__ === Person.prototype;        // true
Person.prototype.__proto__ === Object.prototype;  // true
Object.prototype.__proto__;              // null（原型链终点）
```

### 2.2 原型链图示

```
实例 (p)
│
│  自身属性: name = '张三'
│
└─> p.__proto__ === Person.prototype
    │
    │  原型属性: greet = function
    │
    └─> Person.prototype.__proto__ === Object.prototype
        │
        │  Object 原型方法: toString, hasOwnProperty, valueOf...
        │
        └─> Object.prototype.__proto__ === null
```

### 2.3 属性查找过程

```javascript
// 访问 p.greet()
// 1. 在 p 自身查找 → 没找到
// 2. 在 p.__proto__（Person.prototype）查找 → 找到！✅
// 3. 如果还找不到，继续沿 __proto__ 向上查找
// 4. 直到 Object.prototype.__proto__（null）→ undefined

// 遮蔽（Shadowing）
p.greet = function() {
  return '自己的 greet';
};
p.greet();  // '自己的 greet'（自身属性优先）

delete p.greet;
p.greet();  // '你好, 张三'（原型方法）
```

### 2.4 原型相关方法

```javascript
// 获取原型
Object.getPrototypeOf(p);       // Person.prototype
p.__proto__;                    // Person.prototype（不推荐）

// 设置原型
Object.setPrototypeOf(p, {});   // 性能较差，谨慎使用

// 创建具有指定原型的对象
const obj = Object.create(Person.prototype);

// 检查属性来源
p.hasOwnProperty('name');        // true（自身属性）
'name' in p;                     // true（自身或原型链）

// 枚举属性
Object.keys(p);                 // ['name']（自身可枚举）
Object.getOwnPropertyNames(p);  // ['name']（自身所有，含不可枚举）
```

### 2.5 继承的实现

```javascript
// 方式一：原型链继承
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} 发出声音`;
};

function Dog(name, breed) {
  Animal.call(this, name);  // 借用构造函数
  this.breed = breed;
}

// 原型链继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} 汪汪叫`;
};

// 方式二：ES6 class
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} 发出声音`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() {
    return `${this.name} 汪汪叫`;
  }
}
```

### 2.6 原型污染防护

```javascript
// 原型污染攻击示例
const malicious = JSON.parse('{"__proto__":{"isAdmin":true}}');
// 如果直接合并，可能导致安全问题

// 安全合并
function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor') continue;
    target[key] = source[key];
  }
  return target;
}

// 使用 Object.create(null) 创建纯净对象（无原型）
const dict = Object.create(null);
dict.key = 'value';
dict.toString;  // undefined（没有 toString）
```

---

## 3. 执行上下文与作用域链

### 3.1 执行上下文

```javascript
// 执行上下文类型：
// 1. 全局执行上下文
// 2. 函数执行上下文
// 3. Eval 执行上下文（不推荐）

// 执行上下文包含：
// - 变量对象（Variable Object）
// - 作用域链（Scope Chain）
// - this 值

// 执行过程：
// 1. 创建阶段：变量提升、确定 this、建立作用域链
// 2. 执行阶段：逐行执行代码
```

### 3.2 变量提升详解

```javascript
// var 提升
console.log(a);  // undefined（已声明，未赋值）
var a = 1;

// 等价于：
// var a;
// console.log(a);
// a = 1;

// 函数声明提升（整体提升）
sayHi();  // "Hi!"
function sayHi() {
  console.log('Hi!');
}

// 函数表达式不提升
// sayHello();  // TypeError
var sayHello = function() {
  console.log('Hello!');
};

// let/const 暂时性死区（TDZ）
{
  // console.log(x);  // ReferenceError（TDZ）
  let x = 1;
}
```

### 3.3 作用域链

```javascript
// 词法作用域：作用域在代码编写时就确定了

let globalVar = '全局';

function outer() {
  let outerVar = '外层';

  function inner() {
    let innerVar = '内层';
    console.log(innerVar);   // 内层 → 自身
    console.log(outerVar);   // 外层 → 外层函数
    console.log(globalVar);  // 全局 → 全局
  }

  inner();
}

outer();

// 作用域链：[inner作用域, outer作用域, 全局作用域]
```

---

## 4. 异步编程进阶

### 4.1 事件循环机制

```
事件循环（Event Loop）流程：

1. 执行 Call Stack 中的同步代码
2. Call Stack 清空后，检查微任务队列
3. 执行所有微任务（清空微任务队列）
4. 执行一个宏任务
5. 重复 2-4

微任务（Microtask）：
- Promise.then/catch/finally
- queueMicrotask()
- MutationObserver

宏任务（Macrotask）：
- setTimeout / setInterval
- setImmediate（Node.js）
- I/O
- UI 渲染
```

### 4.2 执行顺序示例

```javascript
console.log('1. 开始');

setTimeout(() => {
  console.log('2. 宏任务: setTimeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3. 微任务: Promise.then');
  })
  .then(() => {
    console.log('4. 微任务: 第二个 then');
  });

console.log('5. 结束同步代码');

// 输出顺序：
// 1. 开始
// 5. 结束同步代码
// 3. 微任务: Promise.then
// 4. 微任务: 第二个 then
// 2. 宏任务: setTimeout
```

### 4.3 宏任务与微任务对比

| 特性 | 宏任务 | 微任务 |
|------|--------|--------|
| 执行时机 | 每轮事件循环执行一个 | 每轮事件循环执行全部 |
| 优先级 | 低 | 高 |
| 示例 | setTimeout, setInterval | Promise.then, queueMicrotask |
| 阻塞后续 | 只阻塞下一个宏任务 | 阻塞当前轮的所有宏任务 |

### 4.4 requestAnimationFrame

```javascript
// requestAnimationFrame — 动画帧（通常 60fps）
let animationId;
function animate() {
  updatePosition();
  render();
  animationId = requestAnimationFrame(animate);
}
animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);

// 与 setTimeout 的区别：
// - rAF 与屏幕刷新同步，更流畅
// - rAF 在页面不可见时暂停，节省资源
// - rAF 回调在渲染前执行
```

---

## 5. Promise 高级用法

### 5.1 Promise 链式调用原理

```javascript
// then 返回新 Promise，形成链式调用
fetchUser()
  .then(user => {
    console.log(user);
    return fetchPosts(user.id);  // 返回 Promise，等待完成
  })
  .then(posts => {
    console.log(posts);
    return posts;  // 返回普通值，包装为 Promise.resolve(posts)
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    console.log('完成');
  });

// 链中的异常会被最近的 catch 捕获
```

### 5.2 Promise 静态方法详解

```javascript
// Promise.all — 并行执行，全部成功才成功
Promise.all([fetchA(), fetchB(), fetchC()])
  .then(([a, b, c]) => {
    console.log(a, b, c);  // 结果按顺序排列
  })
  .catch(err => {
    // 任一失败立即拒绝
  });

// Promise.allSettled — 等待所有结束（无论成功失败）
Promise.allSettled([task1(), task2(), task3()])
  .then(results => {
    // [{status:'fulfilled',value:...}, {status:'rejected',reason:...}]
  });

// Promise.race — 谁快谁赢（第一个完成的决定结果）
Promise.race([
  fetchWithTimeout(url, 5000),
  timeout(5000),
])
  .then(result => { /* 第一个完成的 */ });

// Promise.any — 第一个成功者胜（ES2021）
Promise.any([serverA(), serverB(), serverC()])
  .then(result => { /* 第一个成功的 */ })
  .catch(errors => {
    // AggregateError: 全部失败
  });

// Promise.resolve / Promise.reject
Promise.resolve(42);           // 立即成功的 Promise
Promise.reject(new Error());   // 立即失败的 Promise
```

### 5.3 Promise 工具函数

```javascript
// 延迟执行（sleep）
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
await sleep(1000);

// 超时控制
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

// 重试
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * (i + 1));
    }
  }
}

// 限制并发数
async function limitConcurrency(tasks, limit = 3) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const promise = task().then(r => {
      executing.delete(promise);
      return r;
    });
    executing.add(promise);
    results.push(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// 错误处理辅助
async function to(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

const [data, err] = await to(fetchData());
```

### 5.4 顺序执行与并行执行

```javascript
// ❌ 串行等待（慢）
async function loadSlow() {
  const user = await fetchUser();      // 等 1s
  const posts = await fetchPosts();     // 再等 1s
  const comments = await fetchComments(); // 再等 1s
  // 总共 3s
}

// ✅ 并行等待（快）
async function loadFast() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  // 总共 1s（取决于最慢的）
}

// 分批并行
async function batchParallel(items, batchSize = 10) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processItem));
    results.push(...batchResults);
  }
  return results;
}
```

---

## 6. 模块化开发

### 6.1 ES Modules

```javascript
// ===== 导出（math.js）=====
// 命名导出
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// 默认导出
export default class Calculator { /* ... */ }

// 重新导出
export { foo, bar } from './utils.js';
export * from './types.js';

// ===== 导入（main.js）=====
// 命名导入
import { PI, add, multiply } from './math.js';

// 别名导入
import { add as sum } from './math.js';

// 命名空间导入
import * as MathUtils from './math.js';

// 默认导入
import Calculator from './math.js';

// 混合导入
import Calculator, { PI, add } from './math.js';

// 动态导入（按需加载）
const module = await import('./heavy-module.js');
module.default();
```

### 6.2 动态导入应用场景

```javascript
// 路由懒加载
const routes = [
  {
    path: '/admin',
    component: () => import('./AdminPanel.vue'),
  },
];

// 条件加载
if (user.isAdmin) {
  const { AdminPanel } = await import('./AdminPanel');
  render(AdminPanel);
}

// 代码分割
async function loadModule(name) {
  const module = await import(`./modules/${name}.js`);
  return module.default;
}
```

### 6.3 CommonJS（Node.js）

```javascript
// 导出（math.js）
const PI = 3.14159;
function add(a, b) { return a + b; }

module.exports = { PI, add };
// 或
exports.PI = PI;

// 导入（main.js）
const { PI, add } = require('./math');
const MathUtils = require('./math');

// ⚠️ CommonJS 与 ES Modules 的区别：
// - CommonJS 是运行时加载，ES Modules 是编译时加载
// - CommonJS 输出值拷贝，ES Modules 输出值引用
// - CommonJS this 指向当前模块，ES Modules this 是 undefined
```

---

## 7. 错误处理最佳实践

### 7.1 try-catch-finally

```javascript
try {
  const data = JSON.parse(response);
  if (!data.success) throw new Error(data.message);

  riskyOperation();
} catch (error) {
  console.error('出错了:', error.message);
  console.error('堆栈:', error.stack);

  // 根据错误类型分别处理
  if (error instanceof TypeError) {
    // 类型错误
  } else if (error instanceof NetworkError) {
    // 网络错误
  }
} finally {
  // 无论是否出错都会执行
  cleanupResources();
}
```

### 7.2 自定义错误类

```javascript
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
    };
  }
}

// 使用
throw new AppError('用户不存在', 'USER_NOT_FOUND', 404);
```

### 7.3 全局错误捕获

```javascript
// 同步错误
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误:', message);
  reportToService({ message, source, lineno, colno, stack: error?.stack });
};

// Promise 错误
window.addEventListener('unhandledrejection', function(event) {
  console.error('未处理的 Promise 拒绝:', event.reason);
  event.preventDefault();
  reportToService({ type: 'unhandledrejection', reason: event.reason });
});

// 资源加载失败
window.addEventListener('error', function(event) {
  if (event.target !== window) {
    console.error('资源加载失败:', event.target.src);
  }
}, true);
```

---

## 8. 性能优化

### 8.1 减少 DOM 操作

```javascript
// ❌ 多次操作 DOM
for (let i = 0; i < 1000; i++) {
  ul.appendChild(document.createElement('li'));
}

// ✅ 使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(document.createElement('li'));
}
ul.appendChild(fragment);

// ✅ 使用 innerHTML（大批量插入）
ul.innerHTML = items.map(item => `<li>${item}</li>`).join('');
```

### 8.2 虚拟滚动

```javascript
// 只渲染可视区域的元素
function virtualScroll(container, totalItems, itemHeight, renderItem) {
  const visibleCount = Math.ceil(container.clientHeight / itemHeight);
  let scrollTop = 0;

  function render() {
    const startIndex = Math.floor(scrollTop / itemHeight);
    container.innerHTML = '';
    container.style.paddingTop = `${startIndex * itemHeight}px`;
    container.style.height = `${totalItems * itemHeight}px`;

    for (let i = startIndex; i < Math.min(startIndex + visibleCount, totalItems); i++) {
      container.appendChild(renderItem(i));
    }
  }

  container.addEventListener('scroll', () => {
    scrollTop = container.scrollTop;
    requestAnimationFrame(render);
  });
  render();
}
```

### 8.3 内存优化

```javascript
// 及时清理引用
function processLargeData(data) {
  const processed = data.map(transform);
  data = null;  // 释放大数据
  return processed;
}

// 使用 WeakMap/WeakSet（允许垃圾回收）
const cache = new WeakMap();
cache.set(largeObj, expensiveResult(largeObj));

// 分批处理大数据集
async function processLargeDataset(dataset, batchSize = 1000) {
  for (let i = 0; i < dataset.length; i += batchSize) {
    const batch = dataset.slice(i, i + batchSize);
    await processBatch(batch);
    await new Promise(resolve => setTimeout(resolve, 0));  // 让出主线程
  }
}
```

### 8.4 代码分割与懒加载

```javascript
// 路由懒加载
const routes = [
  { path: '/admin', component: () => import('./AdminPanel') },
];

// 条件加载
if (user.isAdmin) {
  const { AdminPanel } = await import('./AdminPanel');
}

// 组件懒加载（React）
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

---

## 9. 函数式编程

### 9.1 纯函数

```javascript
// 纯函数：相同输入总是返回相同输出，无副作用
function add(a, b) {
  return a + b;
}

// 不纯函数（有副作用）
let total = 0;
function addToTotal(value) {
  total += value;  // 修改外部状态
  return total;
}
```

### 9.2 高阶函数

```javascript
// 函数作为参数
function process(data, callback) {
  return callback(data);
}

// 函数作为返回值
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
```

### 9.3 柯里化

```javascript
// 柯里化：将多参数函数转换为一系列单参数函数
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
curriedAdd(1)(2)(3);  // 6
curriedAdd(1, 2)(3);  // 6
curriedAdd(1, 2, 3);  // 6
```

### 9.4 组合与管道

```javascript
// 组合（从右向左执行）
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 管道（从左向右执行）
function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const compute = pipe(addOne, double, square);
compute(3);  // ((3 + 1) * 2) ^ 2 = 64
```

---

## 10. 常用内置对象详解

### 10.1 Date

```javascript
// 创建日期
const now = new Date();
const specificDate = new Date('2026-04-16T14:00:00');
const fromTimestamp = new Date(1713276800000);

// 获取各部分
now.getFullYear();
now.getMonth();      // 0-11
now.getDate();       // 1-31
now.getDay();        // 0-6（周日是0）
now.getHours();
now.getMinutes();
now.getSeconds();

// 格式化
now.toLocaleDateString('zh-CN');
now.toLocaleString('zh-CN');
now.toISOString();

// 日期计算
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

// 格式化工具
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date);
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
    .replace('DD', String(d.getDate()).padStart(2, '0'))
    .replace('HH', String(d.getHours()).padStart(2, '0'))
    .replace('mm', String(d.getMinutes()).padStart(2, '0'))
    .replace('ss', String(d.getSeconds()).padStart(2, '0'));
}
```

### 10.2 Math

```javascript
// 常量
Math.PI;
Math.E;

// 取整
Math.floor(3.9);   // 3  向下
Math.ceil(3.1);    // 4  向上
Math.round(3.5);   // 4  四舍五入
Math.trunc(3.9);   // 3  截断

// 最大最小
Math.max(1, 5, 3);
Math.min(1, 5, 3);

// 幂与根
Math.pow(2, 10);   // 1024
Math.sqrt(144);    // 12

// 随机数
Math.random();     // [0, 1)

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### 10.3 JSON

```javascript
// 序列化
JSON.stringify({ name: '张三', age: 25 });
// '{"name":"张三","age":25}'

// 美化输出
JSON.stringify(data, null, 2);

// 自定义序列化
JSON.stringify(data, (key, value) => {
  if (typeof value === 'bigint') return value.toString();
  return value;
});

// 反序列化
JSON.parse('{"name":"张三"}');
// { name: '张三' }

// 安全解析
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// 深拷贝（仅限可序列化数据）
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

### 10.4 定时器

```javascript
// setTimeout — 延迟执行
const timerId = setTimeout(() => {
  console.log('延迟执行');
}, 1000);
clearTimeout(timerId);

// setInterval — 周期执行
const intervalId = setInterval(() => {
  console.log('周期执行');
}, 1000);
clearInterval(intervalId);

// requestAnimationFrame — 动画帧
let animationId;
function animate() {
  update();
  animationId = requestAnimationFrame(animate);
}
animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);
```

---

## 11. 常见面试题精讲

### 11.1 变量提升

```javascript
// 输出什么？
console.log(a);
var a = 1;

// 答案：undefined
// 解释：var 会提升，但赋值不提升
// 等价于：
// var a;
// console.log(a);  // undefined
// a = 1;
```

### 11.2 闭包与循环

```javascript
// 输出什么？
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// 答案：3, 3, 3
// 解释：var 是函数作用域，循环结束时 i = 3
// 解决方案：
for (let i = 0; i < 3; i++) {  // 改用 let
  setTimeout(() => console.log(i), 100);
}
// 输出：0, 1, 2
```

### 11.3 this 指向

```javascript
const obj = {
  name: '对象',
  getName: function() {
    return this.name;
  },
  getNameArrow: () => this.name,
};

const { getName } = obj;

console.log(obj.getName());        // '对象'
console.log(obj.getNameArrow());   // undefined
console.log(getName());            // undefined

// 解释：
// obj.getName() — this 指向 obj
// obj.getNameArrow() — 箭头函数的 this 是定义时的外层（全局）
// getName() — 解构后 this 丢失
```

### 11.4 原型链

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return this.name;
};

const p = new Person('张三');

console.log(p.__proto__ === Person.prototype);  // true
console.log(Person.prototype.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);  // null
```

### 11.5 事件循环

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve()
  .then(() => console.log('4'))
  .then(() => console.log('5'));

console.log('6');

// 输出：1, 6, 4, 5, 2, 3
// 解释：
// 1. 同步：1, 6
// 2. 微任务：4, 5
// 3. 宏任务：2
// 4. 微任务（宏任务中产生）：3
```

### 11.6 数组方法

```javascript
const arr = [1, 2, 3, 4, 5];

// map vs forEach
arr.map(x => x * 2);      // [2, 4, 6, 8, 10]（返回新数组）
arr.forEach(x => x * 2);  // undefined（无返回值）

// filter vs find
arr.filter(x => x > 3);   // [4, 5]（所有满足的）
arr.find(x => x > 3);     // 4（第一个）

// some vs every
arr.some(x => x > 3);     // true（任一满足）
arr.every(x => x > 0);    // true（全部满足）
```

### 11.7 Promise

```javascript
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);

// 输出：1
// 解释：
// then(2) — 值穿透，2 不是函数，忽略
// then(Promise.resolve(3)) — 也不是函数，忽略
// 所以最终输出 1

// 正确写法：
Promise.resolve(1)
  .then(x => x + 2)
  .then(x => Promise.resolve(x + 3))
  .then(console.log);  // 6
```

---

## 总结

本教程深入讲解了 JavaScript 进阶特性：

1. **this 绑定**：四种绑定规则、箭头函数的 this
2. **原型链**：原型对象、原型链查找、继承实现
3. **执行上下文**：变量提升、作用域链
4. **异步编程**：事件循环、微任务与宏任务
5. **Promise 高级用法**：链式调用、并发控制、工具函数
6. **模块化**：ES Modules、动态导入
7. **错误处理**：自定义错误、全局捕获
8. **性能优化**：虚拟滚动、内存管理、代码分割
9. **函数式编程**：纯函数、柯里化、组合

建议配合基础教程学习，多写代码实践！
