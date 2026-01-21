"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useContactsData } from "@/hooks/use-contacts-data"
import { FamilyGraph } from "@/lib/family-graph"
import { getDisplayName } from "@/lib/utils"

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

  // Build family graph and infer relationships
  const familyGraph = useMemo(() => new FamilyGraph(contacts), [contacts])

  const parents = contact ? familyGraph.getParents(contact.id) : []
  const children = contact ? familyGraph.getChildren(contact.id) : []
  const siblings = contact ? familyGraph.getAllSiblings(contact.id) : []
  const extendedFamily = contact ? familyGraph.getExtendedFamily(contact.id) : []

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
              <h1 className="text-2xl font-bold text-foreground">{getDisplayName(contact)}</h1>
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
            {/* Structured Name */}
            {(contact.givenName || contact.familyName || contact.additionalNames || contact.honorificPrefixes || contact.honorificSuffixes || contact.maidenName) && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Name Details</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {contact.honorificPrefixes && (
                    <div>
                      <span className="text-muted-foreground">Prefix: </span>
                      <span className="text-foreground">{contact.honorificPrefixes}</span>
                    </div>
                  )}
                  {contact.givenName && (
                    <div>
                      <span className="text-muted-foreground">Given: </span>
                      <span className="text-foreground">{contact.givenName}</span>
                    </div>
                  )}
                  {contact.additionalNames && (
                    <div>
                      <span className="text-muted-foreground">Middle: </span>
                      <span className="text-foreground">{contact.additionalNames}</span>
                    </div>
                  )}
                  {contact.familyName && (
                    <div>
                      <span className="text-muted-foreground">Family: </span>
                      <span className="text-foreground">{contact.familyName}</span>
                    </div>
                  )}
                  {contact.maidenName && (
                    <div>
                      <span className="text-muted-foreground">Maiden: </span>
                      <span className="text-foreground">{contact.maidenName}</span>
                    </div>
                  )}
                  {contact.honorificSuffixes && (
                    <div>
                      <span className="text-muted-foreground">Suffix: </span>
                      <span className="text-foreground">{contact.honorificSuffixes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
            {contact.isDeceased && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deceased</p>
                <p className="text-foreground mt-1">
                  {contact.deathDate
                    ? new Date(contact.deathDate).toLocaleDateString()
                    : "Date unknown"}
                </p>
              </div>
            )}

            {/* Parents */}
            {parents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Parents
                </p>
                <div className="space-y-2">
                  {parents.map((parent) => (
                    <Link
                      key={parent.id}
                      href={`/people/${parent.id}`}
                      className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-foreground font-semibold">{getDisplayName(parent)}</span>
                      <span className="text-xs text-muted-foreground">Click to view</span>
                    </Link>
                  ))}
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
                      <span className="text-foreground font-semibold">{getDisplayName(sibling)}</span>
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
                      <span className="text-foreground font-semibold">{getDisplayName(child)}</span>
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
                        <span className="text-foreground font-semibold">{getDisplayName(ef.contact)}</span>
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
                          <span className="text-foreground font-semibold">{relatedContact ? getDisplayName(relatedContact) : 'Unknown'}</span>
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
