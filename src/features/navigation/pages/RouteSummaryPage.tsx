import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { mercadonaApi } from '../../../services/backend/MercadonaApiService'
import { useAppStore } from '../../../store/useAppStore'
import type { Store } from '../../../types'

export function RouteSummaryPage() {
  const navigate = useNavigate()
  const currentStore = useAppStore((state) => state.currentStore)
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const pendingItems = useAppStore((state) => state.draftShoppingList)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const setActiveRoute = useAppStore((state) => state.setActiveRoute)
  const [loadedStore, setLoadedStore] = useState<Store | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const store = currentStore ?? loadedStore

  useEffect(() => {
    if (currentStore) {
      return
    }

    async function loadStore() {
      try {
        const nextStore = await mercadonaApi.loadPrimaryStore()
        setLoadedStore(nextStore)
        setCurrentStore(nextStore)
      } catch {
        setRouteError('No se ha podido cargar el plano definitivo de la tienda.')
      }
    }

    void loadStore()
  }, [currentStore, setCurrentStore])

  useEffect(() => {
    if (!store) return
    const activeStore = store
    const productIds = pendingItems.filter((item) => item.status === 'PENDING' && item.productId).map((item) => item.productId as string)
    if (productIds.length === 0) {
      setActiveRoute(null)
      return
    }

    async function requestRoute() {
      setIsCalculating(true)
      setRouteError(null)
      try {
        const route = await mercadonaApi.calculateRoute(activeStore, productIds, activeStore.entranceNodeId, 'INITIAL')
        setActiveRoute(route)
      } catch {
        setRouteError('No se ha podido calcular la ruta con el motor de navegación.')
        setActiveRoute(null)
      } finally {
        setIsCalculating(false)
      }
    }

    void requestRoute()
  }, [activeIncidents, pendingItems, setActiveRoute, store])

  if (!store) {
    return <PageContainer className="page-placeholder"><LoadingState label="Preparando el plano de la tienda…" /></PageContainer>
  }

  const routeProducts = activeRoute?.orderedProductIds.map((productId) => (
    pendingItems.find((item) => item.productId === productId)?.rawText ?? `Producto ${productId}`
  )) ?? []
  const nextProduct = routeProducts[0]

  return <PageContainer className="route-summary-page">
    <p className="eyebrow">Paso 3 · Recorrido</p>
    <h1>Tu recorrido por la tienda</h1>
    <p className="route-summary-page__description">Hemos ordenado tu lista para que recorras la tienda de forma eficiente.</p>
    <StoreMap currentNodeId={store.entranceNodeId} incidents={activeIncidents} route={activeRoute} store={store} />
    {isCalculating ? <LoadingState label="Calculando el recorrido óptimo…" /> : activeRoute ? <>
      <dl className="route-summary-page__metrics">
        <div><dt>Productos</dt><dd>{routeProducts.length}</dd></div>
        <div><dt>Tiempo estimado</dt><dd>{Math.ceil(activeRoute.estimatedTime)} min</dd></div>
        <div><dt>Distancia</dt><dd>{Math.round(activeRoute.estimatedDistance)} m</dd></div>
      </dl>
      <section className="route-summary-page__details" aria-label="Detalle de la ruta">
        <p className="route-summary-page__next-label">Primera parada</p>
        <h2>{nextProduct ?? 'Productos de tu lista'}</h2>
        <ol className="route-summary-page__products">
          {routeProducts.map((product, index) => <li key={`${product}-${index}`}>{product}</li>)}
        </ol>
      </section>
      <Button fullWidth onClick={() => navigate('/navigation')}>Comenzar navegación</Button>
    </> : <section className="empty-list">
      <p>{routeError ?? 'No hemos podido crear una ruta con la lista actual.'}</p>
      <Button onClick={() => navigate('/list')}>Volver a la lista</Button>
    </section>}
  </PageContainer>
}
