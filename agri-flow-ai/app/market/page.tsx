import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { StatCard } from "@/components/agriflow/stat-card"
import { PriceTable } from "@/components/agriflow/market/price-table"
import { AIInsight } from "@/components/agriflow/ai-insight"
import { markets } from "@/lib/mock-data"
import { TrendingUp, MapPin, IndianRupee } from "lucide-react"

export default function MarketPage() {
  const best = markets.find((m) => m.recommended) ?? markets[0]
  const avgNet = Math.round(markets.reduce((sum, m) => sum + m.netKg, 0) / markets.length)

  return (
    <AppShell>
      <PageHeader
        title="Market Prices"
        description="Live mandi rates compared across nearby markets for your tomato harvest."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={IndianRupee}
          label="Best net price"
          value={`₹${best.netKg}/kg`}
          hint={best.name}
          tone="primary"
        />
        <StatCard icon={TrendingUp} label="Average net price" value={`₹${avgNet}/kg`} hint="Across 4 markets" />
        <StatCard icon={MapPin} label="Nearest market" value={`${Math.min(...markets.map((m) => m.distanceKm))} km`} hint="Jaunpur APMC" />
      </div>

      <AIInsight>
        <strong className="text-foreground">Varanasi APMC</strong> gives the highest net return after
        transport costs, even though it&apos;s farther than Jaunpur. The 92 km distance is offset by a
        ₹5/kg higher gate price.
      </AIInsight>

      <PriceTable />
    </AppShell>
  )
}
