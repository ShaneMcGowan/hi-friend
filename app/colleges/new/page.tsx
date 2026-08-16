"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CollegeForm } from "@/components/college-form"
import { useCollegesData } from "@/hooks/use-colleges-data"
import type { College } from "@/lib/types"

export default function NewCollegePage() {
  const router = useRouter()
  const { addCollege } = useCollegesData()

  const handleSave = (college: College) => {
    addCollege(college, null)
    router.push(`/colleges/${college.id}`)
  }

  const handleCancel = () => {
    router.push("/colleges")
  }

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
          <button
            type="submit"
            form="college-form"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create College
          </button>
        </div>

        <CollegeForm college={null} onSave={handleSave} onCancel={handleCancel} />
      </main>
    </div>
  )
}
