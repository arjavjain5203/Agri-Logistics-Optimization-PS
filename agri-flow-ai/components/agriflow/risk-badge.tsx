import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/mock-data"
import { AlertTriangle, CircleAlert, ShieldCheck } from "lucide-react"

const riskConfig: Record<
  RiskLevel,
  { label: string; className: string; icon: typeof ShieldCheck }
> = {
  low: {
    label: "LOW",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: ShieldCheck,
  },
  moderate: {
    label: "MODERATE",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
    icon: CircleAlert,
  },
  high: {
    label: "HIGH",
    className: "bg-critical/10 text-critical border-critical/25",
    icon: AlertTriangle,
  },
}

export function RiskBadge({
  risk,
  className,
}: {
  risk: RiskLevel
  className?: string
}) {
  const config = riskConfig[risk]
  const Icon = config.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        config.className,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  )
}
