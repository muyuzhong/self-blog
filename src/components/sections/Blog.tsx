"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { BracketLabel } from "@/components/shared/BracketLabel"
import type { BlogPostSummary } from "@/lib/blog"

interface BlogProps {
  posts: BlogPostSummary[]
}

export function Blog({ posts }: BlogProps) {
  const sectionRef = useScrollAnimation({ selector: ".blog-row", y: 30, duration: 0.6, stagger: 0.1 })
  const featured = posts.slice(0, 1)
  const rest = posts.slice(1, 4)

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
