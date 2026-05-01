import type { Metadata } from "next"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Projects } from "@/components/sections/Projects"
import { TechStack } from "@/components/sections/TechStack"
import { Blog } from "@/components/sections/Blog"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"

export const metadata: Metadata = {
  title: "暮羽中 | 全栈开发者",
  description: "用代码构建数字世界的无限可能。专注于高性能 Web 应用和 AI 工具开发的全栈开发者。",
  openGraph: {
    url: "https://muyuzhong.dev",
    title: "暮羽中 | 全栈开发者",
    description: "用代码构建数字世界的无限可能。专注于高性能 Web 应用和 AI 工具开发。",
  },
}

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <TechStack />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
