import type { Incident, IncidentEffect, IncidentType } from '../../types'
import { getIncidentEffect } from './IncidentRules.ts'

export type IncidentDraft = Omit<Incident, 'id' | 'createdAt' | 'status'> & {
  id?: string
  createdAt?: string
  status?: Incident['status']
}

export interface IncidentManagerOptions {
  createId?: () => string
  now?: () => string
}

const TARGET_TYPE_BY_INCIDENT: Record<IncidentType, Incident['targetType']> = {
  PRODUCT_OUT_OF_STOCK: 'PRODUCT',
  CONGESTION: 'EDGE',
  BLOCKED_AISLE: 'EDGE',
  SPILL: 'EDGE',
  RESTOCKING: 'EDGE',
  LONG_CHECKOUT_QUEUE: 'CHECKOUT',
}

export class IncidentManager {
  private incidents: Incident[]
  private readonly createId: () => string
  private readonly now: () => string

  constructor(initialIncidents: Incident[] = [], options: IncidentManagerOptions = {}) {
    this.incidents = [...initialIncidents]
    this.createId = options.createId ?? (() => `incident-${this.incidents.length + 1}`)
    this.now = options.now ?? (() => new Date().toISOString())
  }

  createIncident(draft: IncidentDraft): Incident {
    this.validateTarget(draft.type, draft.targetType, draft.targetId)

    const incident: Incident = {
      ...draft,
      id: draft.id ?? this.createId(),
      createdAt: draft.createdAt ?? this.now(),
      status: draft.status ?? 'ACTIVE',
    }

    if (this.incidents.some((existingIncident) => existingIncident.id === incident.id)) {
      throw new Error(`Incident with id "${incident.id}" already exists.`)
    }

    this.incidents.push(incident)
    return incident
  }

  removeIncident(incidentId: string): boolean {
    const initialLength = this.incidents.length
    this.incidents = this.incidents.filter((incident) => incident.id !== incidentId)
    return this.incidents.length !== initialLength
  }

  expireIncident(incidentId: string): boolean {
    const incident = this.incidents.find((candidate) => candidate.id === incidentId)
    if (!incident || incident.status !== 'ACTIVE') {
      return false
    }

    incident.status = 'EXPIRED'
    return true
  }

  getActiveIncidents(): Incident[] {
    return this.incidents.filter((incident) => incident.status === 'ACTIVE')
  }

  getIncidentEffect(incidentId: string): IncidentEffect | null {
    const incident = this.incidents.find((candidate) => candidate.id === incidentId)
    return incident ? getIncidentEffect(incident) : null
  }

  private validateTarget(type: IncidentType, targetType: Incident['targetType'], targetId: string): void {
    if (!targetId.trim()) {
      throw new Error('Incident targetId must not be empty.')
    }

    const expectedTargetType = TARGET_TYPE_BY_INCIDENT[type]
    if (targetType !== expectedTargetType) {
      throw new Error(`${type} incidents must target ${expectedTargetType}.`)
    }
  }
}
