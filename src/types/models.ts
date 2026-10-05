export type ID = string
export type ISODateString = string

export interface Product {
  id: ID
  name: string
  categoryId: ID
  brand?: string
  description?: string
  keywords: string[]
  imageUrl?: string
  barcode?: string
  unitLabel?: string
  active: boolean
}

export interface ProductCategory {
  id: ID
  name: string
  keywords?: string[]
}

export interface Store {
  id: ID
  name: string
  displayName: string
  layout: StoreLayout
  graph: StoreGraph
  productLocations: ProductLocation[]
  checkouts: Checkout[]
  entranceNodeId: ID
}

export interface StoreLayout {
  width: number
  height: number
  zones: StoreZone[]
  shelves: Shelf[]
  walls?: Wall[]
}

export interface StoreZone {
  id: ID
  name: string
  type: StoreZoneType
  x: number
  y: number
  width: number
  height: number
}

export type StoreZoneType = 'ENTRANCE' | 'AISLE' | 'SECTION' | 'CHECKOUT' | 'SERVICE' | 'RESTRICTED'

export interface Shelf {
  id: ID
  zoneId?: ID
  label?: string
  x: number
  y: number
  width: number
  height: number
  orientation: 'HORIZONTAL' | 'VERTICAL'
}

export interface Wall {
  id: ID
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface StoreGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GraphNode {
  id: ID
  x: number
  y: number
  type: NodeType
  zoneId?: ID
  label?: string
}

export type NodeType = 'ENTRANCE' | 'INTERSECTION' | 'AISLE' | 'PRODUCT_ACCESS' | 'CHECKOUT' | 'EXIT'

export interface GraphEdge {
  id: ID
  from: ID
  to: ID
  distance: number
  baseTime: number
  bidirectional: boolean
  enabled: boolean
}

export interface ProductLocation {
  productId: ID
  storeId: ID
  nodeId: ID
  shelfId?: ID
  zoneId?: ID
  displayLabel?: string
}

export interface Checkout {
  id: ID
  name: string
  nodeId: ID
  status: CheckoutStatus
  queueMinutes: number
}

export type CheckoutStatus = 'OPEN' | 'CLOSED'

export interface DemoUser {
  id: ID
  name: string
  shoppingListId: ID
}

export interface ShoppingList {
  id: ID
  userId?: ID
  items: ShoppingListItem[]
}

export interface ShoppingListItem {
  id: ID
  rawText: string
  productId?: ID
  quantity: number
  status: ShoppingListItemStatus
  source: ShoppingListItemSource
}

export type ShoppingListItemStatus = 'UNRESOLVED' | 'PENDING' | 'COLLECTED' | 'UNAVAILABLE' | 'REMOVED'
export type ShoppingListItemSource = 'USER_PROFILE' | 'MANUAL' | 'OCR' | 'RECOMMENDATION'

export interface ProductMatch {
  productId: ID
  score: number
  matchedBy: ProductMatchReason[]
}

export type ProductMatchReason = 'EXACT_NAME' | 'PARTIAL_NAME' | 'KEYWORD' | 'CATEGORY'

export interface ProductRecommendation {
  id: ID
  productId: ID
  reason?: string
  source: RecommendationSource
  status: RecommendationStatus
}

export type RecommendationSource = 'AI' | 'LOCAL' | 'MOCK'
export type RecommendationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IGNORED'

export interface ShoppingSession {
  id: ID
  type: ShoppingSessionType
  userId?: ID
  storeId: ID
  status: ShoppingSessionStatus
  shoppingList: ShoppingListItem[]
  currentNodeId: ID
  activeRoute?: Route
  activeIncidentIds: ID[]
  selectedCheckoutId?: ID
  startedAt: ISODateString
  completedAt?: ISODateString
}

export type ShoppingSessionType = 'AUTHENTICATED' | 'GUEST'
export type ShoppingSessionStatus = 'INITIAL' | 'LIST_READY' | 'RECOMMENDATIONS' | 'READY_TO_NAVIGATE' | 'NAVIGATING' | 'CHECKOUT' | 'COMPLETED'

export interface Route {
  id: ID
  nodePath: ID[]
  orderedProductIds: ID[]
  estimatedTime: number
  estimatedDistance: number
  checkoutId?: ID
  generatedAt: ISODateString
  reason: RouteGenerationReason
}

export type RouteGenerationReason = 'INITIAL' | 'PRODUCT_COLLECTED' | 'INCIDENT' | 'PRODUCT_UNAVAILABLE' | 'CHECKOUT_CHANGE' | 'MANUAL'

export interface RouteInput {
  graph: StoreGraph
  currentNodeId: ID
  pendingProducts: ProductLocation[]
  incidents: Incident[]
  checkouts: Checkout[]
}

export interface RouteResult {
  nodePath: ID[]
  orderedProductIds: ID[]
  estimatedTime: number
  estimatedDistance: number
  checkoutId?: ID
}

export interface PathResult {
  nodePath: ID[]
  totalCost: number
  distance: number
  estimatedTime: number
}

export interface Incident {
  id: ID
  type: IncidentType
  targetType: IncidentTargetType
  targetId: ID
  severity: IncidentSeverity
  source: IncidentSource
  createdAt: ISODateString
  expiresAt?: ISODateString
  status: IncidentStatus
}

export type IncidentType = 'PRODUCT_OUT_OF_STOCK' | 'CONGESTION' | 'BLOCKED_AISLE' | 'SPILL' | 'RESTOCKING' | 'LONG_CHECKOUT_QUEUE'
export type IncidentTargetType = 'EDGE' | 'NODE' | 'PRODUCT' | 'CHECKOUT'
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type IncidentSource = 'USER' | 'DEMO' | 'SYSTEM'
export type IncidentStatus = 'ACTIVE' | 'EXPIRED' | 'RESOLVED'

export interface IncidentEffect {
  blocksTraversal: boolean
  costMultiplier: number
  additionalMinutes?: number
}

export interface IncidentWeightConfig {
  congestionLow: number
  congestionMedium: number
  congestionHigh: number
  restocking: number
}

export interface CheckoutDynamicState {
  checkoutId: ID
  status: CheckoutStatus
  queueMinutes: number
}

export interface NavigationState {
  currentNodeId: ID
  nextProductId?: ID
  completedProductIds: ID[]
  pendingProductIds: ID[]
  progress: number
}

export interface DemoScenario {
  id: ID
  name: string
  description?: string
  incidents: DemoIncidentDefinition[]
  checkoutOverrides?: CheckoutOverride[]
}

export interface DemoIncidentDefinition {
  type: IncidentType
  targetType: IncidentTargetType
  targetId: ID
  severity: IncidentSeverity
}

export interface CheckoutOverride {
  checkoutId: ID
  status?: CheckoutStatus
  queueMinutes?: number
}

export interface RecommendationRule {
  triggerProductIds?: ID[]
  triggerCategoryIds?: ID[]
  recommendedProductIds: ID[]
  reason?: string
}

export interface OCRResult {
  rawText: string
  lines: string[]
  confidence?: number
}

export interface LocalPersistenceState {
  session?: ShoppingSession
  savedAt: ISODateString
}

export interface AppConfig {
  maxRecommendations: number
  incidentWeights: IncidentWeightConfig
  demoMode: boolean
}
