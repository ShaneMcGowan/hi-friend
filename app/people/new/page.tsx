"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { useContactsData } from "@/hooks/use-contacts-data"
import type { Contact } from "@/lib/types"

export default function NewContactPage() {
  const router = useRouter()
  const {
    contacts,
    relationships,
    addContact,
    addRelationship,
    removeRelationship,
  } = useContactsData()

  const handleSave = (contact: Contact) => {
    addContact(contact, null)
    router.push(`/people/${contact.id}`)
  }

  const handleCancel = () => {
    router.push("/people")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to People
        </Link>

        <ContactForm
          contact={null}
          onSave={handleSave}
          onCancel={handleCancel}
          allContacts={contacts}
          relationships={relationships}
          onRelationshipAdd={addRelationship}
          onRelationshipRemove={removeRelationship}
        />
      </main>
    </div>
  )
}
