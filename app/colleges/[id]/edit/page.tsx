"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CollegeForm } from "@/components/college-form"
import { useCollegesData } from "@/hooks/use-colleges-data"
import type { College } from "@/lib/types"

export default function EditCollegePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { colleges, isLoaded, addCollege } = useCollegesData()

  const college = colleges.find((c) => c.id === id)

  const handleSave = (updatedCollege: College) => {
    addCollege(updatedCollege, college)
    router.push(`/colleges/${id}`)
  }

  const handleCancel = () => {
    router.push(`/colleges/${id}`)
  }

  // Wait for localStorage to hydrate — the form seeds its state from `college`
  // on first render, so it must not mount before the college resolves.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/colleges/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {college.name || "College"}
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
              form="college-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Update College
            </button>
          </div>
        </div>

        <CollegeForm college={college} onSave={handleSave} onCancel={handleCancel} />
      </main>
    </div>
  )
}
