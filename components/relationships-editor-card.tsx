"use client"

import { useState } from "react"
import type { Contact, Relationship } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface RelationshipsEditorCardProps {
  contact: Contact
  allContacts: Contact[]
  relationships: Relationship[]
  onAdd: (relationship: Relationship) => void
  onRemove: (relationshipId: string) => void
  className?: string
}

const OPPOSITE_RELATIONSHIPS: Record<string, string> = {
  Parent: "Child",
  Child: "Parent",
  Sibling: "Sibling",
  Spouse: "Spouse",
  Partner: "Partner",
  Friend: "Friend",
  Colleague: "Colleague",
  Other: "Other",
}

function getOppositeRelationship(relationshipType: string): string {
  return OPPOSITE_RELATIONSHIPS[relationshipType] || "Other"
}

export function RelationshipsEditorCard({
  contact,
  allContacts,
  relationships,
  onAdd,
  onRemove,
  className,
}: RelationshipsEditorCardProps) {
  const [selectedContactId, setSelectedContactId] = useState("")
  const [type1To2, setType1To2] = useState("")

  const contactRelationships = relationships.filter(
    (r) => r.contactId1 === contact.id || r.contactId2 === contact.id,
  )

  const availableContacts = allContacts.filter(
    (c) => c.id !== contact.id && !contactRelationships.some((r) => r.contactId1 === c.id || r.contactId2 === c.id),
  )

  const getContactNameById = (id: string) => {
    const c = allContacts.find((c) => c.id === id)
    return c ? getDisplayName(c) : "Unknown"
  }

  const createLink = () => {
    if (!selectedContactId || !type1To2) return

    onAdd({
      id: Math.random().toString(36).substring(7),
      contactId1: contact.id,
      contactId2: selectedContactId,
      type1To2,
      type2To1: getOppositeRelationship(type1To2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setSelectedContactId("")
    setType1To2("")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Relationships</CardTitle>
        <CardDescription>Link this person to other contacts. Changes save immediately.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <select
            value={selectedContactId}
            onChange={(e) => setSelectedContactId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">Select a contact</option>
            {availableContacts.map((c) => (
              <option key={c.id} value={c.id}>
                {getDisplayName(c)}
              </option>
            ))}
          </select>
          {selectedContactId && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                <span className="font-semibold text-foreground">{getDisplayName(contact)}</span> is the{" "}
                <span className="font-semibold text-foreground">{type1To2 || "[relationship]"}</span> of{" "}
                <span className="font-semibold text-foreground">{getContactNameById(selectedContactId)}</span>
              </label>
              <select
                value={type1To2}
                onChange={(e) => setType1To2(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Partner">Partner</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>
              {type1To2 && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {getContactNameById(selectedContactId)} is your {getOppositeRelationship(type1To2).toLowerCase()}
                </p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={createLink}
            disabled={!selectedContactId || !type1To2}
            className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Link
          </button>
        </div>

        {contactRelationships.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Current Links</p>
            {contactRelationships.map((rel) => {
              const otherContactId = rel.contactId1 === contact.id ? rel.contactId2 : rel.contactId1
              const relationshipText = rel.contactId1 === contact.id ? rel.type1To2 : rel.type2To1
              return (
                <div key={rel.id} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                  <span className="text-foreground text-sm">
                    <span className="font-semibold">{getContactNameById(otherContactId)}</span> ({relationshipText})
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(rel.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
