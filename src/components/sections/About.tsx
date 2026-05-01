"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { personalInfo, experiences } from "@/lib/data"

export function About() {
  const sectionRef = useScrollAnimation({ selector: ".about-content" })

  return (
    <section id="about" ref={sectionRef} className="relative py-32 lg:py-40 px-6 lg:px-10 overflow-hidden">
      <VerticalText text="ABOUT" side="left" className="opacity-50" />

      <div className="max-w-7xl mx-auto">
        <div className="about-content">
          <SectionLabel number="01" title="ABOUT" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 about-content">
          <div>
            <h2 className="font-sans font-bold text-display-l text-foreground tracking-tight mb-10">
              关于我
            </h2>
            <div className="border-b border-[hsla(0,0%,89%,0.12)] pb-10">
              <p className="text-lg leading-relaxed text-foreground/90">
                {personalInfo.bio}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">
              {personalInfo.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-sans font-extrabold text-3xl lg:text-4xl text-foreground tracking-tight">
                    [{stat.value}]
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-8">
              [EXPERIENCE]
            </h3>
            <div className="relative">
              <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-[hsla(0,0%,89%,0.08)]" />
              <div className="space-y-10">
                {experiences.map((exp, i) => (
                  <div key={i} className="group relative flex gap-8">
                    <div className="w-20 shrink-0 text-right">
                      <BracketLabel hover={false} className="text-xs">
                        {exp.period.split(" - ")[0].toUpperCase().slice(0, 3)}_{exp.period.split(" - ")[1]?.slice(2) || "NOW"}
                      </BracketLabel>
                    </div>
                    <div className="absolute left-[5.5rem] top-2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-muted-foreground/30 group-hover:bg-accent transition-colors" />
                    <div className="pl-8 group-hover:translate-x-1 transition-transform duration-300">
                      <h4 className="font-sans font-semibold text-foreground">{exp.company}</h4>
                      <p className="font-mono text-xs text-muted-foreground mt-1">{exp.role}</p>
                      <p className="text-sm text-muted-foreground/80 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
