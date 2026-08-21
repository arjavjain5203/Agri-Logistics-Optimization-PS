import { Sparkles } from "lucide-react"
import type { ReactNode } from "react"

export function AIInsight({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-4" />
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{children}</p>
    </div>
  )
}
