export interface Contact {
  id: string
  // vCard v4 "N" field components (structured name)
  familyName?: string // Surname / Last name
  givenName?: string // First name
  additionalNames?: string // Middle names
  honorificPrefixes?: string // e.g., "Mr.", "Mrs.", "Dr."
  honorificSuffixes?: string // e.g., "Jr.", "III", "PhD"
  maidenName?: string // Birth surname before marriage
  category?: Category
  categories?: string[]
  emails?: {
    label: string
    value: string
  }[]
  phones?: {
    label: string
    value: string
  }[]
  address?: string
  birthday?: string
  isDeceased?: boolean
  deathDate?: string
  parentIds?: string[] // IDs of parent contacts (max 2)
  organisationIds?: string[] // IDs of organisations this contact belongs to
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

export type Category = "Family" | "Close Friends" | "Friends" | "Colleagues" | "Acquaintances" | "Other";
export const CATEGORIES: Category[] = ["Family", "Close Friends", "Friends", "Colleagues", "Acquaintances", "Other"]; // ordered list of categories

export type OrganisationType = "Club" | "Community" | "School" | "Sports Team" | "Venue" | "Other";
export const ORGANISATION_TYPES: OrganisationType[] = ["Club", "Community", "School", "Sports Team", "Venue", "Other"]; // ordered list of types

export interface Organisation {
  id: string
  name: string
  type?: OrganisationType
  description?: string
  website?: string
  address?: string
  emails?: {
    label: string
    value: string
  }[]
  phones?: {
    label: string
    value: string
  }[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export type CollegeType = "University" | "College" | "Institute of Technology" | "Secondary School" | "Primary School" | "Other";
export const COLLEGE_TYPES: CollegeType[] = ["University", "College", "Institute of Technology", "Secondary School", "Primary School", "Other"]; // ordered list of types

export interface College {
  id: string
  name: string
  type?: CollegeType
  description?: string
  website?: string
  address?: string
  emails?: {
    label: string
    value: string
  }[]
  phones?: {
    label: string
    value: string
  }[]
  notes?: string
  createdAt: string
  updatedAt: string
}