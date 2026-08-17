"use client"

import Link from "next/link"
import { useMemo } from "react"
import type { Contact, Education } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"

export interface EducationGanttRow {
  contact: Contact
  entry: Education
}

interface EducationGanttProps {
  rows: EducationGanttRow[]
}

// Two categories — validated as slots 1 and 2 of the reference categorical
// palette (adjacent CVD ΔE 24.7 protan, 33.6 normal, both >= 3:1 on white).
// Orange leads because it sits closest to the app's own primary hue.
const COMPLETED_FILL = "#eb6834"
const IN_PROGRESS_FILL = "#2a78d6"

const GRIDLINE = "#e1e0d9"

// Pick a tick step that lands roughly 4-8 labels across the span.
function niceStep(span: number): number {
  for (const step of [1, 2, 5, 10, 20, 25, 50, 100]) {
    if (span / step <= 8) return step
  }
  return 100
}

export function EducationGantt({ rows }: EducationGanttProps) {
  const chart = useMemo(() => {
    // One bar per person, spanning their earliest start to their latest end here —
    // someone with an undergrad and a master's reads as a single stretch of time.
    const byContact = new Map<string, { contact: Contact; entries: Education[] }>()
    for (const { contact, entry } of rows) {
      const group = byContact.get(contact.id)
      if (group) {
        group.entries.push(entry)
      } else {
        byContact.set(contact.id, { contact, entries: [entry] })
      }
    }

    const people = [...byContact.values()].map(({ contact, entries }) => {
      const dated = entries
        .map((entry) => {
          const start = Number(entry.startYear) || Number(entry.endYear)
          const end = Number(entry.endYear) || Number(entry.startYear)
          if (!Number.isFinite(start) || !Number.isFinite(end) || start === 0) return null
          // Academic years, not calendar years: term starts in the second half of
          // the start year and finishes half way through the end year.
          const from = Math.min(start, end) + 0.5
          const to = Math.max(start, end) + 0.5
          // A single-year stint would otherwise have no width — run it to year end.
          return { entry, from, to: Math.max(to, from + 0.5) }
        })
        .filter((d): d is NonNullable<typeof d> => d !== null)

      return { contact, entries, dated }
    })

    const bars = people
      .filter((p) => p.dated.length > 0)
      .map(({ contact, dated }) => {
        const ordered = dated.slice().sort((a, b) => a.from - b.from)
        return {
          contact,
          from: Math.min(...ordered.map((d) => d.from)),
          to: Math.max(...ordered.map((d) => d.to)),
          // One segment per course rather than one bar per person, so back-to-back
          // courses stay legible as separate stints and each carries its own status.
          segments: ordered.map((d) => ({
            id: d.entry.id,
            from: d.from,
            to: d.to,
            completed: Boolean(d.entry.completed),
          })),
          stints: ordered.map((d) =>
            [d.entry.course, d.entry.level, [d.entry.startYear, d.entry.endYear].filter(Boolean).join(" – ")]
              .filter(Boolean)
              .join(" · ")
          ),
        }
      })
      .sort((a, b) => a.from - b.from || getDisplayName(a.contact).localeCompare(getDisplayName(b.contact)))

    if (bars.length === 0) return null

    const domainStart = Math.min(...bars.map((b) => b.from))
    const domainEnd = Math.max(...bars.map((b) => b.to))
    const span = Math.max(domainEnd - domainStart, 1)

    const step = niceStep(span)
    const ticks: number[] = []
    for (let year = Math.ceil(domainStart / step) * step; year <= domainEnd; year += step) {
      ticks.push(year)
    }

    return { bars, domainStart, span, ticks, undatedPeople: people.length - bars.length }
  }, [rows])

  if (!chart) return null

  const { bars, domainStart, span, ticks, undatedPeople } = chart
  const pct = (year: number) => ((year - domainStart) / span) * 100

  const hasCompleted = bars.some((b) => b.segments.some((s) => s.completed))
  const hasInProgress = bars.some((b) => b.segments.some((s) => !s.completed))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Time at College
        </p>
        <div className="flex items-center gap-4">
          {hasCompleted && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COMPLETED_FILL }}
              />
              Completed
            </span>
          )}
          {hasInProgress && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: IN_PROGRESS_FILL }}
              />
              Not completed
            </span>
          )}
        </div>
      </div>

      {/* Below ~30rem the year labels collide, so the plot scrolls rather than crushes */}
      <div className="overflow-x-auto">
      <div className="min-w-[30rem]">
      <div className="space-y-1">
        {bars.map(({ contact, segments, stints }) => {
          return (
            <Link
              key={contact.id}
              href={`/people/${contact.id}`}
              title={`${getDisplayName(contact)}\n${stints.join("\n")}`}
              className="grid grid-cols-[8rem_1fr] sm:grid-cols-[11rem_1fr] items-center gap-3 py-1 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-sm text-foreground truncate pl-1" title={getDisplayName(contact)}>
                {getDisplayName(contact)}
              </span>
              <div className="relative h-6">
                {ticks.map((year) => (
                  <span
                    key={year}
                    className="absolute top-0 bottom-0 w-px"
                    style={{ left: `${pct(year)}%`, backgroundColor: GRIDLINE }}
                  />
                ))}
                {segments.map((segment) => (
                  <span
                    key={segment.id}
                    className="absolute top-1/2 -translate-y-1/2 h-3 rounded min-w-[6px]"
                    style={{
                      left: `${pct(segment.from)}%`,
                      // Shave 2px off each segment so consecutive courses read as
                      // separate stints instead of fusing into one solid bar.
                      width: `calc(${((segment.to - segment.from) / span) * 100}% - 2px)`,
                      backgroundColor: segment.completed ? COMPLETED_FILL : IN_PROGRESS_FILL,
                    }}
                  />
                ))}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Axis sits below the plot, in the same grid so ticks line up with the bars */}
      <div className="grid grid-cols-[8rem_1fr] sm:grid-cols-[11rem_1fr] gap-3">
        <span />
        <div className="relative h-5 mt-1">
          <span className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: GRIDLINE }} />
          {ticks.map((year, idx) => (
            <span
              key={year}
              className="absolute top-1 text-[11px] text-muted-foreground tabular-nums"
              style={{
                left: `${pct(year)}%`,
                transform:
                  idx === 0 && pct(year) < 5
                    ? "translateX(0)"
                    : pct(year) > 95
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
              }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
      </div>
      </div>

      {undatedPeople > 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          {undatedPeople} {undatedPeople === 1 ? "person has" : "people have"} no years recorded and
          {undatedPeople === 1 ? " is" : " are"} not shown on the timeline.
        </p>
      )}
    </div>
  )
}
