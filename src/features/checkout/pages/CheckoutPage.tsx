import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { PageContainer } from '../../../components/common/PageContainer'
import { StoreMap } from '../../../components/map/StoreMap'
import { useAppStore } from '../../../store/useAppStore'

export function CheckoutPage() {
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const currentStore = useAppStore((state) => state.currentStore)

  if (!currentStore || !activeRoute?.checkoutId) {
    return <PageContainer className="page-placeholder">
      <p className="eyebrow">Paso 5 · Caja</p>
      <h1>Primero prepara tu recorrido</h1>
      <p className="page-placeholder__description">Necesitamos una ruta activa para recomendarte la mejor caja.</p>
      <Link className="button button--primary" to="/route">Ver mi ruta</Link>
    </PageContainer>
  }

  const checkout = currentStore.checkouts.find((candidate) => candidate.id === activeRoute.checkoutId)

  return <PageContainer className="checkout-page">
    <p className="eyebrow">Paso 5 · Caja</p>
    <h1>La mejor caja para ti</h1>
    <p className="checkout-page__description">Hemos tenido en cuenta el recorrido y el tiempo de espera.</p>
    <StoreMap currentNodeId={currentStore.entranceNodeId} incidents={activeIncidents} route={activeRoute} store={currentStore} />
    <section className="checkout-page__card" aria-label="Caja recomendada">
      <p>Te recomendamos</p>
      <h2>{checkout?.name ?? 'Caja recomendada'}</h2>
      <dl>
        <div><dt>Estado</dt><dd>{checkout?.status === 'OPEN' ? 'Abierta' : 'Cerrada'}</dd></div>
        <div><dt>Cola estimada</dt><dd>{checkout?.queueMinutes ?? 0} min</dd></div>
      </dl>
    </section>
    <Button disabled fullWidth>Finalizar compra</Button>
    <p className="checkout-page__note">La confirmación de compra se activará al conectar el flujo de navegación.</p>
  </PageContainer>
}
