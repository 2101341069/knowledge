---
title: CSS 属性查询速查表
tags:
  - 前端
  - CSS
  - 速查表
  - 参考手册
  - 属性
created: 2026-04-16
---

# CSS 属性查询速查表

## 目录

1. [布局属性](#布局属性)
2. [盒模型属性](#盒模型属性)
3. [文本与字体属性](#文本与字体属性)
4. [背景与边框属性](#背景与边框属性)
5. [定位与层级属性](#定位与层级属性)
6. [Flexbox 弹性布局属性](#flexbox-弹性布局属性)
7. [Grid 网格布局属性](#grid-网格布局属性)
8. [过渡与动画属性](#过渡与动画属性)
9. [变换属性](#变换属性)
10. [颜色与透明度](#颜色与透明度)
11. [列表属性](#列表属性)
12. [表格属性](#表格属性)
13. [用户界面属性](#用户界面属性)
14. [滤镜属性](#滤镜属性)
15. [打印属性](#打印属性)
16. [其他实用属性](#其他实用属性)

---

## 布局属性

### display

**作用**：控制元素的显示类型，决定元素如何渲染和参与文档流。

| 值 | 效果 | 说明 |
|-----|------|------|
| `block` | 块级元素 | 独占一行，可设宽高（div, p, h1-h6） |
| `inline` | 内联元素 | 与同行，不可设宽高（span, a, strong） |
| `inline-block` | 内联块 | 同行排列但可设宽高（img, button） |
| `none` | 不渲染 | 完全不显示，不占空间，不影响布局 |
| `flex` | 弹性容器 | 创建 Flex 上下文 |
| `inline-flex` | 内联弹性容器 | 弹性容器但不独占一行 |
| `grid` | 网格容器 | 创建 Grid 上下文 |
| `inline-grid` | 内联网格容器 | 网格容器但不独占一行 |
| `table` | 块级表格 | 类似 `<table>` 元素 |
| `table-row` | 表格行 | 类似 `<tr>` 元素 |
| `table-cell` | 表格单元格 | 类似 `<td>` 元素 |
| `contents` | 内容占位 | 元素本身不产生盒子，内容正常显示 |
| `run-in` | 行入块 | 视上下文变为行内或块级 |

```css
/* 示例 */
.block-element { display: block; }
.inline-element { display: inline; }
.hidden { display: none; }
.flex-container { display: flex; }
.grid-container { display: grid; }
```

### visibility

**作用**：控制元素是否可见，与 display:none 不同的是仍占据空间。

| 值 | 效果 | 占空间 | 可交互 |
|-----|------|--------|--------|
| `visible` | 可见（默认） | ✅ | ✅ |
| `hidden` | 隐藏 | ✅ | ❌ |
| `collapse` | 折叠（表格专用） | ❌ | ❌ |

```css
/* 区别对比：display:none vs visibility:hidden vs opacity:0 */
/* display:none    → 不渲染、不占空间、不可交互 */
/* visibility:hidden → 渲染但不可见、占空间、不可交互 */
/* opacity:0       → 渲染但不可见、占空间、可交互（可点击）*/
```

### overflow / overflow-x / overflow-y

**作用**：控制内容超出元素盒子时的处理方式。

| 值 | 滚动条 | 超出部分 |
|-----|--------|---------|
| `visible` | 无 | 可见（溢出显示，默认） |
| `hidden` | 无 | 裁剪隐藏 |
| `scroll` | 始终显示 | 裁剪，可滚动查看 |
| `auto` | 需要时显示 | 裁剪，可滚动查看 |
| `clip` | 无 | 裁剪（不支持编程滚动） |

```css
/* 单行文本省略 */
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行文本省略（WebKit）*/
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 仅水平/垂直方向 */
.overflow-x { overflow-x: auto; }
.overflow-y { overflow-y: scroll; }
```

### overflow-wrap / word-wrap

**作用**：控制长单词或 URL 的换行行为。

| 值 | 效果 |
|-----|------|
| `normal` | 只在允许的断字点换行 |
| `break-word` | 允许在单词内换行以防止溢出 |
| `anywhere` | 允许在任何空白处换行（更激进）|

```css
.long-url {
    word-break: break-all;
    overflow-wrap: break-word;
}
```

### float

**作用**：使元素脱离正常流，向左或右浮动。

| 值 | 效果 |
|-----|------|
| `none` | 不浮动（默认） |
| `left` | 向左浮动 |
| `right` | 向右浮动 |
| `inline-start` | 向起始侧浮动 |
| `inline-end` | 向结束侧浮动 |

```css
.sidebar { float: left; width: 250px; }
.content { float: right; width: calc(100% - 270px); }

/* 清除浮动 */
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
```

### clear

**作用**：清除浮动的影响，指定元素两侧不允许有浮动元素。

| 值 | 效果 |
|-----|------|
| `none` | 允许两侧有浮动元素（默认） |
| `left` | 左侧不允许有浮动元素 |
| `right` | 右侧不允许有浮动元素 |
| `both` | 两侧都不允许有浮动元素 |

---

## 盒模型属性

### width / height

**作用**：设置元素的宽度和高度。

| 值 | 效果 |
|-----|------|
| `auto` | 浏览器自动计算（默认） |
| `<length>` | 固定值：px, cm, mm 等 |
| `<percentage>` | 百分比：相对于包含块 |
| `max-content` | 内容最大宽度 |
| `min-content` | 内容最小宽度 |
| `fit-content` | fit-content(min(max-content, stretch), max-content) |
| `available` | 可用空间 |
| `stretch` | 拉伸填满可用空间 |

```css
.box {
    width: 200px;              /* 固定宽度 */
    height: 150px;             /* 固定高度 */
    min-width: 100px;          /* 最小宽度 */
    max-width: 500px;          /* 最大宽度 */
    min-height: 50px;          /* 最小高度 */
    max-height: 300px;         /* 最大高度 */
    
    /* 响应式宽度 */
    width: clamp(320px, 80%, 1200px);
}
```

### padding / padding-* (四向)

**作用**：设置元素内容区域与边框之间的空间（内边距）。

**简写规则**：`padding: top right bottom left`（顺时针）

| 值示例 | 含义 |
|--------|------|
| `padding: 20px` | 四个方向均为 20px |
| `padding: 10px 20px` | 上下 10px，左右 20px |
| `padding: 5px 15px 25px` | 上 5px，左右 15px，下 25px |
| `padding: 1px 2px 3px 4px` | 上 1px，右 2px，下 3px，左 4px |

**独立属性**：

| 属性 | 方向 |
|------|------|
| `padding-top` | 上方内边距 |
| `padding-right` | 右方内边距 |
| `padding-bottom` | 下方内边距 |
| `padding-left` | 左方内边距 |

```css
.card {
    padding: 24px 32px;        /* 垂直 24px，水平 32px */
    padding-inline: 20px;      /* 逻辑属性：水平内边距 */
    padding-block: 12px;       /* 逻辑属性：垂直内边距 */
}
```

### margin / margin-* (四向)

**作用**：设置元素边框外部的空间（外边距），影响元素间距。

**简写规则**：同 padding（顺时针）

| 特殊值 | 效果 |
|--------|------|
| `margin: auto` | 自动计算（常用于居中） |
| `margin: 0 auto` | 水平居中 |

**重要特性 — margin 合并（折叠）**：

```css
/*
相邻块级元素的垂直 margin 会合并为较大值：
- 父子元素的 margin 可能合并
- 相邻兄弟的 margin 取较大者
- 解决方法：
  1. 给父元素加 border/padding
  2. 给父元素加 overflow: hidden
  3. 使用 flex/grid 布局
*/

p {
    margin-top: 20px;
    margin-bottom: 30px;
    /* 实际垂直间距 = max(20, 30) = 30px，不是 50px！*/
}
```

### box-sizing

**作用**：改变盒模型的宽高计算方式。

| 值 | 计算方式 | 实际宽度 = |
|-----|---------|-----------|
| `content-box`（默认） | width 只含 content | width + padding + border |
| `border-box` | width 含 content+padding+border | 就是 width 的值 |

```css
/* 推荐：全局设置为 border-box */
*, *::before, *::after {
    box-sizing: border-box;
}

/* 对比 */
.content-box-demo {
    box-sizing: content-box;
    width: 200px;
    padding: 20px;
    border: 10px solid;
    /* 实际占用：200 + 40 + 20 = 260px */
}

.border-box-demo {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 10px solid;
    /* 实际占用：200px（内容区缩小到140px）*/
}
```

### border (简写)

**作用**：设置元素边框的所有属性。

**语法**：`border: width style color`

**style 可选值**：

| 值 | 效果 | 图例说明 |
|-----|------|---------|
| `none` | 无边框 | ——— |
| `solid` | 实线 | ━━━━ |
| `dashed` | 虚线 | ┄┄┄┄ |
| `dotted` | 点线 | ⋯⋯⋯⋯ |
| `double` | 双线 | ════（两条线之间有空隙）|
| `groove` | 凹槽 | 3D 凹陷效果 |
| `ridge` | 凸起 | 3D 隆起效果 |
| `inset` | 内嵌 | 内凹 3D 效果 |
| `outset` | 外凸 | 外凸 3D 效果 |
| `hidden` | 隐藏边框 | 类似 none 但用于表格解决合并问题 |

```css
/* 各边独立设置 */
.border-demo {
    border-width: 2px;
    border-style: solid;
    border-color: #333;
    
    border-top: 4px solid #e74c3c;     /* 顶部红色粗线 */
    border-right: 1px dashed #999;     /* 右侧虚线 */
    border-bottom: none;               /* 底部无边框 */
    border-left: 2px dotted #3498db;   /* 左侧点线 */
}
```

### border-radius

**作用**：设置元素边框圆角。

**语法**：

| 写法 | 效果 |
|------|------|
| `border-radius: 8px` | 四角相同 8px 圆角 |
| `border-radius: 10px 30px` | 左上=右下 10px，右上=左下 30px |
| `border-radius: a b c d` | 左上=a, 右上=b, 右下=c, 左左=d（顺时针）|
| `border-radius: a/b` | 水平半径=a, 垂直半径=b（椭圆弧）|
| `border-radius: 50%` | 完全圆形（需正方形元素）|
| `border-radius: 9999px` | 药丸形状（按钮常用）|

```css
.circle { border-radius: 50%; }           /* 正圆形 */
.pill-btn { border-radius: 9999px; }      /* 药丸形按钮 */
.leaf { border-radius: 0 70% 0 70%; }     /* 叶子形 */
.blob { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; } /* 有机形状 */
```

### box-shadow

**作用**：给元素添加阴影效果。

**语法**：`box-shadow: offset-x offset-y blur spread color inset?`

| 参数 | 作用 | 默认值 | 说明 |
|------|------|--------|------|
| `offset-x` | X 轴偏移量 | 0 | 正→右，负→左 |
| `offset-y` | Y 轴偏移量 | 0 | 正→下，负→上 |
| `blur` | 模糊半径 | 0 | 值越大越模糊，不能为负 |
| `spread` | 扩展半径 | 0 | 正=扩大，负=收缩 |
| `color` | 阴影颜色 | 由浏览器决定 | 支持半透明 |
| `inset` | 内阴影 | 无 | 设置则改为内部阴影 |

```css
/* 基础阴影 */
.shadow { box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }

/* 内阴影（凹陷效果）*/
.inset-shadow { 
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); 
}

/* 多重阴影叠加 */
.layered-shadow {
    box-shadow:
        0 1px 3px rgba(0,0,0,0.12),
        0 1px 2px rgba(0,0,0,0.24);
}

/* 卡片悬浮提升效果 */
.elevated:hover {
    box-shadow: 
        0 14px 28px rgba(0,0,0,0.25),
        0 10px 10px rgba(0,0,0,0.22);
    transition: box-shadow 0.3s ease;
}
```

---

## 文本与字体属性

### font-family

**作用**：设置字体族（字体名称列表，按优先级从左到右尝试）。

```css
/* 系统字体栈（推荐用于正文）*/
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                 'Helvetica Neue', Arial, sans-serif;
}

/* 等宽字体栈 */
code, pre {
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code',
                 Consolas, 'Liberation Mono', Menlo, monospace;
}

/* 中文字体栈 */
body {
    font-family: "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB",
                 "Noto Sans CJK SC", "WenQuanYi Micro Hei",
                 -apple-system, sans-serif;
}
```

**通用字体族回退**：

| 族名 | 包含字体 | 适用场景 |
|------|---------|---------|
| `serif` | 宋体、Times New Roman、Georgia | 正文阅读、传统感 |
| `sans-serif` | 黑体、Arial、Helvetica | 现代、简洁 UI |
| `monospace` | Courier New、Consolas | 代码、数据对齐 |
| `cursive` | Comic Sans MS | 手写体风格 |
| `fantasy` | Papyrus | 装饰性标题 |

### font-size

**作用**：设置文字大小。

| 单位类型 | 示例 | 说明 |
|---------|------|------|
| **绝对单位** | `px`, `pt`, `cm`, `mm` | 固定大小，不受父元素影响 |
| **相对单位** | `em` | 相对于父元素字体大小 |
| **根相对** | `rem` | 相对于根元素(html)字体大小 |
| **视口单位** | `vw`, `vh` | 相对于视口尺寸 |
| **关键字** | `xx-small` ~ `xx-large` | 浏览器预定义的7个级别 |
| **百分比** | `%` | 相对于父元素字体大小 |

```css
html { font-size: 16px; }     /* 1rem = 16px */

h1 { font-size: 2rem; }       /* = 32px */
small { font-size: 0.875em; }  /* = 14px (相对于父元素) */

/* 响应式字号（推荐）*/
.responsive-text {
    font-size: clamp(14px, 2vw + 10px, 22px);  /* 最小14px，最大22px */
}
```

**字号对照表**：

| 关键字 | px 近似值 | rem(16px基准) | em(16px基准) |
|--------|----------|-------------|------------|
| `xx-small` | 9px | 0.5625rem | 0.5625em |
| `x-small` | 10px | 0.625rem | 0.625em |
| `small` | 13px | 0.8125rem | 0.8125em |
| `medium`(默认) | 16px | 1rem | 1em |
| `large` | 18px | 1.125rem | 1.125em |
| `x-large` | 24px | 1.5rem | 1.5em |
| `xx-large` | 32px | 2rem | 2em |

### font-weight

**作用**：设置文字粗细（字重）。

| 值 | 关键字 | 效果 |
|-----|--------|------|
| `100` | thin / hairline | 极细 |
| `200` | extra-light / ultra-light | 很细 |
| `300` | light | 细 |
| `400` | normal（默认） | 正常 |
| `500` | medium | 中等 |
| `600` | semi-bold / demi-bold | 半粗 |
| `700` | bold | **粗体**（最常用）|
| `800` | extra-bold / ultra-bold | 很粗 |
| `900` | black / heavy | 最粗 |

> **注意**：不是所有字体都支持全部 9 个字重级别。常见字体如 Arial 只支持 400 和 700 两档。

### font-style

**作用**：设置字体样式（倾斜）。

| 值 | 效果 | 用途 |
|-----|------|------|
| `normal` | 正常（默认） | 大部分文字 |
| `italic` | 斜体（使用字体的斜体变体）| 引用、术语 |
| `oblique` | 伪斜体（强制倾斜字形）| 字体无斜体时使用 |

```css
/* italic vs oblique 的区别 */
/* italic: 使用字体设计好的斜体字形（如 Georgia 的 Italic 版本）*/
/* oblique: 将普通字形强制倾斜一定角度（通用方案）*/
```

### line-height

**作用**：设置行高（两行文字基线之间的距离），影响文字垂直密度和视觉舒适度。

| 值 | 效果 | 推荐场景 |
|-----|------|---------|
| `normal` | 约 1.2（由字体决定）| 默认 |
| `number`(无单位) | 倍数（推荐用法）| 继承时不会出问题 |
| `<length>` | 固定值如 `24px` | 需精确控制 |
| `<percentage>` | 百分比如 `150%` | 相对于字号 |

```css
/* 推荐写法：无单位的数字 */
body { line-height: 1.5; }   /* 1.5倍行高，阅读体验好 */
.title { line-height: 1.2; }  /* 标题紧凑一点 */
.loose { line-height: 2; }     /* 松散行距 */

/* 单行文字垂直居中的经典技巧 */
.center-text {
    height: 60px;
    line-height: 60px;         /* 等于容器高度 */
}

/* 为什么推荐无单位数字？*/
/*
如果用 line-height: 1.5em 或 150%，
子元素继承的是计算后的像素值（如 24px），
导致不同字号的子元素行高相同，很丑。
用无单位数字则子元素继承 1.5 这个比例。
*/
```

**line-height 最佳实践值**：

| 场景 | 推荐值 | 说明 |
|------|--------|------|
| 正文段落 | 1.5 ~ 1.7 | 舒适阅读 |
| 标题 | 1.2 ~ 1.4 | 紧凑美观 |
| 导航链接 | 1 ~ 1.2 | 密集排列 |
| 代码块 | 1.5 | 易于阅读 |
| 按钮文字 | 1 | 单行居中配合 padding |

### letter-spacing

**作用**：设置字符之间的间距（字间距）。

```css
.tight-spacing { letter-spacing: -0.02em; }   /* 紧凑：大写标题常用 */
.normal-spacing { letter-spacing: normal; }     /* 默认 */
.wide-spacing { letter-spacing: 0.05em; }       /* 宽松：品牌名等 */
.very-wide { letter-spacing: 0.2em; }            /* 很宽松：艺术效果 */
```

### word-spacing

**作用**：设置单词之间的间距（词间距）。

```css
.narrow { word-spacing: -0.1em; }   /* 缩小词距 */
.wide { word-spacing: 0.5em; }      /* 加大词距 */
```

### color

**作用**：设置文字颜色（前景色）。

**颜色表示法大全**：

| 格式 | 示例 | 说明 |
|------|------|------|
| **关键字** | `red`, `blue`, `transparent` | 147 个命名色 |
| **十六进制** | `#ff0000`, `#f00` | RGB 各两位（可缩写为3位）|
| **RGB** | `rgb(255, 0, 0)` / `rgb(255 0 0)` | 红 绿 蓝 (0-255) |
| **RGBA** | `rgba(255, 0, 0, 0.8)` / `rgb(255 0 0 / 80%)` | 带 alpha 透明度 (0-1) |
| **HSL** | `hsl(0, 100%, 50%)` | 色相(0-360°) 饱和度(0%-100%) 明度(0%-100%) |
| **HSLA** | `hsla(240, 100%, 50%, 0.5)` | HSL + 透明度 |
| **currentColor** | `currentColor` | 继承当前元素的 color 值 |
| **inherit** | `inherit` | 从父元素继承 |

```css
.text-red { color: #e74c3c; }
.text-blue { color: rgb(52, 152, 219); }
.text-transparent { color: rgba(0, 0, 0, 0.65); }
.text-hsl { color: hsl(204, 70%, 53%); }
.icon-color { fill: currentColor; }  /* SVG 图标继承文字颜色 */
```

### text-align

**作用**：设置文本的水平对齐方式。

| 值 | 效果 | 常见用途 |
|-----|------|---------|
| `left` | 左对齐 | 默认（LTR语言）|
| `center` | 居中对齐 | 标题、图片说明 |
| `right` | 右对齐 | RTL语言、价格数字 |
| `justify` | 两端对齐 | 新闻文章正文 |
| `start` | 对齐到起始侧 | 国际化友好（RTL自适应）|
| `end` | 对齐到结束侧 | 国际化友好 |

```css
.title { text-align: center; }
.price { text-align: right; }
.article-body { text-align: justify; }
```

### text-indent

**作用**：设置首行文本缩进。

```css
.paragraph { text-indent: 2em; }    /* 首行缩进2个字符 */
.hanging-indent { 
    text-indent: -2em;               /* 悬挂缩进（除首行外的行缩进）*/
    padding-left: 2em; 
}
.no-indent { text-indent: 0; }       /* 取消缩进 */
```

### text-decoration

**作用**：设置文本装饰线条（下划线、删除线等）。

**简写**：`text-decoration: line style thickness color`

| line 值 | 效果 |
|---------|------|
| `none` | 无装饰（默认，常用于去掉链接下划线）|
| `underline` | 下划线 |
| `overline` | 上划线 |
| `line-through` | 删除线（中间横线）|
| `blink` | 闪烁（已废弃，不建议使用）|

| style 值 | 效果 |
|---------|------|
| `solid` | 实线（默认）|
| `double` | 双线 |
| `dashed` | 虚线 |
| `dotted` | 点线 |
| `wavy` | 波浪线 |

```css
a { text-decoration: none; }                    /* 去掉链接下划线 */
.error { text-decoration: underline wavy red; }  /* 红色波浪下划线（拼写错误提示）*/
.strikethrough { text-decoration: line-through; }  /* 删除线 */
.double-line { text-decoration: underline double; } /* 双线下划线 */
```

**独立子属性**：

```css
text-decoration-line: underline;
text-decoration-style: wavy;
text-decoration-color: red;
text-decoration-thickness: 2px;
text-decoration-offset: 4px;  /* 文本与装饰线的偏移距离 */
```

### text-transform

**作用**：控制文本的大小写转换。

| 值 | 效果 | 示例输入→输出 |
|-----|------|---------------|
| `none` | 不变（默认）| Hello → hello |
| `uppercase` | 全转大写 | hello world → HELLO WORLD |
| `lowercase` | 全转小写 | HELLO World → hello world |
| `capitalize` | 每个词首字母大写 | hello world → Hello World |
| `full-width` | 转为全角 | abc123 → ａｂｃ１２３ |
| `full-size-kana` | 小假名变大假名 | ぁ → あ |

```css
.brand-name { text-transform: uppercase; }
.caps-lock { text-transform: capitalize; }
.code-output { text-transform: lowercase; }
```

### text-shadow

**作用**：给文字添加阴影效果。

**语法**：`text-shadow: offset-x offset-y blur-radius color`

```css
/* 基础文字阴影 */
.basic-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }

/* 发光效果（霓虹灯）*/
.neon {
    text-shadow: 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de;
}

/* 凸起 3D 效果 */
.embossed {
    color: transparent;
    text-shadow: 1px 1px 1px #000;
}

/* 凹陷效果 */
.debossed {
    background: #666;
    color: transparent;
    text-shadow: 0 1px 1px rgba(255,255,255,0.3);
}
```

### white-space

**作用**：控制空白字符的处理方式和是否允许换行。

| 值 | 空白合并 | 换行 | 自动换行 | 适用场景 |
|-----|---------|------|---------|---------|
| `normal` | 合并 | 忽略 | 允许 | 默认，普通文本 |
| `nowrap` | 合并 | 忽略 | **禁止** | 单行省略文本 |
| `pre` | 保留 | **保留** | 禁止 | 代码块 |
| `pre-wrap` | 保留 | 保留 | 允许 | 格式化文本 |
| `pre-line` | 合并 | 保留 | 允许 | 保留换行的文本 |
| `break-spaces` | 保留 | 保留 | **允许断开空格** | 处理连续空格 |

```css
.nowrap { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.code-block { white-space: pre; }
.formatted { white-space: pre-wrap; }
```

### word-break

**作用**：控制如何在单词内部进行断行。

| 值 | 效果 |
|-----|------|
| `normal`（默认）| 在默认断点处换行 |
| `break-all` | 允许在任意字符间断行（包括 CJK 字符间）|
| `break-word` | 与 `overflow-wrap: break-word` 等价 |
| `keep-all` | **CJK 文字不断开单词**（只允许在标点处断行）|

```css
.url-text { word-break: break-all; }     /* 长URL可以折行 */
.cjk-text { word-break: keep-all; }      /* 中文不在词中断开 */
```

### text-overflow

**作用**：当文本溢出时的显示方式。

**注意**：必须配合 `white-space: nowrap` 和 `overflow: hidden` 才生效！

| 值 | 效果 |
|-----|------|
| `clip` | 直接裁切（默认）|
| `ellipsis` | 显示省略号（…）|
| `"自定义字符串"` | 自定义裁剪符号（Firefox支持较好）|

```css
/* 单行省略（完整写法）*/
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

---

## 背景与边框属性

### background (复合属性)

**作用**：设置元素背景的所有相关属性。

**完整语法**：
```
background: color image position/size repeat attachment origin clip
```
各参数顺序不限，但 position/size 必须用 `/` 分隔。

### background-color

**作用**：设置背景颜色。

```css
.bg-solid { background-color: #f5f5f5; }
.bg-transparent { background-color: transparent; }
.bg-inherit { background-color: inherit; }
```

### background-image

**作用**：设置背景图像。

```css
.single-bg { background-image: url('photo.jpg'); }

/* 多背景（逗号分隔，前面的在上层）*/
.multi-bg {
    background-image: 
        url('overlay.png'),
        linear-gradient(to bottom, rgba(0,0,0,0.5), transparent),
        url('main.jpg');
}
```

### background-position

**作用**：设置背景图像的位置。

| 值 | 效果 |
|-----|------|
| `left top` | 左上角（默认）|
| `center center` | 居中 |
| `right bottom` | 右下角 |
| `50% 50%` | 居中（等同于 center center）|
| `10px 20px` | 距左边 10px，距顶部 20px |

### background-size

**作用**：设置背景图像的大小。

| 值 | 效果 |
|-----|------|
| `auto` | 原始尺寸（默认）|
| `cover` | **完全覆盖**容器（可能裁切）— 最常用 |
| `contain` | **完整显示**在容器内（可能有留白）|
| `<length>` | 固定尺寸：`200px 300px` |
| `<percentage>` | 百分比：`100% 50%` |

### background-repeat

**作用**：设置背景图像的平铺方式。

| 值 | 效果 |
|-----|------|
| `repeat` | 水平和垂直平铺（默认）|
| `repeat-x` | 仅水平平铺 |
| `repeat-y` | 仅垂直平铺 |
| `no-repeat` | 不平铺 |
| `round` | 等比例缩放后重复（不留空隙也不裁切）|
| `space` | 等间距分布（不缩放，留空隙）|

### background-attachment

**作用**：设置背景图是否随页面滚动。

| 值 | 效果 |
|-----|------|
| `scroll` | 随页面滚动（默认）|
| `fixed` | **固定不动**（视差滚动效果）|
| `local` | 随元素内容滚动 |

### background-origin

**作用**：设置背景图的定位原点。

| 值 | 定位起点 | 效果 |
|-----|---------|------|
| `border-box` | 边框外边缘 | 背景可延伸到边框下 |
| `padding-box`（默认）| 内边距外边缘 | 背景在内边距区域内 |
| `content-box` | 内容区外边缘 | 背景仅在内容区域内 |

### background-clip

**作用**：设置背景的绘制/裁剪区域。

| 值 | 效果 |
|-----|------|
| `border-box` | 裁切到边框区域（默认）|
| `padding-box` | 裁切到内边距区域 |
| `content-box` | 裁切到内容区域 |
| **`text`** | **裁切到文字轮廓**（渐变文字效果！）|

```css
/* 渐变文字效果 */
.gradient-text {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### outline

**作用**：绘制围绕元素的轮廓线（**不影响布局**，不占空间）。

**语法**：`outline: width style color`

| 值 | 说明 |
|-----|------|
| `outline: 2px solid blue` | 蓝色实线轮廓 |
| `outline: none` | 去掉轮廓（常用于去掉 focus 的蓝色框）|
| `outline-offset: 5px` | 轮廓与边框的距离 |

> **outline 与 border 的区别**：
> - outline **不占空间**，不影响布局
> - outline **不能**分别设置四个方向的样式
> - outline **不一定**是矩形（可能跟随元素形状）
> - outline 不会像 border 一样被 border-radius 圆化

---

## 定位与层级属性

### position

**作用**：设置元素的定位方式，决定元素在文档流中的位置规则。

| 值 | 是否脱离文档流 | 定位参照物 | 典型用途 |
|-----|--------------|-----------|---------|
| `static`（默认）| 否 | 正常流 | 普通元素 |
| `relative` | **否**（原位置保留空位）| 自身原始位置 | 微调位置、作为绝对定位的参照 |
| `absolute` | **是**（完全脱流）| 最近的有定位属性的祖先元素 | 下拉菜单、弹窗、悬浮标签 |
| `fixed` | **是**（完全脱流）| **视口（viewport）** | 固定导航栏、回到顶部按钮 |
| `sticky` | **视情况而定**（粘性定位）| 滚动容器的最近祖先 | 吸顶导航、吸底操作栏 |
| `absolute` + sticky | — | 粘性约束矩形 | 复杂粘性效果 |

```css
/* relative：微调 + 作为参照物 */
.parent { position: relative; }  /* 为子元素提供定位参照 */
.offset { 
    position: relative; 
    top: 5px; left: 10px;       /* 相对自身原位置偏移 */
}

/* absolute：完全脱流，精确定位 */
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
}

/* fixed：固定在视口中 */
.fixed-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 64px;
    z-index: 999;
}

/* sticky：滚动时吸附 */
.sticky-header {
    position: sticky;
    top: 0;                      /* 滚动到距离顶部 0 时固定 */
    z-index: 100;
}

.sticky-sidebar {
    position: sticky;
    top: 80px;                   /* 距离顶部 80px 时固定 */
}
```

### top / right / bottom / left

**作用**：配合 position 使用，设置元素相对于定位参照物的偏移距离。

| 值类型 | 效果 |
|--------|------|
| `<length>` | 固定偏移：`10px` |
| `<percentage>` | 百分比偏移（相对于参照物尺寸）|
| `auto` | 由浏览器决定（默认）|
| `0` | 边界贴合 |

### z-index

**作用**：控制层叠顺序（堆叠上下文中的前后关系）。数值越大越靠前（上层）。

| 值 | 效果 |
|-----|------|
| `<integer>` | 正数在上层，负数在下层 |
| `auto`（默认）| 不创建新的层叠上下文 |

> **关键点**：z-index 只对 **设置了 position（非 static）、flex 或 grid** 的元素有效！
>
> **创建新层叠上下文的方式**：
> - `position: relative/absolute/fixed/sticky` + `z-index: 非 auto`
> - `opacity` < 1
> - `transform` 非 `none`
> - `filter` 非 `none`
> - `isolation: isolate`
> - `will-change: 非 auto`
> - `contain: paint` 等

### clip-path

**作用**：创建裁剪区域，只显示元素在区域内的部分。

```css
/* 圆形裁剪 */
.clip-circle { clip-path: circle(50% at center); }

/* 椭圆 */
.clip-ellipse { clip-path: ellipse(130px 140px at 10% 30%); }

/* 多边形（任意形状）*/
.clip-polygon { 
    clip-path: polygon(
        0% 0%, 100% 0%, 75% 100%, 25% 100%
    );  /* 五边形/梯形等 */
}

/* 内嵌矩形 */
.clip-inset { 
    clip-path: inset(20px round 10px); 
}  /* 内缩 + 圆角 */

/* 路径裁剪（SVG path）*/
.clip-path-svg {
    clip-path: path('M 0 0 L 100 0 L 50 100 Z'); /* 三角形 */
}
```

---

## Flexbox 弹性布局属性

### 容器属性（display: flex 的父元素）

#### flex-direction

**作用**：设置主轴的方向。

| 值 | 主轴方向 | 项目排列 |
|-----|---------|---------|
| `row`（默认）| 水平→ | 从左到右 |
| `row-reverse` | 水平← | 从右到左 |
| `column` | 垂直↓ | 从上到下 |
| `column-reverse` | 垂直↑ | 从下到上 |

#### flex-wrap

**作用**：设置项目是否换行。

| 值 | 效果 |
|-----|------|
| `nowrap`（默认）| 不换行，所有项目在一行 |
| `wrap` | 换行，超出容器时换到下一行 |
| `wrap-reverse` | 反向换行（从底部开始向上排）|

#### flex-flow

**作用**：`flex-direction` + `flex-wrap` 的简写。

```css
.container { flex-flow: row wrap; }
```

#### justify-content

**作用**：设置主轴上的对齐方式（项目沿主轴如何分布）。

| 值 | 效果示意 | 说明 |
|-----|---------|------|
| `flex-start` | `[item][item][item]___` | 起点（左/上）对齐（默认）|
| `flex-end` | `___[item][item][item]` | 终点（右/下）对齐 |
| `center` | `__[item][item][item]__` | 居中对齐 |
| `space-between` | `[item]_[item]_[item]` | 两端对齐，均匀分布 |
| `space-around` | `_item__item__item_` | 等间距（两侧各有一半间隔）|
| `space-evenly` | `__item__item__item__` | **完全等间距**（最均匀）|

#### align-items

**作用**：设置交叉轴上的对齐方式（项目在交叉轴上的默认对齐）。

| 值 | 效果 |
|-----|------|
| `stretch`（默认）| 拉伸填满交叉轴 |
| `flex-start` | 交叉轴起点对齐 |
| `flex-end` | 交叉轴终点对齐 |
| `center` | 交叉轴居中对齐 |
| `baseline` | 文字基线对齐 |

#### align-content

**作用**：多行/多列时，交叉轴上**行与行之间**的对齐方式。（仅当有多行时才有效！）

| 值 | 效果 |
|-----|------|
| `stretch`（默认）| 拉伸填满 |
| `flex-start` | 所有行靠起点 |
| `flex-end` | 所有行靠终点 |
| `center` | 居中 |
| `space-between` | 两端分布 |
| `space-around` | 等间距 |
| `space-evenly` | 完全等间距 |

#### gap / row-gap / column-gap

**作用**：设置项目之间的间距（替代 margin 方案，更干净）。

```css
.gap-container {
    gap: 16px;              /* 行和列统一间距 */
    row-gap: 12px;          /* 行间距（垂直）*/
    column-gap: 20px;       /* 列间距（水平）*/
}
```

### 项目属性（Flex 容器的直接子元素）

#### order

**作用**：控制项目的排列顺序（不影响 DOM 结构）。

```css
.item-first { order: -1; }   /* 排在最前面（默认是0）*/
.item-last { order: 99; }    /* 排在最后面 */
.item-swap { order: 1; }     /* 与 order: 2 的交换位置 */
```

#### flex-grow

**作用**：设置项目的放大比例（剩余空间如何分配）。值为 0 则不放大。

```css
.grow-equal { flex-grow: 1; }       /* 等分剩余空间 */
.grow-double { flex-grow: 2; }      /* 占 2 份 */
.no-grow { flex-grow: 0; }          /* 不放大（默认）*/
```

#### flex-shrink

**作用**：设置项目的缩小比例（空间不足时如何压缩）。值为 0 则不缩小。

```css
.shrink-normal { flex-shrink: 1; }   /* 允许缩小（默认）*/
.no-shrink { flex-shrink: 0; }       /* 不缩小（保持原始尺寸）*/
.shrink-fast { flex-shrink: 2; }     /* 收缩速度是其他的2倍 */
```

#### flex-basis

**作用**：设置项目在分配多余空间之前的初始大小。

| 值 | 效果 |
|-----|------|
| `auto`（默认）| 根据 content 计算大小 |
| `<length>` | 固定值：`200px` |
| `0` | 用于均分配（忽略内容大小）|
| `content` | 根据内容自动计算 |

#### flex（简写）

**语法**：`flex: grow shrink basis`

**常用组合**：

| 写法 | 等价于 | 效果 |
|------|--------|------|
| `flex: 0 1 auto` | 初始值 | 不伸缩 |
| `flex: 1` | `1 1 0` | **均分空间**（最常用）|
| `flex: auto` | `1 1 auto` | 填满剩余空间 |
| `flex: none` | `0 0 auto` | 完全不伸缩 |
| `flex: 2` | `2 1 0` | 占双份空间 |
| `flex: 0 0 200px` | — | 固定 200px，不伸缩 |

#### align-self

**作用**：覆盖容器 `align-items` 设置的单个项目对齐方式。

```css
.special-item { align-self: center; }  /* 单独居中 */
.bottom-item { align-self: flex-end; }
```

---

## Grid 网格布局属性

### 容器属性（display: grid 的父元素）

#### grid-template-columns / grid-template-rows

**作用**：定义网格的列定义和行定义。

```css
/* 固定列宽 */
.grid-a { grid-template-columns: 200px 300px 200px; }

/* 重复列 */
.grid-b { grid-template-columns: repeat(3, 1fr); }  /* 3等分 */

/* 混合 */
.grid-c { grid-template-columns: 250px 1fr 250px; }  /* 两边固定，中间自适应 */

/* 自适应填充 */
.grid-d { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

/* 自适应适配 */
.grid-e { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

/* 命名行 */
.grid-f { 
    grid-template-columns: [sidebar] 200px [main-start] 1fr [main-end aside-start] 200px [aside]; 
}
```

#### grid-template-areas

**作用**：通过命名的模板区域来定义网格布局（非常直观！）。

```css
.layout-grid {
    display: grid;
    grid-template-areas:
        "header header header"
        "nav    main   aside"
        "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

#### gap / row-gap / column-gap

**作用**：网格间距（与 Flexbox 的 gap 相同）。

```css
.grid { gap: 20px; row-gap: 16px; column-gap: 24px; }
```

#### place-items / justify-items / align-items

**作用**：Grid 容器内的所有网格项的默认对齐方式。

| 属性 | 作用 |
|------|------|
| `justify-items` | 所有网格项在**单元格内**的主轴对齐 |
| `align-items` | 所有网格项在**单元格内**的交叉轴对齐 |
| `place-items` | 以上两者的简写 |

| 值 | 效果 |
|-----|------|
| `start` | 起点 |
| `end` | 终点 |
| `center` | 居中 |
| `stretch`（默认）| 拉伸填满 |

#### place-content / justify-content / align-content

**作用**：整个网格内容在网格容器内的对齐方式（当网格总大小小于容器时）。

```css
.grid-container {
    justify-content: center;   /* 整个网格水平居中 */
    align-content: center;     /* 整个网格垂直居中 */
    place-content: center;     /* 简写 */
}
```

### Grid 项目属性

#### grid-column / grid-row

**作用**：设置项目跨越哪些网格线（即跨几列/几行）。

**语法**：`grid-column: start-line end-line` 或 `grid-column: span N`

```css
.span-2-col { grid-column: span 2; }           /* 跨 2 列 */
.span-2-row { grid-row: span 2; }              /* 跨 2 行 */
.full-width { grid-column: 1 / -1; }           /* 从第1线到最后一条线 */
.header-area { grid-column: 1 / 4; }          /* 从第1条列线到第4条列线 */
```

#### grid-area

**作用**：为项目指定命名区域，或者一次性指定行列范围。

```css
/* 方式一：引用 template-areas 中的命名区域 */
.main { grid-area: main; }

/* 方式二：直接指定范围 */
.hero {
    grid-area: 1 / 1 / 3 / 4;  /* row-start col-start row-end col-end */
}

/* 简写：area-name row-start col-start row-end col-end */
.hero {
    grid-area: hero 1 / 1 / 3 / -1;
}
```

#### place-self / justify-self / align-self

**作用**：单个网格项在其所在单元格内的对齐方式（覆盖容器的 items 设置）。

```css
.center-cell { place-self: center; }
.right-cell { justify-self: end; }
.bottom-cell { align-self: end; }
```

---

## 过渡与动画属性

### transition（过渡）

**作用**：让属性值的变化平滑过渡，而非瞬间跳变。

**语法**：`transition: property duration timing-function delay`

#### transition-property

**作用**：指定要过渡的 CSS 属性。

```css
.transition-colors {
    transition-property: background-color, color;
}
.transition-all { 
    transition-property: all;  /* 所有可过渡的属性 */
}
.transition-none {
    transition-property: none; /* 不过渡 */
}
```

**可过渡的属性**（大部分涉及"长度"、"百分比"、"颜色"、"数字"的属性都可以过渡）：✅ `color`、`background-color`、`width`、`height`、`opacity`、`transform`、`box-shadow`、`font-size`、`padding`、`margin`、`border-radius`、`filter`...

**不可过渡的属性**：❌ `display`、`visibility`（虽然可以过渡但没有中间态）、`position`、`float`、`z-index`、`font-family`

#### transition-duration

**作用**：过渡持续的时间。

```css
.fast { transition-duration: 0.15s; }   /* 快速反馈（按钮hover）*/
.normal { transition-duration: 0.3s; }   /* 一般交互（菜单展开）*/
.slow { transition-duration: 0.5s; }     /* 较慢（页面切换）*/
```

#### transition-timing-function

**作用**：过渡的速度曲线（缓动函数）。

| 值 | 曲线特点 | 适用场景 |
|-----|---------|---------|
| `linear` | 匀速直线 | 进度条 |
| `ease`（默认）| 先快后慢 | 通用 |
| `ease-in` | 渐入（慢开始）| 进入屏幕 |
| `ease-out` | 渐出（慢结束）| 离开屏幕、**最常用** |
| `ease-in-out` | 渐入渐出 | 循环动画 |
| `step-start` | 直接跳到结束 | 开关式 |
| `step-end` | 保持原值再跳 | 开关式 |
| `steps(n, start\|end)` | n 步阶梯 | 逐帧动画、打字机 |
| `cubic-bezier(x1,y1,x2,y2)` | **自定义贝塞尔曲线** | 各种弹性效果 |

**贝塞尔曲线预设**：

```css
/* Material Design 标准 */
.material { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

/* 弹性反弹 */
.bouncy { transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55); }

/* 平滑减速 */
.smooth { transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
```

> 🛠️ **工具**：[cubic-bezier.com](https://cubic-bezier.com/) 可视化调整贝塞尔曲线

#### transition-delay

**作用**：过渡延迟时间（触发后等待多久才开始过渡）。

```css
.hover-delay { 
    transition: transform 0.3s ease, opacity 0.3s ease 0.1s;
    /* opacity 延迟 0.1s 开始 */
}
```

### animation（动画）

**作用**：基于关键帧定义的复杂动画序列。

#### animation-name

**作用**：绑定 `@keyframes` 定义的关键帧名称。

```css
@keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.animated { animation-name: slideIn; }
```

#### animation-duration

**作用**：动画完成一次循环的时间。

```css
.quick { animation-duration: 0.3s; }
.normal { animation-duration: 1s; }
.slow { animation-duration: 3s; }
```

#### animation-timing-function

**作用**：每个动画周期的速度曲线（同 transition-timing-function）。

#### animation-delay

**作用**：动画延迟多久开始。

#### animation-iteration-count

**作用**：动画播放次数。

| 值 | 效果 |
|-----|------|
| `1`（默认）| 播放 1 次 |
| `n` | 播放 n 次 |
| `infinite` | **无限循环播放** |

#### animation-direction

**作用**：动画播放完一次后，下一次怎么播。

| 值 | 效果 |
|-----|------|
| `normal`（默认）| 每次从头播 |
| `reverse` | 每次反向播（从 to 到 from）|
| `alternate` | 来回播放（正向→反向→正向...）|
| `alternate-reverse` | 反向来回播 |

#### animation-fill-mode

**作用**：动画执行前后的状态如何处理。

| 值 | 效果 | 说明 |
|-----|------|------|
| `none`（默认）| 动画结束后回到初始样式 | 动画不保留最终状态 |
| `forwards` | 动画结束后保持在 **最后一帧的状态** | **最常用**（如淡入后保持可见）|
| `backwards` | 动画开始前应用第一帧的样式 | 有 delay 时避免闪烁 |
| `both` | forwards + backwards | 同时具备两者效果 |

#### animation-play-state

**作用**：动画运行或暂停。

| 值 | 效果 |
|-----|------|
| `running`（默认）| 运行中 |
| `paused` | 已暂停（可通过 JS 或 :hover 切换）|

```css
/* hover 暂停动画 */
.animated-card:hover {
    animation-play-state: paused;
}

/* JS 控制 */
element.style.animationPlayState = 'paused';
```

#### animation（简写）

**语法**：`animation: name duration timing-function delay iteration-count direction fill-mode play-state`

```css
/* 常用简写示例 */
.btn-hover-effect {
    animation: fadeIn 0.3s ease-out forwards;
}

.loading-spinner {
    animation: spin 1s linear infinite;
}

.bounce-effect {
    animation: bounce 1s cubic-bezier(0.68,-0.55,0.27,1.55) infinite alternate;
}

/* 多个动画 */
.complex-animation {
    animation: 
        slideUp 0.5s ease-out forwards,
        pulse 2s ease-in-out 0.5s infinite alternate;
}
```

---

## 变换属性

### transform

**作用**：对元素进行二维或三维变换（移动、旋转、缩放、倾斜）。
变换**不触发回流（reflow）**，只触发重绘（repaint），性能优于直接修改 top/left 等属性。

#### 2D 变换函数

| 函数 | 参数 | 效果 | 示例 |
|------|------|------|------|
| `translate(x, y)` | x/y 偏移量 | 平移 | `translate(100px, 50px)` |
| `translateX(x)` | X 偏移 | 水平平移 | `translateX(-50%)` |
| `translateY(y)` | Y 偏移 | 垂直平移 | `translateY(-50%)` |
| `scale(x, y)` | 缩放比 | 缩放 | `scale(1.2)` |
| `scaleX(x)` | X 缩放 | 水平缩放 | `scaleX(-1)` （翻转）|
| `scaleY(y)` | Y 缩放 | 垂直缩放 | `scaleY(-1)` |
| `rotate(angle)` | 旋转角度 | 旋转 | `rotate(45deg)` |
| `skew(x, y)` | 倾斜角度 | 倾斜 | `skew(15deg, 10deg)` |
| `matrix(a,b,c,d,e,f)` | 6 个矩阵值 | 任意 2D 变换 | — |

**组合变换**（顺序很重要！）：

```css
/* 先旋转再位移 ≠ 先位移再旋转 */
.transform-combo {
    transform: translate(50px, 0) rotate(45deg) scale(1.1);
}
```

**居中定位技巧**（transform 最常用的场景之一）：

```css
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  /* 回退自身宽高的50%，完美居中 */
}
```

#### 3D 变换函数

| 函数 | 效果 |
|------|------|
| `translate3d(x, y, z)` | 3D 平移 |
| `translateZ(z)` | Z 轴平移（靠近或远离观察者）|
| `scale3d(x, y, z)` | 3D 缩放 |
| `scaleZ(z)` | Z 轴缩放 |
| `rotateX(deg)` | 沿 X 轴旋转（上下翻滚）|
| `rotateY(deg)` | 沿 Y 轴旋转（左右翻页）|
| `rotateZ(deg)` | 沿 Z 轴旋转（同 rotate）|
| `rotate3d(x, y, z, angle)` | 沿自定义向量旋转 |

**3D 相关配套属性**：

```css
/* 透视（必须在父容器上设置）*/
.scene {
    perspective: 800px;              /* 视距（越小透视越强）*/
    perspective-origin: 50% 50%;     /* 透视消失点（中心）*/
}

/* 子元素 */
.card-3d {
    transform-style: preserve-3d;    /* 子元素保持 3D 空间 */
    backface-visibility: hidden;    /* 隐藏背面（卡片翻转必备）*/
}

/* 卡片翻转效果 */
.flip-card-inner {
    transform-style: preserve-3d;
    transition: transform 0.6s;
}
.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}
```

### transform-origin

**作用**：设置变换的原点（旋转中心/缩放中心）。

| 值 | 效果 |
|-----|------|
| `center center`（默认）| 元素中心点 |
| `top left` | 左上角 |
| `bottom right` | 右下角 |
| `50% 100%` | 底部中心 |
| `0 0` | 左上角（坐标原点）|
| `left bottom -50px` | 左下角向外 50px |

```css
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

## 颜色与透明度

### opacity

**作用**：设置元素的不透明度。

| 值 | 效果 |
|-----|------|
| `1` | 完全不透明（默认）|
| `0.5` | 半透明 |
| `0` | 完全透明（但仍可交互、占据空间）|

> **opacity:0 与 visibility:hidden 与 display:none 的区别**：
>
> | | 渲染 | 占空间 | 可交互 | 可被 tab 聚焦 |
> |---|------|--------|--------|--------------|
> | `opacity: 0` | ✅ | ✅ | ✅（可点击）| ✅ |
> | `visibility: hidden` | ✅ | ✅ | ❌ | ❌ |
> | `display: none` | ❌ | ❌ | ❌ | ❌ |

### mix-blend-mode

**作用**：设置元素与其下层内容的混合模式（类似 Photoshop 图层混合模式）。

| 分类 | 值 | 效果 |
|------|-----|------|
| **基础** | `normal` | 正常（默认）|
| **变暗** | `multiply` | 正片叠底（变暗）|
| | `darken` | 变暗（取较暗的）|
| | `color-burn` | 颜色加深 |
| **变亮** | `screen` | 滤色（变亮）|
| | `lighten` | 变亮（取较亮的）|
| | `color-dodge` | 颜色减淡 |
| **对比** | `overlay` | 叠加 |
| | `soft-light` | 柔光 |
| | `hard-light` | 强光 |
| **差异** | `difference` | 差值 |
| | `exclusion` | 排除 |

```css
.overlay-image {
    mix-blend-mode: multiply;  /* 图片叠加变暗 */
}
```

---

## 列表属性

### list-style (简写)

**作用**：设置列表项的样式标记。

**语法**：`list-style: type position image`

### list-style-type

**作用**：设置列表标记的类型。

| 值 | 效果 |
|-----|------|
| `disc` | ● 实心圆（默认，ul）|
| `circle` | ○ 空心圆 |
| `square` | ■ 实心方块 |
| `decimal` | 1, 2, 3...（默认，ol）|
| `decimal-leading-zero` | 01, 02, 03... |
| `lower-alpha` | a, b, c... |
| `upper-alpha` | A, B, C... |
| `lower-roman` | i, ii, iii... |
| `upper-roman` | I, II, III... |
| `none` | 无标记 |

### list-style-position

**作用**：标记在内容区内还是外部。

| 值 | 效果 |
|-----|------|
| `outside`（默认）| 标记在内容区外（标准效果）|
| `inside` | 标记在内容区内（文本环绕标记）|

### list-style-image

**作用**：用图片替换列表标记。

```css
ul.custom-marker {
    list-style-image: url('marker.svg');
    /* 或者用伪元素实现更好的控制 */
}
ul.custom-marker::marker {
    content: "★ ";
    color: gold;
}
```

---

## 表格属性

### border-collapse

**作用**：设置表格边框是否合并为单一边框。

| 值 | 效果 |
|-----|------|
| `separate`（默认）| 边框分离（每单元格独立边框）|
| `collapse` | 边框合并为单线（更干净）|

### border-spacing

**作用**：分离模式下相邻单元格边框的距离（仅 `border-collapse: separate` 时有效）。

```css
table.spaced-cells {
    border-collapse: separate;
    border-spacing: 8px 4px;  /* 水平8px，垂直4px */
}
```

### table-layout

**作用**：控制表格的列宽算法。

| 值 | 效果 |
|-----|------|
| `auto`（默认）| 自动（根据内容计算列宽，慢）|
| `fixed` | 固定（根据设定的 width 计算，快，首行渲染即可）|
| `empty-cells` | `show/hide` | 空单元格是否显示边框 |

### caption-side

**作用**：表格标题的位置。

```css
caption { caption-side: bottom; }  /* 标题在表格下方（默认上方）*/
```

---

## 用户界面属性

### cursor

**作用**：设置鼠标悬停在元素上时的光标样式。

| 值 | 光标外观 | 使用场景 |
|-----|---------|---------|
| `auto`（默认）| 浏览器自动选择 | 通用 |
| `default` | 系统默认箭头 | 普通区域 |
| `pointer` | 👆手型（手指）| **可点击元素（按钮、链接）** |
| `text` | I 型竖线 | **文本输入区域** |
| `move` | 十字箭头 | **可拖拽元素** |
| `not-allowed` | 🚫禁止符号 | **禁用状态** |
| `wait` | ⏳沙漏/转圈 | 加载中 |
| `help` | ❓问号加箭头 | 帮助信息 |
| `crosshair` | 十字准星 | 精确选取 |
| `zoom-in` | 🔍+ | 放大操作 |
| `zoom-out` | 🔍- | 缩小操作 |
| `grab` | ✊抓手（张开）| 可拖拽（未拖动时）|
| `grabbing` | ✊抓手（握紧）| 正在拖拽中 |
| `col-resize` | ↔ 水平双向箭头 | 可调列宽 |
| `row-resize` | ↕ 垂直双向箭头 | 可调行高 |
| `nwse-resize` | ↘ 对角箭头 | 可调大小（右下拖拽角）|
| `url(...)` | **自定义光标图片** | 品牌/特殊效果 |

```css
button { cursor: pointer; }
.disabled { cursor: not-allowed; }
.draggable { cursor: grab; }
.draggable:active { cursor: grabbing; }
.resize-handle { cursor: nwse-resize; }
```

### user-select

**作用**：控制用户能否选中元素内的文本。

| 值 | 效果 |
|-----|------|
| `auto`（默认）| 由浏览器决定 |
| `text` | 可以选中 |
| `none` | **不可选中**（按钮文字常用）|
| `all` | 选中时整体选中（用于复制整段代码）|
| `contain` | 只能选中该元素内的内容，不能跨元素 |

```css
button, .no-select { user-select: none; }
code { user-select: all; }
```

### appearance

**作用**：将平台原生控件样式去除（以便完全自定义）。

```css
input, button, select, textarea {
    appearance: none;
    -webkit-appearance: none;
    /* 然后可以完全自定义样式 */
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
}
```

### resize

**作用**：设置用户是否可以以及如何调整元素大小。

| 值 | 效果 |
|-----|------|
| `none`（默认）| 不可调整 |
| `both` | 水平+垂直均可调整 |
| `horizontal` | 仅水平 |
| `vertical` | 仅垂直 |
| `block` | 按照写入模式（通常等于 both）|

```css
textarea.auto-resize {
    resize: vertical;
    min-height: 100px;
    max-height: 300px;
}
```

### scrollbar-* (WebKit)

**作用**：自定义滚动条样式（Chrome/Safari/Edge 支持）。

```css
/* 整个滚动条 */
::-webkit-scrollbar { width: 8px; height: 8px; }

/* 滑轨 */
::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }

/* 滑块（可拖动的部分）*/
::-webkit-scrollbar-thumb { 
    background: #888; 
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover { background: #555; }

/* 两端按钮 */
::-webkit-scrollbar-button { display: none; }

/* 滚动角落 */
::-webkit-scrollbar-corner { background: #f1f1f1; }
```

---

## 滤镜属性

### filter

**作用**：对元素进行图形处理（模糊、色调调整、颜色变换等）。**作用于元素及其内容**（图片、文字、子元素都会被过滤）。

| 函数 | 参数 | 效果 | 示例 |
|------|------|------|------|
| `blur(radius)` | 模糊半径 | 高斯模糊 | `blur(5px)` |
| `brightness(amount)` | 亮度系数 | 亮度调节 | `brightness(1.5)` 更亮 |
| `contrast(amount)` | 对比度系数 | 对比度 | `contrast(2)` 增强 |
| `grayscale(amount)` | 0~100% | 灰度 | `grayscale(100%)` 全灰 |
| `sepia(amount)` | 0~100% | 褐色（老照片）| `sepia(100%)` |
| `hue-rotate(angle)` | 0~360deg | 色相旋转 | `hue-rotate(90deg)` |
| `invert(amount)` | 0~100% | 反相 | `invert(100%)` 底片效果 |
| `opacity(amount)` | 0~1 | 透明度 | `opacity(0.5)` |
| `saturate(amount)` | 饱和度 | 饱和度 | `saturate(2)` 更鲜艳 |
| `drop-shadow()` | 同 box-shadow | 阴影 | **只作用于非透明区域！** |

```css
/* 组合滤镜 */
.enhanced-photo {
    filter: contrast(110%) brightness(105%) saturate(120%);
}

/* 黑白转彩色过渡 */
.photo {
    filter: grayscale(100%);
    transition: filter 0.5s;
}
.photo:hover { filter: grayscale(0%); }

/* 老照片效果 */
.vintage {
    filter: sepia(80%) contrast(95%) brightness(90%) saturate(85%);
}
```

### backdrop-filter

**作用**：**对元素背后的内容**应用滤镜效果（毛玻璃效果的灵魂属性！）。

```css
/* 毛玻璃面板 */
.glass-panel {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
}

/* 其他 backdrop-filter 值 */
.backdrop-brightness { backdrop-filter: brightness(150%); }
.backdrop-grayscale { backdrop-filter: grayscale(100%); }
.backdrop-contrast { backdrop-filter: contrast(150%); }
.backdrop-invert { backdrop-filter: invert(100%); }
```

> **filter vs backdrop-filter**：
> - `filter`：作用于**元素自身及其子内容**
> - `backdrop-filter`：作用于**元素背后的区域**（透过元素看到的背景被过滤）

---

## 打印属性

| 属性 | 值 | 效果 |
|------|-----|------|
| `page-break-after` | `auto/always/avoid/left/right` | 在元素后插入分页符 |
| `page-break-before` | `auto/always/avoid/left/right` | 在元素前插入分页符 |
| `page-break-inside` | `auto/avoid` | 避免在元素内部分页 |
| `orphans` | 数字 | 页面底部最少保留的行数 |
| `widows` | 数字 | 页面顶部最少保留的行数 |
| `marks` | `crop/cross/none` | 打印裁切标记/十字标记 |

```css
@media print {
    .no-print { display: none !important; }
    h1, h2 { page-break-after: avoid; }
    table, figure { page-break-inside: avoid; }
    p { orphans: 3; widows: 2; }
    @page { margin: 2cm; size: A4; }
}
```

---

## 其他实用属性

### will-change

**作用**：提前告知浏览器某个属性即将发生变化，让浏览器提前做好优化准备（创建独立的合成层）。

```css
/* 提示浏览器 transform 会变化 */
.animated-element {
    will-change: transform;
}

/* 提示多个属性 */
.complex-animation {
    will-change: transform, opacity;
}
```

> **⚠️ 注意事项**：
> - 不要滥用！过多使用会**大量消耗内存**
> - 只在**确实知道**某元素会频繁变化时使用
> - 动画完成后及时**移除 will-change**（通过 JS 或 class 切换）
> - 对于简单的一次性动画，不需要使用

### contain

**作用**：告知浏览器元素的边界，限制浏览器的样式/布局/绘制的计算范围，从而**大幅优化性能**。

| 值 | 限制范围 |
|-----|---------|
| `none`（默认）| 无限制 |
| `size` | 尺寸变化不影响外部 |
| `layout` | 内部布局不影响外部 |
| `style` | 计数器等样式隔离 |
| `paint` | 绘制范围限制（不溢出到外部）|
| **`strict`** | layout + style + paint（**最强限制**）|
| **`content`** | size + strict（**接近 strict 但兼容更好**）|

```css
.isolated-widget {
    contain: content;
}

.offscreen-element {
    content-visibility: hidden;  /* 不渲染 */
    contain-intrinsic-size: auto 500px;  /* 预估高度 */
}
```

### content-visibility

**作用**：控制元素是否渲染其内容（性能优化的利器！）。

| 值 | 效果 | 性能收益 |
|-----|------|---------|
| `visible`（默认）| 正常渲染 | 无 |
| `hidden` | **完全不渲染**（类似 display:none 但保留渲染状态）| **极大**（适合折叠面板）|
| `auto` | 浏览器自行决定是否跳过非可视区域的渲染 | **很大**（长列表/长文章必备）|

```css
/* 长列表优化（每个 item 都跳过非可视区域的渲染）*/
.list-item {
    content-visibility: auto;
    contain-intrinsic-size: auto 200px;  /* 预估高度，防止滚动跳动 */
}

/* 折叠面板 */
.panel.collapsed {
    content-visibility: hidden;  /* 不渲染内容 */
    height: 48px;               /* 只显示标题栏 */
}
```

### pointer-events

**作用**：控制元素是否能响应鼠标/触摸事件（穿透点击！）。

| 值 | 效果 |
|-----|------|
| `auto`（默认）| 正常响应事件 |
| `none` | **穿透**！事件穿过该元素传递到下面的元素 |

```css
/* 遮罩层点击穿透关闭 */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    pointer-events: none;  /* 让点击穿透到下面 */
}
.modal-overlay.active {
    pointer-events: auto;   /* 激活时可点击（关闭按钮等）*/
}
.modal-overlay .close-btn {
    pointer-events: auto;   /* 按钮始终可点击 */
}
```

### object-fit

**作用**：控制替换元素（img/video）的内容如何适应其容器（替代旧时代的 JS 裁剪方案）。

| 值 | 效果 | 图片变形？ | 裁切？ |
|-----|------|----------|--------|
| `fill`（默认）| **拉伸填满** | ✅ 会变形 | ❌ |
| `contain` | 完整显示（可能有留白）| ❌ 不变形 | ❌ |
| `cover` | **完全覆盖**（可能裁切）| ❌ 不变形 | ✅ 可能裁切 |
| `none` | 原始尺寸 | ❌ 不变形 | ✅ 可能超出 |
| `scale-down` | contain 或 none 中较小的那个 | — | — |

```css
.avatar img {
    width: 120px;
    height: 120px;
    object-fit: cover;       /* 裁切填满（头像最佳选择）*/
    object-position: center; /* 居中裁切 */
}

.gallery img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
```

### object-position

**作用**：配合 object-fit，设置替换元素内容在盒子内的对齐位置。

```css
/* 人脸在照片上部，裁切时优先保留下方 */
.profile-pic {
    object-fit: cover;
    object-position: top center;  /* 顶部居中 */
}
```

### isolation

**作用**：创建一个新的堆叠上下文（阻止 mix-blend-mode 影响外部）。

```css
.blending-group {
    isolation: isolate;  /* 内部的混合效果不会泄漏出去 */
}
```

---

## 快速查找索引

### 按功能分类

| 功能需求 | 核心属性 |
|---------|---------|
| **居中** | `display:flex` + `justify-content:center` + `align-items:center` |
| **单行省略** | `white-space:nowrap` + `overflow:hidden` + `text-overflow:ellipsis` |
| **多行省略** | `-webkit-line-clamp:N` + `-webkit-box-orient:vertical` |
| **清除浮动** | `::after{clear:both}` 或 `overflow:hidden` |
| **固定定位** | `position:fixed` + `top/left/right/bottom` |
| **粘性吸附** | `position:sticky` + `top:0` |
| **响应式图片** | `object-fit:cover` + `width:100%` |
| **毛玻璃** | `backdrop-filter:blur(Npx)` |
| **渐变文字** | `background-clip:text` + `text-fill-color:transparent` |
| **三角形** | `border + width:0;height:0;border-color:transparent` |
| **卡片悬浮** | `box-shadow + transform:translateY(-Npx)` + `transition` |
| **文字发光** | `text-shadow:多重阴影` |
| **图片黑白** | `filter:grayscale(100%)` + 过渡 |
| **禁止选中文本** | `user-select:none` |
| **自定义光标** | `cursor:url(...) / pointer / grab` |
| **滚动条美化** | `::-webkit-scrollbar` 系列 |
| **性能优化** | `will-change` / `contain` / `content-visibility` |
| **点击穿透** | `pointer-events:none` |

### 常见问题速查

| 问题 | 解决方案 |
|------|---------|
| inline 元素无法设宽高 | 改为 `inline-block` 或 `block` |
| margin:auto 无法居中 | 确认元素不是 inline 且有明确宽度 |
| position:absolute 元素居中 | `top:50%;left:50%;transform:translate(-50%,-50%)` |
| z-index 不生效 | 确认元素有 position 非 static 或 opacity<1 |
| transition 对 display 无效 | 改用 opacity + pointer-events 或 height+overflow |
| Flex 子元素 margin 合并 | Flex 子元素不发生 margin 合并 |
| 背景色透出圆角 | 添加 `overflow:hidden` |
| 移动端 1px 边框过粗 | `border:0.5px` 或 `transform:scale(0.5)` 或 `outline` |
| iOS 点击高亮/闪烁 | `-webkit-tap-highlight-color:transparent` |
| iOS 输入框放大 | `font-size:16px`（防止 iOS 自动放大）|
| 横向滚动条出现 | `overflow-x:auto` + `overflow-y:hidden` |
| fixed 在 iOS 键盘弹出失效 | 改用 `position:absolute` + `@supports` 或 JS 方案 |

---

*本速查表涵盖 CSS 常用及进阶属性，建议收藏备用。*
*更多详细教程请参阅 [CSS教程.md](./CSS教程.md) 和 [CSS3教程.md](./CSS3教程.md)*
