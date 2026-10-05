import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
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

const MIN_ZOOM = 1
const MAX_ZOOM = 2.4
const ZOOM_STEP = 0.35

export function StoreMap({ currentNodeId, incidents, route, store, targetProductId }: StoreMapProps) {
  const storeWidth = store.layout.width
  const storeHeight = store.layout.height

  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: storeWidth / 2, y: storeHeight / 2 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ clientX: number; clientY: number; startCenter: { x: number; y: number } } | null>(null)

  // Clamp center so viewBox stays comfortably within store boundaries
  const clampCenter = useCallback((cx: number, cy: number, currentZoom: number) => {
    const viewW = storeWidth / currentZoom
    const viewH = storeHeight / currentZoom
    const minX = viewW / 2
    const maxX = storeWidth - viewW / 2
    const minY = viewH / 2
    const maxY = storeHeight - viewH / 2

    return {
      x: currentZoom <= 1 ? storeWidth / 2 : Math.max(minX, Math.min(maxX, cx)),
      y: currentZoom <= 1 ? storeHeight / 2 : Math.max(minY, Math.min(maxY, cy)),
    }
  }, [storeHeight, storeWidth])

  const handleZoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, +(prev + ZOOM_STEP).toFixed(2))
      setCenter((c) => clampCenter(c.x, c.y, next))
      return next
    })
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, +(prev - ZOOM_STEP).toFixed(2))
      setCenter((c) => clampCenter(c.x, c.y, next))
      return next
    })
  }

  const handleReset = () => {
    setZoom(1)
    setCenter({ x: storeWidth / 2, y: storeHeight / 2 })
  }

  const handleCenterOnTarget = useCallback(() => {
    // If there is a target product, center on its node. Otherwise center on currentNodeId
    let targetNode = null
    if (targetProductId) {
      const loc = store.productLocations.find((candidate) => candidate.productId === targetProductId)
      if (loc) {
        targetNode = store.graph.nodes.find((n) => n.id === loc.nodeId)
      }
    }

    if (!targetNode) {
      targetNode = store.graph.nodes.find((n) => n.id === currentNodeId)
    }

    if (targetNode) {
      const targetZoom = Math.max(1.5, zoom)
      setZoom(targetZoom)
      setCenter(clampCenter(targetNode.x, targetNode.y, targetZoom))
    }
  }, [clampCenter, currentNodeId, store.graph.nodes, store.productLocations, targetProductId, zoom])

  // Pointer drag events for smooth panning when zoomed in

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    setIsDragging(true)
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startCenter: { ...center },
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const viewW = storeWidth / zoom
    const viewH = storeHeight / zoom
    const scaleX = viewW / rect.width
    const scaleY = viewH / rect.height

    const deltaX = (e.clientX - dragStartRef.current.clientX) * scaleX
    const deltaY = (e.clientY - dragStartRef.current.clientY) * scaleY

    setCenter(clampCenter(
      dragStartRef.current.startCenter.x - deltaX,
      dragStartRef.current.startCenter.y - deltaY,
      zoom,
    ))
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false)
      dragStartRef.current = null
      try {
        ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
      } catch {
        // Ignored if already released
      }
    }
  }

  // Calculate dynamic viewBox
  const viewW = storeWidth / zoom
  const viewH = storeHeight / zoom
  const viewX = center.x - viewW / 2
  const viewY = center.y - viewH / 2
  const viewBox = `${viewX} ${viewY} ${viewW} ${viewH}`

  const activeIncidents = incidents.filter((i) => i.status === 'ACTIVE')
  const openCheckouts = store.checkouts.filter((c) => c.status === 'OPEN').length

  return (
    <figure className={`store-map ${isFullscreen ? 'store-map--fullscreen' : ''}`}>
      {/* Floating control bar */}
      <div className="store-map__toolbar" role="toolbar" aria-label="Controles del plano">
        <div className="store-map__zoom-group">
          <button
            type="button"
            className="store-map__btn"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Acercar plano"
            title="Acercar"
          >
            +
          </button>
          <span className="store-map__zoom-label" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            className="store-map__btn"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Alejar plano"
            title="Alejar"
          >
            −
          </button>
        </div>

        <button
          type="button"
          className="store-map__btn store-map__btn--text"
          onClick={handleReset}
          disabled={zoom === 1 && center.x === storeWidth / 2 && center.y === storeHeight / 2}
          aria-label="Ajustar plano completo"
          title="Ver tienda completa"
        >
          Ajustar
        </button>

        <button
          type="button"
          className="store-map__btn store-map__btn--text"
          onClick={handleCenterOnTarget}
          aria-label="Centrar en parada o posición actual"
          title="Centrar en mi destino"
        >
          🎯 Centrar
        </button>

        <button
          type="button"
          className="store-map__btn store-map__btn--expand"
          onClick={() => setIsFullscreen(!isFullscreen)}
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver plano en pantalla completa'}
          title={isFullscreen ? 'Cerrar' : 'Expandir'}
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>

      {/* Main interactive SVG Viewport */}
      <div
        ref={viewportRef}
        className={`store-map__viewport ${isDragging ? 'store-map__viewport--dragging' : ''} ${zoom > 1 ? 'store-map__viewport--zoomable' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg
          viewBox={viewBox}
          role="img"
          aria-labelledby="store-map-title store-map-description"
          preserveAspectRatio="xMidYMid meet"
          className="store-map__svg"
        >
          <title id="store-map-title">Plano interactivo de {store.displayName}</title>
          <desc id="store-map-description">
            Distribución de secciones, estanterías, entrada, cajas y ruta guiada de la tienda.
          </desc>

          <StoreLayout layout={store.layout} />

          {route && <RouteOverlay graph={store.graph} nodePath={route.nodePath} />}

          {store.checkouts.map((checkout) => (
            <CheckoutMarker
              key={checkout.id}
              checkout={checkout}
              store={store}
              isTarget={route?.checkoutId === checkout.id}
            />
          ))}

          {activeIncidents.map((incident) => (
            <IncidentMarker key={incident.id} incident={incident} store={store} />
          ))}

          <CurrentPositionMarker currentNodeId={currentNodeId} graph={store.graph} />

          {targetProductId && <ProductMarker productId={targetProductId} store={store} />}
        </svg>
      </div>

      {/* Clean Interactive Legend Bar */}
      <figcaption className="store-map__caption">
        <div className="store-map__legend">
          <span className="store-map__legend-item">
            <span className="store-map__legend-badge store-map__legend-badge--pos" />
            Tu posición
          </span>
          {targetProductId && (
            <span className="store-map__legend-item">
              <span className="store-map__legend-badge store-map__legend-badge--target" />
              Siguiente parada
            </span>
          )}
          {route && (
            <span className="store-map__legend-item">
              <span className="store-map__legend-badge store-map__legend-badge--route" />
              Ruta guiada
            </span>
          )}
          <span className="store-map__legend-item">
            <span className="store-map__legend-badge store-map__legend-badge--checkout" />
            Cajas ({openCheckouts} abiertas)
          </span>
          {activeIncidents.length > 0 && (
            <span className="store-map__legend-item store-map__legend-item--alert">
              <span className="store-map__legend-badge store-map__legend-badge--alert" />
              {activeIncidents.length} incidencia{activeIncidents.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {zoom > 1 && (
          <span className="store-map__hint">Arrastra para explorar</span>
        )}
      </figcaption>
    </figure>
  )
}

