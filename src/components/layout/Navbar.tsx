"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Github, Mail, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { BracketLabel } from "@/components/shared/BracketLabel"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { personalData } from "@/lib/data"

const navLinks = [
  { label: "关于", href: "#about" },
  { label: "项目", href: "#projects" },
  { label: "技术", href: "#techstack" },
  { label: "博客", href: "#blog" },
  { label: "联系", href: "#contact" },
]

const socialLinks = [
  { label: "GITHUB", href: "https://github.com/muyuzhong", icon: Github },
  { label: "MAIL", href: `mailto:${personalData.email}`, icon: Mail },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "bg-background/92 backdrop-blur-sm border-b border-foreground/10" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
          <Link
            href="/"
            className="group flex items-center py-2 text-foreground transition-colors"
          >
            <span className="flex flex-col leading-none">
              <span className="font-editorial text-base font-black tracking-normal text-foreground">
                暮羽中
              </span>
              <span className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-accent">
                AGENT INTERN / LEARNING
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                data-cursor-hover
              >
                <BracketLabel>{link.label}</BracketLabel>
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(true)}
            aria-label="打开菜单"
            data-cursor-hover
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background/98 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300 md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false) }}
        aria-hidden={!menuOpen}
      >
        <button
          className="absolute top-5 right-6 text-foreground hover:text-accent transition-colors"
          onClick={() => setMenuOpen(false)}
          aria-label="关闭菜单"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex flex-col items-center gap-6" aria-label="移动端导航">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-3xl font-extrabold tracking-tight text-foreground hover:text-accent transition-all duration-300",
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
            >
              <span className="font-mono text-sm text-muted-foreground mr-4">[{String(i + 1).padStart(2, "0")}]</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            "absolute bottom-10 flex items-center gap-6 transition-all duration-500",
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: menuOpen ? `${navLinks.length * 50 + 100}ms` : "0ms" }}
        >
          <ThemeToggle />
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
