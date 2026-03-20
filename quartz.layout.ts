/**
 * ============================================
 * Quartz 4 布局配置文件 (quartz.layout.ts)
 * ============================================
 *
 * 本文件控制网站的页面布局和组件配置。
 * 📖 完整文档: https://quartz.jzhao.xyz/layout
 *
 * 页面布局分为三种类型:
 * 1. SharedLayout - 所有页面共享的布局（头部、底部等）
 * 2. defaultContentPageLayout - 单条笔记页面（如 /posts/my-note）
 * 3. defaultListPageLayout - 列表页面（如 /tags、/folders）
 */

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// ============================================
// 第一部分：共享布局 (SharedLayout)
// ============================================
/**
 * 共享布局 - 所有页面都会显示的组件
 * 包括: <head> 标签内容、页眉、页脚等
 */
export const sharedPageComponents: SharedLayout = {

  /**
   * head 组件 - HTML <head> 标签内容
   * 管理页面元数据、CSS 链接、SEO 信息等
   * 一般不需要修改
   */
  head: Component.Head(),

  /**
   * header 组件 - 页面顶部的导航栏
   * 在页面主体内容上方显示
   *
   * 示例组件:
   * - Component.PageTitle(): 显示网站标题
   * - Component.Darkmode(): 暗色模式切换按钮
   * - Component.Search(): 搜索框
   */
  header: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Darkmode()),  // 仅在移动端显示暗色模式切换
  ],

  /**
   * afterBody 组件 - 页面主体内容之后显示的组件
   * 常用于:
   * - 评论区（Comments）
   * - 相关文章推荐
   */
  afterBody: [
    // 评论区组件（需要配置 Giscus）
    // 参考: https://quartz.jzhao.xyz/features/comments
    Component.Comments({
      provider: 'giscus',
      options: {
        // ⚠️ 以下配置需要替换为你自己的 Giscus 配置
        // 获取方式: https://giscus.app
        repo: 'your-username/your-repo' as `${string}/${string}`,
        repoId: 'your-repo-id',
        category: 'Announcements',
        categoryId: 'your-category-id',
        mapping: 'pathname',           // 使用路径名作为讨论标识
        reactionsEnabled: '1',         // 启用 reactions
        emitMetadata: '0',             // 不发送讨论元数据
        inputPosition: 'bottom',       // 评论框位置: top 或 bottom
        lang: 'zh-CN',                 // 语言: zh-CN, en-US 等
      }
    }),
  ],

  /**
   * footer 组件 - 页面底部的页脚
   * 通常包含版权信息、社交链接等
   */
  footer: Component.Footer({
    links: {
      // 格式: "显示文字": "链接地址"
      GitHub: "https://github.com",
      Blog: "https://example.com",
    },
  }),
}

// ============================================
// 第二部分：内容页面布局 (ContentPageLayout)
// ============================================
/**
 * 内容页面布局 - 显示单条笔记的页面
 * 例如: /index.html, /posts/my-note.html
 *
 * 布局区域分为:
 * - beforeBody: 内容区域上方（如面包屑、标题）
 * - left: 左侧边栏（通常放导航）
 * - center: 中间主内容区（显示笔记内容，通常不需要配置）
 * - right: 右侧边栏（通常放目录、图谱等）
 *
 * 区域顺序（从上到下）:
 *
 *   ┌─────────────────────────────────────┐
 *   │            header (页眉)             │
 *   ├──────┬──────────────────────┬──────┤
 *   │      │      beforeBody       │      │
 *   │      ├──────────────────────┤      │
 *   │ left │                      │ right │
 *   │      │     center (内容)     │      │
 *   │      │                      │      │
 *   │      ├──────────────────────┤      │
 *   │      │      footer (页脚)    │      │
 *   └──────┴──────────────────────┴──────┘
 */
export const defaultContentPageLayout: PageLayout = {

  /**
   * beforeBody - 内容区域上方的组件
   * 按数组顺序从上到下显示
   */
  beforeBody: [
    // 面包屑导航 - 显示当前页面在网站中的位置
    // 条件: 非首页显示
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),

    // 文章标题
    Component.ArticleTitle(),

    // 元信息 - 显示创建日期、修改日期、作者等
    Component.ContentMeta(),

    // 标签列表 - 显示笔记的标签
    Component.TagList(),
  ],

  /**
   * left - 左侧边栏组件
   * 通常放: 页面标题、搜索、导航、文件浏览器等
   */
  left: [
    // 页面标题（在侧边栏中）
    Component.PageTitle(),

    // 移动端占位符
    Component.MobileOnly(Component.Spacer()),

    // 工具栏: 搜索 + 暗色模式 + 阅读模式
    Component.Flex({
      components: [
        {
          // 搜索框 - grow: true 表示自动填充可用空间
          Component: Component.Search(),
          grow: true,
        },
        // 暗色模式切换按钮
        { Component: Component.Darkmode() },
        // 阅读模式 - 隐藏侧边栏，只显示内容
        { Component: Component.ReaderMode() },
      ],
    }),

    // 文件浏览器 - 显示笔记文件夹结构
    // 可以折叠展开，方便导航
    Component.Explorer(),
  ],

  /**
   * right - 右侧边栏组件
   * 通常放: 目录、图谱、反向链接等
   */
  right: [
    // 知识图谱 - 用可视化方式展示笔记之间的链接关系
    Component.Graph(),

    // 目录 - DesktopOnly 表示仅在桌面端显示
    Component.DesktopOnly(Component.TableOfContents()),

    // 反向链接 - 显示所有链接到当前笔记的其他笔记
    Component.Backlinks(),
  ],
}

// ============================================
// 第三部分：列表页面布局 (ListPageLayout)
// ============================================
/**
 * 列表页面布局 - 显示多个笔记的页面
 * 例如:
 * - /tags/学习.html - 标签页面
 * - / folders/笔记.html - 文件夹页面
 * - /index.html - 首页（实际上也使用此布局）
 */
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),      // 面包屑
    Component.ArticleTitle(),     // 页面标题
    Component.ContentMeta(),     // 元信息
  ],

  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),

    // 工具栏（列表页不需要阅读模式）
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),

    Component.Explorer(),
  ],

  // 列表页面通常不需要右侧边栏
  right: [],
}

// ============================================
// 附录：常用组件说明
// ============================================
/**
 * Quartz 可用的组件列表:
 *
 * 【导航类】
 * - Component.Search(): 搜索框
 * - Component.Darkmode(): 暗色模式切换
 * - Component.ReaderMode(): 阅读模式切换
 * - Component.Explorer(): 文件夹浏览器
 * - Component.Breadcrumbs(): 面包屑导航
 *
 * 【内容显示类】
 * - Component.PageTitle(): 页面标题
 * - Component.ArticleTitle(): 文章标题
 * - Component.ContentMeta(): 元信息（日期、作者等）
 * - Component.TagList(): 标签列表
 * - Component.TableOfContents(): 目录
 * - Component.Graph(): 知识图谱
 * - Component.Backlinks(): 反向链接
 *
 * 【媒体类】
 * - Component.Footer(): 页脚
 * - Component.Comments(): 评论区
 *
 * 【工具类】
 * - Component.DesktopOnly(): 仅桌面端显示
 * - Component.MobileOnly(): 仅移动端显示
 * - Component.ConditionalRender(): 条件渲染
 * - Component.Flex(): 弹性布局容器
 * - Component.Spacer(): 占位空白
 */
