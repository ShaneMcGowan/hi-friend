"use client"

import { useRouter } from "next/navigation"
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
