# 暮羽中个人网站 — 优化方案 v1.0

> 基于对 `D:\self-blog` 全量代码的审查（已读取 package.json / next.config.js / tailwind.config.ts / tsconfig.json / layout.tsx / page.tsx / globals.css / 全部 7 个 Section / blog/[slug] / data.ts / ParticleBackground / CustomCursor / Loader / Navbar / ThemeProvider / 全部 shared 组件 / DESIGN.md）

---

## 一、项目现状快照

| 维度 | 现状 |
|------|------|
| 框架 | Next.js 15 (App Router) + React 19 + TypeScript |
| 样式 | Tailwind CSS 3.4 + 自定义 CSS Variables |
| 动画 | GSAP + ScrollTrigger（全量滚动动画） |
| 3D/特效 | 粒子背景组件存在但**未被引用**；自定义光标已接入；Loader 存在但**未被引用** |
| 博客 | `next-mdx-remote` 已配置，但 `content/blog/` **目录为空** |
| 主题 | 自定义 ThemeProvider（Context 实现），无 next-themes |
| 表单 | 依赖已装（react-hook-form + zod），但 Contact 表单**未使用** |
| SEO | 无动态 Metadata（博客页）、无 sitemap、无 robots.txt |
| SSR | **全部 Section 标记 `"use client"`**，首屏几乎无服务端渲染 |

---

## 二、P0 — 必须修复（影响功能/性能/代码质量）

### 2.1 粒子背景与调试代码清理

**问题**：`ParticleBackground.tsx` 存在但没有任何页面/组件 import 它；组件内残留调试代码：
```ts
console.log("ParticleBackground useEffect start")
document.title = "PB-TEST"
```

**修复方案**：
- 移除调试代码
- 在 `Hero.tsx` 中接入 `<ParticleBackground />` 作为背景层，实现 DESIGN.md 期望的 "3D 粒子背景 + 打字机标题" 效果
- 如暂时不需要，也应先清理调试代码，避免生产环境污染

### 2.2 移除无意义的 `"use client"` 标记

**问题**：`BracketLabel`、`SectionLabel`、`VerticalText` 等纯展示组件全部标记为 `"use client"`，但它们没有使用任何客户端 API（state/effect/event/DOM）。这会导致：
- 本可服务端渲染的内容被迫在客户端渲染
- 增加 bundle size 和 hydration 负担

**修复方案**：
- 移除这些组件的 `"use client"` 指令
- `cn()` 工具函数在服务端运行完全没问题

### 2.3 抽象重复的 GSAP 动画逻辑

**问题**：`About.tsx`、`Projects.tsx`、`TechStack.tsx`、`Blog.tsx`、`Contact.tsx` 中均包含几乎完全相同的 boilerplate：
```ts
gsap.registerPlugin(ScrollTrigger)
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(".animate-item", {
      scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      y: 40, opacity: 0, duration: 0.8, stagger: 0.1
    })
  }, containerRef)
  return () => ctx.revert()
}, [])
```

**修复方案**：
- 新建 `src/hooks/useScrollAnimation.ts`：
```ts
export function useScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  options?: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars }
)
```
- 各 Section 统一调用该 hook，行数可从 ~20 行减少到 2 行

### 2.4 博客详情页添加动态 Metadata

**问题**：`blog/[slug]/page.tsx` 没有 export `generateMetadata`，所有文章共享相同的 `<title>` 和 `<meta description>`，SEO 极差。

**修复方案**：
```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  return {
    title: post ? `${post.title} | 暮羽中的博客` : "文章未找到",
    description: post?.excerpt,
    openGraph: { title: post?.title, description: post?.excerpt },
  }
}
```

### 2.5 CustomCursor 性能优化

**问题**：`mousemove` 事件直接调用 `setPos()`，鼠标每移动 1px 就触发一次 React re-render。`MutationObserver` 监听整个 `document.body` 的 subtree 变更。

**修复方案**：
- 使用 `useRef` 获取 DOM 节点，通过 `requestAnimationFrame` 直接操作 `transform`：
```ts
const cursorRef = useRef<HTMLDivElement>(null)
useEffect(() => {
  let raf: number
  const move = (e: MouseEvent) => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      cursorRef.current?.style.setProperty("transform", `translate(${e.clientX}px, ${e.clientY}px)`)
    })
  }
  window.addEventListener("mousemove", move)
  return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", move) }
}, [])
```
- 完全避免 re-render，CPU 占用大幅下降

---

## 三、P1 — 强烈建议（提升 UX / SEO / 代码规范）

### 3.1 接入 Loader 加载动画

**问题**：`Loader.tsx` 存在且实现了精美的 `[暮_羽_中]` + `[xx%]` 加载器，但 `layout.tsx` 中没有使用。

**建议**：在 `layout.tsx` 中包裹 `<Loader>`，给首屏增加仪式感，与设计调性一致。

### 3.2 Contact 表单接入 react-hook-form + zod

**问题**：package.json 已安装依赖，但 `Contact.tsx` 使用原生 `useState` 管理表单，无验证逻辑。

**建议**：
```ts
const formSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符"),
  email: z.string().email("请输入有效的邮箱"),
  message: z.string().min(10, "留言至少 10 个字符"),
})
```
- 提供实时验证、提交 loading 状态、成功/失败反馈 toast

### 3.3 添加博客示例文章

**问题**：`content/blog/` 目录为空，`blog/[slug]/page.tsx` 从文件系统读取 `.mdx` 文件，但无文件可读取。

**建议**：
- 创建 `content/blog/threejs-particle-system.mdx`
- 创建 `content/blog/micro-frontend-evolution.mdx`
- 与 `data.ts` 中的 `blogPosts` 数据对齐
- 确保 `generateStaticParams` 能正常生成静态路径

### 3.4 添加 SEO 基础设施

**建议**：
1. **sitemap.xml**：静态导出时可使用 `next-sitemap` 包，或在 `next.config.js` 中配置自定义生成
2. **robots.txt**：`public/robots.txt`
   ```
   User-agent: *
   Allow: /
   Sitemap: https://your-domain.com/sitemap.xml
   ```
3. **404 页面**：`src/app/not-found.tsx`

### 3.5 Navbar 移动端菜单增加动画

**问题**：当前移动端菜单只是简单的条件渲染，无过渡动画。

**建议**：使用 GSAP 或简单的 CSS transition 为菜单添加 `height`/ `opacity` 过渡，提升质感。

### 3.6 提升 SSR 覆盖率

**问题**：所有 Section 都是 `"use client"`，导致整个页面无 SSR。

**建议**：将 Section 拆分为 "服务端外壳 + 客户端动画包装"。例如：
```tsx
// AboutSection.tsx (Server Component)
export function AboutSection() {
  return (
    <section id="about">
      <SectionLabel number="02" title="About" />
      <AboutContent />
    </section>
  )
}

// AboutContent.tsx (Client Component, only contains animation logic)
"use client"
export function AboutContent() { ... }
```
- 这样 SectionLabel、静态文本等可由服务端直接渲染，只把动画逻辑保留在客户端

---

## 四、P2 — 可以改进（锦上添花）

### 4.1 引入 Framer Motion

**现状**：DESIGN.md 将 Framer Motion 列为核心技术栈，但项目未安装也未使用。

**建议**：
- 安装 `framer-motion`
- 用于简单的入场动画（替代部分 GSAP boilerplate）
- 用于页面转场（`AnimatePresence`）
- 用于移动端菜单展开动画

### 4.2 考虑使用 `next-themes` 替代自定义 ThemeProvider

**现状**：自定义 ThemeProvider 在页面加载时可能出现短暂的主题闪烁（FOUC）。

**建议**：`next-themes` 通过注入内联脚本在 hydration 前设置主题，完全消除闪烁。

### 4.3 添加项目详情页 (`projects/[id]`)

**现状**：DESIGN.md 文件结构中有 `app/projects/[id]/page.tsx`，但实际不存在。

**建议**：为每个项目创建独立的详情页，展示更详细的技术栈、截图、挑战与解决方案。

### 4.4 添加 GitHub 统计区域

**现状**：DESIGN.md Phase 2 期望有 "GitHub 区域（统计 + 热力图）"。

**建议**：使用 GitHub API 获取用户统计，展示贡献热力图、语言分布等（注意静态导出时的数据获取策略）。

### 4.5 博客代码高亮

**现状**：`shiki` 已安装，但 `blog/[slug]/page.tsx` 中没有配置代码高亮。

**建议**：在 MDX 渲染时为 `<pre><code>` 块添加 Shiki 语法高亮。

### 4.6 字体本地化

**现状**：layout.tsx 使用 Google Fonts CDN (`fonts.googleapis.com`)。

**建议**：DESIGN.md 期望使用 `@fontsource/jetbrains-mono` + `@fontsource/inter` 本地字体，减少外部依赖、提升加载稳定性。

---

## 五、执行优先级建议

| 批次 | 内容 | 预期效果 |
|------|------|----------|
| **第一批（本周）** | P0 全部（清理调试代码、移除多余 use client、抽 hook、动态 metadata、cursor 性能） | 消除生产隐患，减少 ~30% 重复代码，提升 Core Web Vitals |
| **第二批（下周）** | P1 全部（Loader、表单验证、博客文章、SEO 基础设施、SSR 拆分） | 功能完整、SEO 就绪、用户体验大幅提升 |
| **第三批（后续）** | P2 按需（Framer Motion、项目详情页、GitHub 区域、代码高亮） | 设计还原度 100%，达到 DESIGN.md 完整期望 |

---

## 六、关于 codex 的使用情况

尝试了多次通过 codex CLI (`codex exec`) 对项目进行自动化分析，但遇到以下阻碍：
1. 项目目录非 Git 仓库，`--skip-git-repo-check` 后调用 OpenAI API 超时
2. codex CLI 在 Windows 环境下的非交互式执行稳定性有限

**决策**：放弃 codex CLI 的自动化分析路径，改为人工全量代码审查 + 结构化输出优化方案。如果后续需要 codex 协助执行具体的代码重构（如批量替换重复 GSAP 逻辑），可以在 Git 初始化后再次尝试，或直接使用我基于当前审查结果给出的具体代码 patch。

---

*方案制定日期：2026-05-01*  
*基于代码版本：当前工作目录全量文件*