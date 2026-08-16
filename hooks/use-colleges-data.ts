"use client"

import { useState, useEffect, useCallback } from "react"
import type { College } from "@/lib/types"

export function useCollegesData() {
  const [colleges, setColleges] = useState<College[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedColleges = localStorage.getItem("crm-colleges")

    if (savedColleges) {
      try {
        const parsed = JSON.parse(savedColleges)
        setColleges(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        console.error("Failed to load colleges:", e)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("crm-colleges", JSON.stringify(colleges))
    }
  }, [colleges, isLoaded])

  const addCollege = useCallback((college: College, existingCollege?: College | null) => {
    if (existingCollege) {
      setColleges(prev => prev.map((c) => (c.id === existingCollege.id ? college : c)))
    } else {
      setColleges(prev => [...prev, college])
    }
  }, [])

  const deleteCollege = useCallback((id: string) => {
    setColleges(prev => prev.filter((c) => c.id !== id))
  }, [])

  const importColleges = useCallback((importedColleges: College[]) => {
    setColleges(importedColleges)
  }, [])

  return {
    colleges,
    isLoaded,
    addCollege,
    deleteCollege,
    importColleges,
  }
}
