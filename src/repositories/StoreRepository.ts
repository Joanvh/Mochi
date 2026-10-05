import type { ID, Store } from '../types'

export interface StoreRepository {
  getAll(): Promise<Store[]>
  getById(id: ID): Promise<Store | null>
}
