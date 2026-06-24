import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { CustomCursor } from "@/components/effects/CustomCursor"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { ChatBot } from "@/components/effects/ChatBot"
import { MotionProgress } from "@/components/effects/MotionProgress"

const {
  SITE_DESCRIPTION: siteDescription,
  SITE_TITLE: siteTitle,
  SITE_URL: siteUrl,
  getBlogPosts: getSeoPosts,
} = require("../../scripts/seo-assets.cjs") as {
  SITE_DESCRIPTION: string
  SITE_TITLE: string
  SITE_URL: string
  getBlogPosts: (rootDir?: string) => Array<{
    title: string
    excerpt: string
    tags: string[]
    published: string
    modified: string
    url: string
  }>
}

const ogImage = "/og-image.png"

function getStructuredData() {
  const personId = `${siteUrl}/#person`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "暮羽中个人网站",
        url: siteUrl,
        description: "记录 Agent 开发学习、技术笔记和实习准备。",
        inLanguage: "zh-CN",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "暮羽中",
        url: siteUrl,
        jobTitle: "Agent 开发学习者",
        sameAs: ["https://github.com/muyuzhong"],
        description: "正在学习 Agent 开发并寻找相关实习机会。",
      },
      ...getSeoPosts(process.cwd()).map((post) => ({
        "@type": "Article",
        "@id": `${post.url}#article`,
        headline: post.title,
        description: post.excerpt,
        url: post.url,
        image: new URL(ogImage, siteUrl).toString(),
        datePublished: post.published,
        dateModified: post.modified,
        inLanguage: "zh-CN",
        keywords: post.tags,
        author: { "@id": personId },
        publisher: { "@id": personId },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": post.url,
        },
      })),
    ],
  }
}

export const viewport: Viewport = {
  themeColor: "#1b1b1b",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { default: siteTitle, template: "%s | 暮羽中" },
  description: siteDescription,
  keywords: ["Agent 开发", "AI Agent", "实习", "Next.js", "React", "TypeScript", "暮羽中", "个人网站", "技术博客"],
  authors: [{ name: "暮羽中" }],
  creator: "暮羽中",
  metadataBase: new URL(siteUrl),
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "暮羽中个人网站",
    title: siteTitle,
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "暮羽中个人网站预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark" style={{ ["--font-sans" as string]: "Inter, system-ui, -apple-system, sans-serif", ["--font-mono" as string]: "JetBrains Mono, ui-monospace, monospace" }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif+SC:wght@500;600;700;900&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredData()),
          }}
        />
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          <MotionProgress />
          {children}
        </ThemeProvider>
        <Toaster />
        <ChatBot />
      </body>
    </html>
  )
}
