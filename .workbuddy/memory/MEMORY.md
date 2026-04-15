# 长期记忆

## 项目规范

### Markdown 文档笔记属性规范

**适用范围**: `/Users/wwq/Desktop/knowledge/content/` 目录下的所有 Markdown 文档

**必须添加的 YAML Frontmatter 格式**:

```yaml
---
title: 文档标题
tags:
  - 标签1
  - 标签2
  - 标签3
created: YYYY-MM-DD
---
```

**字段说明**:

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文档标题，与一级标题保持一致 | `NGINX 完全教程` |
| `tags` | 文档标签，至少包含分类标签 | `- 技术`、`- Web服务器` |
| `created` | 创建日期，ISO 8601 格式 | `2026-04-15` |

**标签分类建议**:

- **内容类型**: 技术、工具、方法论、教程、笔记
- **技术领域**: Web服务器、数据库、编程语言、框架
- **工具类型**: Obsidian、NGINX、Docker、Git

**示例**:

```yaml
---
title: NGINX 完全教程
tags:
  - 技术
  - Web服务器
  - NGINX
  - 反向代理
  - 负载均衡
created: 2026-04-15
---
```

---

*记录时间: 2026-04-15*
