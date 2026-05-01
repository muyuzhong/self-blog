"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BracketLabel } from "@/components/shared/BracketLabel"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6">
        <BracketLabel>ERROR</BracketLabel>
        <h1 className="text-4xl font-bold tracking-tight">出错了</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          抱歉，发生了意外错误。请尝试刷新页面。
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="font-mono text-sm uppercase tracking-[0.1em] text-accent hover:text-foreground transition-colors border-b border-accent pb-1"
          >
            [重试]
          </button>
          <Link
            href="/"
            className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
          >
            [返回首页]
          </Link>
        </div>
      </div>
    </div>
  )
}
