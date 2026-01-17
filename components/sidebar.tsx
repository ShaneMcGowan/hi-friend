"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Network, Bell, LayoutDashboard, PanelLeftClose, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/people", label: "People", icon: Users },
  { href: "/network", label: "Network", icon: Network },
  { href: "/reminders", label: "Reminders", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isExpanded, toggle } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-border/40 flex flex-col py-6 z-50 transition-all duration-300",
        isExpanded ? "w-48" : "w-16"
      )}
    >
      <button
        onClick={toggle}
        className="flex items-center justify-center w-10 h-10 mx-auto mb-4 rounded-lg text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelLeft className="w-5 h-5" />
        )}
      </button>
      <nav className="flex flex-col gap-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-colors",
                isExpanded ? "px-3 py-2 gap-3" : "justify-center w-12 h-12 mx-auto",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
