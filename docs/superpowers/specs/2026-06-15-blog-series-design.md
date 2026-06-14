# 博客合集栏目设计

## 目标

在现有博客体系中新增独立的「合集」栏目，用于将围绕同一主题持续写作的文章组织成有顺序的系列。

首个合集为「Harness 工程札记」，现有文章
`content/blog/runtime-engine-the-clockmaker.md` 作为第 01 篇。

## 设计原则

- 沿用当前博客的深蓝电子杂志风格、方角布局、细线分隔、低饱和蓝色强调和衬线标题。
- 合集信息来自文章 frontmatter，避免维护重复的手写文章列表。
- 普通博客文章保持现有行为；只有声明合集字段的文章进入合集栏目。
- 当前只需要一个合集详情入口，不为尚不存在的需求引入动态合集详情路由。

## 信息架构

新增页面：

```text
/series/    合集索引页
```

导航新增「合集」，直接链接 `/series`。

站点地图新增 `/series`。

`/series` 页面展示：

1. 页面标题与栏目说明。
2. 「Harness 工程札记」合集档案区，包含简介、当前篇数和主题标签。
3. 按 `seriesOrder` 排列的文章目录；每项展示篇序、标题、摘要、阅读时间和标签。
4. 点击目录项进入现有 `/blog/[slug]` 文章详情页。

## 数据模型

扩展博客文章 frontmatter：

```yaml
series: "Harness 工程札记"
seriesOrder: 1
```

扩展 `BlogPost` 和 `BlogPostSummary`：

```ts
series?: string
seriesOrder?: number
```

新增查询能力：

```ts
getSeriesPosts(seriesName: string): Promise<BlogPostSummary[]>
```

它从现有 `content/blog` 数据源读取文章，过滤指定合集，并按 `seriesOrder` 升序排列。没有 `seriesOrder` 的合集文章排在末尾。

合集标题、简介和展示标签属于栏目级信息，当前在 `/series` 页面中维护。文章归属和篇序只在 frontmatter 中维护。

## 文章页联动

当文章包含合集元数据时：

- 文章头部在 `ARTICLE` 标签旁展示 `Harness 工程札记 · 01`。
- 标签链接到 `/series`。
- 文章底部增加「返回 Harness 工程札记」入口。

普通文章不显示任何合集 UI。

## 视觉结构

合集页沿用当前博客归档页与首页博客区块的语言：

- 主容器使用现有页面宽度和顶部留白。
- 顶部使用 `BracketLabel` 显示 `SERIES ARCHIVE`。
- 合集档案区采用 `magazine-paper` 背景、细边框和非圆角布局。
- 大号衬线合集标题作为视觉核心。
- 文章目录使用纵向编号和细分隔线，不使用通用卡片网格。
- Hover 仅使用边框、文字颜色和轻微位移反馈。

移动端保持单列，保留合集编号、标题和主要入口，不隐藏关键内容。

## 错误与边界

- 没有合集文章时，`/series` 显示简洁空状态，不报错。
- `seriesOrder` 缺失或无效时，文章仍可展示，但排在有明确篇序的文章之后。
- 不改变普通博客的现有排序。
- 静态导出必须生成 `/series/index.html`。

## 验收标准

1. 导航中存在可访问的「合集」入口。
2. `/series` 展示「Harness 工程札记」及第 01 篇文章。
3. `runtime-engine-the-clockmaker.md` 通过 frontmatter 声明合集与篇序。
4. 首篇文章详情页展示合集标识和返回合集入口。
5. 普通文章详情页不展示合集标识。
6. `npm run build` 成功。
7. `npm run verify:site` 成功，并验证源码入口与静态导出的 `/series/index.html` 存在。
8. `sitemap.xml` 包含 `/series`。
