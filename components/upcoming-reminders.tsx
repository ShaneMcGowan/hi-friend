"use client"

import { useMemo } from "react"
import { type Contact, type Category, CATEGORIES } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"

interface UpcomingRemindersProps {
  contacts: Contact[]
}

interface Reminder {
  contact: Contact
  label: string
  date: Date
  daysUntil: number
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) return "st"
  if (j === 2 && k !== 12) return "nd"
  if (j === 3 && k !== 13) return "rd"
  return "th"
}

export function UpcomingReminders({ contacts }: UpcomingRemindersProps) {
  const remindersByCategory = useMemo(() => {
    const today = new Date()
    const oneYearFromNow = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000)

    const reminders: Reminder[] = []

    contacts.forEach((contact) => {
      // Check birthday
      if (contact.birthday) {
        const [year, month, day] = contact.birthday.split("-")
        const birthYear = Number.parseInt(year)
        const nextBirthday = new Date(today.getFullYear(), Number.parseInt(month) - 1, Number.parseInt(day))
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1)
        }

        const daysUntil = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntil >= 0 && daysUntil <= 365) {
          // Calculate which birthday this is
          const age = nextBirthday.getFullYear() - birthYear
          const ordinalSuffix = getOrdinalSuffix(age)
          reminders.push({
            contact,
            label: `${age}${ordinalSuffix} Birthday`,
            date: nextBirthday,
            daysUntil,
          })
        }
      }

      // Check important dates
      if (contact.importantDates) {
        contact.importantDates.forEach((importantDate) => {
          const [year, month, day] = importantDate.date.split("-")
          const originalYear = Number.parseInt(year)
          const nextDate = new Date(today.getFullYear(), Number.parseInt(month) - 1, Number.parseInt(day))
          if (nextDate < today) {
            nextDate.setFullYear(today.getFullYear() + 1)
          }

          const daysUntil = Math.floor((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          if (daysUntil >= 0 && daysUntil <= 365) {
            // Calculate which anniversary this is
            const years = nextDate.getFullYear() - originalYear
            const ordinalSuffix = getOrdinalSuffix(years)
            reminders.push({
              contact,
              label: `${years}${ordinalSuffix} ${importantDate.label}`,
              date: nextDate,
              daysUntil,
            })
          }
        })
      }
    })

    // Sort reminders by days until
    reminders.sort((a, b) => a.daysUntil - b.daysUntil)

    // Group reminders by contact category
    const grouped = reminders.reduce((acc, reminder) => {
      const category = reminder.contact.category || "Uncategorized"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(reminder)
      return acc
    }, {} as Record<string, Reminder[]>)

    return grouped
  }, [contacts])

  // Ensure all Category columns are shown, even if empty
  const categories = CATEGORIES.map((cat) => ({
    name: cat,
    reminders: remindersByCategory[cat] || [],
  }))
  const totalReminders = categories.reduce((sum, cat) => sum + cat.reminders.length, 0)

  return (
    <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Upcoming Reminders</h2>

      {totalReminders === 0 ? (
        <p className="text-center text-muted-foreground py-8">No reminders for the next year</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground border-b border-border/40 pb-2">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.reminders.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No reminders</p>
                ) : (
                  category.reminders.map((reminder, idx) => (
                  <div
                    key={`${reminder.contact.id}-${reminder.label}-${idx}`}
                    className="flex flex-col p-4 bg-gradient-to-r from-accent/50 to-transparent rounded-lg border border-accent/20"
                  >
                    <div className="mb-2">
                      <p className="font-semibold text-foreground">{getDisplayName(reminder.contact)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{reminder.label}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-sm text-muted-foreground">{reminder.date.toLocaleDateString()}</p>
                      <p className="font-bold text-primary text-sm">
                        {reminder.daysUntil === 0 ? "Today" : `${reminder.daysUntil}d`}
                      </p>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
