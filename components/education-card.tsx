"use client"

import Link from "next/link"
import type { College, Contact } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface EducationCardProps {
  contact: Contact
  colleges: College[]
  className?: string
}

export function EducationCard({ contact, colleges, className }: EducationCardProps) {
  const education = contact.education || []

  if (education.length === 0) return null

  // Most recent first; entries with no years sink to the bottom.
  const sorted = [...education].sort((a, b) => {
    const aYear = Number(a.endYear || a.startYear)
    const bYear = Number(b.endYear || b.startYear)
    if (!Number.isFinite(aYear) && !Number.isFinite(bYear)) return 0
    if (!Number.isFinite(aYear)) return 1
    if (!Number.isFinite(bYear)) return -1
    return bYear - aYear
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sorted.map((entry) => {
            const college = colleges.find((c) => c.id === entry.collegeId)
            const years = [entry.startYear, entry.endYear].filter(Boolean).join(" – ")

            const body = (
              <>
                <div className="min-w-0">
                  <span className="text-foreground font-semibold">
                    {college ? college.name || "Untitled College" : "Unknown College"}
                  </span>
                  {entry.course && <span className="text-muted-foreground"> — {entry.course}</span>}
                  <div className="text-sm text-muted-foreground">
                    {[entry.level, years].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                    entry.completed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {entry.completed ? "Completed" : "Not completed"}
                </span>
              </>
            )

            return college ? (
              <Link
                key={entry.id}
                href={`/colleges/${college.id}`}
                className="flex justify-between items-center gap-3 py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                {body}
              </Link>
            ) : (
              <div
                key={entry.id}
                className="flex justify-between items-center gap-3 py-2 px-3 bg-muted rounded-lg"
              >
                {body}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
