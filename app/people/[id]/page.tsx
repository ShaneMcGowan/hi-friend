"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useContactsData } from "@/hooks/use-contacts-data"

export default function PersonPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const {
    contacts,
    relationships,
    deleteContact,
  } = useContactsData()

  const contact = contacts.find((c) => c.id === id)

  const contactRelationships = contact
    ? relationships.filter((r) => r.contactId1 === contact.id || r.contactId2 === contact.id)
    : []

  // Infer family relationships from parentIds
  const siblings = contact?.parentIds?.length
    ? contacts.filter(
        (c) =>
          c.id !== contact.id &&
          c.parentIds?.some((pid) => contact.parentIds?.includes(pid))
      )
    : []

  const children = contact
    ? contacts.filter((c) => c.parentIds?.includes(contact.id))
    : []

  // Extended family: grandparents, grandchildren, aunts/uncles, nieces/nephews
  const extendedFamily: { contact: typeof contacts[0]; relation: string }[] = []

  if (contact) {
    // Grandparents (parents of parents)
    const parentContacts = contacts.filter((c) => contact.parentIds?.includes(c.id))
    for (const parent of parentContacts) {
      if (parent.parentIds) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = contacts.find((c) => c.id === grandparentId)
          if (grandparent && !extendedFamily.some((ef) => ef.contact.id === grandparent.id)) {
            extendedFamily.push({ contact: grandparent, relation: "Grandparent" })
          }
        }
      }
    }

    // Grandchildren (children of children)
    for (const child of children) {
      const grandchildren = contacts.filter((c) => c.parentIds?.includes(child.id))
      for (const grandchild of grandchildren) {
        if (!extendedFamily.some((ef) => ef.contact.id === grandchild.id)) {
          extendedFamily.push({ contact: grandchild, relation: "Grandchild" })
        }
      }
    }

    // Aunts/Uncles (siblings of parents)
    for (const parent of parentContacts) {
      const parentSiblings = parent.parentIds?.length
        ? contacts.filter(
            (c) =>
              c.id !== parent.id &&
              c.parentIds?.some((pid) => parent.parentIds?.includes(pid))
          )
        : []
      for (const auntUncle of parentSiblings) {
        if (!extendedFamily.some((ef) => ef.contact.id === auntUncle.id)) {
          extendedFamily.push({ contact: auntUncle, relation: "Aunt/Uncle" })
        }
      }
    }

    // Nieces/Nephews (children of siblings)
    for (const sibling of siblings) {
      const niecesNephews = contacts.filter((c) => c.parentIds?.includes(sibling.id))
      for (const nieceNephew of niecesNephews) {
        if (!extendedFamily.some((ef) => ef.contact.id === nieceNephew.id)) {
          extendedFamily.push({ contact: nieceNephew, relation: "Niece/Nephew" })
        }
      }
    }
  }

  const handleDelete = () => {
    if (contact) {
      deleteContact(contact.id)
      router.push("/people")
    }
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm text-center">
            <p className="text-muted-foreground">Contact not found</p>
            <Link
              href="/people"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to People
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to People
        </Link>

        <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{contact.name}</h1>
              {contact.category && (
                <p className="text-sm text-muted-foreground mt-1">{contact.category}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/people/${contact.id}/edit`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact Info */}
            {contact.phone && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                <p className="text-foreground mt-1">{contact.phone}</p>
              </div>
            )}
            {contact.email && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                <p className="text-foreground mt-1">{contact.email}</p>
              </div>
            )}
            {contact.address && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</p>
                <p className="text-foreground mt-1">{contact.address}</p>
              </div>
            )}
            {contact.birthday && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Birthday</p>
                <p className="text-foreground mt-1">
                  {new Date(contact.birthday).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Parents */}
            {contact.parentIds && contact.parentIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Parents
                </p>
                <div className="space-y-2">
                  {contact.parentIds.map((parentId) => {
                    const parent = contacts.find((c) => c.id === parentId)
                    if (!parent) return null
                    return (
                      <Link
                        key={parentId}
                        href={`/people/${parentId}`}
                        className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <span className="text-foreground font-semibold">{parent.name}</span>
                        <span className="text-xs text-muted-foreground">Click to view</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Siblings */}
            {siblings.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Siblings
                </p>
                <div className="space-y-2">
                  {siblings.map((sibling) => (
                    <Link
                      key={sibling.id}
                      href={`/people/${sibling.id}`}
                      className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-foreground font-semibold">{sibling.name}</span>
                      <span className="text-xs text-muted-foreground">Click to view</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Children */}
            {children.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Children
                </p>
                <div className="space-y-2">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/people/${child.id}`}
                      className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-foreground font-semibold">{child.name}</span>
                      <span className="text-xs text-muted-foreground">Click to view</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Extended Family */}
            {extendedFamily.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Family
                </p>
                <div className="space-y-2">
                  {extendedFamily.map((ef) => (
                    <Link
                      key={ef.contact.id}
                      href={`/people/${ef.contact.id}`}
                      className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div>
                        <span className="text-foreground font-semibold">{ef.contact.name}</span>
                        <span className="text-muted-foreground"> ({ef.relation})</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Click to view</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Relationships */}
            {contactRelationships.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Relationships
                </p>
                <div className="space-y-2">
                  {contactRelationships.map((rel) => {
                    const otherContactId =
                      rel.contactId1 === contact.id ? rel.contactId2 : rel.contactId1
                    const relationshipText = rel.contactId1 === contact.id ? rel.type1To2 : rel.type2To1
                    const relatedContact = contacts.find((c) => c.id === otherContactId)
                    return (
                      <Link
                        key={rel.id}
                        href={`/people/${otherContactId}`}
                        className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div>
                          <span className="text-foreground font-semibold">{relatedContact?.name}</span>
                          <span className="text-muted-foreground"> ({relationshipText})</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Click to view</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Interests */}
            {contact.interests && contact.interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Interests & Preferences
                </p>
                <div className="flex flex-wrap gap-2">
                  {contact.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Important Dates */}
            {contact.importantDates && contact.importantDates.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Important Dates
                </p>
                <div className="space-y-2">
                  {contact.importantDates.map((date, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                      <span className="text-foreground">{date.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(date.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Notes & History
                </p>
                <p className="text-foreground whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
