"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { ConfirmationModal } from "@/components/agriflow/confirmation-modal"
import { RouteStops } from "@/components/agriflow/logistics/route-stops"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { nearbyFarmers, sharedTruck, routeInfo, farmer } from "@/lib/mock-data"
import { Truck, Clock, Route, IndianRupee, TrendingDown } from "lucide-react"

export default function LogisticsPage() {
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const loadPercent = Math.round((sharedTruck.loadKg / sharedTruck.capacityKg) * 100)
  const savings = sharedTruck.withoutPooling - sharedTruck.yourShare

  return (
    <AppShell>
      <PageHeader
        title="Logistics"
        description="The Logistics Bundling Agent matched you with nearby farmers heading to the same market."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="rounded-2xl border-border/70">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Truck className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-foreground">Shared truck to {sharedTruck.destination}</h3>
                    <p className="text-xs text-muted-foreground">{sharedTruck.pickupTime}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {confirmed ? "Confirmed" : "Matching"}
                </Badge>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Load capacity</span>
                  <span className="font-medium text-foreground">
                    {sharedTruck.loadKg} / {sharedTruck.capacityKg} kg
                  </span>
                </div>
                <Progress value={loadPercent} className="h-2.5" />
              </div>

              <div className="mt-5 flex flex-col divide-y divide-border/60">
                {nearbyFarmers.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {f.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.crop} &middot; {f.quantityKg} kg &middot; {f.distanceKm} km away
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        f.status === "joining"
                          ? "border-primary/30 text-primary"
                          : "border-warning/30 text-warning-foreground"
                      }
                    >
                      {f.status === "joining" ? "Joining" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/70">
            <div className="p-5 sm:p-6">
              <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">Route</h3>
              <RouteStops />
              <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-muted p-3 text-center">
                <div>
                  <Route className="mx-auto size-4 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Distance</p>
                  <p className="text-sm font-semibold text-foreground">{routeInfo.distanceKm} km</p>
                </div>
                <div className="border-x border-border">
                  <Clock className="mx-auto size-4 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold text-foreground">{routeInfo.duration}</p>
                </div>
                <div>
                  <Truck className="mx-auto size-4 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Pickup</p>
                  <p className="text-sm font-semibold text-foreground">{routeInfo.pickupTime}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden rounded-2xl border-primary/20 bg-primary p-0 text-primary-foreground">
            <div className="p-5">
              <p className="text-xs text-primary-foreground/70">Your share of transport cost</p>
              <p className="mt-1 font-heading text-3xl font-bold tabular-nums">
                &#8377;{sharedTruck.yourShare.toLocaleString("en-IN")}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-3 py-2 text-xs">
                <TrendingDown className="size-3.5" />
                <span>
                  Save &#8377;{savings.toLocaleString("en-IN")} vs. going alone (&#8377;
                  {sharedTruck.withoutPooling.toLocaleString("en-IN")})
                </span>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="mt-5 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => setOpen(true)}
                disabled={confirmed}
              >
                {confirmed ? "Pickup Confirmed" : "Confirm Shared Pickup"}
              </Button>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/70">
            <div className="p-5">
              <h3 className="font-heading text-sm font-semibold text-foreground">Cost breakdown</h3>
              <div className="mt-3 flex flex-col gap-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total truck cost</span>
                  <span className="font-medium text-foreground">
                    &#8377;{sharedTruck.truckCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Your produce</span>
                  <span className="font-medium text-foreground">{sharedTruck.yourProduceKg} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total load</span>
                  <span className="font-medium text-foreground">{sharedTruck.loadKg} kg</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="Confirm Shared Pickup?"
        description="Review the details below before confirming your shared truck pickup."
        confirmLabel="Confirm Pickup"
        onConfirm={() => {
          setConfirmed(true)
          toast.success("Pickup confirmed", {
            description: `Truck arrives ${sharedTruck.pickupTime.toLowerCase()} at your farm.`,
          })
        }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Crop</span>
          <span className="font-medium text-foreground">
            {farmer.primaryCrop} &mdash; {sharedTruck.yourProduceKg} kg
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Destination</span>
          <span className="font-medium text-foreground">{sharedTruck.destination}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pickup</span>
          <span className="font-medium text-foreground">{sharedTruck.pickupTime}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your cost</span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <IndianRupee className="size-3.5" />
            {sharedTruck.yourShare.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Savings</span>
          <span className="font-semibold text-primary">&#8377;{savings.toLocaleString("en-IN")}</span>
        </div>
      </ConfirmationModal>
    </AppShell>
  )
}
