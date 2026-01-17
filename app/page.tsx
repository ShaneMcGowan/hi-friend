"use client"

import { useState, useEffect } from "react"
import { ContactList } from "@/components/contact-list"
import { ContactForm } from "@/components/contact-form"
import { UpcomingReminders } from "@/components/upcoming-reminders"
import { ExportImport } from "@/components/export-import"
import { RelationshipGraph } from "@/components/relationship-graph"
import type { Contact, Relationship } from "@/lib/types"

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedContacts = localStorage.getItem("crm-contacts")
    const savedRelationships = localStorage.getItem("crm-relationships")

    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (e) {
        console.error("Failed to load contacts:", e)
      }
    }

    if (savedRelationships) {
      try {
        setRelationships(JSON.parse(savedRelationships))
      } catch (e) {
        console.error("Failed to load relationships:", e)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("crm-contacts", JSON.stringify(contacts))
      localStorage.setItem("crm-relationships", JSON.stringify(relationships))
    }
  }, [contacts, relationships, isLoaded])

  const handleAddContact = (contact: Contact) => {
    if (selectedContact) {
      setContacts(contacts.map((c) => (c.id === selectedContact.id ? contact : c)))
    } else {
      setContacts([...contacts, contact])
    }
    setIsFormOpen(false)
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id))
    setRelationships(relationships.filter((r) => r.contactId1 !== id && r.contactId2 !== id))
    setSelectedContact(null)
  }

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsFormOpen(true)
  }

  const handleNewContact = () => {
    setSelectedContact(null)
    setIsFormOpen(true)
  }

  const handleAddRelationship = (relationship: Relationship) => {
    setRelationships([...relationships, relationship])
  }

  const handleRemoveRelationship = (relationshipId: string) => {
    setRelationships(relationships.filter((r) => r.id !== relationshipId))
  }

  const handleImport = (importedContacts: Contact[], importedRelationships?: Relationship[]) => {
    setContacts(importedContacts)
    if (importedRelationships) {
      setRelationships(importedRelationships)
    }
  }

  const handleAddContacts = (newContacts: Contact[]) => {
    setContacts((prev) => [...prev, ...newContacts])
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.interests?.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const selectedContactRelationships = selectedContact
    ? relationships.filter((r) => r.contactId1 === selectedContact.id || r.contactId2 === selectedContact.id)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Hi, Friend</h1>
              <p className="text-sm text-muted-foreground">Your personal CRM for friends & family</p>
            </div>
            <div className="flex items-center gap-2">
              <ExportImport contacts={contacts} relationships={relationships} onImport={handleImport} onAddContacts={handleAddContacts} />
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
              >
                {showGraph ? "List View" : "Network View"}
              </button>
              <button
                onClick={handleNewContact}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                + New Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showGraph ? (
          <div className="space-y-6">
            <RelationshipGraph
              contacts={contacts}
              relationships={relationships}
              selectedContact={selectedContact}
              onContactClick={setSelectedContact}
            />
            {selectedContact && !isFormOpen && (
              <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedContact.name}</h2>
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
                  {selectedContact.phone && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                      <p className="text-foreground mt-1">{selectedContact.phone}</p>
                    </div>
                  )}
                  {selectedContact.email && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                      <p className="text-foreground mt-1">{selectedContact.email}</p>
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
                                <span className="text-foreground font-semibold">{relatedContact?.name}</span>
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Contact List */}
            <div className="lg:col-span-1">
              <ContactList
                contacts={filteredContacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
                onEditContact={handleEditContact}
                onDeleteContact={handleDeleteContact}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {isFormOpen && (
                <ContactForm
                  contact={selectedContact}
                  onSave={handleAddContact}
                  onCancel={() => {
                    setIsFormOpen(false)
                    setSelectedContact(null)
                  }}
                  allContacts={contacts}
                  relationships={relationships}
                  onRelationshipAdd={handleAddRelationship}
                  onRelationshipRemove={handleRemoveRelationship}
                />
              )}

              {selectedContact && !isFormOpen && (
                <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedContact.name}</h2>
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
                    {/* Contact Info */}
                    {selectedContact.phone && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                        <p className="text-foreground mt-1">{selectedContact.phone}</p>
                      </div>
                    )}
                    {selectedContact.email && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                        <p className="text-foreground mt-1">{selectedContact.email}</p>
                      </div>
                    )}
                    {selectedContact.address && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</p>
                        <p className="text-foreground mt-1">{selectedContact.address}</p>
                      </div>
                    )}
                    {selectedContact.birthday && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Birthday</p>
                        <p className="text-foreground mt-1">
                          {new Date(selectedContact.birthday).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Relationships */}
                    {selectedContactRelationships.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Relationships
                        </p>
                        <div className="space-y-2">
                          {selectedContactRelationships.map((rel) => {
                            const otherContactId =
                              rel.contactId1 === selectedContact.id ? rel.contactId2 : rel.contactId1
                            const relationshipText = rel.contactId1 === selectedContact.id ? rel.type1To2 : rel.type2To1
                            const relatedContact = contacts.find((c) => c.id === otherContactId)
                            return (
                              <div
                                key={rel.id}
                                className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => setSelectedContact(relatedContact || null)}
                              >
                                <div>
                                  <span className="text-foreground font-semibold">{relatedContact?.name}</span>
                                  <span className="text-muted-foreground"> ({relationshipText})</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Click to view</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
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

                    {/* Important Dates */}
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

                    {/* Notes */}
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

              {!isFormOpen && !selectedContact && <UpcomingReminders contacts={contacts} />}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
