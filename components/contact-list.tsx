"use client"

import type { Contact } from "@/lib/types"

interface ContactListProps {
  contacts: Contact[]
  selectedContact: Contact | null
  onSelectContact: (contact: Contact) => void
  onEditContact: (contact: Contact) => void
  onDeleteContact: (id: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function ContactList({
  contacts,
  selectedContact,
  onSelectContact,
  onEditContact,
  onDeleteContact,
  searchTerm,
  onSearchChange,
}: ContactListProps) {
  const categoryColors: Record<string, string> = {
    Family: "bg-red-100 text-red-700",
    "Close Friends": "bg-purple-100 text-purple-700",
    Friends: "bg-blue-100 text-blue-700",
    Colleagues: "bg-amber-100 text-amber-700",
    Acquaintances: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>

      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {contacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No contacts yet. Create one to get started!</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedContact?.id === contact.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{contact.name}</h4>
                  {contact.category && (
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded mt-1 ${categoryColors[contact.category] || "bg-gray-100 text-gray-700"}`}
                    >
                      {contact.category}
                    </span>
                  )}
                  {contact.email && <p className="text-xs text-muted-foreground truncate mt-1">{contact.email}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
