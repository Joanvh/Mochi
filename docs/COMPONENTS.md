# COMPONENTS.md

## 1. Propósito

Este documento define los componentes funcionales y técnicos de **Mercadona Sync**, sus responsabilidades, entradas, salidas y dependencias.

Debe leerse junto a:

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`

El objetivo es que cada componente pueda desarrollarse, probarse y modificarse de forma independiente, facilitando el trabajo paralelo del equipo y de agentes de IA.

---

# 2. Principios generales

Cada componente debe cumplir estas reglas:

1. Tener una responsabilidad principal clara.
2. Exponer una interfaz simple.
3. No acceder directamente a datos que no le correspondan.
4. No contener lógica de negocio fuera de su ámbito.
5. No depender directamente de proveedores externos si puede evitarse.
6. Ser sustituible sin afectar al resto del sistema siempre que respete su contrato.
7. Mantener el flujo principal funcional aunque fallen los módulos opcionales.

---

# 3. Mapa general de componentes

```text
App
│
├── Entry / Session
│   ├── LandingPage
│   ├── UserSelector
│   └── GuestEntry
│
├── Shopping List
│   ├── ShoppingListPage
│   ├── ShoppingListEditor
│   ├── ProductMatcher
│   └── OCRInput [opcional]
│
├── Recommendations
│   ├── RecommendationsPage
│   ├── RecommendationCard
│   └── RecommendationService
│
├── Store Navigation
│   ├── RouteSummaryPage
│   ├── NavigationPage
│   ├── StoreMap
│   ├── RouteOverlay
│   ├── ProductMarker
│   ├── IncidentMarker
│   └── CheckoutMarker
│
├── Routing Domain
│   ├── RoutingEngine
│   ├── GraphService
│   ├── RoutePlanner
│   ├── RouteCostCalculator
│   └── CheckoutSelector
│
├── Reports
│   ├── ReportButton
│   ├── ReportModal
│   ├── IncidentManager
│   └── IncidentRules
│
├── Demo
│   ├── DemoPanel
│   └── DemoScenarioController
│
└── Infrastructure
    ├── ProductRepository
    ├── StoreRepository
    ├── UserRepository
    ├── ScenarioRepository
    ├── RecommendationProvider
    ├── OCRProvider
    └── LocalPersistence
```

---

# 4. AppShell

## Responsabilidad

Componente raíz de la aplicación.

Debe:

- inicializar proveedores;
- cargar configuración básica;
- montar el router;
- restaurar una sesión local si existe;
- mostrar errores globales no recuperables.

## No debe

- contener lógica de rutas;
- buscar productos;
- calcular recomendaciones;
- modificar incidencias.

## Dependencias

- Router
- AppStore
- Repositories
- ErrorBoundary

---

# 5. LandingPage

## Responsabilidad

Pantalla inicial posterior al acceso conceptual mediante NFC.

Debe ofrecer:

- acceso como usuario identificado;
- continuar como invitado.

## Entrada

```ts
interface LandingPageProps {
  availableUsers: DemoUser[];
}
```

## Salida

Acciones:

```ts
selectUser(userId)
continueAsGuest()
```

## Criterio de aceptación

Desde esta pantalla debe poder iniciarse cualquiera de los dos flujos principales.

---

# 6. UserSelector

## Responsabilidad

Permitir seleccionar uno de los perfiles ficticios disponibles para la demo.

## Entrada

```ts
DemoUser[]
```

## Salida

```ts
userId
```

## Comportamiento

Al seleccionar un usuario:

1. carga su perfil;
2. carga su lista asociada;
3. crea una `ShoppingSession`;
4. navega a `/list`.

---

# 7. GuestEntry

## Responsabilidad

Iniciar una sesión sin usuario identificado.

Debe crear:

```ts
currentUser = null
session.type = "GUEST"
```

y llevar al usuario a la pantalla de introducción manual de lista.

---

# 8. ShoppingListPage

## Responsabilidad

Gestionar la fase de creación y confirmación de la lista de compra.

Debe permitir:

- visualizar productos de una lista de usuario;
- introducir texto manual;
- añadir productos;
- eliminar productos;
- cambiar cantidades si se implementan;
- resolver coincidencias ambiguas;
- confirmar la lista.

## Dependencias

- ShoppingListEditor
- ProductMatchingService
- ProductRepository
- OCRInput [opcional]

## Salida

```ts
ShoppingListItem[]
```

confirmados.

---

# 9. ShoppingListEditor

## Responsabilidad

Representación visual editable de la lista.

## Entrada

```ts
interface ShoppingListEditorProps {
  items: ShoppingListItem[];
}
```

## Acciones

```ts
addItem()
removeItem()
updateQuantity()
confirmList()
```

## No debe

Buscar productos directamente en JSON.

Toda búsqueda debe pasar por `ProductMatchingService`.

---

# 10. ManualListInput

## Responsabilidad

Aceptar una lista escrita o pegada por el usuario.

Ejemplo:

```text
leche
huevos
arroz
tomate
```

También debe aceptar formatos simples como:

```text
leche, huevos, arroz, tomate
```

## Salida

```ts
string[]
```

La salida debe enviarse a `ProductMatchingService`.

---

# 11. ProductMatchingService

## Responsabilidad

Relacionar texto introducido por el usuario con productos del catálogo.

## Entrada

```ts
match(query: string): ProductMatch[]
```

## Salida

```ts
interface ProductMatch {
  product: Product;
  score: number;
}
```

## Estrategia inicial

1. normalizar texto;
2. pasar a minúsculas;
3. eliminar tildes;
4. comparar nombre;
5. comparar keywords;
6. ordenar por puntuación.

## Ejemplo

```text
"leche semi"
        ↓
Leche semidesnatada Hacendado
```

## Requisito

No utilizar IA generativa para esta función en el MVP.

---

# 12. ProductMatchSelector

## Responsabilidad

Resolver búsquedas con varias coincidencias posibles.

Ejemplo:

```text
"queso"

¿Qué producto quieres?

- Queso semicurado
- Queso rallado
- Queso fresco
```

Debe permitir seleccionar una opción o cancelar el elemento.

---

# 13. OCRInput

## Prioridad

Opcional.

## Responsabilidad

Permitir capturar o seleccionar una fotografía de una lista de compra.

## Flujo

```text
Imagen
  ↓
OCRProvider
  ↓
Texto detectado
  ↓
Normalización
  ↓
ProductMatchingService
```

## Requisito arquitectónico

El resto de la aplicación no debe conocer qué tecnología OCR se utiliza.

## Contrato

```ts
interface OCRProvider {
  extractShoppingList(image: File): Promise<string[]>;
}
```

Si este componente no se implementa, el flujo manual debe seguir completo.

---

# 14. RecommendationsPage

## Responsabilidad

Mostrar recomendaciones de cross-selling antes de iniciar la navegación.

Debe permitir:

- visualizar recomendaciones;
- aceptar productos;
- rechazar productos;
- continuar sin aceptar ninguno.

## Entrada

```ts
products: Product[]
```

## Salida

Lista definitiva actualizada.

---

# 15. RecommendationService

## Responsabilidad

Obtener recomendaciones complementarias.

## Contrato

```ts
interface RecommendationService {
  getRecommendations(
    products: Product[]
  ): Promise<ProductRecommendation[]>;
}
```

## Flujo

```text
Lista confirmada
      ↓
RecommendationService
      ↓
AI Provider
      │
      ├── éxito → recomendaciones
      │
      └── fallo → Local Provider
```

## Requisito

Un fallo en la IA nunca debe impedir continuar.

---

# 16. AIRecommendationProvider

## Responsabilidad

Conectarse al proveedor de IA elegido para generar recomendaciones de cross-selling.

## Entrada

Productos actuales.

## Salida

```ts
interface ProductRecommendation {
  productId: string;
  reason?: string;
}
```

## Reglas

- no añadir productos automáticamente;
- limitar el número de sugerencias;
- no inventar productos inexistentes en el catálogo;
- validar las respuestas contra `ProductRepository`;
- aplicar timeout;
- capturar errores.

---

# 17. LocalRecommendationProvider

## Responsabilidad

Fallback determinista para recomendaciones.

Debe trabajar con reglas almacenadas localmente.

Ejemplo:

```json
{
  "pasta": ["queso rallado", "tomate frito"],
  "cafe": ["leche", "galletas"]
}
```

## Uso

- fallback si falla la IA;
- desarrollo;
- pruebas;
- demo segura.

---

# 18. RouteSummaryPage

## Responsabilidad

Mostrar al usuario un resumen antes de comenzar la navegación.

Debe mostrar:

- número de productos;
- tiempo estimado;
- distancia estimada si se utiliza;
- primer destino;
- botón para comenzar.

## Dependencias

- RoutingEngine
- StoreRepository
- ShoppingSession

---

# 19. NavigationPage

## Responsabilidad

Pantalla principal durante la compra.

Debe integrar:

- mapa;
- ruta;
- siguiente producto;
- productos pendientes;
- botón de producto recogido;
- botón de reportar incidencia;
- información de recalculado;
- progreso de compra.

## Dependencias

- StoreMap
- NavigationController
- IncidentManager
- ShoppingSession

## Regla

No debe implementar algoritmos de routing.

---

# 20. StoreMap

## Responsabilidad

Representar visualmente la tienda.

Tecnología prevista:

```text
SVG
```

## Entrada

```ts
interface StoreMapProps {
  store: Store;
  route: Route | null;
  incidents: Incident[];
  currentNodeId: string;
  targetProductId?: string;
}
```

## Debe representar

- distribución de la tienda;
- estanterías;
- zonas transitables;
- posición actual;
- ruta;
- productos relevantes;
- incidencias;
- cajas.

## No debe

- calcular rutas;
- alterar costes;
- acceder al repositorio;
- crear incidencias.

---

# 21. StoreLayout

## Responsabilidad

Renderizar los elementos físicos estáticos de la tienda:

- paredes;
- pasillos;
- estanterías;
- secciones;
- entrada;
- cajas.

Debe construirse a partir de la configuración de `Store`.

---

# 22. RouteOverlay

## Responsabilidad

Dibujar la ruta devuelta por el motor.

## Entrada

```ts
nodePath: string[]
graph: StoreGraph
```

## Salida visual

Una línea o secuencia de segmentos sobre el mapa.

## Comportamiento recomendado

Cuando exista un recalculado, puede utilizarse una animación breve para hacer visible el cambio durante la demo.

La animación nunca debe bloquear la lógica.

---

# 23. CurrentPositionMarker

## Responsabilidad

Mostrar la posición simulada del usuario.

El MVP no dispone de posicionamiento indoor real.

La posición cambia cuando el usuario:

- confirma que ha recogido un producto;
- avanza mediante un control de demo;
- completa una etapa de la ruta.

---

# 24. ProductMarker

## Responsabilidad

Mostrar productos relevantes sobre el plano.

No es necesario mostrar todos los productos de la tienda.

Debe priorizar:

- siguiente producto;
- productos pendientes;
- productos reportados como agotados.

---

# 25. IncidentMarker

## Responsabilidad

Mostrar visualmente una incidencia sobre el mapa.

Tipos:

- congestión;
- bloqueo;
- derrame;
- reposición;
- falta de stock;
- cola.

Cada tipo deberá tener una representación distinguible.

La definición visual pertenece a UI, mientras que el efecto pertenece a `IncidentRules`.

---

# 26. CheckoutMarker

## Responsabilidad

Representar cajas y su estado.

Debe poder mostrar:

- abierta;
- cerrada;
- cola baja;
- cola media;
- cola alta.

La selección de caja no se realiza aquí.

La realiza `CheckoutSelector`.

---

# 27. RoutingEngine

## Responsabilidad

Calcular una ruta válida y optimizada.

## Contrato conceptual

```ts
interface RoutingEngine {
  calculateRoute(input: RouteInput): RouteResult;
}
```

## Entrada

```ts
interface RouteInput {
  graph: StoreGraph;
  currentNodeId: string;
  pendingProducts: ProductLocation[];
  incidents: Incident[];
  checkouts: Checkout[];
}
```

## Salida

```ts
interface RouteResult {
  nodePath: string[];
  orderedProducts: string[];
  estimatedTime: number;
  estimatedDistance: number;
  checkoutId?: string;
}
```

## No debe

- modificar estado React;
- renderizar UI;
- leer archivos JSON directamente.

---

# 28. GraphService

## Responsabilidad

Operaciones básicas sobre el grafo.

Debe ofrecer:

```ts
getNode(id)
getEdges(nodeId)
getNeighbors(nodeId)
getEdge(from, to)
```

Puede incorporar utilidades de validación.

---

# 29. ShortestPathSolver

## Responsabilidad

Resolver el camino de menor coste entre dos nodos.

Algoritmo inicial:

```text
Dijkstra
```

## Contrato

```ts
findShortestPath(
  graph,
  source,
  destination,
  costResolver
): PathResult
```

Debe ser una función pura y testeable.

---

# 30. RouteCostCalculator

## Responsabilidad

Calcular el coste efectivo de recorrer una arista.

## Entrada

- arista;
- incidencias;
- configuración de pesos.

## Ejemplo

```text
coste =
baseTime
× congestionMultiplier
× restockingMultiplier
```

Una arista bloqueada devuelve:

```text
Infinity
```

## Importante

Todos los multiplicadores deben estar centralizados.

---

# 31. MultiStopRoutePlanner

## Responsabilidad

Ordenar los productos pendientes.

Estrategia MVP:

```text
nearest-neighbour dinámico
```

## Flujo

1. posición actual;
2. calcula coste a cada producto;
3. selecciona el mejor;
4. añade producto;
5. repite.

Una vez completados los productos:

6. solicita a `CheckoutSelector` la caja recomendada.

---

# 32. CheckoutSelector

## Responsabilidad

Elegir la caja con menor tiempo esperado.

## Fórmula conceptual

```text
tiempo_total =
tiempo_hasta_caja
+
queueMinutes
```

## Debe ignorar

- cajas cerradas;
- cajas bloqueadas.

## Salida

```ts
checkoutId
estimatedTotalTime
```

---

# 33. NavigationController

## Responsabilidad

Coordinar la navegación activa.

Debe responder a eventos como:

```text
PRODUCT_COLLECTED
INCIDENT_CREATED
PRODUCT_OUT_OF_STOCK
CHECKOUT_CHANGED
ROUTE_INVALIDATED
```

## Acciones

- actualizar sesión;
- comprobar si la ruta sigue siendo válida;
- solicitar recalculado;
- cambiar siguiente destino;
- detectar finalización.

---

# 34. ReportButton

## Responsabilidad

Acceso rápido al sistema de reportes.

Debe estar visible durante la navegación sin ocupar demasiado espacio.

Debe abrir `ReportModal`.

---

# 35. ReportModal

## Responsabilidad

Permitir seleccionar el tipo de reporte y su ubicación.

Tipos iniciales:

```text
Producto agotado
Mucha gente
Pasillo bloqueado
Derrame
Reposición
Cola larga
```

## Objetivo UX

Crear un reporte en el menor número razonable de pasos.

---

# 36. IncidentManager

## Responsabilidad

Gestionar el ciclo de vida de las incidencias.

## Operaciones

```ts
createIncident()
removeIncident()
expireIncident()
getActiveIncidents()
```

Debe utilizar `IncidentRules` para determinar efectos.

---

# 37. IncidentRules

## Responsabilidad

Definir el efecto funcional de cada tipo de incidencia.

Ejemplo:

```ts
PRODUCT_OUT_OF_STOCK
→ afecta a PRODUCT

CONGESTION
→ modifica EDGE cost

BLOCKED_AISLE
→ bloquea EDGE

SPILL
→ bloquea EDGE

RESTOCKING
→ penaliza EDGE

LONG_CHECKOUT_QUEUE
→ modifica CHECKOUT
```

## Regla

Esta lógica debe estar centralizada.

No debe implementarse de nuevo en componentes visuales.

---

# 38. RouteRecalculationPolicy

## Responsabilidad

Decidir cuándo debe recalcularse la ruta.

## Recalcular siempre

```text
SPILL sobre la ruta
BLOCKED_AISLE sobre la ruta
PRODUCT_OUT_OF_STOCK pendiente
CHECKOUT cerrada
```

## Recalcular si afecta al coste relevante

```text
CONGESTION
RESTOCKING
LONG_CHECKOUT_QUEUE
```

Esto evita recalculados innecesarios.

---

# 39. ShoppingSessionManager

## Responsabilidad

Gestionar el estado de la compra actual.

Debe almacenar:

- usuario;
- tienda;
- lista;
- productos pendientes;
- productos completados;
- ruta;
- posición;
- incidencias;
- caja;
- estado de sesión.

## Operaciones

```ts
startSession()
confirmList()
startNavigation()
collectProduct()
updatePosition()
finishShopping()
```

---

# 40. ProgressIndicator

## Responsabilidad

Mostrar progreso de compra.

Ejemplo:

```text
6 / 10 productos
```

Puede mostrar también:

```text
60 % completado
```

Su función es exclusivamente visual.

---

# 41. NextProductCard

## Responsabilidad

Mostrar claramente el siguiente objetivo.

Debe poder incluir:

- nombre;
- imagen;
- sección;
- distancia estimada;
- botón "Recogido".

---

# 42. RouteUpdateNotice

## Responsabilidad

Informar al usuario cuando la ruta cambia.

Ejemplo:

```text
Ruta actualizada
Evitamos el pasillo 4 por un derrame.
```

Debe aparecer solo el tiempo necesario para comprender el cambio.

---

# 43. FinishPage

## Responsabilidad

Finalizar la experiencia.

Puede mostrar:

- productos comprados;
- tiempo estimado;
- incidencias evitadas;
- recomendaciones aceptadas.

## Opcional

Botón de feedback.

El chat de feedback no forma parte del MVP.

---

# 44. DemoPanel

## Responsabilidad

Permitir provocar eventos de forma controlada durante pruebas y presentación.

Debe estar separado de la interfaz del cliente.

Acciones previstas:

```text
Crear congestión
Bloquear pasillo
Crear derrame
Marcar producto agotado
Aumentar cola
Cerrar caja
Limpiar incidencias
```

## Ruta recomendada

```text
/demo
```

---

# 45. DemoScenarioController

## Responsabilidad

Cargar escenarios predefinidos.

Ejemplos:

```text
NORMAL
CONGESTION
SPILL
OUT_OF_STOCK
LONG_QUEUE
```

## Objetivo

Garantizar que la demo sea repetible.

---

# 46. ProductRepository

## Responsabilidad

Proporcionar acceso al catálogo.

## Contrato

```ts
interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  search(query: string): Promise<Product[]>;
}
```

## Implementación MVP

```text
JsonProductRepository
```

---

# 47. StoreRepository

## Responsabilidad

Cargar configuraciones de tiendas.

## Contrato

```ts
interface StoreRepository {
  getAll(): Promise<Store[]>;
  getById(id: string): Promise<Store | null>;
}
```

## Debe incluir

- layout;
- grafo;
- ubicaciones;
- cajas.

---

# 48. UserRepository

## Responsabilidad

Gestionar usuarios ficticios de demo.

## Contrato

```ts
interface UserRepository {
  getDemoUsers(): Promise<DemoUser[]>;
  getById(id: string): Promise<DemoUser | null>;
}
```

---

# 49. ScenarioRepository

## Responsabilidad

Cargar escenarios de demo.

```ts
interface ScenarioRepository {
  getAll(): Promise<DemoScenario[]>;
  getById(id: string): Promise<DemoScenario | null>;
}
```

---

# 50. LocalPersistence

## Responsabilidad

Guardar estado mínimo recuperable.

Implementación prevista:

```text
localStorage
```

## Puede persistir

- sesión activa;
- tienda;
- lista;
- productos completados.

## No debe considerarse

una base de datos de producción.

---

# 51. AppStore

## Responsabilidad

Contener el estado compartido necesario entre pantallas.

Tecnología prevista:

```text
Zustand
```

## Áreas de estado

```ts
interface AppState {
  currentUser: DemoUser | null;
  currentStore: Store | null;
  shoppingSession: ShoppingSession | null;
  activeRoute: Route | null;
  activeIncidents: Incident[];
}
```

## Regla

Los componentes deben evitar añadir al store información puramente visual.

---

# 52. ErrorBoundary

## Responsabilidad

Evitar que un error visual aislado destruya toda la demo.

Debe ofrecer una pantalla de recuperación simple.

Los errores de servicios opcionales deben gestionarse localmente y no llegar al `ErrorBoundary`.

---

# 53. LoadingState

## Responsabilidad

Proporcionar indicadores consistentes para operaciones asíncronas.

Principalmente:

- recomendaciones;
- OCR;
- carga inicial.

El motor local de rutas debería ser suficientemente rápido para no necesitar un loader visible.

---

# 54. Toast / NotificationService

## Responsabilidad

Mostrar mensajes breves.

Ejemplos:

```text
Producto añadido
Reporte enviado
Ruta actualizada
No se pudo contactar con IA; usamos recomendaciones locales
```

Durante la demo no se deben mostrar errores técnicos al usuario.

---

# 55. Configuración central

Debe existir un módulo de configuración.

Ejemplo:

```ts
export const APP_CONFIG = {
  maxRecommendations: 3,
  routeWeights: {
    congestionLow: 1.2,
    congestionMedium: 1.8,
    congestionHigh: 3,
    restocking: 1.4,
  },
};
```

## Regla

Los valores que afecten al comportamiento global no deben estar repartidos por componentes.

---

# 56. Dependencias permitidas

## Presentation puede depender de

- Application
- Domain types
- AppStore

## Application puede depender de

- Domain
- Repositories
- Providers

## Domain puede depender de

- tipos y utilidades puras.

## Domain NO puede depender de

- React;
- Zustand;
- archivos JSON;
- APIs externas;
- componentes.

---

# 57. Matriz de componentes y prioridad

| Componente | Prioridad | MVP |
|---|---|---|
| LandingPage | P0 | Sí |
| UserSelector | P0 | Sí |
| GuestEntry | P0 | Sí |
| ShoppingListPage | P0 | Sí |
| ProductMatchingService | P0 | Sí |
| RecommendationsPage | P0 | Sí |
| LocalRecommendationProvider | P0 | Sí |
| AIRecommendationProvider | P1 | Sí, si está disponible |
| RouteSummaryPage | P0 | Sí |
| NavigationPage | P0 | Sí |
| StoreMap | P0 | Sí |
| RoutingEngine | P0 | Sí |
| ShortestPathSolver | P0 | Sí |
| MultiStopRoutePlanner | P0 | Sí |
| CheckoutSelector | P0 | Sí |
| IncidentManager | P0 | Sí |
| IncidentRules | P0 | Sí |
| ReportModal | P0 | Sí |
| DemoPanel | P0 | Sí |
| OCRInput | P2 | No |
| Segunda tienda | P2 | No |
| Feedback IA | P3 | No |

---

# 58. Reparto orientativo de trabajo

La división final dependerá del equipo, pero una organización compatible con seis personas sería:

## Bloque 1 — UI y flujo

- LandingPage
- ShoppingListPage
- RecommendationsPage
- FinishPage

## Bloque 2 — Mapa

- StoreMap
- StoreLayout
- RouteOverlay
- Markers

## Bloque 3 — Routing

- GraphService
- ShortestPathSolver
- RouteCostCalculator
- MultiStopRoutePlanner
- CheckoutSelector

## Bloque 4 — Incidencias

- IncidentManager
- IncidentRules
- ReportModal
- RouteRecalculationPolicy

## Bloque 5 — Datos y catálogo

- JSON
- ProductRepository
- StoreRepository
- UserRepository
- ProductMatchingService

## Bloque 6 — IA, demo e integración

- RecommendationService
- providers
- DemoPanel
- DemoScenarioController
- integración final
- soporte de presentación

---

# 59. Contratos que no deben romperse

Durante el desarrollo, los agentes pueden modificar implementaciones internas, pero no deben alterar unilateralmente:

```text
Product
Store
StoreGraph
GraphNode
GraphEdge
ShoppingSession
Incident
Checkout
RouteInput
RouteResult
RecommendationProvider
OCRProvider
```

Estos modelos serán definidos formalmente en `DATA_MODEL.md`.

Si un agente necesita cambiar un contrato compartido:

1. debe documentar el motivo;
2. actualizar `DATA_MODEL.md`;
3. revisar todos los consumidores afectados.

---

# 60. Definición de componente terminado

Un componente se considera terminado cuando:

- cumple su responsabilidad;
- respeta sus interfaces;
- gestiona errores esperables;
- no introduce dependencias indebidas;
- puede probarse de forma aislada razonablemente;
- no rompe el flujo principal;
- tiene una integración mínima verificada.

---

# 61. Regla final

Ante cualquier duda durante el hackathon:

> El componente más simple que cumpla correctamente su responsabilidad es preferible a una solución más sofisticada que aumente el riesgo de integración.

Mercadona Sync debe construirse como un conjunto de piezas pequeñas, predecibles y combinables.
