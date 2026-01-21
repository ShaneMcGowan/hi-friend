"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useCallback, type ChangeEvent } from "react"
import { Users, Network, Bell, LayoutDashboard, PanelLeftClose, PanelLeft, Download, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { useContactsData } from "@/hooks/use-contacts-data"
import type { Contact, Relationship } from "@/lib/types"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/people", label: "People", icon: Users },
  { href: "/network", label: "Network", icon: Network },
  { href: "/reminders", label: "Reminders", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isExpanded, toggle } = useSidebar()
  const { contacts, relationships, importData } = useContactsData()
  const jsonInputRef = useRef<HTMLInputElement>(null)

  const handleExport = useCallback(() => {
    // Always read fresh data from localStorage to ensure we get the latest values
    // This prevents stale data issues when the component hasn't re-rendered
    const savedContacts = localStorage.getItem("crm-contacts")
    const savedRelationships = localStorage.getItem("crm-relationships")
    
    let currentContacts: Contact[] = []
    let currentRelationships: Relationship[] = []
    
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts)
        currentContacts = Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error("Failed to parse contacts for export:", e)
        // Fallback to hook state if localStorage parse fails
        currentContacts = contacts
      }
    } else {
      // Fallback to hook state if localStorage is empty
      currentContacts = contacts
    }
    
    if (savedRelationships) {
      try {
        currentRelationships = JSON.parse(savedRelationships)
      } catch (e) {
        console.error("Failed to parse relationships for export:", e)
        // Fallback to hook state if localStorage parse fails
        currentRelationships = relationships
      }
    } else {
      // Fallback to hook state if localStorage is empty
      currentRelationships = relationships
    }
    
    const exportData = {
      contacts: currentContacts,
      relationships: currentRelationships,
      exportedAt: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relationships-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [contacts, relationships])

  const handleJsonImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)

        if (Array.isArray(imported)) {
          // Legacy format: just an array of contacts
          importData(imported, [])
          alert("Contacts imported successfully!")
        } else if (imported.contacts && Array.isArray(imported.contacts)) {
          // New format: object with contacts and relationships
          importData(imported.contacts, imported.relationships || [])
          alert("Contacts and relationships imported successfully!")
        } else {
          alert("Invalid file format. Please export from this app.")
        }
      } catch (error) {
        alert("Failed to import file. Please ensure it's a valid JSON file.")
      }
    }
    reader.readAsText(file)
    if (jsonInputRef.current) {
      jsonInputRef.current.value = ""
    }
  }

  const actionItems = [
    { 
      label: "Export", 
      icon: Download, 
      onClick: handleExport 
    },
    { 
      label: "Import", 
      icon: Upload, 
      onClick: () => jsonInputRef.current?.click() 
    },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-border/40 flex flex-col z-50 transition-all duration-300",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col py-6 h-full">
        <div className={cn(
          "flex items-center mb-4",
          isExpanded ? "px-4 justify-between" : "justify-center"
        )}>
          {isExpanded && (
            <h1 
              className="text-2xl font-bold text-primary whitespace-nowrap"
              title="Your personal CRM for friends & family"
            >
              Hi, Friend
            </h1>
          )}
          <button
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <nav className="flex flex-col gap-2 px-2 flex-1">
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
          
          <div className="mt-auto pt-4 border-t border-border/40">
            {actionItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center rounded-lg transition-colors w-full",
                    isExpanded ? "px-3 py-2 gap-3" : "justify-center w-12 h-12 mx-auto",
                    "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>
        
        <input 
          ref={jsonInputRef} 
          type="file" 
          accept=".json" 
          onChange={handleJsonImport} 
          className="hidden" 
        />
      </div>
    </aside>
  )
}
