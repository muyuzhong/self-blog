# 低温笔记 LowTemp Notes

一个把知识成熟度可视化为温度的个人实验室。设计依据见 `design.md`。

## 命令

```bash
npm run dev      # 本地开发
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

## 写一篇新文章

1. 在 `src/content/writing/` 新建 `.md`,文件名即 URL(如 `ltn-025-xxx.md`)。
2. 填 frontmatter(完整字段见 `src/content/config.ts` 或 design.md §9):

```yaml
---
id: LTN-025              # 编号手工维护
title: 标题
subtitle: 副题
category: engineering    # engineering | research | buildlog | reflection
status: draft            # draft | exploring | tested | stable | deprecated
tags: [agent]
published: 2026-07-25
excerpt: 两行以内的摘要。
minutes: 10              # 阅读时长,决定结晶枝长度
featured: true           # 可选,上首页
---
```

温度、页脚站点温度、冷轨、结晶图形全部由 frontmatter 自动推导,不需要手填。

## 文章内组件

正文里用 HTML 调用四个语义组件:

```html
<div class="note idea"><div class="note-label">CORE IDEA</div>
观点。</div>
```

`idea` / `decision` / `failed` / `open` 四种。diff 块:`<div class="diff"><div class="minus">- 旧</div><div class="plus">+ 新</div></div>`。

## 其他内容

- 项目:`src/content/projects/`,字段见 LAB-001 示例。
- 日志:`src/content/log/`,一个文件一条,正文一句话。
