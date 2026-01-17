"use client"

import { useState, useEffect, useCallback } from "react"
import type { Contact, Relationship } from "@/lib/types"

export function useContactsData() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedContacts = localStorage.getItem("crm-contacts")
    const savedRelationships = localStorage.getItem("crm-relationships")

    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (e) {
        console.error("Failed to load contacts:", e)
      }
    }

    if (savedRelationships) {
      try {
        setRelationships(JSON.parse(savedRelationships))
      } catch (e) {
        console.error("Failed to load relationships:", e)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("crm-contacts", JSON.stringify(contacts))
      localStorage.setItem("crm-relationships", JSON.stringify(relationships))
    }
  }, [contacts, relationships, isLoaded])

  const addContact = useCallback((contact: Contact, existingContact?: Contact | null) => {
    if (existingContact) {
      setContacts(prev => prev.map((c) => (c.id === existingContact.id ? contact : c)))
    } else {
      setContacts(prev => [...prev, contact])
    }
  }, [])

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter((c) => c.id !== id))
    setRelationships(prev => prev.filter((r) => r.contactId1 !== id && r.contactId2 !== id))
  }, [])

  const addRelationship = useCallback((relationship: Relationship) => {
    setRelationships(prev => [...prev, relationship])
  }, [])

  const removeRelationship = useCallback((relationshipId: string) => {
    setRelationships(prev => prev.filter((r) => r.id !== relationshipId))
  }, [])

  const importData = useCallback((importedContacts: Contact[], importedRelationships?: Relationship[]) => {
    setContacts(importedContacts)
    if (importedRelationships) {
      setRelationships(importedRelationships)
    }
  }, [])

  const addContacts = useCallback((newContacts: Contact[]) => {
    setContacts(prev => [...prev, ...newContacts])
  }, [])

  return {
    contacts,
    relationships,
    isLoaded,
    addContact,
    deleteContact,
    addRelationship,
    removeRelationship,
    importData,
    addContacts,
  }
}
