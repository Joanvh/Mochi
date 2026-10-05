import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageContainer } from '../../../components/common/PageContainer'
import { JsonProductRepository } from '../../../repositories/JsonProductRepository'
import { LocalRecommendationProvider } from '../../../services/recommendations/LocalRecommendationProvider'
import { DefaultRecommendationService } from '../../../services/recommendations/RecommendationService'
import { useAppStore } from '../../../store/useAppStore'
import type { Product, ProductRecommendation } from '../../../types'
import { RecommendationCard } from '../components/RecommendationCard'

const productRepository = new JsonProductRepository()
const recommendationService = new DefaultRecommendationService(new LocalRecommendationProvider(productRepository))

export function RecommendationsPage() {
  const navigate = useNavigate()
  const items = useAppStore((state) => state.draftShoppingList)
  const addItem = useAppStore((state) => state.addDraftShoppingListItem)
  const [products, setProducts] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(items.length > 0)

  useEffect(() => {
    async function loadRecommendations() {
      if (items.length === 0) {
        return
      }

      const listProducts = (await Promise.all(items.map((item) => (
        item.productId ? productRepository.getById(item.productId) : null
      )))).filter((product): product is Product => product !== null)
      const nextRecommendations = await recommendationService.getRecommendations(listProducts)
      const recommendationProducts = (await Promise.all(nextRecommendations.map((recommendation) => (
        productRepository.getById(recommendation.productId)
      )))).filter((product): product is Product => product !== null)

      setProducts(recommendationProducts)
      setRecommendations(nextRecommendations)
      setIsLoading(false)
    }

    void loadRecommendations()
  }, [items])

  function acceptRecommendation(recommendation: ProductRecommendation) {
    addItem({
      id: `recommendation_item_${recommendation.productId}`,
      rawText: recommendation.productId,
      productId: recommendation.productId,
      quantity: 1,
      source: 'RECOMMENDATION',
      status: 'PENDING',
    })
    setRecommendations((currentRecommendations) => currentRecommendations.filter((item) => item.id !== recommendation.id))
  }

  function rejectRecommendation(recommendationId: string) {
    setRecommendations((currentRecommendations) => currentRecommendations.filter((item) => item.id !== recommendationId))
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
    {isLoading ? <LoadingState label="Buscando sugerencias…" /> : recommendations.map((recommendation) => {
      const product = products.find((candidate) => candidate.id === recommendation.productId)
      return product ? <RecommendationCard key={recommendation.id} product={product} recommendation={recommendation} onAccept={() => acceptRecommendation(recommendation)} onReject={() => rejectRecommendation(recommendation.id)} /> : null
    })}
    {!isLoading && recommendations.length === 0 && <p className="empty-list">No tenemos sugerencias para esta lista. Puedes continuar cuando quieras.</p>}
    <Button fullWidth onClick={() => navigate('/route')}>Continuar con mi lista</Button>
  </PageContainer>
}
