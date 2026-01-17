"use client"

import { Bell } from "lucide-react"
import { UpcomingReminders } from "@/components/upcoming-reminders"
import { useContactsData } from "@/hooks/use-contacts-data"

export default function RemindersPage() {
  const { contacts } = useContactsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Reminders</h2>
        </div>
        <UpcomingReminders contacts={contacts} />
      </main>
    </div>
  )
}
