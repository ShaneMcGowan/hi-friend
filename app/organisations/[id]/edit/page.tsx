"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { OrganisationForm } from "@/components/organisation-form"
import { useOrganisationsData } from "@/hooks/use-organisations-data"
import type { Organisation } from "@/lib/types"

export default function EditOrganisationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { organisations, isLoaded, addOrganisation } = useOrganisationsData()

  const organisation = organisations.find((o) => o.id === id)

  const handleSave = (updatedOrganisation: Organisation) => {
    addOrganisation(updatedOrganisation, organisation)
    router.push(`/organisations/${id}`)
  }

  const handleCancel = () => {
    router.push(`/organisations/${id}`)
  }

  // Wait for localStorage to hydrate — the form seeds its state from `organisation`
  // on first render, so it must not mount before the organisation resolves.
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground py-8">Loading…</p>
        </main>
      </div>
    )
  }

  if (!organisation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm text-center">
            <p className="text-muted-foreground">Organisation not found</p>
            <Link
              href="/organisations"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Organisations
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/organisations/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {organisation.name || "Organisation"}
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="organisation-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Update Organisation
            </button>
          </div>
        </div>

        <OrganisationForm organisation={organisation} onSave={handleSave} onCancel={handleCancel} />
      </main>
    </div>
  )
}
