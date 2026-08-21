import { AppShell } from "@/components/agriflow/app-shell"
import { CriticalAlert } from "@/components/agriflow/dashboard/critical-alert"
import { RecommendationCard } from "@/components/agriflow/dashboard/recommendation-card"
import { StatCard } from "@/components/agriflow/stat-card"
import { AgentCard } from "@/components/agriflow/agent-card"
import { Timeline } from "@/components/agriflow/timeline"
import { farmer, agents, dashboardTimeline, impact } from "@/lib/mock-data"
import { Sprout, AlertTriangle, TrendingUp, Truck } from "lucide-react"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Good morning, {farmer.name.split(" ")[0]}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground lg:text-base">
          Here&apos;s what your farm needs today.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <CriticalAlert />
        <RecommendationCard />

        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Today&apos;s Snapshot</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Tomato" value="500 kg" icon={Sprout} tone="primary" />
            <StatCard label="Spoilage Risk" value="HIGH" icon={AlertTriangle} tone="critical" />
            <StatCard label="Best Net Price" value="₹20/kg" icon={TrendingUp} tone="default" />
            <StatCard label="Transport Saving" value="₹1,750" icon={Truck} tone="warning" />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Agent Status</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard key={agent.key} agent={agent} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Activity Timeline</h2>
            <Timeline items={dashboardTimeline} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Impact</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl bg-primary/[0.06] p-4">
                <span className="text-sm text-muted-foreground">Expected Revenue</span>
                <span className="font-heading text-lg font-bold text-primary">
                  ₹{impact.expectedRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-warning/10 p-4">
                <span className="text-sm text-muted-foreground">Spoilage Avoided</span>
                <span className="font-heading text-lg font-bold text-warning-foreground">
                  ₹{impact.spoilageAvoided.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted p-4">
                <span className="text-sm text-muted-foreground">Transport Saved</span>
                <span className="font-heading text-lg font-bold text-foreground">
                  ₹{impact.transportSaved.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
