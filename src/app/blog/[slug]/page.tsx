import { promises as fs } from "fs"
import path from "path"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "@/lib/data"
import { getMarkdownHeadings, getReadingMinutes, slugifyHeading, stripFrontmatter } from "@/lib/blog"
import { BracketLabel } from "@/components/shared/BracketLabel"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">文章未找到</p>
      </div>
    )
  }

  const filePath = path.join(process.cwd(), "src", "content", "posts", `${slug}.mdx`)
  let source = ""
  try {
    source = await fs.readFile(filePath, "utf-8")
  } catch {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">文章内容加载失败</p>
      </div>
    )
  }

  const headings = getMarkdownHeadings(source)
  const readingMinutes = getReadingMinutes(source)
  const content = stripFrontmatter(source)

  return (
    <main className="px-6 pb-24 pt-28 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="max-w-3xl">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            返回博客
          </Link>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <BracketLabel hover={false} className="text-accent">
              MARKDOWN
            </BracketLabel>
            <BracketLabel hover={false}>{readingMinutes} MIN READ</BracketLabel>
            {post.tags.map((tag) => (
              <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                {tag}
              </BracketLabel>
            ))}
          </div>

          <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 border-l border-accent/60 pl-5 text-base leading-relaxed text-foreground/75">
            {post.excerpt}
          </p>

          <div className="mt-12 border-y border-border py-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            README.md
          </div>

          <div className="prose prose-invert prose-zinc mt-10 max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:text-2xl prose-h3:mt-10 prose-h3:text-xl prose-p:text-foreground/85 prose-p:leading-8 prose-strong:text-foreground prose-strong:font-bold prose-ul:my-5 prose-ol:my-5 prose-li:my-2 prose-li:text-foreground/85 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:text-foreground/75 prose-a:text-accent hover:prose-a:underline prose-hr:my-12 prose-hr:border-border prose-code:text-accent prose-pre:border prose-pre:border-border prose-pre:bg-card">
            <MDXRemote
              source={content}
              components={{
                h2: ({ children }) => {
                  const text = textFromNode(children)
                  return <h2 id={slugifyHeading(text)}>{children}</h2>
                },
                h3: ({ children }) => {
                  const text = textFromNode(children)
                  return <h3 id={slugifyHeading(text)}>{children}</h3>
                },
              }}
            />
          </div>
        </article>

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
      </div>
    </main>
  )
}
