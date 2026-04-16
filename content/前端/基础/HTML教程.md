---
title: HTML 完全教程
tags:
  - 前端
  - HTML
  - 基础
  - 教程
created: 2026-04-16
---

# HTML 完全教程

## 目录

1. [HTML 简介](#html-简介)
2. [HTML 基础结构](#html-基础结构)
3. [HTML 元素详解](#html-元素详解)
4. [HTML 属性](#html-属性)
5. [文本格式化](#文本格式化)
6. [链接与导航](#链接与导航)
7. [图像与媒体](#图像与媒体)
8. [表格](#表格)
9. [表单](#表单)
10. [HTML 实体与特殊字符](#html-实体与特殊字符)
11. [语义化 HTML](#语义化-html)
12. [最佳实践](#最佳实践)

---

## HTML 简介

### 什么是 HTML

**HTML**（HyperText Markup Language，超文本标记语言）是构建网页的标准标记语言。它使用"标记"（标签）来描述网页的结构和内容。

### HTML 发展历程

| 版本 | 年份 | 主要特性 |
|------|------|---------|
| HTML 1.0 | 1993 | 最早的 HTML 版本 |
| HTML 2.0 | 1995 | 增加了表单元素 |
| HTML 3.2 | 1997 | 表格、图像、脚本支持 |
| HTML 4.01 | 1999 | 样式表、框架、对象支持 |
| XHTML 1.0 | 2000 | 基于 XML 的 HTML |
| **HTML5** | 2014 | 现代 Web 标准 |

### HTML 的核心概念

```
HTML 文档 = 标签（Tags）+ 内容（Content）
```

- **标签**：用尖括号包围的关键字，如 `<p>`、`<div>`
- **元素**：开始标签 + 内容 + 结束标签，如 `<p>内容</p>`
- **属性**：为元素提供额外信息的键值对，如 `<a href="url">`

---

## HTML 基础结构

### 标准文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="页面描述">
    <title>页面标题</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- 页面内容 -->
    <header>
        <h1>网站标题</h1>
    </header>
    
    <main>
        <p>页面主体内容</p>
    </main>
    
    <footer>
        <p>版权信息</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
```

### 文档各部分详解

#### 1. `<!DOCTYPE html>`

声明文档类型，告诉浏览器使用 HTML5 标准解析页面。

#### 2. `<html>` 元素

根元素，包含整个 HTML 文档。

| 属性 | 说明 | 示例 |
|------|------|------|
| `lang` | 文档语言 | `lang="zh-CN"` |
| `dir` | 文本方向 | `dir="rtl"`（从右到左） |

#### 3. `<head>` 元素

包含文档的元数据（不会显示在页面上）：

```html
<head>
    <!-- 字符编码 -->
    <meta charset="UTF-8">
    
    <!-- 视口设置（响应式设计必需） -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 页面描述（SEO） -->
    <meta name="description" content="页面描述，搜索引擎会显示">
    
    <!-- 关键词（SEO，现在不太重要） -->
    <meta name="keywords" content="关键词1, 关键词2">
    
    <!-- 作者信息 -->
    <meta name="author" content="作者名">
    
    <!-- 页面标题 -->
    <title>页面标题 - 显示在浏览器标签</title>
    
    <!-- 外部样式表 -->
    <link rel="stylesheet" href="style.css">
    
    <!-- 网站图标 -->
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    
    <!-- 内部样式 -->
    <style>
        body { font-family: Arial, sans-serif; }
    </style>
    
    <!-- 外部脚本 -->
    <script src="script.js" defer></script>
</head>
```

#### 4. `<body>` 元素

包含页面的可见内容。

---

## HTML 元素详解

### 块级元素 vs 内联元素

| 特性 | 块级元素 | 内联元素 |
|------|---------|---------|
| 显示 | 独占一行 | 与其他元素同行 |
| 宽度 | 默认占满父容器 | 根据内容自适应 |
| 高度 | 可设置宽高 | 宽高由内容决定 |
| 示例 | `<div>`, `<p>`, `<h1>` | `<span>`, `<a>`, `<strong>` |

### 标题元素

```html
<h1>一级标题 - 页面主标题</h1>
<h2>二级标题 - 章节标题</h2>
<h3>三级标题 - 小节标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

**最佳实践**：
- 每个页面应该只有一个 `<h1>`
- 标题层级不要跳跃（不要从 h1 直接到 h3）
- 使用标题表达文档结构，而非样式

### 段落和文本元素

```html
<!-- 段落 -->
<p>这是一个段落。段落会自动在前后添加空白。</p>

<!-- 换行（单标签） -->
<p>第一行<br>第二行</p>

<!-- 水平分割线 -->
<hr>

<!-- 预格式化文本（保留空格和换行） -->
<pre>
    这  里  的  空  格  会  保  留
    换行
    也会保留
</pre>

<!-- 引用 -->
<blockquote cite="来源URL">
    <p>这是一段长引用。</p>
    <footer>— 引用来源</footer>
</blockquote>

<!-- 短引用 -->
<p>他说：<q>这是一句引用的话。</q></p>

<!-- 缩写 -->
<p><abbr title="HyperText Markup Language">HTML</abbr> 是超文本标记语言。</p>

<!-- 地址 -->
<address>
    联系信息：<br>
    邮箱：example@email.com<br>
    电话：123-456-7890
</address>

<!-- 代码 -->
<code>console.log('Hello')</code>

<!-- 键盘输入 -->
<kbd>Ctrl</kbd> + <kbd>C</kbd>

<!-- 计算机输出 -->
<samp>程序输出结果</samp>

<!-- 变量 -->
<var>x</var> = <var>y</var> + 2
```

### 容器元素

```html
<!-- 通用块级容器 -->
<div class="container">
    <p>div 是块级容器，用于组合元素。</p>
</div>

<!-- 通用内联容器 -->
<p>这是一段文字，<span class="highlight">这部分需要特殊样式</span>。</p>

<!-- 章节 -->
<section>
    <h2>章节标题</h2>
    <p>章节内容...</p>
</section>

<!-- 文章 -->
<article>
    <h2>文章标题</h2>
    <p>文章内容...</p>
</article>

<!-- 侧边栏 -->
<aside>
    <h3>相关链接</h3>
    <ul>
        <li><a href="#">链接1</a></li>
        <li><a href="#">链接2</a></li>
    </ul>
</aside>
```

---

## HTML 属性

### 全局属性（所有元素可用）

| 属性 | 说明 | 示例 |
|------|------|------|
| `class` | 类名（用于 CSS 和 JS） | `class="btn primary"` |
| `id` | 唯一标识符 | `id="header"` |
| `style` | 内联样式 | `style="color: red;"` |
| `title` | 提示信息 | `title="点击展开"` |
| `data-*` | 自定义数据属性 | `data-user-id="123"` |
| `hidden` | 隐藏元素 | `hidden` |
| `contenteditable` | 可编辑内容 | `contenteditable="true"` |
| `tabindex` | Tab 键顺序 | `tabindex="1"` |
| `lang` | 语言 | `lang="en"` |
| `dir` | 文本方向 | `dir="ltr"` |

### 属性的使用规则

```html
<!-- 属性值用双引号 -->
<div class="container">

<!-- 属性值用单引号也可以 -->
<div class='container'>

<!-- 布尔属性（无需值） -->
<input type="checkbox" checked>
<input type="text" disabled>
<input type="text" readonly>

<!-- 自定义数据属性 -->
<div data-product-id="123" data-category="electronics">
    产品信息
</div>
```

---

## 文本格式化

### 语义化文本标签

```html
<!-- 强调（斜体） -->
<p>这是一段<em>强调</em>的文字。</p>

<!-- 重要性（粗体） -->
<p>这是<strong>非常重要</strong>的信息。</p>

<!-- 标记/高亮 -->
<p>请<mark>注意</mark>这个关键词。</p>

<!-- 小号文字 -->
<p>正常文字 <small>小号文字（版权、法律声明）</small></p>

<!-- 删除线 -->
<p>原价：<del>¥100</del></p>

<!-- 插入线 -->
<p>现价：<ins>¥80</ins></p>

<!-- 下标 -->
<p>H<sub>2</sub>O</p>

<!-- 上标 -->
<p>E = mc<sup>2</sup></p>

<!-- 计算机代码 -->
<p>使用 <code>console.log()</code> 输出。</p>

<!-- 时间 -->
<p>发布于 <time datetime="2026-04-16">2026年4月16日</time></p>
```

### 不推荐使用的标签

| 旧标签 | 替代方案 | 原因 |
|--------|---------|------|
| `<b>` | `<strong>` 或 CSS | 仅视觉，无语义 |
| `<i>` | `<em>` 或 CSS | 仅视觉，无语义 |
| `<u>` | CSS `text-decoration` | 已废弃 |
| `<s>` | `<del>` | 语义不明确 |
| `<font>` | CSS | 已废弃 |
| `<center>` | CSS `text-align` | 已废弃 |

---

## 链接与导航

### 基础链接

```html
<!-- 外部链接 -->
<a href="https://www.example.com">访问示例网站</a>

<!-- 内部链接 -->
<a href="about.html">关于我们</a>

<!-- 页面内锚点 -->
<a href="#section1">跳转到第一节</a>
<!-- 目标位置 -->
<section id="section1">
    <h2>第一节</h2>
</section>

<!-- 新窗口打开 -->
<a href="https://example.com" target="_blank">新窗口打开</a>

<!-- 邮件链接 -->
<a href="mailto:email@example.com">发送邮件</a>

<!-- 电话链接（移动端） -->
<a href="tel:+1234567890">拨打电话</a>

<!-- 下载链接 -->
<a href="document.pdf" download>下载文档</a>
```

### 链接属性详解

| 属性 | 值 | 说明 |
|------|-----|------|
| `href` | URL | 链接目标 |
| `target` | `_self` | 当前窗口打开（默认） |
| | `_blank` | 新窗口/标签页 |
| | `_parent` | 父框架 |
| | `_top` | 顶层窗口 |
| `rel` | `nofollow` | 不传递权重（SEO） |
| | `noopener` | 安全，防止新页面访问 window.opener |
| | `noreferrer` | 不发送 Referer 头 |
| `download` | 文件名（可选） | 下载而非打开 |
| `title` | 文本 | 鼠标悬停提示 |

### 安全链接写法

```html
<!-- 外部链接最佳实践 -->
<a href="https://external.com" 
   target="_blank" 
   rel="noopener noreferrer nofollow">
   外部链接
</a>
```

### 导航结构

```html
<nav>
    <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li><a href="/services">服务</a></li>
        <li><a href="/about">关于</a></li>
        <li><a href="/contact">联系</a></li>
    </ul>
</nav>

<!-- 面包屑导航 -->
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品</a></li>
        <li aria-current="page">产品详情</li>
    </ol>
</nav>
```

---

## 图像与媒体

### 图像

```html
<!-- 基础图像 -->
<img src="image.jpg" alt="图片描述">

<!-- 响应式图像 -->
<img src="image.jpg" 
     alt="描述" 
     width="800" 
     height="600"
     loading="lazy">

<!-- 不同尺寸图像 -->
<img srcset="small.jpg 480w,
             medium.jpg 800w,
             large.jpg 1200w"
     sizes="(max-width: 600px) 480px,
            (max-width: 1000px) 800px,
            1200px"
     src="fallback.jpg"
     alt="响应式图片">

<!-- 艺术指导（不同裁剪） -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="描述">
</picture>

<!-- 不同格式 -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="描述">
</picture>

<!-- 图像映射 -->
<img src="map.jpg" usemap="#imagemap" alt="地图">
<map name="imagemap">
    <area shape="rect" coords="0,0,100,100" href="link1.html" alt="区域1">
    <area shape="circle" coords="150,150,50" href="link2.html" alt="区域2">
</map>
```

### 图像属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `src` | 图像路径 | `src="photo.jpg"` |
| `alt` | 替代文本（SEO + 无障碍） | `alt="风景照片"` |
| `width` | 宽度 | `width="800"` |
| `height` | 高度 | `height="600"` |
| `loading` | 加载方式 | `loading="lazy"` |
| `decoding` | 解码方式 | `decoding="async"` |

### 音频

```html
<!-- 基础音频 -->
<audio src="music.mp3" controls></audio>

<!-- 多格式支持 -->
<audio controls>
    <source src="music.mp3" type="audio/mpeg">
    <source src="music.ogg" type="audio/ogg">
    <p>您的浏览器不支持音频播放。</p>
</audio>

<!-- 完整属性 -->
<audio controls 
       autoplay 
       loop 
       muted 
       preload="metadata">
    <source src="music.mp3" type="audio/mpeg">
</audio>
```

### 视频

```html
<!-- 基础视频 -->
<video src="movie.mp4" controls width="640" height="360"></video>

<!-- 多格式支持 -->
<video controls width="640" height="360" poster="poster.jpg">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    <track kind="subtitles" src="subtitles.vtt" srclang="zh" label="中文">
    <p>您的浏览器不支持视频播放。</p>
</video>

<!-- 完整属性 -->
<video controls
       width="1280"
       height="720"
       poster="thumbnail.jpg"
       preload="auto"
       autoplay
       loop
       muted
       playsinline>
    <source src="movie.mp4" type="video/mp4">
    <track kind="captions" src="captions.vtt" srclang="zh" label="中文字幕">
</video>
```

### 嵌入内容

```html
<!-- 嵌入网页 -->
<iframe src="https://example.com" 
        width="800" 
        height="600"
        title="嵌入页面描述"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin">
</iframe>

<!-- 嵌入 YouTube -->
<iframe width="560" height="315" 
        src="https://www.youtube.com/embed/VIDEO_ID" 
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
</iframe>

<!-- 嵌入 PDF -->
<embed src="document.pdf" type="application/pdf" width="100%" height="600px">

<!-- 对象嵌入 -->
<object data="flash.swf" type="application/x-shockwave-flash" width="400" height="300">
    <param name="quality" value="high">
</object>
```

---

## 表格

### 基础表格

```html
<table>
    <caption>员工信息表</caption>
    <thead>
        <tr>
            <th>姓名</th>
            <th>职位</th>
            <th>部门</th>
            <th>入职日期</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>工程师</td>
            <td>技术部</td>
            <td>2024-01-15</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>设计师</td>
            <td>设计部</td>
            <td>2024-03-20</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4">总计：2 人</td>
        </tr>
    </tfoot>
</table>
```

### 表格属性与样式

```html
<table border="1" cellpadding="10" cellspacing="0">
    <colgroup>
        <col style="width: 100px; background-color: #f0f0f0;">
        <col style="width: 150px;">
        <col span="2" style="width: 120px;">
    </colgroup>
    <thead>
        <tr>
            <th scope="col">项目</th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">收入</th>
            <td>100万</td>
            <td>120万</td>
            <td>150万</td>
        </tr>
        <tr>
            <th scope="row">支出</th>
            <td>80万</td>
            <td>90万</td>
            <td>100万</td>
        </tr>
    </tbody>
</table>
```

### 复杂表格

```html
<table>
    <caption>课程表</caption>
    <thead>
        <tr>
            <th>时间</th>
            <th>周一</th>
            <th>周二</th>
            <th>周三</th>
            <th>周四</th>
            <th>周五</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th rowspan="2">上午</th>
            <td>数学</td>
            <td>语文</td>
            <td>英语</td>
            <td>物理</td>
            <td>化学</td>
        </tr>
        <tr>
            <td>语文</td>
            <td>数学</td>
            <td>物理</td>
            <td>化学</td>
            <td>英语</td>
        </tr>
        <tr>
            <th colspan="6">午休</th>
        </tr>
        <tr>
            <th rowspan="2">下午</th>
            <td>体育</td>
            <td>美术</td>
            <td>音乐</td>
            <td>历史</td>
            <td>地理</td>
        </tr>
        <tr>
            <td>自习</td>
            <td>自习</td>
            <td>班会</td>
            <td>自习</td>
            <td>自习</td>
        </tr>
    </tbody>
</table>
```

### 表格元素说明

| 元素 | 说明 |
|------|------|
| `<table>` | 表格容器 |
| `<caption>` | 表格标题 |
| `<thead>` | 表头区域 |
| `<tbody>` | 表格主体 |
| `<tfoot>` | 表尾区域 |
| `<tr>` | 表格行 |
| `<th>` | 表头单元格 |
| `<td>` | 数据单元格 |
| `<colgroup>` | 列组 |
| `<col>` | 列定义 |

### 表格属性

| 属性 | 说明 |
|------|------|
| `colspan` | 跨列合并 |
| `rowspan` | 跨行合并 |
| `scope` | 表头作用域（`col`/`row`/`colgroup`/`rowgroup`） |
| `headers` | 关联表头 ID |

---

## 表单

### 基础表单结构

```html
<form action="/submit" method="POST" enctype="multipart/form-data">
    <!-- 表单内容 -->
    <fieldset>
        <legend>个人信息</legend>
        <!-- 表单控件 -->
    </fieldset>
    
    <button type="submit">提交</button>
</form>
```

### 表单属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `action` | 提交地址 | `action="/api/submit"` |
| `method` | 提交方法 | `method="POST"` |
| `enctype` | 编码类型 | `enctype="multipart/form-data"` |
| `target` | 提交目标 | `target="_blank"` |
| `novalidate` | 禁用验证 | `novalidate` |
| `autocomplete` | 自动完成 | `autocomplete="on"` |

### 输入控件

#### 文本输入

```html
<!-- 单行文本 -->
<label for="username">用户名：</label>
<input type="text" 
       id="username" 
       name="username"
       placeholder="请输入用户名"
       required
       minlength="3"
       maxlength="20"
       pattern="[a-zA-Z0-9_]+">

<!-- 密码 -->
<label for="password">密码：</label>
<input type="password" 
       id="password" 
       name="password"
       minlength="8"
       required>

<!-- 邮箱 -->
<label for="email">邮箱：</label>
<input type="email" 
       id="email" 
       name="email"
       placeholder="example@email.com"
       required
       multiple>

<!-- 电话号码 -->
<label for="phone">电话：</label>
<input type="tel" 
       id="phone" 
       name="phone"
       pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}">

<!-- 搜索 -->
<label for="search">搜索：</label>
<input type="search" 
       id="search" 
       name="search"
       placeholder="搜索...">

<!-- URL -->
<label for="website">网站：</label>
<input type="url" 
       id="website" 
       name="website"
       placeholder="https://example.com">
```

#### 数字输入

```html
<!-- 数字 -->
<label for="quantity">数量：</label>
<input type="number" 
       id="quantity" 
       name="quantity"
       min="1"
       max="100"
       step="1"
       value="1">

<!-- 范围滑块 -->
<label for="volume">音量：</label>
<input type="range" 
       id="volume" 
       name="volume"
       min="0"
       max="100"
       value="50">
```

#### 日期和时间

```html
<!-- 日期 -->
<label for="birthday">生日：</label>
<input type="date" 
       id="birthday" 
       name="birthday"
       min="1900-01-01"
       max="2026-12-31">

<!-- 时间 -->
<label for="meeting-time">会议时间：</label>
<input type="time" id="meeting-time" name="meeting-time">

<!-- 日期时间 -->
<label for="appointment">预约时间：</label>
<input type="datetime-local" id="appointment" name="appointment">

<!-- 月份 -->
<label for="month">月份：</label>
<input type="month" id="month" name="month">

<!-- 周 -->
<label for="week">周：</label>
<input type="week" id="week" name="week">
```

#### 选择控件

```html
<!-- 单选按钮 -->
<fieldset>
    <legend>性别：</legend>
    <label>
        <input type="radio" name="gender" value="male" required>
        男
    </label>
    <label>
        <input type="radio" name="gender" value="female">
        女
    </label>
    <label>
        <input type="radio" name="gender" value="other">
        其他
    </label>
</fieldset>

<!-- 复选框 -->
<fieldset>
    <legend>兴趣爱好：</legend>
    <label>
        <input type="checkbox" name="hobbies" value="reading">
        阅读
    </label>
    <label>
        <input type="checkbox" name="hobbies" value="sports">
        运动
    </label>
    <label>
        <input type="checkbox" name="hobbies" value="music">
        音乐
    </label>
</fieldset>

<!-- 下拉选择 -->
<label for="country">国家：</label>
<select id="country" name="country" required>
    <option value="">请选择</option>
    <option value="cn">中国</option>
    <option value="us">美国</option>
    <option value="uk">英国</option>
    <option value="jp">日本</option>
</select>

<!-- 分组下拉选择 -->
<label for="browser">浏览器：</label>
<select id="browser" name="browser">
    <optgroup label="桌面浏览器">
        <option value="chrome">Chrome</option>
        <option value="firefox">Firefox</option>
        <option value="safari">Safari</option>
    </optgroup>
    <optgroup label="移动浏览器">
        <option value="chrome-mobile">Chrome Mobile</option>
        <option value="safari-mobile">Safari Mobile</option>
    </optgroup>
</select>

<!-- 多选下拉 -->
<label for="skills">技能：</label>
<select id="skills" name="skills" multiple size="4">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
    <option value="python">Python</option>
</select>

<!-- 数据列表（自动完成） -->
<label for="browser">浏览器：</label>
<input list="browsers" id="browser" name="browser">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
</datalist>
```

#### 文件上传

```html
<!-- 单文件 -->
<label for="avatar">头像：</label>
<input type="file" 
       id="avatar" 
       name="avatar"
       accept="image/*">

<!-- 多文件 -->
<label for="documents">文档：</label>
<input type="file" 
       id="documents" 
       name="documents"
       accept=".pdf,.doc,.docx"
       multiple>

<!-- 捕获摄像头 -->
<label for="photo">拍照：</label>
<input type="file" 
       id="photo" 
       name="photo"
       accept="image/*"
       capture="user">
```

#### 其他控件

```html
<!-- 颜色选择 -->
<label for="color">主题色：</label>
<input type="color" id="color" name="color" value="#ff0000">

<!-- 隐藏字段 -->
<input type="hidden" name="csrf_token" value="random_token">

<!-- 多行文本 -->
<label for="message">留言：</label>
<textarea id="message" 
          name="message"
          rows="5"
          cols="50"
          maxlength="500"
          placeholder="请输入留言..."></textarea>

<!-- 进度条 -->
<label for="progress">进度：</label>
<progress id="progress" value="70" max="100">70%</progress>

<!-- 度量条 -->
<label for="disk">磁盘使用：</label>
<meter id="disk" 
       min="0" 
       max="100" 
       low="30" 
       high="70" 
       optimum="50" 
       value="80">80%</meter>
```

### 按钮

```html
<!-- 提交按钮 -->
<button type="submit">提交</button>
<input type="submit" value="提交">

<!-- 重置按钮 -->
<button type="reset">重置</button>
<input type="reset" value="重置">

<!-- 普通按钮 -->
<button type="button" onclick="doSomething()">点击</button>

<!-- 图片提交按钮 -->
<input type="image" src="submit.png" alt="提交">
```

### 完整表单示例

```html
<form action="/register" method="POST" novalidate>
    <fieldset>
        <legend>用户注册</legend>
        
        <div>
            <label for="reg-username">用户名 *</label>
            <input type="text" 
                   id="reg-username" 
                   name="username"
                   required
                   minlength="3"
                   maxlength="20"
                   pattern="[a-zA-Z0-9_]+"
                   autocomplete="username">
            <small>3-20个字符，只能包含字母、数字和下划线</small>
        </div>
        
        <div>
            <label for="reg-email">邮箱 *</label>
            <input type="email" 
                   id="reg-email" 
                   name="email"
                   required
                   autocomplete="email">
        </div>
        
        <div>
            <label for="reg-password">密码 *</label>
            <input type="password" 
                   id="reg-password" 
                   name="password"
                   required
                   minlength="8"
                   autocomplete="new-password">
            <small>至少8个字符</small>
        </div>
        
        <div>
            <label for="reg-confirm">确认密码 *</label>
            <input type="password" 
                   id="reg-confirm" 
                   name="confirm_password"
                   required
                   autocomplete="new-password">
        </div>
        
        <div>
            <label>
                <input type="checkbox" name="agree" required>
                我同意 <a href="/terms">服务条款</a> 和 <a href="/privacy">隐私政策</a>
            </label>
        </div>
        
        <div>
            <button type="submit">注册</button>
            <button type="reset">重置</button>
        </div>
    </fieldset>
</form>
```

---

## HTML 实体与特殊字符

### 常用实体

| 字符 | 实体名称 | 实体编号 | 说明 |
|------|---------|---------|------|
| `&` | `&amp;` | `&#38;` | 和号 |
| `<` | `&lt;` | `&#60;` | 小于号 |
| `>` | `&gt;` | `&#62;` | 大于号 |
| `"` | `&quot;` | `&#34;` | 引号 |
| `'` | `&apos;` | `&#39;` | 撇号 |
| ` ` | `&nbsp;` | `&#160;` | 不间断空格 |
| `©` | `&copy;` | `&#169;` | 版权 |
| `®` | `&reg;` | `&#174;` | 注册商标 |
| `™` | `&trade;` | `&#8482;` | 商标 |
| `€` | `&euro;` | `&#8364;` | 欧元 |
| `¥` | `&yen;` | `&#165;` | 日元/人民币 |
| `£` | `&pound;` | `&#163;` | 英镑 |
| `←` | `&larr;` | `&#8592;` | 左箭头 |
| `→` | `&rarr;` | `&#8594;` | 右箭头 |
| `↑` | `&uarr;` | `&#8593;` | 上箭头 |
| `↓` | `&darr;` | `&#8595;` | 下箭头 |

### 使用示例

```html
<!-- 显示 HTML 代码 -->
<p>使用 &lt;div&gt; 标签创建容器。</p>

<!-- 版权信息 -->
<p>&copy; 2026 公司名称. 保留所有权利。</p>

<!-- 空格 -->
<p>这里&nbsp;&nbsp;&nbsp;&nbsp;有多个空格。</p>

<!-- 数学符号 -->
<p>2 &times; 3 = 6</p>
<p>10 &divide; 2 = 5</p>
<p>x&sup2; + y&sup2; = z&sup2;</p>
```

---

## 语义化 HTML

### 为什么需要语义化

1. **SEO**：搜索引擎更好地理解页面内容
2. **无障碍**：屏幕阅读器能正确解析页面
3. **可维护性**：代码更易读、易维护
4. **样式分离**：不依赖标签名来设置样式

### 语义化元素

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>语义化页面示例</title>
</head>
<body>
    <!-- 页眉 -->
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/about">关于</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- 主要内容 -->
    <main>
        <!-- 文章 -->
        <article>
            <header>
                <h2>文章标题</h2>
                <p>发布于 <time datetime="2026-04-16">2026年4月16日</time></p>
            </header>
            
            <section>
                <h3>第一节</h3>
                <p>内容...</p>
            </section>
            
            <section>
                <h3>第二节</h3>
                <p>内容...</p>
            </section>
            
            <footer>
                <p>标签：<a href="/tag/html">HTML</a>, <a href="/tag/css">CSS</a></p>
            </footer>
        </article>
        
        <!-- 侧边栏 -->
        <aside>
            <section>
                <h3>相关文章</h3>
                <ul>
                    <li><a href="#">文章1</a></li>
                    <li><a href="#">文章2</a></li>
                </ul>
            </section>
        </aside>
    </main>
    
    <!-- 页脚 -->
    <footer>
        <p>&copy; 2026 公司名称</p>
        <address>
            联系邮箱：<a href="mailto:contact@example.com">contact@example.com</a>
        </address>
    </footer>
</body>
</html>
```

### 语义化元素对照表

| 元素 | 用途 | 替代方案（不推荐） |
|------|------|------------------|
| `<header>` | 页面/章节头部 | `<div class="header">` |
| `<nav>` | 导航链接 | `<div class="nav">` |
| `<main>` | 主要内容 | `<div class="main">` |
| `<article>` | 独立内容 | `<div class="article">` |
| `<section>` | 章节 | `<div class="section">` |
| `<aside>` | 侧边内容 | `<div class="sidebar">` |
| `<footer>` | 页面/章节底部 | `<div class="footer">` |
| `<figure>` | 独立内容（图片、代码） | `<div class="figure">` |
| `<figcaption>` | 内容标题 | `<p class="caption">` |
| `<time>` | 日期/时间 | `<span class="time">` |
| `<mark>` | 高亮标记 | `<span class="highlight">` |

---

## 最佳实践

### 1. 文档结构

```html
<!-- ✅ 好的结构 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
</body>
</html>

<!-- ❌ 不好的结构 -->
<html>
<head>
    <title>标题</title>
</head>
<body>
    <div class="header">...</div>
    <div class="content">...</div>
    <div class="footer">...</div>
</body>
</html>
```

### 2. 图片优化

```html
<!-- ✅ 好的做法 -->
<img src="image.jpg" 
     alt="描述性文字" 
     width="800" 
     height="600"
     loading="lazy">

<!-- ❌ 不好的做法 -->
<img src="image.jpg">
```

### 3. 表单可访问性

```html
<!-- ✅ 好的做法 -->
<label for="email">邮箱：</label>
<input type="email" id="email" name="email" required>

<!-- ❌ 不好的做法 -->
邮箱：<input type="text" name="email">
```

### 4. 链接文本

```html
<!-- ✅ 好的做法 -->
<a href="guide.html">阅读 HTML 完整指南</a>

<!-- ❌ 不好的做法 -->
<a href="guide.html">点击这里</a>
```

### 5. 表格可访问性

```html
<!-- ✅ 好的做法 -->
<table>
    <caption>销售数据</caption>
    <thead>
        <tr>
            <th scope="col">月份</th>
            <th scope="col">销售额</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">一月</th>
            <td>10000</td>
        </tr>
    </tbody>
</table>
```

### 6. 验证与检查

使用以下工具验证 HTML：

- **W3C Markup Validator**：https://validator.w3.org/
- **HTML5 Outliner**：检查文档大纲
- **Lighthouse**：Chrome 开发者工具中的审计功能

### 7. 性能优化

```html
<!-- 延迟加载图片 -->
<img src="image.jpg" loading="lazy" alt="描述">

<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- 预连接 -->
<link rel="preconnect" href="https://api.example.com">
```

---

## 总结

### HTML 核心要点

1. **语义化**：使用正确的标签表达内容含义
2. **可访问性**：为图片添加 alt，为表单添加 label
3. **SEO**：正确使用标题层级，添加 meta 描述
4. **性能**：优化图片，延迟加载非关键资源
5. **验证**：使用 W3C 验证器检查代码

### 学习路径

1. ✅ HTML 基础（本文档）
2. ➡️ HTML5 新特性（下一篇）
3. CSS 基础
4. JavaScript 基础
5. 响应式设计
6. 前端框架

---

**参考资源**：
- [MDN HTML 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [W3C HTML 规范](https://html.spec.whatwg.org/)
- [Can I Use](https://caniuse.com/) - 浏览器兼容性查询
