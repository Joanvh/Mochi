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

  return <g className="store-map__product-marker" aria-label="Siguiente producto">
    <circle cx={node.x} cy={node.y} r="18" />
    <path d={`M ${node.x} ${node.y - 8} L ${node.x + 8} ${node.y + 8} L ${node.x - 8} ${node.y + 8} Z`} />
    <text x={node.x} y={node.y - 29}>Siguiente parada</text>
  </g>
}
