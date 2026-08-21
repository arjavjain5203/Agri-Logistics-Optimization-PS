import { AlertTriangle, CheckCircle2, TrendingUp, Truck, Wheat } from "lucide-react"
import type { NotificationItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap = {
  alert: AlertTriangle,
  "trending-up": TrendingUp,
  truck: Truck,
  wheat: Wheat,
  check: CheckCircle2,
} as const

const toneMap: Record<NotificationItem["category"], string> = {
  weather: "bg-critical/10 text-critical",
  market: "bg-primary/10 text-primary",
  logistics: "bg-chart-4/15 text-chart-4",
}

export function NotificationCard({ item }: { item: NotificationItem }) {
  const Icon = iconMap[item.icon]

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 shadow-sm transition-colors",
        item.read ? "border-border bg-card" : "border-primary/25 bg-primary/[0.04]",
      )}
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", toneMap[item.category])}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm leading-relaxed text-foreground text-pretty">{item.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
      </div>
      {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
    </div>
  )
}
