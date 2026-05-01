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
        "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block",
        "transition-[width,height,border] duration-200 ease-out",
        hovering ? "w-5 h-5 -ml-2.5 -mt-2.5 border border-white rounded-full" : "w-1 h-1 -ml-0.5 -mt-0.5 bg-white rounded-full"
      )}
      style={{ transform: "translate(-100px, -100px)" }}
    />
  )
}