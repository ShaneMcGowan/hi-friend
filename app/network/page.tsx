"use client"

import { useRouter } from "next/navigation"
import { Network } from "lucide-react"
import { RelationshipGraph } from "@/components/relationship-graph"
import { useContactsData } from "@/hooks/use-contacts-data"
import type { Contact } from "@/lib/types"

export default function NetworkPage() {
  const { contacts, relationships } = useContactsData()
  const router = useRouter()

  const handleContactClick = (contact: Contact) => {
    router.push(`/people/${contact.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Network className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Network</h2>
        </div>
        <RelationshipGraph
          contacts={contacts}
          relationships={relationships}
          onContactClick={handleContactClick}
        />
      </main>
    </div>
  )
}
