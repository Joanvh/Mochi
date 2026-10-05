import { useEffect, useState } from 'react'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { JsonStoreRepository } from '../../../repositories/JsonStoreRepository'
import { useAppStore } from '../../../store/useAppStore'
import type { Store } from '../../../types'

const storeRepository = new JsonStoreRepository()

export function RouteSummaryPage() {
  const currentStore = useAppStore((state) => state.currentStore)
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const [loadedStore, setLoadedStore] = useState<Store | null>(null)
  const store = currentStore ?? loadedStore

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
