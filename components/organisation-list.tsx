"use client"

import Link from "next/link"
import type { Organisation } from "@/lib/types"

interface OrganisationListProps {
  organisations: Organisation[]
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function OrganisationList({
  organisations,
  searchTerm,
  onSearchChange,
}: OrganisationListProps) {
  const typeColors: Record<string, string> = {
    Shop: "bg-emerald-100 text-emerald-700",
    Club: "bg-purple-100 text-purple-700",
    Employer: "bg-amber-100 text-amber-700",
    School: "bg-blue-100 text-blue-700",
    "Sports Team": "bg-orange-100 text-orange-700",
    Venue: "bg-pink-100 text-pink-700",
    Other: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search organisations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>

      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {organisations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No organisations yet. Create one to get started!</p>
        ) : (
          organisations.map((organisation) => (
            <Link
              key={organisation.id}
              href={`/organisations/${organisation.id}`}
              className="block p-3 rounded-lg border border-border hover:border-primary/50 bg-white transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{organisation.name || "Untitled Organisation"}</h4>
                  {organisation.type && (
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded mt-1 ${typeColors[organisation.type] || "bg-gray-100 text-gray-700"}`}
                    >
                      {organisation.type}
                    </span>
                  )}
                  {organisation.description && (
                    <p className="text-xs text-muted-foreground truncate mt-1">{organisation.description}</p>
                  )}
                  {organisation.emails && organisation.emails.length > 0 ? (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {organisation.emails[0].value}
                      {organisation.emails.length > 1 && ` (+${organisation.emails.length - 1} more)`}
                    </p>
                  ) : (
                    organisation.website && (
                      <p className="text-xs text-muted-foreground truncate mt-1">{organisation.website}</p>
                    )
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
