import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string
  value: string
  icon?: LucideIcon
  tone?: "default" | "warning" | "critical" | "primary"
  hint?: string
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-muted text-foreground",
    warning: "bg-warning/15 text-warning-foreground",
    critical: "bg-critical/10 text-critical",
    primary: "bg-primary/10 text-primary",
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      {Icon && (
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="size-5" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="font-heading text-lg font-bold leading-tight text-foreground">{value}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}
