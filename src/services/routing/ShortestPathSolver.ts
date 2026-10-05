import type { PathResult, StoreGraph } from '../../types'
import { GraphService } from './GraphService.ts'
import { calculateBaseEdgeCost, type EdgeCostResolver } from './RouteCostCalculator.ts'

interface PreviousStep {
  edgeId: string
  nodeId: string
}

export function findShortestPath(
  graph: StoreGraph,
  sourceId: string,
  destinationId: string,
  costResolver: EdgeCostResolver = calculateBaseEdgeCost,
): PathResult | null {
  const graphService = new GraphService(graph)

  if (!graphService.getNode(sourceId) || !graphService.getNode(destinationId)) {
    return null
  }

  const distances = new Map<string, number>(graph.nodes.map((node) => [node.id, Infinity]))
  const previous = new Map<string, PreviousStep>()
  const unvisited = new Set(graph.nodes.map((node) => node.id))
  distances.set(sourceId, 0)

  while (unvisited.size > 0) {
    const currentNodeId = getClosestNode(unvisited, distances)

    if (!currentNodeId || distances.get(currentNodeId) === Infinity) {
      break
    }

    if (currentNodeId === destinationId) {
      return buildPathResult(currentNodeId, sourceId, previous, graph, distances.get(currentNodeId) ?? Infinity)
    }

    unvisited.delete(currentNodeId)

    for (const edge of graphService.getEdges(currentNodeId)) {
      const neighborId = edge.from === currentNodeId ? edge.to : edge.from
      if (!unvisited.has(neighborId) || !edge.enabled) {
        continue
      }

      const edgeCost = costResolver(edge)
      if (!Number.isFinite(edgeCost) || edgeCost < 0) {
        continue
      }

      const nextDistance = (distances.get(currentNodeId) ?? Infinity) + edgeCost
      if (nextDistance < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, nextDistance)
        previous.set(neighborId, { nodeId: currentNodeId, edgeId: edge.id })
      }
    }
  }

  return null
}

function getClosestNode(unvisited: Set<string>, distances: Map<string, number>): string | null {
  let closestNodeId: string | null = null
  let shortestDistance = Infinity

  for (const nodeId of unvisited) {
    const distance = distances.get(nodeId) ?? Infinity
    if (distance < shortestDistance) {
      closestNodeId = nodeId
      shortestDistance = distance
    }
  }

  return closestNodeId
}

function buildPathResult(
  destinationId: string,
  sourceId: string,
  previous: Map<string, PreviousStep>,
  graph: StoreGraph,
  totalCost: number,
): PathResult {
  const nodePath = [destinationId]
  const edgePath: string[] = []
  let currentNodeId = destinationId

  while (currentNodeId !== sourceId) {
    const step = previous.get(currentNodeId)
    if (!step) {
      return { nodePath: [], totalCost: Infinity, distance: 0, estimatedTime: 0 }
    }

    nodePath.unshift(step.nodeId)
    edgePath.unshift(step.edgeId)
    currentNodeId = step.nodeId
  }

  const distance = edgePath.reduce((totalDistance, edgeId) => (
    totalDistance + (graph.edges.find((edge) => edge.id === edgeId)?.distance ?? 0)
  ), 0)

  return { nodePath, totalCost, distance, estimatedTime: totalCost }
}
