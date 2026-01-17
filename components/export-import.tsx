"use client"

import type React from "react"

import { useRef } from "react"
import type { Contact, Relationship } from "@/lib/types"
import { parseVCF } from "@/lib/vcf-parser"

interface ExportImportProps {
  contacts: Contact[]
  relationships?: Relationship[]
  onImport: (contacts: Contact[], relationships?: Relationship[]) => void
  onAddContacts: (contacts: Contact[]) => void
}

export function ExportImport({ contacts, relationships = [], onImport, onAddContacts }: ExportImportProps) {
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const vcfInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const exportData = {
      contacts,
      relationships,
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
  }

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)

        if (Array.isArray(imported)) {
          // Legacy format: just an array of contacts
          onImport(imported, [])
          alert("Contacts imported successfully!")
        } else if (imported.contacts && Array.isArray(imported.contacts)) {
          // New format: object with contacts and relationships
          onImport(imported.contacts, imported.relationships || [])
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

  const handleVcfImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const newContacts = parseVCF(content)
        if (newContacts.length > 0) {
          onAddContacts(newContacts)
          alert(`Successfully added ${newContacts.length} contact${newContacts.length === 1 ? "" : "s"} from VCF file!`)
        } else {
          alert("No valid contacts found in the VCF file.")
        }
      } catch (error) {
        alert("Failed to parse VCF file. Please ensure it's a valid vCard file.")
      }
    }
    reader.readAsText(file)
    if (vcfInputRef.current) {
      vcfInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
        >
          Export
        </button>
        <button
          onClick={() => jsonInputRef.current?.click()}
          className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
        >
          Import
        </button>
        <input ref={jsonInputRef} type="file" accept=".json" onChange={handleJsonImport} className="hidden" />
      </div>
      <div>
        <button
          onClick={() => vcfInputRef.current?.click()}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          Import VCF Contacts
        </button>
        <input ref={vcfInputRef} type="file" accept=".vcf" onChange={handleVcfImport} className="hidden" />
      </div>
    </div>
  )
}
