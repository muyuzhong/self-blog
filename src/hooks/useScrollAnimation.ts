"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

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

  useGSAP((context) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const {
      selector,
      y = 40,
      duration = 0.8,
      stagger = 0.1,
      ease = "power3.out",
      start = "top 70%",
    } = optsRef.current

    const elements = (
      context.selector
        ? context.selector(selector)
        : gsap.utils.toArray(selector)
    ) as HTMLElement[]
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
  }, { scope: sectionRef })

  return sectionRef
}
