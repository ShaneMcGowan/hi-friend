"use client"

import type React from "react"

import { useEffect, useRef, useMemo } from "react"
import type { Contact, Relationship } from "@/lib/types"
import { FamilyGraph } from "@/lib/family-graph"

interface RelationshipGraphProps {
  contacts: Contact[]
  relationships: Relationship[]
  selectedContact?: Contact | null
  onContactClick?: (contact: Contact) => void
}

export function RelationshipGraph({
  contacts,
  relationships,
  selectedContact,
  onContactClick,
}: RelationshipGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Build family graph for inferred relationships
  const familyGraph = useMemo(() => new FamilyGraph(contacts), [contacts])
  const familyEdges = useMemo(() => familyGraph.getAllFamilyEdges(), [familyGraph])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || contacts.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    // Position nodes in a circle
    const positions = new Map<string, { x: number; y: number }>()
    contacts.forEach((contact, index) => {
      const angle = (index / contacts.length) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      positions.set(contact.id, { x, y })
    })

    // Track drawn edges to avoid duplicates
    const drawnEdges = new Set<string>()

    // Helper to draw an edge
    const drawEdge = (id1: string, id2: string, label: string, color: string) => {
      const edgeKey = [id1, id2].sort().join("-")
      if (drawnEdges.has(edgeKey)) return
      drawnEdges.add(edgeKey)

      const pos1 = positions.get(id1)
      const pos2 = positions.get(id2)
      if (!pos1 || !pos2) return

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(pos1.x, pos1.y)
      ctx.lineTo(pos2.x, pos2.y)
      ctx.stroke()

      // Draw relationship label midpoint
      const midX = (pos1.x + pos2.x) / 2
      const midY = (pos1.y + pos2.y) / 2
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"

      const labelWidth = ctx.measureText(label).width + 8
      const labelHeight = 16

      // Draw background for label
      ctx.strokeRect(midX - labelWidth / 2, midY - labelHeight / 2, labelWidth, labelHeight)
      ctx.fillRect(midX - labelWidth / 2, midY - labelHeight / 2, labelWidth, labelHeight)

      // Draw text
      ctx.fillStyle = "#6b7280"
      ctx.fillText(label, midX, midY + 4)
    }

    // Draw family edges (inferred from parentIds) in orange
    familyEdges.forEach((edge) => {
      drawEdge(edge.from, edge.to, edge.type, "#f97316")
    })

    // Draw explicit relationships in gray
    relationships.forEach((rel) => {
      drawEdge(rel.contactId1, rel.contactId2, rel.type1To2, "#e5e7eb")
    })

    // Draw nodes
    contacts.forEach((contact) => {
      const pos = positions.get(contact.id)
      if (!pos) return

      const isSelected = selectedContact?.id === contact.id
      const nodeRadius = isSelected ? 35 : 28

      // Draw node circle
      ctx.fillStyle = isSelected ? "#f97316" : "#ffffff"
      ctx.strokeStyle = isSelected ? "#ea580c" : "#d1d5db"
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Draw initials
      ctx.fillStyle = isSelected ? "#ffffff" : "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const initials = contact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      ctx.fillText(initials, pos.x, pos.y)

      // Draw name below
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#1f2937"
      const nameTruncated = contact.name.length > 12 ? contact.name.substring(0, 12) + "..." : contact.name
      ctx.fillText(nameTruncated, pos.x, pos.y + nodeRadius + 18)
    })
  }, [contacts, relationships, selectedContact, familyEdges])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !onContactClick) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    // Check which node was clicked
    contacts.forEach((contact, index) => {
      const angle = (index / contacts.length) * 2 * Math.PI
      const nodeX = centerX + radius * Math.cos(angle)
      const nodeY = centerY + radius * Math.sin(angle)
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2)

      if (distance < 35) {
        onContactClick(contact)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-border/40 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4">Relationship Network</h3>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full border border-border rounded-lg cursor-pointer"
        style={{ height: "500px", background: "#fafafa" }}
      />
      <p className="text-xs text-muted-foreground mt-3">Click on any person to view their details</p>
    </div>
  )
}
