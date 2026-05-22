"use client"

import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

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

  useGSAP(() => {
    const bar = barRef.current
    if (!bar) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    gsap.set(bar, { scaleY: 0, transformOrigin: "50% 0%" })

    const setProgress = gsap.quickTo(bar, "scaleY", {
      duration: prefersReduced ? 0 : 0.28,
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
  }, { scope: rootRef })

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
        <span ref={barRef} className="absolute left-0 top-0 h-full w-full bg-accent" />
      </span>
    </div>
  )
}
