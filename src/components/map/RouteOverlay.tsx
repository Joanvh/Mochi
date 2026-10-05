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

  return <g aria-label="Ruta calculada">
    <polyline className="store-map__route-halo" points={points} />
    <polyline className="store-map__route" points={points} />
  </g>
}
