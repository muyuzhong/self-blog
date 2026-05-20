import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { CustomCursor } from "@/components/effects/CustomCursor"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { ChatBot } from "@/components/effects/ChatBot"

export const viewport: Viewport = {
  themeColor: "#1b1b1b",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { default: "暮羽中 | Agent 开发学习者", template: "%s | 暮羽中" },
  description: "暮羽中的个人网站，记录 Agent 开发学习、技术笔记和实习准备。",
  keywords: ["Agent 开发", "AI Agent", "实习", "Next.js", "React", "TypeScript", "暮羽中", "个人网站", "技术博客"],
  authors: [{ name: "暮羽中" }],
  creator: "暮羽中",
  metadataBase: new URL("https://muyuzhong.xyz"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "暮羽中个人网站",
    title: "暮羽中 | Agent 开发学习者",
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
  },
  twitter: {
    card: "summary_large_image",
    title: "暮羽中 | Agent 开发学习者",
    description: "记录 Agent 开发学习、技术笔记和实习准备。",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "暮羽中个人网站",
                  url: "https://muyuzhong.xyz",
                  description: "记录 Agent 开发学习、技术笔记和实习准备。",
                  inLanguage: "zh-CN",
                },
                {
                  "@type": "Person",
                  name: "暮羽中",
                  url: "https://muyuzhong.xyz",
                  jobTitle: "Agent 开发学习者",
                  sameAs: ["https://github.com/muyuzhong"],
                  description: "正在学习 Agent 开发并寻找相关实习机会。",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </ThemeProvider>
        <Toaster />
        <ChatBot />
      </body>
    </html>
  )
}
