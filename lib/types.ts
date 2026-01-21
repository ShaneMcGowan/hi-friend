export interface Contact {
  id: string
  name: string
  category?: Category
  categories?: string[]
  email?: string
  phone?: string
  address?: string
  birthday?: string
  parentIds?: string[] // IDs of parent contacts (max 2)
  interests?: string[]
  importantDates?: {
    label: string
    date: string
  }[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Relationship {
  id: string
  contactId1: string
  contactId2: string
  type1To2: string // e.g., "Parent", "Child", "Friend", "Spouse"
  type2To1: string // reverse relationship type
  createdAt: string
  updatedAt: string
}

export type Category = "Family" | "Close Friends" | "Friends" | "Colleagues" | "Acquaintances";
export const CATEGORIES: Category[] = ["Family", "Close Friends", "Friends", "Colleagues", "Acquaintances"]; // ordered list of categories
