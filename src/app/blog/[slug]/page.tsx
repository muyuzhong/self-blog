import type { ReactNode } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
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
  const seenHeadingIds = new Map<string, number>()

  return (
    <main className="px-6 pb-24 pt-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回博客
        </Link>

        <header className="mt-12 max-w-4xl border-b border-border pb-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <BracketLabel hover={false} className="text-accent">
              MARKDOWN
            </BracketLabel>
            <BracketLabel hover={false}>{post.readingMinutes} MIN READ</BracketLabel>
            {post.tags.map((tag) => (
              <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                {tag}
              </BracketLabel>
            ))}
          </div>

          <h1 className="max-w-4xl font-sans text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-7 max-w-3xl text-lg leading-8 text-foreground/70">{post.excerpt}</p>
          ) : null}
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,760px)_220px] lg:items-start">
          <article className="min-w-0">
            <div className="prose prose-invert prose-zinc max-w-none prose-headings:scroll-mt-28 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-h2:mb-5 prose-h2:mt-16 prose-h2:border-b prose-h2:border-border prose-h2:pb-4 prose-h2:text-3xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-2xl prose-p:my-6 prose-p:text-[1.03rem] prose-p:leading-[1.95] prose-p:text-foreground/82 prose-strong:font-bold prose-strong:text-foreground prose-ul:my-7 prose-ol:my-7 prose-li:my-2 prose-li:pl-1 prose-li:text-foreground/82 prose-blockquote:my-8 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:bg-white/[0.03] prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-foreground/72 prose-a:text-accent hover:prose-a:underline prose-hr:my-12 prose-hr:border-border prose-code:rounded-none prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-pre:border prose-pre:border-border prose-pre:bg-card">
              <MDXRemote
                source={post.content}
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
            </div>
          </article>

          {headings.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28 border-l border-border pl-6">
                <BracketLabel hover={false} className="text-accent">
                  CONTENTS
                </BracketLabel>
                <nav className="mt-6 space-y-3">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block text-sm leading-relaxed text-muted-foreground transition-colors hover:text-accent ${
                        heading.depth === 3 ? "pl-4" : ""
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  )
}
