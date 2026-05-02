export const personalData = {
  name: "暮羽中",
  title: "全栈开发者 & 开源爱好者",
  tagline: "用代码构建数字世界的无限可能",
  bio: "热爱技术的全栈开发者，专注于高性能 Web 应用和 AI 工具开发。相信优雅的代码和极致的用户体验同样重要。在开源社区持续贡献，享受解决复杂问题的过程。",
  email: "2416118206@qq.com",
  github: "https://github.com/muyuzhong",
  twitter: "https://twitter.com/muyuzhong",
  resumeUrl: "/resume.pdf",
}

export const personalInfo = {
  ...personalData,
  stats: [
    { label: "年经验", value: "5+" },
    { label: "项目", value: "20+" },
    { label: "开源贡献", value: "50+" },
  ],
}

export const experiences = [
  {
    company: "星辰科技",
    role: "高级前端工程师",
    period: "2023 - 至今",
    description: "负责公司核心产品的前端架构设计与性能优化，带领 5 人团队完成微前端改造，首屏加载时间减少 60%。",
  },
  {
    company: "云图数据",
    role: "全栈开发工程师",
    period: "2021 - 2023",
    description: "独立负责数据可视化平台的前后端开发，使用 Next.js + Python 构建实时数据处理 pipeline，服务 10万+ 日活用户。",
  },
  {
    company: "初创工作室",
    role: "前端开发实习生",
    period: "2020 - 2021",
    description: "参与多个电商项目的前端开发，深入理解 React 生态和前端工程化实践。",
  },
]

export const projects = [
  {
    title: "Nebula Dashboard",
    category: "Visualization",
    date: "2024",
    description: "基于 WebGL 的实时数据可视化大屏，支持 3D 地球数据映射和动态粒子效果。",
    technologies: ["Next.js", "Three.js", "WebSocket", "D3.js"],
    tags: ["Next.js", "Three.js", "WebSocket", "D3.js"],
    image: "/images/project-nebula.jpg",
    link: "https://github.com/muyuzhong/nebula-dashboard",
    demo: "https://nebula-demo.vercel.app",
  },
  {
    title: "AI Code Assistant",
    category: "AI Tool",
    date: "2024",
    description: "智能代码补全和重构工具，支持多种编程语言的上下文感知建议。",
    technologies: ["TypeScript", "Python", "OpenAI API", "VS Code Extension"],
    tags: ["TypeScript", "Python", "OpenAI API", "VS Code Extension"],
    image: "/images/project-ai-code.jpg",
    link: "https://github.com/muyuzhong/ai-code-assistant",
    demo: "https://ai-code-assistant.vercel.app",
  },
  {
    title: "Social Graph",
    category: "Data",
    date: "2023",
    description: "社交网络关系图谱可视化工具，支持力导向图布局和社区发现算法。",
    technologies: ["React", "D3.js", "GraphQL", "Neo4j"],
    tags: ["React", "D3.js", "GraphQL", "Neo4j"],
    image: "/images/project-social.jpg",
    link: "https://github.com/muyuzhong/social-graph",
    demo: "https://social-graph-demo.vercel.app",
  },
  {
    title: "Terminal Portfolio",
    category: "Web App",
    date: "2023",
    description: "终端风格的个人作品集，支持命令行交互和文件系统导航。",
    technologies: ["Vue.js", "Xterm.js", "Node.js"],
    tags: ["Vue.js", "Xterm.js", "Node.js"],
    image: "/images/project-terminal.jpg",
    link: "https://github.com/muyuzhong/terminal-portfolio",
    demo: "https://terminal-portfolio.vercel.app",
  },
]

export const techStack = [
  { name: "TypeScript", category: "Language", level: 95 },
  { name: "React / Next.js", category: "Frontend", level: 95 },
  { name: "Node.js", category: "Backend", level: 90 },
  { name: "Python", category: "Language", level: 85 },
  { name: "Three.js / WebGL", category: "Graphics", level: 80 },
  { name: "PostgreSQL", category: "Database", level: 85 },
  { name: "Docker / K8s", category: "DevOps", level: 75 },
  { name: "GraphQL", category: "API", level: 80 },
  { name: "Tailwind CSS", category: "Styling", level: 95 },
  { name: "Rust", category: "Language", level: 65 },
]

export const skills = techStack

