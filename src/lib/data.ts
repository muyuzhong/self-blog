export const personalData = {
  name: "暮羽中",
  title: "Agent 开发学习者 / 寻找实习",
  tagline: "学习如何让模型、工具与工作流可靠地协作",
  bio: "我正在系统学习 Agent 开发，关注工具调用、任务编排、记忆设计、评估与可观测性。这个网站会逐步记录我的学习笔记、实验过程和未来可以公开展示的项目。目前我正在寻找 Agent 方向的实习机会，希望在真实工程环境里把学习沉淀成可交付的能力。",
  email: "2416118206@qq.com",
  github: "https://github.com/muyuzhong",
  twitter: "https://twitter.com/muyuzhong",
  resumeUrl: "/resume.pdf",
}

export const personalInfo = {
  ...personalData,
  stats: [
    { label: "方向", value: "Agent" },
    { label: "状态", value: "实习" },
    { label: "项目", value: "待补" },
  ],
}

export const experiences: Array<{
  company: string
  role: string
  period: string
  description: string
}> = []

export const projects: Array<{
  title: string
  category: string
  date: string
  description: string
  technologies: string[]
  tags: string[]
  image: string
  link: string
  demo?: string
}> = [
  {
    title: "Orbit Prototype 01",
    category: "River",
    date: "Draft",
    description: "Placeholder for testing a flowing project stream, magnetic hover, and scroll-linked motion.",
    technologies: ["GSAP", "ScrollTrigger", "3D"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Magnet Prototype 02",
    category: "Hover",
    date: "Draft",
    description: "Placeholder reserved for a project card that can be pulled forward from the motion field.",
    technologies: ["Pointer", "quickTo", "React"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Dossier Prototype 03",
    category: "Flip",
    date: "Draft",
    description: "Placeholder used to validate flip states, back-face content, and layered archive styling.",
    technologies: ["CSS 3D", "GSAP", "State"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Signal Prototype 04",
    category: "Scroll",
    date: "Draft",
    description: "Placeholder for experimenting with pinned scroll progress and a cinematic horizontal flow.",
    technologies: ["Pin", "Scrub", "Timeline"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Depth Prototype 05",
    category: "Space",
    date: "Draft",
    description: "Placeholder for testing foreground and background depth without adding final content.",
    technologies: ["Perspective", "Transform", "Layer"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Archive Prototype 06",
    category: "Index",
    date: "Draft",
    description: "Placeholder for future screenshots, evidence links, and richer project notes.",
    technologies: ["Next.js", "UI", "Motion"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
]

export const techStack = [
  { name: "Agent 工作流", category: "Agent", level: 75 },
  { name: "工具调用与函数接口", category: "Agent", level: 72 },
  { name: "RAG 与知识库", category: "AI", level: 70 },
  { name: "评估与可观测性", category: "Agent", level: 62 },
  { name: "TypeScript / React", category: "Frontend", level: 76 },
  { name: "Python", category: "Language", level: 70 },
  { name: "Next.js", category: "Frontend", level: 72 },
  { name: "Prompt 设计", category: "AI", level: 74 },
]

export const skills = techStack
