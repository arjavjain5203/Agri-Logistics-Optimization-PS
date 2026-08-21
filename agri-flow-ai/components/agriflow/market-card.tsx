import { MapPin, TrendingDown, TrendingUp } from "lucide-react"
import type { Market } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function MarketCard({ market }: { market: Market }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm",
        market.recommended ? "border-primary/40 ring-1 ring-primary/15" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-foreground">{market.name}</h3>
            {market.recommended && (
              <Badge className="bg-primary text-primary-foreground">AI RECOMMENDED</Badge>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {market.distanceKm} km away
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold",
            market.trend > 0 ? "text-primary" : market.trend < 0 ? "text-critical" : "text-muted-foreground",
          )}
        >
          {market.trend !== 0 &&
            (market.trend > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />)}
          {market.trend !== 0 ? `${market.trend > 0 ? "+" : ""}₹${market.trend}/kg today` : "Stable"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted p-3 text-center">
        <div>
          <p className="text-[11px] text-muted-foreground">Price</p>
          <p className="mt-0.5 text-sm font-bold text-foreground">₹{market.priceKg}/kg</p>
        </div>
        <div className="border-x border-border">
          <p className="text-[11px] text-muted-foreground">Transport</p>
          <p className="mt-0.5 text-sm font-bold text-foreground">₹{market.transportKg}/kg</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Net</p>
          <p className="mt-0.5 text-sm font-bold text-primary">₹{market.netKg}/kg</p>
        </div>
      </div>
    </div>
  )
}
