"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ArrowDown } from "lucide-react"
import { BracketLabel } from "@/components/shared/BracketLabel"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      gsap.set(
        [
          ...(titleRef.current?.querySelectorAll(".line") ?? []),
          subRef.current,
          document.querySelector(".scroll-hint"),
        ].filter(Boolean),
        { opacity: 1, y: 0 }
      )
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(titleRef.current?.querySelectorAll(".line") || [], {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      })
      tl.from(subRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
      tl.from(".scroll-hint", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 lg:px-10 pt-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <h1
            ref={titleRef}
            className="font-sans font-extrabold text-display-xl text-foreground leading-[0.9] tracking-tighter"
          >
            <span className="line block">用代码构建</span>
            <span className="line block">数字世界的</span>
            <span className="line block">无限可能</span>
          </h1>

          <div ref={subRef} className="mt-10 flex items-center gap-4">
            <span className="h-px w-12 bg-muted-foreground/30" />
            <span className="font-mono text-sm tracking-wide text-muted-foreground">
              全栈开发者 & 开源爱好者
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 lg:left-10 flex items-center gap-3 scroll-hint">
        <BracketLabel>SCROLL</BracketLabel>
        <span className="font-mono text-xs text-muted-foreground">This way</span>
        <ArrowDown className="w-4 h-4 text-muted-foreground animate-scroll-hint" />
      </div>
    </section>
  )
}
