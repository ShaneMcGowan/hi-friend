"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { OrganisationForm } from "@/components/organisation-form"
import { useOrganisationsData } from "@/hooks/use-organisations-data"
import type { Organisation } from "@/lib/types"

export default function NewOrganisationPage() {
  const router = useRouter()
  const { addOrganisation } = useOrganisationsData()

  const handleSave = (organisation: Organisation) => {
    addOrganisation(organisation, null)
    router.push(`/organisations/${organisation.id}`)
  }

  const handleCancel = () => {
    router.push("/organisations")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/organisations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Organisations
          </Link>
          <button
            type="submit"
            form="organisation-form"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Organisation
          </button>
        </div>

        <OrganisationForm organisation={null} onSave={handleSave} onCancel={handleCancel} />
      </main>
    </div>
  )
}
