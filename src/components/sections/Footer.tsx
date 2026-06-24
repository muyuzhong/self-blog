"use client"

import { useEffect, useState } from "react"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { motionAwareScrollBehavior } from "@/lib/motion"

export function Footer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const stored = Number(localStorage.getItem("visitor-count") || "0")
    const next = stored + 1
    localStorage.setItem("visitor-count", String(next))
    setCount(next)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: motionAwareScrollBehavior() })
  }

  return (
    <footer className="border-t border-foreground/10 px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BracketLabel>© {new Date().getFullYear()}</BracketLabel>
          <span className="font-swiss-label text-muted-foreground">
            访客 #{count.toLocaleString()}
          </span>
        </div>
        <button
          onClick={scrollToTop}
          className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-accent transition-colors"
          data-cursor-hover
        >
          [TOP]
        </button>
      </div>
    </footer>
  )
}
