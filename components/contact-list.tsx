"use client"

import Link from "next/link"
import type { Contact } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"

interface ContactListProps {
  contacts: Contact[]
  selectedContactId?: string | null
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function ContactList({
  contacts,
  selectedContactId,
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
            <Link
              key={contact.id}
              href={`/people/${contact.id}`}
              className={`block p-3 rounded-lg border transition-all ${
                selectedContactId === contact.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{getDisplayName(contact)}</h4>
                  {contact.category && (
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded mt-1 ${categoryColors[contact.category] || "bg-gray-100 text-gray-700"}`}
                    >
                      {contact.category}
                    </span>
                  )}
                  {contact.emails && contact.emails.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {contact.emails[0].value}
                      {contact.emails.length > 1 && ` (+${contact.emails.length - 1} more)`}
                    </p>
                  )}
                  {/* Legacy support for old email field */}
                  {(!contact.emails || contact.emails.length === 0) && contact.email && (
                    <p className="text-xs text-muted-foreground truncate mt-1">{contact.email}</p>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
