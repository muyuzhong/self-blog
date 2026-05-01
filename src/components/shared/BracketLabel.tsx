import { cn } from "@/lib/utils"

interface BracketLabelProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function BracketLabel({ children, className, hover = true }: BracketLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground",
        hover && "hover:text-accent transition-colors duration-300",
        className
      )}
    >
      [{children}]
    </span>
  )
}