"use client"

import { useState } from "react"
import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { NotificationCard } from "@/components/agriflow/notification-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { notifications as initialNotifications } from "@/lib/mock-data"
import { BellOff, CheckCheck } from "lucide-react"

const categories = [
  { value: "all", label: "All" },
  { value: "weather", label: "Weather" },
  { value: "market", label: "Market" },
  { value: "logistics", label: "Logistics" },
] as const

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread update${unreadCount === 1 ? "" : "s"} from your AI agents.`}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck data-icon="inline-start" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          {categories.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((c) => {
          const filtered =
            c.value === "all" ? notifications : notifications.filter((n) => n.category === c.value)
          return (
            <TabsContent key={c.value} value={c.value} className="mt-4">
              {filtered.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BellOff />
                    </EmptyMedia>
                    <EmptyTitle>No notifications</EmptyTitle>
                    <EmptyDescription>You&apos;re all caught up in this category.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((item) => (
                    <NotificationCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </AppShell>
  )
}
