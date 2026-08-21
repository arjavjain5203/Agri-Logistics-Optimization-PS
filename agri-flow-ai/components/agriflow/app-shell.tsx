import type { ReactNode } from "react"
import { Sidebar } from "@/components/agriflow/sidebar"
import { MobileNav } from "@/components/agriflow/mobile-nav"
import { Header } from "@/components/agriflow/header"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header />
        <main className="flex-1 px-4 pb-24 pt-5 lg:px-8 lg:pb-10 lg:pt-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
