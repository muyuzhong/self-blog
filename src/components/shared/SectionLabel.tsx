import { cn } from "@/lib/utils"
import { BracketLabel } from "./BracketLabel"

interface SectionLabelProps {
  number: string
  title: string
  className?: string
}

export function SectionLabel({ number, title, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-12", className)}>
      <BracketLabel hover={false} className="text-accent">
        {number}
      </BracketLabel>
      <span className="h-px w-8 bg-muted-foreground/20" />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
        {title}
      </span>
    </div>
  )
}