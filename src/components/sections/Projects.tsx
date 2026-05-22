"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowUpRight, BookOpen } from "lucide-react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { projects } from "@/lib/data"

gsap.registerPlugin(useGSAP)

export function Projects() {
  const sectionRef = useScrollAnimation({ selector: ".project-card", y: 50, stagger: 0.12 })

  useGSAP((context, contextSafe) => {
    const cards = (context.selector?.(".project-motion-card") ?? []) as HTMLElement[]
    if (cards.length === 0) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const safe = contextSafe ?? (<T extends (...args: any[]) => any>(fn: T) => fn)

    const disposers = cards.map((card) => {
      const mx = gsap.quickTo(card, "--mx", { duration: prefersReduced ? 0 : 0.28, ease: "power3.out" })
      const my = gsap.quickTo(card, "--my", { duration: prefersReduced ? 0 : 0.28, ease: "power3.out" })
      const tiltX = gsap.quickTo(card, "rotationX", { duration: prefersReduced ? 0 : 0.35, ease: "power3.out" })
      const tiltY = gsap.quickTo(card, "rotationY", { duration: prefersReduced ? 0 : 0.35, ease: "power3.out" })

      const move = safe((event: PointerEvent) => {
        const rect = card.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        mx(px * 100)
        my(py * 100)
        if (!prefersReduced) {
          tiltX((0.5 - py) * 4)
          tiltY((px - 0.5) * 5)
        }
      })

      const enter = safe(() => {
        gsap.to(card.querySelector(".project-preview"), {
          y: prefersReduced ? 0 : -8,
          scale: prefersReduced ? 1 : 1.025,
          duration: 0.38,
          ease: "power3.out",
        })
        gsap.to(card.querySelectorAll(".project-token"), {
          y: prefersReduced ? 0 : -3,
          opacity: 1,
          duration: 0.28,
          stagger: 0.025,
          ease: "power3.out",
        })
      })

      const leave = safe(() => {
        mx(50)
        my(50)
        tiltX(0)
        tiltY(0)
        gsap.to(card.querySelector(".project-preview"), {
          y: 0,
          scale: 1,
          duration: 0.32,
          ease: "power3.out",
        })
        gsap.to(card.querySelectorAll(".project-token"), {
          y: 0,
          opacity: 0.78,
          duration: 0.22,
          ease: "power3.out",
        })
      })

      card.addEventListener("pointermove", move)
      card.addEventListener("pointerenter", enter)
      card.addEventListener("pointerleave", leave)

      return () => {
        card.removeEventListener("pointermove", move)
        card.removeEventListener("pointerenter", enter)
        card.removeEventListener("pointerleave", leave)
      }
    })

    return () => {
      disposers.forEach((dispose) => dispose())
    }
  }, { scope: sectionRef })

  return (
    <section id="projects" ref={sectionRef} className="magazine-page relative px-6 py-32 lg:px-10 lg:py-40">
      <div className="absolute left-0 top-0 h-full w-full text-foreground/25 swiss-dots-fine pointer-events-none" />
      <VerticalText text="PROJECTS" side="right" className="opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-end">
          <div>
            <SectionLabel number="02" title="PROJECTS" />
            <h2 className="font-editorial text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
              精选项目
            </h2>
          </div>
          <p className="border-l border-accent/70 pl-6 text-sm leading-7 text-muted-foreground">
            把项目当作一组可阅读的展板：先给问题和技术面，再给入口。没有图片时，用目录化排版保持作品集的可信度。
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-12">
            {projects.map((project, index) => (
            <div
              key={project.title}
              className={`project-card project-motion-card group relative overflow-hidden border border-foreground/12 bg-background/55 p-7 transition-colors duration-300 hover:border-accent/55 ${
                index === 0 ? "lg:col-span-6 lg:row-span-2 lg:min-h-[34rem]" : "lg:col-span-3"
              }`}
            >
              <div className="project-index absolute right-5 top-4 font-editorial-latin text-7xl font-bold leading-none text-foreground/[0.04]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10 mb-8 flex items-center gap-2">
                <BracketLabel hover={false}>{project.category}</BracketLabel>
                <BracketLabel hover={false} className="text-[0.6rem]">
                  {project.date}
                </BracketLabel>
              </div>

              <div
                className={`project-preview relative mb-8 flex items-end border border-foreground/10 bg-card/70 p-5 ${
                  index === 0 ? "h-56 lg:h-72" : "h-36"
                }`}
              >
                <span className="font-editorial-latin text-6xl font-bold leading-none text-accent/35 select-none lg:text-8xl">
                  {project.title.slice(0, 1)}
                </span>
                <span className="absolute bottom-5 right-5 max-w-[8rem] text-right font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {project.technologies.slice(0, 2).join(" / ")}
                </span>
              </div>

              <h3 className="font-editorial text-3xl font-semibold tracking-normal text-foreground transition-colors group-hover:text-accent">
                {project.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {project.description}
              </p>

              <div className="my-7 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <BracketLabel key={tech} hover={false} className="project-token text-[0.6rem]">
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
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            ))}
          </div>
        ) : (
          <div className="project-card magazine-paper grid min-h-[24rem] place-items-center border border-foreground/12 p-8 text-center">
            <div className="max-w-xl">
              <BookOpen className="mx-auto mb-8 h-8 w-8 text-accent" />
              <BracketLabel hover={false} className="text-accent">
                PROJECTS WILL BE ADDED LATER
              </BracketLabel>
              <h3 className="mt-6 font-editorial text-4xl font-semibold leading-tight text-foreground">
                项目先留空。
              </h3>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                我会等到有真实代码、真实问题和可说明的个人贡献后，再把 Agent 相关项目放到这里。
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
