import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { AgentCard } from "@/components/agriflow/agent-card"
import { Timeline } from "@/components/agriflow/timeline"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/agriflow/stat-card"
import { agents, agentTimeline, impact } from "@/lib/mock-data"
import { Bot, IndianRupee, ShieldCheck, TruckIcon } from "lucide-react"

export default function AgentsPage() {
  const activeCount = agents.filter((a) => a.status === "active").length

  return (
    <AppShell>
      <PageHeader
        title="Agent Intelligence"
        description="Four specialized AI agents work together autonomously to protect your harvest value."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Bot} label="Agents active" value={`${activeCount} of 4`} tone="primary" />
        <StatCard icon={IndianRupee} label="Revenue protected" value={`₹${impact.expectedRevenue.toLocaleString("en-IN")}`} />
        <StatCard icon={ShieldCheck} label="Spoilage avoided" value={`₹${impact.spoilageAvoided.toLocaleString("en-IN")}`} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {agents.map((agent) => (
          <AgentCard key={agent.key} agent={agent} />
        ))}
      </div>

      <Card className="rounded-2xl border-border/70">
        <div className="p-5 sm:p-6">
          <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">Agent activity log</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            A live trace of decisions made by your agents this morning.
          </p>
          <Timeline items={agentTimeline} />
        </div>
      </Card>

      <Card className="overflow-hidden rounded-2xl border-primary/20 bg-primary p-0 text-primary-foreground">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
              <TruckIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Transport savings this season</p>
              <p className="text-xs text-primary-foreground/70">From shared trucks arranged by the Logistics Agent</p>
            </div>
          </div>
          <p className="font-heading text-2xl font-bold tabular-nums">
            &#8377;{impact.transportSaved.toLocaleString("en-IN")}
          </p>
        </div>
      </Card>
    </AppShell>
  )
}
