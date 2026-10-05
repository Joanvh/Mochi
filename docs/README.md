# Mercadona Sync

## 1. Descripción

**Mercadona Sync** es una aplicación web móvil diseñada para acompañar al cliente durante su compra presencial en Mercadona.

La idea principal es convertir una lista de la compra en una **ruta dinámica por el supermercado**, optimizada principalmente por tiempo y capaz de adaptarse a incidencias durante el recorrido.

La aplicación puede tener en cuenta situaciones como:

- productos agotados;
- congestión en pasillos;
- derrames;
- reposición;
- pasillos bloqueados;
- colas largas en cajas.

Los usuarios pueden generar reportes colaborativos durante la compra. Estos reportes modifican el estado de la tienda y pueden provocar que la ruta se recalcule en tiempo real.

El proyecto se desarrolla para el Hackathon de la Cátedra Mercadona IT - UPV bajo el reto:

> Hack the Future: construye el supermercado del futuro

---

# 2. Objetivo

El objetivo de Mercadona Sync es mejorar la experiencia de compra presencial mediante una navegación guiada y dinámica.

El sistema debe permitir:

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
Ruta optimizada
  ↓
Navegación
  ↓
Reporte de incidencia
  ↓
Recalculado
  ↓
Selección de caja
  ↓
Fin de compra
```

El foco principal está en el cliente.

Como evolución futura, la información generada por los reportes podría aportar también valor operativo a Mercadona.

---

# 3. Punto de entrada conceptual

El acceso previsto al producto se plantea mediante una etiqueta NFC colocada en el carro de compra.

El usuario acercaría el móvil y se abriría directamente la aplicación web.

Para el hackathon:

- el NFC se explicará durante la presentación;
- la demo comenzará directamente en la interfaz web;
- no se implementará infraestructura NFC real.

---

# 4. Flujo principal

## Usuario identificado

El usuario selecciona un perfil de demostración.

El sistema:

1. carga su lista;
2. relaciona los elementos con productos del catálogo;
3. muestra recomendaciones;
4. permite confirmar la lista;
5. calcula una ruta;
6. inicia la navegación.

## Usuario invitado

El usuario introduce manualmente su lista.

Ejemplo:

```text
leche, huevos, arroz, tomate
```

El sistema busca los productos correspondientes y continúa con el mismo flujo.

## OCR

El OCR queda como funcionalidad opcional.

Si se implementa, permitirá fotografiar una lista y transformarla en elementos de compra.

El flujo principal nunca debe depender del OCR.

---

# 5. Cross-selling

La IA generativa se utiliza únicamente para generar recomendaciones de productos complementarios.

Ejemplo:

```text
Lista:
- pasta
- tomate
- carne picada

Sugerencia:
- queso rallado
```

El usuario decide si acepta o rechaza la recomendación.

La aplicación debe seguir funcionando si la IA falla.

Debe existir siempre un fallback local.

---

# 6. Navegación

Cada tienda se representa mediante:

- plano superior;
- pasillos;
- estanterías;
- entrada;
- cajas;
- productos;
- zonas transitables;
- grafo interno de navegación.

El sistema calcula una ruta dinámica teniendo en cuenta:

```text
distancia
+
tiempo base
+
congestión
+
reposiciones
+
bloqueos
+
incidencias
+
colas
```

El objetivo es reducir el tiempo estimado de compra, no simplemente la distancia recorrida.

---

# 7. Reportes colaborativos

Tipos iniciales de incidencia:

```text
PRODUCT_OUT_OF_STOCK
CONGESTION
BLOCKED_AISLE
SPILL
RESTOCKING
LONG_CHECKOUT_QUEUE
```

Ejemplos de efecto:

```text
SPILL
→ bloquea un tramo

CONGESTION
→ aumenta el coste de paso

PRODUCT_OUT_OF_STOCK
→ elimina un producto pendiente

LONG_CHECKOUT_QUEUE
→ puede cambiar la caja recomendada
```

---

# 8. Stack previsto

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
```

## Lógica

```text
TypeScript
```

## Python

Uso auxiliar para:

- scripts;
- tratamiento de datos;
- pruebas;
- OCR opcional;
- utilidades.

Python no forma parte obligatoria del flujo principal.

---

# 9. Principios técnicos

Mercadona Sync debe cumplir estas reglas:

- el flujo principal debe funcionar sin servicios externos;
- la IA debe estar desacoplada;
- el OCR debe ser opcional;
- el routing debe ejecutarse localmente;
- los productos no deben estar hardcodeados en componentes;
- el mapa no debe calcular rutas;
- el motor de rutas no debe depender de React;
- los datos de tienda deben ser configurables;
- las incidencias deben pasar por un único sistema;
- la demo debe ser determinista.

---

# 10. Arquitectura

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

Resumen:

```text
UI
 │
 ▼
Application Services
 │
 ▼
Domain
 │
 ├── Routing
 ├── Incidents
 ├── Matching
 └── Session
 │
 ▼
Repositories / Providers
 │
 ├── JSON
 ├── AI
 └── OCR
```

---

# 11. Estructura prevista del repositorio

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
├── components/
│   ├── common/
│   └── map/
├── store/
├── data/
├── types/
└── utils/
```

---

# 12. Documentación del proyecto

La documentación principal es:

## `PRODUCT_REQUIREMENTS.md`

Define:

- problema;
- propuesta de valor;
- flujo;
- MVP;
- funcionalidades;
- alcance.

## `ARCHITECTURE.md`

Define:

- arquitectura;
- stack;
- capas;
- routing;
- incidencias;
- persistencia;
- demo.

## `COMPONENTS.md`

Define:

- componentes;
- responsabilidades;
- entradas;
- salidas;
- dependencias.

## `DATA_MODEL.md`

Define:

- tipos;
- contratos;
- entidades;
- ejemplos JSON.

## `AGENTS.md`

Define:

- reglas para agentes de IA;
- límites;
- ownership;
- prioridades;
- coordinación.

## `DEVELOPMENT_PLAN.md`

Define:

- planificación del hackathon;
- horarios;
- hitos;
- reparto;
- feature freeze.

## `TASKS.md`

Define:

- tareas atómicas;
- dependencias;
- prioridades;
- criterios de aceptación.

---

# 13. Orden recomendado de lectura

Para una persona nueva en el proyecto:

```text
README.md
↓
PRODUCT_REQUIREMENTS.md
↓
ARCHITECTURE.md
↓
COMPONENTS.md
↓
DATA_MODEL.md
↓
TASKS.md
```

Para un agente de IA:

```text
AGENTS.md
↓
PRODUCT_REQUIREMENTS.md
↓
ARCHITECTURE.md
↓
DATA_MODEL.md
↓
COMPONENTS.md
↓
TASKS.md
```

---

# 14. Instalación prevista

Una vez creado el proyecto:

```bash
npm install
```

Arranque en desarrollo:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Tests:

```bash
npm run test
```

Si el proyecto todavía no incluye tests, este comando podrá añadirse posteriormente.

---

# 15. Rutas previstas

```text
/
```

Entrada.

```text
/list
```

Lista de compra.

```text
/recommendations
```

Cross-selling.

```text
/route
```

Resumen de recorrido.

```text
/navigation
```

Navegación activa.

```text
/finish
```

Finalización.

```text
/demo
```

Panel interno de simulación.

---

# 16. Modo demo

El modo demo debe permitir provocar situaciones controladas.

Ejemplos:

```text
Crear congestión
Crear derrame
Bloquear pasillo
Marcar producto agotado
Aumentar cola
Cerrar caja
Reset
```

La demo debe usar la misma lógica del sistema real.

No se deben dibujar rutas falsas ni modificar directamente el resultado visual.

---

# 17. Escenario principal de demo

Flujo recomendado:

```text
1. Abrir Mercadona Sync.
2. Seleccionar usuario demo.
3. Cargar lista.
4. Mostrar recomendaciones.
5. Aceptar una.
6. Calcular ruta.
7. Iniciar navegación.
8. Provocar un derrame.
9. Mostrar incidencia.
10. Recalcular ruta.
11. Continuar compra.
12. Elegir la mejor caja.
13. Finalizar.
```

El momento principal es:

```text
Ruta inicial
↓
Incidencia
↓
Recalculado
↓
Nueva ruta visible
```

---

# 18. Escenario secundario

Modo invitado:

```text
Invitado
↓
Texto manual
↓
Matching
↓
Lista
↓
Ruta
```

Este flujo permite demostrar que el producto no depende de un usuario preconfigurado.

---

# 19. MVP

El MVP debe incluir:

- usuario demo;
- invitado;
- lista manual;
- product matching;
- recomendaciones;
- una tienda;
- grafo navegable;
- ruta;
- productos recogidos;
- reportes;
- incidencias;
- recalculado;
- selección de caja;
- finalización;
- panel de demo.

---

# 20. Funcionalidades opcionales

Orden aproximado:

```text
1. OCR
2. Segunda tienda
3. Confirmación colaborativa
4. Alternativas ante agotados
5. Métricas
6. Feedback con IA
7. Funcionalidades para trabajadores
```

Ninguna debe comprometer el MVP.

---

# 21. Datos

## Reales

- productos utilizados en la demo.

## Simulados

- usuarios;
- listas;
- tienda;
- distribución;
- ubicación;
- stock;
- colas;
- tiempos;
- incidencias;
- rutas.

La presentación debe dejar claro qué datos son simulados.

---

# 22. Prioridades

## P0

Flujo completo.

## P1

Pulido visual e IA real.

## P2

OCR, segunda tienda y ampliaciones.

## P3

Funciones futuras.

---

# 23. Regla de desarrollo

Durante el hackathon:

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
Empezar muchas funcionalidades
↓
Integrar al final
```

---

# 24. Regla para agentes

Antes de modificar el proyecto, cualquier agente debe leer:

```text
AGENTS.md
```

y comprobar:

- qué archivos puede tocar;
- qué contratos utiliza;
- qué prioridad tiene la tarea;
- si afecta al MVP;
- si existe una solución más simple.

---

# 25. Fuente de verdad

## Producto

```text
PRODUCT_REQUIREMENTS.md
```

## Arquitectura

```text
ARCHITECTURE.md
```

## Datos

```text
DATA_MODEL.md
```

## Componentes

```text
COMPONENTS.md
```

## Trabajo de agentes

```text
AGENTS.md
```

## Ejecución

```text
DEVELOPMENT_PLAN.md
TASKS.md
```

---

# 26. Estado esperado antes de la entrega

La demo debe funcionar sin depender de:

- OCR;
- Internet;
- APIs de pago;
- autenticación real;
- infraestructura NFC real;
- backend remoto.

La aplicación debe poder mostrar de forma fiable:

```text
lista
→ ruta
→ incidencia
→ recalculado
→ caja
```

---

# 27. Principio final

Mercadona Sync no pretende construir toda la infraestructura real de un supermercado.

Pretende demostrar de forma clara y funcional una idea:

> Una compra presencial puede convertirse en una experiencia guiada y dinámica, capaz de adaptarse a lo que ocurre dentro de la tienda en cada momento.
