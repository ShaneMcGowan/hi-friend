"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import { ContactList } from "@/components/contact-list"
import { VcfImport } from "@/components/vcf-import"
import { useContactsData } from "@/hooks/use-contacts-data"

export default function PeoplePage() {
  const router = useRouter()
  const {
    contacts,
    addContacts,
  } = useContactsData()

  const [searchTerm, setSearchTerm] = useState("")

  const handleNewContact = () => {
    router.push("/people/new")
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.interests?.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">People</h2>
          </div>
          <div className="flex items-center gap-2">
            <VcfImport onAddContacts={addContacts} />
            <button
              onClick={handleNewContact}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              + New Contact
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Contact List */}
          <div className="lg:col-span-1">
            <ContactList
              contacts={filteredContacts}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm text-center">
              <p className="text-muted-foreground">Select a person to view their details</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
