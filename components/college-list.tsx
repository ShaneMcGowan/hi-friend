"use client"

import Link from "next/link"
import type { College } from "@/lib/types"

interface CollegeListProps {
  colleges: College[]
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function CollegeList({
  colleges,
  searchTerm,
  onSearchChange,
}: CollegeListProps) {
  const typeColors: Record<string, string> = {
    University: "bg-blue-100 text-blue-700",
    College: "bg-teal-100 text-teal-700",
    "Institute of Technology": "bg-cyan-100 text-cyan-700",
    "Secondary School": "bg-amber-100 text-amber-700",
    "Primary School": "bg-lime-100 text-lime-700",
    Other: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search colleges..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>

      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {colleges.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No colleges yet. Create one to get started!</p>
        ) : (
          colleges.map((college) => (
            <Link
              key={college.id}
              href={`/colleges/${college.id}`}
              className="block p-3 rounded-lg border border-border hover:border-primary/50 bg-white transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{college.name || "Untitled College"}</h4>
                  {college.type && (
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded mt-1 ${typeColors[college.type] || "bg-gray-100 text-gray-700"}`}
                    >
                      {college.type}
                    </span>
                  )}
                  {college.description && (
                    <p className="text-xs text-muted-foreground truncate mt-1">{college.description}</p>
                  )}
                  {college.emails && college.emails.length > 0 ? (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {college.emails[0].value}
                      {college.emails.length > 1 && ` (+${college.emails.length - 1} more)`}
                    </p>
                  ) : (
                    college.website && (
                      <p className="text-xs text-muted-foreground truncate mt-1">{college.website}</p>
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
