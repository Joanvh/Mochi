import type { StoreGraph } from '../../types'

interface RouteOverlayProps {
  graph: StoreGraph
  nodePath: string[]
}

export function RouteOverlay({ graph, nodePath }: RouteOverlayProps) {
  const nodes = nodePath
    .map((nodeId) => graph.nodes.find((node) => node.id === nodeId))
    .filter((node): node is StoreGraph['nodes'][number] => node !== undefined)

  if (nodes.length < 2) {
    return null
  }

  const points = nodes.map((node) => `${node.x},${node.y}`).join(' ')
  const startNode = nodes[0]
  const endNode = nodes[nodes.length - 1]

  return (
    <g className="store-map__route-layer" aria-label="Ruta calculada">
      {/* High-contrast halo outline */}
      <polyline className="store-map__route-halo" points={points} />

      {/* Base route solid line */}
      <polyline className="store-map__route" points={points} />

      {/* Animated forward dash flow line */}
      <polyline className="store-map__route-flow" points={points} />

      {/* Route intermediate waypoints / turns */}
      {nodes.slice(1, -1).map((node, index) => {
        if (node.type === 'PRODUCT_ACCESS' || node.type === 'INTERSECTION') {
          return (
            <circle
              key={`${node.id}-${index}`}
              className="store-map__route-waypoint"
              cx={node.x}
              cy={node.y}
              r="4.5"
            />
          )
        }
        return null
      })}

      {/* Origin dot */}
      <circle className="store-map__route-start" cx={startNode.x} cy={startNode.y} r="6" />

      {/* Destination ring */}
      <circle className="store-map__route-end" cx={endNode.x} cy={endNode.y} r="9" />
      <circle className="store-map__route-end-core" cx={endNode.x} cy={endNode.y} r="5" />
    </g>
  )
}

