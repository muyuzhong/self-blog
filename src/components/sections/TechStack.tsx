"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { skills } from "@/lib/data"

function getLevelLabel(level: number) {
  if (level >= 90) return "EXPERT"
  if (level >= 75) return "ADVANCED"
  if (level >= 60) return "INTERMEDIATE"
  return "BEGINNER"
}

export function TechStack() {
  const sectionRef = useScrollAnimation({ selector: ".skill-row", y: 30, duration: 0.6, stagger: 0.08 })

  return (
    <section id="techstack" ref={sectionRef} className="relative py-32 lg:py-40 px-6 lg:px-10 overflow-hidden">
      <VerticalText text="STACK" side="left" className="opacity-50" />

      <div className="max-w-7xl mx-auto">
        <SectionLabel number="03" title="TECHSTACK" />
        <h2 className="font-sans font-bold text-display-l text-foreground tracking-tight mb-16">
          技术能力
        </h2>

        <div className="space-y-0">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="skill-row group flex items-center gap-6 py-5 border-b border-[hsla(0,0%,89%,0.08)] hover:bg-white/[0.02] hover:pl-2 transition-all duration-300"
            >
              <span className="font-sans font-semibold text-foreground w-32 shrink-0 group-hover:translate-x-2 transition-transform duration-300">
                {skill.name}
              </span>
              <div className="flex-1 h-px bg-[hsla(0,0%,89%,0.08)] relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-accent transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <BracketLabel hover={false} className="w-28 text-right shrink-0">
                {getLevelLabel(skill.level)}
              </BracketLabel>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
