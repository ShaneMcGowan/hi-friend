"use client"

import { useMemo } from "react"
import type { Contact } from "@/lib/types"

interface UpcomingRemindersProps {
  contacts: Contact[]
}

export function UpcomingReminders({ contacts }: UpcomingRemindersProps) {
  const upcomingReminders = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    const reminders: Array<{
      contact: Contact
      label: string
      date: Date
      daysUntil: number
    }> = []

    contacts.forEach((contact) => {
      // Check birthday
      if (contact.birthday) {
        const [, month, day] = contact.birthday.split("-")
        const nextBirthday = new Date(today.getFullYear(), Number.parseInt(month) - 1, Number.parseInt(day))
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1)
        }

        const daysUntil = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntil >= 0 && daysUntil <= 30) {
          reminders.push({
            contact,
            label: "Birthday",
            date: nextBirthday,
            daysUntil,
          })
        }
      }

      // Check important dates
      if (contact.importantDates) {
        contact.importantDates.forEach((importantDate) => {
          const [year, month, day] = importantDate.date.split("-")
          const nextDate = new Date(today.getFullYear(), Number.parseInt(month) - 1, Number.parseInt(day))
          if (nextDate < today) {
            nextDate.setFullYear(today.getFullYear() + 1)
          }

          const daysUntil = Math.floor((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          if (daysUntil >= 0 && daysUntil <= 30) {
            reminders.push({
              contact,
              label: importantDate.label,
              date: nextDate,
              daysUntil,
            })
          }
        })
      }
    })

    return reminders.sort((a, b) => a.daysUntil - b.daysUntil)
  }, [contacts])

  return (
    <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Upcoming Reminders</h2>

      {upcomingReminders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No reminders for the next 30 days</p>
      ) : (
        <div className="space-y-3">
          {upcomingReminders.map((reminder, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/50 to-transparent rounded-lg border border-accent/20"
            >
              <div>
                <p className="font-semibold text-foreground">{reminder.contact.name}</p>
                <p className="text-sm text-muted-foreground">{reminder.label}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-lg">
                  {reminder.daysUntil === 0 ? "Today" : `In ${reminder.daysUntil} days`}
                </p>
                <p className="text-xs text-muted-foreground">{reminder.date.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
