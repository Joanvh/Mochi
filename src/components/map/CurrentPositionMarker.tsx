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

  return (
    <g className="store-map__current-position" aria-label="Tu posición actual" filter="url(#map-marker-shadow)">
      {/* Animated radar ripple rings */}
      <circle className="store-map__radar-wave" cx={node.x} cy={node.y} r="28" />
      <circle className="store-map__radar-wave-delayed" cx={node.x} cy={node.y} r="20" />

      {/* Main beacon circles */}
      <circle className="store-map__pos-outer" cx={node.x} cy={node.y} r="16" />
      <circle className="store-map__pos-core" cx={node.x} cy={node.y} r="7" />

      {/* Badge Pill Background */}
      <rect
        className="store-map__marker-badge-bg"
        x={node.x - 48}
        y={node.y - 42}
        width="96"
        height="24"
        rx="12"
      />
      {/* Label */}
      <text className="store-map__marker-badge-text" x={node.x} y={node.y - 26}>
        Estás aquí
      </text>
    </g>
  )
}

