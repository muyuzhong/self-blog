import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getSeriesPosts, getStandaloneBlogPosts } from "@/lib/blog"
import { BracketLabel } from "@/components/shared/BracketLabel"

const SERIES_NAME = "Harness 工程札记"

export const metadata: Metadata = {
  title: "技术博客",
  description: "暮羽中的技术文章归档，记录 AI 工程、前端工程和产品开发实践。",
}

export default async function BlogIndexPage() {
  const [posts, seriesPosts] = await Promise.all([
    getStandaloneBlogPosts(),
    getSeriesPosts(SERIES_NAME),
  ])
  const seriesLead = seriesPosts[0]

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

        <div className="mb-14 max-w-3xl">
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

        {seriesLead ? (
          <Link
            href="/series"
            className="group mb-16 grid overflow-hidden border border-foreground/12 bg-card/70 transition-colors hover:border-accent/55 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
          >
            <div className="magazine-paper border-b border-foreground/10 p-7 md:border-b-0 md:border-r md:p-9">
              <div className="mb-7 flex flex-wrap items-center gap-2">
                <BracketLabel hover={false} className="text-accent">
                  SERIES DOSSIER
                </BracketLabel>
                <BracketLabel hover={false}>
                  {String(seriesPosts.length).padStart(2, "0")} ARTICLES
                </BracketLabel>
              </div>
              <h2 className="font-editorial text-4xl font-semibold leading-tight tracking-normal text-foreground transition-colors group-hover:text-accent md:text-5xl">
                {SERIES_NAME}
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">
                从运行时、上下文、工具、状态与验证出发，记录一个可靠 Harness 如何被逐层搭建出来。
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-accent">
                OPEN SERIES
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>

            <div className="relative flex min-h-[17rem] flex-col justify-between p-7 md:p-9">
              <span className="absolute right-5 top-3 font-editorial text-8xl font-bold leading-none text-foreground/[0.055]">
                {String(seriesLead.seriesOrder ?? 1).padStart(2, "0")}
              </span>
              <div className="relative z-10">
                <BracketLabel hover={false}>FIRST ARTICLE</BracketLabel>
                <h3 className="mt-7 font-editorial text-2xl font-semibold leading-tight tracking-normal text-foreground md:text-3xl">
                  {seriesLead.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-7 text-muted-foreground">
                  {seriesLead.excerpt}
                </p>
              </div>
              <div className="relative z-10 mt-7 flex flex-wrap gap-2">
                <BracketLabel hover={false}>{seriesLead.readingMinutes} MIN READ</BracketLabel>
                {seriesLead.tags.slice(0, 2).map((tag) => (
                  <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                    {tag}
                  </BracketLabel>
                ))}
              </div>
            </div>
          </Link>
        ) : null}

        <div className="mb-6 flex items-center gap-4">
          <BracketLabel hover={false}>INDEPENDENT ARTICLES</BracketLabel>
          <span className="h-px flex-1 bg-foreground/10" />
          <BracketLabel hover={false}>{String(posts.length).padStart(2, "0")} NOTES</BracketLabel>
        </div>

        <div className="divide-y divide-[hsla(0,0%,89%,0.08)] border-y border-[hsla(0,0%,89%,0.08)]">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid gap-5 py-9 transition-colors hover:bg-white/[0.02] md:-mx-4 md:grid-cols-[minmax(0,1fr)_8rem] md:px-4"
            >
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <BracketLabel hover={false}>MARKDOWN</BracketLabel>
                  <BracketLabel hover={false}>{post.readingMinutes} MIN READ</BracketLabel>
                  {post.tags.map((tag) => (
                    <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                      {tag}
                    </BracketLabel>
                  ))}
                </div>
                  <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
              </div>
              <div className="flex items-start justify-end">
                <ArrowRight className="mt-1 hidden h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent md:block" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
