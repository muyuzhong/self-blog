import type { Metadata } from "next"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Projects } from "@/components/sections/Projects"
import { TechStack } from "@/components/sections/TechStack"
import { Blog } from "@/components/sections/Blog"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"
import { getSeriesPosts, getStandaloneBlogPosts } from "@/lib/blog"

const SERIES_NAME = "Harness 工程札记"

export const metadata: Metadata = {
  title: "暮羽中 | Agent 开发学习者",
  description: "暮羽中的个人网站，记录 Agent 开发学习、技术笔记和实习准备。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://muyuzhong.xyz",
    title: "暮羽中 | Agent 开发学习者",
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "暮羽中个人网站预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "暮羽中 | Agent 开发学习者",
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
    images: ["/og-image.png"],
  },
}

export default async function Home() {
  const [posts, seriesPosts] = await Promise.all([
    getStandaloneBlogPosts(),
    getSeriesPosts(SERIES_NAME),
  ])

  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <TechStack />
      <Blog posts={posts} seriesPosts={seriesPosts} />
      <Contact />
      <Footer />
    </main>
  )
}
