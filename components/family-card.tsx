"use client"

import { useMemo } from "react"
import type { Contact } from "@/lib/types"
import { FamilyGraph } from "@/lib/family-graph"
import { getDisplayName } from "@/lib/utils"
import { PersonLinkRow } from "@/components/person-link-row"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface FamilyCardProps {
  contact: Contact
  contacts: Contact[]
  className?: string
}

function FamilySection({ title, people }: { title: string; people: Contact[] }) {
  if (people.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
      <div className="space-y-2">
        {people.map((person) => (
          <PersonLinkRow key={person.id} id={person.id} name={getDisplayName(person)} />
        ))}
      </div>
    </div>
  )
}

export function FamilyCard({ contact, contacts, className }: FamilyCardProps) {
  const familyGraph = useMemo(() => new FamilyGraph(contacts), [contacts])

  const parents = familyGraph.getParents(contact.id)
  const siblings = familyGraph.getAllSiblings(contact.id)
  const children = familyGraph.getChildren(contact.id)
  const extendedFamily = familyGraph.getExtendedFamily(contact.id)

  if (!parents.length && !siblings.length && !children.length && !extendedFamily.length) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Family</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FamilySection title="Parents" people={parents} />
        <FamilySection title="Siblings" people={siblings} />
        <FamilySection title="Children" people={children} />
        {extendedFamily.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Extended Family
            </p>
            <div className="space-y-2">
              {extendedFamily.map((ef) => (
                <PersonLinkRow
                  key={ef.contact.id}
                  id={ef.contact.id}
                  name={getDisplayName(ef.contact)}
                  detail={ef.relation}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
