"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { shouldUseHeavyMotion } from "@/lib/motion"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || !shouldUseHeavyMotion(768)) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    async function bindCursor() {
      const { gsap } = await import("gsap")
      if (cancelled) return

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" })
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" })

      const move = (e: MouseEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
      }

      const updateHover = (target: EventTarget | null, next: boolean) => {
        if (!(target instanceof Element)) return
        if (target.closest("a, button, [data-cursor-hover]")) setHovering(next)
      }

      const enter = (e: PointerEvent) => updateHover(e.target, true)
      const leave = (e: PointerEvent) => updateHover(e.target, false)

      window.addEventListener("mousemove", move, { passive: true })
      document.addEventListener("pointerover", enter, { passive: true })
      document.addEventListener("pointerout", leave, { passive: true })

      cleanup = () => {
        window.removeEventListener("mousemove", move)
        document.removeEventListener("pointerover", enter)
        document.removeEventListener("pointerout", leave)
      }
    }

    bindCursor()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed left-0 top-0 z-[9999] hidden pointer-events-none md:block",
        "transition-[width,height,border-color,background-color,opacity] duration-200 ease-out",
        hovering
          ? "h-7 w-7 -ml-3.5 -mt-3.5 border border-accent/80 bg-transparent opacity-90"
          : "h-2 w-2 -ml-1 -mt-1 border border-accent/70 bg-accent/30 opacity-75"
      )}
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    />
  )
}
