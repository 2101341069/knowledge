---
title: JavaScript 教程
tags:
  - 前端
  - JavaScript
  - 编程语言
  - 教程
created: 2026-04-16
---

# JavaScript 教程

> JavaScript 是 Web 开发的核心语言，本教程系统讲解 JavaScript 基础语法和核心概念。

## 目录

1. [JavaScript 简介](#1-javascript-简介)
2. [基础语法](#2-基础语法)
3. [数据类型](#3-数据类型)
4. [运算符](#4-运算符)
5. [流程控制](#5-流程控制)
6. [函数](#6-函数)
7. [对象](#7-对象)
8. [数组](#8-数组)
9. [字符串](#9-字符串)
10. [作用域与闭包](#10-作用域与闭包)
11. [面向对象编程](#11-面向对象编程)
12. [异步编程](#12-异步编程)
13. [DOM 操作](#13-dom-操作)
14. [事件处理](#14-事件处理)
15. [ES6+ 新特性](#15-es6-新特性)

---

## 1. JavaScript 简介

### 1.1 什么是 JavaScript

JavaScript（简称 JS）是一种轻量级、解释型的编程语言，是 Web 开发的三大核心技术之一（HTML + CSS + JavaScript）。

### 1.2 JavaScript 的特点

| 特点 | 说明 |
|------|------|
| **解释型** | 不需要编译，浏览器引擎直接执行 |
| **弱类型** | 变量可以存储任意类型值 |
| **动态类型** | 类型在运行时确定 |
| **基于原型** | 使用原型链实现继承 |
| **事件驱动** | 通过事件响应用户操作 |
| **单线程** | 主线程只有一个，通过异步实现并发 |

### 1.3 在 HTML 中引入 JavaScript

```html
<!-- 方式一：内联 script 标签 -->
<script>
  console.log('Hello, World!');
</script>

<!-- 方式二：外部文件引入 -->
<script src="./js/app.js"></script>

<!-- 方式三：async 异步加载 -->
<script src="analytics.js" async></script>

<!-- 方式四：defer 延迟执行 -->
<script src="app.js" defer></script>
```

**最佳实践**：将 `<script>` 放在 `</body>` 前，避免阻塞页面渲染。

---

## 2. 基础语法

### 2.1 变量声明

```javascript
// var — 函数作用域，可重复声明（不推荐）
var name = '张三';

// let — 块作用域，不可重复声明（推荐）
let age = 25;

// const — 块作用域，声明时必须初始化，不可重新赋值（推荐）
const PI = 3.14159;
```

| 特性 | var | let | const |
|------|-----|------|-------|
| 作用域 | 函数作用域 | 块作用域 | 块作用域 |
| 重复声明 | ✅ 允许 | ❌ 报错 | ❌ 报错 |
| 变量提升 | ✅ 提升 | ❌ TDZ | ❌ TDZ |
| 必须初始化 | ❌ 不需要 | ❌ 不需要 | ✅ 必须 |

### 2.2 命名规范

```javascript
// ✅ 推荐
let userName;           // camelCase — 变量/函数
let MAX_SIZE;           // UPPER_SNAKE_CASE — 常量
let isActive;           // 布尔值用 is/has/can 开头

// ❌ 非法命名
// let 123abc;          // 不能以数字开头
// let my-name;         // 不能含连字符
// let class;           // 不能使用保留字
```

### 2.3 注释

```javascript
// 单行注释

/*
 * 多行注释
 */

/**
 * JSDoc 文档注释
 * @param {string} name - 用户名
 * @returns {string} 问候语
 */
function greet(name) {
  return `你好, ${name}!`;
}
```

---

## 3. 数据类型

### 3.1 类型总览

```
JavaScript 数据类型
├── 基本数据类型（原始类型）
│   ├── Number    — 数字
│   ├── String    — 字符串
│   ├── Boolean   — 布尔值
│   ├── Undefined  — 未定义
│   ├── Null       — 空值
│   ├── Symbol     — 符号（ES6）
│   └── BigInt     — 大整数（ES2020）
│
└── 引用数据类型
    ├── Object     — 对象
    ├── Array      — 数组
    ├── Function   — 函数
    ├── Date       — 日期
    └── RegExp     — 正则
```

### 3.2 typeof 运算符

```javascript
typeof 42;              // "number"
typeof 'hello';         // "string"
typeof true;            // "boolean"
typeof undefined;       // "undefined"
typeof null;            // "object" ⚠️ 历史遗留 bug
typeof {};              // "object"
typeof [];              // "object"
typeof function(){};    // "function"
typeof Symbol('id');    // "symbol"
typeof 123n;            // "bigint"
```

### 3.3 Number 类型

```javascript
// 整数与浮点数
let int = 42;
let float = 3.14;

// 特殊数值
Infinity;              // 无穷大
-Infinity;             // 负无穷大
NaN;                   // Not a Number

// NaN 的判断
isNaN(NaN);            // true（但 'abc' 也返回 true）
Number.isNaN(NaN);     // true（精确判断，推荐）

// 浮点数精度问题
0.1 + 0.2;             // 0.30000000000000004
(0.1 + 0.2).toFixed(2); // "0.30"

// 数值转换
parseInt('123px', 10);  // 123
parseFloat('3.14abc');   // 3.14
Number('42');           // 42
+'42';                   // 42（一元加号）
```

### 3.4 String 类型

```javascript
// 字符串创建
let s1 = '单引号';
let s2 = "双引号";
let s3 = `模板字符串 ${expression}`;

// 常用方法
let str = 'Hello, JavaScript!';

str.length;                    // 18
str.charAt(0);                 // "H"
str[0];                        // "H"
str.indexOf('Java');           // 7
str.includes('Script');        // true
str.startsWith('Hello');       // true
str.endsWith('!');              // true

str.slice(7, 11);              // "Java"
str.substring(7, 11);          // "Java"
str.toUpperCase();             // "HELLO, JAVASCRIPT!"
str.toLowerCase();             // "hello, javascript!"

str.replace('Java', 'JS');     // "Hello, Script!"
str.replaceAll('l', 'L');      // "HeLLo, JavaScript!"

str.trim();                    // 去除两端空白
str.split(',');                // ["Hello", " JavaScript!"]

// 模板字符串
let name = '张三';
let greeting = `你好, ${name}!
今天是 ${new Date().toLocaleDateString()}`;
```

### 3.5 Boolean 类型

```javascript
// 两个值
true;
false;

// falsy 值（转换为 false）
false, 0, -0, 0n, '', null, undefined, NaN

// truthy 值（其他所有值）
// ⚠️ 注意：空数组 []、空对象 {} 都是 truthy！
Boolean([]);           // true
Boolean({});           // true
Boolean('0');          // true
```

### 3.6 Undefined 与 Null

```javascript
// undefined — 变量已声明但未赋值
let x;
console.log(x);        // undefined

// null — 表示"空值"，需手动赋值
let y = null;

// 区别
undefined == null;     // true（宽松相等）
undefined === null;    // false（严格相等）

// 使用建议：undefined 表示"未定义"，null 表示"故意为空"
```

### 3.7 类型转换

```javascript
// 转字符串
String(123);           // "123"
(123).toString();      // "123"

// 转数字
Number('123');         // 123
parseInt('123px');     // 123
parseFloat('3.14');    // 3.14
+'42';                  // 42

// 转布尔值
Boolean(0);            // false
Boolean('hello');      // true
!!value;               // 双重否定转布尔

// 隐式转换（尽量避免）
'5' + 3;               // "53"（字符串拼接）
'5' - 3;               // 2（数学运算，尝试转数字）
```

---

## 4. 运算符

### 4.1 算术运算符

```javascript
let a = 10, b = 3;

a + b;       // 13  加法
a - b;       // 7   减法
a * b;       // 30  乘法
a / b;       // 3.33 除法
a % b;       // 1   取余
a ** b;      // 1000 幂运算（ES6）

// 自增自减
let i = 5;
i++;        // 6（后置，先用后加）
++i;        // 7（前置，先加后用）
```

### 4.2 比较运算符

```javascript
// 严格比较（推荐）
1 === 1;          // true
'1' === 1;        // false（类型不同）
null === undefined; // false

// 宽松比较（尽量避免）
1 == '1';         // true
null == undefined; // true

// 大小比较
5 > 3;            // true
5 >= 5;           // true
3 < 5;            // true
3 <= 5;           // true
```

### 4.3 逻辑运算符

```javascript
// 与（&&）
true && true;     // true
true && false;    // false
'' && 'default';  // ''（短路：第一个 falsy 直接返回）

// 或（||）
false || true;    // true
'value' || 'default'; // 'value'
'' || 'default';  // 'default'

// 非（!）
!true;            // false
!!value;          // 转布尔值

// 空值合并（??）— 只对 null/undefined 生效
null ?? 'default';   // 'default'
0 ?? 'default';      // 0（和 || 的区别）
'' ?? 'default';     // ''

// 可选链（?.）
user?.address?.city;  // 安全访问嵌套属性
arr?.[0];            // 安全索引
fn?.();              // 安全调用函数
```

### 4.4 赋值运算符

```javascript
let x = 10;

x += 5;      // x = x + 5  → 15
x -= 3;      // x = x - 3  → 12
x *= 2;      // x = x * 2  → 24
x /= 4;      // x = x / 4  → 6

// 解构赋值
let [a, b] = [1, 2];
let { name, age } = { name: '张三', age: 25 };

// 展开运算符
let arr = [1, 2, 3];
let arr2 = [...arr, 4, 5];      // [1, 2, 3, 4, 5]
let obj = { a: 1, b: 2 };
let obj2 = { ...obj, c: 3 };    // { a: 1, b: 2, c: 3 }
```

### 4.5 三元运算符

```javascript
let age = 18;
let status = age >= 18 ? '成年' : '未成年';

// 实际应用
let value = user?.name ?? '匿名';
let color = score > 90 ? 'green' : score > 60 ? 'orange' : 'red';
```

---

## 5. 流程控制

### 5.1 if...else 语句

```javascript
let score = 85;

if (score >= 90) {
  console.log('优秀');
} else if (score >= 80) {
  console.log('良好');
} else if (score >= 60) {
  console.log('及格');
} else {
  console.log('不及格');
}

// 提前返回（推荐）
function validate(user) {
  if (!user) return { valid: false, error: '缺少用户信息' };
  if (!user.name) return { valid: false, error: '缺少姓名' };
  return { valid: true };
}
```

### 5.2 switch 语句

```javascript
let day = '周一';

switch (day) {
  case '周一':
  case '周二':
  case '周三':
  case '周四':
  case '周五':
    console.log('工作日');
    break;
  case '周六':
  case '周日':
    console.log('周末');
    break;
  default:
    console.log('未知日期');
}
```

### 5.3 for 循环

```javascript
// 标准 for 循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// for...in — 遍历对象属性
for (let key in obj) {
  console.log(key, obj[key]);
}

// for...of — 遍历可迭代对象
for (let item of array) {
  console.log(item);
}

// for...of 获取索引
for (let [index, item] of array.entries()) {
  console.log(index, item);
}
```

### 5.4 while 和 do...while

```javascript
// while — 先判断后循环
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do...while — 先循环后判断（至少执行一次）
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);
```

### 5.5 break 和 continue

```javascript
// break — 跳出整个循环
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);  // 0-4
}

// continue — 跳过本次循环
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);  // 1, 3, 5, 7, 9
}
```

---

## 6. 函数

### 6.1 函数定义

```javascript
// 函数声明（可被提升）
function add(a, b) {
  return a + b;
}

// 函数表达式（不会被提升）
const multiply = function(a, b) {
  return a * b;
};

// 箭头函数（ES6）
const subtract = (a, b) => a - b;

// 不同写法
const fn1 = () => 42;                    // 无参数
const fn2 = x => x * 2;                 // 单参数，单行
const fn3 = (x, y) => { return x + y; }; // 多行需大括号
const fn4 = (x, y) => ({ x, y });        // 返回对象（需括号）
```

### 6.2 参数

```javascript
// 默认参数
function greet(name = '访客', age = 18) {
  return `${name}, ${age}岁`;
}

// 剩余参数
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5);  // 15

// 解构参数
function printUser({ name, age = 0, city = '未知' }) {
  console.log(name, age, city);
}
printUser({ name: '张三', city: '上海' });
```

### 6.3 返回值

```javascript
// 显式 return
function add(a, b) {
  return a + b;
}

// 提前返回
function validate(user) {
  if (!user) return null;
  if (!user.name) return null;
  return { id: user.id, name: user.name };
}

// 返回多个值（解构）
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5]);
```

### 6.4 箭头函数的 this

```javascript
// 箭头函数没有自己的 this，捕获定义时外层的 this
const team = {
  members: ['张三', '李四'],
  manager: '王经理',

  // ❌ 普通 function 的 this 问题
  getNamesBad: function() {
    this.members.forEach(function(member) {
      // this 不是 team！
    });
  },

  // ✅ 箭头函数正确捕获外层 this
  getNamesGood: function() {
    this.members.forEach((member) => {
      console.log(`${member} - ${this.manager}`);
    });
  },
};
```

### 6.5 高阶函数

```javascript
// 函数作为参数（回调）
function process(data, callback) {
  const result = transform(data);
  callback(result);
}

// 函数作为返回值
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
double(5);  // 10
```

### 6.6 闭包

```javascript
// 闭包：内部函数引用外部函数的变量
function createCounter() {
  let count = 0;  // 私有变量
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; },
  };
}

const counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2

// 防抖函数
function debounce(fn, delay = 300) {
  let timerId = null;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流函数
function throttle(fn, interval = 200) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

---

## 7. 对象

### 7.1 创建对象

```javascript
// 对象字面量
let user = {
  name: '张三',
  age: 25,
  sayHi() {
    return `我是 ${this.name}`;
  },
};

// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
let p1 = new Person('李四', 30);

// Object.create
let proto = { greet() { return 'Hello'; } };
let p2 = Object.create(proto);

// class（ES6）
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} 发出声音`;
  }
}
```

### 7.2 属性操作

```javascript
let obj = { name: '张三', age: 25 };

// 读取属性
obj.name;              // 点语法
obj['name'];            // 方括号（支持变量/表达式）

// 设置属性
obj.city = '北京';
obj['job'] = '工程师';

// 删除属性
delete obj.age;

// 检查属性
'name' in obj;                 // true（含原型链）
obj.hasOwnProperty('name');     // true（仅自身）
Object.hasOwn(obj, 'name');    // true（ES2022）

// 枚举属性
Object.keys(obj);       // ['name', 'city', 'job']
Object.values(obj);     // ['张三', '北京', '工程师']
Object.entries(obj);    // [['name', '张三'], ...]
```

### 7.3 对象展开与合并

```javascript
let defaults = { theme: 'light', lang: 'zh-CN' };
let custom = { theme: 'dark' };

// 浅合并
let merged = { ...defaults, ...custom };
// { theme: 'dark', lang: 'zh-CN' }

// Object.assign
Object.assign({}, defaults, custom);
```

### 7.4 getter/setter

```javascript
class Person {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 2) {
      throw new Error('名字太短');
    }
    this._name = value;
  }
}
```

---

## 8. 数组

### 8.1 创建数组

```javascript
// 字面量
let arr = [1, 2, 3, 4, 5];

// 构造函数
let arr2 = new Array(5);       // [empty × 5]
let arr3 = Array.of(1, 2, 3);  // [1, 2, 3]

// Array.from
Array.from('hello');           // ['h','e','l','l','o']
Array.from({ length: 5 }, (_, i) => i + 1);  // [1, 2, 3, 4, 5]
```

### 8.2 基本操作

```javascript
let fruits = ['苹果', '香蕉', '橙子'];

// 读取
fruits[0];              // '苹果'
fruits.length;          // 3
fruits.at(-1);          // '橙子'（ES2022）

// 尾部操作
fruits.push('西瓜');   // 末尾添加，返回新长度
fruits.pop();           // 末尾移除

// 头部操作
fruits.unshift('草莓'); // 开头添加
fruits.shift();         // 开头移除

// 中间操作
fruits.splice(1, 0, '芒果');  // 在索引1处插入
fruits.splice(1, 1);          // 删除索引1处的元素
fruits.splice(1, 2, 'A', 'B'); // 替换
```

### 8.3 查找与搜索

```javascript
let nums = [1, 3, 5, 7, 9, 3];

// 查找值
nums.indexOf(3);        // 1
nums.lastIndexOf(3);    // 5
nums.includes(3);       // true

// 条件查找
nums.find(x => x > 5);           // 7
nums.findIndex(x => x > 5);      // 3
nums.findLast(x => x > 3);       // 9（ES2023）
```

### 8.4 高阶方法

```javascript
let nums = [1, 2, 3, 4, 5];

// map — 映射
nums.map(x => x * 2);   // [2, 4, 6, 8, 10]

// filter — 过滤
nums.filter(x => x > 3); // [4, 5]

// reduce — 归约
nums.reduce((sum, n) => sum + n, 0);  // 15

// some — 任一满足
nums.some(x => x > 4);  // true

// every — 全部满足
nums.every(x => x > 0); // true

// forEach — 遍历
nums.forEach(x => console.log(x));

// find/findIndex — 查找
nums.find(x => x > 3);     // 4
nums.findIndex(x => x > 3); // 3

// flat — 扁平化
[[1, 2], [3, 4]].flat();   // [1, 2, 3, 4]

// flatMap — 映射 + 扁平化
[1, 2, 3].flatMap(x => [x, x * 10]); // [1, 10, 2, 20, 3, 30]
```

### 8.5 排序与反转

```javascript
let arr = [3, 1, 4, 1, 5, 9];

// 排序（原地修改）
arr.sort((a, b) => a - b);  // 升序
arr.sort((a, b) => b - a);  // 降序

// 字符串排序
names.sort((a, b) => a.localeCompare(b, 'zh-CN'));

// 反转
arr.reverse();

// 新方法（不修改原数组）
arr.toSorted((a, b) => a - b);  // ES2023
arr.toReversed();               // ES2023
```

### 8.6 数组去重

```javascript
// 方式一：Set（最简洁）
let unique = [...new Set(array)];

// 方式二：filter
let unique2 = array.filter((item, index) => 
  array.indexOf(item) === index
);

// 方式三：根据字段去重
function uniqBy(arr, key) {
  const seen = new Map();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.set(val, true);
    return true;
  });
}
```

---

## 9. 字符串

### 9.1 常用方法

```javascript
let str = 'Hello, JavaScript!';

// 获取信息
str.length;                    // 18
str.charAt(0);                 // "H"
str.charCodeAt(0);             // 72

// 查找
str.indexOf('Java');           // 7
str.includes('Script');        // true
str.startsWith('Hello');      // true
str.endsWith('!');             // true

// 提取
str.slice(7, 11);              // "Java"
str.substring(7, 11);         // "Java"

// 大小写转换
str.toUpperCase();             // "HELLO, JAVASCRIPT!"
str.toLowerCase();             // "hello, javascript!"

// 替换
str.replace('Java', 'JS');     // "Hello, Script!"
str.replaceAll('l', 'L');      // "HeLLo, JavaScript!"

// 去除空白
'  hello  '.trim();            // "hello"
'  hello  '.trimStart();       // "hello  "
'  hello  '.trimEnd();         // "  hello"

// 分割与拼接
'a,b,c'.split(',');           // ["a", "b", "c"]
['a', 'b', 'c'].join('-');    // "a-b-c"

// 重复与补齐
'ha'.repeat(3);               // "hahaha"
'5'.padStart(3, '0');         // "005"
'5'.padEnd(3, '=');           // "5=="

// at（支持负索引）
'hello'.at(-1);               // "o"
```

### 9.2 正则表达式

```javascript
// 创建正则
const re1 = /pattern/gi;       // 字面量
const re2 = new RegExp('pattern', 'gi');  // 构造函数

// 常用标志
// g — 全局匹配
// i — 忽略大小写
// m — 多行模式

// 方法
re.test(str);      // 是否匹配
str.match(re);     // 匹配结果数组
str.replace(re, replacement);  // 替换
str.split(re);     // 按正则分割

// 常用正则
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  url: /^https?:\/\/[\w\-\.]+\.[a-z]{2,}/i,
  chinese: /^[\u4e00-\u9fa5]+$/,
};
```

---

## 10. 作用域与闭包

### 10.1 作用域类型

```javascript
// 全局作用域
let globalVar = '全局';

function outer() {
  // 函数作用域
  var funcVar = '函数';

  // 块作用域
  if (true) {
    let blockVar = '块';
    const blockConst = '块常量';
  }
  // console.log(blockVar);  // ReferenceError
}
```

### 10.2 变量提升

```javascript
// var 提升
console.log(a);  // undefined
var a = 1;

// let/const 暂时性死区（TDZ）
// console.log(b);  // ReferenceError
let b = 2;

// 函数声明提升
sayHi();  // 可以调用
function sayHi() { console.log('Hi!'); }

// 函数表达式不提升
// sayHello();  // TypeError
var sayHello = function() { console.log('Hello!'); };
```

### 10.3 闭包深入

```javascript
// 闭包：内部函数引用外部函数的变量

// 示例一：私有变量
function createBankAccount(initialBalance) {
  let balance = initialBalance;
  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) { balance -= amount; return balance; },
    getBalance() { return balance; },
  };
}

const account = createBankAccount(100);
account.deposit(50);  // 150
account.getBalance(); // 150
// balance 无法直接访问，实现数据封装

// 示例二：循环中的闭包问题
// ❌ 错误示范
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出：4, 4, 4

// ✅ 解决方案：改用 let
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 输出：1, 2, 3

// ✅ 解决方案：IIFE
for (var i = 1; i <= 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

---

## 11. 面向对象编程

### 11.1 构造函数

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在 prototype 上定义方法（共享，节省内存）
Person.prototype.greet = function() {
  return `你好，我是 ${this.name}`;
};

const p1 = new Person('张三', 25);
p1.greet();  // "你好，我是 张三"

// instanceof 检查
p1 instanceof Person;  // true
```

### 11.2 Class 语法（ES6）

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this._age = age;
  }

  // 实例方法
  greet() {
    return `你好，我是 ${this.name}`;
  }

  // getter/setter
  get age() {
    return this._age;
  }

  set age(value) {
    if (value < 0) throw new Error('年龄不能为负数');
    this._age = value;
  }

  // 静态方法
  static species = '人类';

  static createAnonymous() {
    return new Person('匿名', 0);
  }
}

const p = new Person('李四', 30);
p.greet();
p.age = 31;
Person.species;  // "人类"
```

### 11.3 继承

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} 发出了声音`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // 必须先调用 super()
    this.breed = breed;
  }

  // 重写父类方法
  speak() {
    return `${this.name}（${this.breed}）汪汪叫！`;
  }
}

const dog = new Dog('旺财', '金毛');
dog.speak();  // "旺财（金毛）汪汪叫！"
```

### 11.4 私有字段（ES2022）

```javascript
class BankAccount {
  #balance;  // 私有字段

  constructor(initialAmount) {
    this.#balance = initialAmount;
  }

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  get balance() {
    return this.#balance;
  }

  // 私有方法
  #validate(amount) {
    return amount > 0;
  }
}

const account = new BankAccount(1000);
account.deposit(500);  // 1500
// account.#balance;   // SyntaxError（类外部无法访问）
```

### 11.5 原型与原型链

```javascript
// 每个对象都有 [[Prototype]] 内部属性
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `你好, ${this.name}`;
};

const p = new Person('张三');

// 原型关系
Object.getPrototypeOf(p) === Person.prototype;  // true
p.__proto__ === Person.prototype;               // true（不推荐）

// 属性查找过程（原型链）
// 1. 先在 p 自身找
// 2. 去 p.__proto__（Person.prototype）找
// 3. 继续沿 __proto__ 链向上查找
// 4. 直到 Object.prototype.__proto__（null）
```

---

## 12. 异步编程

### 12.1 同步 vs 异步

```javascript
// 同步代码：按顺序执行
console.log('1');
console.log('2');
console.log('3');
// 输出: 1 -> 2 -> 3

// 异步代码：不阻塞后续代码
console.log('1');
setTimeout(() => {
  console.log('2');  // 异步任务
}, 0);
console.log('3');
// 输出: 1 -> 3 -> 2
```

### 12.2 事件循环

```
执行顺序：
1. 执行 Call Stack 中的同步代码
2. Call Stack 清空后，检查微任务队列
3. 执行所有微任务
4. 执行一个宏任务
5. 重复 2-4

微任务：Promise.then/catch/finally, queueMicrotask
宏任务：setTimeout, setInterval, I/O, UI 渲染
```

### 12.3 回调函数

```javascript
// 基本回调
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { id: 1, name: '数据' });
  }, 1000);
}

fetchData((err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// 回调地狱（避免）
step1((err1, res1) => {
  step2(res1, (err2, res2) => {
    step3(res2, (err3, res3) => {
      // 越来越深...
    });
  });
});
```

### 12.4 Promise

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功！');
    } else {
      reject(new Error('操作失败'));
    }
  }, 1000);
});

// 消费 Promise
promise
  .then(result => {
    console.log(result);
    return result.toUpperCase();
  })
  .then(upper => {
    console.log(upper);
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### 12.5 Promise 并发

```javascript
// Promise.all — 全部成功才算成功
Promise.all([
  fetchUser(),
  fetchPosts(),
])
  .then(([user, posts]) => {
    console.log(user, posts);
  })
  .catch(err => console.error(err));

// Promise.allSettled — 等待所有结束
Promise.allSettled([task1(), task2(), task3()])
  .then(results => {
    // results: [{status:'fulfilled',value:...}, {status:'rejected',reason:...}]
  });

// Promise.race — 谁快谁赢
Promise.race([fetchFromServerA(), fetchFromServerB()])
  .then(result => console.log(result));

// Promise.any — 第一个成功者胜
Promise.any([serverA(), serverB(), serverC()])
  .then(result => console.log(result));
```

### 12.6 async/await

```javascript
// async 函数总是返回 Promise
async function getData() {
  return 42;  // Promise.resolve(42)
}

// await 暂停 async 函数执行
async function fetchAndDisplay() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('请求失败:', error);
  } finally {
    hideLoading();
  }
}

// 并行执行
async function loadFast() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  return { user, posts, comments };
}

// 错误处理辅助函数
async function to(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

const [data, err] = await to(fetchData());
if (err) {
  handleError(err);
  return;
}
processData(data);
```

### 12.7 异步实战模式

```javascript
// 带超时
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// 带重试
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
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
```

---

## 13. DOM 操作

### 13.1 选择元素

```javascript
// 单个元素
document.getElementById('myId');
document.querySelector('.myClass');

// 多个元素
document.querySelectorAll('.item');      // NodeList
document.getElementsByTagName('div');    // HTMLCollection
document.getElementsByClassName('active');

// 相对选择
element.querySelector('.child');
element.parentElement;
element.children;
element.firstElementChild;
element.lastElementChild;
element.previousElementSibling;
element.nextElementSibling;
element.closest('.container');  // 最近祖先
```

### 13.2 创建与修改元素

```javascript
// 创建元素
const div = document.createElement('div');
div.className = 'card';
div.id = 'card-1';
div.textContent = '卡片内容';
div.innerHTML = '<strong>富文本内容</strong>';

// 添加到页面
document.body.appendChild(div);
parent.insertBefore(div, referenceNode);
parent.append(div, textNode);

// 删除
element.remove();
parent.removeChild(child);

// 克隆
const clone = element.cloneNode(true);  // 深克隆
```

### 13.3 操作样式

```javascript
// 行内样式
element.style.color = 'red';
element.style.backgroundColor = '#fff';
element.style.cssText = 'color: red; font-size: 16px;';

// 计算样式
getComputedStyle(element).fontSize;  // "16px"

// 操作 class
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('visible');
element.classList.contains('active');
element.classList.replace('old', 'new');

// dataset
element.dataset.userId = '123';  // data-user-id="123"
element.dataset.userId;          // "123"
```

### 13.4 操作属性

```javascript
// 通用属性
element.getAttribute('href');
element.setAttribute('href', 'https://example.com');
element.removeAttribute('title');
element.hasAttribute('disabled');

// 表单元素快捷属性
input.value = '新值';
checkbox.checked = true;
select.selectedIndex = 2;
```

### 13.5 文本内容

```javascript
// 纯文本（不解析 HTML，安全）
element.textContent = '<strong>安全文本</strong>';

// HTML 内容（会解析标签，⚠️ XSS 风险）
element.innerHTML = '<em>斜体</em>';

// 安全的 HTML 插入
element.textContent = sanitizeHTML(untrustedInput);
```

---

## 14. 事件处理

### 14.1 事件监听

```javascript
// addEventListener（推荐）
element.addEventListener('click', function(e) {
  console.log('点击了!', e.target);
});

// 移除监听
element.removeEventListener('click', handler);

// 选项配置
element.addEventListener('click', handler, {
  capture: false,  // 捕获阶段触发
  once: true,       // 只触发一次
  passive: true,    // 优化滚动性能
});

// AbortController 批量移除
const controller = new AbortController();
element.addEventListener('click', handler1, { signal: controller.signal });
element.addEventListener('scroll', handler2, { signal: controller.signal });
controller.abort();  // 一次性移除
```

### 14.2 事件对象

```javascript
element.addEventListener('click', function(e) {
  e.target;          // 实际触发的元素
  e.currentTarget;   // 当前绑定的元素

  // 鼠标事件
  e.clientX/clientY; // 相对于视口的坐标
  e.pageX/pageY;     // 相对于页面的坐标

  // 键盘事件
  e.key;             // 按键值（如 'Enter', 'a'）
  e.ctrlKey;         // Ctrl 是否按下
  e.shiftKey;        // Shift 是否按下

  // 阻止默认行为
  e.preventDefault();

  // 阻止冒泡
  e.stopPropagation();
});
```

### 14.3 事件委托

```javascript
// 利用事件冒泡，将子元素事件监听放到父元素
// 优点：减少监听器数量、动态元素也能响应
document.getElementById('list').addEventListener('click', function(e) {
  const target = e.target.closest('li');
  if (!target) return;

  console.log('点击了:', target.dataset.id);
});

// 通用委托函数
function delegate(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, function(e) {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e, target);
    }
  });
}

delegate(document, 'click', '.btn-delete', function(e, el) {
  console.log('删除:', el.dataset.id);
});
```

### 14.4 常用事件

| 类别 | 事件 | 说明 |
|------|------|------|
| 鼠标 | click, dblclick | 单击/双击 |
| 鼠标 | mousedown, mouseup, mousemove | 按下/松开/移动 |
| 鼠标 | mouseenter, mouseleave | 进入/离开（不冒泡） |
| 键盘 | keydown, keyup | 按下/松开 |
| 表单 | submit, reset | 提交/重置 |
| 表单 | focus, blur | 获得/失去焦点 |
| 表单 | change, input | 值改变 |
| 窗口 | load, resize, scroll | 加载/大小变化/滚动 |
| 触摸 | touchstart, touchmove, touchend | 触摸系列 |

---

## 15. ES6+ 新特性

### 15.1 let / const

见 [2.1 变量声明](#21-变量声明)

### 15.2 箭头函数

见 [6.1 函数定义](#61-函数定义)

### 15.3 解构赋值

```javascript
// 数组解构
let [a, b] = [1, 2];
[a, b] = [b, a];  // 交换变量

// 对象解构
let { name, age } = { name: '张三', age: 25 };
let { name: userName } = { name: '李四' };  // 重命名

// 默认值
let [x = 0, y = 0] = [5];
let { z = 10 } = {};

// 剩余元素
let [first, ...rest] = [1, 2, 3, 4];  // first=1, rest=[2,3,4]
let { a, ...others } = { a: 1, b: 2, c: 3 };  // others={b:2,c:3}
```

### 15.4 模板字符串

```javascript
// 基本用法
let name = '张三';
let greeting = `你好, ${name}!
今天是 ${new Date().toLocaleDateString()}`;

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + str + value;
  }, '');
}
highlight`${name}今年${age}岁`;
```

### 15.5 展开运算符

```javascript
// 数组展开
let arr = [1, 2, 3];
let arr2 = [...arr, 4, 5];  // [1, 2, 3, 4, 5]

// 对象展开
let obj = { a: 1, b: 2 };
let obj2 = { ...obj, c: 3 };  // { a: 1, b: 2, c: 3 }

// 剩余参数
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
```

### 15.6 Map 与 Set

```javascript
// Map — 键值对集合（键可以是任意类型）
const map = new Map();
map.set('name', '张三');
map.set(1, 'one');
map.get('name');    // '张三'
map.has('name');    // true
map.delete('name');
map.size;

// Set — 值的唯一集合
const set = new Set([1, 2, 2, 3]);  // Set(3) {1, 2, 3}
set.add(4);
set.has(2);         // true
set.delete(1);

// 去重
const unique = [...new Set(array)];
```

### 15.7 迭代器与生成器

```javascript
// 迭代器
const iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        if (step <= 3) {
          return { value: step, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

for (const val of iterable) {
  console.log(val);  // 1, 2, 3
}

// 生成器函数
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
gen.next();  // { value: 1, done: false }
gen.next();  // { value: 2, done: false }
```

### 15.8 Proxy

```javascript
// Proxy — 拦截对象操作
const handler = {
  get(target, prop) {
    console.log(`读取 ${prop}`);
    return prop in target ? target[prop] : `默认值(${prop})`;
  },
  set(target, prop, value) {
    console.log(`设置 ${prop} = ${value}`);
    target[prop] = value;
    return true;
  },
};

const proxy = new Proxy({}, handler);
proxy.name = '张三';  // 触发 set
proxy.name;           // 触发 get
```

### 15.9 可选链与空值合并

```javascript
// 可选链 ?.
user?.address?.city;  // 安全访问嵌套属性
arr?.[0];             // 安全索引
fn?.();               // 安全调用函数

// 空值合并 ??
null ?? 'default';    // 'default'
undefined ?? 'default'; // 'default'
0 ?? 'default';       // 0（和 || 的区别）
'' ?? 'default';      // ''

// 空值赋值 ??=
let config;
config ??= { theme: 'light' };  // 仅在 config 为 null/undefined 时赋值
```

### 15.10 BigInt

```javascript
// 创建 BigInt
const big = 9007199254740991n;
const big2 = BigInt('9007199254740992');

// 运算
big + 1n;           // 9007199254740992n
big * 2n;           // ...

// 注意：不能与普通数字混用
// big + 1;          // TypeError!
```

---

## 总结

本教程涵盖了 JavaScript 的核心知识：

1. **基础语法**：变量、数据类型、运算符
2. **流程控制**：条件语句、循环语句
3. **函数**：定义、参数、闭包、高阶函数
4. **数据结构**：对象、数组、字符串
5. **面向对象**：构造函数、类、继承、原型
6. **异步编程**：回调、Promise、async/await
7. **DOM 操作**：选择元素、修改元素、事件处理
8. **ES6+ 新特性**：箭头函数、解构、展开运算符、Map/Set、Proxy 等

进阶内容请参阅：[[JavaScript进阶教程]]
