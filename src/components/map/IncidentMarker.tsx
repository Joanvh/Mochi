import type { Incident, Store } from '../../types'

interface IncidentMarkerProps {
  incident: Incident
  store: Store
}

interface MapPoint {
  x: number
  y: number
}

export function IncidentMarker({ incident, store }: IncidentMarkerProps) {
  const point = getIncidentPoint(incident, store)
  if (!point) {
    return null
  }

  const label = formatIncidentType(incident.type)

  return (
    <g
      className={`store-map__incident-marker store-map__incident-marker--${incident.type.toLowerCase()}`}
      aria-label={`Incidencia: ${label}`}
      filter="url(#map-marker-shadow)"
    >
      <title>{`Incidencia activa: ${label}`}</title>
      {/* Warning pulse ring */}
      <circle className="store-map__incident-wave" cx={point.x} cy={point.y} r="22" />

      {/* Main warning circle */}
      <circle className="store-map__incident-circle" cx={point.x} cy={point.y} r="16" />

      {/* Exclamation mark icon */}
      <text className="store-map__incident-icon" x={point.x} y={point.y + 6}>
        !
      </text>
    </g>
  )
}


function getIncidentPoint(incident: Incident, store: Store): MapPoint | null {
  if (incident.targetType === 'EDGE') {
    const edge = store.graph.edges.find((candidate) => candidate.id === incident.targetId)
    const from = edge && store.graph.nodes.find((candidate) => candidate.id === edge.from)
    const to = edge && store.graph.nodes.find((candidate) => candidate.id === edge.to)
    return from && to ? { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 } : null
  }

  if (incident.targetType === 'PRODUCT') {
    const location = store.productLocations.find((candidate) => candidate.productId === incident.targetId)
    const node = location && store.graph.nodes.find((candidate) => candidate.id === location.nodeId)
    return node ?? null
  }

  if (incident.targetType === 'CHECKOUT') {
    const checkout = store.checkouts.find((candidate) => candidate.id === incident.targetId)
    const node = checkout && store.graph.nodes.find((candidate) => candidate.id === checkout.nodeId)
    return node ?? null
  }

  return store.graph.nodes.find((candidate) => candidate.id === incident.targetId) ?? null
}

function formatIncidentType(type: Incident['type']): string {
  return type.replaceAll('_', ' ').toLocaleLowerCase('es-ES')
}
