"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { ArrowRight } from "lucide-react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { BracketLabel } from "@/components/shared/BracketLabel"
import type { BlogPostSummary } from "@/lib/blog"
import Link from "next/link"

interface BlogProps {
  posts: BlogPostSummary[]
}

export function Blog({ posts }: BlogProps) {
  const sectionRef = useScrollAnimation({ selector: ".blog-row", y: 30, duration: 0.6, stagger: 0.1 })

  return (
    <section id="blog" ref={sectionRef} className="py-32 lg:py-40 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionLabel number="04" title="BLOG" />
        <div className="flex items-end justify-between mb-16">
          <h2 className="font-sans font-bold text-display-l text-foreground tracking-tight">
            技术博客
          </h2>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-accent transition-colors"
            data-cursor-hover
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[hsla(0,0%,89%,0.08)]">
          {posts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-row group grid gap-4 py-7 transition-colors hover:bg-white/[0.02] md:-mx-4 md:grid-cols-[11rem_minmax(0,1fr)_7rem] md:items-center md:px-4"
              data-cursor-hover
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <BracketLabel key={tag} hover={false} className="text-[0.6rem]">
                    {tag}
                  </BracketLabel>
                ))}
              </div>
              <h3 className="flex-1 font-sans font-medium text-lg text-foreground group-hover:text-accent transition-colors underline-expand">
                {post.title}
              </h3>
              <BracketLabel hover={false} className="shrink-0 text-[0.6rem]">
                MARKDOWN
              </BracketLabel>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
