# DEVELOPMENT_PLAN.md

## 1. Propósito

Este documento define el plan de ejecución de **Mercadona Sync** durante el hackathon.

Su objetivo es convertir la documentación funcional y técnica en una secuencia de trabajo concreta, paralelizable y orientada a llegar a la entrega con una demo estable.

Debe leerse junto a:

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `DATA_MODEL.md`
- `AGENTS.md`

La prioridad no es implementar el mayor número posible de funcionalidades, sino garantizar un flujo completo, demostrable y estable antes de ampliar el alcance.

---

# 2. Objetivo del día

La entrega debe permitir demostrar este recorrido:

```text
Entrada
  ↓
Usuario identificado o invitado
  ↓
Lista de compra
  ↓
Matching con productos reales
  ↓
Cross-selling
  ↓
Confirmación
  ↓
Mapa de tienda
  ↓
Ruta optimizada
  ↓
Navegación
  ↓
Incidencia
  ↓
Recalculado en tiempo real
  ↓
Selección de caja
  ↓
Fin de compra
```

Este flujo constituye el **camino crítico del proyecto**.

---

# 3. Criterio de éxito

A las 16:00 el proyecto debe:

- arrancar de forma fiable;
- ejecutar el flujo principal de principio a fin;
- funcionar sin OCR;
- funcionar aunque falle la IA;
- mostrar una ruta real calculada;
- reaccionar a una incidencia;
- recalcular la ruta;
- terminar en una caja;
- poder repetirse varias veces;
- estar preparado para una demo guiada.

Cualquier funcionalidad que no contribuya a esto es secundaria.

---

# 4. Horario de referencia

Horario de desarrollo previsto:

```text
09:00 — Inicio
13:30 — Comida
16:00 — Entrega
```

Tiempo real de desarrollo útil:

```text
aprox. 6 horas
```

El plan debe asumir que habrá interrupciones, integración y errores.

Por tanto, el objetivo es tener un MVP funcional **antes de las 13:30**.

---

# 5. Hitos del día

## Hito 0 — 09:00–09:20

### Objetivo

Cerrar alcance y preparar el repositorio.

Debe quedar decidido:

- alcance P0;
- responsables;
- estructura de carpetas;
- contratos compartidos;
- dataset inicial;
- tienda demo;
- escenario principal de presentación.

### Salida

```text
Repositorio preparado
Datos mínimos definidos
6 bloques de trabajo asignados
```

---

## Hito 1 — 09:20–10:30

### Objetivo

Conseguir que las piezas fundamentales existan por separado.

Debe estar disponible:

- catálogo mínimo;
- tienda con grafo;
- usuarios demo;
- listado de productos;
- estructura UI básica;
- Dijkstra funcional;
- renderizado inicial del mapa;
- modelo de incidencias;
- fallback de recomendaciones.

### Criterio

Todavía no es necesario que todo esté integrado.

---

## Hito 2 — 10:30–11:30

### Objetivo

Completar el primer flujo extremo a extremo.

Debe poder hacerse:

```text
Usuario
↓
Lista
↓
Productos
↓
Ruta
↓
Mapa
```

Aunque todavía no existan incidencias ni pulido visual.

### Criterio crítico

A las 11:30 debe existir una versión ejecutable integrada.

---

## Hito 3 — 11:30–12:30

### Objetivo

Introducir el elemento diferencial.

Debe funcionar:

```text
Ruta activa
↓
Incidencia
↓
Cambio de coste / bloqueo
↓
Recalculado
↓
Nueva ruta visible
```

También debe existir:

- selección de caja;
- producto recogido;
- actualización de progreso.

### Criterio

El principal momento de demo debe estar ya construido.

---

## Hito 4 — 12:30–13:30

### Objetivo

Cerrar el MVP completo.

Debe funcionar de principio a fin:

```text
Entrada
↓
Lista
↓
Cross-selling
↓
Ruta
↓
Incidencia
↓
Recalculado
↓
Caja
↓
Final
```

### Regla

Si algo P0 sigue roto, nadie comienza P2.

---

## Hito 5 — 13:30–14:30

### Objetivo

Estabilización y demo.

Prioridad:

- bugs;
- errores de integración;
- estados vacíos;
- mensajes;
- transiciones;
- escenario demo;
- panel `/demo`.

No se deben iniciar funcionalidades grandes nuevas.

---

## Hito 6 — 14:30–15:00

### Feature Freeze

A partir de este momento:

Permitido:

- corregir bugs;
- mejorar textos;
- ajustar UI;
- reparar datos;
- corregir rutas;
- mejorar pequeños detalles visuales.

No permitido:

- cambiar arquitectura;
- añadir servicios externos;
- introducir funcionalidades grandes;
- reescribir componentes;
- sustituir librerías.

---

## Hito 7 — 15:00–16:00

### Objetivo

Entrega y preparación de presentación.

Actividades:

- prueba completa;
- reset de demo;
- ensayo;
- segundo ensayo;
- revisión de entrega;
- backup;
- captura de pantallas si fuera necesario;
- preparación del discurso técnico.

---

# 6. Reparto recomendado para seis personas

## Persona 1 — Flujo de usuario

Responsabilidad:

```text
Landing
Usuario / Invitado
Lista
Recommendations
Finish
```

Archivos principales:

```text
src/app/
src/features/auth/
src/features/shopping-list/
src/features/recommendations/
```

---

## Persona 2 — Mapa y navegación visual

Responsabilidad:

```text
StoreMap
StoreLayout
RouteOverlay
Markers
NavigationPage
```

Objetivo:

hacer visible todo lo que calcula el sistema.

---

## Persona 3 — Routing

Responsabilidad:

```text
GraphService
Dijkstra
RouteCostCalculator
MultiStopRoutePlanner
CheckoutSelector
```

Debe trabajar desde el principio con tests.

---

## Persona 4 — Incidencias

Responsabilidad:

```text
IncidentManager
IncidentRules
ReportModal
RouteRecalculationPolicy
```

Debe coordinarse estrechamente con Routing.

---

## Persona 5 — Datos y catálogo

Responsabilidad:

```text
products.json
users.json
store.json
scenarios/
repositories/
ProductMatchingService
```

Debe proporcionar datos utilizables rápidamente al resto.

---

## Persona 6 — Integración, IA y demo

Responsabilidad:

```text
RecommendationService
fallback
DemoPanel
DemoScenarioController
integración
QA continuo
```

Esta persona debe empezar ayudando al desarrollo, pero progresivamente convertirse en responsable de integración.

---

# 7. Dependencias entre bloques

```text
DATA
 │
 ├──────────► PRODUCT MATCHING
 │
 └──────────► STORE + GRAPH
                    │
                    ▼
                 ROUTING
                    │
            ┌───────┴────────┐
            ▼                ▼
        NAVIGATION       INCIDENTS
            │                │
            └───────┬────────┘
                    ▼
                 DEMO
```

---

# 8. Camino crítico

El camino crítico técnico es:

```text
StoreGraph
   ↓
ShortestPathSolver
   ↓
MultiStopRoutePlanner
   ↓
StoreMap
   ↓
NavigationController
   ↓
IncidentManager
   ↓
Recalculation
```

Si este camino no funciona, el elemento diferencial del proyecto no existe.

Por tanto, estos módulos tienen prioridad absoluta.

---

# 9. Orden de implementación P0

## P0.1 — Datos mínimos

Crear:

- 1 tienda;
- 20–40 productos;
- 1 grafo completo;
- 3 usuarios demo;
- 3 listas;
- 3 cajas.

---

## P0.2 — Product Matching

Debe aceptar:

```text
leche
huevos
arroz
```

y resolver productos.

---

## P0.3 — Routing básico

Debe calcular:

```text
entrada
→ producto A
→ producto B
→ producto C
→ caja
```

---

## P0.4 — Mapa

Debe mostrar:

- tienda;
- ruta;
- posición;
- productos;
- cajas.

---

## P0.5 — Incidencias

Implementar primero:

```text
SPILL
CONGESTION
PRODUCT_OUT_OF_STOCK
LONG_CHECKOUT_QUEUE
```

El resto puede añadirse posteriormente.

---

## P0.6 — Recalculado

Escenario mínimo:

```text
Ruta usa edge_14
↓
SPILL edge_14
↓
edge_14 bloqueado
↓
Dijkstra vuelve a ejecutarse
↓
Nueva ruta
```

---

## P0.7 — Flujo completo

Unir:

```text
lista
recomendaciones
ruta
navegación
incidencias
caja
fin
```

---

# 10. Orden de implementación P1

Una vez completado P0:

1. IA real para cross-selling.
2. Mejoras del mapa.
3. Animación de recalculado.
4. Mensajes explicativos.
5. Progreso de compra.
6. Escenarios adicionales.
7. Mejor experiencia de reportes.

---

# 11. Orden de implementación P2

Solo si existe margen real:

1. OCR.
2. Segunda tienda.
3. Confirmaciones de reportes.
4. Alternativas a agotados.
5. Métricas comparativas.
6. Feedback final.

---

# 12. Dataset inicial recomendado

No construir un catálogo enorme.

Para la demo:

```text
20–40 productos
```

repartidos entre:

- frutas;
- verduras;
- lácteos;
- bebidas;
- alimentación seca;
- limpieza;
- refrigerados;
- panadería.

La lista demo principal debería contener:

```text
6–8 productos
```

Esto hace que la ruta sea suficientemente visual sin hacer la demo lenta.

---

# 13. Tienda demo

La tienda inicial debe diseñarse para demostrar rutas alternativas.

No crear un supermercado lineal sin opciones.

Debe existir al menos:

- dos caminos entre algunas zonas;
- varios pasillos;
- 3 cajas;
- un tramo fácil de bloquear;
- una ruta alternativa visible.

La geometría debe favorecer la demo.

---

# 14. Escenario principal

Escenario recomendado:

## Estado inicial

Usuario:

```text
Usuario Demo 1
```

Lista:

```text
Leche
Huevos
Arroz
Tomate
Yogur
Detergente
```

Cross-selling:

```text
Queso rallado
```

El usuario acepta la recomendación.

---

## Ruta inicial

La aplicación calcula el recorrido completo.

La ruta atraviesa deliberadamente:

```text
edge_14
```

---

## Evento demo

Desde `/demo`:

```text
SPILL edge_14
```

---

## Resultado esperado

```text
Ruta actualizada
Evitamos el pasillo afectado por una incidencia.
```

La ruta cambia visualmente.

---

## Final

Antes de llegar a caja:

```text
Caja 1: 7 min
Caja 2: 2 min
Caja 3: cerrada
```

El sistema selecciona Caja 2.

---

# 15. Segundo escenario

Invitado:

```text
"leche, arroz, café, huevos"
```

Debe demostrar:

```text
texto libre
↓
matching
↓
lista
↓
ruta
```

No necesita completar toda la demo.

---

# 16. Escenarios de prueba

## Escenario A — Normal

Sin incidencias.

Resultado:

ruta estándar.

---

## Escenario B — Congestión

Un tramo tiene:

```text
CONGESTION HIGH
```

Resultado:

el motor decide si compensa evitarlo.

---

## Escenario C — Bloqueo

```text
SPILL
```

Resultado:

el tramo no puede utilizarse.

---

## Escenario D — Agotado

Producto pendiente:

```text
PRODUCT_OUT_OF_STOCK
```

Resultado:

se elimina como objetivo y se recalcula.

---

## Escenario E — Caja

```text
Caja 1 → 8 min
Caja 2 → 2 min
```

Resultado:

Caja 2.

---

# 17. Estrategia de integración

Integrar temprano.

Regla:

```text
máximo 60–90 minutos trabajando aislado
```

Después:

```text
commit
merge
prueba
```

No esperar a tener componentes “perfectos”.

---

# 18. Integraciones obligatorias

## Integración 1 — 10:30

```text
Data + Routing
```

Debe calcular una ruta desde datos reales del proyecto.

---

## Integración 2 — 11:00

```text
Routing + Map
```

Debe dibujarse el resultado.

---

## Integración 3 — 11:45

```text
Incidents + Routing
```

Debe cambiar la ruta.

---

## Integración 4 — 12:30

```text
Full Flow
```

Debe ejecutarse de principio a fin.

---

# 19. Política de branches

Si se utilizan ramas:

```text
main
feature/ui-flow
feature/store-map
feature/routing
feature/incidents
feature/data
feature/demo
```

Las ramas deben ser cortas.

`main` debe mantenerse ejecutable.

---

# 20. Política de commits

Commits pequeños y descriptivos.

Ejemplos:

```text
feat: add store graph dataset
feat: implement Dijkstra solver
feat: render route overlay
feat: apply spill incident to routing
fix: ignore closed checkout
```

---

# 21. Definition of Done para P0

Una tarea P0 está terminada cuando:

- compila;
- funciona;
- está integrada;
- usa contratos compartidos;
- no contiene datos personales del desarrollador;
- no depende de un servicio no controlado;
- ha sido probada dentro del flujo.

---

# 22. Testing durante desarrollo

No buscar cobertura exhaustiva.

Priorizar tests sobre:

```text
routing
incidents
checkout
matching
```

Pruebas manuales sobre:

```text
UI
mapa
flujo
demo
```

---

# 23. Checklist de routing

Antes de darlo por cerrado:

```text
[ ] Encuentra camino.
[ ] Soporta múltiples objetivos.
[ ] Evita bloqueos.
[ ] Penaliza congestión.
[ ] Gestiona producto agotado.
[ ] Selecciona caja.
[ ] Devuelve error controlado si no existe ruta.
```

---

# 24. Checklist de mapa

```text
[ ] Renderiza tienda.
[ ] Renderiza ruta.
[ ] Renderiza posición.
[ ] Renderiza productos.
[ ] Renderiza incidencias.
[ ] Renderiza cajas.
[ ] Se adapta a móvil.
[ ] Se ve correctamente proyectado.
```

---

# 25. Checklist de reportes

```text
[ ] Reporte fácil de crear.
[ ] Tipo correcto.
[ ] Target correcto.
[ ] IncidentManager lo recibe.
[ ] Routing recibe el cambio.
[ ] La UI muestra la incidencia.
[ ] La ruta cambia cuando corresponde.
```

---

# 26. Checklist de IA

```text
[ ] Devuelve recomendaciones válidas.
[ ] Solo recomienda productos existentes.
[ ] Limita cantidad.
[ ] Permite aceptar/rechazar.
[ ] Tiene timeout.
[ ] Tiene fallback.
[ ] La app funciona sin IA.
```

---

# 27. Checklist de demo

```text
[ ] La aplicación arranca.
[ ] Usuario demo funciona.
[ ] Invitado funciona.
[ ] Lista funciona.
[ ] Recomendaciones funcionan.
[ ] Ruta inicial funciona.
[ ] Panel demo funciona.
[ ] Derrame cambia ruta.
[ ] Caja funciona.
[ ] Finish funciona.
[ ] Reset funciona.
```

---

# 28. Reset de demo

Debe existir un mecanismo sencillo:

```text
RESET DEMO
```

Debe restaurar:

- usuario;
- lista;
- incidencias;
- colas;
- posición;
- ruta;
- recomendaciones.

No reiniciar manualmente varios archivos o estados antes de presentar.

---

# 29. Backup de demo

Antes de la entrega:

- mantener una versión local funcional;
- disponer de build de producción;
- disponer de URL desplegada si se utiliza;
- guardar dataset estable;
- evitar depender exclusivamente del servidor de desarrollo.

---

# 30. Build final

Antes de las 15:00:

```bash
npm run build
```

debe completarse correctamente.

Si existe:

```bash
npm run test
```

debe ejecutarse sobre los tests críticos.

---

# 31. Ensayo 1

Objetivo:

comprobar funcionalidad.

No importa todavía el discurso.

Cronometrar:

- entrada;
- lista;
- recomendaciones;
- ruta;
- incidencia;
- caja.

---

# 32. Ensayo 2

Objetivo:

sincronizar presentación y demo.

Definir exactamente:

- quién habla;
- quién controla;
- cuándo se provoca la incidencia;
- qué se explica mientras recalcula;
- qué se muestra al final.

---

# 33. Ensayo 3

Solo si hay tiempo.

Debe ejecutarse como si ya estuvierais ante el jurado.

No tocar código entre el ensayo final y la presentación salvo bug crítico.

---

# 34. Qué cortar primero si falta tiempo

Orden de eliminación:

```text
1. Chat feedback
2. Segunda tienda
3. OCR
4. Confirmación colaborativa
5. Métricas avanzadas
6. Animaciones
7. IA real
```

No cortar:

```text
routing
incidencias
recalculado
mapa
flujo completo
```

---

# 35. Si falla la IA

Utilizar:

```text
LocalRecommendationProvider
```

No intentar reparar una integración externa durante la última hora.

---

# 36. Si falla el OCR

Ocultarlo.

Utilizar entrada manual.

No afecta al MVP.

---

# 37. Si falla la segunda tienda

Eliminarla de la demo.

Explicar verbalmente que el modelo está preparado para cargar configuraciones distintas.

---

# 38. Si falla la comunicación entre dispositivos

Usar `/demo`.

El valor del proyecto está en cómo reacciona el motor, no en demostrar infraestructura en tiempo real.

---

# 39. Si aparece un bug crítico cerca de entrega

Prioridad:

```text
1. recuperar flujo;
2. reducir funcionalidad;
3. usar fallback;
4. eliminar feature problemática.
```

No rehacer arquitectura.

---

# 40. Roles durante la fase final

A partir del Feature Freeze:

## 1 persona

Control de demo.

## 1 persona

Presentación / discurso.

## 2 personas

QA y correcciones.

## 1 persona

Build, despliegue y backup.

## 1 persona

Apoyo donde exista bloqueo.

Los roles pueden solaparse según el equipo.

---

# 41. Gestión de agentes de IA

No pedir simultáneamente a varios agentes que modifiquen el mismo módulo.

Preferir:

```text
Agente A → routing
Agente B → mapa
Agente C → reports
```

Los prompts deben indicar siempre:

- objetivo;
- archivos;
- contratos;
- aceptación;
- prohibiciones.

---

# 42. Tareas adecuadas para agentes

Ejemplos:

```text
Implementar Dijkstra.
Crear schema Zod de Product.
Crear fixtures de tienda.
Implementar RouteOverlay.
Implementar fallback de recomendaciones.
Crear tests de incidencias.
```

---

# 43. Tareas que deben supervisarse especialmente

```text
Cambios en DATA_MODEL.
Cambios en routing.
Integración entre incidencias y costes.
Cambios globales de estado.
Refactors de estructura.
```

Estas áreas pueden romper varios módulos a la vez.

---

# 44. Métrica real del progreso

No medir progreso por:

```text
número de archivos
líneas de código
features empezadas
```

Medir por escenarios completos:

```text
¿Podemos cargar una lista?
¿Podemos dibujar una ruta?
¿Podemos recalcular?
¿Podemos terminar la compra?
```

---

# 45. Estado recomendado del tablero

Usar cuatro columnas:

```text
TODO
IN PROGRESS
INTEGRATION
DONE
```

Una tarea no pasa a DONE hasta integrarse.

---

# 46. Tareas iniciales sugeridas

## Equipo UI

```text
[ ] Crear router.
[ ] Crear LandingPage.
[ ] Crear flujo User/Guest.
[ ] Crear ShoppingListPage.
```

## Equipo Map

```text
[ ] Crear SVG responsive.
[ ] Renderizar layout.
[ ] Renderizar nodos de prueba.
[ ] Crear RouteOverlay.
```

## Equipo Routing

```text
[ ] Crear GraphService.
[ ] Crear Dijkstra.
[ ] Crear cost resolver.
[ ] Crear multi-stop.
```

## Equipo Incidents

```text
[ ] Crear IncidentRules.
[ ] Crear IncidentManager.
[ ] Crear ReportModal.
[ ] Definir recalculation policy.
```

## Equipo Data

```text
[ ] Crear products.json.
[ ] Crear users.json.
[ ] Crear store_01.json.
[ ] Crear escenarios.
```

## Equipo Integration

```text
[ ] Crear recommendation fallback.
[ ] Crear DemoPanel.
[ ] Preparar AppStore.
[ ] Verificar integración continua.
```

---

# 47. Entregable mínimo antes de comer

Debe existir:

```text
una aplicación integrada
+
una tienda
+
una lista
+
una ruta
+
una incidencia
+
un recalculado
```

Si esto existe antes de comer, el proyecto está en una posición razonable.

Si no existe, se deben congelar inmediatamente todas las funcionalidades secundarias.

---

# 48. Entregable ideal

Además del MVP:

- cross-selling IA real;
- experiencia móvil pulida;
- panel demo;
- varias incidencias;
- caja dinámica;
- OCR;
- segunda tienda.

El orden es importante: ninguno de estos extras justifica perder el recalculado dinámico.

---

# 49. Regla de integración

> Ningún módulo está terminado hasta que funcione dentro del flujo real.

Un Dijkstra aislado no es una ruta funcional.

Un mapa aislado no es navegación.

Un reporte aislado no es una incidencia útil.

El valor aparece al conectarlos.

---

# 50. Regla final

Durante el hackathon debe prevalecer esta prioridad:

```text
Completar
↓
Integrar
↓
Estabilizar
↓
Ensayar
↓
Mejorar
```

No:

```text
Empezar muchas cosas
↓
Integrar al final
```

El objetivo de Mercadona Sync no es demostrar cuánto código puede generar el equipo, sino presentar una experiencia coherente que funcione delante del jurado.
