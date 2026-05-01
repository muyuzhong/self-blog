"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { ArrowUpRight } from "lucide-react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { projects } from "@/lib/data"

export function Projects() {
  const sectionRef = useScrollAnimation({ selector: ".project-card", y: 50, stagger: 0.15 })

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 lg:py-40 px-6 lg:px-10 overflow-hidden">
      <VerticalText text="PROJECTS" side="right" className="opacity-50" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionLabel number="02" title="PROJECTS" />
          <h2 className="font-sans font-bold text-display-l text-foreground tracking-tight">
            精选项目
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="project-card group relative bg-card editorial-border editorial-border-hover p-8 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-6">
                <BracketLabel hover={false}>{project.category}</BracketLabel>
                <BracketLabel hover={false} className="text-[0.6rem]">{project.date}</BracketLabel>
              </div>

              <div className="mb-8 h-32 flex items-center justify-center border border-[hsla(0,0%,89%,0.06)]">
                <span className="font-sans font-extrabold text-7xl text-muted-foreground/[0.06] select-none">
                  {project.title.charAt(0)}
                </span>
              </div>

              <h3 className="font-sans font-bold text-xl text-foreground tracking-tight mb-3 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <BracketLabel key={tech} hover={false} className="text-[0.6rem]">
                    {tech}
                  </BracketLabel>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-accent transition-colors"
                data-cursor-hover
              >
                <span>OPEN</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
