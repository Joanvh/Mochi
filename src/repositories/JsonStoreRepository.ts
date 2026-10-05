import storeData from '../data/store_01.json'
import type { ID, Store } from '../types'
import type { StoreRepository } from './StoreRepository'

export class JsonStoreRepository implements StoreRepository {
  private readonly stores: Store[] = [storeData as Store]

  async getAll(): Promise<Store[]> {
    return this.stores
  }

  async getById(id: ID): Promise<Store | null> {
    return this.stores.find((store) => store.id === id) ?? null
  }
}
