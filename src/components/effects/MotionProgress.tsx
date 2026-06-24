"use client"

import { useEffect, useRef, useState } from "react"
import { shouldUseHeavyMotion } from "@/lib/motion"

const sections = [
  { id: "home", label: "00" },
  { id: "about", label: "01" },
  { id: "projects", label: "02" },
  { id: "techstack", label: "03" },
  { id: "blog", label: "04" },
  { id: "contact", label: "05" },
]

export function MotionProgress() {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState("00")

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    if (!shouldUseHeavyMotion(1024)) {
      let activeLabel = active

      const updateProgress = () => {
        const root = document.documentElement
        const maxScroll = Math.max(1, root.scrollHeight - root.clientHeight)
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
        bar.style.transform = `scaleY(${progress})`

        const current = sections.find((section) => {
          const element = document.getElementById(section.id)
          if (!element) return false
          const rect = element.getBoundingClientRect()
          return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
        })

        if (current && current.label !== activeLabel) {
          activeLabel = current.label
          setActive(current.label)
        }
      }

      updateProgress()
      window.addEventListener("scroll", updateProgress, { passive: true })
      window.addEventListener("resize", updateProgress)

      return () => {
        window.removeEventListener("scroll", updateProgress)
        window.removeEventListener("resize", updateProgress)
      }
    }

    let cancelled = false
    let context: { revert: () => void } | undefined

    async function bindProgress() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])

      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        gsap.set(bar, { scaleY: 0, transformOrigin: "50% 0%" })

        const setProgress = gsap.quickTo(bar, "scaleY", {
          duration: 0.28,
          ease: "power3.out",
        })

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => setProgress(self.progress),
        })

        sections.forEach((section) => {
          const element = document.getElementById(section.id)
          if (!element) return

          ScrollTrigger.create({
            trigger: element,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActive(section.label),
            onEnterBack: () => setActive(section.label),
          })
        })
      }, rootRef.current ?? undefined)
    }

    bindProgress()

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-3 lg:flex"
      aria-hidden="true"
    >
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
        {active}
      </span>
      <span className="relative h-36 w-px overflow-hidden bg-foreground/12">
        <span
          ref={barRef}
          className="absolute left-0 top-0 h-full w-full bg-accent"
          style={{ transform: "scaleY(0)", transformOrigin: "50% 0%" }}
        />
      </span>
    </div>
  )
}
