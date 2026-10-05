# TEST_PLAN.md

## 1. Propósito

Este documento define el plan de pruebas de **Mercadona Sync**.

El objetivo principal no es alcanzar una cobertura exhaustiva, sino garantizar que el camino crítico del hackathon funcione de forma repetible y que los fallos de funcionalidades opcionales no rompan la demo.

---

# 2. Documentos de referencia

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `DATA_MODEL.md`
- `AGENTS.md`
- `DEVELOPMENT_PLAN.md`
- `TASKS.md`
- `DEMO_SCRIPT.md`

---

# 3. Prioridades de prueba

## P0

Debe pasar antes de entregar:

- arranque;
- carga de datos;
- usuario demo;
- invitado;
- product matching;
- recomendaciones con fallback;
- routing;
- incidencias;
- recalculado;
- producto agotado;
- checkout;
- reset;
- build.

## P1

Debe probarse si está implementado:

- proveedor real de IA;
- animaciones;
- persistencia;
- escenarios adicionales;
- responsive.

## P2

Solo si existe:

- OCR;
- segunda tienda;
- confirmaciones colaborativas;
- feedback.

---

# 4. Estrategia

Se combinarán:

## Tests automáticos

Para lógica pura:

- normalización;
- matching;
- Dijkstra;
- costes;
- multi-stop;
- incidencias;
- selección de caja.

## Tests manuales

Para:

- UI;
- mapa;
- flujo;
- interacción;
- responsive;
- demo.

---

# 5. Datos de prueba

Debe existir un dataset estable con:

- una tienda;
- al menos 20 productos;
- productos en distintas zonas;
- tres cajas;
- un tramo con ruta alternativa;
- al menos un usuario demo;
- escenario de derrame;
- escenario de congestión;
- producto agotado;
- cola larga.

Los escenarios P0 no deben depender de valores aleatorios.

---

# 6. TC-001 — Arranque

**Prioridad:** P0

### Pasos

1. Instalar dependencias.
2. Ejecutar la aplicación.
3. Abrir la ruta `/`.

### Resultado esperado

- la aplicación carga;
- no aparece error fatal;
- la pantalla inicial es usable.

---

# 7. TC-002 — Build de producción

**Prioridad:** P0

### Acción

```bash
npm run build
```

### Resultado esperado

- build correcto;
- sin errores TypeScript bloqueantes.

---

# 8. TC-010 — Usuario demo

**Prioridad:** P0

### Pasos

1. Abrir `/`.
2. Seleccionar usuario demo.

### Resultado esperado

- se crea una sesión;
- se carga su lista;
- se navega a `/list`.

---

# 9. TC-011 — Invitado

**Prioridad:** P0

### Pasos

1. Elegir continuar como invitado.
2. Introducir:

```text
leche, huevos, arroz
```

### Resultado esperado

- se crea sesión de invitado;
- los términos se procesan;
- pueden resolverse a productos.

---

# 10. TC-020 — Normalización

**Prioridad:** P0

Casos:

```text
"Leche"
"  leche "
"LÉCHE"
```

Resultado esperado:

- se comparan de forma normalizada;
- no se producen errores por mayúsculas, tildes o espacios.

---

# 11. TC-021 — Exact match

**Prioridad:** P0

Un término idéntico al nombre o keyword principal debe devolver el producto esperado con prioridad alta.

---

# 12. TC-022 — Partial match

**Prioridad:** P0

Ejemplo:

```text
leche semi
```

Resultado:

```text
Leche semidesnatada ...
```

si existe en el catálogo.

---

# 13. TC-023 — Coincidencia ambigua

**Prioridad:** P0

Ejemplo:

```text
queso
```

Resultado esperado:

- varias opciones;
- el usuario puede elegir;
- no se selecciona arbitrariamente un producto si la confianza no es suficiente.

---

# 14. TC-024 — Producto no encontrado

**Prioridad:** P0

Resultado esperado:

- mensaje comprensible;
- la aplicación no falla;
- el usuario puede corregir o eliminar el término.

---

# 15. TC-030 — Camino simple

**Prioridad:** P0

### Objetivo

Validar Dijkstra sobre un grafo pequeño conocido.

### Resultado esperado

- encuentra el camino de menor coste.

---

# 16. TC-031 — Dos caminos

**Prioridad:** P0

Preparar:

```text
Ruta A = menor coste
Ruta B = mayor coste
```

Resultado:

- se selecciona A.

---

# 17. TC-032 — Tramo bloqueado

**Prioridad:** P0

Aplicar:

```text
SPILL
```

sobre un tramo del camino inicial.

Resultado:

- coste no transitable;
- se busca alternativa;
- el camino nuevo no utiliza el tramo.

---

# 18. TC-033 — Grafo sin ruta

**Prioridad:** P0

Resultado esperado:

- no excepción sin controlar;
- se devuelve estado de ruta imposible;
- UI muestra mensaje comprensible.

---

# 19. TC-034 — Multi-stop

**Prioridad:** P0

Lista con varios productos.

Resultado:

- todos los productos pendientes aparecen una vez en el orden de visita;
- la ruta comienza desde `currentNodeId`;
- termina en una caja válida.

---

# 20. TC-035 — Producto recogido

**Prioridad:** P0

### Acción

Marcar siguiente producto como recogido.

### Resultado

- cambia a `COLLECTED`;
- desaparece de pendientes;
- se actualiza el siguiente objetivo;
- la navegación continúa.

---

# 21. TC-040 — Congestión

**Prioridad:** P0

Aplicar `CONGESTION HIGH` a un tramo.

Resultado esperado:

- aumenta su coste;
- sigue siendo transitable;
- el motor puede evitarlo si otra ruta es más rápida.

---

# 22. TC-041 — Derrame

**Prioridad:** P0

Resultado:

- incidencia visible;
- tramo bloqueado;
- recalculado cuando afecta a la ruta.

---

# 23. TC-042 — Pasillo bloqueado

**Prioridad:** P1

Resultado:

- comportamiento equivalente a bloqueo;
- ruta no atraviesa el tramo.

---

# 24. TC-043 — Reposición

**Prioridad:** P1

Resultado:

- incrementa coste;
- no bloquea necesariamente el paso.

---

# 25. TC-044 — Producto agotado

**Prioridad:** P0

Aplicar `PRODUCT_OUT_OF_STOCK` a un producto pendiente.

Resultado:

- se marca como no disponible;
- deja de ser objetivo;
- se informa al usuario;
- la ruta se recalcula.

---

# 26. TC-045 — Incidencia de otra tienda

**Prioridad:** P0

Crear una incidencia con `storeId` distinto al de la sesión.

Resultado:

- no afecta al grafo ni a la ruta de la tienda activa.

---

# 27. TC-046 — Reporte inválido

**Prioridad:** P0

Ejemplo:

- target inexistente;
- tipo incompatible.

Resultado:

- el reporte se rechaza;
- el grafo no cambia;
- no se produce error fatal.

---

# 28. TC-050 — Caja cercana con cola larga

**Prioridad:** P0

Preparar:

```text
Caja 1: cerca + 8 min
Caja 2: más lejos + 2 min
```

Resultado:

- se selecciona la caja con menor tiempo total.

---

# 29. TC-051 — Caja cerrada

**Prioridad:** P0

Resultado:

- nunca se selecciona.

---

# 30. TC-052 — Cambio de cola

**Prioridad:** P0

Aumentar la cola de la caja seleccionada.

Resultado:

- se evalúa una nueva caja;
- la ruta cambia si otra opción pasa a ser mejor.

---

# 31. TC-060 — Recomendaciones locales

**Prioridad:** P0

Resultado:

- devuelve productos existentes;
- máximo configurado;
- permite aceptar y rechazar.

---

# 32. TC-061 — Fallo de IA

**Prioridad:** P0

Simular timeout o error del proveedor.

Resultado:

- se activa `LocalRecommendationProvider`;
- el flujo continúa;
- no aparece error técnico al usuario.

---

# 33. TC-062 — Respuesta IA con producto inexistente

**Prioridad:** P1

Resultado:

- la recomendación se descarta o corrige mediante validación;
- nunca se añade un ID inexistente.

---

# 34. TC-063 — Sin conexión externa

**Prioridad:** P0

Ejecutar el flujo principal sin disponibilidad del proveedor de IA.

Resultado:

```text
lista
→ recomendaciones locales
→ ruta
→ incidencia
→ recalculado
→ caja
→ final
```

completo.

---

# 35. TC-070 — StoreMap

**Prioridad:** P0

Comprobar:

- tienda visible;
- ruta visible;
- posición visible;
- siguiente producto visible;
- incidencia visible;
- cajas visibles.

---

# 36. TC-071 — Recalculado visual

**Prioridad:** P0

Resultado:

- el cambio entre ruta anterior y nueva es claramente perceptible;
- no quedan segmentos obsoletos en pantalla.

---

# 37. TC-072 — Mobile

**Prioridad:** P1

Comprobar en viewport móvil:

- botones utilizables;
- mapa legible;
- texto no desborda;
- reporte accesible.

---

# 38. TC-073 — Escritorio/proyección

**Prioridad:** P1

Resultado:

- la aplicación sigue siendo legible en pantalla grande;
- el mapa aprovecha correctamente el espacio.

---

# 39. TC-080 — Reset de demo

**Prioridad:** P0

Modificar:

- incidencias;
- productos;
- cola;
- posición.

Ejecutar `RESET DEMO`.

Resultado:

- estado inicial restaurado;
- ruta inicial reproducible;
- ningún dato residual.

---

# 40. TC-081 — Escenario de derrame

**Prioridad:** P0

Cargar el escenario utilizado en `DEMO_SCRIPT.md`.

Resultado:

- afecta a la ruta principal;
- existe ruta alternativa;
- el efecto es repetible.

---

# 41. TC-082 — Repetición completa

**Prioridad:** P0

Ejecutar el escenario principal tres veces desde reset.

Resultado:

- las tres ejecuciones producen el mismo comportamiento esperado.

---

# 42. TC-090 — Recuperación de sesión

**Prioridad:** P1

Si se implementa `localStorage`:

- cerrar o recargar;
- restaurar.

Resultado:

- estado básico recuperado sin inconsistencias.

---

# 43. TC-100 — OCR

**Prioridad:** P2

Solo si existe.

Probar:

- imagen válida;
- texto reconocible;
- error OCR;
- cancelación.

Resultado:

- siempre queda disponible la entrada manual.

---

# 44. TC-110 — Segunda tienda

**Prioridad:** P2

Solo si existe.

Resultado:

- carga layout diferente;
- productos cambian de posición;
- routing funciona sin lógica específica de tienda.

---

# 45. Tests automáticos mínimos

Se recomienda automatizar como mínimo:

```text
normalizeText
ProductMatchingService
ShortestPathSolver
RouteCostCalculator
MultiStopRoutePlanner
CheckoutSelector
IncidentRules
RouteRecalculationPolicy
```

---

# 46. Smoke test antes de entregar

Ejecutar en este orden:

```text
[ ] npm run build
[ ] Abrir app
[ ] Usuario demo
[ ] Lista
[ ] Recomendaciones
[ ] Ruta
[ ] Recoger producto
[ ] Crear derrame
[ ] Recalculado visible
[ ] Completar compra
[ ] Seleccionar caja
[ ] Finish
[ ] Reset
[ ] Invitado
```

---

# 47. Gate de entrega

No se debe considerar lista la entrega si falla cualquiera de estos puntos:

```text
Build
Ruta inicial
Mapa
Incidencia
Recalculado
Caja
Reset
```

Si falla IA u OCR pero sus fallbacks funcionan, la entrega puede continuar.

---

# 48. Registro de defectos

Formato recomendado:

```text
ID:
Severidad:
Escenario:
Pasos:
Esperado:
Obtenido:
Bloque:
```

Severidad:

```text
P0 = rompe demo
P1 = afecta funcionalidad importante
P2 = defecto menor
```

---

# 49. Criterio final

Antes de mejorar visualmente una funcionalidad, debe comprobarse que el camino crítico sigue pasando.

> La mejor prueba de Mercadona Sync es poder ejecutar varias veces la misma historia de demo sin sorpresas.
