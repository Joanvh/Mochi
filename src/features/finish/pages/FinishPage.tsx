import { Link } from 'react-router-dom'
import { PageContainer } from '../../../components/common/PageContainer'
import { useAppStore } from '../../../store/useAppStore'

export function FinishPage() {
  const activeIncidents = useAppStore((state) => state.activeIncidents)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const items = useAppStore((state) => state.draftShoppingList)

  return <PageContainer className="finish-page">
    <p className="eyebrow">Compra finalizada</p>
    <div className="finish-page__success" aria-hidden="true">✓</div>
    <h1>Todo listo para hoy</h1>
    <p className="finish-page__description">Gracias por utilizar Mercadona Sync. Este es el resumen visual de tu compra.</p>
    <dl className="finish-page__metrics">
      <div><dt>Productos</dt><dd>{items.length}</dd></div>
      <div><dt>Tiempo estimado</dt><dd>{activeRoute ? `${Math.ceil(activeRoute.estimatedTime)} min` : '—'}</dd></div>
      <div><dt>Incidencias visibles</dt><dd>{activeIncidents.length}</dd></div>
    </dl>
    <Link className="button button--primary button--full-width" to="/">Volver al inicio</Link>
  </PageContainer>
}
