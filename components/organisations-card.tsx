"use client"

import Link from "next/link"
import type { Contact, Organisation } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface OrganisationsCardProps {
  contact: Contact
  organisations: Organisation[]
  className?: string
}

export function OrganisationsCard({ contact, organisations, className }: OrganisationsCardProps) {
  const contactOrganisations = (contact.organisationIds || [])
    .map((id) => organisations.find((o) => o.id === id))
    .filter((o): o is Organisation => Boolean(o))

  if (contactOrganisations.length === 0) return null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Organisations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {contactOrganisations.map((organisation) => (
            <Link
              key={organisation.id}
              href={`/organisations/${organisation.id}`}
              className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div>
                <span className="text-foreground font-semibold">
                  {organisation.name || "Untitled Organisation"}
                </span>
                {organisation.type && <span className="text-muted-foreground"> ({organisation.type})</span>}
              </div>
              <span className="text-xs text-muted-foreground">Click to view</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
