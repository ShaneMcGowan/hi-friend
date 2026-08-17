"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useCollegesData } from "@/hooks/use-colleges-data"
import { useContactsData } from "@/hooks/use-contacts-data"
import { EducationGantt } from "@/components/education-gantt"
import { getDisplayName } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CollegePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { colleges, isLoaded, deleteCollege } = useCollegesData()
  const { contacts } = useContactsData()

  const college = colleges.find((c) => c.id === id)

  // One row per person, with all their stints here listed inside it.
  const students = useMemo(
    () =>
      contacts
        .map((contact) => ({
          contact,
          entries: (contact.education || [])
            .filter((entry) => entry.collegeId === id)
            .sort((a, b) => Number(a.startYear || 0) - Number(b.startYear || 0)),
        }))
        .filter((student) => student.entries.length > 0)
        .sort((a, b) => getDisplayName(a.contact).localeCompare(getDisplayName(b.contact))),
    [contacts, id]
  )

  // The chart wants them flat — it does its own grouping into one row per person.
  const ganttRows = useMemo(
    () => students.flatMap(({ contact, entries }) => entries.map((entry) => ({ contact, entry }))),
    [students]
  )

  const handleDelete = () => {
    if (college) {
      deleteCollege(college.id)
      router.push("/colleges")
    }
  }

  // Wait for localStorage to hydrate, otherwise "not found" flashes on a direct load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground py-8">Loading…</p>
        </main>
      </div>
    )
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm text-center">
            <p className="text-muted-foreground">College not found</p>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Colleges
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const websiteHref = college.website?.startsWith("http")
    ? college.website
    : `https://${college.website}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Colleges
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/colleges/${college.id}/edit`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete College</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{college.name || "this college"}</strong>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{college.name || "Untitled College"}</h1>
            {college.type && (
              <p className="text-sm text-muted-foreground mt-1">{college.type}</p>
            )}
          </div>

          <div className="space-y-6">
            {college.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                <p className="text-foreground">{college.description}</p>
              </div>
            )}

            {college.website && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Website</p>
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {college.website}
                </a>
              </div>
            )}

            {college.address && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Address</p>
                <p className="text-foreground whitespace-pre-line">{college.address}</p>
              </div>
            )}

            {college.emails && college.emails.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Email Addresses</p>
                <div className="space-y-2">
                  {college.emails.map((email, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                      <span className="text-foreground">
                        <span className="font-semibold">{email.label}:</span> {email.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {college.phones && college.phones.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Phone Numbers</p>
                <div className="space-y-2">
                  {college.phones.map((phone, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                      <span className="text-foreground">
                        <span className="font-semibold">{phone.label}:</span> {phone.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {college.notes && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Notes</p>
                <p className="text-foreground whitespace-pre-line">{college.notes}</p>
              </div>
            )}

            {ganttRows.length > 0 && <EducationGantt rows={ganttRows} />}

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                People {students.length > 0 && `(${students.length})`}
              </p>
              {students.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No one has studied here yet. Add this college to someone&apos;s education from their edit page.
                </p>
              ) : (
                <div className="space-y-2">
                  {students.map(({ contact, entries }) => (
                    <Link
                      key={contact.id}
                      href={`/people/${contact.id}`}
                      className="block py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-foreground font-semibold">{getDisplayName(contact)}</span>
                      <div className="mt-1 space-y-1">
                        {entries.map((entry) => {
                          const years = [entry.startYear, entry.endYear].filter(Boolean).join(" – ")
                          return (
                            <div key={entry.id} className="flex justify-between items-center gap-3">
                              <span className="text-sm text-muted-foreground min-w-0">
                                {[entry.course, entry.level, years].filter(Boolean).join(" · ") ||
                                  "No details recorded"}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                                  entry.completed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {entry.completed ? "Completed" : "Not completed"}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
