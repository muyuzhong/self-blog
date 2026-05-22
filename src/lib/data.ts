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
    title: "Motion Prototype 01",
    category: "Interaction",
    date: "Draft",
    description: "Placeholder card for testing layered GSAP motion and pointer response.",
    technologies: ["GSAP", "ScrollTrigger", "React"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Motion Prototype 02",
    category: "Interface",
    date: "Draft",
    description: "Placeholder card reserved for future project evidence and richer content.",
    technologies: ["Next.js", "Timeline", "UI"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Motion Prototype 03",
    category: "Archive",
    date: "Draft",
    description: "Placeholder card used to validate hover depth, stagger, and visual rhythm.",
    technologies: ["GSAP", "Pointer", "CSS"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Motion Prototype 04",
    category: "System",
    date: "Draft",
    description: "Placeholder card for experimenting with motion without final project copy.",
    technologies: ["React", "GSAP", "Motion"],
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
