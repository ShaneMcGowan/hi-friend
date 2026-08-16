"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, X } from "lucide-react"
import { CollegeList } from "@/components/college-list"
import { useCollegesData } from "@/hooks/use-colleges-data"
import { COLLEGE_TYPES, type CollegeType } from "@/lib/types"

export default function CollegesPage() {
  const router = useRouter()
  const { colleges } = useCollegesData()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<(CollegeType | "none")[]>([])

  const toggleType = (type: CollegeType | "none") => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const filteredColleges = colleges.filter((college) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      college.name?.toLowerCase().includes(term) ||
      college.description?.toLowerCase().includes(term) ||
      college.website?.toLowerCase().includes(term) ||
      college.address?.toLowerCase().includes(term) ||
      college.emails?.some((e) => e.value.toLowerCase().includes(term)) ||
      college.phones?.some((p) => p.value.toLowerCase().includes(term))

    if (!matchesSearch) return false

    if (selectedTypes.length > 0) {
      const matchesType = college.type && selectedTypes.includes(college.type)
      const matchesNoType = !college.type && selectedTypes.includes("none")
      if (!matchesType && !matchesNoType) return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Colleges</h2>
          </div>
          <button
            onClick={() => router.push("/colleges/new")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            + New College
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {COLLEGE_TYPES.map(type => (
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

        <CollegeList
          colleges={filteredColleges}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </main>
    </div>
  )
}
