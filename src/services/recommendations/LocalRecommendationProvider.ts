import rules from '../../data/recommendation-rules.json'
import type { Product, ProductRecommendation, RecommendationRule } from '../../types'
import type { ProductRepository } from '../../repositories/ProductRepository'
import type { RecommendationProvider } from './RecommendationProvider'

const MAX_RECOMMENDATIONS = 3

export class LocalRecommendationProvider implements RecommendationProvider {
  private readonly productRepository: ProductRepository

  public constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async getRecommendations(products: Product[]): Promise<ProductRecommendation[]> {
    const selectedProductIds = new Set(products.map((product) => product.id))
    const selectedCategoryIds = new Set(products.map((product) => product.categoryId))
    const matchingRules = (rules as RecommendationRule[]).filter((rule) => this.matchesRule(rule, selectedProductIds, selectedCategoryIds))
    const recommendations: ProductRecommendation[] = []

    for (const rule of matchingRules) {
      for (const productId of rule.recommendedProductIds) {
        if (selectedProductIds.has(productId) || recommendations.some((recommendation) => recommendation.productId === productId)) {
          continue
        }

        const product = await this.productRepository.getById(productId)
        if (product) {
          recommendations.push({ id: `recommendation_local_${product.id}`, productId: product.id, reason: rule.reason, source: 'LOCAL', status: 'PENDING' })
        }
      }
    }

    return recommendations.slice(0, MAX_RECOMMENDATIONS)
  }

  private matchesRule(rule: RecommendationRule, productIds: Set<string>, categoryIds: Set<string>): boolean {
    const productRuleMatches = rule.triggerProductIds?.every((id) => productIds.has(id)) ?? true
    const categoryRuleMatches = rule.triggerCategoryIds?.every((id) => categoryIds.has(id)) ?? true
    return productRuleMatches && categoryRuleMatches
  }
}
