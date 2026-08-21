import { CloudRain, TrendingUp, Truck, Phone } from "lucide-react"
import type { Agent } from "@/lib/mock-data"
import { StatusBadge } from "@/components/agriflow/status-badge"
import { cn } from "@/lib/utils"

const iconMap = {
  "cloud-rain": CloudRain,
  "trending-up": TrendingUp,
  truck: Truck,
  phone: Phone,
} as const

export function AgentCard({ agent, className }: { agent: Agent; className?: string }) {
  const Icon = iconMap[agent.icon]

  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <h3 className="text-sm font-semibold leading-tight text-foreground text-pretty">{agent.name}</h3>
        </div>
        <StatusBadge status={agent.status} className="shrink-0" />
      </div>
      <p className="text-xs text-muted-foreground">{agent.activity}</p>
      <div className="rounded-xl bg-muted px-3 py-2">
        <p className="text-xs font-medium text-foreground/85 text-pretty">{agent.result}</p>
      </div>
    </div>
  )
}
