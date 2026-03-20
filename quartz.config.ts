/**
 * ============================================
 * Quartz 4 主配置文件 (quartz.config.ts)
 * ============================================
 *
 * 本文件是 Quartz 网站的核心配置文件，控制着网站的各种行为和外观。
 * 📖 完整文档: https://quartz.jzhao.xyz/configuration
 *
 * 配置分为两大部分:
 * 1. configuration - 网站基础配置（标题、主题、布局等）
 * 2. plugins - 插件配置（内容处理、渲染、输出等）
 */

import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  // ============================================
  // 第一部分：网站基础配置 (configuration)
  // ============================================
  configuration: {

    // ---------- 网站基本信息 ----------

    /** 网站标题 - 显示在浏览器标签和首页 */
    pageTitle: "我的数字花园",

    /** 标题后缀 - 跟在每个页面标题后面，如 "🌿" */
    pageTitleSuffix: "🌿",

    /**
     * 启用单页应用模式 (SPA)
     * - true: 点击链接时无刷新切换页面，体验更流畅
     * - false: 传统多页模式，每次点击重新加载
     */
    enableSPA: true,

    /**
     * 启用悬停预览
     * - true: 鼠标悬停在 [[链接]] 上时会弹出预览卡片（Obsidian 风格）
     * - false: 禁用预览
     */
    enablePopovers: true,

    /**
     * 网站分析统计
     * - null: 不启用任何统计
     * - "plausible": 使用 Plausible Analytics（隐私友好，推荐）
     * - "google": 使用 Google Analytics
     *
     * 示例: analytics: { provider: "plausible" }
     */
    analytics: null,

    /**
     * 网站语言/地区设置
     * 影响日期格式、搜索提示等本地化内容
     * 常用值: "zh-CN", "en-US", "ja-JP", "zh-TW"
     */
    locale: "zh-CN",

    /**
     * 网站部署的基础 URL（重要！必须设置正确）
     *
     * GitHub Pages 示例:
     * - 用户名.github.io 仓库: "your-username.github.io"
     * - 自定义域名: "your-domain.com"
     *
     * 本地预览时此值不影响使用
     */
    baseUrl: "your-username.github.io",

    /**
     * 忽略的文件和文件夹
     * 这些路径的内容不会被处理成页面
     * - "private": 私有笔记文件夹
     * - "templates": 笔记模板文件夹
     * - ".obsidian": Obsidian 的配置文件夹
     */
    ignorePatterns: ["private", "templates", ".obsidian"],

    /**
     * 默认日期类型
     * 控制页面显示的日期是创建日期还是修改日期
     * - "created": 显示笔记创建时间
     * - "modified": 显示最后修改时间（推荐）
     */
    defaultDateType: "modified",

    // ---------- 主题配置 (theme) ----------
    theme: {

      /**
       * 字体来源
       * - "googleFonts": 从 Google Fonts 加载（需要网络访问）
       * - "local": 使用本地字体
       */
      fontOrigin: "googleFonts",

      /**
       * 是否启用 CDN 缓存
       * 设为 true 可加速资源加载，但更新可能需要等待缓存过期
       */
      cdnCaching: true,

      // ---------- 字体配置 (typography) ----------
      typography: {
        /** 标题字体 - 用于 h1-h6、导航菜单等 */
        header: "Noto Sans SC",

        /**
         * 正文字体 - 用于文章内容
         * 推荐使用衬线体如 "Noto Serif SC"（类似书本阅读体验）
         * 也可以使用 "Noto Sans SC"（无衬线，更现代）
         */
        body: "Noto Serif SC",

        /** 代码字体 - 用于代码块和行内代码 */
        code: "JetBrains Mono",
      },

      // ---------- 颜色配置 (colors) ----------
      // 颜色使用 CSS 变量系统，方便主题切换
      colors: {

        // ---------- 浅色模式 (lightMode) ----------
        lightMode: {
          /** light: 页面背景色 */
          light: "#fefefe",

          /** lightgray: 浅灰，用于边框、分隔线等 */
          lightgray: "#f0f0f0",

          /** gray: 中灰，用于次要文字、图标等 */
          gray: "#b8b8b8",

          /** darkgray: 深灰，用于正文文字 */
          darkgray: "#4a4a4a",

          /** dark: 深色，用于标题、重要文字 */
          dark: "#1a1a1a",

          /**
           * secondary: 次要强调色（品牌色）
           * 这是你的主要品牌色，可以选择喜欢的颜色！
           * 常用推荐:
           * - 紫色系: #7c3aed, #8b5cf6, #a855f7
           * - 蓝色系: #2563eb, #3b82f6, #0ea5e9
           * - 绿色系: #10b981, #22c55e, #14b8a6
           * - 橙色系: #f97316, #fb923c, #eab308
           */
          secondary: "#7c3aed",

          /**
           * tertiary: 第三强调色
           * 通常选择 secondary 的相近色或互补色
           * 建议使用 secondary 颜色加 "99" 或 "cc" 后缀的变体
           */
          tertiary: "#c084fc",

          /**
           * highlight: 高亮背景色
           * 建议使用 secondary 的浅色透明版本
           * 格式: rgba(r, g, b, alpha)
           */
          highlight: "rgba(124, 58, 237, 0.12)",

          /** textHighlight: 文字荧光笔效果背景 */
          textHighlight: "#f3e8ff",
        },

        // ---------- 深色模式 (darkMode) ----------
        darkMode: {
          /** darkMode 的颜色配置与 lightMode 结构相同 */
          light: "#1a1a2e",
          lightgray: "#2d2d44",
          gray: "#6b6b8d",
          darkgray: "#e4e4e7",
          dark: "#f4f4f5",

          /**
           * 深色模式的 secondary 建议使用浅色版本
           * 这样在深色背景上更容易辨认
           */
          secondary: "#a78bfa",
          tertiary: "#c084fc",
          highlight: "rgba(167, 139, 250, 0.2)",
          textHighlight: "#4c1d95",
        },
      },
    },
  },

  // ============================================
  // 第二部分：插件配置 (plugins)
  // ============================================
  /**
   * Quartz 使用插件系统处理 Markdown 内容
   * 插件分为三类:
   * - transformers (转换器): 处理 Markdown 内容，提取元数据
   * - filters (过滤器): 决定哪些内容需要保留或删除
   * - emitters (发射器): 将处理后的内容输出为 HTML
   */
  plugins: {

    /**
     * Transformers (转换器)
     * 按顺序处理 Markdown 内容，提取和转换信息
     */
    transformers: [
      /**
       * FrontMatter - 解析 YAML 前置元数据
       * 支持在笔记开头使用 --- 包裹的 YAML 配置
       * 示例:
       * ---
       * title: 我的笔记
       * tags: [学习, 笔记]
       * created: 2024-01-01
       * ---
       */
      Plugin.FrontMatter(),

      /**
       * CreatedModifiedDate - 处理创建和修改日期
       * 优先级: frontmatter > git > filesystem
       * 即优先使用笔记中定义的日期，其次使用 Git 记录的日期
       */
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),

      /**
       * SyntaxHighlighting - 代码语法高亮
       * 使用 Shiki 进行代码着色，支持多种主题
       */
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",   // 浅色模式代码主题
          dark: "github-dark",    // 深色模式代码主题
        },
        keepBackground: false,     // 是否保留代码块背景色
      }),

      /**
       * ObsidianFlavoredMarkdown - Obsidian 风格 Markdown
       * 支持:
       * - [[双向链接]] 和 [[链接|别名]]
       * - ![[嵌入图片]]
       * - ^^(高亮)^^ 语法
       */
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),

      /**
       * GitHubFlavoredMarkdown - GitHub 风格 Markdown
       * 支持:
       * - 任务列表 - [ ] 和 - [x]
       * - 表格
       * - 自动链接
       */
      Plugin.GitHubFlavoredMarkdown(),

      /**
       * TableOfContents - 自动生成目录
       * 根据标题层级自动生成文章目录
       */
      Plugin.TableOfContents(),

      /**
       * CrawlLinks - 解析和转换链接
       * markdownLinkResolution: 链接解析策略
       * - "shortest": 优先使用最短路径
       * - "absolute": 使用绝对路径
       * - "relative": 使用相对路径
       */
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),

      /**
       * Description - 生成页面描述
       * 自动从内容中提取前 150 字符作为 SEO 描述
       */
      Plugin.Description(),

      /**
       * Latex - LaTeX 数学公式支持
       * renderEngine: 渲染引擎
       * - "katex": 快速轻量（推荐）
       * - "mathjax": 功能更全但较慢
       */
      Plugin.Latex({ renderEngine: "katex" }),
    ],

    /**
     * Filters (过滤器)
     * 决定哪些内容需要保留或删除
     */
    filters: [
      /**
       * RemoveDrafts - 移除草稿笔记
       * 会自动过滤掉 frontmatter 中 draft: true 的笔记
       */
      Plugin.RemoveDrafts(),
    ],

    /**
     * Emitters (发射器)
     * 将处理后的内容输出为最终的 HTML 文件
     * 这些插件决定生成哪些页面和资源
     */
    emitters: [
      /**
       * AliasRedirects - 别名重定向
       * 支持通过别名访问页面，如 /notes/old-name -> /notes/new-name
       */
      Plugin.AliasRedirects(),

      /** ComponentResources - 组件资源
       * 生成 CSS、JavaScript 等前端资源
       */
      Plugin.ComponentResources(),

      /**
       * ContentPage - 内容页面
       * 将 Markdown 文件转换为 HTML 页面
       * 这是最重要的发射器！
       */
      Plugin.ContentPage(),

      /**
       * FolderPage - 文件夹页面
       * 为每个文件夹生成索引页面
       */
      Plugin.FolderPage(),

      /**
       * TagPage - 标签页面
       * 为每个标签生成列表页面
       */
      Plugin.TagPage(),

      /**
       * ContentIndex - 内容索引
       * 生成站点地图和 RSS 订阅源
       * enableSiteMap: 生成 sitemap.xml（利于 SEO）
       * enableRSS: 生成 feed.xml（用户可以订阅）
       */
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),

      /**
       * Assets - 资源文件
       * 复制图片、视频、PDF 等非 Markdown 文件到输出目录
       */
      Plugin.Assets(),

      /**
       * Static - 静态资源
       * 复制 static 文件夹中的静态资源
       */
      Plugin.Static(),

      /**
       * Favicon - 网站图标
       * 生成网站 favicon
       */
      Plugin.Favicon(),

      /**
       * NotFoundPage - 404 页面
       * 生成 404.html，当访问不存在的页面时显示
       */
      Plugin.NotFoundPage(),

      /**
       * CustomOgImages - 自定义社交媒体预览图
       * 为每个页面生成漂亮的 Open Graph 分享图片
       *
       * 注意: 此插件会显著增加构建时间
       * 如果构建太慢，可以注释掉这一行
       */
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
