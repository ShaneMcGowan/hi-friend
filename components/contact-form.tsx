"use client"

import type React from "react"

import { useState } from "react"
import type { Contact, Relationship } from "@/lib/types"
import { getDisplayName } from "@/lib/utils"

interface ContactFormProps {
  contact?: Contact | null
  onSave: (contact: Contact) => void
  onCancel: () => void
  allContacts?: Contact[]
  relationships?: Relationship[]
  onRelationshipAdd?: (relationship: Relationship) => void
  onRelationshipRemove?: (relationshipId: string) => void
  formId?: string
}

export function ContactForm({
  contact,
  onSave,
  onCancel,
  allContacts = [],
  relationships = [],
  onRelationshipAdd,
  onRelationshipRemove,
  formId = "contact-form",
}: ContactFormProps) {
  const [formData, setFormData] = useState<Contact>(
    contact
      ? {
          ...contact,
          emails: contact.emails || [],
          phones: contact.phones || [],
          parentIds: contact.parentIds || [],
          interests: contact.interests || [],
          importantDates: contact.importantDates || [],
        }
      : {
          id: Math.random().toString(36).substring(7),
          familyName: "",
          givenName: "",
          additionalNames: "",
          honorificPrefixes: "",
          honorificSuffixes: "",
          maidenName: "",
          category: undefined,
          emails: [],
          phones: [],
          address: "",
          birthday: "",
          isDeceased: false,
          deathDate: "",
          parentIds: [],
          interests: [],
          importantDates: [],
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
  )

  const [interestInput, setInterestInput] = useState("")
  const [dateLabel, setDateLabel] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [relationshipContactId, setRelationshipContactId] = useState("")
  const [relationshipType1To2, setRelationshipType1To2] = useState("")
  const [showMoreNameFields, setShowMoreNameFields] = useState(false)
  const [emailLabel, setEmailLabel] = useState("")
  const [emailValue, setEmailValue] = useState("")
  const [phoneLabel, setPhoneLabel] = useState("")
  const [phoneValue, setPhoneValue] = useState("")

  // Helper function to infer opposite relationship
  const getOppositeRelationship = (relationshipType: string): string => {
    const opposites: Record<string, string> = {
      Parent: "Child",
      Child: "Parent",
      Sibling: "Sibling",
      Spouse: "Spouse",
      Partner: "Partner",
      Friend: "Friend",
      Colleague: "Colleague",
      Other: "Other",
    }
    return opposites[relationshipType] || "Other"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }))
  }

  const addInterest = () => {
    if (interestInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), interestInput.trim()],
      }))
      setInterestInput("")
    }
  }

  const removeInterest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests?.filter((_, i) => i !== index) || [],
    }))
  }

  const addImportantDate = () => {
    if (dateLabel.trim() && dateValue) {
      setFormData((prev) => ({
        ...prev,
        importantDates: [...(prev.importantDates || []), { label: dateLabel.trim(), date: dateValue }],
      }))
      setDateLabel("")
      setDateValue("")
    }
  }

  const removeImportantDate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      importantDates: prev.importantDates?.filter((_, i) => i !== index) || [],
    }))
  }

  const addEmail = () => {
    if (emailValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        emails: [...(prev.emails || []), { label: emailLabel.trim() || "Email", value: emailValue.trim() }],
      }))
      setEmailLabel("")
      setEmailValue("")
    }
  }

  const removeEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails?.filter((_, i) => i !== index) || [],
    }))
  }

  const addPhone = () => {
    if (phoneValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        phones: [...(prev.phones || []), { label: phoneLabel.trim() || "Phone", value: phoneValue.trim() }],
      }))
      setPhoneLabel("")
      setPhoneValue("")
    }
  }

  const removePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones?.filter((_, i) => i !== index) || [],
    }))
  }

  const addRelationship = () => {
    if (relationshipContactId && relationshipType1To2 && contact?.id) {
      const relationshipType2To1 = getOppositeRelationship(relationshipType1To2)
      const newRelationship: Relationship = {
        id: Math.random().toString(36).substring(7),
        contactId1: contact.id,
        contactId2: relationshipContactId,
        type1To2: relationshipType1To2,
        type2To1: relationshipType2To1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onRelationshipAdd?.(newRelationship)
      setRelationshipContactId("")
      setRelationshipType1To2("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const getContactNameById = (id: string) => {
    const c = allContacts.find((c) => c.id === id)
    return c ? getDisplayName(c) : "Unknown"
  }

  const contactRelationships = relationships.filter(
    (r) => (r.contactId1 === contact?.id || r.contactId2 === contact?.id) && r.id,
  )

  const availableContacts = allContacts.filter(
    (c) => c.id !== contact?.id && !contactRelationships.some((r) => r.contactId1 === c.id || r.contactId2 === c.id),
  )

  return (
    <form id={formId} onSubmit={handleSubmit} className="bg-white rounded-xl border border-border/40 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">{contact ? "Edit Contact" : "New Contact"}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Name Fields */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Given Name</label>
          <input
            type="text"
            name="givenName"
            value={formData.givenName || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Family Name</label>
          <input
            type="text"
            name="familyName"
            value={formData.familyName || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="Last name / Surname"
          />
        </div>

        {/* Collapsible Additional Name Fields */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => setShowMoreNameFields(!showMoreNameFields)}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
          >
            <span className="text-xs">{showMoreNameFields ? "▼" : "▶"}</span>
            {showMoreNameFields ? "Hide" : "Show"} additional name fields (prefix, middle, suffix, maiden)
          </button>
          {showMoreNameFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-border/50">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Prefix</label>
                <input
                  type="text"
                  name="honorificPrefixes"
                  value={formData.honorificPrefixes || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Mr., Mrs., Dr."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Middle Names</label>
                <input
                  type="text"
                  name="additionalNames"
                  value={formData.additionalNames || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Middle name(s)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Maiden Name</label>
                <input
                  type="text"
                  name="maidenName"
                  value={formData.maidenName || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Birth surname"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Suffix</label>
                <input
                  type="text"
                  name="honorificSuffixes"
                  value={formData.honorificSuffixes || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Jr., III, PhD"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">Select category</option>
            <option value="Family">Family</option>
            <option value="Close Friends">Close Friends</option>
            <option value="Friends">Friends</option>
            <option value="Colleagues">Colleagues</option>
            <option value="Acquaintances">Acquaintances</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Emails */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Email Addresses</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={emailLabel}
              onChange={(e) => setEmailLabel(e.target.value)}
              placeholder="Label (e.g., Work, Personal)"
              className="w-1/3 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
              placeholder="email@example.com"
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <button
              type="button"
              onClick={addEmail}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.emails?.map((email, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                <span className="text-foreground">
                  <span className="font-semibold">{email.label}:</span> {email.value}
                </span>
                <button
                  type="button"
                  onClick={() => removeEmail(idx)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Phones */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Phone Numbers</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={phoneLabel}
              onChange={(e) => setPhoneLabel(e.target.value)}
              placeholder="Label (e.g., Mobile, Work)"
              className="w-1/3 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <input
              type="tel"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
              placeholder="+1 (555) 000-0000"
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <button
              type="button"
              onClick={addPhone}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.phones?.map((phone, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                <span className="text-foreground">
                  <span className="font-semibold">{phone.label}:</span> {phone.value}
                </span>
                <button
                  type="button"
                  onClick={() => removePhone(idx)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="Street address"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Deceased</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDeceased || false}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    isDeceased: e.target.checked,
                    deathDate: e.target.checked ? prev.deathDate : "",
                    updatedAt: new Date().toISOString(),
                  }))
                }}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Deceased</span>
            </label>
          </div>
          {formData.isDeceased && (
            <div className="mt-2">
              <input
                type="date"
                name="deathDate"
                value={formData.deathDate || ""}
                onChange={handleInputChange}
                placeholder="Date of death (optional)"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Date is optional</p>
            </div>
          )}
        </div>
      </div>

      {/* Parents */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Parents</label>
        <p className="text-xs text-muted-foreground mb-2">Select up to 2 parents from your contacts</p>
        {(formData.parentIds?.length || 0) < 2 && (
          <div className="mb-2">
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setFormData((prev) => ({
                    ...prev,
                    parentIds: [...(prev.parentIds || []), e.target.value],
                    updatedAt: new Date().toISOString(),
                  }))
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="">Select a parent</option>
              {allContacts
                .filter((c) => c.id !== formData.id && !formData.parentIds?.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {getDisplayName(c)}
                  </option>
                ))}
            </select>
          </div>
        )}
        <div className="space-y-2">
          {formData.parentIds?.map((parentId) => {
            const parent = allContacts.find((c) => c.id === parentId)
            return (
              <div key={parentId} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                <span className="text-foreground">{parent ? getDisplayName(parent) : "Unknown Contact"}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      parentIds: prev.parentIds?.filter((id) => id !== parentId) || [],
                      updatedAt: new Date().toISOString(),
                    }))
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Interests & Preferences</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="Add interest (e.g., Photography, Hiking)"
          />
          <button
            type="button"
            onClick={addInterest}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.interests?.map((interest, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-accent text-accent-foreground rounded-full">
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => removeInterest(idx)}
                className="text-accent-foreground hover:opacity-70"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Important Dates */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Important Dates</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="Label (e.g., Anniversary)"
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
          <button
            type="button"
            onClick={addImportantDate}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.importantDates?.map((date, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
              <span className="text-foreground">
                {date.label} - {new Date(date.date).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => removeImportantDate(idx)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Relationships - only show if contact is already created */}
      {contact && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Link to Other Contacts</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={relationshipContactId}
                onChange={(e) => setRelationshipContactId(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="">Select a contact</option>
                {availableContacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getDisplayName(c)}
                  </option>
                ))}
              </select>
            </div>
            {relationshipContactId && contact && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  <span className="font-semibold text-foreground">{getDisplayName(contact)}</span> is the{" "}
                  <span className="font-semibold text-foreground">
                    {relationshipType1To2 || "[relationship]"}
                  </span>{" "}
                  of <span className="font-semibold text-foreground">{getContactNameById(relationshipContactId)}</span>
                </label>
                <select
                  value={relationshipType1To2}
                  onChange={(e) => setRelationshipType1To2(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Partner">Partner</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
                {relationshipType1To2 && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {getContactNameById(relationshipContactId)} is your {getOppositeRelationship(relationshipType1To2).toLowerCase()}
                  </p>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={addRelationship}
              disabled={!relationshipContactId || !relationshipType1To2}
              className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Link
            </button>
          </div>

          {/* Display current relationships */}
          {contactRelationships.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Current Links</p>
              {contactRelationships.map((rel) => {
                const otherContactId = rel.contactId1 === contact.id ? rel.contactId2 : rel.contactId1
                const relationshipText = rel.contactId1 === contact.id ? rel.type1To2 : rel.type2To1
                return (
                  <div key={rel.id} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg">
                    <span className="text-foreground text-sm">
                      <span className="font-semibold">{getContactNameById(otherContactId)}</span> ({relationshipText})
                    </span>
                    <button
                      type="button"
                      onClick={() => onRelationshipRemove?.(rel.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Notes & History</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          placeholder="Add notes about your relationship, memories, or things to remember..."
        />
      </div>

    </form>
  )
}
