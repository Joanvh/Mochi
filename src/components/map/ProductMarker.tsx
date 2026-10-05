import type { Store } from '../../types'

interface ProductMarkerProps {
  productId: string
  store: Store
}

export function ProductMarker({ productId, store }: ProductMarkerProps) {
  const location = store.productLocations.find((candidate) => candidate.productId === productId)
  const node = location && store.graph.nodes.find((candidate) => candidate.id === location.nodeId)
  if (!node) {
    return null
  }

  return (
    <g className="store-map__product-marker" aria-label="Siguiente producto" filter="url(#map-marker-shadow)">
      {/* Target glowing pulse ring */}
      <circle className="store-map__target-wave" cx={node.x} cy={node.y} r="26" />

      {/* Target pin background */}
      <circle className="store-map__target-pin-bg" cx={node.x} cy={node.y} r="16" />

      {/* Target pin icon / core dot */}
      <circle cx={node.x} cy={node.y} r="6" fill="#ffffff" />
      <path
        d={`M ${node.x - 4} ${node.y} L ${node.x} ${node.y + 11} L ${node.x + 4} ${node.y} Z`}
        className="store-map__target-pin-tail"
      />

      {/* Badge Pill Background */}
      <rect
        className="store-map__target-badge-bg"
        x={node.x - 62}
        y={node.y - 42}
        width="124"
        height="24"
        rx="12"
      />
      {/* Label */}
      <text className="store-map__target-badge-text" x={node.x} y={node.y - 26}>
        📍 Siguiente parada
      </text>
    </g>
  )
}

