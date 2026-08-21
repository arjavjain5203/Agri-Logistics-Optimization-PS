"use client"

import { useState } from "react"
import { CropCard } from "@/components/agriflow/crop-card"
import { crops } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const filters = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "harvesting-soon", label: "Harvesting Soon" },
  { key: "high-risk", label: "High Risk" },
] as const

type FilterKey = (typeof filters)[number]["key"]

export function CropsFilterGrid() {
  const [filter, setFilter] = useState<FilterKey>("all")

  const filtered = crops.filter((crop) => {
    if (filter === "all") return true
    if (filter === "high-risk") return crop.risk === "high"
    return crop.status === filter
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No crops match this filter.
        </div>
      )}
    </div>
  )
}
