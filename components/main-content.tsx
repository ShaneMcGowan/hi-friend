"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

export function MainContent({ children }: { children: ReactNode }) {
  const { isExpanded } = useSidebar()

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isExpanded ? "pl-64" : "pl-16"
      )}
    >
      {children}
    </div>
  )
}
