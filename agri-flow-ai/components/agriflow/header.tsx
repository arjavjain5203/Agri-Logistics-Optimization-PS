"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from "@/lib/nav-items"
import { farmer, notifications } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 lg:px-8 lg:py-4">
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
          <Menu />
          <span className="sr-only">Open navigation</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
          <SheetHeader className="border-b border-sidebar-border px-5 py-5">
            <SheetTitle className="flex items-center gap-2.5 text-sidebar-foreground">
              <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <Sprout className="size-5" />
              </span>
              <span className="flex flex-col items-start">
                <span className="font-heading text-base font-bold leading-tight">AgriFlow AI</span>
                <span className="text-[11px] font-normal leading-tight text-sidebar-foreground/60">
                  AI for Better Farming
                </span>
              </span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-3 py-4">
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
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden max-w-sm flex-1 md:flex">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search crops, markets, mandis..." />
        </InputGroup>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 lg:gap-3">
        <Select defaultValue="hi">
          <SelectTrigger className="hidden w-[110px] sm:flex" size="sm">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="regional">Regional</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          render={<Link href="/notifications" />}
          nativeButton={false}
        >
          <Bell />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-critical text-[10px] font-semibold text-critical-foreground">
              {unread}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <Link href="/profile" className="flex items-center gap-2">
          <Avatar className="size-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {farmer.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium xl:inline">{farmer.name}</span>
        </Link>
      </div>
    </header>
  )
}
