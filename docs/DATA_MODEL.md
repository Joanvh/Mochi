# DATA_MODEL.md

## 1. Propósito

Este documento define los modelos de datos compartidos de **Mercadona Sync**.

Su objetivo es establecer contratos claros entre componentes, servicios, repositorios y agentes de IA para evitar:

- estructuras duplicadas;
- nombres inconsistentes;
- campos incompatibles;
- cambios no coordinados;
- lógica de negocio mezclada con datos.

Debe leerse junto a:

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `COMPONENTS.md`

Los tipos definidos aquí son la referencia principal para implementar las interfaces TypeScript del proyecto.

---

# 2. Principios del modelo de datos

## 2.1. IDs estables

Todos los elementos principales deben tener un identificador único y estable.

Formato recomendado:

```text
product_001
store_01
node_001
edge_001
checkout_01
incident_001
user_01
session_001
```

No se utilizarán nombres visibles como identificadores internos.

---

## 2.2. Separación entre catálogo y tienda

Un producto existe independientemente de su ubicación física.

Por tanto:

```text
Product
```

define el producto global, mientras que:

```text
ProductLocation
```

define dónde está ese producto en una tienda concreta.

Esto permite que el mismo producto aparezca en posiciones diferentes según la tienda.

---

## 2.3. Separación entre datos estáticos y dinámicos

### Datos estáticos

- productos;
- configuración de tiendas;
- nodos;
- aristas;
- estanterías;
- cajas base;
- usuarios ficticios.

### Datos dinámicos

- sesión de compra;
- productos recogidos;
- incidencias;
- rutas;
- colas;
- posición actual;
- recomendaciones aceptadas.

---

## 2.4. La UI no define el dominio

Los modelos no deben incorporar campos puramente visuales salvo que sean necesarios para representar la tienda.

Ejemplo correcto:

```ts
x: number;
y: number;
```

Ejemplo que debe evitarse dentro del dominio:

```ts
buttonColor: "green";
```

La presentación visual pertenece a los componentes de UI.

---

# 3. Tipos base

```ts
export type ID = string;
export type ISODateString = string;
```

Los IDs se representan como `string`.

Las fechas se almacenan como ISO 8601.

Ejemplo:

```text
2026-10-05T10:30:00+02:00
```

---

# 4. Product

Representa un producto del catálogo.

```ts
export interface Product {
  id: ID;
  name: string;
  categoryId: ID;
  brand?: string;
  description?: string;
  keywords: string[];
  imageUrl?: string;
  barcode?: string;
  unitLabel?: string;
  active: boolean;
}
```

## Campos

### `id`

Identificador interno.

### `name`

Nombre visible del producto.

Ejemplo:

```text
Leche semidesnatada Hacendado
```

### `categoryId`

Referencia a la categoría.

### `brand`

Marca, si es relevante.

### `description`

Descripción corta opcional.

### `keywords`

Términos utilizados por `ProductMatchingService`.

Ejemplo:

```json
["leche", "semi", "semidesnatada", "lacteo"]
```

### `imageUrl`

Imagen del producto.

Puede ser una ruta local:

```text
/products/product_001.webp
```

### `barcode`

Código de barras, reservado para posibles ampliaciones.

### `unitLabel`

Texto descriptivo.

Ejemplo:

```text
1 L
```

### `active`

Permite desactivar productos sin eliminarlos del dataset.

---

# 5. ProductCategory

```ts
export interface ProductCategory {
  id: ID;
  name: string;
  keywords?: string[];
}
```

Ejemplo:

```json
{
  "id": "cat_dairy",
  "name": "Lácteos",
  "keywords": ["leche", "yogur", "queso"]
}
```

---

# 6. Store

Representa una tienda completa.

```ts
export interface Store {
  id: ID;
  name: string;
  displayName: string;
  layout: StoreLayout;
  graph: StoreGraph;
  productLocations: ProductLocation[];
  checkouts: Checkout[];
  entranceNodeId: ID;
}
```

## Campos

### `id`

Identificador de tienda.

### `name`

Nombre interno.

### `displayName`

Nombre visible.

Ejemplo:

```text
Mercadona Demo - Tienda A
```

### `layout`

Configuración visual.

### `graph`

Grafo navegable.

### `productLocations`

Posiciones de productos.

### `checkouts`

Cajas disponibles.

### `entranceNodeId`

Nodo donde comienza la sesión.

---

# 7. StoreLayout

Define la representación visual de la tienda.

```ts
export interface StoreLayout {
  width: number;
  height: number;
  zones: StoreZone[];
  shelves: Shelf[];
  walls?: Wall[];
}
```

Las coordenadas utilizarán un sistema abstracto consistente.

Ejemplo:

```text
width = 1000
height = 700
```

El SVG podrá escalar estas coordenadas al tamaño de pantalla.

---

# 8. StoreZone

Representa una zona funcional.

```ts
export interface StoreZone {
  id: ID;
  name: string;
  type: StoreZoneType;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

```ts
export type StoreZoneType =
  | "ENTRANCE"
  | "AISLE"
  | "SECTION"
  | "CHECKOUT"
  | "SERVICE"
  | "RESTRICTED";
```

Ejemplos:

```text
Frutería
Panadería
Refrigerados
Cajas
```

---

# 9. Shelf

Representa una estantería o lineal.

```ts
export interface Shelf {
  id: ID;
  zoneId?: ID;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: "HORIZONTAL" | "VERTICAL";
}
```

El `Shelf` es principalmente visual.

La navegación se realiza mediante nodos del grafo.

---

# 10. Wall

Elemento opcional para definir límites visuales.

```ts
export interface Wall {
  id: ID;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
```

---

# 11. StoreGraph

```ts
export interface StoreGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

Representa la red navegable de la tienda.

---

# 12. GraphNode

```ts
export interface GraphNode {
  id: ID;
  x: number;
  y: number;
  type: NodeType;
  zoneId?: ID;
  label?: string;
}
```

```ts
export type NodeType =
  | "ENTRANCE"
  | "INTERSECTION"
  | "AISLE"
  | "PRODUCT_ACCESS"
  | "CHECKOUT"
  | "EXIT";
```

## Regla

Los nodos deben colocarse únicamente en posiciones transitables.

---

# 13. GraphEdge

```ts
export interface GraphEdge {
  id: ID;
  from: ID;
  to: ID;
  distance: number;
  baseTime: number;
  bidirectional: boolean;
  enabled: boolean;
}
```

## Campos

### `distance`

Distancia abstracta o metros aproximados.

### `baseTime`

Tiempo base estimado para recorrer el tramo.

La optimización principal se hará sobre tiempo.

### `bidirectional`

Indica si puede recorrerse en ambos sentidos.

### `enabled`

Permite desactivar un tramo estructuralmente.

Las incidencias temporales no deben modificar permanentemente este campo.

---

# 14. ProductLocation

Relaciona producto y tienda.

```ts
export interface ProductLocation {
  productId: ID;
  storeId: ID;
  nodeId: ID;
  shelfId?: ID;
  zoneId?: ID;
  displayLabel?: string;
}
```

Ejemplo:

```json
{
  "productId": "product_001",
  "storeId": "store_01",
  "nodeId": "node_024",
  "shelfId": "shelf_08",
  "zoneId": "zone_dairy",
  "displayLabel": "Pasillo 6 - Refrigerados"
}
```

---

# 15. Checkout

Representa una caja.

```ts
export interface Checkout {
  id: ID;
  name: string;
  nodeId: ID;
  status: CheckoutStatus;
  queueMinutes: number;
}
```

```ts
export type CheckoutStatus =
  | "OPEN"
  | "CLOSED";
```

## Regla

`queueMinutes` es un dato dinámico de demo.

Puede ser modificado por incidencias.

---

# 16. DemoUser

Representa un usuario ficticio.

```ts
export interface DemoUser {
  id: ID;
  name: string;
  shoppingListId: ID;
}
```

No se almacenarán datos personales reales.

---

# 17. ShoppingList

```ts
export interface ShoppingList {
  id: ID;
  userId?: ID;
  items: ShoppingListItem[];
}
```

---

# 18. ShoppingListItem

```ts
export interface ShoppingListItem {
  id: ID;
  rawText: string;
  productId?: ID;
  quantity: number;
  status: ShoppingListItemStatus;
  source: ShoppingListItemSource;
}
```

```ts
export type ShoppingListItemStatus =
  | "UNRESOLVED"
  | "PENDING"
  | "COLLECTED"
  | "UNAVAILABLE"
  | "REMOVED";
```

```ts
export type ShoppingListItemSource =
  | "USER_PROFILE"
  | "MANUAL"
  | "OCR"
  | "RECOMMENDATION";
```

## `rawText`

Texto original.

Ejemplo:

```text
leche semi
```

## `productId`

Se completa tras el matching.

---

# 19. ProductMatch

Resultado de búsqueda de producto.

```ts
export interface ProductMatch {
  productId: ID;
  score: number;
  matchedBy: ProductMatchReason[];
}
```

```ts
export type ProductMatchReason =
  | "EXACT_NAME"
  | "PARTIAL_NAME"
  | "KEYWORD"
  | "CATEGORY";
```

Ejemplo:

```json
{
  "productId": "product_001",
  "score": 0.91,
  "matchedBy": ["PARTIAL_NAME", "KEYWORD"]
}
```

---

# 20. ProductRecommendation

```ts
export interface ProductRecommendation {
  id: ID;
  productId: ID;
  reason?: string;
  source: RecommendationSource;
  status: RecommendationStatus;
}
```

```ts
export type RecommendationSource =
  | "AI"
  | "LOCAL"
  | "MOCK";
```

```ts
export type RecommendationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "IGNORED";
```

---

# 21. ShoppingSession

Modelo central de ejecución.

```ts
export interface ShoppingSession {
  id: ID;
  type: ShoppingSessionType;
  userId?: ID;
  storeId: ID;
  status: ShoppingSessionStatus;
  shoppingList: ShoppingListItem[];
  currentNodeId: ID;
  activeRoute?: Route;
  activeIncidentIds: ID[];
  selectedCheckoutId?: ID;
  startedAt: ISODateString;
  completedAt?: ISODateString;
}
```

```ts
export type ShoppingSessionType =
  | "AUTHENTICATED"
  | "GUEST";
```

```ts
export type ShoppingSessionStatus =
  | "INITIAL"
  | "LIST_READY"
  | "RECOMMENDATIONS"
  | "READY_TO_NAVIGATE"
  | "NAVIGATING"
  | "CHECKOUT"
  | "COMPLETED";
```

---

# 22. Route

Representa la ruta activa.

```ts
export interface Route {
  id: ID;
  nodePath: ID[];
  orderedProductIds: ID[];
  estimatedTime: number;
  estimatedDistance: number;
  checkoutId?: ID;
  generatedAt: ISODateString;
  reason: RouteGenerationReason;
}
```

```ts
export type RouteGenerationReason =
  | "INITIAL"
  | "PRODUCT_COLLECTED"
  | "INCIDENT"
  | "PRODUCT_UNAVAILABLE"
  | "CHECKOUT_CHANGE"
  | "MANUAL";
```

---

# 23. RouteInput

Entrada del motor de rutas.

```ts
export interface RouteInput {
  graph: StoreGraph;
  currentNodeId: ID;
  pendingProducts: ProductLocation[];
  incidents: Incident[];
  checkouts: Checkout[];
}
```

---

# 24. RouteResult

Salida del motor de rutas.

```ts
export interface RouteResult {
  nodePath: ID[];
  orderedProductIds: ID[];
  estimatedTime: number;
  estimatedDistance: number;
  checkoutId?: ID;
}
```

`RouteResult` es un resultado puro.

La capa de aplicación lo convierte posteriormente en `Route`.

---

# 25. PathResult

Resultado entre dos nodos.

```ts
export interface PathResult {
  nodePath: ID[];
  totalCost: number;
  distance: number;
  estimatedTime: number;
}
```

---

# 26. Incident

Representa un reporte activo.

```ts
export interface Incident {
  id: ID;
  type: IncidentType;
  targetType: IncidentTargetType;
  targetId: ID;
  severity: IncidentSeverity;
  source: IncidentSource;
  createdAt: ISODateString;
  expiresAt?: ISODateString;
  status: IncidentStatus;
}
```

---

# 27. IncidentType

```ts
export type IncidentType =
  | "PRODUCT_OUT_OF_STOCK"
  | "CONGESTION"
  | "BLOCKED_AISLE"
  | "SPILL"
  | "RESTOCKING"
  | "LONG_CHECKOUT_QUEUE";
```

---

# 28. IncidentTargetType

```ts
export type IncidentTargetType =
  | "EDGE"
  | "NODE"
  | "PRODUCT"
  | "CHECKOUT";
```

Relación recomendada:

```text
PRODUCT_OUT_OF_STOCK   → PRODUCT
CONGESTION             → EDGE
BLOCKED_AISLE          → EDGE
SPILL                  → EDGE
RESTOCKING             → EDGE
LONG_CHECKOUT_QUEUE    → CHECKOUT
```

---

# 29. IncidentSeverity

```ts
export type IncidentSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";
```

Para el MVP no todos los tipos necesitan utilizar los cuatro niveles.

Ejemplo:

```text
CONGESTION
LOW
MEDIUM
HIGH
```

---

# 30. IncidentSource

```ts
export type IncidentSource =
  | "USER"
  | "DEMO"
  | "SYSTEM";
```

En el futuro podría añadirse:

```text
EMPLOYEE
SENSOR
```

pero no forma parte del MVP.

---

# 31. IncidentStatus

```ts
export type IncidentStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "RESOLVED";
```

---

# 32. IncidentEffect

Modelo calculado, no necesariamente persistido.

```ts
export interface IncidentEffect {
  blocksTraversal: boolean;
  costMultiplier: number;
  additionalMinutes?: number;
}
```

Ejemplo:

```text
SPILL
blocksTraversal = true

CONGESTION_HIGH
costMultiplier = 3
```

---

# 33. IncidentWeightConfig

Configuración central.

```ts
export interface IncidentWeightConfig {
  congestionLow: number;
  congestionMedium: number;
  congestionHigh: number;
  restocking: number;
}
```

Ejemplo inicial:

```json
{
  "congestionLow": 1.2,
  "congestionMedium": 1.8,
  "congestionHigh": 3.0,
  "restocking": 1.4
}
```

---

# 34. CheckoutDynamicState

Opcionalmente puede separarse el estado dinámico de la configuración base.

```ts
export interface CheckoutDynamicState {
  checkoutId: ID;
  status: CheckoutStatus;
  queueMinutes: number;
}
```

Para el MVP puede mantenerse directamente dentro de `Checkout`.

---

# 35. NavigationState

Modelo auxiliar para UI.

```ts
export interface NavigationState {
  currentNodeId: ID;
  nextProductId?: ID;
  completedProductIds: ID[];
  pendingProductIds: ID[];
  progress: number;
}
```

Este tipo puede derivarse de `ShoppingSession`.

No es obligatorio persistirlo.

---

# 36. DemoScenario

Representa un escenario controlado.

```ts
export interface DemoScenario {
  id: ID;
  name: string;
  description?: string;
  incidents: DemoIncidentDefinition[];
  checkoutOverrides?: CheckoutOverride[];
}
```

---

# 37. DemoIncidentDefinition

```ts
export interface DemoIncidentDefinition {
  type: IncidentType;
  targetType: IncidentTargetType;
  targetId: ID;
  severity: IncidentSeverity;
}
```

---

# 38. CheckoutOverride

```ts
export interface CheckoutOverride {
  checkoutId: ID;
  status?: CheckoutStatus;
  queueMinutes?: number;
}
```

---

# 39. RecommendationRule

Para fallback local.

```ts
export interface RecommendationRule {
  triggerProductIds?: ID[];
  triggerCategoryIds?: ID[];
  recommendedProductIds: ID[];
  reason?: string;
}
```

Ejemplo:

```json
{
  "triggerProductIds": ["product_pasta"],
  "recommendedProductIds": [
    "product_cheese",
    "product_tomato_sauce"
  ],
  "reason": "Productos complementarios"
}
```

---

# 40. OCRResult

Modelo opcional.

```ts
export interface OCRResult {
  rawText: string;
  lines: string[];
  confidence?: number;
}
```

El dominio principal no debe depender de este tipo.

---

# 41. LocalPersistenceState

Estado mínimo que puede guardarse.

```ts
export interface LocalPersistenceState {
  session?: ShoppingSession;
  savedAt: ISODateString;
}
```

No es necesario persistir:

- rutas antiguas;
- logs;
- recomendaciones rechazadas;
- estados visuales.

---

# 42. AppConfig

```ts
export interface AppConfig {
  maxRecommendations: number;
  incidentWeights: IncidentWeightConfig;
  demoMode: boolean;
}
```

Ejemplo:

```json
{
  "maxRecommendations": 3,
  "incidentWeights": {
    "congestionLow": 1.2,
    "congestionMedium": 1.8,
    "congestionHigh": 3.0,
    "restocking": 1.4
  },
  "demoMode": true
}
```

---

# 43. Ejemplo de products.json

```json
[
  {
    "id": "product_001",
    "name": "Leche semidesnatada Hacendado",
    "categoryId": "cat_dairy",
    "brand": "Hacendado",
    "keywords": [
      "leche",
      "semi",
      "semidesnatada"
    ],
    "imageUrl": "/products/product_001.webp",
    "unitLabel": "1 L",
    "active": true
  },
  {
    "id": "product_002",
    "name": "Huevos grandes",
    "categoryId": "cat_eggs",
    "keywords": [
      "huevos",
      "huevo"
    ],
    "imageUrl": "/products/product_002.webp",
    "active": true
  }
]
```

---

# 44. Ejemplo de users.json

```json
[
  {
    "id": "user_01",
    "name": "Usuario Demo 1",
    "shoppingListId": "list_01"
  },
  {
    "id": "user_02",
    "name": "Usuario Demo 2",
    "shoppingListId": "list_02"
  }
]
```

---

# 45. Ejemplo de shopping-lists.json

```json
[
  {
    "id": "list_01",
    "userId": "user_01",
    "items": [
      {
        "id": "item_001",
        "rawText": "leche",
        "productId": "product_001",
        "quantity": 1,
        "status": "PENDING",
        "source": "USER_PROFILE"
      }
    ]
  }
]
```

---

# 46. Ejemplo de store.json

```json
{
  "id": "store_01",
  "name": "demo_store_a",
  "displayName": "Mercadona Demo - Tienda A",
  "entranceNodeId": "node_001",

  "layout": {
    "width": 1000,
    "height": 700,
    "zones": [],
    "shelves": [],
    "walls": []
  },

  "graph": {
    "nodes": [],
    "edges": []
  },

  "productLocations": [],

  "checkouts": [
    {
      "id": "checkout_01",
      "name": "Caja 1",
      "nodeId": "node_checkout_01",
      "status": "OPEN",
      "queueMinutes": 2
    }
  ]
}
```

---

# 47. Ejemplo de nodo

```json
{
  "id": "node_012",
  "x": 420,
  "y": 180,
  "type": "AISLE",
  "zoneId": "zone_03",
  "label": "Pasillo 3"
}
```

---

# 48. Ejemplo de arista

```json
{
  "id": "edge_012",
  "from": "node_011",
  "to": "node_012",
  "distance": 8,
  "baseTime": 7,
  "bidirectional": true,
  "enabled": true
}
```

---

# 49. Ejemplo de ubicación de producto

```json
{
  "productId": "product_001",
  "storeId": "store_01",
  "nodeId": "node_024",
  "shelfId": "shelf_08",
  "zoneId": "zone_dairy",
  "displayLabel": "Pasillo 6 - Refrigerados"
}
```

---

# 50. Ejemplo de incidencia

```json
{
  "id": "incident_001",
  "type": "SPILL",
  "targetType": "EDGE",
  "targetId": "edge_014",
  "severity": "HIGH",
  "source": "DEMO",
  "createdAt": "2026-10-05T11:15:00+02:00",
  "status": "ACTIVE"
}
```

---

# 51. Ejemplo de congestión

```json
{
  "id": "incident_002",
  "type": "CONGESTION",
  "targetType": "EDGE",
  "targetId": "edge_021",
  "severity": "HIGH",
  "source": "USER",
  "createdAt": "2026-10-05T11:18:00+02:00",
  "status": "ACTIVE"
}
```

---

# 52. Ejemplo de falta de stock

```json
{
  "id": "incident_003",
  "type": "PRODUCT_OUT_OF_STOCK",
  "targetType": "PRODUCT",
  "targetId": "product_018",
  "severity": "HIGH",
  "source": "USER",
  "createdAt": "2026-10-05T11:20:00+02:00",
  "status": "ACTIVE"
}
```

---

# 53. Ejemplo de escenario de demo

```json
{
  "id": "scenario_spill",
  "name": "Derrame en pasillo",
  "description": "Bloquea un tramo de la ruta activa",
  "incidents": [
    {
      "type": "SPILL",
      "targetType": "EDGE",
      "targetId": "edge_014",
      "severity": "HIGH"
    }
  ]
}
```

---

# 54. Relaciones entre entidades

```text
ProductCategory
      │
      │ 1:N
      ▼
   Product
      │
      │ N:M mediante ProductLocation
      ▼
    Store
      │
      ├── StoreLayout
      ├── StoreGraph
      └── Checkout


DemoUser
   │
   ▼
ShoppingList
   │
   ▼
ShoppingListItem
   │
   ▼
Product


ShoppingSession
   ├── Store
   ├── ShoppingListItem[]
   ├── Route
   └── Incident[]
```

---

# 55. Restricciones de integridad

## Producto

- `id` debe ser único.
- `categoryId` debe existir.
- `keywords` no debe estar vacío para productos usados en demo.

## ProductLocation

- `productId` debe existir.
- `storeId` debe existir.
- `nodeId` debe existir dentro de la tienda.

## Edge

- `from` y `to` deben existir.
- `distance > 0`.
- `baseTime > 0`.

## Checkout

- `nodeId` debe existir.
- `queueMinutes >= 0`.

## Incident

- `targetId` debe ser compatible con `targetType`.
- `status` debe ser válido.
- `createdAt` debe existir.

---

# 56. Validación de datos

Se recomienda validar los JSON al arrancar la aplicación.

Puede utilizarse una librería ligera como:

```text
Zod
```

Ejemplo conceptual:

```ts
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  keywords: z.array(z.string()),
  active: z.boolean(),
});
```

La validación debe detectar errores de datos antes de comenzar la demo.

---

# 57. Convenciones de nombres

## TypeScript

```text
PascalCase
```

para interfaces y tipos.

Ejemplo:

```ts
ShoppingSession
ProductLocation
```

## Propiedades

```text
camelCase
```

Ejemplo:

```ts
currentNodeId
estimatedTime
```

## IDs JSON

```text
snake_case
```

Ejemplo:

```text
product_001
edge_014
store_01
```

---

# 58. Unidades

Deben mantenerse consistentes.

## Distancia

```text
metros
```

o una unidad abstracta proporcional si el plano es simulado.

## Tiempo

```text
segundos
```

internamente para aristas.

## Cola

```text
minutos
```

por facilidad de comprensión.

## Coordenadas

Unidades abstractas del SVG.

---

# 59. Datos simulados y reales

Debe mantenerse una separación conceptual clara.

## Datos reales

- nombre de productos;
- información básica del catálogo utilizada en demo.

## Datos simulados

- ubicación;
- tienda;
- stock;
- congestión;
- incidencias;
- tiempos;
- colas;
- usuarios;
- rutas.

Ningún dato simulado debe presentarse como dato real obtenido de sistemas internos de Mercadona.

---

# 60. Evolución futura

El modelo permite ampliar posteriormente:

```text
Product
├── allergens
├── nutrition
├── price
└── availability

User
├── preferences
├── history
└── accessibility

Incident
├── confirmations
├── votes
└── employeeValidation

Store
├── sensors
├── realTimeTraffic
└── operationalData
```

Estas ampliaciones no deben implementarse para el MVP salvo necesidad clara.

---

# 61. Contratos críticos

Los siguientes modelos se consideran contratos compartidos:

```text
Product
ProductLocation
Store
StoreLayout
StoreGraph
GraphNode
GraphEdge
Checkout
ShoppingListItem
ShoppingSession
RouteInput
RouteResult
Incident
ProductRecommendation
DemoScenario
```

Ningún agente debe cambiar estos contratos unilateralmente.

---

# 62. Procedimiento para modificar un contrato

Si durante el desarrollo se necesita modificar un modelo compartido:

1. justificar el cambio;
2. actualizar este documento;
3. actualizar los tipos TypeScript;
4. revisar repositorios;
5. revisar servicios consumidores;
6. revisar JSON afectados;
7. ejecutar tests relevantes.

---

# 63. Fuente de verdad

La fuente de verdad conceptual será:

```text
DATA_MODEL.md
```

La fuente de verdad ejecutable será:

```text
src/types/
```

Ambas deben mantenerse sincronizadas.

---

# 64. Regla final

El modelo debe ser suficientemente expresivo para soportar la demo, pero no intentar modelar toda la operación real de Mercadona.

Ante una duda:

> Si un campo no es necesario para el flujo principal, la demo o una ampliación inmediata ya decidida, no debe añadirse todavía.
