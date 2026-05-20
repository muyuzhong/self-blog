"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { personalInfo, experiences } from "@/lib/data"

export function About() {
  const sectionRef = useScrollAnimation({ selector: ".about-content" })

  return (
    <section id="about" ref={sectionRef} className="magazine-page relative px-6 py-32 lg:px-10 lg:py-40">
      <div className="absolute right-0 top-0 h-full w-1/3 text-foreground/30 swiss-dots-fine pointer-events-none" />
      <VerticalText text="ABOUT" side="left" className="opacity-40" />

      <div className="max-w-7xl mx-auto">
        <div className="about-content">
          <SectionLabel number="01" title="ABOUT" />
        </div>

        <div className="grid gap-16 about-content lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)] lg:gap-24">
          <div>
            <h2 className="font-editorial mb-10 max-w-3xl text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
              关于我，也关于我怎么判断问题。
            </h2>
            <div className="border-y border-foreground/12 py-8">
              <p className="max-w-2xl text-lg leading-9 text-foreground/82">
                {personalInfo.bio}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-b border-foreground/12 pb-10 sm:gap-8">
              {personalInfo.stats.map((stat) => (
                <div key={stat.label} className="border-l border-accent/45 pl-4">
                  <div className="font-editorial-latin text-4xl font-bold leading-none text-foreground lg:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="magazine-kicker mb-8 border-b border-foreground/12 pb-4">
              Learning Notes
            </h3>
            <div className="relative">
              {experiences.length > 0 ? (
                <>
                <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-accent/35" />
                <div className="space-y-10">
                  {experiences.map((exp, i) => (
                  <div key={i} className="group relative flex gap-8">
                    <div className="w-20 shrink-0 text-right">
                      <BracketLabel hover={false} className="text-xs">
                        {exp.period.split(" - ")[0].toUpperCase().slice(0, 3)}_{exp.period.split(" - ")[1]?.slice(2) || "NOW"}
                      </BracketLabel>
                    </div>
                    <div className="absolute left-[5.5rem] top-2 h-2 w-2 -translate-x-1/2 bg-background ring-1 ring-accent/70 group-hover:bg-accent transition-colors" />
                    <div className="pl-8 group-hover:translate-x-1 transition-transform duration-300">
                      <h4 className="font-editorial text-2xl font-semibold tracking-normal text-foreground">{exp.company}</h4>
                      <p className="font-mono text-xs text-muted-foreground mt-1">{exp.role}</p>
                      <p className="text-sm text-muted-foreground/80 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                  ))}
                </div>
                </>
              ) : (
                <div className="magazine-paper border border-foreground/12 p-7">
                  <BracketLabel hover={false} className="text-accent">
                    NO FORMAL EXPERIENCE YET
                  </BracketLabel>
                  <p className="mt-6 text-sm leading-7 text-muted-foreground">
                    暂时不虚构经历。这里会留给之后真实的实习、项目协作和可核验的工程记录。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
