"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { ConfirmationModal } from "@/components/agriflow/confirmation-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { markets, bestMarketReasons, farmer } from "@/lib/mock-data"
import { CheckCircle2, MapPin, IndianRupee, Truck, ArrowRight } from "lucide-react"

export default function BestMarketPage() {
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const best = markets.find((m) => m.recommended) ?? markets[0]
  const others = markets.filter((m) => m.id !== best.id)

  return (
    <AppShell>
      <PageHeader
        title="Best Market Recommendation"
        description="The Market Arbitrage Agent evaluated 12 mandis and selected the best option for your harvest."
      />

      <Card className="overflow-hidden rounded-3xl border-primary/20 bg-primary p-0 text-primary-foreground shadow-md">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                <CheckCircle2 className="size-3.5" />
                Recommended market
              </span>
              <h2 className="mt-3 font-heading text-2xl font-bold text-balance sm:text-3xl">{best.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-foreground/80">
                <MapPin className="size-3.5" />
                {best.distanceKm} km from {farmer.village}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-primary-foreground/70">Net return</span>
              <p className="font-heading text-3xl font-bold tabular-nums">₹{best.netKg}/kg</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-2xl bg-primary-foreground/10 p-4 text-sm">
            <div>
              <span className="text-xs text-primary-foreground/70">Gate price</span>
              <p className="font-semibold tabular-nums">₹{best.priceKg}/kg</p>
            </div>
            <div>
              <span className="text-xs text-primary-foreground/70">Transport</span>
              <p className="font-semibold tabular-nums">-₹{best.transportKg}/kg</p>
            </div>
            <div>
              <span className="text-xs text-primary-foreground/70">Your quantity</span>
              <p className="font-semibold tabular-nums">{farmer.quantity}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => setOpen(true)}
              disabled={confirmed}
            >
              {confirmed ? "Confirmed" : "Confirm & Sell Here"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              render={<Link href="/logistics" />}
              nativeButton={false}
            >
              View Transport Plan
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/70">
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-sm font-semibold text-foreground">Why this market?</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {bestMarketReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/70">
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-sm font-semibold text-foreground">Other markets considered</h3>
          <div className="mt-4 flex flex-col divide-y divide-border/60">
            {others.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.distanceKm} km away</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-semibold tabular-nums text-muted-foreground">
                  <IndianRupee className="size-3.5" />
                  {m.netKg}/kg
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="size-3.5" />
            Transport cost estimated using average diesel rate and 800 kg shared load.
          </p>
        </div>
      </Card>

      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="Confirm sale at Varanasi APMC?"
        description={`You're about to commit ${farmer.quantity} of tomato at an estimated net return of ₹${best.netKg}/kg. The Logistics Agent will notify nearby farmers to arrange a shared truck.`}
        confirmLabel="Confirm Sale"
        onConfirm={() => setConfirmed(true)}
      />
    </AppShell>
  )
}
