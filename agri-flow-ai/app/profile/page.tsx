import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { farmer, crops } from "@/lib/mock-data"
import { MapPin, Sprout, Ruler, Languages, Bell, Mic, Sun } from "lucide-react"

const preferences = [
  { icon: Bell, label: "Push notifications", description: "Alerts for weather, market, and logistics", defaultChecked: true },
  { icon: Mic, label: "Voice guidance", description: "AI agent speaks recommendations aloud", defaultChecked: true },
  { icon: Sun, label: "Daily summary", description: "Morning briefing at 6:00 AM", defaultChecked: false },
]

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader title="Profile" description="Your farm details and AI assistant preferences." />

      <Card className="overflow-hidden rounded-2xl border-border/70">
        <div className="flex flex-col items-center gap-4 border-b border-border/70 bg-surface/40 p-6 text-center sm:flex-row sm:text-left">
          <Avatar className="size-16 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
              {farmer.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">{farmer.name}</h2>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <MapPin className="size-3.5" />
              {farmer.village}, {farmer.district}, {farmer.state}
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto hidden bg-primary/10 text-primary sm:flex">
            Verified farmer
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Ruler className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Farm size</span>
            <span className="text-sm font-semibold text-foreground">{farmer.farmSize}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Sprout className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Active crops</span>
            <span className="text-sm font-semibold text-foreground">{crops.length}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Languages className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Language</span>
            <span className="text-sm font-semibold text-foreground">{farmer.language}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">District</span>
            <span className="text-sm font-semibold text-foreground">{farmer.district}</span>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/70">
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-sm font-semibold text-foreground">Assistant preferences</h3>
          <div className="mt-4 flex flex-col">
            {preferences.map((p, i) => (
              <div key={p.label}>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <p.icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={p.defaultChecked} />
                </div>
                {i < preferences.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/70">
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-sm font-semibold text-foreground">Current crops on file</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {crops.map((c) => (
              <Badge key={c.id} variant="outline" className="px-3 py-1.5 text-sm">
                {c.name} &middot; {c.quantityKg} kg
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </AppShell>
  )
}
