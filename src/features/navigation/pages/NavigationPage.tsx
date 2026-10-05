import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { ReportButton } from '../../reports/components/ReportButton'
import { ReportModal } from '../../reports/components/ReportModal'
import { mercadonaApi } from '../../../services/backend/MercadonaApiService'
import { useAppStore } from '../../../store/useAppStore'

export function NavigationPage() {
  const navigate = useNavigate()
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const currentStore = useAppStore((state) => state.currentStore)
  const items = useAppStore((state) => state.draftShoppingList)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const setActiveRoute = useAppStore((state) => state.setActiveRoute)
  const setActiveIncidents = useAppStore((state) => state.setActiveIncidents)
  const updateDraftShoppingListItem = useAppStore((state) => state.updateDraftShoppingListItem)

  const [userNodeId, setUserNodeId] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [showItemList, setShowItemList] = useState(false)
  const [isLoadingStore, setIsLoadingStore] = useState(false)

  const currentNodeId = userNodeId ?? currentStore?.entranceNodeId ?? 'node_entrance'

  // Ensure store is loaded if navigated to directly
  useEffect(() => {
    if (currentStore) {
      return
    }

    async function loadStore() {
      setIsLoadingStore(true)
      try {
        setCurrentStore(await mercadonaApi.loadPrimaryStore())
      } finally {
        setIsLoadingStore(false)
      }
    }

    void loadStore()
  }, [currentStore, setCurrentStore])

  // Auto-calculate initial route if store is present but no active route
  useEffect(() => {
    if (!currentStore || activeRoute) return
    const productIds = items.filter((item) => item.status === 'PENDING' && item.productId).map((item) => item.productId as string)
    if (productIds.length === 0) return

    void mercadonaApi.calculateRoute(currentStore, productIds, currentStore.entranceNodeId, 'INITIAL')
      .then(setActiveRoute)
      .catch(() => setActiveRoute(null))
  }, [activeRoute, currentStore, items, setActiveRoute])

  if (isLoadingStore || (!currentStore && items.length > 0)) {
    return (
      <PageContainer className="page-placeholder">
        <LoadingState label="Iniciando navegador de tienda…" />
      </PageContainer>
    )
  }

  if (!currentStore || !activeRoute) {
    return (
      <PageContainer className="page-placeholder">
        <p className="eyebrow">Paso 4 · Navegación</p>
        <h1>Prepara primero tu recorrido</h1>
        <p className="page-placeholder__description">
          Necesitamos una ruta activa antes de poder guiarte por la tienda.
        </p>
        <Link className="button button--primary" to="/route">
          Ver mi ruta
        </Link>
      </PageContainer>
    )
  }

  // Pending items in shopping list
  const pendingItems = items.filter((item) => item.status === 'PENDING' && item.productId)
  const totalActionableItems = items.filter((item) => item.productId).length
  const collectedItemsCount = items.filter((item) => item.status === 'COLLECTED').length
  const progressPercent = totalActionableItems > 0
    ? Math.round((collectedItemsCount / totalActionableItems) * 100)
    : 100

  // Identify next product in the optimal route that is still pending
  const targetProductId = activeRoute.orderedProductIds.find((id) => (
    pendingItems.some((item) => item.productId === id)
  ))

  const targetItem = items.find((item) => item.productId === targetProductId)
  const targetLocation = currentStore.productLocations.find((loc) => loc.productId === targetProductId)
  const targetZone = currentStore.layout.zones.find((z) => z.id === targetLocation?.zoneId)
  const targetShelf = currentStore.layout.shelves.find((s) => s.id === targetLocation?.shelfId)

  // Assigned Checkout
  const assignedCheckout = currentStore.checkouts.find((c) => c.id === activeRoute.checkoutId)
  const allProductsCollected = pendingItems.length === 0 && totalActionableItems > 0

  // Action: Mark product as collected
  const handleCollectProduct = () => {
    if (!targetItem || !targetProductId) return

    updateDraftShoppingListItem(targetItem.id, { status: 'COLLECTED' })

    const nextNodeId = targetLocation?.nodeId ?? currentNodeId
    setUserNodeId(nextNodeId)

    const remainingPending = pendingItems.filter((i) => i.id !== targetItem.id)
    const remainingIds = remainingPending.map((item) => item.productId as string)
    void mercadonaApi.calculateRoute(currentStore, remainingIds, nextNodeId, 'PRODUCT_COLLECTED').then(setActiveRoute).catch(() => setActiveRoute(null))
  }

  // Action: Skip product (mark unavailable)
  const handleSkipProduct = () => {
    if (!targetItem || !targetProductId) return

    updateDraftShoppingListItem(targetItem.id, { status: 'UNAVAILABLE' })

    const remainingPending = pendingItems.filter((i) => i.id !== targetItem.id)
    const remainingIds = remainingPending.map((item) => item.productId as string)
    void mercadonaApi.calculateRoute(currentStore, remainingIds, currentNodeId, 'PRODUCT_UNAVAILABLE').then(setActiveRoute).catch(() => setActiveRoute(null))
  }

  return (
    <PageContainer className="navigation-page">
      <header className="navigation-page__header">
        <p className="eyebrow">Paso 4 · Navegación en tienda</p>
        <h1>
          {allProductsCollected ? '¡Recorrido completado!' : 'Tu recorrido en la tienda'}
        </h1>
      </header>

      {/* Responsive interactive floor plan */}
      <StoreMap
        currentNodeId={currentNodeId || currentStore.entranceNodeId}
        incidents={activeIncidents}
        route={activeRoute}
        store={currentStore}
        targetProductId={targetProductId}
      />

      {/* Next destination guidance card */}
      <section className="navigation-page__next" aria-label="Siguiente parada del recorrido">
        {allProductsCollected ? (
          <div className="navigation-page__complete-state">
            <p className="navigation-page__label">Destino final</p>
            <h2>{assignedCheckout?.name ?? 'Caja asignada'}</h2>
            <p className="navigation-page__desc">
              Has recogido todos los productos de tu lista. Dirígete a la caja recomendada para abonar tu compra.
            </p>
            <div className="navigation-page__checkout-badge">
              <span>Tiempo de espera estimado: <strong>{assignedCheckout?.queueMinutes ?? 1} min</strong></span>
            </div>
            <Button fullWidth onClick={() => navigate('/checkout')}>
              Ir a pagar a caja →
            </Button>
          </div>
        ) : (
          <div className="navigation-page__target-state">
            <div className="navigation-page__target-header">
              <span className="navigation-page__label">Siguiente producto</span>
              {targetZone && (
                <span className="navigation-page__zone-tag">
                  {targetZone.name}
                </span>
              )}
            </div>

            <h2>{targetItem?.rawText ?? `Producto ${targetProductId ?? ''}`}</h2>

            <div className="navigation-page__location-detail">
              <span className="navigation-page__loc-icon">📍</span>
              <div>
                <strong>{targetZone?.name ?? 'En tienda'}</strong>
                {targetShelf?.label && <span> · {targetShelf.label}</span>}
              </div>
            </div>

            <div className="navigation-page__actions">
              <Button fullWidth onClick={handleCollectProduct}>
                ✓ Marcar como recogido
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleSkipProduct}
                title="No encuentro el producto en la estantería"
              >
                Omitir / No encontrado
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Progress Section */}
      <section className="navigation-page__progress" aria-label="Progreso de compra">
        <div className="navigation-page__progress-header">
          <span>Progreso de compra</span>
          <strong>
            {collectedItemsCount} de {totalActionableItems} recogidos ({progressPercent}%)
          </strong>
        </div>
        <div className="navigation-page__progress-bar" aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      {/* Shopping List Drawer Toggle */}
      <section className="navigation-page__list-drawer">
        <button
          type="button"
          className="navigation-page__list-toggle"
          onClick={() => setShowItemList(!showItemList)}
          aria-expanded={showItemList}
        >
          <span>📋 Ver lista completa ({items.length} artículos)</span>
          <span>{showItemList ? '▲ Ocultar' : '▼ Ver'}</span>
        </button>

        {showItemList && (
          <ul className="navigation-page__items-list">
            {items.map((item) => {
              const isTarget = item.productId === targetProductId
              const isCollected = item.status === 'COLLECTED'
              const isUnavailable = item.status === 'UNAVAILABLE'

              return (
                <li
                  key={item.id}
                  className={`navigation-page__item ${isTarget ? 'navigation-page__item--current' : ''} ${isCollected ? 'navigation-page__item--collected' : ''}`}
                >
                  <span className="navigation-page__item-status">
                    {isCollected ? '✓' : isTarget ? '📍' : isUnavailable ? '✕' : '⚪'}
                  </span>
                  <span className="navigation-page__item-name">{item.rawText}</span>
                  <span className="navigation-page__item-badge">
                    {isCollected ? 'Recogido' : isTarget ? 'Siguiente' : isUnavailable ? 'Omitido' : 'Pendiente'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Incidents report button */}
      <ReportButton onClick={() => setIsReportModalOpen(true)} />

      {isReportModalOpen && (
        <ReportModal
          store={currentStore}
          onClose={() => setIsReportModalOpen(false)}
          onReported={(incident) => {
            setActiveIncidents([...activeIncidents, incident])
            const pendingIds = items.filter((item) => item.status === 'PENDING' && item.productId).map((item) => item.productId as string)
            void mercadonaApi.calculateRoute(currentStore, pendingIds, currentNodeId, 'INCIDENT').then(setActiveRoute).catch(() => setActiveRoute(null))
          }}
        />
      )}
    </PageContainer>
  )
}
