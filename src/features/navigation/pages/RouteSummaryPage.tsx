import { useEffect, useMemo, useState } from 'react'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { JsonStoreRepository } from '../../../repositories/JsonStoreRepository'
import { useAppStore } from '../../../store/useAppStore'
import { calculateRoute } from '../../../services/routing/RoutingEngine'
import type { Route, Store } from '../../../types'

const storeRepository = new JsonStoreRepository()

export function RouteSummaryPage() {
  const currentStore = useAppStore((state) => state.currentStore)
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const pendingItems = useAppStore((state) => state.draftShoppingList)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const setActiveRoute = useAppStore((state) => state.setActiveRoute)
  const [loadedStore, setLoadedStore] = useState<Store | null>(null)
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

  return <PageContainer className="route-summary-page">
    <p className="eyebrow">Paso 3 · Recorrido</p>
    <h1>Tu recorrido por la tienda</h1>
    <p className="route-summary-page__description">Consulta el plano antes de preparar tu ruta personalizada.</p>
    <StoreMap currentNodeId={store.entranceNodeId} incidents={activeIncidents} route={activeRoute} store={store} />
  </PageContainer>
}
