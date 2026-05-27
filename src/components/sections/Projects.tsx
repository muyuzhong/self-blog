"use client"

import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Rotate3D } from "lucide-react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { projects } from "@/lib/data"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const moveProjectRef = useRef<(index: number, immediate?: boolean) => void>(() => {})
  const [activeIndex, setActiveIndex] = useState(0)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  useGSAP((context, contextSafe) => {
    const track = trackRef.current
    const viewport = viewportRef.current
    const cards = (context.selector?.(".project-river-card") ?? []) as HTMLElement[]
    if (!track || !viewport || cards.length === 0) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const safe = contextSafe ?? (<T extends (...args: any[]) => any>(fn: T) => fn)
    const clampIndex = (index: number) => gsap.utils.clamp(0, projects.length - 1, index)
    const trackTo = gsap.quickTo(track, "x", {
      duration: prefersReduced ? 0 : 0.72,
      ease: "expo.out",
    })

    const moveToIndex = (index: number, immediate = false) => {
      const next = clampIndex(index)
      const card = cards[next]
      if (!card) return

      const maxTravel = Math.max(0, track.scrollWidth - viewport.clientWidth)
      const centered = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2
      const x = -gsap.utils.clamp(0, maxTravel, centered)

      activeIndexRef.current = next
      setActiveIndex(next)
      if (immediate) gsap.set(track, { x })
      else trackTo(x)
    }

    moveProjectRef.current = moveToIndex

    gsap.set(cards, {
      transformPerspective: 1200,
      transformOrigin: "50% 50%",
      z: (index) => (index % 2 === 0 ? 80 : 24),
      rotationY: (index) => (index % 2 === 0 ? -10 : 12),
      rotationZ: (index) => (index % 3 - 1) * 2,
    })

    if (!prefersReduced) {
      gsap.from(cards, {
        autoAlpha: 0,
        y: 90,
        z: -420,
        rotationX: -18,
        duration: 1.05,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      })
    }

    moveToIndex(activeIndexRef.current, true)

    const onResize = () => moveToIndex(activeIndexRef.current, true)
    window.addEventListener("resize", onResize)

    let edgeDirection = 0
    let edgeDelay: gsap.core.Tween | null = null

    const scheduleEdgeMove = () => {
      edgeDelay?.kill()
      edgeDelay = gsap.delayedCall(0.42, () => {
        if (edgeDirection === 0) return
        moveToIndex(activeIndexRef.current + edgeDirection)
        scheduleEdgeMove()
      })
    }

    const startEdgeMove = (direction: number) => {
      if (direction === 0 || direction === edgeDirection) return
      edgeDirection = direction
      scheduleEdgeMove()
    }

    const stopEdgeMove = () => {
      edgeDirection = 0
      edgeDelay?.kill()
      edgeDelay = null
    }

    const onViewportMove = safe((event: PointerEvent) => {
      if (window.innerWidth < 1024) return
      const rect = viewport.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      if (px < 0.16) startEdgeMove(-1)
      else if (px > 0.84) startEdgeMove(1)
      else stopEdgeMove()
    })

    viewport.addEventListener("pointermove", onViewportMove)
    viewport.addEventListener("pointerleave", stopEdgeMove)

    const disposers = cards.map((card) => {
      const xTo = gsap.quickTo(card, "x", { duration: prefersReduced ? 0 : 0.35, ease: "power3.out" })
      const yTo = gsap.quickTo(card, "y", { duration: prefersReduced ? 0 : 0.35, ease: "power3.out" })
      const rotateXTo = gsap.quickTo(card, "rotationX", { duration: prefersReduced ? 0 : 0.34, ease: "power3.out" })
      const rotateYTo = gsap.quickTo(card, "rotationY", { duration: prefersReduced ? 0 : 0.34, ease: "power3.out" })
      const mx = gsap.quickTo(card, "--mx", { duration: prefersReduced ? 0 : 0.22, ease: "power3.out" })
      const my = gsap.quickTo(card, "--my", { duration: prefersReduced ? 0 : 0.22, ease: "power3.out" })

      const move = safe((event: PointerEvent) => {
        const rect = card.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        mx(px * 100)
        my(py * 100)
        xTo((px - 0.5) * 38)
        yTo((py - 0.5) * 24)
        rotateXTo((0.5 - py) * 9)
        rotateYTo((px - 0.5) * 14)
      })

      const enter = safe(() => {
        card.style.zIndex = "20"
        gsap.to(card, {
          scale: prefersReduced ? 1 : 1.035,
          z: prefersReduced ? 0 : 110,
          duration: 0.42,
          ease: "expo.out",
        })
        gsap.to(card.querySelectorAll(".project-river-token"), {
          y: prefersReduced ? 0 : -5,
          autoAlpha: 1,
          duration: 0.26,
          stagger: 0.025,
          ease: "power3.out",
        })
      })

      const leave = safe(() => {
        const index = Number(card.dataset.index ?? 0)
        card.style.zIndex = ""
        mx(50)
        my(50)
        xTo(0)
        yTo(0)
        rotateXTo(0)
        rotateYTo(index % 2 === 0 ? -10 : 12)
        gsap.to(card, {
          scale: 1,
          z: index % 2 === 0 ? 80 : 24,
          duration: 0.36,
          ease: "power3.out",
        })
        gsap.to(card.querySelectorAll(".project-river-token"), {
          y: 0,
          autoAlpha: 0.78,
          duration: 0.2,
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
      window.removeEventListener("resize", onResize)
      viewport.removeEventListener("pointermove", onViewportMove)
      viewport.removeEventListener("pointerleave", stopEdgeMove)
      stopEdgeMove()
      disposers.forEach((dispose) => dispose())
    }
  }, { scope: sectionRef })

  const moveProject = (offset: number) => {
    moveProjectRef.current(activeIndexRef.current + offset)
  }

  const selectProject = (index: number) => {
    moveProjectRef.current(index)
  }

  const toggleFlip = (title: string, index: number) => {
    moveProjectRef.current(index)
    setFlipped((current) => ({ ...current, [title]: !current[title] }))
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="project-river-section magazine-page relative min-h-screen overflow-hidden px-6 py-24 lg:px-10 lg:py-0"
    >
      <div className="absolute inset-0 text-foreground/25 swiss-dots-fine pointer-events-none" />
      <div className="project-river-orbit project-river-orbit-a" />
      <div className="project-river-orbit project-river-orbit-b" />
      <VerticalText text="PROJECTS" side="right" className="opacity-40" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12">
        <div className="project-river-heading grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-end">
          <div>
            <SectionLabel number="02" title="PROJECTS" />
            <h2 className="font-editorial text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
              精选项目
            </h2>
          </div>
          <div className="hidden border-l border-accent/70 pl-6 text-right lg:block">
            <span className="font-editorial-latin text-6xl font-bold leading-none text-accent">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mt-2 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {projects.length > 0 ? (
          <div ref={viewportRef} className="project-river-viewport">
            <button
              type="button"
              className="project-river-nav project-river-nav-prev"
              onClick={() => moveProject(-1)}
              disabled={activeIndex === 0}
              aria-label="Previous project"
              data-cursor-hover
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="project-river-nav project-river-nav-next"
              onClick={() => moveProject(1)}
              disabled={activeIndex === projects.length - 1}
              aria-label="Next project"
              data-cursor-hover
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="project-river-edge project-river-edge-left" aria-hidden="true" />
            <div className="project-river-edge project-river-edge-right" aria-hidden="true" />

            <div ref={trackRef} className="project-river-track">
              {projects.map((project, index) => {
                const isFlipped = Boolean(flipped[project.title])

                return (
                  <article
                    key={project.title}
                    data-index={index}
                    className={cn(
                      "project-river-card group",
                      index === activeIndex && "project-river-card-active",
                      isFlipped && "is-flipped"
                    )}
                    data-cursor-hover
                  >
                    <button
                      type="button"
                      className="project-river-flip"
                      onClick={() => toggleFlip(project.title, index)}
                      aria-label={`Flip ${project.title}`}
                    >
                      <span className="project-river-face project-river-front">
                        <span className="project-river-meta">
                          <BracketLabel hover={false}>{project.category}</BracketLabel>
                          <BracketLabel hover={false} className="text-[0.6rem]">
                            {project.date}
                          </BracketLabel>
                        </span>
                        <span className="project-river-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "project-river-preview",
                            project.visual === "semantic-search" && "project-river-preview-semantic",
                          )}
                        >
                          {project.visual === "semantic-search" ? (
                            <span className="project-semantic-visual" aria-hidden="true">
                              <span className="project-semantic-query">intent</span>
                              <span className="project-semantic-line project-semantic-line-a" />
                              <span className="project-semantic-line project-semantic-line-b" />
                              <span className="project-semantic-node project-semantic-node-a">GitHub</span>
                              <span className="project-semantic-node project-semantic-node-b">README</span>
                              <span className="project-semantic-rank">
                                <span />
                                <span />
                                <span />
                              </span>
                            </span>
                          ) : (
                            <>
                              <span className="project-river-letter">{project.title.slice(0, 1)}</span>
                              <span className="project-river-scan" />
                            </>
                          )}
                          <Rotate3D className="absolute right-5 top-5 h-5 w-5 text-accent/70" />
                        </span>
                        <span className="block text-left">
                          <span className="block font-editorial text-4xl font-semibold leading-tight tracking-normal text-foreground transition-colors group-hover:text-accent">
                            {project.title}
                          </span>
                          <span className="mt-4 block text-sm leading-7 text-muted-foreground">
                            {project.description}
                          </span>
                        </span>
                        <span className="project-river-token-row">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="project-river-token">
                              [{tech}]
                            </span>
                          ))}
                        </span>
                      </span>

                      <span className="project-river-face project-river-back">
                        <span className="project-river-back-grid" />
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                          DOSSIER / {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-8 block font-editorial text-4xl font-semibold leading-tight text-foreground">
                          {project.title}
                        </span>
                        <span className="mt-6 block text-left text-sm leading-7 text-muted-foreground">
                          {project.dossier ??
                            "这一面先留给之后的项目证据、截图、架构说明和真实链接。现在只作为交互动效占位。"}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.12em] text-foreground">
                          返回正面
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    </button>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-river-link"
                      data-cursor-hover
                    >
                      OPEN
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </article>
                )
              })}
            </div>

            <div className="project-river-controls" aria-label="Project selector">
              {projects.map((project, index) => (
                <button
                  key={project.title}
                  type="button"
                  className={cn("project-river-dot", index === activeIndex && "is-active")}
                  onClick={() => selectProject(index)}
                  aria-label={`查看 ${project.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="magazine-paper grid min-h-[24rem] place-items-center border border-foreground/12 p-8 text-center">
            <div className="max-w-xl">
              <BookOpen className="mx-auto mb-8 h-8 w-8 text-accent" />
              <BracketLabel hover={false} className="text-accent">
                PROJECTS WILL BE ADDED LATER
              </BracketLabel>
              <h3 className="mt-6 font-editorial text-4xl font-semibold leading-tight text-foreground">
                Projects are intentionally empty for now.
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
