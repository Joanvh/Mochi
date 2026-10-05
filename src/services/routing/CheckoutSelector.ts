import type { Checkout, PathResult, StoreGraph } from '../../types'
import { findShortestPath } from './ShortestPathSolver.ts'
import { calculateBaseEdgeCost, type EdgeCostResolver } from './RouteCostCalculator.ts'

export interface CheckoutSelection {
  checkoutId: string
  path: PathResult
  totalTime: number
}

export function selectBestCheckout(
  graph: StoreGraph,
  currentNodeId: string,
  checkouts: Checkout[],
  costResolver: EdgeCostResolver = calculateBaseEdgeCost,
): CheckoutSelection | null {
  const selections = checkouts
    .filter((checkout) => checkout.status === 'OPEN')
    .flatMap((checkout) => {
      const path = findShortestPath(graph, currentNodeId, checkout.nodeId, costResolver)
      return path ? [{ checkoutId: checkout.id, path, totalTime: path.estimatedTime + checkout.queueMinutes }] : []
    })
    .sort((first, second) => first.totalTime - second.totalTime || first.checkoutId.localeCompare(second.checkoutId))

  return selections[0] ?? null
}
