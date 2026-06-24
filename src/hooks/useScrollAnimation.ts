"use client"

import { useEffect, useRef } from "react"
import { shouldUseHeavyMotion } from "@/lib/motion"

interface UseScrollAnimationOptions {
  selector: string
  y?: number
  duration?: number
  stagger?: number
  ease?: string
  start?: string
}

export function useScrollAnimation(options: UseScrollAnimationOptions) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const optsRef = useRef(options)
  optsRef.current = options

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !shouldUseHeavyMotion(768)) return
    const scope: HTMLDivElement = section

    let cancelled = false
    let context: { revert: () => void } | undefined

    async function runAnimation() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])

      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        const {
          selector,
          y = 40,
          duration = 0.8,
          stagger = 0.1,
          ease = "power3.out",
          start = "top 70%",
        } = optsRef.current

        const elements = Array.from(scope.querySelectorAll<HTMLElement>(selector))
        if (elements.length === 0) return

        // Pre-set initial state + promote to composite layer for smooth animation.
        gsap.set(elements, {
          opacity: 0,
          y,
          willChange: "transform, opacity",
        })

        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: scope,
            start,
          },
          onComplete: () => {
            gsap.set(elements, { willChange: "auto" })
          },
        })
      }, scope)
    }

    runAnimation()

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  return sectionRef
}
