import type { Metadata } from "next"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Projects } from "@/components/sections/Projects"
import { TechStack } from "@/components/sections/TechStack"
import { Blog } from "@/components/sections/Blog"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"
import { getAllBlogPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "暮羽中 | Agent 开发学习者",
  description: "暮羽中的个人网站，记录 Agent 开发学习、技术笔记和实习准备。",
  openGraph: {
    url: "https://muyuzhong.xyz",
    title: "暮羽中 | Agent 开发学习者",
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
  },
}

export default async function Home() {
  const posts = await getAllBlogPosts()

  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <TechStack />
      <Blog posts={posts} />
      <Contact />
      <Footer />
    </main>
  )
}
