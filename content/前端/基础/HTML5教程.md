---
title: HTML5 完全教程
tags:
  - 前端
  - HTML5
  - 基础
  - 教程
created: 2026-04-16
---

# HTML5 完全教程

## 目录

1. [HTML5 简介](#html5-简介)
2. [HTML5 新语义元素](#html5-新语义元素)
3. [HTML5 表单增强](#html5-表单增强)
4. [HTML5 多媒体](#html5-多媒体)
5. [HTML5 Canvas](#html5-canvas)
6. [HTML5 SVG](#html5-svg)
7. [HTML5 拖放 API](#html5-拖放-api)
8. [HTML5 本地存储](#html5-本地存储)
9. [HTML5 地理定位](#html5-地理定位)
10. [HTML5 Web Workers](#html5-web-workers)
11. [HTML5 Server-Sent Events](#html5-server-sent-events)
12. [HTML5 WebSocket](#html5-websocket)
13. [HTML5 文件 API](#html5-文件-api)
14. [HTML5 全屏 API](#html5-全屏-api)
15. [HTML5 通知 API](#html5-通知-api)
16. [最佳实践与兼容性](#最佳实践与兼容性)

---

## HTML5 简介

### 什么是 HTML5

**HTML5** 是 HTML 的第五个主要版本，于 2014 年 10 月由 W3C 正式发布。它不是单一的技术，而是一系列技术的集合，包括：

- **HTML5 标记语言**：新的语义元素
- **CSS3**：样式和动画
- **JavaScript API**：丰富的客户端功能

### HTML5 设计原则

1. **兼容性**：向后兼容现有内容
2. **实用性**：解决实际问题
3. **互操作性**：跨浏览器一致
4. **通用访问**：支持所有设备和平台

### HTML5 vs HTML4

| 特性 | HTML4 | HTML5 |
|------|-------|-------|
| 文档类型 | `<!DOCTYPE HTML PUBLIC ...>` | `<!DOCTYPE html>` |
| 字符编码 | `<meta http-equiv="Content-Type" ...>` | `<meta charset="UTF-8">` |
| 多媒体 | 依赖插件（Flash） | 原生支持（video/audio） |
| 图形 | 依赖插件 | 原生 Canvas 和 SVG |
| 存储 | Cookies | LocalStorage, IndexedDB |
| 语义 | 有限的语义标签 | 丰富的语义元素 |
| 表单 | 基础输入类型 | 丰富的输入类型和验证 |

### HTML5 文档模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="页面描述">
    <title>HTML5 页面</title>
</head>
<body>
    <!-- HTML5 内容 -->
</body>
</html>
```

---

## HTML5 新语义元素

### 结构性元素

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>语义化页面结构</title>
</head>
<body>
    <!-- 页面头部 -->
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- 主要内容 -->
    <main>
        <!-- 文章 -->
        <article>
            <header>
                <h2>文章标题</h2>
                <p>作者：<span>张三</span> | <time datetime="2026-04-16">2026-04-16</time></p>
            </header>
            
            <section>
                <h3>第一节</h3>
                <p>这是第一节的内容...</p>
            </section>
            
            <section>
                <h3>第二节</h3>
                <p>这是第二节的内容...</p>
                <figure>
                    <img src="diagram.png" alt="说明图表">
                    <figcaption>图1：说明图表的描述</figcaption>
                </figure>
            </section>
            
            <footer>
                <p>标签：<a href="#html">HTML</a>, <a href="#css">CSS</a></p>
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
        <p>&copy; 2026 公司名称. 保留所有权利。</p>
    </footer>
</body>
</html>
```

### 语义元素详解

| 元素 | 用途 | 使用场景 |
|------|------|---------|
| `<header>` | 页面或章节的头部 | 网站 logo、导航、标题 |
| `<nav>` | 导航链接 | 主导航、面包屑、分页 |
| `<main>` | 页面主要内容 | 每页只能有一个 |
| `<article>` | 独立的内容 | 博客文章、新闻、评论 |
| `<section>` | 文档中的章节 | 有标题的内容分组 |
| `<aside>` | 侧边内容 | 侧边栏、相关链接、广告 |
| `<footer>` | 页面或章节的底部 | 版权、联系信息、相关链接 |
| `<figure>` | 独立的内容单元 | 图片、代码、图表 |
| `<figcaption>` | 内容单元的标题 | figure 的标题 |
| `<time>` | 日期/时间 | 发布时间、事件时间 |
| `<mark>` | 高亮标记 | 搜索结果高亮 |
| `<details>` | 可展开的内容 | FAQ、更多信息 |
| `<summary>` | details 的标题 | 可点击的摘要 |
| `<dialog>` | 对话框 | 模态框、提示框 |

### Details 和 Summary

```html
<!-- 简单的展开/收起 -->
<details>
    <summary>点击展开更多信息</summary>
    <p>这是隐藏的详细内容...</p>
    <p>可以包含多个段落和其他元素。</p>
</details>

<!-- 默认展开 -->
<details open>
    <summary>常见问题</summary>
    <ul>
        <li>问题1：答案...</li>
        <li>问题2：答案...</li>
    </ul>
</details>

<!-- 嵌套使用 -->
<details>
    <summary>产品分类</summary>
    <details>
        <summary>电子产品</summary>
        <ul>
            <li>手机</li>
            <li>电脑</li>
        </ul>
    </details>
    <details>
        <summary>服装</summary>
        <ul>
            <li>男装</li>
            <li>女装</li>
        </ul>
    </details>
</details>
```

### Dialog 对话框

```html
<!-- 基础对话框 -->
<dialog id="myDialog">
    <h2>确认删除？</h2>
    <p>此操作不可撤销。</p>
    <button onclick="document.getElementById('myDialog').close()">取消</button>
    <button onclick="confirmDelete()">确认</button>
</dialog>

<button onclick="document.getElementById('myDialog').showModal()">打开对话框</button>

<script>
const dialog = document.getElementById('myDialog');

// 显示为模态对话框（有遮罩层）
dialog.showModal();

// 显示为非模态对话框
dialog.show();

// 关闭对话框
dialog.close();

// 监听关闭事件
dialog.addEventListener('close', () => {
    console.log('对话框已关闭');
});
</script>
```

### 文档大纲示例

```html
<body>
    <header>
        <h1>我的网站</h1>
    </header>
    
    <nav>
        <h2>导航</h2>
        <!-- 导航链接 -->
    </nav>
    
    <main>
        <article>
            <header>
                <h2>文章标题</h2>
            </header>
            
            <section>
                <h3>第一部分</h3>
                <!-- 内容 -->
            </section>
            
            <section>
                <h3>第二部分</h3>
                <!-- 内容 -->
            </section>
        </article>
    </main>
    
    <aside>
        <h2>侧边栏</h2>
        <!-- 侧边内容 -->
    </aside>
    
    <footer>
        <h2>页脚</h2>
        <!-- 版权信息 -->
    </footer>
</body>
```

---

## HTML5 表单增强

### 新的 Input 类型

```html
<!-- 颜色选择器 -->
<label for="color">选择颜色：</label>
<input type="color" id="color" name="color" value="#ff0000">

<!-- 日期 -->
<label for="date">选择日期：</label>
<input type="date" id="date" name="date" min="2024-01-01" max="2026-12-31">

<!-- 时间 -->
<label for="time">选择时间：</label>
<input type="time" id="time" name="time">

<!-- 日期时间 -->
<label for="datetime">选择日期时间：</label>
<input type="datetime-local" id="datetime" name="datetime">

<!-- 月份 -->
<label for="month">选择月份：</label>
<input type="month" id="month" name="month">

<!-- 周 -->
<label for="week">选择周：</label>
<input type="week" id="week" name="week">

<!-- 数字 -->
<label for="number">数量：</label>
<input type="number" id="number" name="number" min="0" max="100" step="5">

<!-- 范围滑块 -->
<label for="range">音量：</label>
<input type="range" id="range" name="range" min="0" max="100" value="50">

<!-- 搜索 -->
<label for="search">搜索：</label>
<input type="search" id="search" name="search" placeholder="搜索...">

<!-- 电话 -->
<label for="tel">电话：</label>
<input type="tel" id="tel" name="tel" pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}">

<!-- 邮箱 -->
<label for="email">邮箱：</label>
<input type="email" id="email" name="email" multiple placeholder="可输入多个，用逗号分隔">

<!-- URL -->
<label for="url">网站：</label>
<input type="url" id="url" name="url" placeholder="https://example.com">
```

### 表单验证属性

```html
<form>
    <!-- required - 必填 -->
    <input type="text" required placeholder="必填">
    
    <!-- pattern - 正则验证 -->
    <input type="text" pattern="[A-Za-z]{3}" title="三个字母">
    
    <!-- min/max - 数值范围 -->
    <input type="number" min="1" max="10">
    
    <!-- minlength/maxlength - 长度限制 -->
    <input type="text" minlength="3" maxlength="10">
    
    <!-- step - 步长 -->
    <input type="number" step="0.5">
    
    <!-- novalidate - 禁用验证 -->
    <form novalidate>
        <input type="email" required>
        <button type="submit">提交（不验证）</button>
    </form>
</form>
```

### Datalist 自动完成

```html
<label for="browser">选择浏览器：</label>
<input list="browsers" id="browser" name="browser" placeholder="输入或选择">

<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
    <option value="Brave">
    <option value="Vivaldi">
</datalist>

<!-- 与 select 结合 -->
<label for="country">国家/地区：</label>
<input list="countries" id="country" name="country">
<datalist id="countries">
    <option value="CN" label="中国">
    <option value="US" label="美国">
    <option value="UK" label="英国">
    <option value="JP" label="日本">
</datalist>
```

### 表单相关元素

```html
<!-- 进度条 -->
<label for="progress">上传进度：</label>
<progress id="progress" value="70" max="100">70%</progress>

<!-- 度量条 -->
<label for="meter">磁盘使用：</label>
<meter id="meter" 
       min="0" 
       max="100" 
       low="30" 
       high="70" 
       optimum="50" 
       value="80">80%</meter>

<!-- 输出 -->
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
    <input type="number" id="a" name="a" value="0">
    +
    <input type="number" id="b" name="b" value="0">
    =
    <output name="result" for="a b">0</output>
</form>

<!-- 密钥生成器 -->
<keygen name="key" challenge="challenge string" keytype="RSA">
```

### 完整的 HTML5 表单示例

```html
<form action="/submit" method="POST">
    <fieldset>
        <legend>个人信息</legend>
        
        <p>
            <label for="fullname">姓名：</label>
            <input type="text" 
                   id="fullname" 
                   name="fullname"
                   required
                   autocomplete="name"
                   placeholder="请输入您的姓名">
        </p>
        
        <p>
            <label for="birthdate">出生日期：</label>
            <input type="date" 
                   id="birthdate" 
                   name="birthdate"
                   max="2006-01-01"
                   required>
        </p>
        
        <p>
            <label for="useremail">邮箱：</label>
            <input type="email" 
                   id="useremail" 
                   name="email"
                   required
                   autocomplete="email"
                   placeholder="example@email.com">
        </p>
        
        <p>
            <label for="userphone">电话：</label>
            <input type="tel" 
                   id="userphone" 
                   name="phone"
                   pattern="1[3-9]\d{9}"
                   placeholder="13800138000"
                   title="请输入有效的手机号码">
        </p>
        
        <p>
            <label for="favcolor">喜欢的颜色：</label>
            <input type="color" 
                   id="favcolor" 
                   name="favcolor"
                   value="#3498db">
        </p>
    </fieldset>
    
    <fieldset>
        <legend>偏好设置</legend>
        
        <p>
            <label for="satisfaction">满意度：</label>
            <input type="range" 
                   id="satisfaction" 
                   name="satisfaction"
                   min="1" 
                   max="10" 
                   value="5">
        </p>
        
        <p>
            <label for="appointment">预约时间：</label>
            <input type="datetime-local" 
                   id="appointment" 
                   name="appointment"
                   min="2026-04-16T09:00"
                   max="2026-12-31T18:00">
        </p>
        
        <p>
            <label for="homepage">个人网站：</label>
            <input type="url" 
                   id="homepage" 
                   name="homepage"
                   placeholder="https://yourwebsite.com">
        </p>
    </fieldset>
    
    <p>
        <button type="submit">提交</button>
        <button type="reset">重置</button>
    </p>
</form>
```

---

## HTML5 多媒体

### Video 视频

```html
<!-- 基础视频 -->
<video src="movie.mp4" controls></video>

<!-- 完整配置 -->
<video controls
       width="640"
       height="360"
       poster="thumbnail.jpg"
       preload="metadata"
       autoplay
       muted
       loop
       playsinline>
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    <source src="movie.ogv" type="video/ogg">
    <track kind="subtitles" src="subtitles_zh.vtt" srclang="zh" label="中文" default>
    <track kind="subtitles" src="subtitles_en.vtt" srclang="en" label="English">
    <track kind="captions" src="captions.vtt" srclang="zh" label="中文字幕">
    <p>您的浏览器不支持视频播放。</p>
</video>
```

### Video 属性

| 属性 | 说明 |
|------|------|
| `controls` | 显示播放控件 |
| `autoplay` | 自动播放 |
| `muted` | 静音 |
| `loop` | 循环播放 |
| `poster` | 封面图片 |
| `preload` | 预加载（`none`/`metadata`/`auto`） |
| `playsinline` | iOS 内联播放 |
| `crossorigin` | CORS 设置 |

### Audio 音频

```html
<!-- 基础音频 -->
<audio src="music.mp3" controls></audio>

<!-- 多格式支持 -->
<audio controls preload="metadata">
    <source src="music.mp3" type="audio/mpeg">
    <source src="music.ogg" type="audio/ogg">
    <source src="music.wav" type="audio/wav">
    <p>您的浏览器不支持音频播放。</p>
</audio>

<!-- 自动播放（需要 muted） -->
<audio autoplay muted loop>
    <source src="background.mp3" type="audio/mpeg">
</audio>
```

### 媒体事件

```html
<video id="myVideo" src="movie.mp4" controls></video>

<script>
const video = document.getElementById('myVideo');

// 播放事件
video.addEventListener('play', () => {
    console.log('视频开始播放');
});

// 暂停事件
video.addEventListener('pause', () => {
    console.log('视频暂停');
});

// 结束事件
video.addEventListener('ended', () => {
    console.log('视频播放结束');
});

// 时间更新
video.addEventListener('timeupdate', () => {
    console.log('当前时间：', video.currentTime);
});

// 加载进度
video.addEventListener('progress', () => {
    console.log('加载进度：', video.buffered);
});
</script>
```

### WebVTT 字幕

```vtt
<!-- subtitles.vtt -->
WEBVTT

1
00:00:01.000 --> 00:00:04.000
欢迎来到 HTML5 教程

2
00:00:05.000 --> 00:00:08.000
今天我们将学习多媒体

3
00:00:09.000 --> 00:00:12.000
包括视频和音频
```

---

## HTML5 Canvas

### 基础 Canvas

```html
<canvas id="myCanvas" width="500" height="300">
    您的浏览器不支持 Canvas。
</canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = '#3498db';
ctx.fillRect(50, 50, 200, 100);

// 绘制边框
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 3;
ctx.strokeRect(50, 50, 200, 100);

// 清除区域
ctx.clearRect(75, 75, 50, 50);
</script>
```

### 绘制路径

```html
<canvas id="pathCanvas" width="500" height="300"></canvas>

<script>
const canvas = document.getElementById('pathCanvas');
const ctx = canvas.getContext('2d');

// 绘制三角形
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(150, 200);
ctx.lineTo(50, 200);
ctx.closePath();
ctx.fillStyle = '#9b59b6';
ctx.fill();

// 绘制圆形
ctx.beginPath();
ctx.arc(300, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = '#f39c12';
ctx.fill();
ctx.strokeStyle = '#d35400';
ctx.stroke();

// 绘制贝塞尔曲线
ctx.beginPath();
ctx.moveTo(50, 250);
ctx.quadraticCurveTo(150, 50, 250, 250);
ctx.strokeStyle = '#2ecc71';
ctx.stroke();
</script>
```

### 绘制文本

```html
<canvas id="textCanvas" width="500" height="200"></canvas>

<script>
const canvas = document.getElementById('textCanvas');
const ctx = canvas.getContext('2d');

// 设置字体
ctx.font = 'bold 30px Arial';
ctx.fillStyle = '#2c3e50';
ctx.fillText('Hello Canvas!', 50, 50);

// 描边文字
ctx.font = '40px Georgia';
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 2;
ctx.strokeText('描边文字', 50, 120);

// 文字对齐
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('居中对齐', 250, 170);
</script>
```

### 图像操作

```html
<canvas id="imageCanvas" width="500" height="300"></canvas>
<img id="sourceImage" src="photo.jpg" style="display: none;">

<script>
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const img = document.getElementById('sourceImage');

img.onload = () => {
    // 绘制图像
    ctx.drawImage(img, 0, 0);
    
    // 缩放绘制
    ctx.drawImage(img, 0, 0, 200, 150);
    
    // 裁剪绘制
    ctx.drawImage(img, 100, 100, 200, 200, 250, 0, 200, 200);
};
</script>
```

### 动画示例

```html
<canvas id="animationCanvas" width="500" height="300"></canvas>

<script>
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let x = 0;
let y = 150;
let dx = 2;
let dy = 2;
const radius = 20;

function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制圆形
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    
    // 更新位置
    x += dx;
    y += dy;
    
    // 边界检测
    if (x + radius > canvas.width || x - radius < 0) dx = -dx;
    if (y + radius > canvas.height || y - radius < 0) dy = -dy;
    
    requestAnimationFrame(animate);
}

animate();
</script>
```

---

## HTML5 SVG

### 内联 SVG

```html
<!-- 基础 SVG -->
<svg width="200" height="200" viewBox="0 0 200 200">
    <!-- 矩形 -->
    <rect x="10" y="10" width="80" height="80" fill="#3498db" stroke="#2980b9" stroke-width="2"/>
    
    <!-- 圆形 -->
    <circle cx="150" cy="50" r="40" fill="#e74c3c" opacity="0.8"/>
    
    <!-- 椭圆 -->
    <ellipse cx="100" cy="150" rx="60" ry="30" fill="#2ecc71"/>
    
    <!-- 直线 -->
    <line x1="10" y1="180" x2="190" y2="180" stroke="#34495e" stroke-width="3"/>
    
    <!-- 多边形 -->
    <polygon points="50,50 100,20 150,50 150,100 100,130 50,100" fill="#f39c12"/>
</svg>
```

### 路径和文本

```html
<svg width="400" height="300" viewBox="0 0 400 300">
    <!-- 路径 -->
    <path d="M 50 150 Q 150 50 250 150 T 350 150" 
          fill="none" 
          stroke="#9b59b6" 
          stroke-width="3"/>
    
    <!-- 文本 -->
    <text x="50" y="50" font-family="Arial" font-size="24" fill="#2c3e50">
        SVG 文本
    </text>
    
    <!-- 沿路径的文本 -->
    <defs>
        <path id="textPath" d="M 50 200 Q 200 100 350 200"/>
    </defs>
    <text font-family="Arial" font-size="18" fill="#e74c3c">
        <textPath href="#textPath">
            这是一段沿路径排列的文本
        </textPath>
    </text>
    
    <!-- 渐变 -->
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3498db;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1"/>
        </linearGradient>
    </defs>
    <rect x="50" y="250" width="300" height="30" fill="url(#grad1)"/>
</svg>
```

### SVG 与 Canvas 对比

| 特性 | SVG | Canvas |
|------|-----|--------|
| 类型 | 矢量图形 | 位图 |
| 缩放 | 无损 | 会失真 |
| 事件 | 支持 DOM 事件 | 需要手动计算 |
| 适用 | 图标、图表、Logo | 游戏、图像处理 |
| 性能 | 元素多时较慢 | 像素操作快 |

---

## HTML5 拖放 API

### 基础拖放

```html
<div id="draggable" draggable="true" style="padding: 20px; background: #3498db; color: white; cursor: move;">
    拖动我
</div>

<div id="dropzone" style="margin-top: 20px; padding: 50px; border: 3px dashed #95a5a6;">
    拖放到这里
</div>

<script>
const draggable = document.getElementById('draggable');
const dropzone = document.getElementById('dropzone');

// 拖动开始
draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '拖动数据');
    e.dataTransfer.effectAllowed = 'move';
    draggable.style.opacity = '0.5';
});

// 拖动结束
draggable.addEventListener('dragend', () => {
    draggable.style.opacity = '1';
});

// 拖动经过
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dropzone.style.backgroundColor = '#ecf0f1';
});

// 拖动离开
dropzone.addEventListener('dragleave', () => {
    dropzone.style.backgroundColor = '';
});

// 放置
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    dropzone.style.backgroundColor = '#2ecc71';
    dropzone.textContent = `接收到：${data}`;
});
</script>
```

### 文件拖放

```html
<div id="fileDropzone" style="padding: 50px; border: 3px dashed #3498db; text-align: center;">
    拖放文件到这里上传
</div>
<ul id="fileList"></ul>

<script>
const dropzone = document.getElementById('fileDropzone');
const fileList = document.getElementById('fileList');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = '#ecf0f1';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.backgroundColor = '';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = '';
    
    const files = e.dataTransfer.files;
    
    for (const file of files) {
        const li = document.createElement('li');
        li.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        fileList.appendChild(li);
    }
});
</script>
```

---

## HTML5 本地存储

### LocalStorage

```javascript
// 存储数据
localStorage.setItem('username', '张三');
localStorage.setItem('theme', 'dark');

// 读取数据
const username = localStorage.getItem('username');
console.log(username); // "张三"

// 删除数据
localStorage.removeItem('theme');

// 清空所有
localStorage.clear();

// 获取存储数量
console.log(localStorage.length);

// 通过索引获取键
console.log(localStorage.key(0));
```

### SessionStorage

```javascript
// 与 localStorage 用法相同，但数据在会话结束后清除
sessionStorage.setItem('tempData', '临时数据');

// 页面刷新后数据保留
// 关闭标签页后数据清除
```

### 存储对象

```javascript
// 存储对象需要序列化
const user = {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
};

localStorage.setItem('user', JSON.stringify(user));

// 读取时反序列化
const savedUser = JSON.parse(localStorage.getItem('user'));
console.log(savedUser.name); // "张三"
```

### 存储事件

```javascript
// 监听其他页面的存储变化
window.addEventListener('storage', (e) => {
    console.log('键：', e.key);
    console.log('旧值：', e.oldValue);
    console.log('新值：', e.newValue);
    console.log('URL：', e.url);
});
```

### 完整示例：主题切换

```html
<button id="themeToggle">切换主题</button>

<script>
// 加载保存的主题
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(savedTheme + '-theme');

// 切换主题
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.classList.remove(currentTheme + '-theme');
    document.body.classList.add(newTheme + '-theme');
    
    localStorage.setItem('theme', newTheme);
});
</script>
```

---

## HTML5 地理定位

### 获取位置

```javascript
// 检查支持
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        // 成功回调
        (position) => {
            console.log('纬度：', position.coords.latitude);
            console.log('经度：', position.coords.longitude);
            console.log('精度：', position.coords.accuracy, '米');
            console.log('海拔：', position.coords.altitude);
            console.log('速度：', position.coords.speed);
            console.log('方向：', position.coords.heading);
            console.log('时间戳：', position.timestamp);
        },
        // 错误回调
        (error) => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.log('用户拒绝定位请求');
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log('位置信息不可用');
                    break;
                case error.TIMEOUT:
                    console.log('请求超时');
                    break;
            }
        },
        // 选项
        {
            enableHighAccuracy: true, // 高精度
            timeout: 10000,           // 超时时间
            maximumAge: 0             // 不使用缓存
        }
    );
} else {
    console.log('浏览器不支持地理定位');
}
```

### 持续追踪位置

```javascript
const watchId = navigator.geolocation.watchPosition(
    (position) => {
        console.log('新位置：', position.coords.latitude, position.coords.longitude);
    },
    (error) => {
        console.error('定位错误：', error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
    }
);

// 停止追踪
navigator.geolocation.clearWatch(watchId);
```

---

## HTML5 Web Workers

### 创建 Worker

```javascript
// main.js
const worker = new Worker('worker.js');

// 发送消息给 Worker
worker.postMessage({
    command: 'calculate',
    data: [1, 2, 3, 4, 5]
});

// 接收 Worker 消息
worker.onmessage = (e) => {
    console.log('Worker 结果：', e.data);
};

// 错误处理
worker.onerror = (error) => {
    console.error('Worker 错误：', error.message);
};

// 终止 Worker
worker.terminate();
```

### Worker 脚本

```javascript
// worker.js
self.onmessage = (e) => {
    const { command, data } = e.data;
    
    if (command === 'calculate') {
        // 执行耗时计算
        const result = data.reduce((sum, num) => sum + num, 0);
        
        // 发送结果回主线程
        self.postMessage({
            result: result,
            timestamp: Date.now()
        });
    }
};

// Worker 中可以使用的方法
// setTimeout, setInterval
// XMLHttpRequest, fetch
// IndexedDB
// 但不能访问 DOM
```

### 共享 Worker

```javascript
// shared-worker.js
const connections = [];

self.onconnect = (e) => {
    const port = e.ports[0];
    connections.push(port);
    
    port.onmessage = (e) => {
        // 广播给所有连接
        connections.forEach(conn => {
            if (conn !== port) {
                conn.postMessage(e.data);
            }
        });
    };
    
    port.start();
};
```

---

## HTML5 Server-Sent Events

### 客户端

```javascript
// 创建 EventSource
const eventSource = new EventSource('/api/events');

// 监听消息
eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log('收到消息：', data);
};

// 监听特定事件
eventSource.addEventListener('user-login', (e) => {
    console.log('用户登录：', e.data);
});

eventSource.addEventListener('notification', (e) => {
    console.log('新通知：', e.data);
});

// 错误处理
eventSource.onerror = (error) => {
    console.error('SSE 错误：', error);
};

// 关闭连接
eventSource.close();
```

### 服务器端（Node.js 示例）

```javascript
const http = require('http');

http.createServer((req, res) => {
    if (req.url === '/api/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        
        // 发送消息
        const sendEvent = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };
        
        // 定期发送心跳
        const heartbeat = setInterval(() => {
            sendEvent({ type: 'heartbeat', time: Date.now() });
        }, 30000);
        
        // 发送特定事件
        sendEvent({ type: 'connected', message: '连接成功' });
        
        // 清理
        req.on('close', () => {
            clearInterval(heartbeat);
        });
    }
}).listen(3000);
```

---

## HTML5 WebSocket

### 基础 WebSocket

```javascript
// 创建 WebSocket 连接
const socket = new WebSocket('wss://example.com/socket');

// 连接建立
socket.onopen = () => {
    console.log('WebSocket 连接已建立');
    
    // 发送消息
    socket.send(JSON.stringify({
        type: 'join',
        room: 'room1'
    }));
};

// 接收消息
socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log('收到消息：', data);
};

// 连接关闭
socket.onclose = (e) => {
    console.log('连接关闭：', e.code, e.reason);
};

// 错误处理
socket.onerror = (error) => {
    console.error('WebSocket 错误：', error);
};

// 检查连接状态
console.log('状态：', socket.readyState);
// CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3

// 关闭连接
socket.close(1000, '正常关闭');
```

### 完整聊天室示例

```html
<div id="chat">
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="输入消息...">
    <button id="sendBtn">发送</button>
</div>

<script>
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const socket = new WebSocket('wss://chat.example.com');

socket.onopen = () => {
    addMessage('系统', '已连接到聊天室');
};

socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    addMessage(data.username, data.message);
};

socket.onclose = () => {
    addMessage('系统', '连接已断开');
};

function addMessage(username, message) {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${username}:</strong> ${message}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            username: '用户' + Math.floor(Math.random() * 1000),
            message: message
        }));
        messageInput.value = '';
    }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
</script>
```

---

## HTML5 文件 API

### 读取文件

```html
<input type="file" id="fileInput" multiple accept="image/*">
<div id="preview"></div>

<script>
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    
    for (const file of files) {
        // 文件信息
        console.log('名称：', file.name);
        console.log('大小：', file.size);
        console.log('类型：', file.type);
        console.log('修改时间：', file.lastModified);
        
        // 读取为 Data URL
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            preview.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    }
});
</script>
```

### FileReader 方法

| 方法 | 说明 |
|------|------|
| `readAsText(file)` | 读取为文本 |
| `readAsDataURL(file)` | 读取为 Base64 Data URL |
| `readAsBinaryString(file)` | 读取为二进制字符串 |
| `readAsArrayBuffer(file)` | 读取为 ArrayBuffer |
| `abort()` | 中止读取 |

### 文件切片上传

```javascript
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        // 上传切片
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('index', i);
        formData.append('total', totalChunks);
        formData.append('filename', file.name);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        });
    }
});
```

---

## HTML5 全屏 API

```javascript
const element = document.documentElement; // 或特定元素

// 进入全屏
function enterFullscreen() {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// 退出全屏
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
    console.log('全屏状态：', document.fullscreenElement ? '全屏' : '退出');
});
```

---

## HTML5 通知 API

```javascript
// 请求权限
Notification.requestPermission().then(permission => {
    console.log('通知权限：', permission);
    // granted: 允许, denied: 拒绝, default: 默认
});

// 发送通知
function sendNotification() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('新消息', {
            body: '您有一条新消息待查看',
            icon: '/icon.png',
            badge: '/badge.png',
            tag: 'message-1',
            requireInteraction: true,
            actions: [
                { action: 'reply', title: '回复' },
                { action: 'dismiss', title: '忽略' }
            ]
        });
        
        // 点击通知
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // 关闭通知
        notification.onclose = () => {
            console.log('通知已关闭');
        };
    }
}

// 服务工作者通知（PWA）
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('后台通知', {
            body: '这是来自服务工作者的通知',
            icon: '/icon.png'
        });
    });
}
```

---

## 最佳实践与兼容性

### 特性检测

```javascript
// 检测 Canvas
if (!!document.createElement('canvas').getContext) {
    // 支持 Canvas
}

// 检测 LocalStorage
try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    // 支持 LocalStorage
} catch (e) {
    // 不支持
}

// 检测 Geolocation
if ('geolocation' in navigator) {
    // 支持地理定位
}

// 检测 WebSocket
if ('WebSocket' in window) {
    // 支持 WebSocket
}

// 使用 Modernizr 库
// https://modernizr.com/
```

### Polyfill

```javascript
// LocalStorage Polyfill
if (!window.localStorage) {
    window.localStorage = {
        getItem: (key) => {
            return document.cookie.match(new RegExp(key + '=([^;]+)'))?.[1] || null;
        },
        setItem: (key, value) => {
            document.cookie = key + '=' + value + '; path=/';
        },
        removeItem: (key) => {
            document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
    };
}
```

### 性能优化

```javascript
// 1. 使用 requestAnimationFrame 替代 setInterval
function animate() {
    // 动画代码
    requestAnimationFrame(animate);
}

// 2. 防抖和节流
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 3. 使用 Web Worker 处理耗时任务
const worker = new Worker('heavy-task.js');
worker.postMessage(largeData);

// 4. 虚拟滚动（大量数据）
// 只渲染可视区域的内容
```

### 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| Canvas | 4+ | 3.6+ | 4+ | 12+ | 9+ |
| LocalStorage | 4+ | 3.5+ | 4+ | 12+ | 8+ |
| WebSocket | 16+ | 11+ | 7+ | 12+ | 10+ |
| Web Worker | 4+ | 3.5+ | 4+ | 12+ | 10+ |
| Geolocation | 5+ | 3.5+ | 5+ | 12+ | 9+ |
| Drag & Drop | 4+ | 3.5+ | 4+ | 12+ | 10+ |
| Video/Audio | 4+ | 3.5+ | 4+ | 12+ | 9+ |
| Notifications | 22+ | 22+ | 6+ | 14+ | ❌ |
| Fullscreen | 15+ | 10+ | 5.1+ | 12+ | 11+ |

### 学习资源

- [MDN HTML5 文档](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5)
- [HTML5 规范](https://html.spec.whatwg.org/)
- [Can I Use](https://caniuse.com/) - 浏览器兼容性查询
- [HTML5 Rocks](https://www.html5rocks.com/) - HTML5 教程

---

## 总结

### HTML5 核心特性

1. **语义化**：新的语义元素让文档结构更清晰
2. **多媒体**：原生支持视频、音频，无需插件
3. **图形**：Canvas 和 SVG 提供强大的绘图能力
4. **存储**：LocalStorage 和 IndexedDB 提供客户端存储
5. **连接**：WebSocket 和 SSE 实现实时通信
6. **性能**：Web Workers 实现多线程
7. **设备访问**：地理定位、摄像头、麦克风

### 学习路径

1. ✅ HTML 基础
2. ✅ HTML5 新特性（本文档）
3. CSS3 样式和动画
4. JavaScript ES6+
5. 前端框架（React/Vue/Angular）
6. PWA 和移动开发

HTML5 为 Web 开发带来了革命性的变化，掌握这些特性将帮助你构建现代、高效、功能丰富的 Web 应用。
