"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motionAwareScrollBehavior } from "@/lib/motion"

const navItems = [
 { label: "首页", href: "#hero" },
 { label: "关于", href: "#about" },
 { label: "项目", href: "#projects" },
 { label: "技术栈", href: "#techstack" },
 { label: "博客", href: "#blog" },
 { label: "联系", href: "#contact" },
]

export function Navbar() {
 const [scrolled, setScrolled] = useState(false)
 const [activeSection, setActiveSection] = useState("hero")
 const [mobileOpen, setMobileOpen] = useState(false)

 useEffect(() => {
 const onScroll = () => {
 setScrolled(window.scrollY > 50)

 const sections = navItems.map((item) => item.href.replace("#", ""))
 for (let i = sections.length - 1; i >= 0; i--) {
 const el = document.getElementById(sections[i])
 if (el && el.getBoundingClientRect().top <= 150) {
 setActiveSection(sections[i])
 break
 }
 }
 }
 window.addEventListener("scroll", onScroll)
 return () => window.removeEventListener("scroll", onScroll)
 }, [])

 const scrollTo = (href: string) => {
 const el = document.querySelector(href)
 if (el) {
 el.scrollIntoView({ behavior: motionAwareScrollBehavior() })
 setMobileOpen(false)
 }
 }

 return (
 <header
 className={cn(
 "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
 scrolled ? "glass-strong py-3" : "bg-transparent py-5"
 )}
 >
 <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
 <a
 href="#hero"
 onClick={(e) => {
 e.preventDefault()
 scrollTo("#hero")
 }}
 className="text-xl font-bold text-white tracking-tight"
 data-cursor-hover
 >
 暮羽中
 </a>

 {/* Desktop Nav */}
 <nav className="hidden md:flex items-center gap-1">
 {navItems.map((item) => (
 <a
 key={item.href}
 href={item.href}
 onClick={(e) => {
 e.preventDefault()
 scrollTo(item.href)
 }}
 className={cn(
 "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
 activeSection === item.href.replace("#", "")
 ? "text-white"
 : "text-muted-foreground hover:text-foreground"
 )}
 data-cursor-hover
 >
 {item.label}
 {activeSection === item.href.replace("#", "") && (
 <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white" />
 )}
 </a>
 ))}
 <a
 href="#contact"
 onClick={(e) => {
 e.preventDefault()
 scrollTo("#contact")
 }}
 className="ml-4 px-5 py-2 text-sm font-semibold bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
 data-cursor-hover
 >
 联系我
 </a>
 </nav>

 {/* Mobile Toggle */}
 <button
 className="md:hidden p-2 text-foreground"
 onClick={() => setMobileOpen(!mobileOpen)}
 data-cursor-hover
 >
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
 {mobileOpen ? (
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 ) : (
 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
 )}
 </svg>
 </button>
 </div>

 {/* Mobile Menu */}
 {mobileOpen && (
 <div className="md:hidden glass-strong mt-2 mx-6 p-4 space-y-1 animate-in slide-in-from-top-2">
 {navItems.map((item) => (
 <a
 key={item.href}
 href={item.href}
 onClick={(e) => {
 e.preventDefault()
 scrollTo(item.href)
 }}
 className={cn(
 "block px-4 py-3 text-sm font-medium transition-colors",
 activeSection === item.href.replace("#", "")
 ? "bg-white/10 text-white"
 : "text-muted-foreground hover:text-foreground hover:bg-white/5"
 )}
 >
 {item.label}
 </a>
 ))}
 </div>
 )}
 </header>
 )
}
