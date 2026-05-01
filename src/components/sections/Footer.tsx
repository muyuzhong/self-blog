"use client"

import { useEffect, useState } from "react"
import { BracketLabel } from "@/components/shared/BracketLabel"

export function Footer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const stored = Number(localStorage.getItem("visitor-count") || "0")
    const next = stored + 1
    localStorage.setItem("visitor-count", String(next))
    setCount(next)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t border-[hsla(0,0%,89%,0.08)] px-6 lg:px-10 py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BracketLabel>© {new Date().getFullYear()}</BracketLabel>
          <span className="font-mono text-xs text-muted-foreground">
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
