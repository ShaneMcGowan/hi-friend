"use client"

import Link from "next/link"
import type { Organisation } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface OrganisationsEditorCardProps {
  value: string[]
  onChange: (organisationIds: string[]) => void
  allOrganisations: Organisation[]
  className?: string
}

export function OrganisationsEditorCard({
  value,
  onChange,
  allOrganisations,
  className,
}: OrganisationsEditorCardProps) {
  const toggle = (organisationId: string) => {
    onChange(
      value.includes(organisationId)
        ? value.filter((id) => id !== organisationId)
        : [...value, organisationId]
    )
  }

  // IDs left over from organisations that have since been deleted — surfaced so
  // they can be cleared rather than silently persisting on the contact.
  const orphanedIds = value.filter((id) => !allOrganisations.some((o) => o.id === id))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Organisations</CardTitle>
        <CardDescription>
          Select every place and group this person is part of
          {value.length > 0 && ` — ${value.length} selected`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allOrganisations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No organisations yet.{" "}
            <Link href="/organisations/new" className="text-primary hover:underline">
              Create one
            </Link>{" "}
            to link this person to it.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allOrganisations.map((organisation) => (
              <label
                key={organisation.id}
                className="flex items-center gap-3 py-2 px-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={value.includes(organisation.id)}
                  onChange={() => toggle(organisation.id)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-foreground">
                  {organisation.name || "Untitled Organisation"}
                  {organisation.type && (
                    <span className="text-muted-foreground"> ({organisation.type})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}

        {orphanedIds.length > 0 && (
          <div className="space-y-2 mt-2">
            {orphanedIds.map((organisationId) => (
              <div
                key={organisationId}
                className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg"
              >
                <span className="text-muted-foreground">Unknown Organisation</span>
                <button
                  type="button"
                  onClick={() => toggle(organisationId)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
