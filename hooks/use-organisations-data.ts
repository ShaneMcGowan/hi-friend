"use client"

import { useState, useEffect, useCallback } from "react"
import type { Organisation } from "@/lib/types"

export function useOrganisationsData() {
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedOrganisations = localStorage.getItem("crm-organisations")

    if (savedOrganisations) {
      try {
        const parsed = JSON.parse(savedOrganisations)
        setOrganisations(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        console.error("Failed to load organisations:", e)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("crm-organisations", JSON.stringify(organisations))
    }
  }, [organisations, isLoaded])

  const addOrganisation = useCallback((organisation: Organisation, existingOrganisation?: Organisation | null) => {
    if (existingOrganisation) {
      setOrganisations(prev => prev.map((o) => (o.id === existingOrganisation.id ? organisation : o)))
    } else {
      setOrganisations(prev => [...prev, organisation])
    }
  }, [])

  const deleteOrganisation = useCallback((id: string) => {
    setOrganisations(prev => prev.filter((o) => o.id !== id))
  }, [])

  const importOrganisations = useCallback((importedOrganisations: Organisation[]) => {
    setOrganisations(importedOrganisations)
  }, [])

  return {
    organisations,
    isLoaded,
    addOrganisation,
    deleteOrganisation,
    importOrganisations,
  }
}
