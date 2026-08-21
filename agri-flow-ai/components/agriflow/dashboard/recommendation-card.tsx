import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecommendationCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg lg:p-8">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
        <Sparkles className="size-4" />
        AI Recommendation
      </div>
      <h2 className="mt-2 font-heading text-2xl font-bold text-balance lg:text-3xl">Sell at Varanasi APMC</h2>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-primary-foreground/65">Market price</p>
          <p className="mt-0.5 text-lg font-bold">₹23/kg</p>
        </div>
        <div>
          <p className="text-xs text-primary-foreground/65">Transport</p>
          <p className="mt-0.5 text-lg font-bold">₹3/kg</p>
        </div>
        <div>
          <p className="text-xs text-primary-foreground/65">Expected net</p>
          <p className="mt-0.5 text-lg font-bold">₹20/kg</p>
        </div>
        <div>
          <p className="text-xs text-primary-foreground/65">Quantity</p>
          <p className="mt-0.5 text-lg font-bold">500 kg</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl bg-primary-foreground/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-primary-foreground/70">Estimated revenue &middot; 48-hour selling window</p>
          <p className="mt-0.5 text-2xl font-bold">₹10,000</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            render={<Link href="/best-market" />}
            nativeButton={false}
            size="sm"
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            View Best Market
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            render={<Link href="/market" />}
            nativeButton={false}
            size="sm"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Compare Markets
          </Button>
        </div>
      </div>
    </div>
  )
}
