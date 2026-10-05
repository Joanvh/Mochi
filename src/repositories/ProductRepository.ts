import type { ID, Product } from '../types'

export interface ProductRepository {
  getAll(): Promise<Product[]>
  getById(id: ID): Promise<Product | null>
}
