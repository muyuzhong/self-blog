# 暮羽中个人网站 — 设计文档

## 一、项目概述

**项目名称**：暮羽中个人网站  
**定位**：All-in-One（求职 + 作品集 + 个人品牌）  
**核心调性**：极客霓虹 × 3D 沉浸 × 终端美学  
**目标受众**：技术面试官、潜在合作方、同行开发者

---

## 二、信息架构

```
首页 (Hero)
├── 3D 粒子背景 + 打字机标题
├── 一句话定位
├── 滚动指示器
│
关于我 (About)
├── 个人简介卡片（3D 倾斜效果）
├── 工作经历时间线
├── 关键数据指标（动画计数）
│
项目展示 (Projects)
├── 项目卡片网格（悬停 3D 展开）
├── 每个项目：封面图 + 技术标签 + 简介 + 链接
│
技术栈 (Tech Stack)
├── 分类展示（前端 / 后端 / 工具 / 设计）
├── 图标 + 熟练度进度条（动画填充）
│
GitHub 集成 (GitHub)
├── 贡献热力图
├── 热门仓库卡片
├── GitHub 统计数字
│
博客 (Blog)
├── 文章列表（卡片式）
├── 分类标签筛选
├── 单篇文章页（MDX 渲染）
│
联系与简历 (Contact)
├── 联系方式卡片
├── 社交链接图标
├── PDF 简历下载按钮
└── 邮件联系表单
```

---

## 三、视觉设计系统

### 3.1 色彩体系

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-primary` | `#0a0a0f` | 主背景色（深空黑） |
| `--bg-secondary` | `#12121a` | 卡片/模块背景 |
| `--bg-tertiary` | `#1a1a25` | 悬停态背景 |
| `--accent-cyan` | `#00f0ff` | 主强调色（霓虹青） |
| `--accent-purple` | `#b829ff` | 次强调色（电光紫） |
| `--accent-gradient` | `linear-gradient(135deg, #00f0ff, #b829ff)` | 渐变文字/边框 |
| `--text-primary` | `#f0f0f5` | 主文本（近白） |
| `--text-secondary` | `#8a8a9a` | 次文本（灰） |
| `--text-muted` | `#4a4a5a` | 弱化文本 |
| `--border-glow` | `rgba(0, 240, 255, 0.3)` | 发光边框 |

### 3.2 字体系统

| 层级 | 字体 | 大小 | 字重 | 用途 |
|------|------|------|------|------|
| Display | `JetBrains Mono` | 64px / 48px(mobile) | 700 | Hero 标题 |
| H1 | `JetBrains Mono` | 40px | 700 | 页面标题 |
| H2 | `Inter` | 32px | 600 | 模块标题 |
| H3 | `Inter` | 24px | 500 | 卡片标题 |
| Body | `Inter` | 16px | 400 | 正文 |
| Code | `JetBrains Mono` | 14px | 400 | 代码/标签 |
| Caption | `Inter` | 12px | 400 | 辅助文字 |

### 3.3 间距与圆角

- 基础间距单位：`8px`
- 卡片圆角：`16px`（大卡片），`12px`（小卡片），`8px`（标签）
- 页面最大宽度：`1280px`，居中
- 模块垂直间距：`120px`（桌面），`80px`（移动）

### 3.4 特效规范

- **霓虹发光**：`box-shadow: 0 0 20px rgba(0, 240, 255, 0.3)`
- **玻璃态**：`backdrop-filter: blur(12px); background: rgba(18, 18, 26, 0.8); border: 1px solid rgba(255,255,255,0.05)`
- **渐变文字**：`background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(135deg, #00f0ff, #b829ff)`

---

## 四、页面结构与交互设计

### 4.1 导航栏 (Navbar)

- **位置**：固定顶部，滚动后背景变为玻璃态
- **内容**：Logo（暮羽中）+ 链接（About / Projects / Tech / GitHub / Blog / Contact）
- **交互**：
  - 链接悬停：下划线从左到右展开（霓虹色）
  - 滚动检测：超过 100px 后 navbar 背景变为半透明毛玻璃
  - 移动端：汉堡菜单，展开时全屏遮罩 +  staggered 链接入场

### 4.2 Hero 区域

- **背景**：Three.js 粒子连线（深色背景，粒子随鼠标移动，连线距离内自动连接，颜色为 cyan→purple 渐变）
- **标题**：打字机效果逐字出现 → "你好，我是暮羽中"
- **副标题**：淡入动画 → "用代码构建数字世界的开发者"
- **CTA 按钮**："查看我的作品"（磁吸按钮效果，鼠标靠近时被吸引）
- **滚动指示器**：底部居中，上下弹跳动画

### 4.3 About 区域

- **个人卡片**：左侧头像（圆形，霓虹边框发光脉冲），右侧简介
- **工作经历**：垂直时间线，每个节点有霓虹圆点，悬停时展开详情
- **数据指标**：3 个关键数字（工作年限、项目数、代码行数），进入视口时从 0 动画计数到目标值
- **交互**：卡片整体有 3D 倾斜效果（随鼠标位置倾斜，最大 10deg）

### 4.4 Projects 区域

- **布局**：3 列网格（桌面），2 列（平板），1 列（移动）
- **卡片**：
  - 封面图（悬停时轻微放大 1.05x）
  - 技术标签（彩色小 pill）
  - 标题 + 一句话描述
  - 底部：GitHub 链接 + 演示链接图标
- **交互**：
  - 卡片悬停：3D 抬起（translateZ + shadow 增强）
  - 整体网格支持筛选（按技术栈标签筛选，筛选动画为卡片缩放/淡入淡出）

### 4.5 Tech Stack 区域

- **布局**：分类标签页（前端 / 后端 / 工具 / 其他）
- **展示**：每个技术为一个大图标 + 名称 + 熟练度条
- **熟练度条**：进入视口时从 0% 动画填充到目标百分比，填充色为渐变
- **交互**：标签切换时内容横向滑动过渡

### 4.6 GitHub 区域

- **贡献图**：模拟 GitHub 贡献热力图风格，但使用自定义配色（深空黑 → cyan）
- **热门仓库**：2-3 个卡片，显示星标数、fork 数、主要语言
- **统计数字**：Repositories / Stars / Followers，数字滚动动画
- **交互**：卡片悬停发光，链接点击新标签打开

### 4.7 Blog 区域

- **布局**：列表视图，每篇文章为一行（封面缩略图 + 标题 + 摘要 + 日期 + 标签）
- **筛选**：顶部标签云，点击筛选文章
- **交互**：
  - 文章卡片悬停：左侧出现霓虹竖线指示器
  - 点击进入文章详情页（路由过渡动画：页面淡出淡入）
- **文章详情**：
  - MDX 渲染
  - 代码块语法高亮（暗色主题，与网站风格一致）
  - 目录侧边栏（桌面端固定跟随滚动）

### 4.8 Contact 区域

- **布局**：左右分栏
- **左侧**：
  - 大标题 "一起创造点什么"
  - 邮箱地址（点击复制，toast 提示）
  - 社交图标（GitHub / Twitter / 知乎 / 掘金 等），悬停放大 + 变色
- **右侧**：
  - 联系表单（姓名、邮箱、主题、内容）
  - 提交按钮（霓虹边框，悬停填充渐变）
- **底部**：PDF 简历下载按钮（大按钮，脉冲发光动画）

### 4.9 页脚 (Footer)

- 极简设计：版权信息 + 回到顶部按钮
- 回到顶部：右下角固定圆形按钮，滚动超过 500px 出现，点击平滑滚动到顶部

---

## 五、全局交互

### 5.1 自定义光标

- **默认状态**：小圆点（8px，白色，mix-blend-mode: difference）
- **悬停可点击元素**：圆点放大为 40px 空心圆，边框为霓虹色
- **磁吸效果**：靠近按钮时，光标被轻微吸引向按钮中心

### 5.2 页面转场

- 使用 `AnimatePresence` + `framer-motion`
- 页面切换：当前页面向左滑出 + 新页面从右滑入，带透明度变化
- 持续时间：400ms，缓动：cubic-bezier(0.4, 0, 0.2, 1)

### 5.3 滚动动画

- 使用 GSAP ScrollTrigger
- 所有模块进入视口时触发入场动画（fade-up，y: 40 → 0，opacity: 0 → 1）
- 错开动画（stagger）：同一模块内的子元素依次入场，间隔 100ms

### 5.4 暗黑/亮色模式

- **默认**：暗黑模式（ Neon Terminal 风格）
- **切换按钮**：Navbar 右上角，太阳/月亮图标
- **切换动画**：全局颜色过渡 500ms，粒子背景颜色同步切换
- **亮色模式配色**：主背景 #f5f5fa，文字 #1a1a2e，强调色保持不变但降低饱和度

---

## 六、技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | SSR/SSG、路由、部署 |
| 语言 | TypeScript | 类型安全 |
| UI | React 19 | 组件化 |
| 样式 | Tailwind CSS 3.4 | 原子化 CSS |
| 组件库 | shadcn/ui | 基础 UI 组件 |
| 动画 | Framer Motion | React 动画、页面转场 |
| 滚动动画 | GSAP + ScrollTrigger | 滚动驱动动画 |
| 3D 背景 | Three.js + React Three Fiber | 粒子连线背景 |
| 图标 | Lucide React | 矢量图标 |
| 字体 | @fontsource/jetbrains-mono + @fontsource/inter | 本地字体 |
| 博客 | next-mdx-remote | MDX 渲染 |
| 代码高亮 | shiki | 语法高亮 |
| 表单 | React Hook Form + Zod | 表单验证 |
| 部署 | Vercel | 自动部署 |

---

## 七、内容占位符（暮羽中）

### 7.1 个人简介

> 你好，我是暮羽中。一名热爱创造的全栈开发者，专注于构建高性能、高颜值的数字产品。我相信好的代码应该像诗一样优雅，好的界面应该像艺术品一样令人愉悦。

### 7.2 工作经历（示例）

1. **高级前端工程师** @ 某科技公司（2022 - 至今）
   - 负责公司核心产品前端架构设计与性能优化
   - 推动前端工程化，构建组件库与 CI/CD 流程
   - 主导 Next.js 迁移项目，首屏加载时间减少 60%

2. **前端开发工程师** @ 某互联网公司（2020 - 2022）
   - 参与电商平台前后端开发
   - 实现复杂数据可视化大屏，服务百万级用户

### 7.3 项目展示（示例）

1. **Neon Dashboard**
   - 描述：一个基于 React 和 D3.js 的数据可视化仪表盘，支持实时数据流和暗黑模式
   - 技术：React, TypeScript, D3.js, WebSocket, Tailwind
   - 链接：GitHub / Demo

2. **Terminal Portfolio**
   - 描述：以终端命令行风格交互的个人作品集，支持键盘导航和命令输入
   - 技术：Next.js, XTerm.js, Node.js
   - 链接：GitHub / Demo

3. **AI Code Assistant**
   - 描述：集成 LLM 的 VS Code 插件，提供智能代码补全和重构建议
   - 技术：TypeScript, OpenAI API, VS Code Extension API
   - 链接：GitHub

### 7.4 技术栈

- **前端**：React, Next.js, TypeScript, Tailwind CSS, Three.js, D3.js
- **后端**：Node.js, Python, PostgreSQL, Redis
- **工具**：Git, Docker, Figma, Vercel, Linux
- **其他**：WebGL, WebSocket, GraphQL

### 7.5 博客文章（示例）

1. **《如何构建一个高性能的 React 应用》** - 2024-03-15
2. **《Three.js 入门：打造你的第一个 3D 场景》** - 2024-02-20
3. **《从 0 到 1：设计系统的搭建实践》** - 2024-01-10

### 7.6 联系信息

- 邮箱：contact@muyuzhong.dev（示例）
- GitHub：github.com/muyuzhong（示例）
- Twitter：@muyuzhong（示例）

---

## 八、文件结构

```
self-blog/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 首页（各 section 组合）
│   ├── layout.tsx          # 根布局（字体、主题、全局样式）
│   ├── globals.css         # 全局 CSS + Tailwind
│   ├── blog/
│   │   ├── page.tsx        # 博客列表
│   │   └── [slug]/
│   │       └── page.tsx    # 文章详情
│   └── projects/
│       └── [id]/
│           └── page.tsx    # 项目详情（可选）
│
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── sections/           # 页面大模块
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── TechStack.tsx
│   │   ├── GitHub.tsx
│   │   ├── Blog.tsx
│   │   └── Contact.tsx
│   ├── effects/            # 特效组件
│   │   ├── ParticleBackground.tsx   # Three.js 粒子背景
│   │   ├── TypewriterText.tsx       # 打字机效果
│   │   ├── CustomCursor.tsx         # 自定义光标
│   │   ├── MagneticButton.tsx       # 磁吸按钮
│   │   ├── TiltCard.tsx             # 3D 倾斜卡片
│   │   ├── AnimatedCounter.tsx      # 数字滚动
│   │   ├── GlowBorder.tsx           # 霓虹发光边框
│   │   └── PageTransition.tsx       # 页面转场
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ThemeProvider.tsx
│
├── hooks/
│   ├── useMousePosition.ts
│   ├── useInView.ts
│   └── useTheme.ts
│
├── lib/
│   ├── utils.ts            # cn() 等工具
│   ├── mdx.ts              # MDX 处理
│   └── data.ts             # 静态数据（项目、经历等）
│
├── types/
│   └── index.ts
│
├── content/
│   ├── blog/               # .mdx 博客文章
│   └── projects/           # 项目描述
│
├── public/
│   ├── images/
│   └── fonts/
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 九、开发优先级

### Phase 1：基础骨架（MVP）
- [ ] 项目初始化 + 依赖安装
- [ ] 全局样式 + 主题系统
- [ ] Navbar + Footer
- [ ] Hero 区域（含打字机效果）
- [ ] About 区域（含时间线）

### Phase 2：核心模块
- [ ] Projects 区域（卡片 + 筛选）
- [ ] Tech Stack 区域（标签页 + 进度条）
- [ ] GitHub 区域（统计 + 热力图）
- [ ] Contact 区域（表单 + 下载按钮）

### Phase 3：动效与 polish
- [ ] Three.js 粒子背景
- [ ] 自定义光标 + 磁吸按钮
- [ ] 3D 倾斜卡片
- [ ] GSAP 滚动动画
- [ ] 页面转场动画

### Phase 4：博客系统
- [ ] MDX 渲染
- [ ] 博客列表 + 详情页
- [ ] 代码高亮
- [ ] 目录导航

### Phase 5：部署
- [ ] Vercel 部署配置
- [ ] SEO 优化
- [ ] 性能优化（Lighthouse 90+）

---

*文档版本：v1.0*  
*创建日期：2026-04-30*  
*设计者：AI Agent*
