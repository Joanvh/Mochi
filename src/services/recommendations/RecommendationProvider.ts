import type { Product, ProductRecommendation } from '../../types'

export interface RecommendationProvider {
  getRecommendations(products: Product[]): Promise<ProductRecommendation[]>
}
