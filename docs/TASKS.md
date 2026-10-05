# TASKS.md

## 1. Propósito

Este documento convierte la planificación de **Mercadona Sync** en tareas concretas, pequeñas y asignables a personas o agentes de IA.

Debe leerse junto a:

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `DATA_MODEL.md`
- `AGENTS.md`
- `DEVELOPMENT_PLAN.md`

Cada tarea incluye:

- identificador;
- prioridad;
- bloque responsable;
- dependencias;
- objetivo;
- criterios de aceptación.

---

# 2. Convenciones

## Prioridades

```text
P0 = obligatorio para el MVP
P1 = importante si P0 está estable
P2 = opcional
P3 = solo si sobra tiempo
```

## Estados recomendados

```text
TODO
IN_PROGRESS
INTEGRATION
DONE
BLOCKED
```

## Bloques

```text
CORE
UI
DATA
ROUTING
MAP
INCIDENTS
RECOMMENDATIONS
DEMO
QA
OCR
```

---

# 3. Regla general

Una tarea no pasa a `DONE` hasta que:

- compila;
- funciona de forma aislada;
- está integrada;
- respeta los contratos compartidos;
- no rompe el flujo principal;
- cumple sus criterios de aceptación.

---

# 4. Fase 0 — Preparación

## TASK-001 — Inicializar proyecto

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** ninguna

### Objetivo

Crear el proyecto base con:

```text
React
TypeScript
Vite
```

### Criterios de aceptación

- [ ] `npm install` funciona.
- [ ] `npm run dev` arranca.
- [ ] `npm run build` funciona.
- [ ] Existe estructura inicial de `src/`.

---

## TASK-002 — Instalar dependencias base

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** TASK-001

### Dependencias previstas

```text
react-router-dom
zustand
```

Opcional:

```text
zod
```

### Criterios de aceptación

- [ ] Dependencias instaladas.
- [ ] No se añaden librerías innecesarias.
- [ ] El proyecto sigue compilando.

---

## TASK-003 — Crear estructura de carpetas

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** TASK-001

### Objetivo

Crear:

```text
src/app/
src/features/
src/domain/
src/services/
src/repositories/
src/components/
src/data/
src/store/
src/types/
src/utils/
```

### Criterios de aceptación

- [ ] La estructura coincide con `ARCHITECTURE.md`.
- [ ] No existen carpetas duplicadas para la misma responsabilidad.

---

## TASK-004 — Implementar tipos compartidos

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-003

### Objetivo

Crear en `src/types/` los contratos definidos en `DATA_MODEL.md`.

### Criterios de aceptación

- [ ] `Product`.
- [ ] `Store`.
- [ ] `StoreGraph`.
- [ ] `GraphNode`.
- [ ] `GraphEdge`.
- [ ] `ProductLocation`.
- [ ] `Checkout`.
- [ ] `ShoppingListItem`.
- [ ] `ShoppingSession`.
- [ ] `RouteInput`.
- [ ] `RouteResult`.
- [ ] `Incident`.
- [ ] `ProductRecommendation`.
- [ ] `DemoScenario`.

---

# 5. Fase 1 — Datos

## TASK-010 — Crear catálogo de productos

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-004

### Objetivo

Crear un catálogo local de entre 20 y 40 productos utilizados en la demo.

### Criterios de aceptación

- [ ] Productos con ID único.
- [ ] Nombre.
- [ ] Categoría.
- [ ] Keywords.
- [ ] Imagen opcional.
- [ ] Datos válidos según `Product`.

---

## TASK-011 — Crear categorías

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-004

### Categorías mínimas sugeridas

```text
Frutas y verduras
Lácteos
Huevos
Bebidas
Alimentación seca
Refrigerados
Limpieza
Panadería
```

### Criterios de aceptación

- [ ] Todos los productos usados tienen categoría válida.

---

## TASK-012 — Crear usuarios demo

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-004

### Objetivo

Crear al menos tres perfiles ficticios.

### Criterios de aceptación

- [ ] IDs únicos.
- [ ] Nombre visible.
- [ ] Lista asociada.
- [ ] No hay datos personales reales.

---

## TASK-013 — Crear listas demo

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-010, TASK-012

### Objetivo

Crear varias listas.

La principal debe contener entre 6 y 8 productos.

### Criterios de aceptación

- [ ] Lista principal apta para demo.
- [ ] Todos los productos existen.
- [ ] Hay productos repartidos por distintas zonas.

---

## TASK-014 — Diseñar tienda demo

**Prioridad:** P0  
**Bloque:** DATA / MAP  
**Dependencias:** TASK-004

### Objetivo

Diseñar una tienda desde vista superior.

Debe contener:

- entrada;
- pasillos;
- estanterías;
- zonas;
- cajas;
- múltiples recorridos posibles.

### Criterios de aceptación

- [ ] Existe al menos un camino alternativo entre zonas.
- [ ] Un bloqueo puede provocar una ruta visualmente distinta.
- [ ] Hay al menos tres cajas.

---

## TASK-015 — Crear grafo de tienda

**Prioridad:** P0  
**Bloque:** DATA / ROUTING  
**Dependencias:** TASK-014

### Criterios de aceptación

- [ ] Todos los nodos tienen coordenadas.
- [ ] Todas las aristas apuntan a nodos existentes.
- [ ] El grafo es navegable desde la entrada a todos los productos P0.
- [ ] Existen rutas alternativas.

---

## TASK-016 — Ubicar productos

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-010, TASK-015

### Criterios de aceptación

- [ ] Todos los productos de las listas demo tienen `ProductLocation`.
- [ ] Los nodos de ubicación existen.
- [ ] La distribución resulta visualmente razonable.

---

## TASK-017 — Configurar cajas

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-015

### Criterios de aceptación

- [ ] Al menos tres cajas.
- [ ] Todas tienen nodo.
- [ ] Al menos una caja puede configurarse con cola alta.
- [ ] Una caja puede cerrarse durante demo.

---

## TASK-018 — Crear repositorios JSON

**Prioridad:** P0  
**Bloque:** DATA  
**Dependencias:** TASK-010 a TASK-017

### Implementar

```text
ProductRepository
StoreRepository
UserRepository
ScenarioRepository
```

### Criterios de aceptación

- [ ] Los componentes no importan JSON directamente.
- [ ] Los repositorios devuelven los tipos definidos.

---

# 6. Fase 2 — Product Matching

## TASK-020 — Normalizador de texto

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** TASK-004

### Debe hacer

- minúsculas;
- eliminar tildes;
- recortar espacios;
- normalizar texto básico.

### Criterios de aceptación

Ejemplo:

```text
"Leche Semidesnatada"
→
"leche semidesnatada"
```

---

## TASK-021 — ProductMatchingService

**Prioridad:** P0  
**Bloque:** DATA / CORE  
**Dependencias:** TASK-010, TASK-018, TASK-020

### Criterios de aceptación

- [ ] Exact match.
- [ ] Partial match.
- [ ] Keywords.
- [ ] Devuelve score.
- [ ] No usa IA.

---

## TASK-022 — Resolver coincidencias ambiguas

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-021

### Criterios de aceptación

Si el usuario escribe:

```text
queso
```

se muestran varias opciones cuando corresponda.

---

# 7. Fase 3 — Motor de rutas

## TASK-030 — GraphService

**Prioridad:** P0  
**Bloque:** ROUTING  
**Dependencias:** TASK-004, TASK-015

### Implementar

```text
getNode
getNeighbors
getEdges
getEdge
```

### Criterios de aceptación

- [ ] Acceso correcto al grafo.
- [ ] Manejo de IDs inexistentes.

---

## TASK-031 — RouteCostCalculator básico

**Prioridad:** P0  
**Bloque:** ROUTING  
**Dependencias:** TASK-030

### Objetivo

Calcular coste base de una arista sin incidencias.

### Criterios de aceptación

- [ ] Utiliza `baseTime`.
- [ ] Nunca devuelve valor negativo.

---

## TASK-032 — Dijkstra

**Prioridad:** P0  
**Bloque:** ROUTING  
**Dependencias:** TASK-030, TASK-031

### Criterios de aceptación

- [ ] Encuentra camino mínimo.
- [ ] Devuelve `PathResult`.
- [ ] Maneja destino inalcanzable.
- [ ] No depende de React.

---

## TASK-033 — Tests Dijkstra

**Prioridad:** P0  
**Bloque:** ROUTING / QA  
**Dependencias:** TASK-032

### Casos mínimos

- [ ] Camino simple.
- [ ] Dos caminos con costes distintos.
- [ ] Nodo aislado.
- [ ] Arista bloqueada.

---

## TASK-034 — MultiStopRoutePlanner

**Prioridad:** P0  
**Bloque:** ROUTING  
**Dependencias:** TASK-032, TASK-016

### Estrategia

Nearest-neighbour dinámico.

### Criterios de aceptación

- [ ] Ordena múltiples productos.
- [ ] Devuelve ruta completa.
- [ ] Incluye productos en orden de visita.
- [ ] Parte desde nodo actual.

---

## TASK-035 — CheckoutSelector

**Prioridad:** P0  
**Bloque:** ROUTING  
**Dependencias:** TASK-032, TASK-017

### Cálculo

```text
tiempo hasta caja + cola
```

### Criterios de aceptación

- [ ] Ignora cajas cerradas.
- [ ] Puede elegir una caja más lejana si su cola compensa.

---

## TASK-036 — RoutingEngine

**Prioridad:** P0  
**Bloque:** ROUTING  
**Dependencias:** TASK-034, TASK-035

### Criterios de aceptación

- [ ] Acepta `RouteInput`.
- [ ] Devuelve `RouteResult`.
- [ ] Incluye caja final.
- [ ] Devuelve tiempo y distancia estimados.

---

# 8. Fase 4 — Incidencias

## TASK-040 — IncidentRules

**Prioridad:** P0  
**Bloque:** INCIDENTS  
**Dependencias:** TASK-004

### Implementar primero

```text
SPILL
CONGESTION
PRODUCT_OUT_OF_STOCK
LONG_CHECKOUT_QUEUE
```

### Después

```text
BLOCKED_AISLE
RESTOCKING
```

---

## TASK-041 — Aplicar incidentes al coste

**Prioridad:** P0  
**Bloque:** INCIDENTS / ROUTING  
**Dependencias:** TASK-031, TASK-040

### Criterios de aceptación

- [ ] `SPILL` bloquea.
- [ ] `BLOCKED_AISLE` bloquea.
- [ ] `CONGESTION` penaliza.
- [ ] `RESTOCKING` penaliza.

---

## TASK-042 — Producto agotado

**Prioridad:** P0  
**Bloque:** INCIDENTS  
**Dependencias:** TASK-040

### Criterios de aceptación

- [ ] Marca producto como no disponible.
- [ ] Lo elimina de objetivos pendientes.
- [ ] Solicita recalculado.

---

## TASK-043 — Cola larga

**Prioridad:** P0  
**Bloque:** INCIDENTS / ROUTING  
**Dependencias:** TASK-035, TASK-040

### Criterios de aceptación

- [ ] Modifica `queueMinutes`.
- [ ] Puede provocar cambio de caja recomendada.

---

## TASK-044 — IncidentManager

**Prioridad:** P0  
**Bloque:** INCIDENTS  
**Dependencias:** TASK-040

### Criterios de aceptación

- [ ] Crear incidencia.
- [ ] Eliminar incidencia.
- [ ] Obtener activas.
- [ ] Validar target.

---

## TASK-045 — RouteRecalculationPolicy

**Prioridad:** P0  
**Bloque:** INCIDENTS / ROUTING  
**Dependencias:** TASK-041 a TASK-044

### Criterios de aceptación

Recalcula cuando:

- [ ] bloqueo afecta a ruta;
- [ ] derrame afecta a ruta;
- [ ] producto pendiente queda agotado;
- [ ] cambia de forma importante una caja.

---

# 9. Fase 5 — UI inicial

## TASK-050 — Configurar router

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-001

### Rutas

```text
/
/list
/recommendations
/route
/navigation
/finish
/demo
```

---

## TASK-051 — LandingPage

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-050, TASK-012

### Criterios de aceptación

- [ ] Seleccionar usuario demo.
- [ ] Continuar como invitado.

---

## TASK-052 — ShoppingListPage

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-021, TASK-051

### Criterios de aceptación

- [ ] Ver lista de usuario.
- [ ] Introducir texto manual.
- [ ] Añadir/eliminar.
- [ ] Confirmar lista.

---

## TASK-053 — ManualListInput

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-052

### Criterios de aceptación

Acepta:

```text
leche, huevos, arroz
```

y listas por líneas.

---

## TASK-054 — ProductMatchSelector

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-022

### Criterios de aceptación

- [ ] Permite resolver ambigüedades.
- [ ] Permite cancelar elemento.

---

# 10. Fase 6 — Recomendaciones

## TASK-060 — LocalRecommendationProvider

**Prioridad:** P0  
**Bloque:** RECOMMENDATIONS  
**Dependencias:** TASK-010

### Criterios de aceptación

- [ ] Recomendaciones deterministas.
- [ ] Solo productos existentes.
- [ ] No más de 3 sugerencias.

---

## TASK-061 — RecommendationService

**Prioridad:** P0  
**Bloque:** RECOMMENDATIONS  
**Dependencias:** TASK-060

### Criterios de aceptación

- [ ] Interfaz común.
- [ ] Fallback local.
- [ ] Manejo de errores.

---

## TASK-062 — RecommendationsPage

**Prioridad:** P0  
**Bloque:** UI / RECOMMENDATIONS  
**Dependencias:** TASK-061

### Criterios de aceptación

- [ ] Aceptar.
- [ ] Rechazar.
- [ ] Continuar sin aceptar.
- [ ] Actualizar lista.

---

## TASK-063 — AIRecommendationProvider

**Prioridad:** P1  
**Bloque:** RECOMMENDATIONS  
**Dependencias:** TASK-061

### Criterios de aceptación

- [ ] Timeout.
- [ ] Error controlado.
- [ ] Validación contra catálogo.
- [ ] Fallback automático.

---

# 11. Fase 7 — Mapa

## TASK-070 — StoreMap base

**Prioridad:** P0  
**Bloque:** MAP  
**Dependencias:** TASK-014

### Criterios de aceptación

- [ ] SVG responsive.
- [ ] Representa límites y zonas.

---

## TASK-071 — StoreLayout visual

**Prioridad:** P0  
**Bloque:** MAP  
**Dependencias:** TASK-070

### Criterios de aceptación

- [ ] Pasillos.
- [ ] Estanterías.
- [ ] Entrada.
- [ ] Cajas.

---

## TASK-072 — RouteOverlay

**Prioridad:** P0  
**Bloque:** MAP  
**Dependencias:** TASK-036, TASK-070

### Criterios de aceptación

- [ ] Recibe `nodePath`.
- [ ] Dibuja la ruta.
- [ ] No calcula rutas.

---

## TASK-073 — CurrentPositionMarker

**Prioridad:** P0  
**Bloque:** MAP  
**Dependencias:** TASK-070

### Criterios de aceptación

- [ ] Posición visible.
- [ ] Puede actualizarse.

---

## TASK-074 — ProductMarker

**Prioridad:** P0  
**Bloque:** MAP  
**Dependencias:** TASK-016, TASK-070

### Criterios de aceptación

- [ ] Destaca próximo producto.
- [ ] Permite representar pendientes.

---

## TASK-075 — IncidentMarker

**Prioridad:** P0  
**Bloque:** MAP / INCIDENTS  
**Dependencias:** TASK-044, TASK-070

### Criterios de aceptación

- [ ] Incidencia visible.
- [ ] Tipos distinguibles.

---

## TASK-076 — CheckoutMarker

**Prioridad:** P0  
**Bloque:** MAP  
**Dependencias:** TASK-017, TASK-070

### Criterios de aceptación

- [ ] Estado de cajas visible.
- [ ] Cola representable.

---

# 12. Fase 8 — Navegación

## TASK-080 — AppStore

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** TASK-004

### Estado mínimo

```text
currentUser
currentStore
shoppingSession
activeRoute
activeIncidents
```

---

## TASK-081 — ShoppingSessionManager

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** TASK-080

### Criterios de aceptación

- [ ] Iniciar sesión de compra.
- [ ] Confirmar lista.
- [ ] Iniciar navegación.
- [ ] Recoger producto.
- [ ] Finalizar.

---

## TASK-082 — RouteSummaryPage

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-036, TASK-081

### Criterios de aceptación

- [ ] Muestra productos.
- [ ] Tiempo estimado.
- [ ] Permite comenzar.

---

## TASK-083 — NavigationController

**Prioridad:** P0  
**Bloque:** CORE / ROUTING  
**Dependencias:** TASK-036, TASK-045, TASK-081

### Criterios de aceptación

- [ ] Producto recogido actualiza sesión.
- [ ] Incidencia puede invalidar ruta.
- [ ] Solicita recalculado.
- [ ] Detecta fase de caja.

---

## TASK-084 — NavigationPage

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-070 a TASK-076, TASK-083

### Debe mostrar

- [ ] mapa;
- [ ] ruta;
- [ ] siguiente producto;
- [ ] progreso;
- [ ] botón recogido;
- [ ] botón reporte.

---

## TASK-085 — NextProductCard

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-084

### Criterios de aceptación

- [ ] Nombre.
- [ ] Ubicación.
- [ ] Acción "Recogido".

---

## TASK-086 — ProgressIndicator

**Prioridad:** P1  
**Bloque:** UI  
**Dependencias:** TASK-084

---

## TASK-087 — RouteUpdateNotice

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-083

### Ejemplo

```text
Ruta actualizada
Evitamos el pasillo 4 por un derrame.
```

---

# 13. Fase 9 — Reportes

## TASK-090 — ReportButton

**Prioridad:** P0  
**Bloque:** INCIDENTS / UI  
**Dependencias:** TASK-084

---

## TASK-091 — ReportModal

**Prioridad:** P0  
**Bloque:** INCIDENTS / UI  
**Dependencias:** TASK-090, TASK-044

### Tipos mínimos

```text
Producto agotado
Mucha gente
Derrame
Cola larga
```

---

## TASK-092 — Selección de ubicación

**Prioridad:** P0  
**Bloque:** INCIDENTS / MAP  
**Dependencias:** TASK-091

### Criterios de aceptación

El reporte debe asociarse a:

```text
EDGE
PRODUCT
CHECKOUT
```

según tipo.

---

## TASK-093 — Integrar reporte con recalculado

**Prioridad:** P0  
**Bloque:** INCIDENTS / ROUTING  
**Dependencias:** TASK-045, TASK-091

### Criterios de aceptación

```text
Crear SPILL
↓
IncidentManager
↓
Routing
↓
Nueva Route
↓
Mapa actualizado
```

---

# 14. Fase 10 — Caja y finalización

## TASK-100 — Fase de checkout

**Prioridad:** P0  
**Bloque:** ROUTING / UI  
**Dependencias:** TASK-035, TASK-083

### Criterios de aceptación

- [ ] Se activa al recoger último producto.
- [ ] Selecciona mejor caja.
- [ ] Dibuja ruta hacia caja.

---

## TASK-101 — FinishPage

**Prioridad:** P0  
**Bloque:** UI  
**Dependencias:** TASK-100

### Criterios de aceptación

- [ ] Finaliza sesión.
- [ ] Muestra resumen simple.
- [ ] Permite reiniciar.

---

# 15. Fase 11 — Demo

## TASK-110 — DemoPanel

**Prioridad:** P0  
**Bloque:** DEMO  
**Dependencias:** TASK-044, TASK-080

### Acciones mínimas

```text
Crear derrame
Crear congestión
Agotar producto
Aumentar cola
Reset
```

---

## TASK-111 — Escenario NORMAL

**Prioridad:** P0  
**Bloque:** DEMO  
**Dependencias:** TASK-110

---

## TASK-112 — Escenario SPILL

**Prioridad:** P0  
**Bloque:** DEMO  
**Dependencias:** TASK-093, TASK-110

### Criterios de aceptación

- [ ] Bloquea tramo utilizado.
- [ ] Produce una ruta alternativa visible.

---

## TASK-113 — Escenario CONGESTION

**Prioridad:** P1  
**Bloque:** DEMO  
**Dependencias:** TASK-041, TASK-110

---

## TASK-114 — Escenario OUT_OF_STOCK

**Prioridad:** P1  
**Bloque:** DEMO  
**Dependencias:** TASK-042, TASK-110

---

## TASK-115 — Escenario LONG_QUEUE

**Prioridad:** P1  
**Bloque:** DEMO  
**Dependencias:** TASK-043, TASK-110

---

## TASK-116 — Reset completo

**Prioridad:** P0  
**Bloque:** DEMO  
**Dependencias:** TASK-110

### Debe restaurar

- [ ] sesión;
- [ ] ruta;
- [ ] incidencias;
- [ ] cajas;
- [ ] productos;
- [ ] recomendaciones.

---

# 16. Fase 12 — Persistencia y resiliencia

## TASK-120 — LocalPersistence básica

**Prioridad:** P1  
**Bloque:** CORE  
**Dependencias:** TASK-081

### Criterios de aceptación

- [ ] Puede restaurar sesión básica.
- [ ] No rompe demo.

---

## TASK-121 — ErrorBoundary

**Prioridad:** P1  
**Bloque:** CORE  
**Dependencias:** TASK-001

---

## TASK-122 — Manejo de errores de servicios

**Prioridad:** P0  
**Bloque:** CORE  
**Dependencias:** TASK-061

### Criterios de aceptación

- [ ] IA falla → fallback.
- [ ] Producto no encontrado → mensaje.
- [ ] Ruta imposible → mensaje.
- [ ] Reporte inválido → se rechaza.

---

# 17. Fase 13 — OCR opcional

## TASK-130 — OCRProvider

**Prioridad:** P2  
**Bloque:** OCR  
**Dependencias:** TASK-052

### Contrato

```ts
extractShoppingList(image: File): Promise<string[]>
```

---

## TASK-131 — OCRInput UI

**Prioridad:** P2  
**Bloque:** OCR / UI  
**Dependencias:** TASK-130

---

## TASK-132 — Integrar OCR con Product Matching

**Prioridad:** P2  
**Bloque:** OCR  
**Dependencias:** TASK-021, TASK-130

### Regla

Si OCR falla:

```text
entrada manual sigue disponible
```

---

# 18. Fase 14 — Segunda tienda

## TASK-140 — Crear store_02

**Prioridad:** P2  
**Bloque:** DATA  
**Dependencias:** TASK-014 a TASK-017

### Criterios de aceptación

- [ ] Layout diferente.
- [ ] Grafo diferente.
- [ ] Mismos productos pueden cambiar de ubicación.

---

## TASK-141 — Selector de tienda demo

**Prioridad:** P2  
**Bloque:** UI  
**Dependencias:** TASK-140

---

## TASK-142 — Verificar motor con store_02

**Prioridad:** P2  
**Bloque:** QA / ROUTING  
**Dependencias:** TASK-140

### Criterio

El routing funciona sin cambios de código específico.

---

# 19. Fase 15 — QA crítico

## TASK-150 — Test flujo usuario demo

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** flujo completo

### Flujo

```text
Usuario
→ lista
→ recomendaciones
→ ruta
→ navegación
→ derrame
→ recalculado
→ caja
→ finish
```

---

## TASK-151 — Test flujo invitado

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** TASK-052, TASK-021

---

## TASK-152 — Test routing con derrame

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** TASK-093

---

## TASK-153 — Test producto agotado

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** TASK-042

---

## TASK-154 — Test caja congestionada

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** TASK-043

---

## TASK-155 — Test fallo IA

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** TASK-061

### Criterio

La demo continúa usando fallback.

---

## TASK-156 — Test build

**Prioridad:** P0  
**Bloque:** QA  
**Dependencias:** integración final

### Ejecutar

```bash
npm run build
```

---

# 20. Fase 16 — Pulido de demo

## TASK-160 — Responsive móvil

**Prioridad:** P1  
**Bloque:** UI / QA  
**Dependencias:** UI integrada

---

## TASK-161 — Vista de escritorio

**Prioridad:** P1  
**Bloque:** UI / QA  
**Dependencias:** TASK-160

### Objetivo

Que la demo se vea correctamente proyectada.

---

## TASK-162 — Mejorar transición de ruta

**Prioridad:** P1  
**Bloque:** MAP  
**Dependencias:** TASK-072, TASK-093

### Objetivo

Hacer evidente el cambio de ruta sin introducir complejidad crítica.

---

## TASK-163 — Mejorar iconografía de incidencias

**Prioridad:** P1  
**Bloque:** MAP / UI  
**Dependencias:** TASK-075

---

## TASK-164 — Revisar textos visibles

**Prioridad:** P1  
**Bloque:** UI  
**Dependencias:** integración

### Criterios

- textos cortos;
- comprensibles;
- sin lenguaje técnico;
- sin referencias a datos simulados como reales.

---

# 21. Fase 17 — Preparación final

## TASK-170 — Feature Freeze

**Prioridad:** P0  
**Bloque:** TODOS

### Objetivo

No añadir funcionalidades grandes desde este punto.

---

## TASK-171 — Preparar build de backup

**Prioridad:** P0  
**Bloque:** CORE / QA  
**Dependencias:** TASK-156

---

## TASK-172 — Ensayo funcional

**Prioridad:** P0  
**Bloque:** TODOS  
**Dependencias:** TASK-150

---

## TASK-173 — Ensayo con discurso

**Prioridad:** P0  
**Bloque:** TODOS  
**Dependencias:** TASK-172

---

## TASK-174 — Ensayo final

**Prioridad:** P1  
**Bloque:** TODOS  
**Dependencias:** TASK-173

---

# 22. Backlog de ampliaciones

No comenzar hasta terminar P0.

## TASK-200 — Confirmación colaborativa de reportes

**Prioridad:** P2

---

## TASK-201 — Alternativas para agotados

**Prioridad:** P2

---

## TASK-202 — Métrica de tiempo ahorrado

**Prioridad:** P2

---

## TASK-203 — Feedback final mediante IA

**Prioridad:** P3

---

## TASK-204 — Vista conceptual para trabajadores

**Prioridad:** P3

---

# 23. Dependencias críticas resumidas

```text
TASK-004 Types
    │
    ├── DATA
    │    └── TASK-015 Graph
    │            │
    │            ▼
    │       TASK-032 Dijkstra
    │            │
    │            ▼
    │       TASK-036 RoutingEngine
    │            │
    │            ├── TASK-072 RouteOverlay
    │            └── TASK-083 NavigationController
    │                         │
    │                         ▼
    │                    TASK-093 Recalculation
    │
    └── TASK-044 IncidentManager
                 │
                 └────────────► TASK-093
```

---

# 24. Asignación sugerida por persona

## Persona A — UI Flow

```text
TASK-050
TASK-051
TASK-052
TASK-053
TASK-054
TASK-062
TASK-082
TASK-101
```

## Persona B — Map

```text
TASK-070
TASK-071
TASK-072
TASK-073
TASK-074
TASK-075
TASK-076
TASK-162
```

## Persona C — Routing

```text
TASK-030
TASK-031
TASK-032
TASK-033
TASK-034
TASK-035
TASK-036
```

## Persona D — Incidents

```text
TASK-040
TASK-041
TASK-042
TASK-043
TASK-044
TASK-045
TASK-090
TASK-091
TASK-093
```

## Persona E — Data

```text
TASK-004
TASK-010
TASK-011
TASK-012
TASK-013
TASK-014
TASK-015
TASK-016
TASK-017
TASK-018
TASK-020
TASK-021
```

## Persona F — Integration / Demo / AI

```text
TASK-060
TASK-061
TASK-063
TASK-080
TASK-081
TASK-110
TASK-111
TASK-112
TASK-116
QA e integración
```

---

# 25. Primer paquete de tareas para agentes

Se recomienda empezar con estos prompts independientes:

```text
A1 → TASK-004
A2 → TASK-010 + TASK-011
A3 → TASK-030 + TASK-032
A4 → TASK-070
A5 → TASK-040
A6 → TASK-050
```

Una vez integrados:

```text
A1 → TASK-015
A2 → TASK-021
A3 → TASK-034 + TASK-036
A4 → TASK-072
A5 → TASK-044 + TASK-045
A6 → TASK-052
```

---

# 26. Tareas bloqueantes

Estas tareas no deben retrasarse:

```text
TASK-004
TASK-015
TASK-032
TASK-036
TASK-070
TASK-072
TASK-044
TASK-083
TASK-093
```

Si alguna queda bloqueada, el equipo debe reasignar personas inmediatamente.

---

# 27. Criterio de corte

Si se llega a las 12:30 sin:

```text
ruta
+
mapa
+
incidencia
+
recalculado
```

se cancelan temporalmente:

```text
AI real
OCR
segunda tienda
animaciones
mejoras visuales no esenciales
```

---

# 28. MVP terminado

El MVP se considera terminado cuando están completadas como mínimo:

```text
TASK-001
TASK-004
TASK-010
TASK-012
TASK-013
TASK-014
TASK-015
TASK-016
TASK-017
TASK-018
TASK-020
TASK-021
TASK-030
TASK-031
TASK-032
TASK-034
TASK-035
TASK-036
TASK-040
TASK-041
TASK-042
TASK-043
TASK-044
TASK-045
TASK-050
TASK-051
TASK-052
TASK-053
TASK-060
TASK-061
TASK-062
TASK-070
TASK-071
TASK-072
TASK-073
TASK-074
TASK-075
TASK-076
TASK-080
TASK-081
TASK-082
TASK-083
TASK-084
TASK-085
TASK-087
TASK-090
TASK-091
TASK-093
TASK-100
TASK-101
TASK-110
TASK-112
TASK-116
TASK-150
TASK-151
TASK-152
TASK-155
TASK-156
```

---

# 29. Regla final

El tablero debe reflejar trabajo realmente integrado.

> Una tarea empezada no aporta valor a la demo. Una tarea integrada sí.

Durante el hackathon, el equipo debe priorizar cerrar tareas P0 y mantener siempre un flujo ejecutable de Mercadona Sync.
