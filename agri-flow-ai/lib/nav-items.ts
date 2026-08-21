import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Sprout,
  CloudRain,
  LineChart,
  Target,
  Truck,
  Mic,
  Bot,
  Bell,
  User,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crops", label: "My Crops", icon: Sprout },
  { href: "/weather", label: "Weather & Risk", icon: CloudRain },
  { href: "/market", label: "Market Prices", icon: LineChart },
  { href: "/best-market", label: "Best Market", icon: Target },
  { href: "/logistics", label: "Logistics", icon: Truck },
  { href: "/voice", label: "Voice Assistant", icon: Mic },
  { href: "/agents", label: "Agent Intelligence", icon: Bot },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
]

export const mobileNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/crops", label: "Crops", icon: Sprout },
  { href: "/best-market", label: "Market", icon: Target },
  { href: "/logistics", label: "Transport", icon: Truck },
  { href: "/voice", label: "Voice", icon: Mic },
]
