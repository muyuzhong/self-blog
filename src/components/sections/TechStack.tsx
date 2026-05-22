"use client"

import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { skills } from "@/lib/data"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

function getLevelLabel(level: number) {
  if (level >= 90) return "CORE"
  if (level >= 75) return "SHIPPING"
  if (level >= 60) return "WORKING"
  return "LEARNING"
}

export function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSkill = skills[activeIndex] ?? skills[0]

  useGSAP((context, contextSafe) => {
    const rows = (context.selector?.(".tech-signal-row") ?? []) as HTMLElement[]
    const panel = panelRef.current
    if (!panel || rows.length === 0) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const safe = contextSafe ?? (<T extends (...args: any[]) => any>(fn: T) => fn)

    gsap.from(rows, {
      autoAlpha: 0,
      y: prefersReduced ? 0 : 28,
      duration: prefersReduced ? 0 : 0.65,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 72%",
      },
    })

    rows.forEach((row, index) => {
      const mx = gsap.quickTo(row, "--mx", { duration: prefersReduced ? 0 : 0.22, ease: "power3.out" })
      const my = gsap.quickTo(row, "--my", { duration: prefersReduced ? 0 : 0.22, ease: "power3.out" })
      const xTo = gsap.quickTo(row, "x", { duration: prefersReduced ? 0 : 0.28, ease: "power3.out" })

      const move = safe((event: PointerEvent) => {
        const rect = row.getBoundingClientRect()
        mx(((event.clientX - rect.left) / rect.width) * 100)
        my(((event.clientY - rect.top) / rect.height) * 100)
      })

      const enter = safe(() => {
        setActiveIndex(index)
        xTo(10)
        gsap.fromTo(
          panel,
          { autoAlpha: 0.82, y: prefersReduced ? 0 : 10 },
          { autoAlpha: 1, y: 0, duration: prefersReduced ? 0 : 0.32, ease: "power3.out" }
        )
      })

      const leave = safe(() => xTo(0))

      row.addEventListener("pointermove", move)
      row.addEventListener("pointerenter", enter)
      row.addEventListener("pointerleave", leave)

      return () => {
        row.removeEventListener("pointermove", move)
        row.removeEventListener("pointerenter", enter)
        row.removeEventListener("pointerleave", leave)
      }
    })
  }, { scope: sectionRef })

  return (
    <section id="techstack" ref={sectionRef} className="tech-signal-section magazine-page relative px-6 py-32 lg:px-10 lg:py-40">
      <VerticalText text="STACK" side="left" className="opacity-40" />
      <div className="tech-signal-grid-bg" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-end">
          <div>
            <SectionLabel number="03" title="TECHSTACK" />
            <h2 className="font-editorial text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
              技术能力
            </h2>
          </div>
          <p className="max-w-2xl border-l border-accent/70 pl-6 text-sm leading-7 text-muted-foreground">
            技术不再做静态清单，而是像一组可检视的能力信号。移动鼠标查看不同方向，右侧面板会同步显示当前技术的交付状态。
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-stretch">
          <div className="tech-signal-list border-y border-foreground/12">
            {skills.map((skill, index) => (
              <button
                key={skill.name}
                type="button"
                className={cn("tech-signal-row group", index === activeIndex && "is-active")}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                data-cursor-hover
              >
                <span className="font-mono text-[0.65rem] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-editorial text-2xl font-semibold tracking-normal text-foreground transition-colors group-hover:text-accent">
                  {skill.name}
                </span>
                <BracketLabel hover={false}>{skill.category}</BracketLabel>
                <span className="tech-signal-level" style={{ ["--level" as string]: `${skill.level}%` }}>
                  <span />
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground md:text-right">
                  {getLevelLabel(skill.level)}
                </span>
              </button>
            ))}
          </div>

          <aside ref={panelRef} className="tech-signal-panel">
            <div className="tech-signal-scope" aria-hidden="true">
              {skills.map((skill, index) => (
                <span
                  key={skill.name}
                  className={cn("tech-signal-node", index === activeIndex && "is-active")}
                  style={{
                    ["--node-x" as string]: `${18 + (index % 4) * 22}%`,
                    ["--node-y" as string]: `${18 + Math.floor(index / 4) * 36}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <BracketLabel hover={false} className="text-accent">
                ACTIVE SIGNAL
              </BracketLabel>
              <h3 className="mt-7 font-editorial text-4xl font-semibold leading-tight text-foreground">
                {activeSkill.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                当前处在 {getLevelLabel(activeSkill.level).toLowerCase()} 档位，属于 {activeSkill.category} 方向的能力信号。
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <div className="mb-3 flex items-end justify-between">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                  DELIVERY INDEX
                </span>
                <span className="font-editorial-latin text-5xl font-bold leading-none text-accent">
                  {activeSkill.level}
                </span>
              </div>
              <div className="tech-signal-meter" style={{ ["--level" as string]: `${activeSkill.level}%` }}>
                <span />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <BracketLabel hover={false}>{activeSkill.category}</BracketLabel>
                <BracketLabel hover={false}>{getLevelLabel(activeSkill.level)}</BracketLabel>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
