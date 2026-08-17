"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"
import { EDUCATION_LEVELS, type College, type Education, type EducationLevel } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface EducationEditorCardProps {
  value: Education[]
  onChange: (education: Education[]) => void
  allColleges: College[]
  className?: string
}

export function EducationEditorCard({
  value,
  onChange,
  allColleges,
  className,
}: EducationEditorCardProps) {
  const update = (id: string, patch: Partial<Education>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  const remove = (id: string) => {
    onChange(value.filter((e) => e.id !== id))
  }

  const add = () => {
    onChange([
      ...value,
      {
        id: Math.random().toString(36).substring(7),
        collegeId: allColleges[0]?.id || "",
        course: "",
        level: undefined,
        startYear: "",
        endYear: "",
        completed: false,
      },
    ])
  }

  const inputClass =
    "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>
          Where this person studied
          {value.length > 0 && ` — ${value.length} ${value.length === 1 ? "entry" : "entries"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allColleges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No colleges yet.{" "}
            <Link href="/colleges/new" className="text-primary hover:underline">
              Create one
            </Link>{" "}
            to record where this person studied.
          </p>
        ) : (
          <div className="space-y-4">
            {value.map((education) => {
              // A college that has since been deleted — keep the entry editable so it
              // can be repointed or removed rather than silently referencing nothing.
              const isOrphaned =
                education.collegeId !== "" &&
                !allColleges.some((c) => c.id === education.collegeId)

              return (
                <div key={education.id} className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-foreground mb-2">College</label>
                      <select
                        value={education.collegeId}
                        onChange={(e) => update(education.id, { collegeId: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">Select college</option>
                        {isOrphaned && (
                          <option value={education.collegeId}>Unknown College (deleted)</option>
                        )}
                        {allColleges.map((college) => (
                          <option key={college.id} value={college.id}>
                            {college.name || "Untitled College"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(education.id)}
                      className="mt-8 p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove this education entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Course</label>
                      <input
                        type="text"
                        value={education.course || ""}
                        onChange={(e) => update(education.id, { course: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Level</label>
                      <select
                        value={education.level || ""}
                        onChange={(e) =>
                          update(education.id, {
                            level: (e.target.value || undefined) as EducationLevel | undefined,
                          })
                        }
                        className={inputClass}
                      >
                        <option value="">Select level</option>
                        {EDUCATION_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Start Year</label>
                      <input
                        type="number"
                        value={education.startYear || ""}
                        onChange={(e) => update(education.id, { startYear: e.target.value })}
                        className={inputClass}
                        placeholder="2015"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">End Year</label>
                      <input
                        type="number"
                        value={education.endYear || ""}
                        onChange={(e) => update(education.id, { endYear: e.target.value })}
                        className={inputClass}
                        placeholder="2019"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={education.completed || false}
                      onChange={(e) => update(education.id, { completed: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-foreground">Completed</span>
                  </label>
                </div>
              )
            })}

            <button
              type="button"
              onClick={add}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
            >
              + Add Education
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
