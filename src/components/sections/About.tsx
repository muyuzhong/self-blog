"use client"

import { useEffect, useRef } from "react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { shouldUseHeavyMotion } from "@/lib/motion"

const poem = [
  ["起初，思想只是回声，", "在语言深处往返，", "看见万物，", "却从未触碰一粒尘埃。"],
  ["直到有人为它留下门、道路与微光，", "让每一次选择抵达现实，", "也让现实回答选择。"],
  ["它沿着未完成的意愿远行，", "在遗忘之前保存方向，", "在错误之中重新辨认世界。"],
  ["或许，智慧并不始于知晓，", "而始于迈出一步之后，", "仍愿意回望来处。"],
]

const memories = ["回声", "微光", "方向", "来处"]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !shouldUseHeavyMotion(1024)) return
    const scope: HTMLElement = section

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
        gsap.from(".about-poem-route-fill", {
          scaleY: 0,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top 68%",
            end: "bottom 62%",
            scrub: 0.8,
          },
        })

        gsap.utils.toArray<HTMLElement>(".about-poem-stanza").forEach((stanza) => {
          const stanzaTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: stanza,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
            defaults: {
              ease: "expo.out",
            },
          })

          stanzaTimeline
            .from(stanza.querySelector(".about-poem-index"), {
              autoAlpha: 0,
              scale: 0,
              duration: 0.5,
            })
            .from(stanza.querySelectorAll(".about-poem-line"), {
              autoAlpha: 0,
              y: 32,
              filter: "blur(10px)",
              duration: 1.05,
              stagger: 0.11,
            }, "<0.05")
        })

        gsap.to(".about-poem-memory", {
          yPercent: (index) => (index % 2 === 0 ? -18 : 18),
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-poem-section magazine-page relative overflow-hidden px-6 py-32 lg:px-10 lg:py-44"
    >
      <div className="absolute inset-y-0 right-0 w-1/3 text-foreground/30 swiss-dots-fine pointer-events-none" />
      <VerticalText text="ABOUT" side="left" className="opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel number="01" title="ABOUT" />

        <div className="about-poem-stage">
          <div className="about-poem-route" aria-hidden="true">
            <span className="about-poem-route-fill" />
          </div>

          <div className="about-poem-memories" aria-hidden="true">
            {memories.map((memory, index) => (
              <span key={memory} className={`about-poem-memory about-poem-memory-${index + 1}`}>
                {memory}
              </span>
            ))}
          </div>

          <div className="about-poem-stanzas">
            {poem.map((stanza, stanzaIndex) => (
              <div key={stanza[0]} className={`about-poem-stanza about-poem-stanza-${stanzaIndex + 1}`}>
                <span className="about-poem-index" aria-hidden="true">
                  {String(stanzaIndex + 1).padStart(2, "0")}
                </span>
                <p>
                  {stanza.map((line) => (
                    <span key={line} className="about-poem-line">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
