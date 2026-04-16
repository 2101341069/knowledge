---
title: ECMAScript 6 高级教程
tags:
  - 前端
  - JavaScript
  - ES6
  - ECMAScript
  - 高级教程
created: 2026-04-16
---

# ECMAScript 6 高级教程

> ES6 高级特性深入讲解：Proxy、Reflect、Promise、Iterator、Generator、async/await、Class、Module 等。

## 目录

1. [Proxy](#1-proxy)
2. [Reflect](#2-reflect)
3. [Promise 对象](#3-promise-对象)
4. [Iterator 和 for...of 循环](#4-iterator-和-forof-循环)
5. [Generator 函数](#5-generator-函数)
6. [async 函数](#6-async-函数)
7. [Class 的基本语法](#7-class-的基本语法)
8. [Class 的继承](#8-class-的继承)
9. [Module 的语法](#9-module-的语法)
10. [Module 的加载实现](#10-module-的加载实现)
11. [编程风格](#11-编程风格)
12. [ES6 新增的其他特性](#12-es6-新增的其他特性)

---

## 1. Proxy

### 1.1 概述

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种"元编程"（meta programming），即对编程语言的编程。

Proxy 可以理解成，在目标对象之前架设一层"拦截"，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

```javascript
// Proxy 语法
var proxy = new Proxy(target, handler);

// target：目标对象
// handler：一个对象，其属性是当执行一个操作时定义代理的行为的函数
```

### 1.2 基本用法

```javascript
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1;
// setting count!

++obj.count;
// getting count!
// setting count!
```

### 1.3 可拦截的操作

#### get(target, propKey, receiver)

拦截对象属性的读取。

```javascript
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, property) {
    if (property in target) {
      return target[property];
    } else {
      throw new ReferenceError(`Property "${property}" does not exist.`);
    }
  }
});

proxy.name // "张三"
proxy.age // ReferenceError: Property "age" does not exist.
```

#### set(target, propKey, value, receiver)

拦截对象属性的设置。

```javascript
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }
    obj[prop] = value;
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;
person.age // 100
person.age = 'young' // TypeError: The age is not an integer
person.age = 300 // RangeError: The age seems invalid
```

#### has(target, propKey)

拦截 `propKey in proxy` 操作。

```javascript
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};

var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```

#### deleteProperty(target, propKey)

拦截 `delete proxy[propKey]` 操作。

```javascript
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    delete target[key];
    return true;
  }
};

function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop // Error: Invalid attempt to delete private "_prop" property
```

#### ownKeys(target)

拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in` 循环。

```javascript
let target = {
  a: 1,
  b: 2,
  c: 3
};

let handler = {
  ownKeys(target) {
    return ['a', 'b'];
  }
};

let proxy = new Proxy(target, handler);
Object.keys(proxy) // ['a', 'b']
```

#### getOwnPropertyDescriptor(target, propKey)

拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)`。

```javascript
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
};

var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat')
// undefined
Object.getOwnPropertyDescriptor(proxy, '_foo')
// undefined
Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

#### defineProperty(target, propKey, propDesc)

拦截 `Object.defineProperty(proxy, propKey, propDesc)`、`Object.defineProperties(proxy, propDescs)`。

```javascript
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};

var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // TypeError: 'defineProperty' on proxy: trap returned falsish
```

#### getPrototypeOf(target)

拦截 `Object.getPrototypeOf(proxy)`。

```javascript
var proto = {};
var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
});
Object.getPrototypeOf(p) === proto // true
```

#### setPrototypeOf(target, proto)

拦截 `Object.setPrototypeOf(proxy, proto)`。

```javascript
var handler = {
  setPrototypeOf(target, proto) {
    throw new Error('Changing the prototype is forbidden');
  }
};

var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);
// Error: Changing the prototype is forbidden
```

#### apply(target, object, args)

拦截 Proxy 实例作为函数调用的操作。

```javascript
var target = function () { return 'I am the target'; };
var handler = {
  apply: function () {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);
p() // "I am the proxy"
```

#### construct(target, args)

拦截 Proxy 实例作为构造函数调用的操作。

```javascript
var handler = {
  construct (target, args, newTarget) {
    console.log('construct: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
};

var p = new Proxy(function () {}, handler);
new p(1).value // "construct: 1"  10
```

### 1.4 Proxy.revocable()

返回一个可取消的 Proxy 实例。

```javascript
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

---

## 2. Reflect

### 2.1 概述

Reflect 对象与 Proxy 对象一样，也是 ES6 为了操作对象而提供的新 API。

Reflect 对象的设计目的：
1. 将 Object 对象的一些明显属于语言内部的方法放到 Reflect 对象上
2. 修改某些 Object 方法的返回结果
3. 让 Object 操作都变成函数行为
4. Reflect 对象的方法与 Proxy 对象的方法一一对应

### 2.2 静态方法

Reflect 对象一共有 13 个静态方法：

- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

### 2.3 使用示例

#### Reflect.get()

```javascript
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

Reflect.get(myObject, 'foo') // 1
Reflect.get(myObject, 'bar') // 2
Reflect.get(myObject, 'baz') // 3

// 如果第一个参数不是对象，会报错
Reflect.get(1, 'foo') // TypeError
Reflect.get(false, 'foo') // TypeError
```

#### Reflect.set()

```javascript
var myObject = {
  foo: 1,
  set bar(value) {
    return this.foo = value;
  },
};

myObject.foo // 1

Reflect.set(myObject, 'foo', 2);
myObject.foo // 2

Reflect.set(myObject, 'bar', 3)
myObject.foo // 3
```

#### Reflect.has()

```javascript
var myObject = {
  foo: 1,
};

// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```

#### Reflect.deleteProperty()

```javascript
const myObj = { foo: 'bar' };

// 旧写法
delete myObj.foo;

// 新写法
Reflect.deleteProperty(myObj, 'foo');
```

#### Reflect.construct()

```javascript
function Greeting(name) {
  this.name = name;
}

// 旧写法
const instance1 = new Greeting('张三');

// 新写法
const instance2 = Reflect.construct(Greeting, ['张三']);
```

#### Reflect.getPrototypeOf()

```javascript
const myObj = new FancyThing();

// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype;

// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype;
```

---

## 3. Promise 对象

### 3.1 什么是 Promise

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

Promise 对象有以下两个特点：
1. 对象的状态不受外界影响
2. 一旦状态改变，就不会再变

Promise 对象有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。

### 3.2 基本用法

```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。

- resolve：将 Promise 对象的状态从"未完成"变为"成功"
- reject：将 Promise 对象的状态从"未完成"变为"失败"

### 3.3 then() 方法

```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

then 方法可以接受两个回调函数作为参数：
- 第一个回调函数是 Promise 对象的状态变为 resolved 时调用
- 第二个回调函数是 Promise 对象的状态变为 rejected 时调用

### 3.4 catch() 方法

```javascript
promise.catch(function(error) {
  // 处理 reject 状态
});
```

catch 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于指定发生错误时的回调函数。

### 3.5 finally() 方法

```javascript
promise
  .then(result => { /* ... */ })
  .catch(error => { /* ... */ })
  .finally(() => { /* ... */ });
```

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。

### 3.6 all() 方法

```javascript
const p = Promise.all([p1, p2, p3]);
```

Promise.all 方法用于将多个 Promise 实例包装成一个新的 Promise 实例。

只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled。

### 3.7 race() 方法

```javascript
const p = Promise.race([p1, p2, p3]);
```

Promise.race 方法同样是将多个 Promise 实例包装成一个新的 Promise 实例。

只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。

### 3.8 allSettled() 方法

```javascript
const promises = [ fetch('index.html'), fetch('https://does-not-exist/') ];
const results = await Promise.allSettled(promises);
const successfulPromises = results.filter(p => p.status === 'fulfilled');
```

Promise.allSettled 方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。

只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束。

### 3.9 any() 方法

```javascript
const promises = [
  fetch('/endpoint-a').then(() => 'a'),
  fetch('/endpoint-b').then(() => 'b'),
  fetch('/endpoint-c').then(() => 'c'),
];
try {
  const first = await Promise.any(promises);
  console.log(first);
} catch (error) {
  console.log(error);
}
```

Promise.any 方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。

只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态。

### 3.10 resolve() 方法

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

Promise.resolve 方法将现有对象转为 Promise 对象。

### 3.11 reject() 方法

```javascript
Promise.reject('出错了')
// 等价于
new Promise((resolve, reject) => reject('出错了'))
```

Promise.reject 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

### 3.12 实际应用示例

#### 封装 AJAX 请求

```javascript
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

#### 链式调用

```javascript
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  console.log("resolved: ", comments);
}, function(err){
  console.log("rejected: ", err);
});
```

---

## 4. Iterator 和 for...of 循环

### 4.1 什么是 Iterator

Iterator（遍历器）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

Iterator 的作用：
1. 为各种数据结构提供一个统一的、简便的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. ES6 创造了一种新的遍历命令 for...of 循环

### 4.2 Iterator 的遍历过程

1. 创建一个指针对象，指向当前数据结构的起始位置
2. 第一次调用指针对象的 next 方法，将指针指向数据结构的第一个成员
3. 第二次调用指针对象的 next 方法，将指针指向数据结构的第二个成员
4. 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置

```javascript
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}

var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
```

### 4.3 默认 Iterator 接口

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性。

```javascript
const obj = {
  [Symbol.iterator]: function() {
    return {
      next: function() {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

原生具备 Iterator 接口的数据结构：
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

### 4.4 调用 Iterator 接口的场合

#### 解构赋值

```javascript
let set = new Set().add('a').add('b').add('c');
let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c']
```

#### 扩展运算符

```javascript
var str = 'hello';
[...str] //  ['h','e','l','l','o']
```

#### yield*

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

### 4.5 for...of 循环

```javascript
const arr = ['red', 'green', 'blue'];

for(let v of arr) {
  console.log(v); // red green blue
}
```

for...of 循环可以使用的范围：
- 数组
- Set
- Map
- 类数组对象（如 arguments 对象、DOM NodeList 对象）
- Generator 对象
- 字符串

---

## 5. Generator 函数

### 5.1 什么是 Generator

Generator 函数是 ES6 提供的一种异步编程解决方案。

Generator 函数有多种理解角度：
- 语法上，可以把它理解成状态机，封装了多个内部状态
- 形式上，Generator 函数是一个普通函数，但是内部通过 yield 关键字暂停执行

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next() // { value: 'hello', done: false }
hw.next() // { value: 'world', done: false }
hw.next() // { value: 'ending', done: true }
hw.next() // { value: undefined, done: true }
```

### 5.2 yield 表达式

yield 表达式就是暂停标志。

yield 表达式只能用在 Generator 函数里面。

```javascript
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  a.forEach(function(item) {
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  });
};

// 以上代码会报错，因为 forEach 方法的参数是一个普通函数

// 正确写法
var flat = function* (a) {
  for (var i = 0; i < a.length; i++) {
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)){
  console.log(f);
}
// 1, 2, 3, 4, 5, 6
```

### 5.3 next 方法的参数

yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

### 5.4 for...of 循环

for...of 循环可以自动遍历 Generator 函数运行时生成的 Iterator 对象，且不再需要调用 next 方法。

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

### 5.5 Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

### 5.6 Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

### 5.7 yield* 表达式

如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。

```javascript
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// x a b y
```

### 5.8 应用

#### 异步操作的同步化表达

```javascript
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}

var loader = loadUI();
loader.next() // 加载 UI
loader.next() // 卸载 UI
```

#### 控制流管理

```javascript
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

---

## 6. async 函数

### 6.1 什么是 async 函数

async 函数是 Generator 函数的语法糖。

```javascript
// Generator 函数
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// async 函数
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

async 函数对 Generator 函数的改进：
1. 内置执行器
2. 更好的语义
3. 更广的适用性
4. 返回值是 Promise

### 6.2 基本用法

```javascript
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
```

### 6.3 语法

#### 返回 Promise 对象

async 函数返回一个 Promise 对象。

async 函数内部 return 语句返回的值，会成为 then 方法回调函数的参数。

```javascript
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

#### Promise 对象的状态变化

async 函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生状态改变。

```javascript
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
```

#### await 命令

await 命令后面是一个 Promise 对象。如果不是，会被转成一个立即 resolve 的 Promise 对象。

```javascript
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

#### 错误处理

如果 await 后面的异步操作出错，那么等同于 async 函数返回的 Promise 对象被 reject。

```javascript
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法
async function myFunction() {
  await somethingThatReturnsAPromise().catch(function (err) {
    console.log(err);
  });
}
```

### 6.4 并发执行

```javascript
// 顺序执行
async function sequence() {
  await Promise.all([
    requestAsync(1),
    requestAsync(2),
    requestAsync(3),
  ]);
}

// 并发执行
async function parallel() {
  let promises = [
    requestAsync(1),
    requestAsync(2),
    requestAsync(3),
  ];
  let results = await Promise.all(promises);
  return results;
}
```

---

## 7. Class 的基本语法

### 7.1 类的由来

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。

```javascript
// ES5 写法
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

// ES6 写法
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

// 类的数据类型就是函数
typeof Point // "function"
Point === Point.prototype.constructor // true
```

### 7.2 constructor 方法

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。

```javascript
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

### 7.3 类的实例

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

### 7.4 取值函数和存值函数

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

### 7.5 属性表达式

```javascript
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

### 7.6 Class 表达式

```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

### 7.7 静态方法

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod() // TypeError: foo.classMethod is not a function
```

### 7.8 实例属性的新写法

```javascript
class IncreasingCounter {
  constructor() {
    this._count = 0;
  }
  
  // 新写法
  _count = 0;
  
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

### 7.9 静态属性

```javascript
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```

### 7.10 私有方法和私有属性

#### 私有方法

```javascript
// 方法一：命名前缀
class Widget {
  // 公有方法
  foo (baz) {
    this._bar(baz);
  }

  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  }

  // ...
}

// 方法二：将私有方法移出模块
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}

// 方法三：Symbol
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```

#### 私有属性

```javascript
// 私有属性提案（#）
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}

const counter = new IncreasingCounter();
counter.#count // 报错
counter.#count = 42 // 报错
```

---

## 8. Class 的继承

### 8.1 简介

ES6 规定了通过 extends 关键字实现继承。

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的 constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的 toString()
  }
}
```

### 8.2 super 关键字

super 这个关键字，既可以当作函数使用，也可以当作对象使用。

#### 作为函数调用

super 作为函数调用时，代表父类的构造函数。

```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}

class B extends A {
  constructor() {
    super();
  }
}

new A() // A
new B() // B
```

#### 作为对象使用

super 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

```javascript
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```

### 8.3 类的 prototype 属性和 \_\_proto\_\_ 属性

Class 作为构造函数的语法糖，同时有 prototype 属性和 \_\_proto\_\_ 属性，因此同时存在两条继承链。

1. 子类的 \_\_proto\_\_ 属性，表示构造函数的继承，总是指向父类
2. 子类 prototype 属性的 \_\_proto\_\_ 属性，表示方法的继承，总是指向父类的 prototype 属性

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

### 8.4 原生构造函数的继承

原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ES6 允许继承原生构造函数。

```javascript
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length-1]);
  }
}

var x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x // [1, 2, 3]
x.revert();
x // [1, 2]
```

---

## 9. Module 的语法

### 9.1 概述

ES6 模块的设计思想是尽量静态化，使得编译时就能确定模块的依赖关系。

ES6 模块主要有两个功能：
1. export：用于规定模块的对外接口
2. import：用于输入其他模块提供的功能

### 9.2 export 命令

```javascript
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 或者
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };
```

#### 输出函数或类

```javascript
export function multiply(x, y) {
  return x * y;
};

// 或者
function multiply(x, y) {
  return x * y;
}

export { multiply };
```

#### 使用 as 关键字重命名

```javascript
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

#### export default 命令

```javascript
// export-default.js
export default function () {
  console.log('foo');
}

// 或者
export default class { ... }

// 其他模块加载时
import customName from './export-default';
customName(); // 'foo'
```

### 9.3 import 命令

```javascript
// main.js
import { firstName, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}

// 使用 as 关键字重命名
import { lastName as surname } from './profile.js';

// 整体加载
import * as profile from './profile.js';
```

### 9.4 模块的整体加载

```javascript
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}

// main.js
import * as circle from './circle';

console.log(circle.area(4));
console.log(circle.circumference(14));
```

### 9.5 export 与 import 的复合写法

```javascript
export { foo, bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
export { foo, bar };
```

### 9.6 模块的继承

```javascript
// circleplus.js
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```

---

## 10. Module 的加载实现

### 10.1 浏览器加载

#### 传统方法

```html
<!-- 页面内嵌脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
```

#### ES6 模块

```html
<script type="module" src="./foo.js"></script>
<script type="module">
  import { greet } from './greeting.js';
  greet('World');
</script>
```

### 10.2 ES6 模块与 CommonJS 模块的差异

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
3. CommonJS 模块的 require() 是同步加载，ES6 模块的 import 命令是异步加载

### 10.3 Node.js 的模块加载方法

Node.js 要求 ES6 模块采用 .mjs 后缀文件名。

```javascript
// a.mjs
import { something } from './b.mjs';

// 或者
{
  "type": "module"
}
```

---

## 11. 编程风格

### 11.1 块级作用域

- let 完全可以取代 var
- 在 let 和 const 之间，建议优先使用 const

```javascript
// bad
var a = 1, b = 2, c = 3;

// good
const a = 1;
let b = 2;
let c = 3;
```

### 11.2 字符串

静态字符串一律使用单引号或反引号，动态字符串使用反引号。

```javascript
// bad
const a = "foobar";
const b = 'foo' + a + 'bar';

// good
const a = 'foobar';
const b = `foo${a}bar`;
```

### 11.3 解构赋值

使用数组成员对变量赋值时，优先使用解构赋值。

```javascript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

### 11.4 对象

单行定义的对象，最后一个成员不以逗号结尾。多行定义的对象，最后一个成员以逗号结尾。

```javascript
// good
const a = { k1: v1, k2: v2 };
const b = {
  k1: v1,
  k2: v2,
};
```

### 11.5 数组

使用扩展运算符 (...) 拷贝数组。

```javascript
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

### 11.6 函数

立即执行函数可以写成箭头函数的形式。

```javascript
(() => {
  console.log('Welcome to the Internet.');
})();
```

### 11.7 Map 结构

注意区分 Object 和 Map，只有模拟现实世界的实体对象时，才使用 Object。如果只是需要 key: value 的数据结构，使用 Map。

```javascript
// bad
const map = new Map();
map.set('key', 'value');

// good
const map = new Map([['key', 'value']]);
```

---

## 12. ES6 新增的其他特性

### 12.1 二进制和八进制字面量

```javascript
0b111110111 === 503 // true
0o767 === 503 // true
```

### 12.2 Unicode 码点转义

```javascript
'\u{1F680}' === '\uD83D\uDE80' // true
```

### 12.3 对象属性简写

```javascript
const foo = 'bar';
const baz = {foo};
// 等同于
const baz = {foo: foo};
```

### 12.4 方法名简写

```javascript
const o = {
  method() {
    return "Hello!";
  }
};

// 等同于
const o = {
  method: function() {
    return "Hello!";
  }
};
```

### 12.5 属性名表达式

```javascript
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```

### 12.6 Object.is()

```javascript
Object.is('foo', 'foo') // true
Object.is({}, {}) // false
Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### 12.7 Object.assign()

```javascript
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

### 12.8 属性的遍历

ES6 一共有 5 种方法可以遍历对象的属性：

1. for...in
2. Object.keys(obj)
3. Object.getOwnPropertyNames(obj)
4. Object.getOwnPropertySymbols(obj)
5. Reflect.ownKeys(obj)

### 12.9 Object.getOwnPropertyDescriptors()

```javascript
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// {
//   foo: { value: 123, writable: true, enumerable: true, configurable: true },
//   bar: { get: [Function: bar], set: undefined, enumerable: true, configurable: true }
// }
```

### 12.10 Object.values()，Object.entries()

```javascript
const obj = { foo: 'bar', baz: 42 };
Object.values(obj) // ['bar', 42]
Object.entries(obj) // [['foo', 'bar'], ['baz', 42]]
```

### 12.11 Object.fromEntries()

```javascript
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```

### 12.12 Symbol.hasInstance

```javascript
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```

### 12.13 Symbol.isConcatSpreadable

```javascript
let arr1 = ['c', 'd'];
arr1[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr1, 'e') // ['a', 'b', ['c','d'], 'e']
```

### 12.14 Symbol.toStringTag

```javascript
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}

let x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"
```

---

## 总结

本教程详细介绍了 ES6 的高级特性：

1. **Proxy**：拦截和自定义对象的基本操作
2. **Reflect**：操作对象的 API
3. **Promise**：异步编程解决方案
4. **Iterator**：遍历器接口
5. **Generator**：异步编程的另一种方案
6. **async/await**：Promise 的语法糖
7. **Class**：面向对象编程
8. **Module**：模块化
9. **编程风格**：ES6 最佳实践
10. **其他特性**：补充特性

掌握这些高级特性，可以更好地编写现代 JavaScript 应用程序。

基础内容请参阅：[ES6 基础教程](./ES6基础教程.md)

---

**参考资源**：
- [ECMAScript 6 入门教程 - 阮一峰](https://es6.ruanyifeng.com/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [ECMAScript 6 Specifications](https://www.ecma-international.org/ecma-262/6.0/)
