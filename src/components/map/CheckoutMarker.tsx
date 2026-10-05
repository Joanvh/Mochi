import type { Checkout, Store } from '../../types'

interface CheckoutMarkerProps {
  checkout: Checkout
  store: Store
}

export function CheckoutMarker({ checkout, store }: CheckoutMarkerProps) {
  const node = store.graph.nodes.find((candidate) => candidate.id === checkout.nodeId)
  if (!node) {
    return null
  }

  const statusLabel = checkout.status === 'OPEN' ? `${checkout.queueMinutes} min de cola` : 'Cerrada'

  return <g className={`store-map__checkout-marker store-map__checkout-marker--${checkout.status.toLowerCase()}`} aria-label={`${checkout.name}: ${statusLabel}`}>
    <rect x={node.x - 24} y={node.y - 18} width="48" height="36" rx="7" />
    <text x={node.x} y={node.y - 3}>{checkout.name.replace('Caja ', '')}</text>
    <text x={node.x} y={node.y + 11}>{checkout.status === 'OPEN' ? `${checkout.queueMinutes} min` : '×'}</text>
  </g>
}
