# AGENTS.md

## 1. Propósito

Este documento define cómo deben trabajar los agentes de IA y los miembros del equipo sobre **Mercadona Sync**.

Su objetivo es reducir conflictos, evitar decisiones incompatibles y mantener una única dirección técnica durante el hackathon.

Debe leerse junto a:

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `DATA_MODEL.md`

Los agentes deben utilizar estos documentos como fuente de verdad antes de modificar el proyecto.

---

# 2. Regla principal

Antes de implementar cualquier cambio, el agente debe comprobar:

1. qué requisito funcional está resolviendo;
2. qué componente es responsable;
3. qué modelos de datos utiliza;
4. qué archivos puede modificar;
5. si el cambio afecta a contratos compartidos;
6. si existe una solución más simple compatible con el MVP.

Principio general:

> No añadir complejidad que no produzca un beneficio visible en la demo o que no sea necesaria para completar el flujo principal.

---

# 3. Orden de autoridad documental

Si existe una contradicción, debe aplicarse este orden:

```text
1. PRODUCT_REQUIREMENTS.md
2. ARCHITECTURE.md
3. DATA_MODEL.md
4. COMPONENTS.md
5. AGENTS.md
6. Código existente
```

Si el código contradice un documento superior, el agente no debe asumir automáticamente que el código es correcto.

Debe detener el cambio y señalar la discrepancia.

---

# 4. Objetivo del MVP

Todo trabajo debe proteger el siguiente flujo:

```text
Entrada
  ↓
Usuario identificado o invitado
  ↓
Lista de compra
  ↓
Matching con productos
  ↓
Cross-selling
  ↓
Lista definitiva
  ↓
Mapa de tienda
  ↓
Ruta optimizada
  ↓
Navegación
  ↓
Reporte / incidencia
  ↓
Recalculado de ruta
  ↓
Selección de caja
  ↓
Finalización
```

Si una tarea secundaria pone en riesgo este flujo, debe posponerse.

---

# 5. Prioridades

## P0 — Obligatorio

- flujo completo;
- catálogo local;
- lista;
- product matching;
- mapa;
- grafo;
- motor de rutas;
- navegación;
- incidencias;
- recalculado;
- selección de caja;
- demo estable.

## P1 — Importante

- IA para cross-selling;
- pulido visual;
- mensajes de recalculado;
- escenarios de demo.

## P2 — Opcional

- OCR;
- segunda tienda;
- confirmación colaborativa de reportes;
- alternativas de producto;
- métricas avanzadas.

## P3 — Solo si sobra tiempo

- chat de feedback;
- funcionalidades para trabajadores;
- mejoras no esenciales.

Los agentes no deben comenzar trabajo P2 o P3 si existe trabajo P0 incompleto.

---

# 6. Stack autorizado

## Frontend

```text
React
TypeScript
Vite
React Router
Zustand
SVG
```

## Datos

```text
JSON local
TypeScript types
Zod opcional para validación
```

## Lógica principal

```text
TypeScript
```

## Python

Permitido para:

- utilidades;
- preparación de datos;
- experimentos;
- OCR opcional;
- scripts auxiliares.

Python no debe introducirse como dependencia obligatoria del flujo principal salvo decisión explícita del equipo.

---

# 7. No introducir sin autorización

Los agentes no deben añadir por iniciativa propia:

- microservicios;
- PostgreSQL;
- Firebase;
- Supabase;
- Redis;
- Docker obligatorio;
- GraphQL;
- WebSockets;
- autenticación real;
- sistemas cloud complejos;
- nuevas librerías grandes;
- nuevos frameworks UI;
- LLMs adicionales;
- servicios de pago;
- APIs externas obligatorias.

Cualquier incorporación de infraestructura debe justificar claramente qué problema del MVP resuelve.

---

# 8. Arquitectura esperada

La separación conceptual es:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Infrastructure
```

Reglas:

- React no debe contener lógica de routing.
- El dominio no debe depender de React.
- Los componentes no deben leer JSON directamente.
- Los proveedores externos deben estar detrás de adaptadores.
- El mapa solo representa datos.
- El motor de rutas solo calcula rutas.

---

# 9. Estructura base del repositorio

```text
src/
├── app/
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
├── store/
├── components/
├── data/
├── types/
└── utils/
```

No crear nuevas carpetas de primer nivel sin necesidad clara.

---

# 10. Contratos compartidos

Los siguientes tipos son contratos críticos:

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

Estos contratos se definen en `DATA_MODEL.md`.

Ningún agente debe modificarlos unilateralmente.

---

# 11. Cambio de un contrato compartido

Si un agente necesita modificar un contrato:

1. debe explicar el motivo;
2. comprobar si puede resolverse sin modificarlo;
3. identificar consumidores afectados;
4. actualizar `DATA_MODEL.md`;
5. actualizar los tipos TypeScript;
6. actualizar JSON relacionados;
7. actualizar tests;
8. verificar integración.

No se permiten cambios silenciosos de tipos compartidos.

---

# 12. Agentes recomendados

El equipo puede utilizar varios agentes especializados.

No es obligatorio ejecutar todos simultáneamente.

---

# 13. Agent: Frontend Flow

## Responsabilidad

Flujo general de usuario.

Puede trabajar sobre:

```text
src/app/
src/features/auth/
src/features/shopping-list/
src/features/recommendations/
src/features/checkout/
src/features/finish/
src/components/common/
```

## Debe implementar

- navegación entre pantallas;
- formularios;
- lista de compra;
- feedback de usuario;
- flujo de recomendaciones;
- finalización.

## No debe modificar

```text
services/routing/
domain/route/
domain/incident/
data/stores/
```

sin coordinación.

---

# 14. Agent: Store Map

## Responsabilidad

Representación visual del supermercado.

Puede trabajar sobre:

```text
src/components/map/
src/features/navigation/
```

## Debe implementar

- SVG;
- layout;
- estanterías;
- nodos visibles cuando sea útil;
- ruta;
- posición;
- productos;
- incidencias;
- cajas.

## No debe implementar

- Dijkstra;
- cálculo de costes;
- matching;
- reglas de incidencias.

El mapa recibe resultados; no los calcula.

---

# 15. Agent: Routing

## Responsabilidad

Motor de navegación.

Puede trabajar sobre:

```text
src/domain/route/
src/services/routing/
```

## Debe implementar

- grafo;
- shortest path;
- Dijkstra;
- cálculo de costes;
- multi-stop;
- selección de caja;
- resultados deterministas.

## No debe modificar

- UI;
- recomendaciones;
- OCR;
- datos de demo salvo fixtures de tests.

---

# 16. Agent: Incidents

## Responsabilidad

Sistema de reportes e impacto sobre navegación.

Puede trabajar sobre:

```text
src/domain/incident/
src/services/incidents/
src/features/reports/
```

## Debe implementar

- tipos de reportes;
- creación;
- eliminación;
- reglas;
- severidad;
- política de recalculado.

## Debe coordinarse con

`Routing Agent`

cuando una incidencia afecte al coste del grafo.

---

# 17. Agent: Data

## Responsabilidad

Datos, repositorios y consistencia del dataset.

Puede trabajar sobre:

```text
src/data/
src/repositories/
src/types/
```

## Debe implementar

- catálogo;
- usuarios ficticios;
- tienda;
- grafo;
- ubicaciones;
- escenarios;
- validación.

## Regla especial

No modificar contratos de `src/types/` sin revisar `DATA_MODEL.md`.

---

# 18. Agent: Recommendations

## Responsabilidad

Cross-selling.

Puede trabajar sobre:

```text
src/services/recommendations/
src/features/recommendations/
```

## Debe implementar

```text
RecommendationService
AIRecommendationProvider
LocalRecommendationProvider
```

## Requisito crítico

La aplicación debe continuar aunque falle el proveedor de IA.

Debe existir fallback determinista.

---

# 19. Agent: OCR

## Prioridad

P2.

## Responsabilidad

Convertir imagen de lista a términos de búsqueda.

Puede trabajar sobre:

```text
src/services/ocr/
src/features/shopping-list/ocr/
```

## Contrato

La salida debe terminar siendo:

```ts
string[]
```

El resto del sistema no debe depender de la tecnología OCR.

No iniciar este trabajo mientras existan tareas P0 pendientes.

---

# 20. Agent: Demo & Integration

## Responsabilidad

Garantizar una demo estable.

Puede trabajar sobre:

```text
src/features/demo/
src/data/scenarios/
```

y realizar integración coordinada.

## Debe implementar

- panel `/demo`;
- escenarios;
- reset;
- eventos controlados;
- recorrido demostrable.

## Debe evitar

crear lógica duplicada solo para la demo.

Los escenarios deben utilizar los mismos servicios que el flujo normal.

---

# 21. Agent: QA

## Responsabilidad

Buscar errores de integración y regresiones.

Debe verificar:

```text
lista
matching
routing
incidencias
cajas
fallback IA
demo
```

Puede añadir tests.

No debe refactorizar áreas funcionales mientras está realizando QA salvo correcciones pequeñas y evidentes.

---

# 22. Reglas de coordinación

Si dos agentes necesitan modificar el mismo módulo:

1. definir primero la interfaz compartida;
2. acordar quién es propietario del archivo;
3. evitar ediciones concurrentes del mismo código;
4. integrar después mediante contratos.

Ejemplo:

```text
Routing Agent
    ↓ RouteResult
Map Agent
```

El Map Agent no necesita conocer la implementación del Routing Agent.

Solo necesita conocer `RouteResult`.

---

# 23. Propiedad de archivos

Como regla práctica:

```text
types/                   → Data / Integration
services/routing/        → Routing
services/incidents/      → Incidents
services/recommendations/→ Recommendations
services/ocr/            → OCR
components/map/          → Store Map
features/demo/           → Demo
data/                    → Data
```

El propietario de un área debe revisar cambios de otros agentes en esa área.

---

# 24. Trabajo por bloques

Cada tarea debe intentar producir un bloque funcional pequeño.

Ejemplo correcto:

```text
Implementar Dijkstra sobre StoreGraph
```

Ejemplo demasiado amplio:

```text
Implementar todo el sistema de navegación
```

Una tarea adecuada debería poder:

- entenderse de forma aislada;
- implementarse;
- probarse;
- integrarse.

---

# 25. Plantilla recomendada para cada tarea

Los prompts a agentes deberían incluir:

```text
Objetivo:
...

Archivos permitidos:
...

Archivos no permitidos:
...

Contratos relevantes:
...

Criterios de aceptación:
...

Tests esperados:
...

No hacer:
...
```

Ejemplo:

```text
Objetivo:
Implementar ShortestPathSolver con Dijkstra.

Archivos permitidos:
src/services/routing/ShortestPathSolver.ts
src/services/routing/ShortestPathSolver.test.ts

Contratos:
StoreGraph
GraphNode
GraphEdge
PathResult

Criterios:
- camino válido;
- coste mínimo;
- evita aristas infinitas;
- soporta grafo desconectado.

No hacer:
- modificar UI;
- modificar modelos compartidos.
```

---

# 26. Cambios mínimos

Los agentes deben preferir cambios pequeños y localizados.

Evitar:

- reescribir archivos completos sin necesidad;
- renombrar carpetas durante tareas funcionales;
- hacer refactors globales en mitad del hackathon;
- cambiar estilos no relacionados;
- sustituir librerías ya funcionales.

---

# 27. Antes de escribir código

Cada agente debe comprobar:

```text
¿Existe ya este componente?
¿Existe ya un tipo equivalente?
¿Existe ya un servicio equivalente?
¿La tarea pertenece a otro agente?
¿Estoy duplicando lógica?
```

No crear una segunda implementación si existe una válida.

---

# 28. Después de escribir código

Cada agente debe:

1. comprobar TypeScript;
2. ejecutar tests relevantes;
3. revisar imports;
4. comprobar que no hay datos hardcodeados evitables;
5. verificar el flujo afectado;
6. documentar cualquier decisión no obvia.

---

# 29. Testing mínimo obligatorio

Los agentes responsables deben cubrir especialmente:

## Routing

- camino válido;
- bloqueo;
- congestión;
- cambio de ruta;
- grafo sin solución.

## Incidencias

- creación;
- efecto correcto;
- expiración o eliminación;
- tipo de target correcto.

## Product Matching

- exact match;
- partial match;
- keywords;
- sin resultado.

## Checkout

- caja abierta;
- caja cerrada;
- cola;
- caja más lejana pero más rápida.

## Recommendations

- IA disponible;
- IA falla;
- fallback.

---

# 30. Código determinista en la demo

La demo debe ser predecible.

No utilizar valores aleatorios para:

- rutas;
- colas;
- incidencias;
- recomendaciones;
- usuarios.

Si se necesita aleatoriedad para desarrollo, debe existir un modo demo determinista.

---

# 31. Política sobre IA generativa dentro del producto

La IA del producto solo se utiliza obligatoriamente para cross-selling.

No introducir LLM para:

- rutas;
- matching;
- incidencias;
- selección de caja;
- lógica de tienda.

Motivo:

estas funciones deben ser rápidas, explicables y deterministas.

---

# 32. Política sobre IA para desarrollar

Los agentes de IA pueden utilizarse intensivamente para:

- generar código;
- crear tests;
- revisar componentes;
- preparar JSON;
- detectar errores;
- documentar;
- refactorizar localmente.

Pero el equipo humano mantiene la decisión final sobre:

- alcance;
- contratos;
- arquitectura;
- prioridades;
- experiencia de demo.

---

# 33. Datos reales y simulados

Los agentes deben respetar la distinción:

## Reales

```text
productos del catálogo utilizados en demo
```

## Simulados

```text
tienda
layout
ubicaciones
usuarios
stock
colas
incidencias
tiempos
rutas
```

No etiquetar datos simulados como datos internos reales de Mercadona.

---

# 34. Datos hardcodeados

Permitido:

- configuración inicial;
- pesos;
- fixtures;
- escenarios de demo.

No permitido:

- coordenadas de productos dentro de componentes React;
- rutas completas predefinidas dentro de la UI;
- productos insertados directamente en componentes;
- lógica especial como `if product === "leche"`.

Los datos deben residir en configuración o JSON.

---

# 35. Errores y fallback

El sistema debe degradar de forma segura.

## Si falla IA

```text
usar recomendaciones locales
```

## Si falla OCR

```text
permitir entrada manual
```

## Si no existe ruta

```text
mostrar mensaje comprensible
no romper la aplicación
```

## Si un producto no se encuentra

```text
permitir resolver manualmente
```

## Si una incidencia es inválida

```text
rechazarla sin modificar el grafo
```

---

# 36. Rendimiento

El routing debe ejecutarse localmente y sentirse instantáneo.

No optimizar prematuramente.

Prioridad:

```text
correcto
→ estable
→ comprensible
→ rápido
```

Solo después se optimiza.

---

# 37. UI y UX

La interfaz es mobile-first.

Los agentes deben priorizar:

- botones suficientemente grandes;
- poco texto;
- jerarquía visual clara;
- navegación obvia;
- acciones principales visibles;
- mapa legible;
- reportes rápidos.

La aplicación también debe verse correctamente en escritorio para la presentación.

---

# 38. Accesibilidad mínima

Aunque no sea una funcionalidad específica del MVP, los componentes deben intentar mantener:

- HTML semántico;
- botones reales;
- labels;
- contraste razonable;
- navegación comprensible;
- `aria-label` donde sea necesario.

No crear una implementación compleja específica de accesibilidad durante el MVP salvo que el equipo lo priorice.

---

# 39. Convenciones TypeScript

Preferir:

```ts
interface
```

para objetos de dominio.

Preferir:

```ts
type
```

para uniones y alias.

Ejemplo:

```ts
interface Product {
  id: string;
}

type IncidentStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "RESOLVED";
```

Evitar `any`.

Si se necesita temporalmente:

```ts
unknown
```

y validar.

---

# 40. Funciones

Preferir funciones pequeñas.

Ejemplo:

```ts
calculateEdgeCost()
findShortestPath()
selectNextProduct()
```

Evitar una función única que:

```text
carga tienda
+ calcula ruta
+ actualiza UI
+ crea incidencias
```

---

# 41. Nombres

Los nombres deben expresar intención.

Correcto:

```text
calculateRoute
activeIncidents
pendingProducts
checkoutQueueMinutes
```

Evitar:

```text
doStuff
data2
temp
resultX
```

---

# 42. Comentarios

No comentar código evidente.

Comentar:

- decisiones;
- algoritmos;
- restricciones;
- supuestos;
- razones no evidentes.

Ejemplo útil:

```ts
// A blocked aisle receives Infinity so Dijkstra never selects it.
```

---

# 43. Logging

Durante desarrollo se permite logging.

Antes de la demo:

- eliminar logs ruidosos;
- mantener solo errores útiles;
- evitar mostrar datos técnicos al usuario.

No mostrar stack traces en la interfaz.

---

# 44. Dependencias

Antes de añadir una dependencia, el agente debe comprobar:

1. ¿se puede resolver fácilmente sin ella?
2. ¿es mantenida?
3. ¿añade mucho peso?
4. ¿afecta a la demo?
5. ¿otra dependencia ya resuelve el problema?

No añadir librerías para utilidades triviales.

---

# 45. Git

Si el equipo utiliza ramas:

```text
main
feature/<nombre>
fix/<nombre>
```

Ejemplos:

```text
feature/routing-engine
feature/store-map
feature/reports
fix/checkout-selection
```

Los cambios deberían integrarse frecuentemente.

No dejar seis ramas aisladas hasta el final del día.

---

# 46. Commits

Preferir commits pequeños.

Ejemplos:

```text
feat: add Dijkstra shortest path solver
feat: render active route on store map
fix: ignore closed checkouts
test: cover blocked aisle routing
```

Evitar:

```text
cambios
varias cosas
final
final2
```

---

# 47. Integración continua durante el hackathon

Regla recomendada:

```text
trabajo individual corto
↓
commit
↓
integración
↓
prueba del flujo
↓
continuar
```

No esperar varias horas para integrar.

---

# 48. Definition of Done

Una tarea se considera terminada cuando:

- compila;
- cumple criterio funcional;
- respeta contratos;
- no rompe tests;
- se ha probado en integración;
- no introduce errores visuales evidentes;
- no depende de datos locales privados del desarrollador.

---

# 49. Demo Freeze

Debe establecerse una hora de congelación de funcionalidad.

Desde ese momento:

Permitido:

```text
corregir bugs
ajustar textos
mejorar pequeños detalles visuales
ensayar
```

No permitido:

```text
nuevas features grandes
cambios de arquitectura
nuevas dependencias críticas
refactors amplios
```

---

# 50. Qué hacer si un agente encuentra una decisión pendiente

No inventar silenciosamente.

Debe:

1. buscar en documentación;
2. comprobar código existente;
3. elegir la opción más simple solo si es reversible;
4. marcar el supuesto;
5. solicitar decisión humana si afecta al producto o arquitectura.

---

# 51. Qué hacer si la documentación está desactualizada

No ignorarla.

El agente debe indicar:

```text
Documento:
Código:
Discrepancia:
Cambio recomendado:
```

Después se decide qué debe actualizarse.

---

# 52. Prohibiciones específicas para la demo

No:

- depender de una API sin fallback;
- depender de Internet para routing;
- crear rutas falsas pregrabadas presentándolas como calculadas;
- presentar datos simulados como reales;
- fingir posicionamiento indoor;
- fingir stock real;
- afirmar integración con Mercadona si no existe.

La demo debe ser honesta sobre qué está implementado y qué está simulado.

---

# 53. Uso del modo demo

Los agentes pueden utilizar `/demo` para generar eventos controlados.

Ejemplo:

```text
SPILL edge_014
```

La incidencia debe entrar por el mismo `IncidentManager` que un reporte real.

No modificar directamente la ruta para provocar un efecto visual.

---

# 54. Caso de demo prioritario

Todos los agentes deben proteger este escenario:

```text
1. Abrir Mercadona Sync.
2. Seleccionar usuario demo.
3. Cargar lista.
4. Mostrar recomendaciones.
5. Aceptar una.
6. Calcular ruta.
7. Comenzar navegación.
8. Provocar derrame en un tramo.
9. Mostrar incidencia.
10. Recalcular.
11. Visualizar nueva ruta.
12. Recoger productos.
13. Seleccionar mejor caja.
14. Finalizar.
```

Si este escenario falla, debe considerarse una incidencia P0.

---

# 55. Segunda ruta de demo

Debe existir una variante simple:

```text
Invitado
↓
Texto manual
↓
Matching
↓
Ruta
```

Esto demuestra que el producto no depende de un usuario preconfigurado.

---

# 56. Revisión antes de merge

Checklist:

```text
[ ] ¿Cumple PRODUCT_REQUIREMENTS?
[ ] ¿Respeta ARCHITECTURE?
[ ] ¿Respeta DATA_MODEL?
[ ] ¿Está en el componente correcto?
[ ] ¿Añade una dependencia innecesaria?
[ ] ¿Rompe el flujo demo?
[ ] ¿Tiene fallback si depende de un servicio?
[ ] ¿Se puede probar?
[ ] ¿Compila?
```

---

# 57. Revisión de agentes

Cuando un agente termine una tarea, otro agente o una persona debe revisar especialmente:

- contratos;
- acoplamiento;
- nombres;
- duplicación;
- manejo de errores;
- tests.

Para lógica crítica como routing e incidencias, la revisión cruzada es altamente recomendable.

---

# 58. Refactors

Durante el hackathon:

Permitidos:

- extraer función;
- eliminar duplicación;
- simplificar interfaz local;
- mejorar nombres.

Evitar:

- cambiar patrón arquitectónico;
- reorganizar todo `src/`;
- sustituir Zustand;
- sustituir React;
- reescribir routing funcional.

---

# 59. Decisiones futuras

No implementar ahora salvo indicación explícita:

- backend multiusuario;
- posicionamiento indoor real;
- integración oficial Mercadona;
- cuentas reales;
- panel empresarial completo;
- optimización global de tráfico;
- sensores;
- historial real;
- personalización avanzada.

Preparar la arquitectura para ellas no significa implementarlas.

---

# 60. Regla de simplicidad

Ante dos soluciones correctas:

```text
A: 80 líneas, 1 dependencia, fácil de entender.
B: 300 líneas, patrón complejo, 4 dependencias.
```

Elegir A salvo que B resuelva una necesidad real documentada.

---

# 61. Regla de producto

Los agentes no deben optimizar solo para "hacer algo técnicamente interesante".

El criterio es:

```text
¿Mejora la experiencia del cliente?
¿Refuerza la demo?
¿Aporta valor demostrable?
¿Se puede terminar con seguridad?
```

Si la respuesta es no, no es prioritario.

---

# 62. Regla final

Mercadona Sync se desarrollará como un sistema modular, determinista y demostrable.

Los agentes deben actuar como colaboradores dentro de una arquitectura ya decidida, no como diseñadores independientes de seis versiones diferentes del producto.

> Primero completar. Después estabilizar. Después mejorar.
