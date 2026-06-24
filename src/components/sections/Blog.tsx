"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { BracketLabel } from "@/components/shared/BracketLabel"
import type { BlogPostSummary } from "@/lib/blog"

interface BlogProps {
  posts: BlogPostSummary[]
  seriesPosts: BlogPostSummary[]
}

const SERIES_NAME = "Harness 工程札记"

export function Blog({ posts, seriesPosts }: BlogProps) {
  const sectionRef = useScrollAnimation({ selector: ".blog-row", y: 30, duration: 0.6, stagger: 0.1 })
  const featured = posts.slice(0, 1)
  const rest = posts.slice(1, 4)
  const seriesLead = seriesPosts[0]

  return (
    <section id="blog" ref={sectionRef} className="magazine-page relative px-6 py-32 lg:px-10 lg:py-40">
      <div className="absolute right-0 top-0 h-64 w-full text-foreground/30 swiss-dots-fine pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel number="04" title="BLOG" />
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="font-editorial text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
            技术博客
          </h2>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-accent transition-colors"
            data-cursor-hover
          >
            <span>VIEW ALL</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {seriesLead ? (
          <Link
            href="/series"
            className="blog-row group mb-16 grid overflow-hidden border border-foreground/12 bg-card/70 transition-colors hover:border-accent/55 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]"
            data-cursor-hover
          >
            <div className="magazine-paper border-b border-foreground/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="mb-8 flex flex-wrap items-center gap-2">
                <BracketLabel hover={false} className="text-accent">
                  SERIES
                </BracketLabel>
                <BracketLabel hover={false}>
                  {String(seriesPosts.length).padStart(2, "0")} ARTICLES
                </BracketLabel>
              </div>
              <h3 className="font-editorial text-4xl font-semibold leading-tight tracking-normal text-foreground transition-colors group-hover:text-accent md:text-5xl lg:text-6xl">
                {SERIES_NAME}
              </h3>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground">
                从运行时、上下文、工具、状态与验证出发，记录一个可靠 Harness 如何被逐层搭建出来。
              </p>
              <span className="mt-9 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-accent">
                VIEW SERIES
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>

            <div className="relative flex min-h-[18rem] flex-col justify-between p-8 lg:p-10">
              <span className="absolute right-5 top-3 font-editorial text-8xl font-bold leading-none text-foreground/[0.055]">
                {String(seriesPosts.length).padStart(2, "0")}
              </span>
              <div className="relative z-10">
                <BracketLabel hover={false}>SERIES ARTICLES</BracketLabel>
                <div className="mt-6 max-h-[28rem] space-y-5 overflow-y-auto pr-2">
                  {seriesPosts.map((post) => (
                    <div key={post.slug} className="border-b border-foreground/10 pb-5 last:border-b-0 last:pb-0">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <BracketLabel hover={false} className="text-[0.6rem]">
                          {String(post.seriesOrder ?? 1).padStart(2, "0")}
                        </BracketLabel>
                        <BracketLabel hover={false} className="text-[0.6rem]">
                          {post.date}
                        </BracketLabel>
                        <BracketLabel hover={false} className="text-[0.6rem]">
                          {post.readingMinutes} MIN READ
                        </BracketLabel>
                      </div>
                      <h4 className="font-editorial text-xl font-semibold leading-tight tracking-normal text-foreground transition-colors group-hover:text-accent">
                        {post.title}
                      </h4>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-8 flex flex-wrap gap-2">
                {seriesLead.tags.slice(0, 2).map((tag) => (
                  <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                    {tag}
                  </BracketLabel>
                ))}
              </div>
            </div>
          </Link>
        ) : null}

        <div className="mb-7 flex items-center gap-4">
          <BracketLabel hover={false}>STANDALONE NOTES</BracketLabel>
          <span className="h-px flex-1 bg-foreground/10" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-row group magazine-paper min-h-[24rem] border border-foreground/12 p-8 transition-colors hover:border-accent/55"
              data-cursor-hover
            >
              <div className="mb-10 flex flex-wrap gap-2">
                <BracketLabel hover={false} className="text-accent">
                  FEATURED
                </BracketLabel>
                <BracketLabel hover={false}>{post.date}</BracketLabel>
                <BracketLabel hover={false}>{post.readingMinutes} MIN READ</BracketLabel>
                {post.tags.slice(0, 2).map((tag) => (
                  <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                    {tag}
                  </BracketLabel>
                ))}
              </div>
              <h3 className="max-w-2xl font-editorial text-4xl font-semibold leading-tight tracking-normal text-foreground transition-colors group-hover:text-accent md:text-5xl lg:text-6xl">
                {post.title}
              </h3>
              <p className="mt-8 max-w-xl text-sm leading-7 text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          ))}

          <div className="border-y border-foreground/12">
            {rest.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-row group grid gap-4 border-b border-foreground/10 py-7 transition-colors last:border-b-0 hover:bg-foreground/[0.025] md:grid-cols-[3rem_minmax(0,1fr)_5rem] md:items-center"
                data-cursor-hover
              >
                <span className="font-mono text-[0.65rem] text-muted-foreground">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <BracketLabel hover={false} className="text-[0.6rem]">
                      {post.date}
                    </BracketLabel>
                    <BracketLabel hover={false} className="text-[0.6rem]">
                      {post.readingMinutes} MIN READ
                    </BracketLabel>
                    {post.tags.slice(0, 2).map((tag) => (
                      <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                        {tag}
                      </BracketLabel>
                    ))}
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold tracking-normal text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                </div>
                <ArrowRight className="hidden h-4 w-4 justify-self-end text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent md:block" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
