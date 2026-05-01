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
  title: { default: "暮羽中 | 全栈开发者", template: "%s | 暮羽中" },
  description: "用代码构建数字世界的无限可能。专注于高性能 Web 应用和 AI 工具开发的全栈开发者。",
  keywords: ["全栈开发者", "前端开发", "Next.js", "React", "TypeScript", "暮羽中", "个人网站", "作品集"],
  authors: [{ name: "暮羽中" }],
  creator: "暮羽中",
  metadataBase: new URL("https://muyuzhong.dev"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "暮羽中个人网站",
    title: "暮羽中 | 全栈开发者",
    description: "用代码构建数字世界的无限可能。专注于高性能 Web 应用和 AI 工具开发。",
  },
  twitter: {
    card: "summary_large_image",
    title: "暮羽中 | 全栈开发者",
    description: "用代码构建数字世界的无限可能。",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
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
                  url: "https://muyuzhong.dev",
                  description: "用代码构建数字世界的无限可能。专注于高性能 Web 应用和 AI 工具开发。",
                  inLanguage: "zh-CN",
                },
                {
                  "@type": "Person",
                  name: "暮羽中",
                  url: "https://muyuzhong.dev",
                  jobTitle: "全栈开发者",
                  sameAs: ["https://github.com/muyuzhong"],
                  description: "专注于高性能 Web 应用和 AI 工具开发的全栈开发者。",
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
