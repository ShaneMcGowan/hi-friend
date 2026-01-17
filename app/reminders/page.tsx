"use client"

import { UpcomingReminders } from "@/components/upcoming-reminders"
import { useContactsData } from "@/hooks/use-contacts-data"

export default function RemindersPage() {
  const { contacts } = useContactsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Hi, Friend</h1>
            <p className="text-sm text-muted-foreground">Your personal CRM for friends & family</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <UpcomingReminders contacts={contacts} />
      </main>
    </div>
  )
}
