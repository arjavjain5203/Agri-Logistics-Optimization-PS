export function RiskGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex size-40 shrink-0 items-center justify-center">
      <svg viewBox="0 0 120 120" className="size-40 -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" className="stroke-muted" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-critical transition-all duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-heading text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs font-medium text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}
