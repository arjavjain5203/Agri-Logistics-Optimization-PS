"use client"

import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { markets, type Market } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

function TrendIcon({ trend }: { trend: Market["trend"] }) {
  if (trend > 0) return <ArrowUp className="size-3.5 text-primary" />
  if (trend < 0) return <ArrowDown className="size-3.5 text-critical" />
  return <Minus className="size-3.5 text-muted-foreground" />
}

export function PriceTable() {
  const sorted = [...markets].sort((a, b) => b.netKg - a.netKg)

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 py-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-surface/40 px-4 py-3">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Mandi price board — Tomato
        </h3>
        <span className="text-xs text-muted-foreground">Updated 12 min ago</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-surface/25 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Mandi</th>
              <th className="px-4 py-2.5">Distance</th>
              <th className="px-4 py-2.5 text-right">Price / kg</th>
              <th className="px-4 py-2.5 text-right">Transport / kg</th>
              <th className="px-4 py-2.5 text-right">Net / kg</th>
              <th className="px-4 py-2.5 text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr
                key={m.id}
                className={cn(
                  "border-b border-border/50 last:border-0",
                  m.recommended && "bg-primary/5",
                )}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {m.name}
                  {m.recommended && (
                    <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Best
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{m.distanceKm} km</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  &#8377;{m.priceKg}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  &#8377;{m.transportKg}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                  &#8377;{m.netKg}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 tabular-nums">
                    <TrendIcon trend={m.trend} />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        m.trend > 0 && "text-primary",
                        m.trend < 0 && "text-critical",
                        m.trend === 0 && "text-muted-foreground",
                      )}
                    >
                      {m.trend === 0 ? "Steady" : `${m.trend > 0 ? "+" : ""}${m.trend}%`}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
