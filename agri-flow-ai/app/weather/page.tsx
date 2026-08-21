import { CloudRain, Droplets, Plus, Sprout, Target, Wind } from "lucide-react"
import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { RiskGauge } from "@/components/agriflow/weather/risk-gauge"
import { RiskBadge } from "@/components/agriflow/risk-badge"
import { forecast, weather } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function WeatherPage() {
  return (
    <AppShell>
      <PageHeader title="Weather & Crop Risk" description="Live conditions and how they affect your harvest." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rampur, Gautam Budh Nagar</p>
                <p className="font-heading text-4xl font-bold text-foreground">{weather.tempC}&deg;C</p>
                <p className="text-sm text-muted-foreground">{weather.condition}</p>
              </div>
              <CloudRain className="size-16 text-chart-4" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-muted p-3 text-center">
              <div>
                <Droplets className="mx-auto size-4 text-chart-4" />
                <p className="mt-1 text-xs text-muted-foreground">Humidity</p>
                <p className="text-sm font-semibold text-foreground">{weather.humidity}%</p>
              </div>
              <div className="border-x border-border">
                <CloudRain className="mx-auto size-4 text-chart-4" />
                <p className="mt-1 text-xs text-muted-foreground">Rain Prob.</p>
                <p className="text-sm font-semibold text-foreground">{weather.rainProbability}%</p>
              </div>
              <div>
                <Wind className="mx-auto size-4 text-chart-4" />
                <p className="mt-1 text-xs text-muted-foreground">Wind</p>
                <p className="text-sm font-semibold text-foreground">{weather.windKph} km/h</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">5-Day Forecast</h2>
            <div className="grid grid-cols-5 gap-2">
              {forecast.map((day) => (
                <div
                  key={day.day}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-center",
                    day.risk === "high" && "border-critical/25 bg-critical/[0.06]",
                    day.risk === "moderate" && "border-warning/30 bg-warning/10",
                    day.risk === "low" && "border-border bg-muted/50",
                  )}
                >
                  <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                  <span className="font-heading text-lg font-bold text-foreground">{day.tempC}&deg;</span>
                  <span className="text-[11px] text-muted-foreground">{day.rainProbability}% rain</span>
                  {day.risk === "high" && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-critical">High risk</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Why is the risk high?</h2>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-center">
                <CloudRain className="size-5 text-chart-4" />
                <span className="text-xs font-medium text-foreground">Heavy Rain</span>
              </div>
              <Plus className="size-4 text-muted-foreground" />
              <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-center">
                <Droplets className="size-5 text-chart-4" />
                <span className="text-xs font-medium text-foreground">High Humidity</span>
              </div>
              <Plus className="size-4 text-muted-foreground" />
              <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-center">
                <Sprout className="size-5 text-primary" />
                <span className="text-xs font-medium text-foreground">Harvest Ready</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">=</span>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-critical/25 bg-critical/[0.06] p-4 text-center">
                <Target className="size-5 text-critical" />
                <span className="text-xs font-bold text-critical">High Spoilage Risk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-critical/20 bg-critical/[0.04] p-6 text-center">
            <p className="text-sm font-semibold text-foreground">Tomato Spoilage Risk</p>
            <RiskGauge score={82} />
            <RiskBadge risk="high" />
          </div>

          <div className="rounded-2xl bg-primary p-5 text-center text-primary-foreground shadow-sm">
            <p className="text-xs text-primary-foreground/70">Safe Selling Window</p>
            <p className="mt-1 font-heading text-2xl font-bold">Next 48 hours</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
