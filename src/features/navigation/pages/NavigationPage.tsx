import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { useAppStore } from '../../../store/useAppStore'

export function NavigationPage() {
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const currentStore = useAppStore((state) => state.currentStore)
  const items = useAppStore((state) => state.draftShoppingList)

  if (!currentStore || !activeRoute) {
    return <PageContainer className="page-placeholder">
      <p className="eyebrow">Paso 4 · Navegación</p>
      <h1>Prepara primero tu recorrido</h1>
      <p className="page-placeholder__description">Necesitamos una ruta activa antes de poder guiarte por la tienda.</p>
      <Link className="button button--primary" to="/route">Ver mi ruta</Link>
    </PageContainer>
  }

  const nextProductId = activeRoute.orderedProductIds[0]
  const nextItem = items.find((item) => item.productId === nextProductId)
  const totalProducts = activeRoute.orderedProductIds.length

  return <PageContainer className="navigation-page">
    <p className="eyebrow">Paso 4 · Navegación</p>
    <h1>Tu recorrido en la tienda</h1>
    <StoreMap
      currentNodeId={currentStore.entranceNodeId}
      incidents={activeIncidents}
      route={activeRoute}
      store={currentStore}
      targetProductId={nextProductId}
    />
    <section className="navigation-page__next" aria-label="Siguiente producto">
      <p className="navigation-page__label">Siguiente producto</p>
      <h2>{nextItem?.rawText ?? 'Sigue la ruta marcada'}</h2>
      <p>Dirígete al marcador verde del plano.</p>
      <Button disabled fullWidth>Marcar como recogido</Button>
    </section>
    <section className="navigation-page__progress" aria-label="Progreso de compra">
      <span>Progreso</span>
      <strong>0 de {totalProducts} productos</strong>
      <div aria-hidden="true"><span style={{ width: '0%' }} /></div>
    </section>
    <Button disabled fullWidth variant="secondary">Reportar incidencia</Button>
    <p className="navigation-page__note">Los controles de recogida y reporte se activarán al conectar la lógica de navegación.</p>
  </PageContainer>
}
