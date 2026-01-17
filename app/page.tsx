"use client"

import { LayoutDashboard } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
        </div>
        <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
          <p className="text-muted-foreground">Welcome to Hi, Friend! Your personal CRM for managing relationships.</p>
        </div>
      </main>
    </div>
  )
}
