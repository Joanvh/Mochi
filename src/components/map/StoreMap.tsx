import type { Incident, Route, Store } from '../../types'
import { CheckoutMarker } from './CheckoutMarker'
import { CurrentPositionMarker } from './CurrentPositionMarker'
import { IncidentMarker } from './IncidentMarker'
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
    <div className="store-map__viewport">
      <svg viewBox={`0 0 ${store.layout.width} ${store.layout.height}`} role="img" aria-labelledby="store-map-title store-map-description">
        <title id="store-map-title">Plano de {store.displayName}</title>
        <desc id="store-map-description">Distribución de secciones, estanterías, entrada, cajas y ruta de la tienda.</desc>
        <StoreLayout layout={store.layout} />
        {route && <RouteOverlay graph={store.graph} nodePath={route.nodePath} />}
        {store.checkouts.map((checkout) => <CheckoutMarker key={checkout.id} checkout={checkout} store={store} />)}
        {incidents.filter((incident) => incident.status === 'ACTIVE').map((incident) => (
          <IncidentMarker key={incident.id} incident={incident} store={store} />
        ))}
        <CurrentPositionMarker currentNodeId={currentNodeId} graph={store.graph} />
        {targetProductId && <ProductMarker productId={targetProductId} store={store} />}
      </svg>
    </div>
    <figcaption><span>Plano de la tienda</span><span>Desliza para explorar</span></figcaption>
  </figure>
}
