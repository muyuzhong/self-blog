"use client"

import { useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { VerticalText } from "@/components/shared/VerticalText"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { skills } from "@/lib/data"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

const groups = [
  { key: "all", label: "全部", title: "完整能力坐标" },
  { key: "agent", label: "Agent", title: "任务编排与工具调用" },
  { key: "knowledge", label: "Knowledge", title: "知识系统与评估" },
  { key: "interface", label: "Interface", title: "界面与交互层" },
  { key: "execution", label: "Execution", title: "脚本与执行层" },
] as const

type GroupKey = (typeof groups)[number]["key"]

const nodeMeta = [
  {
    x: 50,
    y: 15,
    group: "agent",
    summary: "把复杂任务拆成可执行步骤，关注流程、状态和失败后的恢复路径。",
    next: "继续补足真实项目中的任务编排和观察指标。",
  },
  {
    x: 76,
    y: 27,
    group: "agent",
    summary: "把模型回答和外部工具连接起来，重点是参数、错误处理和结果回填。",
    next: "强化工具 schema 设计和调用后的验证闭环。",
  },
  {
    x: 82,
    y: 57,
    group: "knowledge",
    summary: "把知识库、检索、引用和生成回答连成一条可追踪链路。",
    next: "继续整理检索质量、引用准确性和失败样本分析。",
  },
  {
    x: 62,
    y: 82,
    group: "knowledge",
    summary: "关注 Agent 是否真的完成任务，而不是只看一次漂亮输出。",
    next: "补充 benchmark、trace 和可复现实验记录。",
  },
  {
    x: 31,
    y: 78,
    group: "interface",
    summary: "用 React 和 TypeScript 把复杂状态组织成可维护的界面体验。",
    next: "继续把交互设计、组件边界和性能优化结合起来。",
  },
  {
    x: 17,
    y: 51,
    group: "execution",
    summary: "用 Python 做脚本、数据处理和自动化实验，服务工程验证。",
    next: "沉淀更多可复用工具脚本和实验流水线。",
  },
  {
    x: 25,
    y: 24,
    group: "interface",
    summary: "用 Next.js 承载静态内容、页面结构和可发布的作品集体验。",
    next: "继续提升站点内容系统、构建验证和部署稳定性。",
  },
  {
    x: 50,
    y: 50,
    group: "agent",
    summary: "把问题描述转成模型能稳定执行的工作上下文。",
    next: "减少提示词技巧感，更多依赖结构化流程和可验证输出。",
  },
] satisfies Array<{
  x: number
  y: number
  group: Exclude<GroupKey, "all">
  summary: string
  next: string
}>

function getLevelLabel(level: number) {
  if (level >= 90) return "CORE"
  if (level >= 75) return "SHIPPING"
  if (level >= 60) return "WORKING"
  return "LEARNING"
}

export function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeGroup, setActiveGroup] = useState<GroupKey>("all")

  const nodes = useMemo(
    () =>
      skills.map((skill, index) => ({
        ...skill,
        ...nodeMeta[index % nodeMeta.length],
      })),
    []
  )
  const activeNode = nodes[activeIndex] ?? nodes[0]
  const groupTitle = groups.find((group) => group.key === activeGroup)?.title ?? groups[0].title

  useGSAP((context, contextSafe) => {
    const map = mapRef.current
    const nodeEls = (context.selector?.(".capability-node") ?? []) as HTMLElement[]
    if (!map || nodeEls.length === 0) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const safe = contextSafe ?? (<T extends (...args: any[]) => any>(fn: T) => fn)

    gsap.from(nodeEls, {
      autoAlpha: 0,
      scale: prefersReduced ? 1 : 0.45,
      xPercent: prefersReduced ? 0 : -8,
      yPercent: prefersReduced ? 0 : 10,
      duration: prefersReduced ? 0 : 0.7,
      stagger: 0.055,
      ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 72%",
      },
    })

    const mapX = gsap.quickTo(map, "--map-x", { duration: prefersReduced ? 0 : 0.45, ease: "power3.out" })
    const mapY = gsap.quickTo(map, "--map-y", { duration: prefersReduced ? 0 : 0.45, ease: "power3.out" })

    const move = safe((event: PointerEvent) => {
      const rect = map.getBoundingClientRect()
      mapX(((event.clientX - rect.left) / rect.width - 0.5) * 2)
      mapY(((event.clientY - rect.top) / rect.height - 0.5) * 2)
    })

    const leave = safe(() => {
      mapX(0)
      mapY(0)
    })

    map.addEventListener("pointermove", move)
    map.addEventListener("pointerleave", leave)

    return () => {
      map.removeEventListener("pointermove", move)
      map.removeEventListener("pointerleave", leave)
    }
  }, { scope: sectionRef })

  const selectGroup = (groupKey: GroupKey) => {
    setActiveGroup(groupKey)
    if (groupKey === "all") return
    const index = nodes.findIndex((node) => node.group === groupKey)
    if (index >= 0) setActiveIndex(index)
  }

  return (
    <section id="techstack" ref={sectionRef} className="capability-section magazine-page relative px-6 py-32 lg:px-10 lg:py-40">
      <VerticalText text="STACK" side="left" className="opacity-40" />
      <div className="capability-field-bg" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-end">
          <div>
            <SectionLabel number="03" title="TECHSTACK" />
            <h2 className="font-editorial text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-6xl lg:text-7xl">
              技术能力
            </h2>
          </div>
          <p className="max-w-2xl border-l border-accent/70 pl-6 text-sm leading-7 text-muted-foreground">
            不把技术堆成清单，而是把它们放回 Agent 工程的能力坐标里。节点之间的距离、轨道和档案面板，表达这些能力如何一起工作。
          </p>
        </div>

        <div className="capability-group-rail" aria-label="能力域筛选">
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              className={cn("capability-group", activeGroup === group.key && "is-active")}
              onClick={() => selectGroup(group.key)}
              data-cursor-hover
            >
              [{group.label}]
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-stretch">
          <div ref={mapRef} className="capability-map">
            <div className="capability-orbit capability-orbit-a" />
            <div className="capability-orbit capability-orbit-b" />
            <div className="capability-orbit capability-orbit-c" />

            <svg className="capability-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {nodes.map((node, index) => {
                const highlighted =
                  index === activeIndex ||
                  node.group === activeNode.group ||
                  (activeGroup !== "all" && node.group === activeGroup)

                return (
                  <line
                    key={`${node.name}-${index}`}
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                    className={cn("capability-line", highlighted && "is-active")}
                  />
                )
              })}
            </svg>

            <button
              type="button"
              className="capability-core"
              onClick={() => selectGroup("all")}
              data-cursor-hover
            >
              <span>Agent</span>
              <span>Engineering Core</span>
            </button>

            {nodes.map((node, index) => {
              const isActive = index === activeIndex
              const isMuted = activeGroup !== "all" && node.group !== activeGroup

              return (
                <button
                  key={node.name}
                  type="button"
                  className={cn("capability-node", isActive && "is-active", isMuted && "is-muted")}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    ["--level" as string]: node.level,
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => {
                    setActiveIndex(index)
                    setActiveGroup(node.group)
                  }}
                  data-cursor-hover
                >
                  <span className="capability-node-dot" />
                  <span className="capability-node-label">{node.name}</span>
                </button>
              )
            })}
          </div>

          <aside className="capability-dossier">
            <div className="capability-dossier-map" aria-hidden="true" />
            <div className="relative z-10">
              <BracketLabel hover={false} className="text-accent">
                {groupTitle}
              </BracketLabel>
              <h3 className="mt-7 font-editorial text-4xl font-semibold leading-tight text-foreground">
                {activeNode.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {activeNode.summary}
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <div className="mb-4 grid grid-cols-[1fr_auto] items-end gap-4">
                <div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                    DELIVERY SIGNAL
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <BracketLabel hover={false}>{activeNode.category}</BracketLabel>
                    <BracketLabel hover={false}>{getLevelLabel(activeNode.level)}</BracketLabel>
                  </div>
                </div>
                <span className="font-editorial-latin text-6xl font-bold leading-none text-accent">
                  {activeNode.level}
                </span>
              </div>
              <div className="capability-meter" style={{ ["--level" as string]: `${activeNode.level}%` }}>
                <span />
              </div>
              <p className="mt-6 border-l border-accent/55 pl-5 text-sm leading-7 text-muted-foreground">
                {activeNode.next}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
