import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { getSeriesPosts } from "@/lib/blog"

const SERIES_NAME = "Harness 工程札记"

export const metadata: Metadata = {
  title: "合集",
  description: "围绕 Harness 工程持续写作的系列文章。",
}

export default async function SeriesIndexPage() {
  const posts = await getSeriesPosts(SERIES_NAME)

  return (
    <main className="min-h-screen px-6 pb-24 pt-32 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <header className="mb-14 max-w-3xl">
          <BracketLabel hover={false} className="text-accent">
            SERIES ARCHIVE
          </BracketLabel>
          <h1 className="mt-6 font-editorial text-display-l font-bold tracking-normal text-foreground">
            写作合集
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            把需要反复推敲的问题留在同一条路径上。每一篇独立成文，也共同组成一份逐步展开的工程档案。
          </p>
        </header>

        <section className="magazine-paper border border-foreground/12">
          <div className="grid gap-10 border-b border-foreground/10 p-7 md:grid-cols-[minmax(0,1fr)_10rem] md:p-10">
            <div>
              <div className="mb-7 flex flex-wrap gap-2">
                <BracketLabel hover={false} className="text-accent">
                  ACTIVE SERIES
                </BracketLabel>
                <BracketLabel hover={false}>
                  {String(posts.length).padStart(2, "0")} ARTICLES
                </BracketLabel>
              </div>
              <h2 className="font-editorial text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-6xl">
                {SERIES_NAME}
              </h2>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground">
                从运行时、上下文、工具、状态与验证出发，记录一个可靠 Harness 如何被逐层搭建出来。
              </p>
            </div>
            <div className="flex items-end justify-start md:justify-end">
              <span className="font-editorial text-8xl font-bold leading-none text-foreground/[0.07]">
                01
              </span>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="divide-y divide-foreground/10">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group grid gap-6 p-7 transition-colors hover:bg-foreground/[0.025] md:grid-cols-[4rem_minmax(0,1fr)_2rem] md:items-start md:p-10"
                >
                  <span className="font-mono text-xs tracking-[0.14em] text-accent">
                    {String(post.seriesOrder ?? index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <BracketLabel hover={false}>{post.date}</BracketLabel>
                      <BracketLabel hover={false}>{post.readingMinutes} MIN READ</BracketLabel>
                      {post.tags.slice(0, 3).map((tag) => (
                        <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                          {tag}
                        </BracketLabel>
                      ))}
                    </div>
                    <h3 className="font-editorial text-2xl font-semibold tracking-normal text-foreground transition-colors group-hover:text-accent md:text-3xl">
                      {post.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent md:block" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-10 text-sm leading-7 text-muted-foreground">
              合集正在整理中，第一篇文章很快会出现在这里。
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
