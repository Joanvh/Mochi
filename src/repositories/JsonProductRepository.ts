import productsData from '../data/products.json'
import type { ID, Product } from '../types'
import type { ProductRepository } from './ProductRepository'

export class JsonProductRepository implements ProductRepository {
  private readonly products: Product[] = productsData

  async getAll(): Promise<Product[]> {
    return this.products.filter((product) => product.active)
  }

  async getById(id: ID): Promise<Product | null> {
    return this.products.find((product) => product.id === id && product.active) ?? null
  }
}
