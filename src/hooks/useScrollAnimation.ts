"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const {
      selector,
      y = 40,
      duration = 0.8,
      stagger = 0.1,
      ease = "power3.out",
      start = "top 70%",
    } = optsRef.current

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(selector)
      if (elements.length === 0) return

      if (prefersReduced) {
        gsap.set(elements, { opacity: 1, y: 0, willChange: "auto" })
        return
      }

      // Pre-set initial state + promote to composite layer for smooth animation
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
          trigger: sectionRef.current,
          start,
        },
        onComplete: () => {
          // Clean up will-change after animation to free GPU memory
          gsap.set(elements, { willChange: "auto" })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return sectionRef
}
