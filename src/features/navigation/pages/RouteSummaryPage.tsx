import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { JsonProductRepository } from '../../../repositories/JsonProductRepository'
import { JsonStoreRepository } from '../../../repositories/JsonStoreRepository'
import { calculateRoute } from '../../../services/routing/RoutingEngine'
import { useAppStore } from '../../../store/useAppStore'
import type { Product, Route, Store } from '../../../types'

const productRepository = new JsonProductRepository()
const storeRepository = new JsonStoreRepository()

export function RouteSummaryPage() {
  const navigate = useNavigate()
  const currentStore = useAppStore((state) => state.currentStore)
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const pendingItems = useAppStore((state) => state.draftShoppingList)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const setActiveRoute = useAppStore((state) => state.setActiveRoute)
  const [loadedStore, setLoadedStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const store = currentStore ?? loadedStore

  const activeRoute = useMemo<Route | null>(() => {
    if (!store) {
      return null
    }

    const pendingProducts = pendingItems
      .filter((item) => item.status === 'PENDING' && item.productId)
      .map((item) => store.productLocations.find((location) => location.productId === item.productId))
      .filter((location): location is Store['productLocations'][number] => location !== undefined)
    const result = calculateRoute({
      graph: store.graph,
      currentNodeId: store.entranceNodeId,
      pendingProducts,
      incidents: activeIncidents,
      checkouts: store.checkouts,
    })

    return result ? {
      id: 'route-preview',
      nodePath: result.nodePath,
      orderedProductIds: result.orderedProductIds,
      estimatedTime: result.estimatedTime,
      estimatedDistance: result.estimatedDistance,
      checkoutId: result.checkoutId,
      generatedAt: '2026-10-05T00:00:00.000Z',
      reason: 'INITIAL',
    } : null
  }, [activeIncidents, pendingItems, store])

  useEffect(() => {
    setActiveRoute(activeRoute)
  }, [activeRoute, setActiveRoute])

  useEffect(() => {
    async function loadProducts() {
      setProducts(await productRepository.getAll())
    }

    void loadProducts()
  }, [])

  useEffect(() => {
    if (currentStore) {
      return
    }

    async function loadStore() {
      const loadedStore = await storeRepository.getById('store_01')
      setLoadedStore(loadedStore)
      setCurrentStore(loadedStore)
    }

    void loadStore()
  }, [currentStore, setCurrentStore])

  if (!store) {
    return <PageContainer className="page-placeholder"><LoadingState label="Preparando el plano de la tienda…" /></PageContainer>
  }

  const routeProducts = activeRoute?.orderedProductIds.map((productId) => (
    products.find((product) => product.id === productId)
  )).filter((product): product is Product => product !== undefined) ?? []
  const nextProduct = routeProducts[0]

  return <PageContainer className="route-summary-page">
    <p className="eyebrow">Paso 3 · Recorrido</p>
    <h1>Tu recorrido por la tienda</h1>
    <p className="route-summary-page__description">Hemos ordenado tu lista para que recorras la tienda de forma eficiente.</p>
    <StoreMap currentNodeId={store.entranceNodeId} incidents={activeIncidents} route={activeRoute} store={store} />
    {activeRoute ? <>
      <dl className="route-summary-page__metrics">
        <div><dt>Productos</dt><dd>{routeProducts.length}</dd></div>
        <div><dt>Tiempo estimado</dt><dd>{Math.ceil(activeRoute.estimatedTime)} min</dd></div>
        <div><dt>Distancia</dt><dd>{Math.round(activeRoute.estimatedDistance)} m</dd></div>
      </dl>
      <section className="route-summary-page__details" aria-label="Detalle de la ruta">
        <p className="route-summary-page__next-label">Primera parada</p>
        <h2>{nextProduct?.name ?? 'Productos de tu lista'}</h2>
        <ol className="route-summary-page__products">
          {routeProducts.map((product) => <li key={product.id}>{product.name}</li>)}
        </ol>
      </section>
      <Button fullWidth onClick={() => navigate('/navigation')}>Comenzar navegación</Button>
    </> : <section className="empty-list">
      <p>No hemos podido crear una ruta con la lista actual.</p>
      <Button onClick={() => navigate('/list')}>Volver a la lista</Button>
    </section>}
  </PageContainer>
}
