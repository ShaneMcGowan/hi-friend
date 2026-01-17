"use client"

import type React from "react"
import { useRef } from "react"
import type { Contact } from "@/lib/types"
import { parseVCF } from "@/lib/vcf-parser"

interface VcfImportProps {
  onAddContacts: (contacts: Contact[]) => void
}

export function VcfImport({ onAddContacts }: VcfImportProps) {
  const vcfInputRef = useRef<HTMLInputElement>(null)

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
    <>
      <button
        onClick={() => vcfInputRef.current?.click()}
        className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
      >
        Import VCF
      </button>
      <input ref={vcfInputRef} type="file" accept=".vcf" onChange={handleVcfImport} className="hidden" />
    </>
  )
}
