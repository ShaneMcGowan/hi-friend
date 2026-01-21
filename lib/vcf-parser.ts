import type { Contact } from "./types"

interface VCardData {
  fn?: string
  n?: { family?: string; given?: string; middle?: string; prefix?: string; suffix?: string }
  email?: Array<{ value: string; label?: string }>
  tel?: Array<{ value: string; label?: string }>
  adr?: string
  bday?: string
  note?: string
  categories?: string[]
}

/**
 * Parse a VCF (vCard) file content and return an array of Contact objects
 */
export function parseVCF(vcfContent: string): Contact[] {
  const contacts: Contact[] = []
  const vcards = splitVCards(vcfContent)

  for (const vcard of vcards) {
    const parsed = parseVCard(vcard)
    if (parsed) {
      const contact = vcardToContact(parsed)
      if (contact) {
        contacts.push(contact)
      }
    }
  }

  return contacts
}

/**
 * Split VCF content into individual vCard blocks
 */
function splitVCards(content: string): string[] {
  const vcards: string[] = []
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  // Handle folded lines (lines starting with space/tab are continuations)
  const unfolded = normalized.replace(/\n[ \t]/g, "")

  const matches = unfolded.match(/BEGIN:VCARD[\s\S]*?END:VCARD/gi)
  if (matches) {
    vcards.push(...matches)
  }

  return vcards
}

/**
 * Parse a single vCard block into structured data
 */
function parseVCard(vcard: string): VCardData | null {
  const lines = vcard.split("\n").filter((line) => line.trim())
  const data: VCardData = {}

  for (const line of lines) {
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) continue

    const keyPart = line.substring(0, colonIndex)
    const value = line.substring(colonIndex + 1).trim()

    // Extract the property name (before any parameters like ;TYPE=)
    const propName = keyPart.split(";")[0].toUpperCase()

    switch (propName) {
      case "FN":
        data.fn = decodeVCardValue(value)
        break

      case "N": {
        // N:LastName;FirstName;MiddleName;Prefix;Suffix
        const parts = value.split(";").map(decodeVCardValue)
        data.n = {
          family: parts[0] || undefined,
          given: parts[1] || undefined,
          middle: parts[2] || undefined,
          prefix: parts[3] || undefined,
          suffix: parts[4] || undefined,
        }
        break
      }

      case "EMAIL": {
        if (!data.email) data.email = []
        // Extract TYPE parameter for label (e.g., EMAIL;TYPE=WORK:email@example.com)
        const params = keyPart.split(";").slice(1)
        let label: string | undefined
        for (const param of params) {
          if (param.toUpperCase().startsWith("TYPE=")) {
            const typeValue = param.split("=")[1]?.toUpperCase()
            // Map common types to readable labels
            const typeMap: Record<string, string> = {
              WORK: "Work",
              HOME: "Home",
              CELL: "Mobile",
              MOBILE: "Mobile",
              OTHER: "Other",
            }
            label = typeMap[typeValue] || typeValue.charAt(0) + typeValue.slice(1).toLowerCase()
            break
          }
        }
        data.email.push({ value: decodeVCardValue(value), label })
        break
      }

      case "TEL": {
        if (!data.tel) data.tel = []
        // Extract TYPE parameter for label (e.g., TEL;TYPE=CELL:+1234567890)
        const params = keyPart.split(";").slice(1)
        let label: string | undefined
        for (const param of params) {
          if (param.toUpperCase().startsWith("TYPE=")) {
            const typeValue = param.split("=")[1]?.toUpperCase()
            // Map common types to readable labels
            const typeMap: Record<string, string> = {
              WORK: "Work",
              HOME: "Home",
              CELL: "Mobile",
              MOBILE: "Mobile",
              FAX: "Fax",
              OTHER: "Other",
            }
            label = typeMap[typeValue] || typeValue.charAt(0) + typeValue.slice(1).toLowerCase()
            break
          }
        }
        data.tel.push({ value: decodeVCardValue(value), label })
        break
      }

      case "ADR": {
        // ADR:;;Street;City;State;PostalCode;Country
        const parts = value.split(";").map(decodeVCardValue)
        const addressParts = [
          parts[2], // Street
          parts[3], // City
          parts[4], // State
          parts[5], // Postal
          parts[6], // Country
        ].filter(Boolean)
        if (addressParts.length > 0) {
          data.adr = addressParts.join(", ")
        }
        break
      }

      case "BDAY": {
        // BDAY can be in various formats: YYYY-MM-DD, YYYYMMDD, --MM-DD
        const cleaned = value.replace(/[^0-9-]/g, "")
        if (cleaned.includes("-")) {
          // Already in ISO-like format
          data.bday = cleaned
        } else if (cleaned.length === 8) {
          // YYYYMMDD format
          data.bday = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
        }
        break
      }

      case "NOTE":
        data.note = decodeVCardValue(value)
        break

      case "CATEGORIES":
        data.categories = value.split(",").map(decodeVCardValue)
        break
    }
  }

  return data.fn || data.n ? data : null
}

/**
 * Decode vCard escaped values and quoted-printable encoding
 */
function decodeVCardValue(value: string): string {
  // Handle escaped characters
  let decoded = value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")

  // Handle quoted-printable soft line breaks and encoding
  if (decoded.includes("=")) {
    decoded = decoded.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  }

  return decoded.trim()
}

/**
 * Convert parsed vCard data to a Contact object
 */
function vcardToContact(data: VCardData): Contact | null {
  // Need at least FN or N field to create a contact
  if (!data.fn && !data.n) return null

  const now = new Date().toISOString()

  // Convert email array to labeled emails
  const emails = data.email?.map((email, idx) => ({
    label: email.label || (idx === 0 ? "Email" : `Email ${idx + 1}`),
    value: email.value,
  })) || []

  // Convert phone array to labeled phones
  const phones = data.tel?.map((tel, idx) => ({
    label: tel.label || (idx === 0 ? "Phone" : `Phone ${idx + 1}`),
    value: tel.value,
  })) || []

  return {
    id: generateId(),
    // Map vCard N field to structured name fields
    honorificPrefixes: data.n?.prefix,
    givenName: data.n?.given,
    additionalNames: data.n?.middle,
    familyName: data.n?.family,
    honorificSuffixes: data.n?.suffix,
    emails: emails.length > 0 ? emails : undefined,
    phones: phones.length > 0 ? phones : undefined,
    address: data.adr,
    birthday: data.bday,
    category: undefined,
    categories: data.categories,
    interests: data.categories?.slice(1),
    notes: data.note,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Generate a unique ID for a contact
 */
function generateId(): string {
  return Math.random().toString(36).substring(7)
}
