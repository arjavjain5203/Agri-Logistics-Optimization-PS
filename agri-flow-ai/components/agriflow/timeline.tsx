export function Timeline({ items }: { items: { time: string; label: string }[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {items.map((item, index) => (
        <li key={`${item.time}-${item.label}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-2.5 rounded-full bg-primary" />
            {index < items.length - 1 && <span className="w-px flex-1 bg-border" />}
          </div>
          <div className={index < items.length - 1 ? "pb-5" : ""}>
            <p className="text-xs font-semibold tabular-nums text-muted-foreground">{item.time}</p>
            <p className="mt-0.5 text-sm text-foreground">{item.label}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
