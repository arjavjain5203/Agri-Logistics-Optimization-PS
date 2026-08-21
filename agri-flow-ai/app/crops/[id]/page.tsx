import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, CloudRain, MapPin, Sprout, Target, Truck } from "lucide-react"
import { AppShell } from "@/components/agriflow/app-shell"
import { RiskBadge } from "@/components/agriflow/risk-badge"
import { AIInsight } from "@/components/agriflow/ai-insight"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { crops, type RiskLevel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function buildTimeline(risk: RiskLevel): { label: string; risk: RiskLevel }[] {
  if (risk === "high") {
    return [
      { label: "Today", risk: "low" },
      { label: "Tomorrow", risk: "moderate" },
      { label: "Day 3", risk: "high" },
      { label: "Day 4", risk: "high" },
    ]
  }
  return [
    { label: "Today", risk: "low" },
    { label: "Tomorrow", risk: "low" },
    { label: "Day 3", risk: "low" },
    { label: "Day 4", risk: "moderate" },
  ]
}

export default async function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const crop = crops.find((c) => c.id === id)

  if (!crop) notFound()

  const timeline = buildTimeline(crop.risk)

  return (
    <AppShell>
      <Link
        href="/crops"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to My Crops
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="size-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">{crop.name}</h1>
            <p className="text-sm text-muted-foreground">
              {crop.nameHi} &middot; {crop.quantityKg} kg
            </p>
          </div>
        </div>
        <RiskBadge risk={crop.risk} className="text-sm" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Harvest Progress</h2>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Growth to harvest</span>
              <span className="font-semibold text-foreground">{crop.progress}%</span>
            </div>
            <Progress value={crop.progress} className="h-2" />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Harvest date
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{crop.harvestDate}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  Quantity
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{crop.quantityKg} kg</p>
              </div>
              {crop.sellingWindowHours && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Target className="size-3.5" />
                    Selling window
                  </p>
                  <p className="mt-1 text-sm font-semibold text-critical">{crop.sellingWindowHours}h</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Spoilage Risk Timeline</h2>
            <div className="grid grid-cols-4 gap-2">
              {timeline.map((day) => (
                <div
                  key={day.label}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-center",
                    day.risk === "high" && "border-critical/25 bg-critical/[0.06]",
                    day.risk === "moderate" && "border-warning/30 bg-warning/10",
                    day.risk === "low" && "border-primary/15 bg-primary/[0.05]",
                  )}
                >
                  <span className="text-xs font-medium text-muted-foreground">{day.label}</span>
                  <RiskBadge risk={day.risk} className="px-2 py-0.5 text-[10px]" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Weather Impact</h2>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-4/15 text-chart-4">
                <CloudRain className="size-5" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {crop.risk === "high"
                  ? "Heavy rainfall and rising humidity over the next 48 hours significantly increase spoilage risk for a harvest-ready crop."
                  : "Weather conditions remain favorable with low rain probability. Risk is expected to stay low over the coming days."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {crop.expectedRevenue && (
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
              <p className="text-xs text-primary-foreground/70">Expected revenue</p>
              <p className="mt-1 font-heading text-3xl font-bold">₹{crop.expectedRevenue.toLocaleString("en-IN")}</p>
              <Button
                render={<Link href="/best-market" />}
                nativeButton={false}
                size="sm"
                variant="secondary"
                className="mt-4 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                View Market Opportunity
              </Button>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <Truck className="size-4 text-primary" />
              Logistics Status
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {crop.risk === "high"
                ? "A shared truck with 3 nearby farmers is being matched for this crop's harvest window."
                : "No transport needed yet — logistics matching will begin closer to harvest."}
            </p>
            {crop.risk === "high" && (
              <Button
                render={<Link href="/logistics" />}
                nativeButton={false}
                size="sm"
                variant="outline"
                className="mt-3 w-full"
              >
                View Logistics
              </Button>
            )}
          </div>

          <AIInsight>
            {crop.sellingWindowHours
              ? `Your crop has approximately ${crop.sellingWindowHours} hours of safe selling time.`
              : "Your crop is progressing normally. AgriFlow AI will alert you as harvest approaches."}
          </AIInsight>
        </div>
      </div>
    </AppShell>
  )
}
