import type { ReactNode } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllBlogPosts, getBlogPost, getMarkdownHeadings, slugifyHeading } from "@/lib/blog"
import { BracketLabel } from "@/components/shared/BracketLabel"

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "文章未找到" }

  return {
    title: `${post.title} | 暮羽中的博客`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      tags: post.tags,
    },
  }
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textFromNode).join("")
  if (node && typeof node === "object" && "props" in node) {
    return textFromNode((node as { props?: { children?: ReactNode } }).props?.children)
  }
  return ""
}

function nextHeadingId(text: string, seen: Map<string, number>) {
  const baseId = slugifyHeading(text)
  const count = seen.get(baseId) ?? 0
  seen.set(baseId, count + 1)
  return count === 0 ? baseId : `${baseId}-${count + 1}`
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  const headings = getMarkdownHeadings(post.content)
  const topLevelHeadings = headings.filter((heading) => heading.depth === 2)
  const seenHeadingIds = new Map<string, number>()

  return (
    <main className="px-5 pb-28 pt-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[70ch]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回博客
        </Link>

        <header className="mt-12 pb-10">
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <BracketLabel hover={false} className="text-accent">
              ARTICLE
            </BracketLabel>
            {post.series ? (
              <Link href="/series" className="transition-colors hover:text-accent">
                <BracketLabel>
                  {post.series}
                  {post.seriesOrder !== undefined ? ` · ${String(post.seriesOrder).padStart(2, "0")}` : ""}
                </BracketLabel>
              </Link>
            ) : null}
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              {post.readingMinutes} MIN READ
            </span>
            {post.tags.length > 0 ? (
              <>
                <span className="text-muted-foreground/40">/</span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <h1 className="font-sans text-[2.1rem] font-bold leading-[1.2] tracking-tight text-foreground sm:text-[2.5rem]">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-6 text-[1.05rem] leading-[1.85] text-foreground/70">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-[hsla(0,0%,89%,0.18)] to-transparent" />
        </header>

        {topLevelHeadings.length > 0 ? (
          <section className="mb-14">
            <div className="mb-4 flex items-center gap-3">
              <BracketLabel hover={false} className="text-accent">
                ARTICLE INDEX
              </BracketLabel>
              <span className="h-px flex-1 bg-[hsla(0,0%,89%,0.08)]" />
            </div>
            <nav className="article-toc">
              {topLevelHeadings.map((heading, index) => (
                <a key={heading.id} href={`#${heading.id}`}>
                  <span className="toc-num">{String(index + 1).padStart(2, "0")}</span>
                  {heading.text}
                </a>
              ))}
            </nav>
          </section>
        ) : null}

        <article className="article-content">
          <MDXRemote
            source={post.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            components={{
              h2: ({ children }) => {
                const text = textFromNode(children)
                return <h2 id={nextHeadingId(text, seenHeadingIds)}>{children}</h2>
              },
              h3: ({ children }) => {
                const text = textFromNode(children)
                return <h3 id={nextHeadingId(text, seenHeadingIds)}>{children}</h3>
              },
            }}
          />
        </article>

        <footer className="mt-20 border-t border-[hsla(0,0%,89%,0.1)] pt-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {post.series ? (
              <Link
                href="/series"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                返回 {post.series}
              </Link>
            ) : null}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              回到文章列表
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
