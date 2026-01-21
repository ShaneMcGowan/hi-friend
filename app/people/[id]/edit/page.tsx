"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { useContactsData } from "@/hooks/use-contacts-data"
import type { Contact } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"

export default function EditPersonPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const {
    contacts,
    relationships,
    addContact,
    addRelationship,
    removeRelationship,
  } = useContactsData()

  const contact = contacts.find((c) => c.id === id)

  const handleSave = (updatedContact: Contact) => {
    addContact(updatedContact, contact)
    router.push(`/people/${id}`)
  }

  const handleCancel = () => {
    router.push(`/people/${id}`)
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm text-center">
            <p className="text-muted-foreground">Contact not found</p>
            <Link
              href="/people"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to People
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/people/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {getDisplayName(contact)}
        </Link>

        <ContactForm
          contact={contact}
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
