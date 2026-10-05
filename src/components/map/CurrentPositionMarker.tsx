import type { StoreGraph } from '../../types'

interface CurrentPositionMarkerProps {
  currentNodeId: string
  graph: StoreGraph
}

export function CurrentPositionMarker({ currentNodeId, graph }: CurrentPositionMarkerProps) {
  const node = graph.nodes.find((candidate) => candidate.id === currentNodeId)
  if (!node) {
    return null
  }

  return <g className="store-map__current-position" aria-label="Tu posición actual">
    <circle cx={node.x} cy={node.y} r="19" />
    <circle cx={node.x} cy={node.y} r="8" />
    <text x={node.x} y={node.y - 30}>Estás aquí</text>
  </g>
}
