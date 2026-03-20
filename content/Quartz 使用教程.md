---
title: Quartz 使用教程
tags:
  - 工具
  - 网站
  - Quartz
created: 2026-03-20
---

# Quartz 使用教程

Quartz 是一个用 Hugo 驱动的数字花园解决方案，可以将你的 Obsidian 笔记轻松转换为漂亮的静态网站。

## 快速开始

### 环境要求

- Node.js v18+
- npm v9+
- Git

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/jackyzha0/quartz.git

# 安装依赖
npm install

# 初始化
npx quartz create

# 本地预览
npx quartz build --serve
```

## 主要特性

- 🚀 **静态生成** - 快速加载，SEO 友好
- 🔗 **双向链接** - 自动渲染 Obsidian 的 Wiki 链接
- 🎨 **可定制** - 完全掌控外观和功能
- 📱 **响应式** - 完美支持移动端
- 🌙 **深色模式** - 自动跟随系统主题

## 配置选项

在 `quartz.config.ts` 中可以自定义：

- 网站标题和描述
- 主题颜色
- 字体选择
- 导航组件

## 部署到 GitHub Pages

Quartz 支持一键部署到 GitHub Pages：

1. 创建 GitHub 仓库
2. 配置 GitHub Actions
3. push 代码即可自动部署

> 小贴士：记得在设置中启用 GitHub Pages 并选择正确的分支！

## 常见问题

**Q: 如何添加新笔记？**
A: 在 `content` 文件夹中添加 Markdown 文件即可。

**Q: 支持 LaTeX 吗？**
A: 支持！Quartz 原生支持数学公式渲染。

---

*相关阅读：[[Obsidian 入门指南]]*
