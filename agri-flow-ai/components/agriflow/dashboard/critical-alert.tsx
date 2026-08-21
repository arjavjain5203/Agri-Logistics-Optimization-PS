"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CriticalAlert() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-critical/25 bg-critical/[0.06] p-5">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-4 text-critical/60 transition-colors hover:text-critical"
        aria-label="Dismiss alert"
      >
        <X className="size-4" />
      </button>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-critical/15 text-critical">
          <AlertTriangle className="size-5" />
        </div>
        <div className="flex-1 pr-6">
          <p className="text-xs font-bold uppercase tracking-wide text-critical">High Spoilage Risk</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-foreground text-pretty">
            Heavy rainfall expected within the next 48 hours.
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
            Your tomato crop should be sold before the risk window.
          </p>
          <Button
            render={<Link href="/best-market" />}
            nativeButton={false}
            size="sm"
            className="mt-3 bg-critical text-critical-foreground hover:bg-critical/90"
          >
            View Recommendation
          </Button>
        </div>
      </div>
    </div>
  )
}
