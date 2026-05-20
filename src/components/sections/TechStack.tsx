"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { skills } from "@/lib/data"

function getLevelLabel(level: number) {
  if (level >= 90) return "CORE"
  if (level >= 75) return "SHIPPING"
  if (level >= 60) return "WORKING"
  return "LEARNING"
}

export function TechStack() {
  const sectionRef = useScrollAnimation({ selector: ".skill-row", y: 30, duration: 0.6, stagger: 0.08 })

  return (
    <section id="techstack" ref={sectionRef} className="magazine-page relative px-6 py-32 lg:px-10 lg:py-40">
      <VerticalText text="STACK" side="left" className="opacity-40" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-end">
          <div>
            <SectionLabel number="03" title="TECHSTACK" />
            <h2 className="font-editorial text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
              技术能力
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            不用百分比制造虚假的精确感。这里按“能否稳定交付”的语气呈现技术栈，保留工程档案的克制和可读性。
          </p>
        </div>

        <div className="border-y border-foreground/12">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="skill-row group grid gap-4 border-b border-foreground/10 py-5 transition-colors last:border-b-0 hover:bg-foreground/[0.025] md:grid-cols-[5rem_minmax(0,1fr)_10rem_8rem] md:items-center"
            >
              <span className="font-mono text-[0.65rem] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-editorial text-2xl font-semibold tracking-normal text-foreground transition-colors group-hover:text-accent">
                {skill.name}
              </span>
              <BracketLabel hover={false}>{skill.category}</BracketLabel>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground md:text-right">
                {getLevelLabel(skill.level)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
