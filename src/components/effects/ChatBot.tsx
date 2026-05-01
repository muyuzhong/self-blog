"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "bot"
  text: string
}

const faq = [
  {
    keywords: ["你好", "hello", "hi", "是谁", "介绍"],
    response: "你好！我是暮羽中的 AI 助手。暮羽中是一名热爱技术的全栈开发者，专注于构建高性能的 Web 应用和 AI 工具。",
  },
  {
    keywords: ["技能", "技术栈", "会什么", "stack"],
    response: "他的技术栈包括 React、Next.js、TypeScript、Node.js、Python、Three.js 和 Tailwind CSS。目前正在深入探索 AI 与前端结合的可能性。",
  },
  {
    keywords: ["项目", "作品", "portfolio", "github"],
    response: "你可以在 GitHub (github.com/muyuzhong) 查看他的开源项目，包括个人博客系统、粒子背景引擎和 AI 工具集。",
  },
  {
    keywords: ["联系", "邮箱", "email", "怎么找"],
    response: "可以通过页面底部的联系表单发送消息，或者直接发送邮件到 muyuzhong@example.com。",
  },
  {
    keywords: ["博客", "文章", "blog"],
    response: "博客栏目收录了关于前端性能优化、React 高级模式、Three.js 粒子系统和微前端演进的技术文章。",
  },
]

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const item of faq) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.response
    }
  }
  return "这是个有趣的问题！你可以通过页面底部的联系表单直接与暮羽中交流，或者在 GitHub 上找到他。"
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "你好！有什么我可以帮你的吗？" },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: "user", text: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getResponse(userMsg.text) }])
    }, 600)
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full border border-[hsla(0,0%,89%,0.12)] bg-card backdrop-blur-sm text-foreground hover:text-accent transition-all shadow-lg",
          open && "rotate-90"
        )}
        aria-label="AI 助手"
        data-cursor-hover
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[28rem] flex flex-col rounded-none border border-[hsla(0,0%,89%,0.12)] bg-card backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsla(0,0%,89%,0.08)]">
            <Bot className="w-5 h-5 text-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">AI 助手</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 text-sm",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role === "bot" && <Bot className="w-4 h-4 text-accent mt-1 shrink-0" />}
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 border",
                    m.role === "user"
                      ? "bg-accent/10 border-accent/20 text-foreground"
                      : "bg-muted border-[hsla(0,0%,89%,0.08)] text-muted-foreground"
                  )}
                >
                  {m.text}
                </div>
                {m.role === "user" && <User className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-t border-[hsla(0,0%,89%,0.08)]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="输入问题..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button onClick={send} className="text-accent hover:text-foreground transition-colors" aria-label="发送">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
