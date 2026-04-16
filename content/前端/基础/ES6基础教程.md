---
title: ECMAScript 6 基础教程
tags:
  - 前端
  - JavaScript
  - ES6
  - ECMAScript
  - 基础教程
created: 2026-04-16
---

# ECMAScript 6 基础教程

> ES6（ECMAScript 2015）是 JavaScript 语言的下一代标准，于 2015 年 6 月正式发布。本教程详细介绍 ES6 的基础特性。

## 目录

1. [ECMAScript 6 简介](#1-ecmascript-6-简介)
2. [let 和 const 命令](#2-let-和-const-命令)
3. [变量的解构赋值](#3-变量的解构赋值)
4. [字符串的扩展](#4-字符串的扩展)
5. [正则的扩展](#5-正则的扩展)
6. [数值的扩展](#6-数值的扩展)
7. [函数的扩展](#7-函数的扩展)
8. [数组的扩展](#8-数组的扩展)
9. [对象的扩展](#9-对象的扩展)
10. [Symbol](#10-symbol)
11. [Set 和 Map 数据结构](#11-set-和-map-数据结构)

---

## 1. ECMAScript 6 简介

### 1.1 什么是 ECMAScript

ECMAScript 是 JavaScript 的标准规范，由 ECMA 国际标准化组织制定。JavaScript 是 ECMAScript 的实现。

### 1.2 ES6 的历史

| 时间 | 版本 | 说明 |
|------|------|------|
| 1997 | ES1 | 第一个版本 |
| 1998 | ES2 | 编辑变更 |
| 1999 | ES3 | 添加正则、try/catch |
| 2009 | ES5 | strict mode、JSON、Array 方法 |
| **2015** | **ES6（ES2015）** | **重大更新，大量新特性** |
| 2016 | ES2016 | Array.includes()、指数运算符 |
| 2017 | ES2017 | async/await、Object.values() |
| 2018 | ES2018 | 异步迭代、Rest/Spread 属性 |
| 2019 | ES2019 | Array.flat()、Object.fromEntries() |
| 2020 | ES2020 | 可选链、空值合并、BigInt |
| 2021 | ES2021 | 逻辑赋值、数字分隔符 |
| 2022 | ES2022 | 顶层 await、类私有字段 |
| 2023 | ES2023 | 数组不改变原数组的方法 |
| 2024 | ES2024 | Promise.withResolvers() |

### 1.3 ES6 的目标

1. **更安全的语言**：解决 ES5 的一些缺陷
2. **更强大的语言**：新增更多语法和 API
3. **更易维护的代码**：支持模块化、类等
4. **更好的开发体验**：语法更简洁、表达能力更强

### 1.4 Babel 转码器

由于浏览器对 ES6 的支持程度不同，通常需要使用 Babel 将 ES6 代码转译为 ES5 代码。

```bash
# 安装 Babel
npm install --save-dev @babel/core @babel/cli @babel/preset-env

# 配置 .babelrc
{
  "presets": ["@babel/preset-env"]
}

# 转译
npx babel src -d lib
```

### 1.5 Node.js 中的 ES6

Node.js 对 ES6 的支持程度较高，但模块化语法需要特殊处理：

```javascript
// package.json
{
  "type": "module"
}

// 或者使用 .mjs 扩展名
import { something } from './module.mjs';
```

---

## 2. let 和 const 命令

### 2.1 let 命令

#### 基本用法

```javascript
// let 声明的变量只在所在代码块有效
{
  let a = 10;
  var b = 1;
}
a // ReferenceError: a is not defined
b // 1
```

#### 不存在变量提升

```javascript
// var 存在变量提升
console.log(foo); // undefined
var foo = 2;

// let 不存在变量提升
console.log(bar); // ReferenceError
let bar = 2;
```

#### 暂时性死区（TDZ）

```javascript
// 在代码块内，使用 let 声明变量之前，该变量是不可用的
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}

// 死区示例
function bar(x = y, y = 2) {
  return [x, y];
}
bar(); // ReferenceError: y is not defined
```

#### 不允许重复声明

```javascript
// let 不允许在相同作用域内重复声明同一变量
function func() {
  let a = 10;
  let a = 1; // SyntaxError
}

// 不能在函数内部重新声明参数
function func(arg) {
  let arg; // SyntaxError
}
```

#### 块级作用域

```javascript
// ES5 只有全局作用域和函数作用域，没有块级作用域
var tmp = new Date();

function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world'; // 变量提升，覆盖外层 tmp
  }
}
f(); // undefined

// ES6 的块级作用域
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5（不受内层代码块影响）
}
```

### 2.2 const 命令

#### 基本用法

```javascript
// const 声明一个只读的常量，一旦声明，值不能改变
const PI = 3.1415;
PI // 3.1415

PI = 3; // TypeError: Assignment to constant variable.

// const 声明时必须初始化
const foo; // SyntaxError: Missing initializer in const declaration
```

#### 本质

```javascript
// const 实际上保证的是变量指向的内存地址不得改动
// 对于简单类型（数值、字符串、布尔值），值就保存在变量指向的内存地址
// 对于复合类型（对象、数组），变量指向的内存地址保存的是一个指针

const foo = {};

// 可以添加属性
foo.prop = 123;
foo.prop // 123

// 不能重新赋值
foo = {}; // TypeError

// 如果想冻结对象，使用 Object.freeze
const foo = Object.freeze({});
foo.prop = 123; // 不起作用
```

### 2.3 顶层对象

```javascript
// ES5 中，顶层对象的属性与全局变量是等价的
var a = 1;
window.a // 1

// ES6 中，let、const、class 声明的全局变量不属于顶层对象的属性
let b = 1;
window.b // undefined
```

### 2.4 最佳实践

```javascript
// 1. 默认使用 const
// 2. 需要重新赋值时使用 let
// 3. 避免使用 var

// ✅ 推荐
const MAX_SIZE = 100;
let counter = 0;

// ❌ 避免
var x = 1;
```

---

## 3. 变量的解构赋值

### 3.1 数组的解构赋值

#### 基本用法

```javascript
// 按照一定模式从数组和对象中提取值，对变量进行赋值
let [a, b, c] = [1, 2, 3];
a // 1
b // 2
c // 3

// 嵌套数组解构
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

// 解构不成功，变量的值为 undefined
let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

#### 默认值

```javascript
// 解构允许指定默认值
let [x, y = 'b'] = ['a'];
x // 'a'
y // 'b'

// 默认值是一个表达式，惰性求值
function f() {
  console.log('aaa');
}
let [x = f()] = [1]; // f() 不会执行

// 默认值可以引用解构赋值的其他变量，但该变量必须已经声明
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

### 3.2 对象的解构赋值

#### 基本用法

```javascript
// 对象的解构与数组不同：数组按次序，对象按属性名
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

// 变量名与属性名不一致
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined

// 嵌套对象解构
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};
let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"
```

#### 默认值

```javascript
// 默认值生效的条件是对象的属性值严格等于 undefined
let { x = 3 } = {};
x // 3

let { x, y = 5 } = { x: 1 };
x // 1
y // 5

let { x: y = 3 } = {};
y // 3
```

#### 注意事项

```javascript
// 1. 如果要将一个已经声明的变量用于解构赋值，必须非常小心
let x;
{x} = {x: 1}; // SyntaxError: syntax error
// 正确写法
({x} = {x: 1});

// 2. 解构赋值允许等号左边的模式之中不放置任何变量名
({} = [true, false]); // 可以执行

// 3. 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

### 3.3 字符串的解构赋值

```javascript
// 字符串也可以解构赋值，因为字符串被转换成了一个类似数组的对象
let [a, b, c] = 'hello';
a // "h"
b // "e"
c // "l"

// 类似数组的对象都有一个 length 属性
let {length : len} = 'hello';
len // 5
```

### 3.4 数值和布尔值的解构赋值

```javascript
// 解构赋值的规则：只要等号右边的值不是对象或数组，就先将其转为对象
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

### 3.5 函数参数的解构赋值

```javascript
// 函数参数也可以使用解构赋值
function add([x, y]) {
  return x + y;
}
add([1, 2]); // 3

// 函数参数的解构也可以使用默认值
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

// 另一种写法（为参数对象指定默认值）
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

### 3.6 用途

#### 交换变量的值

```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

#### 从函数返回多个值

```javascript
// 返回数组
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回对象
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

#### 函数参数的定义

```javascript
// 参数是一组有次序的值
function f([x, y, z]) { /* ... */ }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { /* ... */ }
f({z: 3, y: 2, x: 1});
```

#### 提取 JSON 数据

```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;
```

#### 函数参数的默认值

```javascript
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

#### 遍历 Map 结构

```javascript
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world

// 只获取键名
for (let [key] of map) {
  // ...
}

// 只获取键值
for (let [,value] of map) {
  // ...
}
```

#### 输入模块的指定方法

```javascript
import { SourceMapConsumer, SourceNode } from "source-map";
```

---

## 4. 字符串的扩展

### 4.1 字符的 Unicode 表示法

```javascript
// ES6 允许采用 \uxxxx 形式表示一个字符
'\u0061' // "a"

// 超出 \uFFFF 范围的字符，用两个双字节表示
'\uD842\uDFB7' // "𠮷"

// ES6 改为将码点放入大括号
'\u{20BB7}' // "𠮷"
'\u{41}\u{42}\u{43}' // "ABC"

let hello = 123;
hell\u{6F} // 123
```

### 4.2 字符串的遍历器接口

```javascript
// ES6 为字符串添加了遍历器接口
for (let codePoint of 'foo') {
  console.log(codePoint)
}
// "f"
// "o"
// "o"

// 优点是可以识别大于 0xFFFF 的码点
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let ch of text) {
  console.log(ch);
}
// "𠮷"
```

### 4.3 模板字符串

#### 基本用法

```javascript
// 模板字符串是增强版的字符串，用反引号（`）标识
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);
// string text line 1
// string text line 2

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
// "Hello Bob, how are you today?"
```

#### 嵌入表达式

```javascript
// 大括号内部可以放入任意 JavaScript 表达式
let x = 1;
let y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

let obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// "3"
```

#### 调用函数

```javascript
function fn() {
  return "Hello World";
}

`foo ${fn()} bar`
// foo Hello World bar
```

#### 标签模板

```javascript
// 标签模板是一个函数，它的第一个参数是一个数组
// 该数组的成员是模板字符串中那些没有变量替换的部分
// 其他参数都是模板字符串各个变量被替换后的值

let a = 5;
let b = 10;

function tag(s, v1, v2) {
  console.log(s[0]);  // "Hello "
  console.log(s[1]);  // " world "
  console.log(s[2]);  // ""
  console.log(v1);    // 15
  console.log(v2);    // 50
  return "OK";
}

tag`Hello ${ a + b } world ${ a * b }`;
// "Hello "
// " world "
// ""
// 15
// 50
// 返回值: "OK"
```

### 4.4 新增方法

#### includes(), startsWith(), endsWith()

```javascript
// includes()：返回布尔值，表示是否找到了参数字符串
// startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部
// endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部

let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

// 这三个方法都支持第二个参数，表示开始搜索的位置
s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

#### repeat()

```javascript
// repeat 方法返回一个新字符串，表示将原字符串重复 n 次
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""

// 小数会被取整
'na'.repeat(2.9) // "nana"

// 负数或 Infinity 会报错
'na'.repeat(-1) // RangeError
'na'.repeat(Infinity) // RangeError

// 0 到 -1 之间的小数等同于 0
'na'.repeat(-0.9) // ""

// NaN 等同于 0
'na'.repeat(NaN) // ""

// 字符串会先转为数字
'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"
```

#### padStart()，padEnd()

```javascript
// padStart() 用于头部补全
// padEnd() 用于尾部补全
// 接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串

'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

// 如果原字符串长度等于或大于最大长度，则字符串补全不生效，返回原字符串
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

// 如果省略第二个参数，默认使用空格补全
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '

// 常见用途：补全位数
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"

// 常见用途：提示字符串格式
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

#### trimStart()，trimEnd()

```javascript
// trimStart() 消除字符串头部的空格
// trimEnd() 消除尾部的空格
const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"

// 浏览器还部署了额外的两个方法，trimLeft 是 trimStart 的别名，trimRight 是 trimEnd 的别名
```

#### at()

```javascript
// at() 方法返回字符串给定位置的字符（支持负索引）
const str = 'hello';
str.at(0) // "h"
str.at(-1) // "o"
```

---

## 5. 正则的扩展

### 5.1 RegExp 构造函数

```javascript
// ES5 中，RegExp 构造函数只能接受字符串作为参数
var regex = new RegExp('xyz', 'i');
// 等价于
var regex = /xyz/i;

// ES6 允许第一个参数是正则对象，这时可以使用第二个参数指定修饰符
var regex = new RegExp(/xyz/i);
// 等价于
var regex = /xyz/i;

// 第二个参数会覆盖原有修饰符
var regex = new RegExp(/xyz/g, 'i');
regex.flags // "i"
```

### 5.2 字符串的正则方法

```javascript
// ES6 将字符串对象正则方法全部定义在 RegExp 对象上
// String.prototype.match 调用 RegExp.prototype[Symbol.match]
// String.prototype.replace 调用 RegExp.prototype[Symbol.replace]
// String.prototype.search 调用 RegExp.prototype[Symbol.search]
// String.prototype.split 调用 RegExp.prototype[Symbol.split]
```

### 5.3 u 修饰符

```javascript
// u 修饰符表示使用 Unicode 模式，正确处理大于 \uFFFF 的 Unicode 字符
/^\uD842/.test('\uD842\uDFB7') // true
/^\uD842/u.test('\uD842\uDFB7') // false

// 点（.）字符在正则表达式中，代表任何单个字符
// 但对于码点大于 0xFFFF 的 Unicode 字符，点字符不能识别，必须加上 u 修饰符
let s = '𠮷';
/^.$/.test(s) // false
/^.$/u.test(s) // true

// 使用 u 修饰符后，所有量词都会正确识别码点大于 0xFFFF 的 Unicode 字符
/a{2}/.test('aa') // true
/a{2}/u.test('aa') // true
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

### 5.4 y 修饰符

```javascript
// y 修饰符叫做"粘连"（sticky）修饰符
// y 修饰符的作用与 g 修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始
// 不同之处在于，g 修饰符只要剩余位置中存在匹配就可，而 y 修饰符确保匹配必须从剩余的第一个位置开始

var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null

// 实际上，y 修饰符号隐含了头部匹配的 ^ 修饰符
// y 修饰符的设计本意，就是让头部匹配的 ^ 在全局匹配中有效
```

### 5.5 flags 属性

```javascript
// ES6 为正则表达式新增了 flags 属性，返回正则表达式的修饰符
/abc/ig.flags // 'gi'

// 与 source 属性的区别
/abc/ig.source // 'abc'（返回正则表达式的正文）
/abc/ig.flags  // 'gi'（返回正则表达式的修饰符）
```

### 5.6 具名组匹配

```javascript
// ES2018 引入了具名组匹配（Named Capture Groups）
// 允许为每一个组匹配指定一个名字

const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31

// 解构赋值和替换
let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
one // 'foo'
two // 'bar'

// 替换
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// '02/01/2015'
```

---

## 6. 数值的扩展

### 6.1 二进制和八进制表示法

```javascript
// ES6 提供了二进制和八进制数值的新的写法
// 二进制用前缀 0b 或 0B
// 八进制用前缀 0o 或 0O

0b111110111 === 503 // true
0o767 === 503 // true

// 如果要将 0b 和 0o 前缀的字符串数值转为十进制，使用 Number 方法
Number('0b111') // 7
Number('0o10') // 8
```

### 6.2 Number.isFinite(), Number.isNaN()

```javascript
// Number.isFinite() 用来检查一个数值是否为有限的（finite）
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false

// Number.isNaN() 用来检查一个值是否为 NaN
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true'/'0') // true

// 与传统全局方法的区别
// 传统方法先调用 Number() 将非数值转为数值，再进行判断
// 新方法只对数值有效，非数值一律返回 false
isNaN(NaN) // true
isNaN("NaN") // true（"NaN" 被转为 NaN）
Number.isNaN("NaN") // false（字符串不被转为 NaN）
```

### 6.3 Number.parseInt(), Number.parseFloat()

```javascript
// ES6 将全局方法 parseInt() 和 parseFloat() 移植到 Number 对象上
// 行为完全保持不变

// ES5 的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6 的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45

// 这样做的目的，是逐步减少全局性方法，使得语言逐步模块化
Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true
```

### 6.4 Number.isInteger()

```javascript
// Number.isInteger() 用来判断一个数值是否为整数
Number.isInteger(25) // true
Number.isInteger(25.1) // false
Number.isInteger(25.0) // true（JavaScript 内部整数和浮点数采用同样的储存方法）

// 如果参数不是数值，Number.isInteger 返回 false
Number.isInteger() // false
Number.isInteger(null) // false
Number.isInteger('15') // false
Number.isInteger(true) // false
```

### 6.5 Number.EPSILON

```javascript
// Number.EPSILON 是一个极小的常量，等于 2^-52
// 引入这个量是为了浮点数计算的误差
Number.EPSILON === Math.pow(2, -52) // true

// 使用示例：检查误差是否在 Number.EPSILON 范围内
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON;
}
0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```

### 6.6 安全整数和 Number.isSafeInteger()

```javascript
// JavaScript 能够准确表示的整数范围在 -2^53 到 2^53 之间（不含两个端点）
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1 // true
Number.MAX_SAFE_INTEGER === 9007199254740991 // true
Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER // true
Number.MIN_SAFE_INTEGER === -9007199254740991 // true

// Number.isSafeInteger() 判断一个整数是否在这个范围之内
Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
```

### 6.7 Math 对象的扩展

#### Math.trunc()

```javascript
// Math.trunc() 去除一个数的小数部分，返回整数部分
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0

// 对于非数值，Math.trunc 内部使用 Number 方法将其先转为数值
Math.trunc('123.456') // 123
Math.trunc(true) // 1
Math.trunc(false) // 0
Math.trunc(null) // 0

// 对于空值和无法截取整数的值，返回 NaN
Math.trunc(NaN); // NaN
Math.trunc('foo'); // NaN
Math.trunc(); // NaN
Math.trunc(undefined) // NaN
```

#### Math.sign()

```javascript
// Math.sign() 判断一个数是正数、负数、还是零
// 正数返回 +1，负数返回 -1，零返回 0 或 -0，其他值返回 NaN
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
Math.sign('foo') // NaN
Math.sign() // NaN
```

#### Math.cbrt()

```javascript
// Math.cbrt() 计算一个数的立方根
Math.cbrt(-1) // -1
Math.cbrt(0) // 0
Math.cbrt(1) // 1
Math.cbrt(2) // 1.2599210498948734
Math.cbrt(8) // 2
Math.cbrt(-8) // -2
Math.cbrt('hello') // NaN
```

#### Math.clz32()

```javascript
// Math.clz32() 返回一个数的 32 位无符号整数形式有多少个前导 0
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1000) // 22
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2
```

#### Math.imul()

```javascript
// Math.imul() 返回两个数以 32 位带符号整数形式相乘的结果
Math.imul(2, 4) // 8
Math.imul(-1, 8) // -8
Math.imul(-2, -2) // 4
```

#### Math.fround()

```javascript
// Math.fround() 返回一个数的单精度浮点数形式
Math.fround(0) // 0
Math.fround(1) // 1
Math.fround(1.337) // 1.3370000123977661
Math.fround(1.5) // 1.5
Math.fround(NaN) // NaN
```

#### Math.hypot()

```javascript
// Math.hypot() 返回所有参数的平方和的平方根
Math.hypot(3, 4); // 5
Math.hypot(3, 4, 5); // 7.0710678118654755
Math.hypot(); // 0
Math.hypot(NaN); // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5'); // 7.0710678118654755
```

#### 对数方法

```javascript
// Math.expm1() 返回 e^x - 1
Math.expm1(-1) // -0.6321205588285577
Math.expm1(0) // 0
Math.expm1(1) // 1.718281828459045

// Math.log1p() 返回 1 + x 的自然对数
Math.log1p(1) // 0.6931471805599453
Math.log1p(0) // 0
Math.log1p(-1) // -Infinity
Math.log1p(-2) // NaN

// Math.log10() 返回以 10 为底的 x 的对数
Math.log10(2) // 0.3010299956639812
Math.log10(1) // 0
Math.log10(0) // -Infinity
Math.log10(-2) // NaN

// Math.log2() 返回以 2 为底的 x 的对数
Math.log2(1024) // 10
Math.log2(1) // 0
Math.log2(0) // -Infinity
Math.log2(-2) // NaN
```

#### 双曲函数方法

```javascript
// ES6 新增了 6 个双曲函数方法
Math.sinh(x) // 返回 x 的双曲正弦（hyperbolic sine）
Math.cosh(x) // 返回 x 的双曲余弦（hyperbolic cosine）
Math.tanh(x) // 返回 x 的双曲正切（hyperbolic tangent）
Math.asinh(x) // 返回 x 的反双曲正弦（inverse hyperbolic sine）
Math.acosh(x) // 返回 x 的反双曲余弦（inverse hyperbolic cosine）
Math.atanh(x) // 返回 x 的反双曲正切（inverse hyperbolic tangent）
```

### 6.8 BigInt 数据类型

```javascript
// ES2020 引入了一种新的数据类型 BigInt，用于表示大于 2^53 - 1 的整数
// BigInt 只能表示整数，没有位数限制

// 创建 BigInt
const a = 2172141653n;
const b = 15346349309n;
a * b // 333344445555666677777n（正确结果）
Number(a) * Number(b) // 333344445555666680000（不正确）

// BigInt 类型使用后缀 n 表示
const bigInt = 9007199254740993n;
typeof bigInt // 'bigint'

// BigInt() 构造函数
BigInt(123) // 123n
BigInt('123') // 123n
BigInt(false) // 0n
BigInt(true) // 1n

// BigInt 不能与普通数值混合运算
// 1n + 1 // TypeError
1n + 1n // 2n

// BigInt 可以使用 + - * / 等运算符
const bigNum = 10n;
bigNum + 5n; // 15n
bigNum * 5n; // 50n
bigNum / 3n; // 3n（除法会舍去小数部分）
bigNum % 3n; // 1n
bigNum ** 3n; // 1000n

// BigInt 可以与字符串相加
10n + '20' // '1020'（字符串拼接）
```

---

## 7. 函数的扩展

### 7.1 函数参数的默认值

#### 基本用法

```javascript
// ES6 允许为函数的参数设置默认值
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello
```

#### 与解构赋值默认值结合使用

```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined

// 结合使用默认值
function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5
```

#### 参数默认值的位置

```javascript
// 通常情况下，定义了默认值的参数应该是函数的尾参数
// 这样比较容易看出到底省略了哪些参数

// ✅ 好的写法
function f(x, y = 1, z = 2) {
  console.log(x, y, z);
}
f(1) // 1 1 2
f(1, , 3) // 报错（不能省略中间参数）

// ❌ 不好的写法
function f(x = 1, y) {
  return [x, y];
}
f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) // 报错
f(undefined, 1) // [1, 1]
```

#### 函数的 length 属性

```javascript
// 指定了默认值后，函数的 length 属性将返回没有指定默认值的参数个数
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2

// rest 参数也不会计入 length 属性
(function(...args) {}).length // 0
```

#### 作用域

```javascript
// 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1（y 的默认值等于参数 x，而不是函数内部的 x）

// 更复杂的例子
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}
foo() // 3
x // 1
```

### 7.2 rest 参数

```javascript
// ES6 引入 rest 参数（形式为 ...变量名），用于获取函数的多余参数
function add(...values) {
  let sum = 0;
  for (var val of values) {
    sum += val;
  }
  return sum;
}
add(2, 5, 3) // 10

// rest 参数代替 arguments 变量
// ES5 的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// ES6 的写法
const sortNumbers = (...numbers) => numbers.sort();

// rest 参数之后不能再有其他参数
// function f(a, ...b, c) {} // SyntaxError: Rest parameter must be last formal parameter
```

### 7.3 严格模式

```javascript
// ES2016 规定，只要函数参数使用了默认值、解构赋值、或者扩展运算符
// 那么函数内部就不能显式设定为严格模式

// ❌ 报错
function doSomething(a, b = a) {
  'use strict';
  // ...
}

// ✅ 规避方法1：设定全局性的严格模式
'use strict';
function doSomething(a, b = a) {
  // ...
}

// ✅ 规避方法2：把函数包在一个无参数的立即执行函数里面
const doSomething = (function () {
  'use strict';
  return function(value = 42) {
    return value;
  };
}());
```

### 7.4 name 属性

```javascript
// 函数的 name 属性返回该函数的函数名
function foo() {}
foo.name // "foo"

// 如果将匿名函数赋值给变量，ES5 的 name 属性返回空字符串，ES6 返回实际的函数名
var f = function () {};
// ES5
f.name // ""
// ES6
f.name // "f"

// Function 构造函数返回的函数实例，name 属性为 "anonymous"
(new Function).name // "anonymous"

// bind 返回的函数，name 属性值会加上 "bound " 前缀
function foo() {};
foo.bind({}).name // "bound foo"
(function(){}).bind({}).name // "bound "
```

### 7.5 箭头函数

#### 基本语法

```javascript
var f = v => v;
// 等同于
var f = function (v) {
  return v;
};

// 如果箭头函数不需要参数或需要多个参数，使用圆括号
var f = () => 5;
// 等同于
var f = function () { return 5 };

var f = (num1, num2) => num1 + num2;
// 等同于
var f = function(num1, num2) {
  return num1 + num2;
};

// 如果箭头函数的代码块多于一条语句，使用大括号，并使用 return
var sum = (num1, num2) => { return num1 + num2; };

// 箭头函数返回对象时，必须在对象外面加上括号
var getTempItem = id => ({ id: id, name: "Temp" });
```

#### 使用注意点

```javascript
// 1. 箭头函数没有自己的 this 对象
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数的 this 绑定定义时所在的作用域
  setInterval(() => this.s1++, 1000);
  // 普通函数的 this 指向运行时所在的作用域
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();
setTimeout(() => console.log('s1: ', timer.s1), 3100); // s1: 3
setTimeout(() => console.log('s2: ', timer.s2), 3100); // s2: 0

// 2. 不可以当作构造函数
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor

// 3. 不可以使用 arguments 对象
var f = () => {
  console.log(arguments); // ReferenceError: arguments is not defined
};
f(1, 2);

// 4. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数
```

#### 嵌套的箭头函数

```javascript
// 箭头函数内部，再使用箭头函数
const insert = (value) => ({into: (array) => ({after: (afterValue) => {
  array.splice(array.indexOf(afterValue) + 1, 0, value);
  return array;
}})});

insert(2).into([1, 3]).after(1); // [1, 2, 3]
```

### 7.6 尾调用优化

#### 什么是尾调用

```javascript
// 尾调用（Tail Call）是指某个函数的最后一步是调用另一个函数
function f(x) {
  return g(x);
}

// 以下三种情况都不属于尾调用
// 情况一：调用后还有操作
function f(x) {
  let y = g(x);
  return y;
}

// 情况二：调用后还有操作（即使写在一行）
function f(x) {
  return g(x) + 1;
}

// 情况三：没有 return
function f(x) {
  g(x);
}
```

#### 尾调用优化

```javascript
// 尾调用之所以与其他调用不同，就在于它的特殊调用位置
// 我们知道，函数调用会在内存形成一个"调用记录"，又称"调用帧"（call frame）
// 保存调用位置和内部变量等信息
// 如果在函数 A 的内部调用函数 B，那么在 A 的调用帧上方还会形成一个 B 的调用帧
// 等到 B 运行结束，将结果返回到 A，B 的调用帧才会消失

// 尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧
// 因为调用位置、内部变量等信息都不会再用到了
// 只要直接用内层函数的调用帧取代外层函数的调用帧即可

function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);

// 上面代码中，如果函数 g 不是尾调用，函数 f 就需要保存内部变量 m 和 n 的值、g 的调用位置等信息
// 但由于调用 g 之后，函数 f 就结束了，所以执行到最后一步，完全可以删除 f() 的调用帧，只保留 g(3) 的调用帧
```

#### 尾递归

```javascript
// 函数调用自身，称为递归。如果尾调用自身，就称为尾递归
// 递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生"栈溢出"错误
// 但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生"栈溢出"错误

// 阶乘的递归实现（非尾递归）
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
factorial(5) // 120

// 阶乘的递归实现（尾递归）
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
factorial(5, 1) // 120

// Fibonacci 数列的尾递归实现
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}
Fibonacci(10) // 89
// Fibonacci(100) // 堆栈溢出

// 尾递归优化实现
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};
  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}
Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
```

---

## 8. 数组的扩展

### 8.1 扩展运算符

#### 含义

```javascript
// 扩展运算符（spread）是三个点（...），将一个数组转为用逗号分隔的参数序列
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]

// 该运算符主要用于函数调用
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers) // 42
```

#### 替代函数的 apply 方法

```javascript
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6 的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);

// 应用：求数组最大元素
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

#### 复制数组

```javascript
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;

// ES5 的写法
const a2 = a1.concat();
```

#### 合并数组

```javascript
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

#### 与解构赋值结合

```javascript
// 扩展运算符可以与解构赋值结合起来，用于生成数组
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...rest] = [];
first // undefined
rest  // []

const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []

// 如果将扩展运算符用于数组赋值，只能放在参数的最后一位
const [...butLast, last] = [1, 2, 3, 4, 5]; // 报错
const [first, ...middle, last] = [1, 2, 3, 4, 5]; // 报错
```

#### 字符串

```javascript
// 扩展运算符还可以将字符串转为真正的数组
[...'hello']
// [ "h", "e", "l", "l", "o" ]

// 能够正确识别四个字节的 Unicode 字符
'x\uD83D\uDE80y'.split('').reverse().join('')
// 'y\uDE80\uD83Dx'
[...'x\uD83D\uDE80y'].reverse().join('')
// 'y\uD83D\uDE80x'
```

#### 实现了 Iterator 接口的对象

```javascript
// 任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

// Number 和 String 对象没有部署 Iterator 接口，使用扩展运算符会报错
let arrayLike = {
  '0': 'a',
  '1': 'b',
  'length': 2
};
// [...arrayLike] // TypeError: arrayLike is not iterable

// 可以使用 Array.from 将类数组对象转为数组
Array.from(arrayLike); // ['a', 'b']
```

### 8.2 Array.from()

```javascript
// Array.from() 用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// ES5 的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6 的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

// 实际应用：NodeList 集合
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => p.textContent.length > 100);

// 字符串
Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

// Set 结构
let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

// Array.from 还可以接受第二个参数，作用类似于数组的 map 方法
Array.from(arrayLike, x => x * x);
// [1, 4, 9]

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]

// Array.from() 的第三个参数：绑定 this
Array.from([1, 2, 3], function (x) {
  return x * this.multiplier;
}, { multiplier: 10 });
// [10, 20, 30]
```

### 8.3 Array.of()

```javascript
// Array.of() 用于将一组值转换为数组
Array.of(3, 11, 8) // [3, 11, 8]
Array.of(3) // [3]
Array.of(3).length // 1

// 这个方法的主要目的是弥补数组构造函数 Array() 的不足
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

// Array.of 基本上可以替代 Array() 或 new Array()
Array.of(undefined) // [undefined]
Array.of() // []
Array.of(NaN) // [NaN]
Array.of(1, 2, 3) // [1, 2, 3]
```

### 8.4 copyWithin()

```javascript
// copyWithin() 在当前数组内部将指定位置的成员复制到其他位置
// Array.prototype.copyWithin(target, start = 0, end = this.length)
// target（必需）：从该位置开始替换数据
// start（可选）：从该位置开始读取数据，默认为 0
// end（可选）：到该位置前停止读取数据，默认为数组长度

[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

// 将 3 号位复制到 0 号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2 相当于 3 号位，-1 相当于 4 号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]
```

### 8.5 find() 和 findIndex()

```javascript
// find() 找出第一个符合条件的数组成员
[1, 4, -5, 10].find((n) => n < 0)
// -5

[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10

// findIndex() 返回第一个符合条件的数组成员的位置
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2

// 这两个方法都可以发现 NaN，弥补了数组的 indexOf 方法的不足
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Number.isNaN(y))
// 0

// 还可以接受第二个参数，用来绑定回调函数的 this 对象
function f(v) {
  return v > this.age;
}
let person = {age: 15};
[10, 12, 26, 19].find(f, person); // 26
```

### 8.6 fill()

```javascript
// fill() 使用给定值填充一个数组
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

// fill() 还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']

// 如果填充的类型为对象，那么是浅拷贝
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr
// [[5], [5], [5]]
```

### 8.7 entries()，keys() 和 values()

```javascript
// ES6 提供三个新方法：entries()、keys() 和 values()
// 用于遍历数组，它们都返回一个遍历器对象

for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

// 如果不使用 for...of 循环，可以手动调用遍历器对象的 next 方法
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

### 8.8 includes()

```javascript
// includes() 返回一个布尔值，表示某个数组是否包含给定的值
[1, 2, 3].includes(2) // true
[1, 2, 3].includes(4) // false
[1, 2, NaN].includes(NaN) // true

// 该方法的第二个参数表示搜索的起始位置
[1, 2, 3].includes(3, 3); // false
[1, 2, 3].includes(3, -1); // true

// 使用 indexOf 方法检查是否包含某个值
// indexOf 有两个缺点：一是不够语义化，二是内部使用严格相等运算符（===），会导致对 NaN 的误判
[NaN].indexOf(NaN)
// -1
[NaN].includes(NaN)
// true
```

### 8.9 flat()，flatMap()

```javascript
// flat() 将嵌套的数组"拉平"成一维数组
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

// flat() 默认只会"拉平"一层
[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]

// 可以传入一个整数参数，表示要拉平的层数
[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]

// 如果不管有多少层嵌套，都要转成一维数组，可以用 Infinity 关键字作为参数
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]

// 如果原数组有空位，flat() 方法会跳过空位
[1, 2, , 4, 5].flat()
// [1, 2, 4, 5]

// flatMap() 方法对原数组的每个成员执行一个函数
// 然后对返回值组成的数组执行 flat() 方法
// 该方法返回一个新数组，不改变原数组
// 相当于 map().flat()，但是只执行一次
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]

// flatMap() 只能展开一层数组
[1, 2, 3].flatMap(function(x) {
  return [[x * 2]];
})
// [[2], [4], [6]]
```

### 8.10 数组的空位

```javascript
// 数组的空位指数组的某一个位置没有任何值
// 注意，空位不是 undefined，一个位置的值等于 undefined，依然是有值的
Array(3) // [, , ,]

// ES5 对空位的处理很不一致
// forEach(), filter(), reduce(), every() 和 some() 都会跳过空位
// map() 会跳过空位，但会保留这个值
// join() 和 toString() 会将空位视为 undefined

// ES6 明确将空位转为 undefined
Array.from(['a',,'b'])
// [ "a", undefined, "b" ]

[...['a',,'b']]
// [ "a", undefined, "b" ]

[,'a','b',,].copyWithin(2,0) // [,"a",,"a"]

new Array(3).fill('a') // ["a","a","a"]

for (let i of [,,]) {
  console.log(1);
}
// 1
// 1
```

---

## 9. 对象的扩展

### 9.1 属性的简洁表示法

```javascript
// ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};

// 方法的简洁表示法
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

// 实际应用
let birth = '2000/01/01';

const Person = {
  name: '张三',
  birth,    // 等同于 birth: birth
  hello() { // 等同于 hello: function () ...
    console.log(`我的名字是 ${this.name}`);
  }
};
```

### 9.2 属性名表达式

```javascript
// ES6 允许字面量定义对象时，用表达式作为对象的属性名
let lastWord = 'last word';
const a = {
  'first word': 'hello',
  [lastWord]: 'world'
};

a['first word'] // "hello"
a[lastWord] // "world"
a['last word'] // "world"

// 表达式还可以用于定义方法名
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};

obj.hello() // hi

// 注意：属性名表达式与简洁表示法不能同时使用
// const foo = 'bar';
// const bar = 'abc';
// const baz = { [foo] }; // 报错

// 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串 [object Object]
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // {[object Object]: "valueB"}
```

### 9.3 super 关键字

```javascript
// ES6 新增了 super 关键字，指向当前对象的原型对象
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"

// 注意：super 关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错
// JavaScript 引擎内部，super.foo 等同于 Object.getPrototypeOf(this).foo（属性）或 Object.getPrototypeOf(this).foo.call(this)（方法）
```

### 9.4 Object.is()

```javascript
// Object.is() 比较两个值是否严格相等
// 与严格比较运算符（===）的行为基本一致
Object.is('foo', 'foo') // true
Object.is({}, {}) // false

// 不同之处：+0 不等于 -0，NaN 等于自身
+0 === -0 // true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true

// ES5 可以通过以下代码部署 Object.is
Object.defineProperty(Object, 'is', {
  value: function(x, y) {
    if (x === y) {
      // 针对 +0 不等于 -0 的情况
      return x !== 0 || 1 / x === 1 / y;
    }
    // 针对 NaN 等于 NaN 的情况
    return x !== x && y !== y;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
```

### 9.5 Object.assign()

#### 基本用法

```javascript
// Object.assign() 用于对象的合并，将源对象（source）的所有可枚举属性复制到目标对象（target）
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}

// 如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性
const target = { a: 1, b: 1 };
const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}

// 如果只有一个参数，Object.assign() 会直接返回该参数
const obj = {a: 1};
Object.assign(obj) === obj // true

// 如果该参数不是对象，则会先转成对象，然后返回
typeof Object.assign(2) // "object"

// 由于 undefined 和 null 无法转成对象，所以如果它们作为参数，就会报错
Object.assign(undefined) // TypeError: Cannot convert undefined or null to object
Object.assign(null) // TypeError: Cannot convert undefined or null to object

// 如果非对象参数出现在源对象的位置，则会先转成对象，如果无法转成对象，就会跳过
let obj = {a: 1};
Object.assign(obj, undefined) === obj // true
Object.assign(obj, null) === obj // true

// 其他类型的值（即数值、字符串和布尔值）不在首参数也不会报错
// 但是字符串会以数组形式拷贝入目标对象
const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

#### 注意点

```javascript
// 1. 浅拷贝
const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // 2

// 2. 同名属性的替换
const target = { a: { b: 'c', d: 'e' } };
const source = { a: { b: 'hello' } };
Object.assign(target, source);
// { a: { b: 'hello' } }

// 3. 数组的处理
Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]

// 4. 取值函数的处理
const source = {
  get foo() { return 1 }
};
const target = {};

Object.assign(target, source)
// { foo: 1 }
```

#### 常见用途

```javascript
// 1. 为对象添加属性
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

// 2. 为对象添加方法
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

// 3. 克隆对象
function clone(origin) {
  return Object.assign({}, origin);
}

// 克隆同时保持原型链
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

// 4. 合并多个对象
const merge = (target, ...sources) => Object.assign(target, ...sources);

// 合并后返回新对象
const merge = (...sources) => Object.assign({}, ...sources);

// 5. 为属性指定默认值
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  let options = Object.assign({}, DEFAULTS, options);
  console.log(options);
}
```

### 9.6 Object.getOwnPropertyDescriptors()

```javascript
// Object.getOwnPropertyDescriptors() 返回指定对象所有自身属性（非继承属性）的描述对象
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// {
//   foo: {
//     value: 123,
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   bar: {
//     get: [Function: get bar],
//     set: undefined,
//     enumerable: true,
//     configurable: true
//   }
// }

// 该方法的引入主要是为了解决 Object.assign() 无法正确拷贝 get 属性和 set 属性的问题
const source = {
  set foo(value) {
    console.log(value);
  }
};

let target = {};
Object.assign(target, source);
Object.getOwnPropertyDescriptor(target, 'foo')
// {
//   value: undefined,
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// 使用 Object.getOwnPropertyDescriptors() 配合 Object.defineProperties() 实现正确拷贝
const shallowMerge = (target, source) => Object.defineProperties(
  target,
  Object.getOwnPropertyDescriptors(source)
);

// 实现继承
const shallowCopy = (obj) => Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
```

### 9.7 Object.keys()，Object.values()，Object.entries()

```javascript
// Object.keys() 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名
const obj = { foo: 'bar', baz: 42 };
Object.keys(obj)
// ["foo", "baz"]

// Object.values() 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值
const obj = { foo: 'bar', baz: 42 };
Object.values(obj)
// ["bar", 42]

// Object.entries() 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]

// Object.entries() 的用途：遍历对象属性
let obj = { one: 1, two: 2 };
for (let [k, v] of Object.entries(obj)) {
  console.log(
    `${JSON.stringify(k)}: ${JSON.stringify(v)}`
  );
}
// "one": 1
// "two": 2

// Object.entries() 转为 Map 结构
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
map // Map { foo: "bar", baz: 42 }
```

### 9.8 Object.fromEntries()

```javascript
// Object.fromEntries() 是 Object.entries() 的逆操作，用于将一个键值对数组转为对象
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }

// 将 Map 结构转为对象
const map = new Map([ ['foo', 'bar'], ['baz', 42] ]);
const obj = Object.fromEntries(map);
obj // { foo: "bar", baz: 42 }

// 将数组的 reduce 方法返回的键值对数组转为对象
const obj = Object.fromEntries(
  Object.entries({ a: 1, b: 2 }).map(([key, value]) => [key, value * 2])
);
obj // { a: 2, b: 4 }
```

---

## 10. Symbol

### 10.1 概述

```javascript
// ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值
// 它是 JavaScript 语言的第七种数据类型
// 前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）

let s = Symbol();

typeof s
// "symbol"

// Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"

// Symbol 参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数返回值是不相等的
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false

// Symbol 值不能与其他类型的值进行运算
let sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string

// Symbol 值可以显式转为字符串
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

// Symbol 值也可以转为布尔值，但是不能转为数值
let sym = Symbol();
Boolean(sym) // true
!sym  // false

if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```

### 10.2 作为属性名的 Symbol

```javascript
// Symbol 值可以作为标识符，用于对象的属性名，保证不会出现同名的属性
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"

// 注意：Symbol 值作为对象属性名时，不能用点运算符
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"

// 在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中
let s = Symbol();

let obj = {
  [s]: function(arg) {
    // ...
  }
};

obj[s](123);

// Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的
const log = {};

log.levels = {
  DEBUG: Symbol('debug'),
  INFO: Symbol('info'),
  WARN: Symbol('warn')
};
console.log(log.levels.DEBUG, 'debug message');
console.log(log.levels.INFO, 'info message');
```

### 10.3 消除魔术字符串

```javascript
// 魔术字符串指的是在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或数值
function getArea(shape, options) {
  let area = 0;

  switch (shape) {
    case 'Triangle': // 魔术字符串
      area = .5 * options.width * options.height;
      break;
    /* ... more ... */
  }

  return area;
}

getArea('Triangle', { width: 100, height: 100 }); // 魔术字符串 'Triangle'

// 改进：把魔术字符串写成变量
const shapeType = {
  triangle: Symbol()
};

function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
```

### 10.4 属性名的遍历

```javascript
// Symbol 作为属性名，遍历对象的时候，该属性不会出现在 for...in、for...of 循环中
// 也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回

const obj = {};
let foo = Symbol("foo");

Object.defineProperty(obj, foo, {
  value: "foobar",
});

for (let i in obj) {
  console.log(i); // 无输出
}

Object.getOwnPropertyNames(obj) // []
Object.keys(obj) // []
JSON.stringify(obj) // "{}"

// 但是它也不是私有属性，有一个 Object.getOwnPropertySymbols() 方法可以获取指定对象的所有 Symbol 属性名
Object.getOwnPropertySymbols(obj) // [Symbol(foo)]

// 另一个新的 API：Reflect.ownKeys() 方法可以返回所有类型的键名
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```

### 10.5 Symbol.for()，Symbol.keyFor()

```javascript
// Symbol.for() 接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值
// 如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true

// Symbol() 和 Symbol.for() 的区别：
// Symbol() 不会登记到全局，每次调用都会返回一个新的 Symbol 值
// Symbol.for() 会登记到全局，每次调用会返回同一个 Symbol 值

// Symbol.keyFor() 返回一个已登记的 Symbol 类型值的 key
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined

// Symbol.for() 为 Symbol 值登记的名字是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值
```

### 10.6 内置的 Symbol 值

```javascript
// 1. Symbol.hasInstance
// 对象的 Symbol.hasInstance 属性指向一个内部方法，当其他对象使用 instanceof 运算符判断是否为该对象的实例时，会调用这个方法
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}
[1, 2, 3] instanceof new MyClass() // true

// 2. Symbol.isConcatSpreadable
// 对象的 Symbol.isConcatSpreadable 属性等于一个布尔值，表示该对象用于 Array.prototype.concat() 时是否可以展开
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']

// 3. Symbol.species
// 对象的 Symbol.species 属性指向当前对象的构造函数
// 创造实例时，默认会调用这个构造函数
// 使用这个属性可以定义返回派生对象时使用的构造函数

// 4. Symbol.match
// 对象的 Symbol.match 属性指向一个函数，当执行 str.match(myObject) 时，如果该属性存在，会调用它返回该方法的返回值

// 5. Symbol.replace
// 对象的 Symbol.replace 属性指向一个方法，当该对象被 String.prototype.replace 方法调用时，会返回该方法的返回值

// 6. Symbol.search
// 对象的 Symbol.search 属性指向一个方法，当该对象被 String.prototype.search 方法调用时，会返回该方法的返回值

// 7. Symbol.split
// 对象的 Symbol.split 属性指向一个方法，当该对象被 String.prototype.split 方法调用时，会返回该方法的返回值

// 8. Symbol.iterator
// 对象的 Symbol.iterator 属性指向该对象的默认遍历器方法

// 9. Symbol.toPrimitive
// 对象的 Symbol.toPrimitive 属性指向一个方法，该对象被转为原始类型的值时会调用这个方法

// 10. Symbol.toStringTag
// 对象的 Symbol.toStringTag 属性指向一个方法，在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中

// 11. Symbol.unscopables
// 对象的 Symbol.unscopables 属性指向一个对象，该对象指定了使用 with 关键字时哪些属性会被 with 环境排除
```

---

## 11. Set 和 Map 数据结构

### 11.1 Set

#### 基本用法

```javascript
// ES6 提供了新的数据结构 Set，它类似于数组，但是成员的值都是唯一的，没有重复的值
// Set 本身是一个构造函数，用来生成 Set 数据结构

const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4

// Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 去除数组重复成员的方法
[...new Set(array)]

// 去除字符串里面的重复字符
[...new Set('ababbc')].join('')
// "abc"

// 向 Set 加入值的时候，不会发生类型转换
// 所以 5 和 "5" 是两个不同的值
// Set 内部判断两个值是否不同使用的算法叫做"Same-value-zero equality"，它类似于精确相等运算符（===）
// 主要的区别是 NaN 等于自身，而精确相等运算符认为 NaN 不等于自身

let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

// 两个对象总是不相等
let set = new Set();
set.add({});
set.size // 1
set.add({});
set.size // 2
```

#### Set 实例的属性和方法

```javascript
// Set 结构的实例有以下属性：
// Set.prototype.constructor：构造函数，默认就是 Set 函数
// Set.prototype.size：返回 Set 实例的成员总数

// Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）

// 操作方法：
// add(value)：添加某个值，返回 Set 结构本身
// delete(value)：删除某个值，返回一个布尔值，表示删除是否成功
// has(value)：返回一个布尔值，表示该值是否为 Set 的成员
// clear()：清除所有成员，没有返回值

let s = new Set();

s.add(1).add(2).add(2);
s.size // 2
s.has(1) // true
s.has(2) // true
s.has(3) // false
s.delete(2);
s.has(2) // false

// Array.from 方法可以将 Set 结构转为数组
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);

// 去除数组重复成员的另一种写法
function dedupe(array) {
  return Array.from(new Set(array));
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]
```

#### 遍历操作

```javascript
// Set 结构的实例有四个遍历方法，可以用于遍历成员：
// keys()：返回键名的遍历器
// values()：返回键值的遍历器
// entries()：返回键值对的遍历器
// forEach()：使用回调函数遍历每个成员

let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

// Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 values 方法
Set.prototype[Symbol.iterator] === Set.prototype.values
// true

for (let x of set) {
  console.log(x);
}
// red
// green
// blue

// forEach()
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9

// 遍历的应用
// 扩展运算符（...）内部使用 for...of 循环，所以也可以用于 Set 结构
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']

// 数组的 map 和 filter 方法也可以间接用于 Set
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}

// 使用 Set 可以很容易地实现并集（Union）、交集（Intersection）和差集（Difference）
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

### 11.2 WeakSet

```javascript
// WeakSet 结构与 Set 类似，也是不重复的值的集合
// 但是，它与 Set 有两个区别：
// 1. WeakSet 的成员只能是对象，而不能是其他类型的值
// 2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

// WeakSet 结构有以下三个方法：
// WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员
// WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员
// WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中

const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window); // false

// WeakSet 没有 size 属性，没有办法遍历它的成员
// 因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在

// WeakSet 的一个用处是储存 DOM 节点，而不用担心这些节点从文档移除时会引发内存泄漏
const foos = new WeakSet();
class Foo {
  constructor() {
    foos.add(this);
  }
  method() {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在 Foo 的实例上调用！');
    }
  }
}
```

### 11.3 Map

#### 含义和基本用法

```javascript
// JavaScript 的对象（Object）本质上是键值对的集合（Hash 结构）
// 但是传统上只能用字符串当作键，这给它的使用带来了很大的限制

const data = {};
const element = document.getElementById('myDiv');

data[element] = 'metadata';
data['[object HTMLDivElement]'] // "metadata"

// 上面代码原意是将一个 DOM 节点作为对象 data 的键
// 但是由于对象只接受字符串作为键名，所以 element 被自动转为字符串 [object HTMLDivElement]

// ES6 提供了 Map 数据结构，它类似于对象，也是键值对的集合
// 但是"键"的范围不限于字符串，各种类型的值（包括对象）都可以当作键

const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

// Map 的键实际上是跟内存地址绑定的
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined

// 上面代码的 set 和 get 方法表面是针对同一个键
// 但实际上这是两个不同的数组实例，内存地址是不一样的，因此 get 方法无法读取该键

const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222

// 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键
// 包括 0 和 -0，虽然 NaN 不严格等于自身，但 Map 将其视为同一个键

let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 4);
map.set(null, 5);
map.get(undefined) // 4

map.set(NaN, 6);
map.get(NaN) // 6

// Map 的构造函数接受数组作为参数
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"

// 实际上执行的是下面的算法
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
);
```

#### 实例的属性和操作方法

```javascript
// size 属性返回 Map 结构的成员总数
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2

// set(key, value) 方法设置键名 key 对应的键值为 value，然后返回整个 Map 结构
// 如果 key 已经有值，则键值会被更新，否则就新生成该键
let map = new Map()
.set(1, 'a')
.set(2, 'b')
.set(2, 'c');

map // Map(2) {1 => "a", 2 => "c"}

// get(key) 方法读取 key 对应的键值，如果找不到 key，返回 undefined
let map = new Map();

let hello = function() {console.log('hello');};
map.set(hello, 'Hello ES6');
map.get(hello)  // Hello ES6

// has(key) 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中
let map = new Map();

map.set('edition', 6);
map.has('edition') // true
map.has('years') // false

// delete(key) 方法删除某个键，返回 true。如果删除失败，返回 false
let map = new Map();
map.set('edition', 6);
map.has('edition') // true
map.delete('edition') // true
map.has('edition') // false

// clear() 方法清除所有成员，没有返回值
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0
```

#### 遍历方法

```javascript
// Map 结构原生提供三个遍历器生成函数和一个遍历方法
// keys()：返回键名的遍历器
// values()：返回键值的遍历器
// entries()：返回所有成员的遍历器
// forEach()：遍历 Map 的所有成员

const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用 map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// Map 结构的默认遍历器接口（Symbol.iterator 属性）就是 entries 方法
map[Symbol.iterator] === map.entries
// true

// Map 结构转为数组结构比较快速的方法是使用扩展运算符（...）
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1, 'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1, 'one'], [2, 'two'], [3, 'three']]

// 结合数组的 map 方法和 filter 方法，可以实现 Map 的遍历和过滤
let map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

let map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

let map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
);
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

#### 与其他数据结构的互相转换

```javascript
// 1. Map 转为数组
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]

// 2. 数组转为 Map
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map(2) {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }

// 3. Map 转为对象
// 如果所有 Map 的键都是字符串，它可以无损地转为对象
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }

// 4. 对象转为 Map
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}

// 5. Map 转为 JSON
// Map 转为 JSON 要区分两种情况：
// 一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'

// 另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'

// 6. JSON 转为 Map
// JSON 转为 Map，正常情况下所有键名都是字符串
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}

// 但是有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身又是一个有两个成员的数组
// 这时它可以一一对应地转为 Map，这往往是 Map 转为数组 JSON 的逆操作
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

### 11.4 WeakMap

```javascript
// WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合
// WeakMap 与 Map 的区别有两点：
// 1. WeakMap 只接受对象作为键名（null 除外），不接受其他类型的值作为键名
// 2. WeakMap 的键名所指向的对象不计入垃圾回收机制

const wm = new WeakMap();
const key = {};
const foo = {};

wm.set(key, "value");
wm.get(key) // "value"

wm.has(key) // true
wm.delete(key) // true
wm.has(key) // false

// WeakMap 与 Map 在 API 上的区别主要是两个：
// 一是没有遍历操作（即没有 keys()、values() 和 entries() 方法），也没有 size 属性
// 因为没有办法列出所有键名，这个键名是否存在完全不可预测
// 二是无法清空，即不支持 clear 方法

// WeakMap 只有四个方法可用：get()、set()、has()、delete()

// WeakMap 的典型用途是用于私有属性的存储
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));
c.dec()
c.dec()
// DONE
```

---

## 总结

本教程详细介绍了 ES6 的基础特性：

1. **let/const**：块级作用域、暂时性死区
2. **解构赋值**：数组、对象、函数参数的解构
3. **字符串扩展**：模板字符串、新增方法
4. **正则扩展**：u 修饰符、y 修饰符、具名组匹配
5. **数值扩展**：二进制/八进制表示法、Math 方法、BigInt
6. **函数扩展**：默认参数、rest 参数、箭头函数、尾调用优化
7. **数组扩展**：扩展运算符、Array.from、find、includes、flat
8. **对象扩展**：属性简洁表示、Object.assign、Object.keys/values/entries
9. **Symbol**：新的原始类型、作为属性名、内置 Symbol 值
10. **Set/Map**：新的数据结构、WeakSet/WeakMap

ES6 是 JavaScript 发展的重要里程碑，掌握这些基础特性对于现代 JavaScript 开发至关重要。

进阶内容请参阅：[ES6 高级教程](./ES6高级教程.md)

---

**参考资源**：
- [ECMAScript 6 入门教程 - 阮一峰](https://es6.ruanyifeng.com/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
