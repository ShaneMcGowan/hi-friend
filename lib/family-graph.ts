import type { Contact } from "./types"

export interface InferredRelation {
  contact: Contact
  relation: RelationType
}

export type RelationType =
  | "Parent"
  | "Child"
  | "Sibling"
  | "Half-Sibling"
  | "Grandparent"
  | "Grandchild"
  | "Aunt/Uncle"
  | "Niece/Nephew"
  | "Cousin"
  | "Great-Grandparent"
  | "Great-Grandchild"

/**
 * FamilyGraph builds an in-memory graph structure from contacts using parentIds.
 * It provides efficient queries for family relationships.
 */
export class FamilyGraph {
  private contacts: Map<string, Contact>
  private childrenMap: Map<string, Set<string>> // parentId -> Set of childIds
  private parentsMap: Map<string, Set<string>> // childId -> Set of parentIds

  constructor(contacts: Contact[]) {
    this.contacts = new Map()
    this.childrenMap = new Map()
    this.parentsMap = new Map()

    // Index all contacts
    for (const contact of contacts) {
      this.contacts.set(contact.id, contact)
    }

    // Build parent-child relationships from parentIds
    for (const contact of contacts) {
      if (contact.parentIds && contact.parentIds.length > 0) {
        // Store parents for this child
        this.parentsMap.set(contact.id, new Set(contact.parentIds))

        // Store this child for each parent
        for (const parentId of contact.parentIds) {
          if (!this.childrenMap.has(parentId)) {
            this.childrenMap.set(parentId, new Set())
          }
          this.childrenMap.get(parentId)!.add(contact.id)
        }
      }
    }
  }

  getContact(id: string): Contact | undefined {
    return this.contacts.get(id)
  }

  /**
   * Get direct parents of a contact
   */
  getParents(contactId: string): Contact[] {
    const parentIds = this.parentsMap.get(contactId)
    if (!parentIds) return []
    return Array.from(parentIds)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get direct children of a contact
   */
  getChildren(contactId: string): Contact[] {
    const childIds = this.childrenMap.get(contactId)
    if (!childIds) return []
    return Array.from(childIds)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get siblings (share at least one parent)
   * Returns full siblings and half-siblings separately
   */
  getSiblings(contactId: string): { full: Contact[]; half: Contact[] } {
    const parentIds = this.parentsMap.get(contactId)
    if (!parentIds || parentIds.size === 0) {
      return { full: [], half: [] }
    }

    const siblingCounts = new Map<string, number>() // siblingId -> shared parent count

    for (const parentId of parentIds) {
      const children = this.childrenMap.get(parentId)
      if (children) {
        for (const childId of children) {
          if (childId !== contactId) {
            siblingCounts.set(childId, (siblingCounts.get(childId) || 0) + 1)
          }
        }
      }
    }

    const full: Contact[] = []
    const half: Contact[] = []

    for (const [siblingId, sharedParentCount] of siblingCounts) {
      const sibling = this.contacts.get(siblingId)
      if (sibling) {
        // Full sibling if they share all parents (and both have 2 parents)
        if (sharedParentCount >= 2 && parentIds.size >= 2) {
          full.push(sibling)
        } else {
          half.push(sibling)
        }
      }
    }

    return { full, half }
  }

  /**
   * Get all siblings (both full and half combined)
   */
  getAllSiblings(contactId: string): Contact[] {
    const { full, half } = this.getSiblings(contactId)
    return [...full, ...half]
  }

  /**
   * Get grandparents (parents of parents)
   */
  getGrandparents(contactId: string): Contact[] {
    const parents = this.getParents(contactId)
    const grandparents = new Set<string>()

    for (const parent of parents) {
      const grandparentIds = this.parentsMap.get(parent.id)
      if (grandparentIds) {
        for (const gpId of grandparentIds) {
          grandparents.add(gpId)
        }
      }
    }

    return Array.from(grandparents)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get great-grandparents (parents of grandparents)
   */
  getGreatGrandparents(contactId: string): Contact[] {
    const grandparents = this.getGrandparents(contactId)
    const greatGrandparents = new Set<string>()

    for (const gp of grandparents) {
      const ggpIds = this.parentsMap.get(gp.id)
      if (ggpIds) {
        for (const ggpId of ggpIds) {
          greatGrandparents.add(ggpId)
        }
      }
    }

    return Array.from(greatGrandparents)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get grandchildren (children of children)
   */
  getGrandchildren(contactId: string): Contact[] {
    const children = this.getChildren(contactId)
    const grandchildren = new Set<string>()

    for (const child of children) {
      const gcIds = this.childrenMap.get(child.id)
      if (gcIds) {
        for (const gcId of gcIds) {
          grandchildren.add(gcId)
        }
      }
    }

    return Array.from(grandchildren)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get great-grandchildren (children of grandchildren)
   */
  getGreatGrandchildren(contactId: string): Contact[] {
    const grandchildren = this.getGrandchildren(contactId)
    const greatGrandchildren = new Set<string>()

    for (const gc of grandchildren) {
      const ggcIds = this.childrenMap.get(gc.id)
      if (ggcIds) {
        for (const ggcId of ggcIds) {
          greatGrandchildren.add(ggcId)
        }
      }
    }

    return Array.from(greatGrandchildren)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get aunts/uncles (siblings of parents)
   */
  getAuntsUncles(contactId: string): Contact[] {
    const parents = this.getParents(contactId)
    const auntsUncles = new Set<string>()

    for (const parent of parents) {
      const siblings = this.getAllSiblings(parent.id)
      for (const sibling of siblings) {
        auntsUncles.add(sibling.id)
      }
    }

    return Array.from(auntsUncles)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get nieces/nephews (children of siblings)
   */
  getNiecesNephews(contactId: string): Contact[] {
    const siblings = this.getAllSiblings(contactId)
    const niecesNephews = new Set<string>()

    for (const sibling of siblings) {
      const children = this.getChildren(sibling.id)
      for (const child of children) {
        niecesNephews.add(child.id)
      }
    }

    return Array.from(niecesNephews)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get cousins (children of aunts/uncles)
   */
  getCousins(contactId: string): Contact[] {
    const auntsUncles = this.getAuntsUncles(contactId)
    const cousins = new Set<string>()

    for (const auntUncle of auntsUncles) {
      const children = this.getChildren(auntUncle.id)
      for (const child of children) {
        cousins.add(child.id)
      }
    }

    return Array.from(cousins)
      .map((id) => this.contacts.get(id))
      .filter((c): c is Contact => c !== undefined)
  }

  /**
   * Get all inferred family relationships for a contact
   * Returns a deduplicated list ordered by relationship proximity
   */
  getAllFamilyRelations(contactId: string): InferredRelation[] {
    const relations: InferredRelation[] = []
    const seen = new Set<string>()

    const addRelations = (contacts: Contact[], type: RelationType) => {
      for (const contact of contacts) {
        if (!seen.has(contact.id)) {
          seen.add(contact.id)
          relations.push({ contact, relation: type })
        }
      }
    }

    // Add in order of proximity
    addRelations(this.getParents(contactId), "Parent")
    addRelations(this.getChildren(contactId), "Child")

    const { full, half } = this.getSiblings(contactId)
    addRelations(full, "Sibling")
    addRelations(half, "Half-Sibling")

    addRelations(this.getGrandparents(contactId), "Grandparent")
    addRelations(this.getGrandchildren(contactId), "Grandchild")
    addRelations(this.getAuntsUncles(contactId), "Aunt/Uncle")
    addRelations(this.getNiecesNephews(contactId), "Niece/Nephew")
    addRelations(this.getCousins(contactId), "Cousin")
    addRelations(this.getGreatGrandparents(contactId), "Great-Grandparent")
    addRelations(this.getGreatGrandchildren(contactId), "Great-Grandchild")

    return relations
  }

  /**
   * Get extended family (excludes direct parents, children, and siblings)
   */
  getExtendedFamily(contactId: string): InferredRelation[] {
    const relations: InferredRelation[] = []
    const seen = new Set<string>()

    // Exclude direct family
    for (const p of this.getParents(contactId)) seen.add(p.id)
    for (const c of this.getChildren(contactId)) seen.add(c.id)
    for (const s of this.getAllSiblings(contactId)) seen.add(s.id)

    const addRelations = (contacts: Contact[], type: RelationType) => {
      for (const contact of contacts) {
        if (!seen.has(contact.id)) {
          seen.add(contact.id)
          relations.push({ contact, relation: type })
        }
      }
    }

    addRelations(this.getGrandparents(contactId), "Grandparent")
    addRelations(this.getGrandchildren(contactId), "Grandchild")
    addRelations(this.getAuntsUncles(contactId), "Aunt/Uncle")
    addRelations(this.getNiecesNephews(contactId), "Niece/Nephew")
    addRelations(this.getCousins(contactId), "Cousin")
    addRelations(this.getGreatGrandparents(contactId), "Great-Grandparent")
    addRelations(this.getGreatGrandchildren(contactId), "Great-Grandchild")

    return relations
  }

  /**
   * Get all family edges for graph visualization
   * Returns pairs of [contactId1, contactId2, relationshipType]
   */
  getAllFamilyEdges(): Array<{ from: string; to: string; type: string }> {
    const edges: Array<{ from: string; to: string; type: string }> = []
    const edgeSet = new Set<string>()

    const addEdge = (from: string, to: string, type: string) => {
      const key = [from, to].sort().join("-")
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        edges.push({ from, to, type })
      }
    }

    // Add parent-child edges
    for (const [childId, parentIds] of this.parentsMap) {
      for (const parentId of parentIds) {
        if (this.contacts.has(parentId)) {
          addEdge(parentId, childId, "Parent/Child")
        }
      }
    }

    // Add sibling edges
    for (const [contactId] of this.contacts) {
      const siblings = this.getAllSiblings(contactId)
      for (const sibling of siblings) {
        addEdge(contactId, sibling.id, "Sibling")
      }
    }

    return edges
  }
}

/**
 * Helper function to create a family graph from contacts
 */
export function createFamilyGraph(contacts: Contact[]): FamilyGraph {
  return new FamilyGraph(contacts)
}
