"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sprout } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/nav-items"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sprout className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-base font-bold leading-tight text-sidebar-foreground">
            AgriFlow AI
          </span>
          <span className="text-[11px] leading-tight text-sidebar-foreground/60">
            AI for Better Farming
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 mb-5 rounded-xl bg-sidebar-accent/60 p-4">
        <p className="text-xs font-medium text-sidebar-foreground/80">
          Agents monitoring your farm
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/55">
          4 AI agents active — weather, market, logistics & voice.
        </p>
      </div>
    </aside>
  )
}
