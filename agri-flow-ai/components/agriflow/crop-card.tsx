import Link from "next/link"
import { ChevronRight, Sprout } from "lucide-react"
import type { Crop } from "@/lib/mock-data"
import { RiskBadge } from "@/components/agriflow/risk-badge"
import { Progress } from "@/components/ui/progress"

export function CropCard({ crop }: { crop: Crop }) {
  return (
    <Link
      href={`/crops/${crop.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="size-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">{crop.name}</h3>
            <p className="text-xs text-muted-foreground">{crop.nameHi} &middot; {crop.quantityKg} kg</p>
          </div>
        </div>
        <RiskBadge risk={crop.risk} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Harvest progress</span>
          <span className="font-medium text-foreground">{crop.progress}%</span>
        </div>
        <Progress value={crop.progress} className="h-1.5" />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Harvest {crop.harvestDate}</span>
        {crop.sellingWindowHours && (
          <span className="font-medium text-critical">{crop.sellingWindowHours}h window</span>
        )}
      </div>

      {crop.expectedRevenue && (
        <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
          <span className="text-xs text-muted-foreground">Expected revenue</span>
          <span className="text-sm font-bold text-foreground">
            ₹{crop.expectedRevenue.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      <div className="flex items-center justify-end gap-1 text-xs font-medium text-primary">
        View details
        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
