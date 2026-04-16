---
title: CSS 完全教程
tags:
  - 前端
  - CSS
  - 基础
  - 教程
  - 样式表
created: 2026-04-16
---

# CSS 完全教程

## 目录

1. [CSS 简介](#css-简介)
2. [CSS 基础语法](#css-基础语法)
3. [选择器](#选择器)
4. [盒模型](#盒模型)
5. [文本与字体](#文本与字体)
6. [背景与边框](#背景与边框)
7. [布局基础](#布局基础)
8. [定位](#定位)
9. [浮动](#浮动)
10. [Flexbox 弹性布局](#flexbox-弹性布局)
11. [过渡与动画](#过渡与动画)
12. [CSS 变量](#css-变量)
14. [响应式设计基础](#响应式设计基础)
15. [CSS 最佳实践](#css-最佳实践)

---

## CSS 简介

### 什么是 CSS

**CSS**（Cascading Style Sheets，层叠样式表）是一种用于描述 HTML 文档表现形式的样式语言。它控制网页的视觉效果，包括：

- **布局**：元素的位置和排列方式
- **颜色**：文字、背景、边框的颜色
- **字体**：文字的大小、样式、字体系列
- **间距**：内边距、外边距、行高
- **装饰**：阴影、圆角、渐变等

### CSS 的作用

```
HTML = 结构（骨架）
CSS   = 表现（皮肤）
JavaScript = 行为（肌肉）
```

| HTML | CSS | JavaScript |
|------|-----|------------|
| 定义内容 | 控制外观 | 添加交互 |
| `<h1>标题</h1>` | `color: blue;` | `onclick` |
| 结构 | 样式 | 行为 |

### CSS 发展历程

| 版本 | 年份 | 主要特性 |
|------|------|---------|
| CSS 1 | 1996 | 字体、颜色、基本属性 |
| CSS 2 | 1998 | 定位、浮动、媒体查询 |
| CSS 2.1 | 2011 | 修正和完善 |
| CSS 3 | 2011-至今 | 动画、弹性布局、网格 |

### 引入 CSS 的方式

#### 1. 内联样式

```html
<div style="color: red; font-size: 16px;">
    内联样式
</div>
```

**缺点**：
- 难以维护
- 无法复用
- 权重最高（难以覆盖）

**适用场景**：动态样式、快速测试

#### 2. 内部样式

```html
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        
        h1 {
            color: #333;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
```

**适用场景**：单页面应用、原型开发

#### 3. 外部样式（推荐）

```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

**styles.css**:
```css
/* 主样式文件 */
body {
    margin: 0;
    padding: 0;
}

h1 {
    color: #333;
}
```

#### 4. 导入样式

```css
@import url('reset.css');
@import url('base.css');
@import url('layout.css');
```

### 引入方式对比

| 方式 | 优先级 | 可维护性 | 复用性 | 适用场景 |
|------|--------|---------|--------|---------|
| 内联样式 | 最高 | 差 | 无 | 动态样式 |
| 内部样式 | 中 | 一般 | 单页 | 原型开发 |
| 外部样式 | 低 | 好 | 多页 | 生产环境 |
| @import | 低 | 好 | 模块化 | 组织代码 |

---

## CSS 基础语法

### 规则结构

```css
选择器 {
    属性名: 属性值;      /* 注释 */
    属性名: 属性值;
}
```

**示例**：

```css
h1 {
    color: #333333;          /* 文字颜色 */
    font-size: 24px;         /* 字体大小 */
    font-weight: bold;       /* 字重 */
    text-align: center;      /* 文本对齐 */
}
```

### 选择器

选择器用于指定要设置样式的 HTML 元素。

#### 元素选择器

```css
p {
    color: #333;
    line-height: 1.5;
}

div {
    background-color: #f5f5f5;
}
```

#### 类选择器（最常用）

```css
/* 定义类 */
.container {
    max-width: 1200px;
    margin: 0 auto;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 4px;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}
```

```html
<!-- 使用类 -->
<div class="container">
    <button class="btn btn-primary">主要按钮</button>
    <button class="btn btn-danger">危险按钮</button>
</div>
```

#### ID 选择器

```css
/* 定义 ID（每个页面只能使用一次）*/
#header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
}

#main-content {
    padding-top: 80px;
}
```

```html
<header id="header">头部</header>
<main id="main-content">主要内容</main>
```

#### 通用选择器

```css
/* 匹配所有元素 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* 匹配某个元素下的所有子元素 */
.container * {
    border: 1px solid #ddd;
}
```

### 组合选择器

#### 后代选择器（空格）

```css
/* div 下所有的 span 都会匹配 */
div span {
    color: red;
}
```

```html
<div>
    <span>匹配</span>
    <p><span>也匹配</span></p>
</div>
```

#### 子选择器（>）

```css
/* 只匹配直接子元素的 span */
div > span {
    color: red;
}
```

```html
<div>
    <span>匹配</span>
    <p><span>不匹配（不是直接子元素）</span></p>
</div>
```

#### 相邻兄弟选择器（+）

```css
/* 紧跟在 h2 后面的 p 元素 */
h2 + p {
    margin-top: 0;
    color: #666;
}
```

#### 通用兄弟选择器（~）

```css
/* h2 之后的所有兄弟 p 元素 */
h2 ~ p {
    margin-top: 10px;
}
```

### 属性选择器

```css
/* 存在属性 */
[title] {
    cursor: help;
}

/* 属性等于某值 */
[type="text"] {
    border: 1px solid #ccc;
}

/* 属性包含某词 */
[class~="active"] {
    background-color: yellow;
}

/* 属性以某值开头 */
[href^="https"]::after {
    content: "🔒";
}

/* 属性以某值结尾 */
[src$=".pdf"]::after {
    content: " (PDF)";
}

/* 属性包含某字符串 */
[class*="btn"] {
    cursor: pointer;
}
```

### 伪类选择器

#### 链接伪类

```css
a:link { color: blue; }       /* 未访问的链接 */
a:visited { color: purple; }  /* 已访问的链接 */
a:hover { color: red; }      /* 鼠标悬停 */
a:focus { outline: none; }   /* 获得焦点 */
a:active { color: orange; }  /* 被点击时 */
```

**注意顺序**：LVHA（Link → Visited → Hover → Active）

#### 用户界面伪类

```css
input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0,123,255,.25);
}

input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

input:checked + label {
    font-weight: bold;
}
```

#### 结构伪类

```css
/* 第一个子元素 */
li:first-child {
    border-top: none;
}

/* 最后一个子元素 */
li:last-child {
    border-bottom: none;
}

/* 第 n 个子元素（从 1 开始）*/
tr:nth-child(odd) {
    background-color: #f9f9f9;
}

tr:nth-child(2n) {
    background-color: #fff;
}

/* 唯一子元素 */
div:only-child {
    width: 100%;
}

/* 空元素 */
td:empty {
    background-color: #eee;
}
```

#### 否定伪类

```css
/* 不是 .special 类的所有段落 */
p:not(.special) {
    color: #333;
}

/* 除最后一个外的所有列表项 */
li:not(:last-child) {
    border-bottom: 1px solid #ddd;
}
```

### 伪元素选择器

```css
/* ::before 和 ::after 必须配合 content 使用 */
.quote::before {
    content: open-quote;
    font-size: 2em;
    color: #ccc;
}

.quote::after {
    content: close-quote;
    font-size: 2em;
    color: #ccc;
}

/* 首字母 */
p::first-letter {
    font-size: 3em;
    font-weight: bold;
    float: left;
    line-height: 1;
    margin-right: 8px;
}

/* 首行 */
p::first-line {
    font-weight: bold;
    color: #666;
}

/* 选中文字 */
::selection {
    background-color: #b3d4fc;
    color: #000;
}
```

### 选择器权重（优先级）

计算方式：`!important > 行内 > ID > 类/伪类/属性 > 元素 > 通配符`

| 选择器 | 权重值 | 示例 |
|--------|--------|------|
| !important | ∞ | `color: red !important` |
| 行内样式 | 1000 | `style=""` |
| ID 选择器 | 0100 | `#header` |
| 类/伪类/属性 | 0010 | `.class`, `:hover`, `[type]` |
| 元素选择器 | 0001 | `div`, `p` |
| 通配符 | 0000 | `*` |

**示例计算**：

```css
/* 0001 */
div { }

/* 0020 */
.nav .item { }

/* 0111 */
#main .nav li { }

/* 0211 */
#main #nav ul li { }

/* 1011（行内） */
style="..." #main .nav li { }

/* ∞ */
!important
```

---

## 盒模型

### 盒模型组成

每个元素都被看作一个矩形盒子，由四部分组成：

```
┌─────────────────────────────────┐
│           margin                │ ← 外边距
│   ┌──────────────────────────┐  │
│   │        border             │  │ ← 边框
│   │   ┌──────────────────┐    │  │
│   │   │     padding      │    │  │ ← 内边距
│   │   │   ┌────────────┐ │    │  │
│   │   │   │  content   │ │    │  │ ← 内容区
│   │   │   └────────────┘ │    │  │
│   │   └──────────────────┘    │  │
│   └──────────────────────────┘  │
└─────────────────────────────────┘
```

### 内容区（content）

```css
.box {
    width: 200px;
    height: 150px;
    
    /* 最小/最大尺寸 */
    min-width: 100px;
    min-height: 50px;
    max-width: 500px;
    max-height: 300px;
}
```

### 内边距（padding）

```css
.box {
    /* 四个方向相同 */
    padding: 20px;
    
    /* 上下 / 左右 */
    padding: 10px 20px;
    
    /* 上 / 左右 / 下 */
    padding: 10px 20px 30px;
    
    /* 上 / 右 / 下 / 左（顺时针）*/
    padding: 10px 15px 20px 25px;
    
    /* 单独设置 */
    padding-top: 10px;
    padding-right: 15px;
    padding-bottom: 20px;
    padding-left: 25px;
}
```

### 边框（border）

```css
.box {
    /* 简写：宽度 样式 颜色 */
    border: 1px solid #ddd;
    
    /* 各边单独设置 */
    border-top: 2px solid #333;
    border-right: 1px dashed #999;
    border-bottom: 1px dotted #ccc;
    border-left: none;
    
    /* 圆角 */
    border-radius: 4px;              /* 四角相同 */
    border-radius: 10px 5px;         /* 左上右下 / 右上左下 */
    border-radius: 10px 5px 3px 2px; /* 四个角分别设置 */
    
    /* 完全圆形 */
    border-radius: 50%;
}
```

**border-style 取值**：

| 值 | 说明 |
|-----|------|
| `none` | 无边框 |
| `solid` | 实线 |
| `dashed` | 虚线 |
| `dotted` | 点线 |
| `double` | 双线 |
| `groove` | 凹槽 |
| `ridge` | 凸起 |
| `inset` | 内嵌 |
| `outset` | 外凸 |

### 外边距（margin）

```css
.box {
    /* 四个方向相同 */
    margin: 20px;
    
    /* 上下 / 左右 */
    margin: 10px auto;  /* 水平居中 */
    
    /* 上 / 左右 / 下 */
    margin: 10px 20px 30px;
    
    /* 四个方向分别设置 */
    margin: 10px 15px 20px 25px;
    
    /* 单独设置 */
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
}
```

**margin 特殊行为**：

```css
/* 外边距合并（折叠）：相邻块级元素的上下 margin 会合并为较大值 */
p {
    margin-top: 20px;
    margin-bottom: 30px;  /* 实际显示 30px，不是 50px */
}

/* margin 为负值：可以重叠元素 */
.box-negative {
    margin-right: -10px;
}
```

### box-sizing 属性

```css
/* 默认值：width 只包含内容 */
/* 总宽度 = width + padding + border */

/* 推荐：width 包含内容和 padding、border */
*,
*::before,
*::after {
    box-sizing: border-box;
}
```

**对比示例**：

```css
/* content-box（默认）*/
.box1 {
    width: 200px;
    padding: 20px;
    border: 10px solid;
    /* 实际占用：200 + 40 + 20 = 260px */
}

/* border-box（推荐）*/
.box2 {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 10px solid;
    /* 实际占用：200px（内容区域缩小）*/
}
```

### display 属性

```css
.block {
    display: block;        /* 块级：独占一行 */
}

.inline {
    display: inline;       /* 内联：与其他元素同行 */
}

.inline-block {
    display: inline-block; /* 内联块：同行但可设宽高 */
}

.flex {
    display: flex;         /* 弹性容器 */
}

.grid {
    display: grid;         /* 网格容器 */
}

.none {
    display: none;         /* 不显示且不占空间 */
}
```

**各 display 对比**：

| 类型 | 示例 | 宽高 | 独占行 | 允许并排 |
|------|------|------|--------|---------|
| block | div, p | ✅ | ✅ | ❌ |
| inline | span, a | ❌ | ❌ | ✅ |
| inline-block | img, button | ✅ | ❌ | ✅ |
| flex | 自定义容器 | ✅ | ❌ | ✅ |
| grid | 自定义容器 | ✅ | ❌ | ✅ |

---

## 文本与字体

### 字体属性

```css
body {
    /* 字体系列 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                 'Helvetica Neue', Arial, sans-serif;
    
    /* 字号 */
    font-size: 16px;        /* 绝对单位 */
    font-size: 1rem;        /* 相对单位（根元素字号）*/
    font-size: 1.5em;       /* 相对父元素 */
    font-size: clamp(14px, 1vw + 10px, 18px); /* 响应式字号 */
    
    /* 字重 */
    font-weight: normal;    /* 400 */
    font-weight: bold;      /* 700 */
    font-weight: 600;       /* 数字 100-900 */
    
    /* 字体风格 */
    font-style: normal;
    font-style: italic;
    font-style: oblique;
    
    /* 字体变形（大写/小写）*/
    text-transform: none;
    text-transform: uppercase;
    text-transform: lowercase;
    text-transform: capitalize;
    
    /* 字符间距 */
    letter-spacing: 0.05em;
    
    /* 单词间距 */
    word-spacing: normal;
    
    /* 简写 */
    font: italic bold 16px/1.5 Arial, sans-serif;
}
```

### 文本颜色

```css
.text {
    /* 颜色名称 */
    color: red;
    
    /* 十六进制 */
    color: #ff0000;
    color: #f00;            /* 缩写 */
    
    /* RGB */
    color: rgb(255, 0, 0);
    color: rgb(255 0 0);    /* 空格分隔 */
    
    /* RGBA（带透明度）*/
    color: rgba(255, 0, 0, 0.8);
    color: rgb(255 0 0 / 80%); /* 新语法 */
    
    /* HSL */
    color: hsl(0, 100%, 50%);
    
    /* HSLA */
    color: hsla(0, 100%, 50%, 0.8);
    
    /* 关键字 */
    color: currentColor;    /* 当前颜色 */
    color: transparent;     /* 透明 */
    color: inherit;         /* 继承 */
}
```

### 文本对齐

```css
.text-align {
    /* 水平对齐 */
    text-align: left;       /* 默认 */
    text-align: center;
    text-align: right;
    text-align: justify;    /* 两端对齐 */
    
    /* 垂直对齐（仅限行内或表格单元格）*/
    vertical-align: baseline;  /* 默认 */
    vertical-align: top;
    vertical-align: middle;
    vertical-align: bottom;
    vertical-align: sub;      /* 下标 */
    vertical-align: super;    /* 上标 */
}
```

### 行高与垂直居中

```css
.text-line-height {
    /* 行高（无单位的数字表示倍数）*/
    line-height: 1.5;         /* 推荐 */
    line-height: 24px;
    
    /* 单行文本垂直居中 */
    height: 60px;
    line-height: 60px;        /* 等于容器高度 */
}
```

### 文本修饰

```css
.text-decoration {
    /* 下划线 */
    text-decoration: underline;
    
    /* 删除线 */
    text-decoration: line-through;
    
    /* 上划线 */
    text-decoration: overline;
    
    /* 无装饰 */
    text-decoration: none;
    
    /* 详细设置 */
    text-decoration: underline wavy red;
    text-decoration-thickness: 2px;
    text-decoration-offset: 4px;
}
```

### 文本溢出处理

```css
.text-overflow {
    /* 单行省略 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;  /* ... */
    text-overflow: clip;      /* 直接裁剪 */
    
    /* 多行省略（需要 WebKit 内核）*/
    display: -webkit-box;
    -webkit-line-clamp: 2;    /* 显示 2 行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

### 文本缩进与空格

```css
.text-spacing {
    /* 首行缩进 */
    text-indent: 2em;
    
    /* 空白处理 */
    white-space: normal;      /* 合并空白 */
    white-space: nowrap;      /* 不换行 */
    white-space: pre;         /* 保留格式 */
    white-space: pre-wrap;    /* 保留格式但允许换行 */
    white-space: break-spaces;/* 断开空格换行 */
    
    /* 换行规则 */
    word-break: normal;
    word-break: break-all;    /* 强制断行 */
    word-break: keep-all;     /* 不断开单词 */
    word-wrap: normal;
    word-wrap: break-word;    /* 长单词换行 */
    
    /* 连字符 */
    hyphens: auto;            /* 自动添加连字符 */
}
```

### 文字阴影

```css
.text-shadow {
    /* x偏移 y偏移 模糊半径 颜色 */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    
    /* 多重阴影 */
    text-shadow: 
        0 0 10px #fff,
        0 0 20px #fff,
        0 0 30px #00eaff,
        0 0 40px #00eaff,
        0 0 55px #00eaff,
        0 0 75px #00eaff;
}
```

---

## 背景与边框

### 背景颜色

```css
.bg-color {
    background-color: #f5f5f5;
    background-color: rgb(245, 245, 245);
    background-color: transparent;
}
```

### 背景图片

```css
.bg-image {
    /* 基本设置 */
    background-image: url('image.jpg');
    
    /* 平铺方式 */
    background-repeat: repeat;     /* 平铺（默认）*/
    background-repeat: no-repeat;  /* 不平铺 */
    background-repeat: repeat-x;   /* 水平平铺 */
    background-repeat: repeat-y;   /* 垂直平铺 */
    background-repeat: round;      /* 等比例缩放后重复 */
    background-repeat: space;      /* 等间距分布 */
    
    /* 位置 */
    background-position: center center;
    background-position: top right;
    background-position: 50% 50%;
    background-position: 10px 20px;
    
    /* 大小 */
    background-size: cover;       /* 完全覆盖容器 */
    background-size: contain;     /* 完整显示在容器内 */
    background-size: 100% 100%;   /* 拉伸填满 */
    background-size: 50% auto;
    
    /* 附着方式 */
    background-attachment: scroll;  /* 跟随滚动（默认）*/
    background-attachment: fixed;   /* 固定不滚动 */
    background-attachment: local;   /* 跟随元素滚动 */
    
    /* 原点位置 */
    background-origin: padding-box; /* 从 padding 开始（默认）*/
    background-origin: border-box;  /* 从 border 开始 */
    background-origin: content-box; /* 从 content 开始 */
    
    /* 裁剪区域 */
    background-clip: border-box;
    background-clip: padding-box;
    background-clip: content-box;
    background-clip: text;          /* 文字填充图片 */
}
```

### 背景简写

```css
.background-shorthand {
    /* 顺序：颜色 图片 位置/大小 平铺 附着 */
    background: #f5f5f5 url('bg.jpg') no-repeat center center/cover fixed;
    
    /* 多背景图 */
    background:
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url('image.jpg') center/cover no-repeat;
}
```

### 边框详解

```css
.border-detail {
    /* 边框宽度 */
    border-width: thin;    /* 1px */
    border-width: medium;  /* 3px */
    border-width: thick;   /* 5px */
    border-width: 2px;
    
    /* 边框颜色 */
    border-color: currentColor;
    border-color: transparent;
    
    /* 各边独立设置 */
    border-top-width: 2px;
    border-right-color: red;
    border-bottom-style: dashed;
    
    /* 轮廓（不影响布局）*/
    outline: 2px solid blue;
    outline-offset: 5px;
}
```

### 圆角进阶

```css
.border-radius {
    /* 基础圆角 */
    border-radius: 10px;
    
    /* 椭圆圆角 */
    border-radius: 50% / 25%;  /* 水平/垂直 */
    
    /* 药丸形状 */
    border-radius: 9999px;     /* 或足够大的数值 */
    
    /* 特殊形状（斜杠语法）*/
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
}
```

### 阴影效果

```css
.shadows {
    /* 盒子阴影：x y blur spread color */
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    
    /* 内阴影 */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    
    /* 多重阴影 */
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
    
    /* 卡片悬浮效果 */
    transition: box-shadow 0.3s ease;
}
.card:hover {
    box-shadow: 
        0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22);
}
```

---

## 布局基础

### 正常流（Normal Flow）

HTML 元素默认按照正常流排列：

- **块级元素**从上到下堆叠
- **内联元素**从左到右排列

```html
<body>
    <h1>标题</h1>
    <p>段落一</p>
    <p>段落二</p>
</body>
```

### display 与文档流

```css
/* 移出文档流 */
.hidden {
    display: none;      /* 完全隐藏，不占空间 */
}

.absolute {
    position: absolute;  /* 绝对定位脱离文档流 */
}

.floated {
    float: left;        /* 浮动脱离文档流 */
}
```

### overflow 属性

```css
.overflow-demo {
    overflow: visible;   /* 可见（默认）*/
    overflow: hidden;    /* 隐藏超出部分 */
    overflow: scroll;    /* 始终显示滚动条 */
    overflow: auto;      /* 需要时显示滚动条 */
    overflow-x: scroll;  /* 仅水平 */
    overflow-y: auto;    /* 仅垂直 */
}
```

### visibility 与 opacity

```css
.visibility-demo {
    visibility: visible;  /* 可见（默认）*/
    visibility: hidden;   /* 隐藏但占据空间 */
    visibility: collapse; /* 表格元素使用 */
    
    opacity: 1;          /* 完全不透明 */
    opacity: 0.5;        /* 半透明 */
    opacity: 0;          /* 完全透明（仍可点击）*/
}

/* 区别：display:none vs visibility:hidden vs opacity:0 */
/*
display:none:    不渲染，不占空间，不可交互
visibility:hidden: 渲染但不显示，占空间，不可交互
opacity:0:       渲染但不可见，占空间，可交互
*/
```

### z-index 层叠

```css
.z-index-demo {
    position: relative;
    z-index: 1;
    
    /* 只有定位元素才生效 */
    /* 值越大越在上层 */
    /* 负值会在背景之下 */
}

/* 创建层叠上下文 */
.stacking-context {
    position: relative;
    z-index: 1;
    /* 或 */
    opacity: 0.99;
    /* 或 */
    transform: translateZ(0);
}
```

---

## 定位

### position 属性

```css
/* static（默认）- 正常文档流 */
.static {
    position: static;
    top/left/right/bottom: 无效;
}

/* relative - 相对于自身位置偏移 */
.relative {
    position: relative;
    top: 10px;      /* 向下移动 10px */
    left: 20px;     /* 向右移动 20px */
    /* 原来的位置仍被保留 */
}

/* absolute - 相对于最近的定位祖先 */
.absolute {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* 脱离文档流 */
}

/* fixed - 相对于视口固定 */
.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.fixed-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}

/* sticky - 粘性定位 */
.sticky-nav {
    position: sticky;
    top: 0;
    /* 滚动到顶部时固定 */
}

.sticky-sidebar {
    position: sticky;
    top: 20px;
    /* 在视口内粘性定位 */
}
```

### 定位实战示例

```css
/* 居中定位 */
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* 固定导航栏 */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
}

/* 给固定导航留出空间 */
.main-content {
    padding-top: 64px;
}

/* 回到顶部按钮 */
.back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: #333;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999;
}
```

### clip-path 裁剪

```css
.clip-path {
    /* 圆形裁剪 */
    clip-path: circle(50% at center);
    
    /* 多边形 */
    clip-path: polygon(
        0% 0%, 
        100% 0%, 
        100% 75%, 
        75% 100%, 
        0% 100%
    );
    
    /* 椭圆 */
    clip-path: ellipse(50px 75px at 50px 70px);
    
    /* inset 内嵌 */
    clip-path: inset(10px 20px 30px 40px round 5px);
}
```

---

## 浮动

### 浮动原理

```css
.float-basic {
    float: none;   /* 不浮动（默认）*/
    float: left;   /* 向左浮动 */
    float: right;  /* 向右浮动 */
    
    /* 清除浮动 */
    clear: none;   /* 允许两侧浮动 */
    clear: left;   /* 左侧不允许浮动元素 */
    clear: right;  /* 右侧不允许浮动元素 */
    clear: both;   /* 两侧都不允许 */
}
```

### 浮动的影响

```html
<!-- 浮动导致父元素高度塌陷 -->
<div class="parent">
    <div class="float-left">左浮动元素</div>
    <div class="float-right">右浮动元素</div>
</div>

<style>
.parent {
    background: #f5f5f5;
    /* 高度塌陷问题！*/
}

.float-left {
    float: left;
    width: 45%;
}

.float-right {
    float: right;
    width: 45%;
}
</style>
```

### 清除浮动的方案

#### 方案一：额外空元素

```html
<div class="parent">
    <div class="float-left"></div>
    <div class="float-right"></div>
    <div style="clear: both;"></div>  <!-- 清除浮动 -->
</div>
```

#### 方案二：overflow（推荐简单场景）

```css
.parent {
    overflow: hidden;  /* 或 auto */
}
```

#### 方案三：clearfix（推荐通用方案）

```css
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

/* 或现代写法 */
.clearfix::after {
    content: "";
    display: flow-root;
}
```

### 浮动经典布局

```css
/* 两栏布局 */
.two-columns {
    overflow: hidden; /* 清除浮动 */
}

.sidebar {
    float: left;
    width: 250px;
}

.main {
    float: right;
    width: calc(100% - 270px);
}

/* 三栏布局 */
.three-columns {
    overflow: hidden;
}

.left-sidebar {
    float: left;
    width: 180px;
}

.content {
    float: left;
    width: calc(100% - 380px);
}

.right-sidebar {
    float: right;
    width: 180px;
}
```

---

## Flexbox 弹性布局

### 基础概念

Flexbox 是一种一维布局模式，让元素能够灵活地分配空间和对齐。

**核心概念**：
- **容器（Container）**：设置了 `display: flex` 的父元素
- **项目（Items）**：容器的直接子元素

### 容器属性

```css
.flex-container {
    display: flex;
    
    /* 主轴方向 */
    flex-direction: row;           /* 水平向右（默认）*/
    flex-direction: row-reverse;  /* 水平向左 */
    flex-direction: column;       /* 垂直向下 */
    flex-direction: column-reverse;/* 垂直向上 */
    
    /* 换行 */
    flex-wrap: nowrap;            /* 不换行（默认）*/
    flex-wrap: wrap;              /* 允许换行 */
    flex-wrap: wrap-reverse;      /* 反向换行 */
    
    /* 简写：direction + wrap */
    flex-flow: row wrap;
    
    /* 主轴对齐 */
    justify-content: flex-start;  /* 起点（默认）*/
    justify-content: flex-end;    /* 终点 */
    justify-content: center;      /* 居中 */
    justify-content: space-between;/* 两端对齐 */
    justify-content: space-around;/* 均匀分布 */
    justify-content: space-evenly;/* 等间距 */
    
    /* 交叉轴对齐 */
    align-items: stretch;         /* 拉伸（默认）*/
    align-items: flex-start;      /* 起点 */
    align-items: flex-end;        /* 终点 */
    align-items: center;          /* 居中 */
    align-items: baseline;        /* 基线对齐 */
    
    /* 多行交叉轴对齐 */
    align-content: stretch;
    align-content: flex-start;
    align-content: flex-end;
    align-content: center;
    align-content: space-between;
    align-content: space-around;
    align-content: space-evenly;
    
    /* gap 间距 */
    gap: 16px;
    row-gap: 16px;    /* 行间距 */
    column-gap: 16px; /* 列间距 */
}
```

### 项目属性

```css
.flex-item {
    /* 项目排序 */
    order: -1;        /* 默认 0，越小越靠前 */
    
    /* 放大比例（剩余空间分配）*/
    flex-grow: 0;     /* 不放大（默认）*/
    flex-grow: 1;     /* 等分剩余空间 */
    flex-grow: 2;     /* 占两份 */
    
    /* 缩小比例（空间不足时）*/
    flex-shrink: 1;   /* 允许缩小（默认）*/
    flex-shrink: 0;   /* 不缩小 */
    
    /* 基础大小 */
    flex-basis: auto;  /* 默认 */
    flex-basis: 200px; /* 固定大小 */
    flex-basis: 0;     /* 用于均分 */
    
    /* 简写：grow shrink basis */
    flex: 0 1 auto;    /* 默认 */
    flex: 1;           /* flex: 1 1 0 */
    flex: 0 0 auto;    /* 不伸缩 */
    flex: 0 0 200px;   /* 固定 200px */
    
    /* 单独对齐 */
    align-self: auto;  /* 继承容器（默认）*/
    align-self: flex-start;
    align-self: flex-end;
    align-self: center;
}
```

### Flexbox 经典布局

#### 1. 水平垂直居中

```css
.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
```

#### 2. 圣杯布局（三栏等高）

```css
.holy-grail {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.holy-grail header,
.holy-grail footer {
    flex: 0 0 60px;
}

.holy-grail main {
    display: flex;
    flex: 1;
}

.holy-grail nav {
    flex: 0 0 200px;
    order: -1;
}

.holy-grail article {
    flex: 1;
}

.holy-grail aside {
    flex: 0 0 200px;
}
```

#### 3. 卡片布局

```css
.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
}

.card {
    flex: 1 1 calc(33.333% - 14px); /* 3 列 */
    min-width: 280px;
}

@media (max-width: 768px) {
    .card {
        flex: 1 1 calc(50% - 10px); /* 2 列 */
    }
}
```

#### 4. 导航栏

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 64px;
}

.nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
}
```

#### 5. 粘性底部

```css
.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.page-wrapper main {
    flex: 1;
}

.page-wrapper footer {
    flex-shrink: 0;
}
```

---

## 过渡与动画

### 过渡（Transition）

过渡是状态变化时的平滑动画效果。

```css
.transition-demo {
    /* 基础用法 */
    transition: all 0.3s ease;
    
    /* 分别指定属性 */
    transition-property: background-color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
    transition-delay: 0.1s;
    
    /* 简写：property duration timing-function delay */
    transition: background-color 0.3s ease, 
                transform 0.3s ease;
    
    /* 多属性过渡 */
    transition: 
        background-color 0.3s ease,
        color 0.3s ease,
        border-radius 0.3s ease;
}
```

**缓动函数**：

```css
/* 预定义函数 */
transition-timing-function: linear;       /* 线性 */
transition-timing-function: ease;         /* 先快后慢（默认）*/
transition-timing-function: ease-in;      /* 渐入 */
transition-timing-function: ease-out;     /* 渐出 */
transition-timing-function: ease-in-out;  /* 渐入渐出 */
transition-timing-function: step-start;   /* 步骤开始 */
transition-timing-function: step-end;     /* 步骤结束 */

/* 贝塞尔曲线（自定义）*/
transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* Material Design */
```

**实际示例**：

```css
.button {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
```

### 动画（Animation）

动画定义关键帧序列。

```css
/* 定义关键帧 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translateY(0) scale(1, 1) skewX(0deg);
    }
    40%, 43% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translateY(-30px) scale(1.1, 0.9) skewX(-10deg);
    }
    70% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translateY(-15px) scale(1.05, 0.95) skewX(2deg);
    }
    90% {
        transform: translateY(-4px) scale(1, 1) skewX(-1deg);
    }
}

/* 应用动画 */
.animated-element {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-timing-function: ease-in-out;
    animation-delay: 0.2s;
    animation-iteration-count: infinite; /* 循环次数 */
    animation-direction: alternate;       /* 反向播放 */
    animation-fill-mode: forwards;        /* 保持结束状态 */
    animation-play-state: running;        /* 运行状态 */
    
    /* 简写 */
    animation: slideUp 0.5s ease-out 0.2s forwards,
               pulse 2s ease-in-out infinite;
}

/* 暂停/恢复 */
.paused {
    animation-play-state: paused;
}
```

### 常用动画库

```css
/* 旋转 */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 脉冲 */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

/* 抖动 */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* 加载动画 */
@keyframes loading {
    0% { 
        transform: rotate(0deg); 
        border-radius: 50%;
    }
    50% { 
        transform: rotate(180deg); 
        border-radius: 0%;
    }
    100% { 
        transform: rotate(360deg); 
        border-radius: 50%;
    }
}
```

---

## CSS 变量（自定义属性）

### 基础语法

```css
:root {
    /* 定义变量 */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    
    --text-color: #212529;
    --text-muted: #6c757d;
    --background-color: #ffffff;
    
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-base: 16px;
    --font-size-lg: 1.25rem;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.12);
    --shadow-lg: 0 10px 20px rgba(0,0,0,0.15);
    
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

### 使用变量

```css
/* 使用 var() 函数 */
body {
    color: var(--text-color);
    background-color: var(--background-color);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
}

.btn-primary {
    background-color: var(--primary-color);
    color: #fff;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-normal);
}

.card {
    background: var(--background-color);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--spacing-lg);
}
```

### 变量回退值

```css
.element {
    /* 变量不存在时使用回退值 */
    color: var(--undefined-variable, #333);
    
    /* 多层回退 */
    color: var(--custom-color, var(--primary-color, #007bff));
}
```

### JavaScript 操作变量

```javascript
// 获取变量值
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary-color');

// 设置变量值
document.documentElement.style.setProperty('--primary-color', '#e74c3c');

// 删除变量
document.documentElement.style.removeProperty('--primary-color');
```

### 主题切换示例

```css
:root {
    --bg-color: #ffffff;
    --text-color: #212529;
    --card-bg: #f8f9fa;
    --border-color: #dee2e6;
}

[data-theme="dark"] {
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --card-bg: #1e1e1e;
    --border-color: #333333;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
}
```

```javascript
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
```

---

## 响应式设计基础

### 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 媒体查询

```css
/* 移动优先策略 */

/* 基础样式（小屏幕）*/
.container {
    width: 100%;
    padding: 16px;
}

/* 平板及更大 */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
        padding: 24px;
    }
}

/* 桌面 */
@media (min-width: 1024px) {
    .container {
        width: 960px;
        padding: 32px;
    }
}

/* 大屏桌面 */
@media (min-width: 1280px) {
    .container {
        width: 1140px;
    }
}
```

### 常用媒体查询条件

```css
/* 最大宽度 */
@media (max-width: 767px) {
    /* 手机竖屏 */
}

/* 最小宽度 */
@media (min-width: 768px) {
    /* 平板及以上 */
}

/* 宽度范围 */
@media (min-width: 768px) and (max-width: 1024px) {
    /* 仅平板 */
}

/* 高度 */
@media (max-height: 500px) {
    /* 小屏幕高度 */
}

/* 方向 */
@media (orientation: portrait) {
    /* 竖屏 */
}

@media (orientation: landscape) {
    /* 横屏 */
}

/* 分辨率（Retina 屏幕）*/
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    /* 高清屏幕 */
}

/* 打印 */
@media print {
    body {
        font-size: 12pt;
        color: black;
    }
    
    .no-print {
        display: none;
    }
}
```

### 响应式单位

```css
.responsive-units {
    /* 视口单位 */
    width: 100vw;    /* 视口宽度的 100% */
    height: 100vh;   /* 视口高度的 100% */
    font-size: 2vw;  /* 视口宽度的 2% */
    
    /* 更安全的单位 */
    font-size: clamp(14px, 2vw + 10px, 18px);
    
    /* rem（相对于根元素）*/
    html { font-size: 16px; }  /* 1rem = 16px */
    body { font-size: 1rem; }
    
    /* em（相对于父元素）*/
    .parent { font-size: 20px; }
    .child { font-size: 1.5em; }  /* 30px */
    
    /* 百分比 */
    width: 50%;     /* 父元素的 50% */
    padding: 5%;    /* 包含块的 5% */
    
    /* calc() 计算 */
    width: calc(100% - 240px);
    width: min(100%, 800px);
    width: max(320px, 50%);
    width: clamp(320px, 50%, 800px);
}
```

### 流式布局技巧

```css
/* 流式网格 */
.fluid-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

/* 弹性图片 */
img {
    max-width: 100%;
    height: auto;
}

/* 响应式字体 */
body {
    font-size: clamp(14px, 1.5vw + 10px, 20px);
}

/* 响应式间距 */
.section {
    padding: clamp(20px, 5vw, 60px) clamp(16px, 3vw, 40px);
}
```

---

## CSS 最佳实践

### 命名规范

#### BEM 方法论

BEM = Block Element Modifier（块 元素 修饰符）

```css
/* Block（块）- 独立的组件单元 */
.card {}
.form {}
.nav {}

/* Element（元素）- 块的组成部分 */
.card__title {}
.card__body {}
.card__image {}
.form__input {}
.form__label {}

/* Modifier（修饰符）- 状态或变体 */
.card--featured {}      /* 特色卡片 */
.card--dark {}          /* 暗色卡片 */
.form__input--error {}  /* 错误状态的输入框 */
.nav__link--active {}   /* 活跃链接 */
```

```html
<!-- BEM HTML 结构 -->
<article class="card card--featured">
    <img class="card__image" src="..." alt="">
    <div class="card__body">
        <h3 class="card__title">标题</h3>
        <p class="card__text">内容...</p>
        <a href="#" class="card__btn card__btn--primary">了解更多</a>
    </div>
</article>
```

### CSS 架构方法

#### OOCSS（面向对象 CSS）

```css
/* 抽象通用模式 */
.media {
    display: flex;
    align-items: flex-start;
}

.media__object {
    margin-right: 16px;
    flex-shrink: 0;
}

.media__body {
    flex: 1;
}

/* 组合使用 */
.comment {
    padding: 16px;
    border-bottom: 1px solid #ddd;
}
```

#### SMACSS（可扩展模块化架构）

```
base/          /* 基础样式：reset, typography */
layout/        /* 布局：grid, header, footer */
modules/       /* 可复用组件：buttons, cards, forms */
state/         /* 状态：is-active, is-hidden */
themes/        /* 主题：colors, fonts */
utilities/     /* 工具类：u-clearfix, u-hidden */
```

### 性能优化

#### 选择器优化

```css
/* 避免 */
body div ul li a { ... }  /* 过深的后代选择器 */
[type="text"] { ... }     /* 通用属性选择器 */
* { ... }                  /* 通用选择器 */

/* 推荐 */
.link { ... }             /* 简单类选择器 */
.nav-link { ... }          /* 语义化类名 */
```

#### 属性优化

```css
/* 避免 */
transform: translateX(0) translateY(0) scale(1); /* 多个变换 */

/* 推荐 */
transform: translate(0, 0) scale(1);

/* 触发 GPU 加速 */
.gpu-accelerated {
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
}
```

### 重置样式

```css
/* 现代 Reset */
*, *::before, *::after {
    box-sizing: border-box;
}

* {
    margin: 0;
    padding: 0;
}

img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
}

input, button, textarea, select {
    font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
}

a {
    color: inherit;
    text-decoration: none;
}

ul, ol {
    list-style: none;
}
```

### 开发工具

#### Chrome DevTools 技巧

```css
/* 调试技巧 */
/* 1. 检查元素的计算样式 */
/* 2. 查看 CSS 来源（Sources 面板）*/
/* 3. 强制修改状态（:hover, :focus 等）*/
/* 4. 查看盒模型可视化 */
/* 5. 使用 Coverage 检测未使用的 CSS */

/* 快捷键 */
/* Ctrl+Shift+C: 选择元素 */
/* H: 切换元素可见性 */
/* :hov: 切换伪类状态 */
```

---

## 总结

### CSS 核心知识点

| 分类 | 重要程度 | 核心概念 |
|------|---------|---------|
| 基础语法 | ⭐⭐⭐⭐⭐ | 选择器、声明、注释 |
| 盒模型 | ⭐⭐⭐⭐⭐ | content/padding/border/margin |
| 布局 | ⭐⭐⭐⭐⭐ | Flexbox、Grid、定位、浮动 |
| 文本样式 | ⭐⭐⭐⭐ | 字体、颜色、对齐、溢出 |
| 背景/边框 | ⭐⭐⭐⭐ | 渐变、圆角、阴影 |
| 过渡动画 | ⭐⭐⭐⭐ | transition、animation、keyframes |
| 响应式 | ⭐⭐⭐⭐ | media query、视口单位 |
| CSS 变量 | ⭐⭐⭐ | 自定义属性、主题切换 |

### 学习路径

1. ✅ CSS 基础语法和选择器
2. ✅ 盒模型与文档流
3. ✅ Flexbox 弹性布局
4. ➡️ CSS3 新特性（下一篇）
5. Grid 网格布局
6. CSS 预处理器（Sass/Less）
7. CSS Modules / CSS-in-JS
8. CSS 性能优化

### 参考资源

- [MDN CSS 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [Can I Use](https://caniuse.com/) - 浏览器兼容性
- [CSS Tricks](https://css-tricks.com/)
- [Flexbox Froggy](https://flexboxfroggy.com/) - 互动学习
