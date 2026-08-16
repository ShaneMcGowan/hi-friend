"use client"

import Link from "next/link"

interface PersonLinkRowProps {
  id: string
  name: string
  detail?: string
}

export function PersonLinkRow({ id, name, detail }: PersonLinkRowProps) {
  return (
    <Link
      href={`/people/${id}`}
      className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
    >
      <div>
        <span className="text-foreground font-semibold">{name}</span>
        {detail && <span className="text-muted-foreground"> ({detail})</span>}
      </div>
      <span className="text-xs text-muted-foreground">Click to view</span>
    </Link>
  )
}
