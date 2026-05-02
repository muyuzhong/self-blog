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
    <main className="px-5 pb-24 pt-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[70ch]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回博客
        </Link>

        <header className="mt-10 border-b border-border pb-9">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <BracketLabel hover={false} className="text-accent">
              MARKDOWN
            </BracketLabel>
            <BracketLabel hover={false} className="text-[0.65rem]">
              {post.readingMinutes} MIN READ
            </BracketLabel>
            {post.tags.slice(0, 3).map((tag) => (
              <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                {tag}
              </BracketLabel>
            ))}
          </div>

          <h1 className="font-sans text-3xl font-bold leading-[1.22] tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 text-base leading-8 text-foreground/68">{post.excerpt}</p>
          ) : null}
        </header>

        {headings.length > 0 ? (
          <section className="my-10 border-y border-border bg-white/[0.02] py-5">
            <BracketLabel hover={false} className="text-accent">
              ARTICLE INDEX
            </BracketLabel>
            <nav className="mt-4 grid gap-2.5">
              {headings
                .filter((heading) => heading.depth === 2)
                .map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="text-sm leading-relaxed text-muted-foreground transition-colors hover:text-accent"
                  >
                    {heading.text}
                  </a>
                ))}
            </nav>
          </section>
        ) : null}

        <article className="max-w-[70ch]">
          <div className="prose prose-invert prose-zinc max-w-none prose-headings:scroll-mt-24 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-h2:mb-4 prose-h2:mt-14 prose-h2:border-t prose-h2:border-border prose-h2:pt-8 prose-h2:text-2xl prose-h2:leading-snug prose-h3:mb-3 prose-h3:mt-9 prose-h3:text-xl prose-h3:leading-snug prose-p:my-5 prose-p:text-[1rem] prose-p:leading-8 prose-p:text-foreground/82 prose-strong:font-semibold prose-strong:text-foreground prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:pl-1 prose-li:text-foreground/82 prose-blockquote:my-7 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:bg-white/[0.03] prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-foreground/72 prose-a:text-accent hover:prose-a:underline prose-hr:my-10 prose-hr:border-border prose-code:rounded-none prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-pre:border prose-pre:border-border prose-pre:bg-card">
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
      </div>
    </main>
  )
}
