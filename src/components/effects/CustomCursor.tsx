"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let raf: number

    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        cursorRef.current?.style.setProperty(
          "transform",
          `translate(${e.clientX}px, ${e.clientY}px)`
        )
      })
    }

    const enter = () => setHovering(true)
    const leave = () => setHovering(false)

    window.addEventListener("mousemove", move)

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", enter)
        el.addEventListener("mouseleave", leave)
      })
    }

    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", move)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  if (!mounted) return null

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
      style={{ transform: "translate(-100px, -100px)" }}
    />
  )
}
