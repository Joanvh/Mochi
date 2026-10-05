import type { Incident, Route, Store } from '../../types'
import { CurrentPositionMarker } from './CurrentPositionMarker'
import { ProductMarker } from './ProductMarker'
import { RouteOverlay } from './RouteOverlay'
import { StoreLayout } from './StoreLayout'

export interface StoreMapProps {
  currentNodeId: string
  incidents: Incident[]
  route: Route | null
  store: Store
  targetProductId?: string
}

export function StoreMap({ currentNodeId, incidents, route, store, targetProductId }: StoreMapProps) {
  void incidents

  return <figure className="store-map">
    <svg viewBox={`0 0 ${store.layout.width} ${store.layout.height}`} role="img" aria-labelledby="store-map-title store-map-description">
      <title id="store-map-title">Plano de {store.displayName}</title>
      <desc id="store-map-description">Distribución de secciones, estanterías, entrada y cajas de la tienda.</desc>
      <StoreLayout layout={store.layout} />
      {route && <RouteOverlay graph={store.graph} nodePath={route.nodePath} />}
      <CurrentPositionMarker currentNodeId={currentNodeId} graph={store.graph} />
      {targetProductId && <ProductMarker productId={targetProductId} store={store} />}
    </svg>
    <figcaption>Plano de la tienda</figcaption>
  </figure>
}
