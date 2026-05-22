"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { FlowSandBackground } from "@/components/effects/FlowSandBackground"

gsap.registerPlugin(useGSAP)

const notes = [
  "Agent 开发",
  "工具调用",
  "工作流编排",
  "实习机会",
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useGSAP((context) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const select = context.selector
    const revealTargets = [
      ...(titleRef.current?.querySelectorAll(".line") ?? []),
      subRef.current,
      ...(select ? select(".hero-focus-row, .scroll-hint, .hero-kicker") : []),
    ].filter(Boolean)

    if (prefersReduced) {
      gsap.set(revealTargets, { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" })
      return
    }

    gsap.set(titleRef.current?.querySelectorAll(".line") || [], {
      clipPath: "inset(0% 0% 100% 0%)",
      y: 42,
      opacity: 0,
    })

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
    tl.to(titleRef.current?.querySelectorAll(".line") || [], {
      y: 0,
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.05,
      stagger: 0.1,
    })
    tl.from(subRef.current, { y: 28, opacity: 0, duration: 0.72 }, "-=0.45")
    tl.from(".hero-focus-row", { x: 28, opacity: 0, duration: 0.58, stagger: 0.07 }, "-=0.42")
    tl.from(".scroll-hint", { y: 18, opacity: 0, duration: 0.5 }, "-=0.2")
  }, { scope: containerRef })

  return (
    <section
      id="home"
      ref={containerRef}
      className="magazine-page relative min-h-screen px-6 pt-24 lg:px-10 lg:pt-28"
    >
      <FlowSandBackground />
      <div className="absolute inset-x-0 top-0 h-44 text-foreground/40 swiss-dots-fine pointer-events-none" />
      <div className="ink-contour absolute bottom-[-12rem] right-[-12vw] hidden h-[38rem] w-[58rem] opacity-35 lg:block" />
      <div className="absolute right-8 top-28 hidden h-[52vh] w-px bg-foreground/12 lg:block" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl grid-rows-[1fr_auto]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="max-w-5xl">
              <div className="hero-kicker mb-8 flex items-center gap-4">
              <BracketLabel hover={false} className="text-accent">
                PERSONAL SITE
              </BracketLabel>
              <span className="magazine-rule max-w-24" />
              <span className="magazine-kicker">Vol. Agent / Intern</span>
            </div>

            <h1
              ref={titleRef}
              className="font-editorial text-6xl font-black leading-[0.94] tracking-normal text-foreground sm:text-7xl md:text-8xl lg:text-9xl"
            >
              <span className="line block">暮羽中</span>
              <span className="line block text-foreground/82">工程笔记</span>
              <span className="line block font-editorial-latin text-accent">Index.</span>
            </h1>

            <div ref={subRef} className="mt-10 grid max-w-3xl gap-6 border-l border-accent/70 pl-6 md:grid-cols-[1fr_auto]">
              <p className="text-base leading-8 text-foreground/78 sm:text-lg">
                智能不是替人抵达终点，而是让人学会把复杂问题交给系统，把清醒判断留给自己。
              </p>
              <div className="flex items-start gap-3 md:flex-col">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent"
                  data-cursor-hover
                >
                  看项目
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#blog"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent"
                  data-cursor-hover
                >
                  读文章
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <aside className="magazine-paper hidden min-h-[32rem] border border-foreground/12 p-6 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-10 flex items-center justify-between">
                <span className="magazine-kicker">Current Focus</span>
                <span className="font-editorial-latin text-5xl text-accent">01</span>
              </div>
              <div className="space-y-5">
                {notes.map((note, index) => (
                  <div key={note} className="hero-focus-row grid grid-cols-[2rem_1fr] items-baseline gap-4 border-t border-foreground/10 pt-4">
                    <span className="font-mono text-[0.65rem] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-editorial text-2xl font-semibold tracking-normal text-foreground">
                      {note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="max-w-[16rem] text-sm leading-7 text-muted-foreground">
              目前正在系统学习 Agent 开发，期待一段能把学习变成真实工程能力的实习。
            </p>
          </aside>
        </div>

        <div className="scroll-hint flex items-center justify-between border-t border-foreground/10 py-6">
          <div className="flex items-center gap-3">
            <BracketLabel>SCROLL</BracketLabel>
            <span className="magazine-kicker">Next spread</span>
            <ArrowDown className="h-4 w-4 animate-scroll-hint text-muted-foreground" />
          </div>
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground md:block">
            muyuzhong.xyz
          </span>
        </div>
      </div>
    </section>
  )
}
