"use client"

import type { Contact, Relationship } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"
import { PersonLinkRow } from "@/components/person-link-row"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface RelationshipsCardProps {
  contact: Contact
  contacts: Contact[]
  relationships: Relationship[]
  className?: string
}

export function RelationshipsCard({ contact, contacts, relationships, className }: RelationshipsCardProps) {
  const contactRelationships = relationships.filter(
    (r) => r.contactId1 === contact.id || r.contactId2 === contact.id,
  )

  if (contactRelationships.length === 0) return null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Relationships</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {contactRelationships.map((rel) => {
            const otherContactId = rel.contactId1 === contact.id ? rel.contactId2 : rel.contactId1
            const relationshipText = rel.contactId1 === contact.id ? rel.type1To2 : rel.type2To1
            const relatedContact = contacts.find((c) => c.id === otherContactId)
            return (
              <PersonLinkRow
                key={rel.id}
                id={otherContactId}
                name={relatedContact ? getDisplayName(relatedContact) : "Unknown"}
                detail={relationshipText}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
