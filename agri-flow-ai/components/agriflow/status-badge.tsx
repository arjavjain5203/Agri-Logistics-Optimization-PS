import { cn } from "@/lib/utils"

type AgentStatus = "active" | "matching" | "ready"

const statusConfig: Record<AgentStatus, { label: string; className: string }> = {
  active: {
    label: "ACTIVE",
    className: "bg-primary/10 text-primary",
  },
  matching: {
    label: "MATCHING",
    className: "bg-warning/15 text-warning-foreground",
  },
  ready: {
    label: "READY",
    className: "bg-chart-4/15 text-chart-4",
  },
}

export function StatusBadge({
  status,
  className,
}: {
  status: AgentStatus
  className?: string
}) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider",
        config.className,
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {config.label}
    </span>
  )
}
