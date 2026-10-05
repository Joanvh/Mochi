# ARCHITECTURE.md

## 1. Propósito

Este documento define la arquitectura técnica de **Mercadona Sync** para el hackathon de Mercadona IT - UPV.

La arquitectura se diseña con cuatro objetivos principales:

1. permitir desarrollar el proyecto rápidamente durante el hackathon;
2. facilitar que varias personas y agentes de IA trabajen en paralelo;
3. mantener el flujo principal independiente de servicios externos;
4. permitir ampliar funcionalidades sin rehacer el núcleo del sistema.

Este documento debe leerse junto a `PRODUCT_REQUIREMENTS.md`.

---

# 2. Principios de arquitectura

## 2.1. El flujo principal debe funcionar de forma local

Las siguientes funcionalidades deben funcionar aunque fallen servicios externos:

- carga de una lista;
- búsqueda de productos;
- representación de la tienda;
- cálculo de rutas;
- navegación;
- creación de reportes;
- aplicación de incidencias;
- recalculado de rutas;
- selección de caja.

La IA de cross-selling y el OCR son módulos adicionales y no deben bloquear el funcionamiento principal.

---

## 2.2. Arquitectura simple antes que infraestructura compleja

El proyecto no necesita una arquitectura de producción completa.

Se prioriza:

- facilidad de desarrollo;
- facilidad de depuración;
- rapidez de integración;
- estabilidad de la demo;
- separación clara de responsabilidades.

Se evitarán inicialmente:

- microservicios;
- bases de datos remotas;
- colas de mensajes;
- autenticación real;
- infraestructura cloud compleja;
- dependencias externas innecesarias.

---

## 2.3. Configuración antes que código específico

La aplicación no debe contener lógica específica para una única tienda.

La distribución del supermercado, productos, zonas, conexiones, cajas y posiciones se cargarán desde datos estructurados.

Añadir una segunda tienda debería requerir principalmente añadir una nueva configuración, no modificar el motor de navegación.

---

## 2.4. Los módulos deben poder desarrollarse en paralelo

Cada parte principal tendrá una interfaz de entrada y salida clara.

Los agentes o desarrolladores deberán poder trabajar de forma independiente sobre:

- interfaz;
- catálogo;
- motor de rutas;
- representación del mapa;
- incidencias;
- recomendaciones;
- OCR;
- datos de demo.

---

# 3. Stack propuesto

## Frontend

- React
- TypeScript
- Vite
- React Router
- Zustand para estado global ligero
- SVG para representación del supermercado

## Datos

- JSON local para datos simulados y configuración.
- TypeScript para modelos y validación interna.

## Algoritmos

- TypeScript para:
  - búsqueda de productos;
  - cálculo de rutas;
  - aplicación de costes;
  - incidencias;
  - simulación del estado de la tienda.

## Python

Python queda reservado para módulos auxiliares donde aporte valor claro, por ejemplo:

- pruebas rápidas de algoritmos;
- tratamiento previo de datos;
- prototipos de consultas;
- utilidades de preparación de datasets;
- integración opcional de OCR;
- integración opcional de servicios de IA.

Python **no formará parte obligatoria del flujo crítico del navegador**.

## IA

La IA se consumirá mediante una capa de abstracción.

El proveedor concreto no debe formar parte de la lógica del producto.

Debe existir siempre un fallback local o simulado para la demo.

---

# 4. Arquitectura general

```text
┌───────────────────────────────────────────────┐
│                MERCADONA SYNC                 │
│                React + TypeScript             │
├───────────────────────────────────────────────┤
│                                               │
│  PRESENTATION                                 │
│  ├── Login / Guest                            │
│  ├── Shopping List                            │
│  ├── Recommendations                          │
│  ├── Store Map                                │
│  ├── Navigation                               │
│  ├── Reports                                  │
│  └── Checkout                                 │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│  APPLICATION                                  │
│  ├── Shopping Session                         │
│  ├── Product Matching                         │
│  ├── Recommendation Service                   │
│  ├── Navigation Controller                    │
│  ├── Incident Manager                         │
│  └── Demo Scenario Controller                 │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│  DOMAIN                                       │
│  ├── Product                                  │
│  ├── Store                                    │
│  ├── Graph                                    │
│  ├── Shopping List                            │
│  ├── Route                                    │
│  ├── Incident                                 │
│  └── Checkout                                 │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│  INFRASTRUCTURE                               │
│  ├── JSON repositories                        │
│  ├── AI adapter                               │
│  ├── OCR adapter                              │
│  └── Local persistence                        │
│                                               │
└───────────────────────────────────────────────┘
```

La aplicación se divide conceptualmente en cuatro capas:

1. **Presentation**
2. **Application**
3. **Domain**
4. **Infrastructure**

No es necesario crear cuatro proyectos físicos independientes. La separación es lógica y sirve para mantener responsabilidades claras.

---

# 5. Estructura de carpetas propuesta

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── features/
│   ├── auth/
│   ├── shopping-list/
│   ├── recommendations/
│   ├── navigation/
│   ├── reports/
│   ├── checkout/
│   └── demo/
│
├── domain/
│   ├── product/
│   ├── store/
│   ├── route/
│   ├── incident/
│   └── session/
│
├── services/
│   ├── routing/
│   ├── product-matching/
│   ├── recommendations/
│   ├── incidents/
│   └── ocr/
│
├── repositories/
│   ├── productRepository.ts
│   ├── storeRepository.ts
│   ├── userRepository.ts
│   └── scenarioRepository.ts
│
├── store/
│   └── useAppStore.ts
│
├── components/
│   ├── common/
│   ├── map/
│   └── layout/
│
├── data/
│   ├── products.json
│   ├── users.json
│   ├── stores/
│   │   ├── store-01.json
│   │   └── store-02.json
│   └── scenarios/
│       ├── normal.json
│       ├── congestion.json
│       └── incident.json
│
├── types/
│   └── index.ts
│
└── utils/
```

La estructura final puede simplificarse durante el hackathon, pero deben mantenerse las responsabilidades principales.

---

# 6. Flujo de datos principal

```text
Usuario
   │
   ▼
Lista de compra
   │
   ▼
Product Matching
   │
   ▼
Productos confirmados
   │
   ├──────────────► Cross-selling IA
   │                    │
   │                    ▼
   │              Productos sugeridos
   │                    │
   └──────────────◄─────┘
   │
   ▼
Lista definitiva
   │
   ▼
Store Graph
   │
   ▼
Routing Engine
   │
   ▼
Ruta inicial
   │
   ▼
Navegación
   │
   ├── producto recogido
   ├── reporte nuevo
   ├── congestión
   ├── bloqueo
   └── cola
           │
           ▼
     Incident Manager
           │
           ▼
     Actualiza costes
           │
           ▼
      Routing Engine
           │
           ▼
      Nueva ruta
```

---

# 7. Estado global de la aplicación

El estado compartido debe ser pequeño y explícito.

Se propone utilizar Zustand.

## Estado mínimo

```ts
interface AppState {
  currentUser: User | null;
  currentStore: Store | null;
  shoppingList: ShoppingListItem[];
  activeRoute: Route | null;
  activeIncidents: Incident[];
  shoppingSession: ShoppingSession | null;
}
```

No debe almacenarse en el estado global información puramente visual, como:

- modales abiertos;
- pestañas;
- animaciones;
- estados de hover.

Esos estados deberán mantenerse dentro de los componentes correspondientes.

---

# 8. Sesión de compra

La unidad principal de ejecución será una `ShoppingSession`.

Una sesión representa:

- usuario o invitado;
- tienda seleccionada;
- lista definitiva;
- productos recogidos;
- productos pendientes;
- posición actual simulada;
- ruta activa;
- incidencias visibles;
- caja seleccionada;
- estado de la compra.

Flujo de estado:

```text
INITIAL
  │
  ▼
LIST_READY
  │
  ▼
RECOMMENDATIONS
  │
  ▼
READY_TO_NAVIGATE
  │
  ▼
NAVIGATING
  │
  ▼
CHECKOUT
  │
  ▼
COMPLETED
```

---

# 9. Catálogo de productos

El catálogo se cargará desde JSON local.

La aplicación utilizará productos reales para la demo, pero los datos necesarios estarán precargados.

Ejemplo conceptual:

```json
{
  "id": "prod_001",
  "name": "Leche semidesnatada Hacendado",
  "category": "Lácteos",
  "keywords": ["leche", "semidesnatada"],
  "image": "/products/prod_001.webp"
}
```

La ubicación no debe formar parte obligatoriamente del producto global.

Debe asociarse a la tienda:

```json
{
  "productId": "prod_001",
  "storeId": "store_01",
  "nodeId": "shelf_12"
}
```

Esto permite que un mismo producto se encuentre en posiciones diferentes según la tienda.

---

# 10. Representación de la tienda

Una tienda se modelará como dos elementos relacionados:

1. **representación visual**;
2. **grafo navegable**.

## Representación visual

El mapa mostrará:

- paredes;
- pasillos;
- estanterías;
- entrada;
- cajas;
- zonas transitables;
- productos;
- incidencias;
- ruta.

Se recomienda SVG porque permite:

- escalar correctamente en móvil;
- dibujar rutas;
- destacar zonas;
- modificar estilos dinámicamente;
- asociar elementos visuales con nodos del grafo.

---

# 11. Grafo de navegación

El supermercado se modelará internamente como un grafo.

## Nodo

Representa un punto navegable.

Ejemplos:

- entrada;
- intersección;
- extremo de pasillo;
- acceso a sección;
- caja;
- ubicación de producto.

```ts
interface GraphNode {
  id: string;
  x: number;
  y: number;
  type: NodeType;
}
```

## Arista

Representa una conexión transitable entre nodos.

```ts
interface GraphEdge {
  id: string;
  from: string;
  to: string;
  distance: number;
  baseTime: number;
}
```

La ruta visual se obtiene a partir de la secuencia de nodos devuelta por el motor.

---

# 12. Motor de rutas

El motor de rutas será un módulo puro de TypeScript.

No debe depender de React.

Entrada conceptual:

```ts
calculateRoute({
  graph,
  currentNode,
  targets,
  incidents,
  checkoutState
})
```

Salida:

```ts
interface RouteResult {
  nodePath: string[];
  orderedProducts: string[];
  estimatedTime: number;
  estimatedDistance: number;
}
```

---

# 13. Algoritmo de caminos

Para calcular caminos entre puntos se utilizará inicialmente **Dijkstra**.

A* podrá sustituirlo posteriormente si aporta alguna ventaja, pero no es necesario para el MVP.

El coste de una arista será dinámico.

Ejemplo conceptual:

```text
coste =
    tiempo_base
  + penalización_congestión
  + penalización_reposición
  + penalización_incidencias
```

Un tramo bloqueado tendrá:

```text
coste = infinito
```

y no podrá utilizarse.

---

# 14. Optimización de múltiples productos

El usuario no viaja simplemente de A a B.

Tiene que visitar varios productos.

Para el hackathon se utilizará una aproximación heurística:

1. calcular el coste desde la posición actual a cada producto pendiente;
2. seleccionar el siguiente producto con mejor coste;
3. mover virtualmente la posición;
4. repetir hasta completar la lista;
5. añadir como destino final la mejor caja.

Esta estrategia es similar a un **nearest-neighbour dinámico**.

No garantiza la solución matemáticamente óptima al problema global, pero:

- es rápida;
- es fácil de implementar;
- es fácil de explicar;
- permite reaccionar a incidencias;
- es suficiente para el prototipo.

La documentación y la presentación deberán hablar de **ruta optimizada** y no de "ruta matemáticamente óptima".

---

# 15. Modelo de coste dinámico

Cada arista tendrá un coste base.

Las incidencias modificarán dicho coste.

Ejemplo inicial:

```text
NORMAL               x1.0
RESTOCKING            x1.4
CONGESTION_LOW        x1.2
CONGESTION_MEDIUM     x1.8
CONGESTION_HIGH       x3.0
BLOCKED_AISLE         bloqueado
SPILL                 bloqueado
```

Los valores definitivos se podrán ajustar durante la demo.

Deben encontrarse centralizados en configuración, nunca dispersos dentro de los componentes.

Ejemplo:

```ts
const INCIDENT_WEIGHTS = {
  RESTOCKING: 1.4,
  CONGESTION_LOW: 1.2,
  CONGESTION_MEDIUM: 1.8,
  CONGESTION_HIGH: 3.0,
};
```

---

# 16. Productos agotados

`PRODUCT_OUT_OF_STOCK` no debe tratarse como una arista bloqueada.

Afecta al objetivo de compra.

Cuando un producto pendiente se reporta como agotado:

1. se marca como no disponible;
2. se elimina de la secuencia de navegación activa;
3. se informa al usuario;
4. la ruta se recalcula.

En una evolución posterior podrá proponerse una alternativa.

---

# 17. Cajas

Cada caja debe modelarse como un destino navegable.

Ejemplo:

```ts
interface Checkout {
  id: string;
  nodeId: string;
  queueMinutes: number;
  status: "OPEN" | "CLOSED";
}
```

Al terminar los productos, el motor deberá elegir la caja considerando:

```text
tiempo hasta la caja
+
tiempo estimado de cola
```

Esto permite que una caja más lejana resulte mejor que una cercana con mucha cola.

---

# 18. Sistema de incidencias

Las incidencias forman parte del estado dinámico de la tienda.

```ts
interface Incident {
  id: string;
  type: IncidentType;
  targetId: string;
  targetType: "EDGE" | "NODE" | "PRODUCT" | "CHECKOUT";
  severity: number;
  createdAt: string;
  expiresAt?: string;
}
```

Tipos iniciales:

```text
PRODUCT_OUT_OF_STOCK
CONGESTION
BLOCKED_AISLE
SPILL
RESTOCKING
LONG_CHECKOUT_QUEUE
```

Cada tipo debe definir cómo afecta al sistema.

---

# 19. Incident Manager

Toda modificación de la tienda provocada por reportes debe pasar por un único módulo.

Responsabilidades:

- crear reportes;
- eliminar reportes;
- validar estructura;
- determinar el efecto;
- actualizar costes;
- informar al motor de navegación;
- provocar recalculado cuando sea necesario.

Los componentes visuales nunca deben modificar directamente el grafo.

---

# 20. Reportes del usuario

El flujo debe requerir pocas interacciones.

Ejemplo:

```text
REPORTAR
   │
   ├── Producto agotado
   ├── Mucha gente
   ├── Pasillo bloqueado
   ├── Derrame
   ├── Reposición
   └── Cola larga
```

Después:

```text
Seleccionar ubicación
        │
        ▼
    Confirmar
```

El MVP no necesita comprobar que el reporte sea verdadero.

En una arquitectura futura podrían añadirse:

- votos;
- confirmaciones;
- reputación;
- caducidad automática;
- validación por trabajadores.

---

# 21. Recalculado de ruta

No todos los cambios requieren recalcular.

## Recalculado obligatorio

- tramo actual bloqueado;
- derrame en ruta;
- producto pendiente agotado;
- caja seleccionada cerrada;
- cambio importante en cola.

## Recalculado opcional

- congestión ligera;
- reposición;
- incidencia distante que no afecta a la ruta.

El `NavigationController` será responsable de decidir si una actualización requiere una nueva ruta.

---

# 22. Product Matching

La lista introducida por el usuario contendrá texto libre.

Ejemplo:

```text
leche
huevos
arroz
tomate
```

`ProductMatchingService` buscará coincidencias en el catálogo.

La primera versión puede utilizar:

- normalización a minúsculas;
- eliminación de tildes;
- keywords;
- coincidencia parcial;
- puntuación simple.

No es necesario utilizar IA para esta función.

Ejemplo:

```text
"leche semi"
     ↓
Leche semidesnatada Hacendado
```

Si existen varias coincidencias válidas, se mostrarán al usuario.

---

# 23. Cross-selling

El cross-selling se aislará detrás de una interfaz.

```ts
interface RecommendationProvider {
  getRecommendations(
    products: Product[]
  ): Promise<ProductRecommendation[]>;
}
```

Podrán existir varias implementaciones:

```text
AIRecommendationProvider
LocalRecommendationProvider
MockRecommendationProvider
```

Esto permite:

- usar IA cuando esté disponible;
- usar recomendaciones predefinidas durante la demo;
- cambiar de proveedor sin modificar la UI.

---

# 24. Fallback de IA

La demo nunca debe quedar bloqueada por la IA.

Si la llamada falla:

```text
AI Provider
    │
    X
    │
    ▼
Local Recommendation Provider
```

Las recomendaciones locales pueden almacenarse en JSON.

Ejemplo:

```json
{
  "pasta": ["queso rallado", "tomate frito"],
  "cafe": ["leche", "galletas"]
}
```

La interfaz no necesita indicar al usuario qué proveedor ha generado la recomendación.

---

# 25. OCR

El OCR se implementará como adaptador opcional.

```ts
interface OCRProvider {
  extractShoppingList(image: File): Promise<string[]>;
}
```

El resto del sistema solo recibe una lista de textos.

Por tanto:

```text
Imagen
  │
 OCR
  │
  ▼
["leche", "pan", "arroz"]
  │
  ▼
Product Matching
```

Si el OCR no se implementa, el resto de la aplicación no cambia.

---

# 26. Persistencia

Para el MVP se utilizará principalmente memoria de aplicación.

Podrá utilizarse `localStorage` para:

- recuperar una sesión accidentalmente cerrada;
- guardar preferencias de demo;
- persistir estado básico.

No se necesita base de datos para el flujo principal.

---

# 27. Repositorios de datos

Los componentes no deberán importar directamente archivos JSON.

El acceso debe hacerse mediante repositorios.

Ejemplo:

```ts
interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}
```

Implementación:

```text
JsonProductRepository
```

En el futuro podría sustituirse por:

```text
ApiProductRepository
```

sin modificar el dominio.

El mismo principio se aplica a:

- tiendas;
- usuarios;
- escenarios;
- configuraciones.

---

# 28. Modo demo

Debe existir un modo específico para garantizar una presentación estable.

El `DemoScenarioController` podrá cargar estados predecibles.

Ejemplos:

```text
NORMAL
CONGESTION
SPILL
OUT_OF_STOCK
LONG_QUEUE
```

Un escenario puede contener:

```json
{
  "id": "spill-demo",
  "incidents": [
    {
      "type": "SPILL",
      "targetId": "edge_14"
    }
  ]
}
```

Este sistema permitirá disparar un evento de forma controlada durante la presentación.

---

# 29. Panel de demo

Se recomienda incluir un panel oculto o una ruta especial, por ejemplo:

```text
/demo
```

Desde ahí podrá ejecutarse:

- crear congestión;
- provocar derrame;
- bloquear pasillo;
- marcar producto agotado;
- aumentar cola;
- limpiar incidencias.

Este panel no forma parte de la experiencia de usuario final.

Existe únicamente para:

- pruebas;
- desarrollo;
- presentación.

---

# 30. Comunicación en tiempo real

El MVP no necesita comunicación real entre varios dispositivos.

Los reportes pueden simularse dentro de una única instancia.

La arquitectura debe permitir que, en el futuro, el `IncidentRepository` se sustituya por un servicio remoto con:

- WebSocket;
- Server-Sent Events;
- backend en tiempo real.

Esta capacidad futura no debe implementarse si pone en riesgo el MVP.

---

# 31. Navegación visual

El mapa SVG será responsable únicamente de representar información.

Recibirá:

```ts
<StoreMap
  store={store}
  route={route}
  incidents={incidents}
  currentNode={currentNode}
/>
```

No debe contener:

- Dijkstra;
- cálculo de costes;
- búsqueda de productos;
- lógica de negocio.

Esto evita que el mapa se convierta en un componente imposible de mantener.

---

# 32. Pantallas principales

## `/`

Entrada.

Opciones:

- iniciar sesión;
- continuar como invitado.

## `/list`

Carga y edición de lista.

## `/recommendations`

Cross-selling.

## `/route`

Resumen previo del recorrido.

## `/navigation`

Navegación activa.

## `/finish`

Resumen final.

## `/demo`

Panel interno de simulación.

---

# 33. Dependencias entre módulos

```text
UI
 │
 ▼
Application Services
 │
 ▼
Domain Services
 │
 ├── Routing Engine
 │
 ├── Incident Rules
 │
 └── Product Matching
 │
 ▼
Repositories / Providers
 │
 ├── JSON
 ├── AI
 └── OCR
```

Regla:

> Una capa superior puede depender de una capa inferior, pero el dominio no debe depender de la interfaz.

---

# 34. Límites para agentes de IA

Los agentes deben respetar estos límites:

## Agente Frontend

Puede modificar:

```text
features/
components/
app/
```

No debe modificar el algoritmo de rutas sin coordinación.

## Agente Routing

Puede modificar:

```text
domain/route/
services/routing/
```

No debe modificar componentes visuales.

## Agente Data

Puede modificar:

```text
data/
repositories/
```

Debe respetar los modelos compartidos.

## Agente Reports

Puede modificar:

```text
features/reports/
services/incidents/
domain/incident/
```

## Agente Recommendations

Puede modificar:

```text
features/recommendations/
services/recommendations/
```

## Agente UX / Demo

Puede modificar:

```text
features/demo/
components/
```

Los contratos compartidos se definirán posteriormente en `COMPONENTS.md` y `DATA_MODEL.md`.

---

# 35. Testing mínimo

Dado el tiempo limitado, se priorizarán tests de lógica crítica.

## Deben probarse

### Routing

- encuentra un camino válido;
- evita una arista bloqueada;
- penaliza congestión;
- recalcula ante una incidencia.

### Shopping List

- carga productos;
- marca productos completados;
- elimina agotados.

### Product Matching

- encuentra coincidencias básicas;
- gestiona producto no encontrado.

### Checkout

- selecciona caja abierta;
- considera tiempo de cola.

No se exige cobertura completa del frontend.

---

# 36. Estrategia de desarrollo

Orden recomendado:

## Fase 1

Datos mínimos:

- productos;
- una tienda;
- grafo;
- usuarios.

## Fase 2

Ruta:

- Dijkstra;
- múltiples productos;
- caja.

## Fase 3

Interfaz:

- lista;
- mapa;
- navegación.

## Fase 4

Incidencias:

- reportes;
- costes dinámicos;
- recalculado.

## Fase 5

Cross-selling.

## Fase 6

Pulido de demo.

## Fase 7

Extras:

- OCR;
- segunda tienda;
- feedback;
- mejoras visuales.

---

# 37. Restricciones

La arquitectura debe evitar:

- dependencias circulares;
- lógica de negocio dentro de componentes React;
- acceso directo a JSON desde componentes;
- datos hardcodeados dentro del mapa;
- algoritmos dentro de la UI;
- llamadas directas a proveedores de IA desde componentes;
- necesidad de Internet para navegar por la tienda;
- añadir infraestructura que no pueda probarse antes de la demo.

---

# 38. Decisiones explícitas

## ADR-001 — React + TypeScript como runtime principal

Motivo:

- velocidad de desarrollo;
- interfaz móvil;
- ecosistema;
- facilidad para trabajar con agentes de IA;
- capacidad para implementar también la lógica de rutas.

---

## ADR-002 — Datos de demo en JSON

Motivo:

- facilidad de edición;
- ausencia de infraestructura;
- control total de la demo;
- facilidad para generar diferentes escenarios.

---

## ADR-003 — Routing en TypeScript

Motivo:

El algoritmo debe ejecutarse inmediatamente y forma parte del flujo principal.

Evitar una llamada a backend reduce complejidad y puntos de fallo.

---

## ADR-004 — Python como herramienta auxiliar

Python puede utilizarse para procesamiento, scripts y módulos opcionales, pero no será una dependencia obligatoria del flujo principal.

---

## ADR-005 — SVG para mapa

Motivo:

- responsive;
- sencillo;
- interactivo;
- permite representar grafo, rutas e incidencias;
- no requiere librerías cartográficas.

---

## ADR-006 — IA desacoplada

El sistema dependerá de una interfaz de recomendaciones y no de un proveedor concreto.

---

## ADR-007 — Sin backend obligatorio

El MVP debe poder ejecutarse íntegramente en el navegador.

Un backend podrá añadirse únicamente si aparece una necesidad real durante el desarrollo.

---

# 39. Evolución futura

La arquitectura permite añadir posteriormente:

- API real de productos;
- autenticación de Mercadona;
- sincronización con la lista oficial;
- posicionamiento indoor;
- datos reales de stock;
- sensorización;
- reportes multiusuario en tiempo real;
- panel para trabajadores;
- analítica agregada;
- optimización global de flujo;
- recomendaciones personalizadas;
- historial del usuario;
- múltiples supermercados reales.

Estas capacidades no forman parte del MVP del hackathon.

---

# 40. Criterio arquitectónico principal

Ante cualquier decisión técnica durante el hackathon debe aplicarse esta regla:

> Si una solución hace la demo más compleja, más frágil o más dependiente de servicios externos sin aportar un beneficio claramente visible para el jurado, no debe incorporarse al MVP.

La arquitectura de Mercadona Sync debe optimizar el tiempo de desarrollo del equipo del mismo modo que el producto pretende optimizar el tiempo de compra del cliente.
