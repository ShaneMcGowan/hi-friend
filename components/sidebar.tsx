"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Network, Bell, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/people", label: "People", icon: Users },
  { href: "/network", label: "Network", icon: Network },
  { href: "/reminders", label: "Reminders", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-border/40 flex flex-col items-center py-6 gap-2 z-50">
      <div className="mb-4">
        <span className="text-2xl font-bold text-primary">Hi</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
