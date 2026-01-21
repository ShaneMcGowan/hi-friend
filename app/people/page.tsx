"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Users, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { ContactList } from "@/components/contact-list"
import { VcfImport } from "@/components/vcf-import"
import { useContactsData } from "@/hooks/use-contacts-data"
import { CATEGORIES, type Category } from "@/lib/types"

export default function PeoplePage() {
  const router = useRouter()
  const {
    contacts,
    addContacts,
  } = useContactsData()

  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [birthdayFilter, setBirthdayFilter] = useState<"all" | "has" | "missing">("all")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  // Get all unique interests from contacts
  const allInterests = useMemo(() => {
    const interests = new Set<string>()
    contacts.forEach(contact => {
      contact.interests?.forEach(i => interests.add(i))
    })
    return Array.from(interests).sort()
  }, [contacts])

  const handleNewContact = () => {
    router.push("/people/new")
  }

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setBirthdayFilter("all")
    setSelectedInterests([])
  }

  const activeFilterCount =
    selectedCategories.length +
    (birthdayFilter !== "all" ? 1 : 0) +
    selectedInterests.length

  const filteredContacts = contacts.filter((contact) => {
    // Search filter
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.interests?.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!matchesSearch) return false

    // Category filter
    if (selectedCategories.length > 0) {
      const contactCategory = contact.category
      if (!contactCategory || !selectedCategories.includes(contactCategory)) {
        return false
      }
    }

    // Birthday filter
    if (birthdayFilter === "has" && !contact.birthday) return false
    if (birthdayFilter === "missing" && contact.birthday) return false

    // Interests filter
    if (selectedInterests.length > 0) {
      const hasMatchingInterest = selectedInterests.some(interest =>
        contact.interests?.includes(interest)
      )
      if (!hasMatchingInterest) return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">People</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                activeFilterCount > 0
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <VcfImport onAddContacts={addContacts} />
            <button
              onClick={handleNewContact}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              + New Contact
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Filter Contacts</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedCategories.includes(category)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birthday Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Birthday
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "has", label: "Has birthday" },
                    { value: "missing", label: "Missing" },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setBirthdayFilter(option.value as typeof birthdayFilter)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        birthdayFilter === option.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests Filter */}
              {allInterests.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {allInterests.map(interest => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedInterests.includes(interest)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-muted"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ContactList
          contacts={filteredContacts}
          allContacts={contacts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </main>
    </div>
  )
}
