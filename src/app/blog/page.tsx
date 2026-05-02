import type { Metadata } from "next"
import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { blogPosts } from "@/lib/data"
import { getReadingMinutes } from "@/lib/blog"
import { BracketLabel } from "@/components/shared/BracketLabel"

export const metadata: Metadata = {
  title: "技术博客",
  description: "暮羽中的技术文章归档，记录 AI 工程、前端工程和产品开发实践。",
}

async function getPostReadingMinutes(slug: string) {
  const filePath = path.join(process.cwd(), "src", "content", "posts", `${slug}.mdx`)
  const source = await fs.readFile(filePath, "utf-8")
  return getReadingMinutes(source)
}

export default async function BlogIndexPage() {
  const posts = await Promise.all(
    blogPosts.map(async (post) => ({
      ...post,
      readingMinutes: await getPostReadingMinutes(post.slug),
    }))
  )

  return (
    <main className="min-h-screen px-6 pb-24 pt-32 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#blog"
          className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="mb-16">
          <BracketLabel hover={false} className="text-accent">
            BLOG ARCHIVE
          </BracketLabel>
          <h1 className="mt-6 font-sans text-display-l font-bold tracking-tight text-foreground">
            技术博客
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            记录 AI 工程、前端工程和产品开发里的真实问题、取舍与复盘。
          </p>
        </div>

        <div className="divide-y divide-[hsla(0,0%,89%,0.08)]">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-8 transition-colors hover:bg-white/[0.02] md:-mx-4 md:px-4"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <BracketLabel hover={false}>MARKDOWN</BracketLabel>
                <BracketLabel hover={false}>{post.readingMinutes} MIN READ</BracketLabel>
                {post.tags.map((tag) => (
                  <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                    {tag}
                  </BracketLabel>
                ))}
              </div>
              <div className="flex items-start justify-between gap-8">
                <div>
                  <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowRight className="mt-2 hidden h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent md:block" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
