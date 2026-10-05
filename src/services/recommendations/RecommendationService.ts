import type { Product, ProductRecommendation } from '../../types'
import type { RecommendationProvider } from './RecommendationProvider'

export interface RecommendationService {
  getRecommendations(products: Product[]): Promise<ProductRecommendation[]>
}

export class DefaultRecommendationService implements RecommendationService {
  private readonly localProvider: RecommendationProvider

  public constructor(localProvider: RecommendationProvider) {
    this.localProvider = localProvider
  }

  async getRecommendations(products: Product[]): Promise<ProductRecommendation[]> {
    return this.localProvider.getRecommendations(products)
  }
}
