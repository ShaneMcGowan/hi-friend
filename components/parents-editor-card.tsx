"use client"

import type { Contact } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface ParentsEditorCardProps {
  contactId: string
  value: string[]
  onChange: (parentIds: string[]) => void
  allContacts: Contact[]
  className?: string
}

export function ParentsEditorCard({
  contactId,
  value,
  onChange,
  allContacts,
  className,
}: ParentsEditorCardProps) {
  const availableParents = allContacts.filter((c) => c.id !== contactId && !value.includes(c.id))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Parents</CardTitle>
        <CardDescription>Select up to 2 parents from your contacts</CardDescription>
      </CardHeader>
      <CardContent>
        {value.length < 2 && (
          <div className="mb-2">
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  onChange([...value, e.target.value])
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="">Select a parent</option>
              {availableParents.map((c) => (
                <option key={c.id} value={c.id}>
                  {getDisplayName(c)}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-2">
          {value.map((parentId) => {
            const parent = allContacts.find((c) => c.id === parentId)
            return (
              <div key={parentId} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                <span className="text-foreground">{parent ? getDisplayName(parent) : "Unknown Contact"}</span>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((id) => id !== parentId))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
