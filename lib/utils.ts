import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Contact } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate display name from Contact's structured name fields.
 * Format: [Prefix] Given [Middle] Family (Maiden) [Suffix]
 * Falls back to "Unknown" if no name fields are set.
 */
export function getDisplayName(contact: Contact): string {
  const parts: string[] = []

  if (contact.honorificPrefixes?.trim()) {
    parts.push(contact.honorificPrefixes.trim())
  }
  if (contact.givenName?.trim()) {
    parts.push(contact.givenName.trim())
  }
  if (contact.additionalNames?.trim()) {
    parts.push(contact.additionalNames.trim())
  }
  if (contact.familyName?.trim()) {
    parts.push(contact.familyName.trim())
  }

  let name = parts.join(' ')

  if (contact.maidenName?.trim()) {
    name += ` (${contact.maidenName.trim()})`
  }
  if (contact.honorificSuffixes?.trim()) {
    name += `, ${contact.honorificSuffixes.trim()}`
  }

  return name || 'Unknown'
}
