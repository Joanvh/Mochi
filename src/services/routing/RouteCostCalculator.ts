import type { GraphEdge } from '../../types'

export type EdgeCostResolver = (edge: GraphEdge) => number

export function calculateBaseEdgeCost(edge: GraphEdge): number {
  return Math.max(0, edge.baseTime)
}
