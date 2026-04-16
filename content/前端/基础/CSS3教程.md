---
title: CSS3 完全教程
tags:
  - 前端
  - CSS3
  - 基础
  - 教程
  - 动画
  - 布局
created: 2026-04-16
---

# CSS3 完全教程

## 目录

1. [CSS3 简介](#css3-简介)
2. [CSS3 选择器增强](#css3-选择器增强)
3. [CSS3 圆角与阴影](#css3-圆角与阴影)
4. [CSS3 渐变](#css3-渐变)
5. [CSS3 变换（Transform）](#css3-变换transform)
6. [CSS3 过渡与动画进阶](#css3-过渡与动画进阶)
7. [CSS3 Grid 网格布局](#css3-grid-网格布局)
8. [CSS3 多列布局](#css3-多列布局)
9. [CSS3 混合模式](#css3-混合模式)
10. [CSS3 滤镜效果](#css3-滤镜效果)
11. [CSS3 背景高级特性](#css3-背景高级特性)
12. [CSS3 文字特效](#css3-文字特效)
13. [CSS3 用户界面](#css3-用户界面)
14. [CSS3 媒体查询增强](#css3-媒体查询增强)
15. [CSS3 自定义属性进阶](#css3-自定义属性进阶)
16. [CSS3 新单位](#css3-新单位)
17. [CSS3 最佳实践与兼容性](#css3-最佳实践与兼容性)

---

## CSS3 简介

### 什么是 CSS3

**CSS3** 是 CSS 的最新标准，采用模块化方式发布。它不是单一规范，而是由多个独立模块组成的技术集合。

### CSS3 主要模块

| 模块 | 状态 | 说明 |
|------|------|------|
| Selectors Level 3/4 | 推荐 | 新选择器 |
| Colors Level 3/4 | 推荐 | 新颜色值和函数 |
| Backgrounds & Borders | 推荐 | 圆角、阴影、渐变 |
| Transforms | 推荐 | 2D/3D 变换 |
| Transitions | 推荐 | 过渡动画 |
| Animations | 推荐 | 关键帧动画 |
| Flexbox Layout | 推荐 | 弹性布局 |
| Grid Layout Level 1 | 推荐 | 网格布局 |
| Media Queries Level 3/4 | 推荐 | 响应式设计 |
| Fonts Level 3/4 | 推荐 | Web 字体 |
| Masking | 候选推荐 | 遮罩 |
| Compositing and Blending | 候选推荐 | 混合模式 |

### CSS3 vs CSS2 对比

| 特性 | CSS2 | CSS3 |
|------|------|------|
| 选择器 | 基础 | 属性、结构、UI、伪类扩展 |
| 颜色 | 十六进制、RGB | RGBA, HSLA, 透明度 |
| 背景 | 单一背景图 | 多背景、渐变、background-size |
| 边框 | 方形边框 | 圆角、图片边框、box-shadow |
| 文本 | 基础样式 | 文字阴影、溢出处理、换行控制 |
| 布局 | float + position | Flexbox, Grid, 多列 |
| 动画 | 无原生支持 | transition, animation, transform |
| 字体 | 系统字体 | @font-face Web 字体 |
| 媒体查询 | 仅 screen/print | 支持设备特性查询 |

---

## CSS3 选择器增强

### 属性选择器增强

```css
/* 以某字符串开头 */
[href^="https"] { }
[src^="images/"] { }

/* 以某字符串结尾 */
[href$=".pdf"] { }
[src$=".jpg"] { }

/* 包含某字符串 */
[class*="btn-"] { }
[name*="user"] { }

/* 以单词分隔包含 */
[class~="active"] { }
[lang~="en-US"] { }

/* 以连字符分隔开头 */
[class|="component"] { }
[lang|="zh"] { }

/* 大小写敏感（i 标志）*/
[class^="post" i] { } /* 匹配 Post, POST 等 */
```

### 结构伪类增强

```css
/* 第 n 个子元素 */
li:nth-child(3) { }           /* 第 3 个 */
li:nth-child(odd) { }         /* 奇数 */
li:nth-child(even) { }        /* 偶数 */
li:nth-child(3n) { }          /* 每 3 个 */
li:nth-child(-n+5) { }        /* 前 5 个 */
li:nth-child(n+6) { }         /* 从第 6 个开始 */

/* 最后 n 个子元素 */
li:nth-last-child(-n+3) { }   /* 最后 3 个 */

/* 类型选择器 */
p:nth-of-type(2) { }          /* 第 2 个 p 元素 */
p:first-of-type { }            /* 第 1 个 p 元素 */
p:last-of-type { }             /* 最后一个 p 元素 */
p:only-of-type { }             /* 唯一的 p 元素 */

/* 根元素 */
:root {
    --primary-color: #007bff; /* 定义 CSS 变量 */
}

/* 空元素 */
td:empty {
    background-color: #f9f9f9;
}
```

### UI 伪类

```css
/* 表单状态 */
input:enabled { }             /* 可用的 */
input:disabled { }            /* 禁用的 */
input:checked { }              /* 选中的（radio/checkbox）*/
input:indeterminate { }       /* 不确定状态 */

/* 默认值 */
input:default { }

/* 有效性 */
input:valid {
    border-color: #28a745;
}

input:invalid {
    border-color: #dc3545;
}

input:required { }            /* 必填 */
input:optional { }            /* 可选 */
input:in-range { }            /* 在范围内 */
input:out-of-range { }        /* 在范围外 */

/* 读写状态 */
input:read-only { }
input:read-write { }

/* 焦点相关 */
input:focus { }
input:focus-visible { }      /* 键盘焦点 */
input:focus-within { }        /* 子元素获得焦点时 */

/* 占位符 */
input::placeholder { color: #999; }
input:placeholder-shown { }   /* 显示占位符时 */

/* 目标伪类 */
section:target {
    background-color: yellow;
}
```

### 否定伪类

```css
/* 非 .special 类的段落 */
p:not(.special) { }

/* 组合使用 */
div:not([class]):not([id]) { }

/* 复杂否定 */
li:not(:first-child):not(:last-child) { }

input:not([type="submit"]):not([type="button"]) { }
```

### 伪元素增强

```css
::selection {
    background-color: #b3d4fc;
    color: #000;
}

/* 高亮标记 */
::highlight(search-results) {
    background-color: #ffeb3b;
}

/* 插入符号 */
.caret::caret {
    color: blue;
}

/* 文件选择器按钮 */
input[type="file"]::file-selector-button {
    border: none;
    background: #007bff;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
}
```

---

## CSS3 圆角与阴影

### border-radius 进阶

```css
/* 基础圆角 */
.radius-basic {
    border-radius: 8px;
    border-radius: 50%;
    border-radius: 999px;
}

/* 四个角分别设置 */
.radius-individual {
    border-top-left-radius: 10px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 40px;
    
    /* 简写：顺时针 */
    border-radius: 10px 20px 30px 40px;
}

/* 水平/垂直分开设置 */
.radius-split {
    border-radius: 50% / 25%;     /* 椭圆 */
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
}

/* 特殊形状 */
.shape-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.shape-pill {
    height: 40px;
    padding: 0 24px;
    border-radius: 999px;
}

.shape-blob {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.shape-diamond {
    transform: rotate(45deg);
    border-radius: 10px;
}
```

### box-shadow 进阶

```css
/* 基础阴影：x y blur spread color */
.shadow-basic {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 内阴影 */
.shadow-inset {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 无偏移阴影（柔和）*/
.shadow-soft {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 强烈阴影 */
.shadow-strong {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 多重阴影（层叠效果）*/
.shadow-layered {
    box-shadow:
        0 1px 1px rgba(0, 0, 0, 0.12),
        0 2px 2px rgba(0, 0, 0, 0.12),
        0 4px 4px rgba(0, 0, 0, 0.12),
        0 8px 8px rgba(0, 0, 0, 0.12),
        0 16px 16px rgba(0, 0, 0, 0.12);
}

/* 霓虹灯效果 */
.shadow-neon {
    box-shadow:
        0 0 5px #00f,
        0 0 10px #00f,
        0 0 20px #00f,
        0 0 40px #00f;
}

/* 卡片悬浮效果 */
.card-hover {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-hover:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
                0 10px 10px rgba(0, 0, 0, 0.22);
    transform: translateY(-4px);
}

/* 底部固定阴影 */
.bottom-shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 内凹效果 */
.inset-shadow {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
```

### text-shadow 文字阴影

```css
.text-shadow-basic {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 发光文字 */
.text-glow {
    text-shadow:
        0 0 10px #fff,
        0 0 20px #fff,
        0 0 30px #e60073,
        0 0 40px #e60073,
        0 0 50px #e60073,
        0 0 60px #e60073,
        0 0 70px #e60073;
}

/* 凹陷文字 */
.text-inset {
    color: transparent;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

/* 3D 文字 */
.text-3d {
    text-shadow:
        1px 1px 0 #ccc,
        2px 2px 0 #c9c9c9,
        3px 3px 0 #bbb,
        4px 4px 0 #b9b9b9,
        5px 5px 0 #aaa,
        6px 6px 0 #a9a9a9,
        7px 7px 0 #999,
        8px 8px 0 #898989,
        9px 9px 0 #797979,
        10px 10px 0 #696969;
}
```

---

## CSS3 渐变

### 线性渐变（Linear Gradient）

```css
/* 基础线性渐变 */
.linear-basic {
    background: linear-gradient(to right, red, blue);
    background: linear-gradient(90deg, red, blue); /* 角度方式 */
}

/* 多色渐变 */
.linear-multi {
    background: linear-gradient(
        to bottom,
        #ff0000,
        #ff8000,
        #ffff00,
        #80ff00,
        #00ff00
    );
}

/* 百分比位置控制 */
.linear-position {
    background: linear-gradient(
        90deg,
        #3498db 0%,
        #3498db 40%,
        #e74c3c 40%,
        #e74c3c 100%
    );
}

/* 使用角度 */
.linear-angle {
    background: linear-gradient(
        135deg,
        #667eea 0%,
        #764ba2 100%
    );
}

/* 重复渐变 */
.linear-repeating {
    background: repeating-linear-gradient(
        45deg,
        #333,
        #333 10px,
        #fff 10px,
        #fff 20px
    );
}

/* 条纹图案 */
.stripes {
    background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,0.1) 10px,
        rgba(255,255,255,0.1) 20px
    );
}

/* 斜纹 */
.diagonal-stripes {
    background: repeating-linear-gradient(
        -45deg,
        #333 0,
        #333 10px,
        #666 10px,
        #666 20px
    );
}

/* 棋盘格 */
.checkerboard {
    background-image:
        linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333),
        linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
}
```

### 径向渐变（Radial Gradient）

```css
/* 基础径向渐变 */
.radial-basic {
    background: radial-gradient(red, blue);
}

/* 圆形渐变 */
.radial-circle {
    background: radial-gradient(circle, red, blue);
}

/* 设置圆心位置 */
.radial-position {
    background: radial-gradient(circle at top left, red, orange, yellow);
}

/* 设置半径大小 */
.radial-size {
    background: radial-gradient(
        circle at center,
        red 0%,
        red 20%,
        blue 20%,
        blue 40%,
        green 40%,
        green 100%
    );
}

/* 最远角 */
.radial-far-corner {
    background: radial-gradient(
        farthest-corner at 40px 40px,
        #f00,
        #00f
    );
}

/* 重复径向渐变 */
.radial-repeating {
    background: repeating-radial-gradient(
        circle at 50% 50%,
        #000 0,
        #000 10px,
        #fff 10px,
        #fff 20px
    );
}

/* 波点图案 */
.polka-dots {
    background: radial-gradient(circle, #333 20%, transparent 21%);
    background-size: 30px 30px;
}

/* 太阳光芒 */
.sun-rays {
    background: 
        repeating-conic-gradient(
            from 0deg,
            #ffd700 0deg 10deg,
            transparent 10deg 20deg
        );
    border-radius: 50%;
}
```

### 锥形渐变（Conic Gradient）

```css
/* 基础锥形渐变 */
.conic-basic {
    background: conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red);
}

/* 设置起始角度和中心 */
.conic-custom {
    background: conic-gradient(
        from 45deg at 50% 50%,
        #3498db 0deg,
        #3498db 180deg,
        #e74c3c 180deg,
        #e74c3c 360deg
    );
    border-radius: 50%; /* 圆形 */
}

/* 饼图 */
.pie-chart {
    background: conic-gradient(
        #e74c3c 0% 35%,
        #3498db 35% 65%,
        #2ecc71 65% 85%,
        #f39c12 85% 100%
    );
    border-radius: 50%;
}

/* 重复锥形渐变 */
.conic-repeating {
    background: repeating-conic-gradient(
        from 0deg,
        #333 0deg 10deg,
        #666 10deg 20deg
    );
}
```

### 渐变实战示例

```css
/* 按钮渐变 */
.btn-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 32px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

/* 卡片渐变背景 */
.card-gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 32px;
    color: white;
}

/* 玻璃拟态 */
.glassmorphism {
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 100%
    );
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
}

/* 渐变文字 */
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

---

## CSS3 变换（Transform）

### 2D 变换

```css
/* 平移 translate() */
.translate-demo {
    /* 向右移动 100px，向下移动 50px */
    transform: translateX(100px);
    transform: translateY(50px);
    transform: translate(100px, 50px);
    transform: translateZ(100px);  /* 3D */
    transform: translate3d(100px, 50px, 0);
    
    /* 相对自身百分比移动（居中技巧）*/
    transform: translateX(-50%) translateY(-50%);
}

/* 缩放 scale() */
.scale-demo {
    transform: scale(1.5);           /* 整体放大 1.5 倍 */
    transform: scaleX(1.2);          /* X 轴缩放 */
    transform: scaleY(0.8);          /* Y 轴缩放 */
    transform: scale(1.2, 0.8);
    transform: scaleZ(1.5);          /* 3D */
}

/* 旋转 rotate() */
.rotate-demo {
    transform: rotate(45deg);        /* 顺时针旋转 45° */
    transform: rotate(-90deg);       /* 逆时针旋转 90° */
    transform: rotateX(180deg);      /* 沿 X 轴旋转（翻转）*/
    transform: rotateY(180deg);      /* 沿 Y 轴旋转（翻转）*/
}

/* 倾斜 skew() */
.skew-demo {
    transform: skewX(15deg);         /* X 轴倾斜 */
    transform: skewY(10deg);         /* Y 轴倾斜 */
    transform: skew(15deg, 10deg);
}

/* 矩阵 matrix() */
.matrix-demo {
    /* matrix(scaleX, skewY, skewX, scaleY, translateX, translateY) */
    transform: matrix(1, 0, 0, 1, 100, 50);
}

/* 组合变换（顺序很重要！）*/
.combo-transform {
    transform: translate(100px, 0) rotate(45deg) scale(1.2);
}
```

### 3D 变换

```css
/* 3D 容器设置 */
.container-3d {
    perspective: 1000px;       /* 视距（透视深度）*/
    perspective-origin: center center; /* 透视原点 */
}

.element-3d {
    transform-style: preserve-3d;  /* 保持 3D 空间 */
    backface-visibility: hidden;   /* 隐藏背面 */
}

/* 3D 旋转 */
.rotate-3d {
    transform: rotateX(45deg);     /* 沿 X 轴旋转 */
    transform: rotateY(45deg);     /* 沿 Y 轴旋转 */
    transform: rotateZ(45deg);     /* 沿 Z 轴旋转 */
    transform: rotate3d(1, 1, 0, 45deg); /* 指定轴旋转 */
}

/* 3D 移动 */
.translate-3d {
    transform: translate3d(100px, 50px, 200px);
}

/* 3D 缩放 */
.scale-3d {
    transform: scale3d(1, 1, 0.5); /* Z 轴压缩 */
}

/* 卡片翻转 */
.flip-card {
    perspective: 1000px;
}

.flip-card-inner {
    transition: transform 0.6s;
    transform-style: preserve-3d;
    position: relative;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    backface-visibility: hidden;
}

.flip-card-back {
    transform: rotateY(180deg);
}

/* 3D 盒子 */
.box-3d {
    width: 200px;
    height: 200px;
    transform-style: preserve-3d;
    animation: rotateBox 10s infinite linear;
}

@keyframes rotateBox {
    from { transform: rotateX(0deg) rotateY(0deg); }
    to { transform: rotateX(360deg) rotateY(360deg); }
}
```

### Transform Origin

```css
.transform-origin-demo {
    /* 变换原点 */
    transform-origin: center center; /* 默认 */
    transform-origin: top left;
    transform-origin: bottom right;
    transform-origin: 50% 100%;      /* 底部中心 */
    transform-origin: 0 0;           /* 左上角 */
    
    /* 3D 原点 */
    transform-origin: 50% 50% 0;     /* Z 轴偏移 */
}

/* 旋转时钟指针 */
.clock-hand {
    transform-origin: bottom center;
    animation: clockRotate 60s linear infinite;
}

@keyframes clockRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

---

## CSS3 过渡与动画进阶

### Transition 高级用法

```css
/* 所有属性过渡 */
.transition-all {
    transition: all 0.3s ease;
}

/* 指定属性过渡 */
.transition-specific {
    transition-property: background-color, transform, opacity;
    transition-duration: 0.3s, 0.5s, 0.2s;
    transition-timing-function: ease-out, cubic-bezier(0.68, -0.55, 0.27, 1.55), linear;
    transition-delay: 0s, 0.1s, 0s;
}

/* 贝塞尔曲线预设 */
.easing-functions {
    /* Material Design */
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* 弹性效果 */
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    /* 缓入缓出 */
    transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
    
    /* 回弹 */
    transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

/* 可过渡的属性列表 */
.transitionable-properties {
    opacity: 1;                    /* ✅ 可过渡 */
    color: red;                    /* ✅ 可过渡 */
    background-color: red;         /* ✅ 可过渡 */
    transform: translateX(0);      /* ✅ 可过渡 */
    width: 100px;                  /* ✅ 可过渡 */
    
    display: block;               /* ❌ 不可过渡 */
    visibility: visible;          /* ❌ 不可过渡 */
}
```

### Animation 高级用法

```css
/* 关键帧定义 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    40%, 43% {
        transform: translateY(-30px);
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    }
    70% {
        transform: translateY(-15px);
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    }
    90% {
        transform: translateY(-4px);
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 应用动画 */
.animated-element {
    animation-name: fadeInUp;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;     /* 或 infinite */
    animation-direction: normal;     /* normal/reverse/alternate */
    animation-fill-mode: forwards;   /* none/forwards/backwards/both */
    animation-play-state: running;   /* running/paused */
    
    /* 简写：name duration timing-function delay iteration-count direction fill-mode play-state */
    animation: fadeInUp 0.5s ease-out forwards,
               pulse 2s ease-in-out 1s infinite alternate;
}

/* 动画暂停 */
.paused {
    animation-play-state: paused;
}

/* 加载动画 */
.loader {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f3f3;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* 打字机效果 */
.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid #333;
    animation: typing 3.5s steps(40, end),
               blink-caret 0.75s step-end infinite;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: #333; }
}
```

### Scroll-driven Animations（实验性）

```css
/* 触发滚动动画 */
.scroll-animation {
    animation: slideIn linear both;
    animation-timeline: scroll();
}

/* 视口驱动的动画 */
.viewport-animation {
    animation: fadeIn linear both;
    animation-timeline: view();
    animation-range: entry 0 cover 40%;
}
```

---

## CSS3 Grid 网格布局

### 基础 Grid

```css
.grid-container {
    display: grid;
    
    /* 定义行高 */
    grid-template-rows: 100px 200px auto;
    grid-template-rows: repeat(3, 100px);
    grid-template-rows: 100px minmax(100px, auto) 1fr;
    
    /* 定义列宽 */
    grid-template-columns: 200px 300px 200px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-columns: 100px 1fr auto;
    
    /* 行列简写 */
    grid-template: 100px 200px / 1fr 2fr 1fr;
    grid-template:
        "header header header"
        "sidebar main main"
        "footer footer footer";
        
    /* gap 间距 */
    gap: 20px;
    row-gap: 16px;
    column-gap: 24px;
    
    /* 区域命名 */
    grid-template-areas:
        "header header header"
        "nav content sidebar"
        "footer footer footer";
}
```

### Grid 项目属性

```css
.grid-item {
    /* 跨行跨列 */
    grid-column: 1 / 3;        /* 从第1线到第3线 */
    grid-column: span 2;        /* 跨2列 */
    grid-row: 1 / 3;
    grid-row: span 2;
    
    /* 区域放置 */
    grid-area: header;
    grid-area: nav;
    grid-area: content;
    grid-area: footer;
    
    /* 对齐 */
    justify-self: start | end | center | stretch;
    align-self: start | end | center | stretch;
    place-self: center center;
}
```

### 经典 Grid 布局

#### 圣杯布局

```css
.holy-grail-grid {
    display: grid;
    grid-template:
        "header header header" auto
        "nav content aside" 1fr
        "footer footer footer" auto
        / 200px 1fr 200px;
    min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: content; }
.sidebar { grid-area: aside; }
.footer { grid-area: footer; }

@media (max-width: 900px) {
    .holy-grail-grid {
        grid-template:
            "header"
            "nav"
            "content"
            "aside"
            "footer";
    }
}
```

#### 12 列网格系统

```css
.grid-system {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
}

.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.col-span-4 { grid-column: span 4; }
.col-span-6 { grid-column: span 6; }
.col-span-8 { grid-column: span 8; }
.col-span-12 { grid-column: span 12; }

.offset-1 { margin-left: calc((100% - 16px * 11) / 12); }
```

#### 自动填充网格

```css
.auto-fill-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.auto-fit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
```

### Grid vs Flexbox

| 场景 | 推荐方案 |
|------|---------|
| 一维布局（行或列） | Flexbox |
| 二维布局（行列同时） | Grid |
| 内容驱动的大小 | Flexbox (`flex-grow`) |
| 布局驱动的大小 | Grid (`grid-template`) |
| 组件内部对齐 | Flexbox |
| 整体页面布局 | Grid |
| 两栏/三栏布局 | Grid 或 Flexbox |
| 等宽卡片网格 | Grid |
| 导航栏 | Flexbox |

---

## CSS3 多列布局

### 基础多列

```css
.columns-basic {
    columns: 3;                   /* 3 列等宽 */
    column-count: 3;             /* 列数 */
    column-width: 250px;         /* 最小宽度 */
    column-gap: 40px;            /* 列间距 */
    column-rule: 2px solid #ddd; /* 分隔线 */
    column-rule-color: #ddd;
    column-rule-style: solid;
    column-rule-width: 2px;
}

/* 跨列 */
.column-span {
    column-span: all;            /* 跨所有列 */
}

/* 列内元素不折断 */
.no-break-inside {
    break-inside: avoid;         /* 不在元素内断开 */
    orphans: 3;                  /* 至少保留 3 行在断点前 */
    widows: 2;                   /* 至少保留 2 行在断点后 */
}
```

---

## CSS3 混合模式

### background-blend-mode

```css
.blend-background {
    background: url('image.jpg'), linear-gradient(45deg, red, blue);
    background-blend-mode: multiply;  /* 图片与渐变混合 */
}

.blend-modes {
    /* 正常 */
    background-blend-mode: normal;
    
    /* 变暗系列 */
    background-blend-mode: darken;    /* 取较暗 */
    background-blend-mode: multiply;  /* 正片叠底 */
    background-blend-mode: color-burn;/* 颜色加深 */
    
    /* 变亮系列 */
    background-blend-mode: lighten;   /* 取较亮 */
    background-blend-mode: screen;    /* 滤色 */
    background-blend-mode: color-dodge;/* 颜色减淡 */
    
    /* 对比系列 */
    background-blend-mode: overlay;   /* 叠加 */
    background-blend-mode: soft-light;/* 柔光 */
    background-blend-mode: hard-light;/* 强光 */
    
    /* 其他 */
    background-blend-mode: difference;/* 差值 */
    background-blend-mode: exclusion; /* 排除 */
}
```

### mix-blend-mode（元素混合）

```css
.blend-element {
    mix-blend-mode: multiply;   /* 与下层混合 */
}

/* 图片叠加效果 */
.image-overlay {
    position: relative;
}

.image-overlay img {
    width: 100%;
}

.image-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, #000);
    mix-blend-mode: multiply;
}
```

### isolation（隔离）

```css
.isolated-container {
    isolation: isolate;  /* 创建新的堆叠上下文，阻止混合 */
}
```

---

## CSS3 滤镜效果

### filter 滤镜

```css
.filter-demo {
    /* 模糊 */
    filter: blur(5px);           /* 高斯模糊 */
    
    /* 亮度 */
    filter: brightness(1.5);     /* 更亮 */
    filter: brightness(0.5);     /* 更暗 */
    
    /* 对比度 */
    filter: contrast(2);         /* 更高对比度 */
    
    /* 灰度 */
    filter: grayscale(100%);     /* 全灰度 */
    filter: grayscale(50%);      /* 半灰度 */
    
    /* 褐色（老照片效果）*/
    filter: sepia(100%);
    
    /* 色相旋转 */
    filter: hue-rotate(90deg);   /* 改变色相 */
    
    /* 反转 */
    filter: invert(100%);        /* 反转颜色 */
    
    /* 透明度 */
    filter: opacity(0.5);
    
    /* 饱和度 */
    filter: saturate(2);         /* 更鲜艳 */
    filter: saturate(0);         /* 完全去色 */
    
    /* 阴影 */
    filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.3));
    /* 注意：drop-shadow 只作用于非透明区域 */
    
    /* 组合滤镜 */
    filter: contrast(120%) brightness(110%) saturate(130%);
}
```

### backdrop-filter 背景模糊

```css
.glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);        /* 模糊 */
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: brightness(150%);  /* 亮度 */
    backdrop-filter: saturate(150%);   /* 饱和度 */
    backdrop-filter: hue-rotate(30deg);/* 色相 */
    
    /* 组合效果 */
    backdrop-filter: blur(20px) brightness(90%) saturate(140%);
    
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
}

/* 毛玻璃导航栏 */
.glass-nav {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
```

### 滤镜实战示例

```css
/* 悬浮放大效果 */
.img-zoom {
    transition: transform 0.3s ease, filter 0.3s ease;
}

.img-zoom:hover {
    transform: scale(1.1);
    filter: brightness(105%) contrast(105%);
}

/* 黑白到彩色转换 */
.img-to-color {
    filter: grayscale(100%);
    transition: filter 0.5s ease;
}

.img-to-color:hover {
    filter: grayscale(0%);
}

/* 老照片效果 */
.vintage-photo {
    filter: sepia(80%) contrast(95%) brightness(90%) saturate(85%);
}

/* Instagram 风格滤镜 */
.filter-normal { filter: none; }
.filter-clarendon {
    filter: contrast(122%) brightness(112%) saturate(135%);
}
filter-gingham {
    filter: brightness(107%) saturate(92%) contrast(94%);
}
filter-moon {
    filter: grayscale(100%) contrast(115%) brightness(108%);
}
```

---

## CSS3 背景高级特性

### 多背景

```css
.multi-bg {
    background-image:
        url('icon.png'),
        url('pattern.png'),
        url('main.jpg');
    background-position:
        right bottom,
        left top,
        center;
    background-repeat:
        no-repeat,
        repeat,
        no-repeat;
    background-size:
        64px 64px,
        auto,
        cover;
}

/* 图案组合 */
.pattern-bg {
    background-image:
        linear-gradient(45deg, transparent 49%, #333 50%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #333 50%, transparent 51%);
    background-size: 20px 20px;
    background-color: #fff;
}
```

### background-clip

```css
.clip-text {
    background: linear-gradient(to right, #667eea, #764ba2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.clip-border {
    background: linear-gradient(to right, #3498db, #e74c3c);
    border: 10px solid transparent;
    -webkit-border-image: linear-gradient(to right, #3498db, #e74c3c) 1;
    border-image: linear-gradient(to right, #3498db, #e74c3c) 1;
}

.clip-padding {
    background: linear-gradient(135deg, #667eea, #764ba2);
    background-clip: padding-box;
    border: 4px solid transparent;
}
```

### background-origin

```css
.origin-demo {
    background-image: url('bg.jpg');
    background-size: contain;
    background-repeat: no-repeat;
    background-origin: border-box;  /* 从 border 开始定位 */
    background-origin: padding-box; /* 从 padding 开始（默认）*/
    background-origin: content-box; /* 从 content 开始定位 */
}
```

### background-attachment

```css
.attachment-fixed {
    background: url('bg.jpg') center/cover fixed;
    /* 视差滚动效果 */
}

.attachment-local {
    background: url('bg.jpg') local;
    /* 相对于元素内容滚动 */
}
```

---

## CSS3 文字特效

### 文本溢出处理

```css
/* 单行省略 */
.truncate-single {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-overflow: clip;     /* 直接裁剪 */
    text-overflow: '...';    /* 自定义字符 */
}

/* 多行省略 */
.truncate-multi {
    display: -webkit-box;
    -webkit-line-clamp: 3;   /* 显示行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* line-clamp（现代语法）*/
.truncate-modern {
    line-clamp: 3;
    overflow: hidden;
}
```

### word-break 和 overflow-wrap

```css
.break-control {
    /* 断词规则 */
    word-break: normal;      /* 默认 */
    word-break: break-all;    /* 允许任意字符处断行 */
    word-break: keep-all;    /* 不断开 CJK 文字的单词 */
    
    /* 长单词处理 */
    overflow-wrap: normal;    /* 默认 */
    overflow-wrap: break-word; /* 长单词可以换行 */
    overflow-wrap: anywhere;  /* 可以在任意空白处换行 */
}
```

### 书写模式

```css
.vertical-writing {
    writing-mode: horizontal-tb; /* 水平从上到下（默认）*/
    writing-mode: vertical-lr;   /* 垂直从左到右 */
    writing-mode: vertical-rl;   /* 垂直从右到左 */
    
    /* 配合文字方向 */
    direction: ltr;             /* 从左到右 */
    direction: rtl;             /* 从右到左 */
    
    /* Unicode 双向文本 */
    unicode-bidi: bidi-override;
}
```

---

## CSS3 用户界面

### appearance

```html
<style>
.custom-input {
    appearance: none;
    -webkit-appearance: none;
    /* 完全自定义样式 */
    background: #fff;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 16px;
}

.custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.custom-checkbox:checked {
    background-color: #007bff;
    border-color: #007bff;
}
</style>
```

### user-select

```css
.select-none {
    user-select: none;          /* 不可选中文字 */
    -webkit-user-select: none;
}

.select-all {
    user-select: all;
}

.select-auto {
    user-select: auto;
}
```

### resize 和 overflow

```css
.resizable {
    resize: both;               /* 可调整大小 */
    resize: horizontal;         /* 仅水平 */
    resize: vertical;           /* 仅垂直 */
    overflow: auto;
    min-height: 100px;
    max-height: 400px;
    max-width: 400px;
}
```

### cursor 光标

```css
.cursor-default { cursor: default; }
.cursor-pointer { cursor: pointer; }
.cursor-move { cursor: move; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-wait { cursor: wait; }
.cursor-help { cursor: help; }
.cursor-text { cursor: text; }
.cursor-crosshair { cursor: crosshair; }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }
.cursor-zoom-in { cursor: zoom-in; }
.cursor-zoom-out { cursor: zoom-out; }

/* 自定义光标 */
.cursor-custom {
    cursor: url('cursor.png') 0 0, auto;
}
```

### outline 和 focus-visible

```css
/* 自定义聚焦样式 */
:focus {
    outline: none;
}

:focus-visible {
    outline: 3px solid #007bff;
    outline-offset: 2px;
}

/* 去除默认聚焦但保持键盘可访问 */
.button:focus:not(:focus-visible) {
    outline: none;
}

.button:focus-visible {
    outline: 3px solid #007bff;
}
```

### scrollbar 滚动条样式（WebKit）

```css
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
```

---

## CSS3 媒体查询增强

### 响应式断点

```css
/* 移动优先策略 */

/* Extra small (xs): < 576px */
/* 默认样式 */

/* Small (sm): >= 576px */
@media (min-width: 576px) {
    .container { max-width: 540px; }
}

/* Medium (md): >= 768px */
@media (min-width: 768px) {
    .container { max-width: 720px; }
}

/* Large (lg): >= 992px */
@media (min-width: 992px) {
    .container { max-width: 960px; }
}

/* Extra large (xl): >= 1200px */
@media (min-width: 1200px) {
    .container { max-width: 1140px; }
}

/* XXL: >= 1400px */
@media (min-width: 1400px) {
    .container { max-width: 1320px; }
}
```

### 设备特性查询

```css
/* 触摸设备 */
@media (hover: hover) {
    /* 鼠标设备 - 可以用 :hover */
}

@media (hover: none) {
    /* 触摸设备 - 避免 hover 交互 */
}

/* 指针精度 */
@media (pointer: coarse) {
    /* 触摸屏 - 增大点击区域 */
    button {
        min-height: 44px;
        min-width: 44px;
    }
}

@media (pointer: fine) {
    /* 精确指针 - 鼠标 */
}

/* 颜色方案偏好 */
@media (prefers-color-scheme: dark) {
    body {
        background: #121212;
        color: #e0e0e0;
    }
}

@media (prefers-color-scheme: light) {
    body {
        background: #ffffff;
        color: #212529;
    }
}

/* 减少动态偏好（减少动画）*/
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* 对比度偏好 */
@media (prefers-contrast: high) {
    :root {
        --border-width: 2px;
        --focus-ring: 3px solid currentColor;
    }
}

/* 打印样式 */
@media print {
    .no-print { display: none !important; }
    
    body {
        font-size: 12pt;
        line-height: 1.5;
        color: black;
        background: white;
    }
    
    a[href]::after {
        content: " (" attr(href) ")";
    }
    
    @page {
        margin: 2cm;
    }
}
```

### Container Queries（容器查询）

```css
/* 容器类型 */
.container {
    container-type: inline-size;
    container-name: my-container;
}

/* 容器查询 */
@container my-container (min-width: 700px) {
    .card {
        flex-direction: row;
    }
}

/* 简写语法 */
@container (inline-size > 500px) {
    .layout {
        display: grid;
        grid-template-columns: 200px 1fr;
    }
}

/* 容器查询长度单位 */
@container (inline-size > 500px) {
    .responsive-font {
        font-size: clamp(16px, 4cqi, 24px);
    }
}
```

---

## CSS3 自定义属性进阶

### var() 高级用法

```css
:root {
    --primary: #007bff;
    --spacing-unit: 8px;
    --radius: 4px;
}

/* 计算值 */
.calculated {
    margin: calc(var(--spacing-unit) * 2);
    border-radius: calc(var(--radius) * 2);
    width: calc(var(--spacing-unit) * 20);
}

/* 默认值链 */
.fallback-chain {
    color: var(--undefined, var(--another-undefined, var(--primary)));
}

/* 在其他函数中使用 */
.function-use {
    width: clamp(var(--min-width), var(--width), var(--max-width));
    background: linear-gradient(to right, var(--color-start), var(--color-end));
}
```

### @property 注册自定义属性

```css
@property --gradient-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
}

@property --opacity-value {
    syntax: '<number>';
    initial-value: 1;
    inherits: true;
}

.animated-gradient {
    --gradient-angle: 0deg;
    background: conic-gradient(
        from var(--gradient-angle),
        #3498db, #e74c3c, #2ecc71, #f39c12, #3498db
    );
    animation: rotateGradient 4s linear infinite;
}

@keyframes rotateGradient {
    to {
        --gradient-angle: 360deg;
    }
}
```

---

## CSS3 新单位

### 相对视口单位

```css
.viewport-units {
    width: 100vw;    /* 视口宽度 */
    height: 100vh;   /* 视口高度 */
    vmin: 100vmin;   /* vw/vh 中较小的值 */
    vmax: 100vmax;   /* vw/vh 中较大的值 */
    
    /* 大视口单位（考虑地址栏影响）*/
    width: 100svw;   /* 小视口宽度 */
    height: 100svh;  /* 小视口高度 */
    width: 100lvw;   /* 大视口宽度 */
    height: 100lvh;  /* 大视口高度 */
    width: 100dvw;   /* 动态视口宽度 */
    height: 100dvh;  /* 动态视口高度 */
}
```

### 容器查询单位

```css
.container-query-units {
    /* cqi = container inline size */
    font-size: clamp(14px, 2cqi, 24px);
    
    /* cqB = container block size */
    padding-block: clamp(16px, 2cqB, 32px);
    
    /* cqw = container query width */
    width: calc(100cqw - 40px);
    
    /* cqh = container query height */
    height: calc(100cqh - 40px);
}
```

### 数学函数

```css
.math-functions {
    /* calc() 计算 */
    width: calc(100% - 240px);
    margin: calc(var(--space) * 2);
    font-size: calc(var(--base) + 2px);
    
    /* min() 取最小值 */
    width: min(100%, 800px);
    padding: min(16px, 4vw);
    
    /* max() 取最大值 */
    min-width: max(320px, 50%);
    font-size: max(14px, 1vw);
    
    /* clamp() 限制范围 */
    font-size: clamp(14px, 2vw + 10px, 24px);
    width: clamp(320px, 80%, 1200px);
    
    /* round() 四舍五入（新）*/
    width: round(var(--value), nearest, 8px);
    
    /* mod() 取模（新）*/
    width: mod(var(--index) var(--columns)) * var(--column-width);
    
    /* rem() 取余（新）*/
    width: rem(720, var(--grid-unit));
}
```

### 颜色函数

```css
.color-functions {
    /* oklch - 更好的感知均匀色彩空间 */
    color: oklch(70% 0.2 260);
    background: oklch(90% 0.1 160);
    
    /* lab - 设备无关的颜色 */
    color: lab(70% 23 133);
    
    /* hwb - 色调-白度-黑度 */
    color: hwb(200 20% 20%);
    
    /* color-mix 混合颜色 */
    background: color-mix(in srgb, red 50%, blue 50%);
    background: color-mix(in srgb, #fff 80%, transparent);
    color: color-mix(in oklch, currentColor, white 20%);
    
    /* color-contrast 找对比色 */
    color: color-contrast(#fff vs #000, #111, #222, #333);
    
    /* lightness/darkness 调整亮度 */
    background: lightness(#007bff, 80%);
    color: darkness(#333, 20%);
}
```

---

## CSS3 最佳实践与兼容性

### 特性检测

```css
/* @supports 检测浏览器是否支持某个特性 */
@supports (display: grid) {
    .container {
        display: grid;
    }
}

@supports not (display: grid) {
    .container {
        display: flex;
        flex-wrap: wrap;
    }
}

@supports (backdrop-filter: blur(10px)) {
    .glass {
        backdrop-filter: blur(10px);
    }
}

/* 组合条件 */
@supports ((display: grid) and (gap: 1rem)) {
    /* 支持 grid 和 gap */
}

@supports (display: grid) or (display: flex) {
    /* 支持 grid 或 flex */
}
```

### 渐进增强与优雅降级

```css
/* 基础样式（所有浏览器）*/
.card {
    background: #fff;
    border: 1px solid #ddd;
}

/* 增强功能（支持的浏览器）*/
@supports (backdrop-filter: blur(10px)) {
    .card-enhanced {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
    }
}

@supports (mix-blend-mode: multiply) {
    .overlay {
        mix-blend-mode: multiply;
    }
}
```

### CSS 架构建议

```
styles/
├── base/
│   ├── reset.css          /* 重置样式 */
│   ├── typography.css     /* 排版 */
│   └── variables.css      /* CSS 变量 */
├── layout/
│   ├── grid.css           /* 网格系统 */
│   ├── header.css         /* 头部 */
│   ├── footer.css         /* 页脚 */
│   └── sidebar.css        /* 侧边栏 */
├── components/
│   ├── buttons.css        /* 按钮 */
│   ├── cards.css          /* 卡片 */
│   ├── forms.css          /* 表单 */
│   ├── tables.css         /* 表格 */
│   └── modals.css         /* 模态框 */
├── utilities/
│   ├── spacing.css        /* 间距工具 */
│   ├── visibility.css     /* 显示隐藏 */
│   └── text.css           /* 文本工具 */
└── themes/
    ├── light.css          /* 亮色主题 */
    └── dark.css           /* 暗色主题 */
```

### 性能优化清单

```css
/* ✅ 性能优化最佳实践 */

/* 1. 使用 GPU 加速属性触发合成层 */
.accelerated {
    will-change: transform;
    transform: translateZ(0);  /* 或 translate3d(0,0,0) */
}

/* 2. 避免昂贵的属性 */
/* 避免：box-shadow 大尺寸、border-radius 大数值 */
/* 避免：position: fixed + transform 同时使用 */

/* 3. 使用 containment */
.isolated {
    contain: layout style paint;
    contain: strict;  /* 所有优化 */
}

/* 4. content-visibility 跳过渲染 */
.offscreen {
    content-visibility: auto;
    contain-intrinsic-size: auto 500px;
}

.hidden-section {
    content-visibility: hidden;
}

/* 5. 使用 subgrid（如果支持）*/
.subgrid-layout {
    display: grid;
    grid-template-columns: subgrid;
}
```

### 浏览器兼容性速查

| 特性 | Chrome | Firefox | Safari | Edge | 用途 |
|------|--------|---------|--------|------|------|
| border-radius | 4+ | 3+ | 5+ | 12+ | 圆角 |
| box-shadow | 10+ | 4+ | 5+ | 12+ | 阴影 |
| gradients | 26+ | 16+ | 7+ | 12+ | 渐变 |
| transforms | 36+ | 16+ | 9+ | 12+ | 变换 |
| transitions | 26+ | 16+ | 9+ | 12+ | 过渡 |
| animations | 43+ | 16+ | 9+ | 12+ | 动画 |
| flexbox | 29+ | 28+ | 9+ | 11+ | 弹性布局 |
| grid | 57+ | 52+ | 10.1+ | 16+ | 网格布局 |
| custom properties | 49+ | 31+ | 9.1+ | 15+ | CSS变量 |
| media queries | 21+ | 4+ | 7+ | 12+ | 响应式 |
| backdrop-filter | 76+ | 103+ | 9+ | 79+ | 毛玻璃 |
| container queries | 105+ | 110+ | 16+ | 105+ | 容器查询 |
| :has() | 105+ | 121+ | 15.4+ | 105+ | 父选择器 |
| @layer | 99+ | 97+ | 15.4+ | 99+ | 层叠层 |
| :focus-visible | 86+ | 85+ | 15.4+ | 86+ | 聚焦样式 |
| prefers-color-scheme | 76+ | 67+ | 12.1+ | 79+ | 暗色模式 |

### 学习资源

- [MDN CSS3 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS3)
- [Can I Use](https://caniuse.com/) - 浏览器兼容性查询
- [CSS Tricks](https://css-tricks.com/)
- [Grid Garden](https://cssgridgarden.com/) - Grid 互动学习
- [Flexbox Froggy](https://flexboxfroggy.com/) - Flexbox 互动学习
- [CSS Reference](https://cssreference.io/) - CSS 参考

---

## 总结

### CSS3 核心知识点总结

| 分类 | 重要程度 | 核心概念 |
|------|---------|---------|
| 选择器 | ⭐⭐⭐⭐⭐ | 属性选择器、结构伪类、UI伪类、否定伪类 |
| 渐变 | ⭐⭐⭐⭐⭐ | 线性、径向、锥形渐变 |
| 阴影 | ⭐⭐⭐⭐ | box-shadow、text-shadow、多重阴影 |
| 变换 | ⭐⭐⭐⭐⭐ | 2D/3D 变换、transform-origin |
| 动画 | ⭐⭐⭐⭐⭐ | keyframes、animation 属性、贝塞尔曲线 |
| Grid | ⭐⭐⭐⭐⭐ | 网格容器、区域布局、auto-fit/fill |
| 混合模式 | ⭐⭐⭐ | background-blend-mode、mix-blend-mode |
| 滤镜 | ⭐⭐⭐⭐ | filter、backdrop-filter、毛玻璃效果 |
| 媒体查询 | ⭐⭐⭐⭐⭐ | 响应式设计、设备特性、容器查询 |
| CSS 变量 | ⭐⭐⭐⭐ | 自定义属性、主题切换、@property |
| 新单位 | ⭐⭐⭐ | 视口单位、容查单位、数学函数 |
| 颜色函数 | ⭐⭐⭐ | oklch、lab、color-mix |

### CSS3 学习路径

1. ✅ CSS 基础（盒模型、选择器、Flexbox）
2. ✅ CSS3 新特性（本文档）
3. ➡️ CSS Grid 深入
4. ➡️ CSS 预处理器（Sass/Less）
5. ➡️ CSS Modules / Tailwind CSS
6. ➡️ CSS 性能优化
7. ➡️ CSS Houdini（底层 API）

CSS3 为前端开发带来了强大的视觉表现力。掌握这些特性，你将能够创建出精美、响应式、高性能的现代网页应用。
