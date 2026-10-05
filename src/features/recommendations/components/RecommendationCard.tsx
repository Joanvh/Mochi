import { Button } from '../../../components/common/Button'
import type { Product, ProductRecommendation } from '../../../types'

interface RecommendationCardProps {
  product: Product
  recommendation: ProductRecommendation
  onAccept: () => void
  onReject: () => void
}

export function RecommendationCard({ product, recommendation, onAccept, onReject }: RecommendationCardProps) {
  return <article className="recommendation-card">
    <div>
      <p className="recommendation-card__eyebrow">Sugerencia opcional</p><h2>{product.name}</h2>
      {recommendation.reason && <p>{recommendation.reason}</p>}
    </div>
    <div className="recommendation-card__actions">
      <Button onClick={onAccept}>Añadir</Button><Button variant="secondary" onClick={onReject}>Ahora no</Button>
    </div>
  </article>
}
