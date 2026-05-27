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
  dossier?: string
  visual?: "semantic-search"
}> = [
  {
    title: "Orbit Prototype 01",
    category: "River",
    date: "Draft",
    description: "用于测试流动式项目卡片、磁吸悬浮和横向浏览动效的占位项目。",
    technologies: ["GSAP", "ScrollTrigger", "3D"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "GH Semantic Search Skill",
    category: "Skill",
    date: "2026",
    description: "一个用于按架构意图搜索 GitHub 项目的小型 skill：扩展检索词、读取 README，并按语义相关性重排结果。",
    technologies: ["Claude Skill", "GitHub CLI", "Semantic Search"],
    tags: ["skill", "github", "agent"],
    image: "",
    link: "https://github.com/muyuzhong/gh-semantic-search-skill",
    dossier: "这个 skill 把“按架构思想找项目”变成一条可执行流程：扩展搜索词、并行查询 GitHub、读取 README，并按语义相关性重排结果。",
    visual: "semantic-search",
  },
  {
    title: "Dossier Prototype 03",
    category: "Flip",
    date: "Draft",
    description: "用于验证卡片翻面、背面档案内容和分层档案样式的占位项目。",
    technologies: ["CSS 3D", "GSAP", "State"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Signal Prototype 04",
    category: "Scroll",
    date: "Draft",
    description: "用于实验滚动进度、横向切换和电影感场景推进的占位项目。",
    technologies: ["Pin", "Scrub", "Timeline"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Depth Prototype 05",
    category: "Space",
    date: "Draft",
    description: "用于测试前景、背景和卡片景深关系的占位项目。",
    technologies: ["Perspective", "Transform", "Layer"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
  {
    title: "Archive Prototype 06",
    category: "Index",
    date: "Draft",
    description: "用于预留未来项目截图、证据链接和更完整项目记录的占位项目。",
    technologies: ["Next.js", "UI", "Motion"],
    tags: ["prototype"],
    image: "",
    link: "https://github.com/muyuzhong",
  },
]

export const techStack = [
  { name: "LangGraph", category: "Agent", level: 76 },
  { name: "LangChain", category: "Agent", level: 72 },
  { name: "Tool Calling", category: "Agent", level: 74 },
  { name: "RAG Pipeline", category: "Knowledge", level: 73 },
  { name: "Vector DB", category: "Knowledge", level: 66 },
  { name: "Evaluation Trace", category: "Knowledge", level: 64 },
  { name: "Go", category: "Backend", level: 68 },
  { name: "Gin", category: "Backend", level: 65 },
  { name: "PostgreSQL", category: "Backend", level: 62 },
  { name: "Python", category: "Execution", level: 70 },
  { name: "TypeScript React", category: "Interface", level: 76 },
  { name: "Next.js", category: "Interface", level: 72 },
  { name: "Prompt Design", category: "Agent", level: 74 },
  { name: "Observability", category: "Agent", level: 63 },
]

export const skills = techStack
