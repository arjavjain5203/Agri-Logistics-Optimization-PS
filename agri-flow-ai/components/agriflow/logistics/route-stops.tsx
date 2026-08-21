import { MapPin, Warehouse } from "lucide-react"
import { routeStops } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function RouteStops() {
  return (
    <div className="flex flex-col">
      {routeStops.map((stop, i) => {
        const isLast = i === routeStops.length - 1
        const isFirst = i === 0
        return (
          <div key={stop} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                  isLast
                    ? "border-primary bg-primary text-primary-foreground"
                    : isFirst
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {isLast ? <Warehouse className="size-3.5" /> : <MapPin className="size-3.5" />}
              </div>
              {!isLast && <div className="my-0.5 h-8 w-px bg-border" />}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p className={cn("text-sm font-medium", isLast ? "text-primary" : "text-foreground")}>{stop}</p>
              {isFirst && <p className="text-xs text-muted-foreground">Pickup starts here</p>}
              {isLast && <p className="text-xs text-muted-foreground">Final destination</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
