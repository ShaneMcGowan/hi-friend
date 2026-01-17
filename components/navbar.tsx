"use client"

import { ExportImport } from "@/components/export-import"
import { useContactsData } from "@/hooks/use-contacts-data"

export function Navbar() {
  const { contacts, relationships, importData } = useContactsData()

  return (
    <header className="border-b border-border/40 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Hi, Friend</h1>
            <p className="text-sm text-muted-foreground">Your personal CRM for friends & family</p>
          </div>
          <ExportImport
            contacts={contacts}
            relationships={relationships}
            onImport={importData}
          />
        </div>
      </div>
    </header>
  )
}
