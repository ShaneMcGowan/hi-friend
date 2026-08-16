"use client"

import type React from "react"

import { useState } from "react"
import { COLLEGE_TYPES, type College } from "@/lib/types"

interface CollegeFormProps {
  college?: College | null
  onSave: (college: College) => void
  onCancel: () => void
  formId?: string
}

export function CollegeForm({
  college,
  onSave,
  onCancel,
  formId = "college-form",
}: CollegeFormProps) {
  const [formData, setFormData] = useState<College>(
    college
      ? {
          ...college,
          emails: college.emails || [],
          phones: college.phones || [],
        }
      : {
          id: Math.random().toString(36).substring(7),
          name: "",
          type: undefined,
          description: "",
          website: "",
          address: "",
          emails: [],
          phones: [],
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
  )

  const [emailLabel, setEmailLabel] = useState("")
  const [emailValue, setEmailValue] = useState("")
  const [phoneLabel, setPhoneLabel] = useState("")
  const [phoneValue, setPhoneValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="bg-white rounded-xl border border-border/40 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">{college ? "Edit College" : "New College"}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="e.g., The school of life"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Type</label>
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">Select type</option>
            {COLLEGE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="https://example.edu"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="Street, city, country"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="What is this place? e.g., Where I did my undergrad"
          />
        </div>

        {/* Emails */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Email Addresses</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={emailLabel}
              onChange={(e) => setEmailLabel(e.target.value)}
              placeholder="Label (e.g., Admissions, Alumni)"
              className="w-1/3 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
              placeholder="email@example.edu"
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
              placeholder="Label (e.g., Reception, Admissions)"
              className="w-1/3 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <input
              type="tel"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
              placeholder="+353 1 234 5678"
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
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          placeholder="Campuses, departments, who you know there..."
        />
      </div>

    </form>
  )
}
