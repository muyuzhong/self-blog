import { promises as fs } from "fs"
import path from "path"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "@/lib/data"

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
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
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
    // Strip YAML frontmatter if present
    source = source.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
  } catch {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">文章内容加载失败</p>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
      <Link
        href="/#blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        返回博客
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12 border-b border-border pb-8">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {post.date}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Tag className="w-4 h-4" />
          {post.tags.join(", ")}
        </span>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground prose-strong:font-bold prose-ul:my-4 prose-ol:my-4 prose-li:my-1.5 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-a:text-accent hover:prose-a:underline prose-hr:border-border">
        <MDXRemote source={source} />
      </div>
    </article>
  )
}
