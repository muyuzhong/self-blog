"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BracketLabel } from "@/components/shared/BracketLabel"

export default function NotFound() {
  const [display, setDisplay] = useState("")
  const fullText = "404_NOT_FOUND"

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setDisplay(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(timer)
    }, 120)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6">
        <BracketLabel>ERROR</BracketLabel>
        <h1 className="font-mono text-4xl font-bold tracking-tight min-h-[3rem]">
          {display}
          <span className="animate-pulse">_</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          你寻找的页面不存在或已被移除。
        </p>
        <Link
          href="/"
          className="inline-block font-mono text-sm uppercase tracking-[0.1em] text-accent hover:text-foreground transition-colors border-b border-accent pb-1"
        >
          [返回首页]
        </Link>
      </div>
    </div>
  )
}
