import type { Product, ProductMatch, ProductMatchReason } from '../../types'
import type { ProductRepository } from '../../repositories/ProductRepository'
import { normalizeText } from './normalizeText'

export class ProductMatchingService {
  private readonly productRepository: ProductRepository

  public constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async match(query: string): Promise<ProductMatch[]> {
    const normalizedQuery = normalizeText(query)

    if (!normalizedQuery) {
      return []
    }

    const products = await this.productRepository.getAll()

    return products
      .map((product) => this.scoreProduct(product, normalizedQuery))
      .filter((match): match is ProductMatch => match !== null)
      .sort((first, second) => second.score - first.score || first.productId.localeCompare(second.productId))
  }

  private scoreProduct(product: Product, query: string): ProductMatch | null {
    const name = normalizeText(product.name)
    const keywords = product.keywords.map(normalizeText)
    const matchedBy: ProductMatchReason[] = []
    let score = 0

    if (name === query) {
      matchedBy.push('EXACT_NAME')
      score = 1
    } else if (keywords.includes(query)) {
      matchedBy.push('KEYWORD')
      score = 0.95
    } else if (name.includes(query)) {
      matchedBy.push('PARTIAL_NAME')
      score = 0.8
    } else if (keywords.some((keyword) => keyword.includes(query))) {
      matchedBy.push('KEYWORD')
      score = 0.7
    }

    return score > 0 ? { productId: product.id, score, matchedBy } : null
  }
}
