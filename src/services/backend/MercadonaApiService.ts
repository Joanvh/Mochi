import { apiClient } from '../../apiService'
import type { Incident, IncidentType, Product, ProductMatch, ProductRecommendation, Route, Store, StoreZoneType } from '../../types'

interface BackendStoreSummary {
  store_id: string
  nombre: string
}

interface BackendSection {
  id: number
  tipo: string
  nombre: string
  rect: [number, number, number, number]
}

interface BackendPlacement {
  product_id: string
  cell: [number, number]
  section: number
  disponible: boolean
}

interface BackendStore {
  store_id: string
  nombre: string
  cell_size_m: number
  default_entrance: number
  grid: string[]
  sections: BackendSection[]
  placements: BackendPlacement[]
}

interface BackendRoute {
  path: [number, number][]
  ordered_stops: Array<{ product_id: string }>
  meters: number
  steps: number
  sections: number[]
}

interface BackendUser {
  id: string
  email: string
  nombre: string
  perfil_dietetico: string[]
  lista_compra: string[]
}

interface CategoryResponse {
  categorias_sugeridas: string[]
}

interface RecommendationsResponse {
  recomendaciones: string[]
}

interface BackendProductMatch {
  product: Product
  match: ProductMatch
}

interface BackendRecommendation {
  product: Product
  recommendation: ProductRecommendation
}

const CELL_SIZE = 40
const stores = new Map<string, BackendStore>()

function cellId([x, y]: [number, number]): string {
  return `cell_${x}_${y}`
}

function parseCellId(id: string): [number, number] | null {
  const match = /^cell_(\d+)_(\d+)$/.exec(id)
  return match ? [Number(match[1]), Number(match[2])] : null
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-ES')
}

function zoneType(type: string): StoreZoneType {
  if (type === 'entrada') return 'ENTRANCE'
  if (type === 'cajas') return 'CHECKOUT'
  return 'SECTION'
}

function walkableCell(store: BackendStore, cell: [number, number]): [number, number] {
  const [originX, originY] = cell
  const isWalkable = (x: number, y: number) => store.grid[y]?.[x] && store.grid[y][x] !== '#'

  if (isWalkable(originX, originY)) return cell

  for (let radius = 1; radius < Math.max(store.grid.length, store.grid[0]?.length ?? 0); radius += 1) {
    for (let y = originY - radius; y <= originY + radius; y += 1) {
      for (let x = originX - radius; x <= originX + radius; x += 1) {
        if (isWalkable(x, y)) return [x, y]
      }
    }
  }

  return cell
}

function representativeCell(store: BackendStore, section: BackendSection): [number, number] {
  const [x1, y1, x2, y2] = section.rect
  return walkableCell(store, [Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2)])
}

function storeToFrontend(store: BackendStore): Store {
  const nodes = store.grid.flatMap((row, y) => [...row].flatMap((cell, x) => (
    cell === '#' ? [] : [{ id: cellId([x, y]), x: x * CELL_SIZE + CELL_SIZE / 2, y: y * CELL_SIZE + CELL_SIZE / 2, type: 'INTERSECTION' as const }]
  )))
  const nodeIds = new Set(nodes.map((node) => node.id))
  const edges = nodes.flatMap((node) => {
    const cell = parseCellId(node.id)
    if (!cell) return []
    const [x, y] = cell
    return ([[x + 1, y], [x, y + 1]] as [number, number][])
      .filter((target) => nodeIds.has(cellId(target)))
      .map((target) => ({
        id: `edge_${node.id}_${cellId(target)}`,
        from: node.id,
        to: cellId(target),
        distance: store.cell_size_m,
        baseTime: 1,
        bidirectional: true,
        enabled: true,
      }))
  })
  const zones = store.sections.map((section) => {
    const [x1, y1, x2, y2] = section.rect
    return {
      id: `section_${section.id}`,
      name: section.nombre,
      type: zoneType(section.tipo),
      x: x1 * CELL_SIZE,
      y: y1 * CELL_SIZE,
      width: (x2 - x1 + 1) * CELL_SIZE,
      height: (y2 - y1 + 1) * CELL_SIZE,
    }
  })
  const entrance = store.sections.find((section) => section.id === store.default_entrance)
  const entranceNodeId = cellId(entrance ? representativeCell(store, entrance) : [0, 0])

  return {
    id: store.store_id,
    name: store.nombre,
    displayName: store.nombre,
    entranceNodeId,
    layout: {
      width: Math.max(...store.grid.map((row) => row.length)) * CELL_SIZE,
      height: store.grid.length * CELL_SIZE,
      zones,
      shelves: store.placements.map((placement) => ({
        id: `shelf_${placement.product_id}`,
        zoneId: `section_${placement.section}`,
        label: `Producto ${placement.product_id}`,
        x: placement.cell[0] * CELL_SIZE + 8,
        y: placement.cell[1] * CELL_SIZE + 8,
        width: CELL_SIZE - 16,
        height: CELL_SIZE - 16,
        orientation: 'HORIZONTAL' as const,
      })),
      walls: [],
    },
    graph: { nodes, edges },
    productLocations: store.placements.filter((placement) => placement.disponible).map((placement) => ({
      productId: placement.product_id,
      storeId: store.store_id,
      nodeId: cellId(walkableCell(store, placement.cell)),
      shelfId: `shelf_${placement.product_id}`,
      zoneId: `section_${placement.section}`,
      displayLabel: store.sections.find((section) => section.id === placement.section)?.nombre,
    })),
    checkouts: store.sections.filter((section) => section.tipo === 'cajas').map((section) => ({
      id: `checkout_${section.id}`,
      name: section.nombre,
      nodeId: cellId(representativeCell(store, section)),
      status: 'OPEN' as const,
      queueMinutes: 1,
    })),
  }
}

function resolveSection(store: BackendStore, category: string): BackendSection | null {
  const target = normalize(category)
  return store.sections.find((section) => section.tipo === 'producto' && (
    normalize(section.nombre).includes(target) || target.includes(normalize(section.nombre))
  )) ?? null
}

function frontendProduct(rawText: string, placement: BackendPlacement, section: BackendSection): Product {
  return {
    id: placement.product_id,
    name: rawText,
    categoryId: String(section.id),
    keywords: [rawText, section.nombre],
    active: placement.disponible,
    description: section.nombre,
  }
}

async function rawStore(storeId: string): Promise<BackendStore> {
  const cached = stores.get(storeId)
  if (cached) return cached
  const store = await apiClient.get<BackendStore>(`/api/v1/routing/stores/${storeId}`)
  stores.set(storeId, store)
  return store
}

export const mercadonaApi = {
  async login(email: string, password: string): Promise<BackendUser> {
    return apiClient.post<BackendUser>('/api/v1/routing/login', { email, password })
  },

  async loadPrimaryStore(): Promise<Store> {
    const availableStores = await apiClient.get<BackendStoreSummary[]>('/api/v1/routing/stores')
    if (availableStores.length === 0) throw new Error('La API no ha devuelto ninguna tienda disponible.')
    const store = await rawStore(availableStores[0].store_id)
    return storeToFrontend(store)
  },

  async matchProducts(query: string, storeId: string): Promise<BackendProductMatch[]> {
    const [store, classification] = await Promise.all([
      rawStore(storeId),
      apiClient.post<CategoryResponse>('/api/v1/product-matching/clasificar', { texto_busqueda: query }),
    ])
    const seenProducts = new Set<string>()

    return classification.categorias_sugeridas.flatMap((category, index) => {
      const section = resolveSection(store, category)
      const placement = section && store.placements.find((candidate) => candidate.section === section.id && candidate.disponible)
      if (!section || !placement || seenProducts.has(placement.product_id)) return []
      seenProducts.add(placement.product_id)
      return [{
        product: frontendProduct(query, placement, section),
        match: { productId: placement.product_id, score: Math.max(0.5, 1 - index * 0.15), matchedBy: ['CATEGORY'] },
      }]
    })
  },

  async getRecommendations(products: string[], storeId: string): Promise<BackendRecommendation[]> {
    const response = await apiClient.post<RecommendationsResponse>('/api/v1/recommendations/', { lista_compra: products })
    const resolved = await Promise.all(response.recomendaciones.map(async (name, index): Promise<BackendRecommendation | null> => {
      const matches = await mercadonaApi.matchProducts(name, storeId)
      const first = matches[0]
      if (!first) return null
      const recommendation: ProductRecommendation = {
        id: `ai_${first.product.id}_${index}`,
        productId: first.product.id,
        reason: 'Sugerencia personalizada por tu lista actual.',
        source: 'AI',
        status: 'PENDING',
      }
      return {
        product: first.product,
        recommendation,
      }
    }))
    return resolved.filter((item): item is BackendRecommendation => item !== null)
  },

  async calculateRoute(store: Store, productIds: string[], currentNodeId: string, reason: Route['reason']): Promise<Route | null> {
    const raw = await rawStore(store.id)
    const currentCell = parseCellId(currentNodeId)
    const startSection = currentCell ? raw.sections.find((section) => {
      const [x1, y1, x2, y2] = section.rect
      return currentCell[0] >= x1 && currentCell[0] <= x2 && currentCell[1] >= y1 && currentCell[1] <= y2
    })?.id : undefined
    const route = await apiClient.get<BackendRoute>('/api/v1/routing/route', {
      params: {
        store_id: store.id,
        products: productIds.join(','),
        ...(startSection ? { start_section: String(startSection) } : {}),
      },
    })
    const checkoutSection = route.sections.find((section) => raw.sections.find((candidate) => candidate.id === section)?.tipo === 'cajas')
    return {
      id: `route_${Date.now()}`,
      nodePath: route.path.map(cellId),
      orderedProductIds: route.ordered_stops.map((stop) => stop.product_id),
      estimatedTime: Math.max(1, Math.ceil(route.steps / 25)),
      estimatedDistance: route.meters,
      checkoutId: checkoutSection ? `checkout_${checkoutSection}` : undefined,
      generatedAt: new Date().toISOString(),
      reason,
    }
  },

  async reportIncident(store: Store, incident: Pick<Incident, 'type' | 'targetId' | 'targetType'>): Promise<Incident> {
    const sectionId = incident.targetId.match(/(?:section_|checkout_)(\d+)/)?.[1]
    const cell = parseCellId(incident.targetId)
    const type = incident.type === 'BLOCKED_AISLE' || incident.type === 'SPILL' ? 'block' : 'jam'
    await apiClient.post(`/api/v1/routing/stores/${store.id}/incidents`, {
      type,
      ...(sectionId ? { section: Number(sectionId) } : {}),
      ...(!sectionId && cell ? { cell } : {}),
      ...(type === 'jam' ? { cost: 20 } : {}),
    })
    return {
      id: `incident_${Date.now()}`,
      type: incident.type as IncidentType,
      targetType: incident.targetType,
      targetId: incident.targetId,
      severity: type === 'block' ? 'HIGH' : 'MEDIUM',
      source: 'USER',
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
    }
  },
}

export type { BackendProductMatch, BackendRecommendation, BackendUser }
