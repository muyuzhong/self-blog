"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as Theme | null
    const initial = stored || "dark"
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const resolved = t === "system" ? (systemDark ? "dark" : "light") : t
    setResolvedTheme(resolved)

    if (resolved === "dark") {
      root.classList.remove("light")
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
      root.classList.add("light")
    }
  }

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem("theme", t)
    applyTheme(t)
  }

  useEffect(() => {
    if (theme !== "system") return
    const listener = (e: MediaQueryListEvent) => {
      applyTheme("system")
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    mql.addEventListener("change", listener)
    return () => mql.removeEventListener("change", listener)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
