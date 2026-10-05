import type { Checkout, Store } from '../../types'

interface CheckoutMarkerProps {
  checkout: Checkout
  store: Store
  isTarget?: boolean
}

export function CheckoutMarker({ checkout, store, isTarget = false }: CheckoutMarkerProps) {
  const node = store.graph.nodes.find((candidate) => candidate.id === checkout.nodeId)
  if (!node) {
    return null
  }

  const isOpen = checkout.status === 'OPEN'
  const checkoutNum = checkout.name.replace('Caja ', '')
  const statusLabel = isOpen ? `${checkout.queueMinutes} min de espera` : 'Cerrada'

  return (
    <g
      className={`store-map__checkout-marker store-map__checkout-marker--${checkout.status.toLowerCase()} ${isTarget ? 'store-map__checkout-marker--target' : ''}`}
      aria-label={`${checkout.name}: ${statusLabel}`}
      filter="url(#zone-card-shadow)"
    >
      <title>{`${checkout.name} · ${statusLabel}`}</title>
      {/* Target glow if it is the destination checkout */}
      {isTarget && (
        <rect
          className="store-map__checkout-target-glow"
          x={node.x - 28}
          y={node.y - 24}
          width="56"
          height="48"
          rx="10"
        />
      )}

      {/* Main register card */}
      <rect
        className="store-map__checkout-card"
        x={node.x - 26}
        y={node.y - 22}
        width="52"
        height="44"
        rx="8"
      />

      {/* Checkout label */}
      <text className="store-map__checkout-title" x={node.x} y={node.y - 5}>
        C{checkoutNum}
      </text>

      {/* Status or wait time */}
      <text className="store-map__checkout-sub" x={node.x} y={node.y + 13}>
        {isOpen ? `${checkout.queueMinutes}m` : 'Cerr.'}
      </text>
    </g>
  )
}

