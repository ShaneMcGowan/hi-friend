"use client"

import { useState } from "react"
import { Network } from "lucide-react"
import { RelationshipGraph } from "@/components/relationship-graph"
import { ContactForm } from "@/components/contact-form"
import { useContactsData } from "@/hooks/use-contacts-data"
import type { Contact } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"

export default function NetworkPage() {
  const {
    contacts,
    relationships,
    addContact,
    deleteContact,
    addRelationship,
    removeRelationship,
  } = useContactsData()

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsFormOpen(true)
  }

  const handleDeleteContact = (id: string) => {
    deleteContact(id)
    setSelectedContact(null)
  }

  const handleSaveContact = (contact: Contact) => {
    addContact(contact, selectedContact)
    setIsFormOpen(false)
  }

  const selectedContactRelationships = selectedContact
    ? relationships.filter((r) => r.contactId1 === selectedContact.id || r.contactId2 === selectedContact.id)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Network className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Network</h2>
        </div>
        <div className="space-y-6">
          <RelationshipGraph
            contacts={contacts}
            relationships={relationships}
            selectedContact={selectedContact}
            onContactClick={setSelectedContact}
          />

          {isFormOpen && selectedContact && (
            <ContactForm
              contact={selectedContact}
              onSave={handleSaveContact}
              onCancel={() => {
                setIsFormOpen(false)
              }}
              allContacts={contacts}
              relationships={relationships}
              onRelationshipAdd={addRelationship}
              onRelationshipRemove={removeRelationship}
            />
          )}

          {selectedContact && !isFormOpen && (
            <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{getDisplayName(selectedContact)}</h2>
                  {selectedContact.category && (
                    <p className="text-sm text-muted-foreground mt-1">{selectedContact.category}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditContact(selectedContact)}
                    className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {selectedContact.phones && selectedContact.phones.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Phone Numbers</p>
                    <div className="space-y-2">
                      {selectedContact.phones.map((phone, idx) => (
                        <div key={idx} className="py-2 px-3 bg-muted rounded-lg">
                          <span className="text-sm font-semibold text-foreground">{phone.label}:</span>
                          <p className="text-foreground mt-1">{phone.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Legacy support for old phone field */}
                {(!selectedContact.phones || selectedContact.phones.length === 0) && (selectedContact as any).phone && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                    <p className="text-foreground mt-1">{(selectedContact as any).phone}</p>
                  </div>
                )}
                {selectedContact.emails && selectedContact.emails.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Email Addresses</p>
                    <div className="space-y-2">
                      {selectedContact.emails.map((email, idx) => (
                        <div key={idx} className="py-2 px-3 bg-muted rounded-lg">
                          <span className="text-sm font-semibold text-foreground">{email.label}:</span>
                          <p className="text-foreground mt-1">{email.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Legacy support for old email field */}
                {(!selectedContact.emails || selectedContact.emails.length === 0) && (selectedContact as any).email && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="text-foreground mt-1">{(selectedContact as any).email}</p>
                  </div>
                )}

                {selectedContactRelationships.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Relationships
                    </p>
                    <div className="space-y-2">
                      {selectedContactRelationships.map((rel) => {
                        const otherContactId = rel.contactId1 === selectedContact.id ? rel.contactId2 : rel.contactId1
                        const relationshipText = rel.contactId1 === selectedContact.id ? rel.type1To2 : rel.type2To1
                        const relatedContact = contacts.find((c) => c.id === otherContactId)
                        return (
                          <div
                            key={rel.id}
                            className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => setSelectedContact(relatedContact || null)}
                          >
                            <div>
                              <span className="text-foreground font-semibold">{relatedContact ? getDisplayName(relatedContact) : 'Unknown'}</span>
                              <span className="text-muted-foreground"> ({relationshipText})</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Click to view</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedContact.interests && selectedContact.interests.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Interests & Preferences
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContact.importantDates && selectedContact.importantDates.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Important Dates
                    </p>
                    <div className="space-y-2">
                      {selectedContact.importantDates.map((date, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                          <span className="text-foreground">{date.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(date.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContact.notes && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Notes & History
                    </p>
                    <p className="text-foreground whitespace-pre-wrap">{selectedContact.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
