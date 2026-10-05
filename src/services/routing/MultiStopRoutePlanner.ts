import type { PathResult, ProductLocation, StoreGraph } from '../../types'
import { findShortestPath } from './ShortestPathSolver.ts'
import { calculateBaseEdgeCost, type EdgeCostResolver } from './RouteCostCalculator.ts'

export interface MultiStopRoutePlan {
  estimatedDistance: number
  estimatedTime: number
  lastNodeId: string
  nodePath: string[]
  orderedProductIds: string[]
}

interface CandidateStop {
  location: ProductLocation
  path: PathResult
}

export function planMultiStopRoute(
  graph: StoreGraph,
  currentNodeId: string,
  productLocations: ProductLocation[],
  costResolver: EdgeCostResolver = calculateBaseEdgeCost,
): MultiStopRoutePlan | null {
  const remainingLocations = new Map(productLocations.map((location) => [location.productId, location]))
  const nodePath = [currentNodeId]
  const orderedProductIds: string[] = []
  let estimatedDistance = 0
  let estimatedTime = 0
  let lastNodeId = currentNodeId

  while (remainingLocations.size > 0) {
    const candidate = findNearestCandidate(graph, lastNodeId, [...remainingLocations.values()], costResolver)
    if (!candidate) {
      return null
    }

    nodePath.push(...candidate.path.nodePath.slice(1))
    orderedProductIds.push(candidate.location.productId)
    estimatedDistance += candidate.path.distance
    estimatedTime += candidate.path.estimatedTime
    lastNodeId = candidate.location.nodeId
    remainingLocations.delete(candidate.location.productId)
  }

  return { nodePath, orderedProductIds, estimatedDistance, estimatedTime, lastNodeId }
}

function findNearestCandidate(
  graph: StoreGraph,
  currentNodeId: string,
  locations: ProductLocation[],
  costResolver: EdgeCostResolver,
): CandidateStop | null {
  const candidates = locations
    .flatMap((location) => {
      const path = findShortestPath(graph, currentNodeId, location.nodeId, costResolver)
      return path ? [{ location, path }] : []
    })
    .sort((first, second) => (
      first.path.totalCost - second.path.totalCost
      || first.location.productId.localeCompare(second.location.productId)
    ))

  return candidates[0] ?? null
}
