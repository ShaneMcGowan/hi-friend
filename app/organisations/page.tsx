"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, X } from "lucide-react"
import { OrganisationList } from "@/components/organisation-list"
import { useOrganisationsData } from "@/hooks/use-organisations-data"
import { ORGANISATION_TYPES, type OrganisationType } from "@/lib/types"

export default function OrganisationsPage() {
  const router = useRouter()
  const { organisations } = useOrganisationsData()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<(OrganisationType | "none")[]>([])

  const toggleType = (type: OrganisationType | "none") => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const filteredOrganisations = organisations.filter((organisation) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      organisation.name?.toLowerCase().includes(term) ||
      organisation.description?.toLowerCase().includes(term) ||
      organisation.website?.toLowerCase().includes(term) ||
      organisation.address?.toLowerCase().includes(term) ||
      organisation.emails?.some((e) => e.value.toLowerCase().includes(term)) ||
      organisation.phones?.some((p) => p.value.toLowerCase().includes(term))

    if (!matchesSearch) return false

    if (selectedTypes.length > 0) {
      const matchesType = organisation.type && selectedTypes.includes(organisation.type)
      const matchesNoType = !organisation.type && selectedTypes.includes("none")
      if (!matchesType && !matchesNoType) return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Organisations</h2>
          </div>
          <button
            onClick={() => router.push("/organisations/new")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            + New Organisation
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {ORGANISATION_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedTypes.includes(type)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              {type}
            </button>
          ))}
          <button
            onClick={() => toggleType("none")}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selectedTypes.includes("none")
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-muted"
            }`}
          >
            No Type
          </button>
          {selectedTypes.length > 0 && (
            <button
              onClick={() => setSelectedTypes([])}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <OrganisationList
          organisations={filteredOrganisations}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </main>
    </div>
  )
}
