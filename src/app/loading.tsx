import { BracketLabel } from "@/components/shared/BracketLabel"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-pulse">
      <div className="text-center space-y-4">
        <BracketLabel>LOADING</BracketLabel>
        <div className="h-2 w-24 bg-muted-foreground/20 rounded mx-auto" />
      </div>
    </div>
  )
}
