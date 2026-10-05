import type { Incident, IncidentEffect, IncidentWeightConfig } from '../../types'

export const DEFAULT_INCIDENT_WEIGHTS: IncidentWeightConfig = {
  congestionLow: 1.2,
  congestionMedium: 1.8,
  congestionHigh: 3,
  restocking: 1.4,
}

const NO_EFFECT: IncidentEffect = {
  blocksTraversal: false,
  costMultiplier: 1,
}

export function getIncidentEffect(
  incident: Incident,
  weights: IncidentWeightConfig = DEFAULT_INCIDENT_WEIGHTS,
): IncidentEffect {
  if (incident.status !== 'ACTIVE') {
    return NO_EFFECT
  }

  if (incident.type === 'SPILL' || incident.type === 'BLOCKED_AISLE') {
    return { blocksTraversal: true, costMultiplier: Number.POSITIVE_INFINITY }
  }

  if (incident.type === 'CONGESTION') {
    const costMultiplier = incident.severity === 'LOW'
      ? weights.congestionLow
      : incident.severity === 'MEDIUM'
        ? weights.congestionMedium
        : weights.congestionHigh

    return { blocksTraversal: false, costMultiplier }
  }

  if (incident.type === 'RESTOCKING') {
    return { blocksTraversal: false, costMultiplier: weights.restocking }
  }

  return NO_EFFECT
}

export function getActiveEdgeIncidents(edgeId: string, incidents: Incident[]): Incident[] {
  return incidents.filter((incident) => (
    incident.status === 'ACTIVE'
    && incident.targetType === 'EDGE'
    && incident.targetId === edgeId
  ))
}
