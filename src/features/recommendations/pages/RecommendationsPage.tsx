import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { mercadonaApi, type BackendRecommendation } from '../../../services/backend/MercadonaApiService'
import { useAppStore } from '../../../store/useAppStore'
import { RecommendationCard } from '../components/RecommendationCard'

export function RecommendationsPage() {
  const navigate = useNavigate()
  const items = useAppStore((state) => state.draftShoppingList)
  const addItem = useAppStore((state) => state.addDraftShoppingListItem)
  const currentStore = useAppStore((state) => state.currentStore)
  const setCurrentStore = useAppStore((state) => state.setCurrentStore)
  const [recommendations, setRecommendations] = useState<BackendRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(items.length > 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecommendations() {
      if (items.length === 0) {
        return
      }

      try {
        setError(null)
        const store = currentStore ?? await mercadonaApi.loadPrimaryStore()
        if (!currentStore) setCurrentStore(store)
        const nextRecommendations = await mercadonaApi.getRecommendations(items.map((item) => item.rawText), store.id)
        setRecommendations(nextRecommendations)
      } catch {
        setError('No se han podido generar recomendaciones con el servicio de IA.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRecommendations()
  }, [currentStore, items, setCurrentStore])

  function acceptRecommendation(entry: BackendRecommendation) {
    addItem({
      id: `recommendation_item_${entry.product.id}`,
      rawText: entry.product.name,
      productId: entry.product.id,
      quantity: 1,
      source: 'RECOMMENDATION',
      status: 'PENDING',
    })
    setRecommendations((currentRecommendations) => currentRecommendations.filter((item) => item.recommendation.id !== entry.recommendation.id))
  }

  function rejectRecommendation(recommendationId: string) {
    setRecommendations((currentRecommendations) => currentRecommendations.filter((item) => item.recommendation.id !== recommendationId))
  }

  if (items.length === 0) {
    return <PageContainer className="page-placeholder">
      <p className="eyebrow">Paso 2 · Recomendaciones</p><h1>Primero confirma tu lista</h1>
      <p className="page-placeholder__description">Necesitamos una lista de productos para ofrecerte sugerencias relevantes.</p>
      <Link className="button button--primary" to="/list">Ir a la lista</Link>
    </PageContainer>
  }

  return <PageContainer className="recommendations-page">
    <p className="eyebrow">Paso 2 · Recomendaciones</p><h1>¿Te apetece añadir algo más?</h1>
    <p className="recommendations-page__description">Son solo sugerencias: puedes aceptarlas, rechazarlas o continuar sin cambios.</p>
    {isLoading ? <LoadingState label="Buscando sugerencias…" /> : recommendations.map((entry) => (
      <RecommendationCard key={entry.recommendation.id} product={entry.product} recommendation={entry.recommendation} onAccept={() => acceptRecommendation(entry)} onReject={() => rejectRecommendation(entry.recommendation.id)} />
    ))}
    {!isLoading && error && <p className="empty-list">{error} Puedes continuar con tu lista.</p>}
    {!isLoading && !error && recommendations.length === 0 && <p className="empty-list">No tenemos sugerencias para esta lista. Puedes continuar cuando quieras.</p>}
    <Button fullWidth onClick={() => navigate('/route')}>Continuar con mi lista</Button>
  </PageContainer>
}
