"use client"

import { UpcomingReminders } from "@/components/upcoming-reminders"
import { useContactsData } from "@/hooks/use-contacts-data"

export default function RemindersPage() {
  const { contacts } = useContactsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Reminders</h2>
        <UpcomingReminders contacts={contacts} />
      </main>
    </div>
  )
}
