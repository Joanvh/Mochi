import type { GraphEdge, Incident, IncidentWeightConfig } from '../../types'
import {
  DEFAULT_INCIDENT_WEIGHTS,
  getActiveEdgeIncidents,
  getIncidentEffect,
} from '../incidents/IncidentRules.ts'

export type EdgeCostResolver = (edge: GraphEdge) => number

export function calculateBaseEdgeCost(edge: GraphEdge): number {
  return Math.max(0, edge.baseTime)
}

export function calculateEdgeCost(
  edge: GraphEdge,
  incidents: Incident[],
  weights: IncidentWeightConfig = DEFAULT_INCIDENT_WEIGHTS,
): number {
  if (!edge.enabled) {
    return Number.POSITIVE_INFINITY
  }

  const effects = getActiveEdgeIncidents(edge.id, incidents)
    .map((incident) => getIncidentEffect(incident, weights))

  if (effects.some((effect) => effect.blocksTraversal)) {
    return Number.POSITIVE_INFINITY
  }

  const multiplier = effects.reduce((total, effect) => total * effect.costMultiplier, 1)
  const additionalMinutes = effects.reduce(
    (total, effect) => total + (effect.additionalMinutes ?? 0),
    0,
  )

  return Math.max(0, calculateBaseEdgeCost(edge) * multiplier + additionalMinutes)
}
