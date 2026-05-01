import { cn } from "@/lib/utils"

interface VerticalTextProps {
  text: string
  className?: string
  side?: "left" | "right"
}

export function VerticalText({ text, className, side = "left" }: VerticalTextProps) {
  return (
    <div
      className={cn(
        "absolute top-0 hidden lg:flex flex-col items-center pointer-events-none select-none",
        side === "left" ? "left-4 xl:left-8" : "right-4 xl:right-8",
        className
      )}
      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
      <span className="font-sans font-extrabold text-[clamp(3rem,6vw,5rem)] leading-none tracking-tighter text-muted-foreground/[0.08]">
        {text.split("").join(" ")}
      </span>
    </div>
  )
}