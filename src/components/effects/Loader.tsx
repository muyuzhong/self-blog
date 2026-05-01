"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  onComplete?: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 1400

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(100, Math.floor((elapsed / duration) * 100))
      setProgress(p)
      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setDone(true)
          onComplete?.()
        }, 400)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-transform duration-700 ease-in-out",
        done && "-translate-y-full"
      )}
    >
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground mb-8">
        [暮_羽_中]
      </div>
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
        [<span className="text-accent">{progress}%</span>]
      </div>
    </div>
  )
}
