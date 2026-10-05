# DESIGN_SYSTEM.md

## 1. Propósito

Este documento define el sistema visual y las reglas de interfaz de **Mercadona Sync**.

Su objetivo es garantizar que todas las pantallas y componentes mantengan una identidad coherente durante el desarrollo, especialmente cuando varias personas o agentes de IA trabajen en paralelo.

El sistema está construido a partir del `style.css` de referencia proporcionado al equipo.

Cuando este documento distingue entre **Fuente CSS**, **Patrón inferido** y **Regla de Mercadona Sync**, debe interpretarse así:

- **Fuente CSS**: valor definido explícitamente en el CSS de referencia.
- **Patrón inferido**: regla deducida de valores recurrentes del CSS.
- **Regla de Mercadona Sync**: adaptación de esos tokens y patrones a los componentes específicos del proyecto.

---

# 2. Relación con el resto de documentación

Debe leerse junto a:

- `PRODUCT_REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `DATA_MODEL.md`
- `AGENTS.md`

Para cambios de interfaz, este documento es la **fuente de verdad visual**.

El orden de decisión es:

```text
Funcionalidad                 → PRODUCT_REQUIREMENTS.md
Arquitectura                  → ARCHITECTURE.md
Responsabilidad de componente → COMPONENTS.md
Contratos de datos            → DATA_MODEL.md
Reglas de agentes             → AGENTS.md
Diseño visual                 → DESIGN_SYSTEM.md
```

Si una decisión visual entra en conflicto con un requisito funcional, prevalece el requisito funcional.

---

# 3. Alcance

Este documento aplica a:

- pantallas React;
- componentes comunes;
- navegación;
- formularios;
- listas;
- recomendaciones;
- navegación dentro de la tienda;
- mapa SVG;
- reportes;
- estados de error;
- estados de carga;
- modales;
- panel de demo.

No define:

- lógica de routing;
- lógica de incidencias;
- contratos de datos;
- algoritmos;
- comportamiento del backend;
- reglas de negocio.

---

# 4. Principios visuales

## 4.1. Identidad

**Patrón inferido**

La interfaz debe mantener:

- estética limpia y funcional;
- fondos blancos y crema claros;
- verde como color principal de acción;
- gris ahumado para texto secundario y bordes;
- rojo para error, peligro y acciones destructivas;
- jerarquía tipográfica clara;
- bordes suavemente redondeados;
- sombras discretas;
- espacios generosos;
- estados interactivos claramente visibles.

Se evitarán efectos decorativos que distraigan del flujo de compra.

---

## 4.2. Mobile first

Mercadona Sync está diseñado principalmente para smartphone.

La interfaz debe:

- priorizar controles táctiles;
- mantener acciones principales accesibles con una mano cuando sea razonable;
- reducir texto durante navegación;
- mantener el mapa legible;
- evitar paneles complejos en pantallas pequeñas.

La versión desktop debe seguir funcionando correctamente para la presentación ante el jurado.

---

## 4.3. Consistencia antes que creatividad local

Ante una duda visual:

```text
1. Reutilizar componente existente
2. Reutilizar token existente
3. Reutilizar patrón equivalente
4. Utilizar un valor recurrente del sistema
5. Crear un nuevo valor solo si es imprescindible
```

No introducir estilos arbitrarios para resolver una pantalla concreta.

---

# 5. Tokens de color

## 5.1. Colores principales

**Fuente CSS**

```css
--cucumber: #00ab61;
--egg: #fcb831;
--orange: #ed6f00;
--blueberry: #346e78;
--chocolat: #714000;
--choco-red: #551313;
--tomato: #d90000;
--black: #000;
--white: #fff;
```

| Token | Valor | Uso general |
|---|---:|---|
| `--cucumber` | `#00AB61` | Acción principal, enlaces, estado positivo |
| `--egg` | `#FCB831` | Aviso y acento secundario |
| `--orange` | `#ED6F00` | Aviso destacado |
| `--blueberry` | `#346E78` | Información secundaria |
| `--chocolat` | `#714000` | Acento oscuro |
| `--choco-red` | `#551313` | Acento oscuro rojizo |
| `--tomato` | `#D90000` | Error, peligro, destructivo |
| `--black` | `#000000` | Texto de máxima jerarquía |
| `--white` | `#FFFFFF` | Fondo principal |

---

## 5.2. Verde principal

**Fuente CSS**

```css
--cucumber: #00ab61;
--cucumber-10: #00ab611a;
--cucumber-white-15: #26b879;
--cucumber-black-20: #00894e;
```

Estados:

```text
Default  #00AB61
Hover    #26B879
Active   #00894E
Subtle   #00AB611A
```

---

## 5.3. Error y peligro

**Fuente CSS**

```css
--tomato: #d90000;
--tomato-light: #fbe5e5;
--tomato-10: #d900001a;
--tomato-white-15: #df2626;
--tomato-black-20: #ae0000;
```

Estados:

```text
Default  #D90000
Hover    #DF2626
Active   #AE0000
Subtle   #FBE5E5
```

---

## 5.4. Neutros

**Fuente CSS**

```css
--smoked-70: #3b3935b3;
--smoked-40: #3b383266;
--smoked-20: #3b393733;
--smoked-8: #3b393714;

--white-20: #fff3;
--white-30: #ffffff4d;
--white-cream: #e6e6e6;
--white-cream-light: #e6e5e34d;
```

Uso:

```text
smoked-70          texto secundario
smoked-40          texto auxiliar
smoked-20          bordes y disabled
smoked-8           fondos o sombras muy suaves
white-cream        divisores
white-cream-light  superficies secundarias
```

---

## 5.5. Fondos

**Fuente CSS**

```css
--navbar-background-mobile: #229e6b;
```

Fondos observados:

```text
#F4F1EC
#F8F5EC
#F3F2EE
#1C3037
```

Uso:

- crema: superficies secundarias;
- `#1C3037`: superficie oscura;
- `#229E6B`: navegación móvil expandida.

---

# 6. Semántica de color para Mercadona Sync

**Regla de Mercadona Sync**

Los siguientes usos adaptan la paleta existente a la aplicación.

| Elemento | Token recomendado |
|---|---|
| Ruta activa | `--cucumber` |
| Posición actual | `--cucumber-black-20` |
| Producto objetivo | `--cucumber` |
| Acción primaria | `--cucumber` |
| Congestión baja | `--egg` |
| Congestión media/alta | `--orange` |
| Derrame | `--tomato` |
| Pasillo bloqueado | `--tomato` |
| Producto agotado | `--choco-red` o `--tomato` |
| Reposición | `--blueberry` |
| Información | `--blueberry` |
| Caja recomendada | `--cucumber` |
| Caja cerrada | `--smoked-40` |
| Error | `--tomato` |

No transmitir el significado exclusivamente mediante color.

Los estados del mapa deben incorporar también:

- icono;
- etiqueta;
- forma;
- texto accesible cuando proceda.

---

# 7. Tipografía

## 7.1. Familias

**Fuente CSS**

```css
--primary-font: PlayfairDisplay-ExtraBold, "Times New Roman";
--secondary-font: Muli, Arial;
```

Reglas:

- **Playfair Display ExtraBold**: títulos de alta jerarquía.
- **Muli**: interfaz, cuerpo, botones y controles.
- Arial: fallback.

No introducir nuevas familias tipográficas durante el hackathon.

---

## 7.2. Base

**Fuente CSS**

```css
html,
body {
  font-size: 16px;
}
```

Por tanto:

```text
1rem = 16px
```

---

## 7.3. Escala

**Fuente CSS + normalización**

| Tamaño | px | Uso |
|---|---:|---|
| `0.75rem` | 12 | ayudas |
| `0.875rem` | 14 | botones, inputs |
| `0.9375rem` | 15 | navegación |
| `1rem` | 16 | cuerpo |
| `1.125rem` | 18 | destacado |
| `1.375rem` | 22 | título modal |
| `1.5rem` | 24 | navegación / icono grande |
| `1.625rem` | 26 | título sección |
| `2.3rem` | 36.8 | título promocional |
| `2.5rem` | 40 | hero móvil |
| `2.8rem` | 44.8 | hero desktop |

Para la interfaz funcional de Mercadona Sync deben priorizarse:

```text
14 / 16 / 18 / 22 / 26 px
```

Los tamaños de hero se reservarán para pantallas de entrada si realmente aportan valor.

---

## 7.4. Pesos

Valores observados:

```text
400
600
700
800
```

Uso recomendado:

```text
400 cuerpo
600 botones y controles
700 subtítulos
800 títulos principales
```

---

# 8. Espaciado

**Patrón inferido**

Escala principal:

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
```

Priorizar:

```text
8 / 16 / 24 / 32 / 40 / 48 / 64
```

No introducir valores nuevos salvo que exista una razón concreta.

---

# 9. Layout

## 9.1. Contenedor

**Fuente CSS**

```css
max-width: 1136px;
```

Desktop:

```css
padding-left: 32px;
padding-right: 32px;
```

En Mercadona Sync, este límite aplica principalmente a pantallas de escritorio y presentación.

La experiencia móvil puede ocupar todo el ancho disponible respetando padding lateral.

---

## 9.2. Breakpoints

**Fuente CSS**

```text
480px
768px
992px
1200px
1440px
1920px
```

Interpretación:

```text
< 480       móvil
>= 480      móvil grande
>= 768      tablet
>= 992      desktop
>= 1200     desktop amplio
>= 1440     pantalla grande
>= 1920     extra grande
```

No crear breakpoints arbitrarios si estos resuelven el caso.

---

# 10. Radios

Valores observados:

```text
3px
4px
6px
8px
100px
100%
```

Uso:

| Radio | Uso |
|---:|---|
| `3px` | input concreto |
| `4px` | botones e inputs |
| `6px` | modal |
| `8px` | cards y superficies |
| `100px` | pills |
| `100%` | círculos |

Para componentes nuevos:

```text
4px o 8px
```

---

# 11. Sombras

**Fuente CSS**

```css
--shadow-default: 0 2px 8px 0 #0000001a;
--shadow-hard: 0 4px 15px 0 #0003;
--shadow-soft: 0 4px 15px 0 #0000001a;

--shadow-card-1: 0 2px 12px 0 var(--white-cream-light);
--shadow-card-1-active: 0 4px 12px 0 var(--smoked-20);

--shadow-card-2: 0 1px 4px 0 var(--smoked-20);
--shadow-card-2-active: 0 2px 8px 0 var(--smoked-20);

--shadow-label: 0 2px 4px 0 var(--smoked-20);
--shadow-upper-soft: 0 -2px 20px 0 #0000001a;
```

Regla:

> Utilizar una sombra existente antes de crear otra.

---

# 12. Botones

## 12.1. Base

**Fuente CSS**

```css
border: 1px solid;
border-radius: 4px;
cursor: pointer;
display: inline-block;
font-size: 0.875rem;
font-weight: 600;
padding: 8px 16px;
text-align: center;
```

Tamaño estándar:

```text
min-height 40px
min-width  88px
```

En acciones móviles importantes se recomienda utilizar al menos el tamaño estándar.

---

## 12.2. Primary

```css
background: var(--cucumber);
border-color: var(--cucumber);
color: var(--white);
```

Hover:

```css
background: var(--cucumber-white-15);
border-color: var(--cucumber-white-15);
```

Active:

```css
background: var(--cucumber-black-20);
border-color: var(--cucumber-black-20);
```

Focus:

```css
box-shadow: 0 0 2px 2px var(--cucumber);
```

Disabled:

```css
background: var(--smoked-20);
border-color: transparent;
```

---

## 12.3. Secondary

```css
border-color: var(--cucumber);
color: var(--cucumber);
```

Hover / active:

```css
background: var(--cucumber-10);
```

---

## 12.4. Destructive

```css
color: var(--tomato);
border-color: var(--tomato);
```

Debe usarse para acciones peligrosas o destructivas.

No utilizar un botón destructivo para reportar una incidencia normal.

---

# 13. Inputs

## 13.1. Input estándar

**Fuente CSS**

```css
border: 1px solid var(--smoked-20);
border-radius: 3px;
font-size: 0.875rem;
height: 48px;
padding: 18px 30px 5px 10px;
width: 100%;
caret-color: var(--cucumber);
```

Focus:

```css
border-color: var(--smoked-40);
```

Error:

```css
border-color: var(--tomato);
```

La entrada manual de lista debe reutilizar este patrón.

---

# 14. Checkbox y selección

**Fuente CSS**

Tamaño visual:

```text
28 × 28px
```

Estado marcado:

```css
background: var(--cucumber);
border-color: var(--cucumber);
color: var(--white);
```

Puede utilizarse para:

- productos recogidos;
- recomendaciones aceptadas;
- opciones de lista.

---

# 15. Cards

**Regla de Mercadona Sync a partir de patrones existentes**

Las cards funcionales deberán utilizar:

```text
background       white
radius           8px
shadow           shadow-card-1 o shadow-card-2
padding          16px o 24px
```

Aplicaciones:

- producto;
- recomendación;
- siguiente producto;
- resumen de ruta;
- caja;
- resumen final.

No introducir cards con estética diferente por pantalla.

---

# 16. Modales

## 16.1. Overlay

**Fuente CSS**

```css
position: fixed;
inset: 0;
width: 100%;
height: 100%;
```

Fondo:

```text
var(--smoked-40)
```

---

## 16.2. Modal estándar

```text
background     white
border-radius  6px
shadow         var(--shadow-hard)
padding        48px 40px 32px
```

En móvil, un modal complejo puede ocupar toda la pantalla.

---

## 16.3. Uso en Mercadona Sync

El sistema de reportes puede utilizar un modal o bottom sheet visualmente equivalente.

Debe permitir completar un reporte con pocas interacciones.

---

# 17. Navegación y cabecera

**Fuente CSS**

Barra de referencia:

```text
background white
height     80px
position   fixed
```

Para Mercadona Sync no es obligatorio reproducir una navbar web corporativa completa.

**Regla de Mercadona Sync**

La cabecera móvil debe ser compacta y priorizar:

- nombre o logotipo del producto;
- volver cuando proceda;
- progreso o contexto;
- acceso a acciones imprescindibles.

No sacrificar área útil del mapa para reproducir navegación desktop innecesaria.

---

# 18. Mapa de tienda

## 18.1. Responsabilidad visual

El `StoreMap` debe representar:

- layout;
- ruta;
- posición;
- objetivo;
- incidencias;
- cajas.

No debe calcular ninguno de esos estados.

---

## 18.2. Ruta

**Regla de Mercadona Sync**

Utilizar el verde principal:

```text
#00AB61
```

La ruta debe:

- ser claramente visible;
- tener grosor suficiente en móvil;
- no ocultar por completo pasillos o incidencias;
- actualizarse visualmente tras un recalculado.

---

## 18.3. Posición

La posición actual debe diferenciarse de la ruta mediante:

- marcador circular;
- borde o contraste;
- etiqueta accesible.

No representar posición mediante color únicamente.

---

## 18.4. Próximo producto

Debe tener más jerarquía que el resto de productos pendientes.

Puede utilizar:

- marcador verde;
- halo sutil;
- label;
- card asociada fuera del mapa.

---

## 18.5. Incidencias

Visualización recomendada:

```text
Congestión     amarillo / naranja + icono
Derrame        rojo + icono
Bloqueo        rojo + icono
Reposición     azul + icono
Agotado        rojo oscuro + indicador en producto
Cola larga     naranja + indicador en caja
```

No introducir colores fuera de la paleta definida.

---

# 19. Pantallas de Mercadona Sync

## 19.1. LandingPage

Debe ser simple.

Prioridad:

1. identidad;
2. iniciar con usuario demo;
3. continuar como invitado.

No necesita un hero complejo.

---

## 19.2. ShoppingListPage

Debe priorizar:

- legibilidad;
- edición rápida;
- acción principal visible;
- estados de producto resuelto/no resuelto.

Los elementos de lista deben compartir el mismo patrón visual.

---

## 19.3. RecommendationsPage

Las recomendaciones deben percibirse como opcionales.

Cada card debe incluir:

- producto;
- motivo si existe;
- aceptar;
- rechazar.

No utilizar patrones visuales que hagan parecer obligatoria una recomendación.

---

## 19.4. RouteSummaryPage

Debe mostrar de forma resumida:

- número de productos;
- tiempo estimado;
- distancia si se usa;
- acción para comenzar.

No saturar esta pantalla con detalle técnico.

---

## 19.5. NavigationPage

Es la pantalla más importante.

Jerarquía recomendada:

```text
1. Mapa
2. Siguiente producto
3. Progreso
4. Acción "Recogido"
5. Reportar incidencia
```

Las notificaciones de recalculado deben ser visibles pero temporales.

---

## 19.6. ReportModal

Debe priorizar:

- iconos;
- etiquetas cortas;
- targets táctiles amplios;
- confirmación clara.

Tipos iniciales:

```text
Producto agotado
Mucha gente
Pasillo bloqueado
Derrame
Reposición
Cola larga
```

---

## 19.7. FinishPage

Debe ser ligera.

Puede incluir:

- compra completada;
- productos;
- tiempo estimado;
- incidencias evitadas;
- CTA de finalización.

El feedback mediante IA es P3 y no debe condicionar su diseño.

---

## 19.8. DemoPanel

`/demo` es una herramienta interna.

Debe ser funcional y claramente distinguible de la aplicación del cliente.

No es necesario que tenga el mismo nivel de pulido visual, pero sí debe utilizar tokens existentes y evitar estilos arbitrarios.

---

# 20. Estados de interacción

El sistema distingue:

```text
default
hover
focus
focus-visible
active
disabled
error
loading
```

No eliminar `focus-visible`.

Ejemplo positivo:

```css
box-shadow: 0 0 2px 2px var(--cucumber);
```

Ejemplo destructivo:

```css
box-shadow: 0 0 2px 2px var(--tomato);
```

---

# 21. Animaciones

Valores observados:

```text
0.2s ease-out
0.2s ease
1.2s ease-in-out
```

Para Mercadona Sync:

- utilizar transiciones breves;
- evitar animaciones decorativas;
- hacer visible el recalculado de ruta sin retrasarlo;
- respetar `prefers-reduced-motion` cuando sea razonable.

No introducir animaciones largas o elásticas.

---

# 22. Z-index

Valores observados:

```text
1
2
6
```

Mantener una escala pequeña.

No utilizar:

```text
9999
```

como solución rápida.

---

# 23. Accesibilidad

La UI debe:

- conservar estados de foco;
- usar HTML semántico;
- usar botones reales;
- mantener estados disabled;
- usar `aria-*` cuando proceda;
- mantener objetivos táctiles suficientes;
- no expresar estados exclusivamente mediante color;
- asociar labels a inputs.

Especialmente en el mapa:

- las incidencias deben tener descripción textual;
- la ruta no puede ser el único mecanismo para conocer el siguiente producto;
- el próximo producto debe aparecer también fuera del SVG.

---

# 24. Iconografía

El CSS de referencia dispone de iconografía propia y patrones existentes.

Cuando exista un icono equivalente, reutilizarlo.

Tamaños habituales:

```text
16px
24px
28px
```

No introducir una nueva biblioteca de iconos solo para resolver uno o dos casos.

Si no están disponibles los assets originales, utilizar iconos simples y consistentes sin añadir una segunda dirección visual.

---

# 25. Tokens normalizados recomendados

Estos aliases facilitan la implementación sin alterar los valores del CSS original.

```css
:root {
  /* Brand */
  --color-primary: #00ab61;
  --color-primary-hover: #26b879;
  --color-primary-active: #00894e;
  --color-primary-subtle: #00ab611a;

  /* Warning */
  --color-warning: #fcb831;
  --color-warning-strong: #ed6f00;

  /* Information */
  --color-info: #346e78;

  /* Error */
  --color-danger: #d90000;
  --color-danger-hover: #df2626;
  --color-danger-active: #ae0000;
  --color-danger-subtle: #fbe5e5;

  /* Text */
  --color-text-primary: #000000;
  --color-text-secondary: #3b3935b3;
  --color-text-muted: #3b383266;

  /* Surfaces */
  --color-background: #ffffff;
  --color-surface-subtle: #e6e5e34d;
  --color-border: #3b393733;
  --color-footer: #1c3037;

  /* Typography */
  --font-display: PlayfairDisplay-ExtraBold, "Times New Roman";
  --font-body: Muli, Arial;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-pill: 100px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Layout */
  --container-main: 1136px;
}
```

Estos nombres son una normalización de Mercadona Sync; los valores proceden de la referencia visual.

---

# 26. Implementación en React

Los componentes visuales deben:

- recibir estado mediante props o stores;
- utilizar clases/tokens compartidos;
- evitar estilos inline repetidos;
- no codificar lógica de negocio;
- no duplicar componentes equivalentes.

Ejemplo:

```tsx
<StoreMap
  store={store}
  route={route}
  incidents={incidents}
  currentNodeId={currentNodeId}
/>
```

El componente debe decidir **cómo representar** esos datos, no **cómo calcularlos**.

---

# 27. Reglas para agentes de IA

Antes de crear o modificar una interfaz, el agente debe:

1. leer `AGENTS.md`;
2. consultar este documento;
3. identificar si ya existe un componente equivalente;
4. utilizar los tokens existentes;
5. respetar los breakpoints;
6. implementar estados interactivos;
7. comprobar móvil y desktop;
8. evitar valores visuales arbitrarios.

El agente no debe:

- inventar colores;
- introducir nuevas fuentes;
- añadir radios distintos sin necesidad;
- crear sombras nuevas sin justificación;
- duplicar componentes;
- usar Tailwind con valores arbitrarios si el proyecto no lo ha adoptado;
- eliminar hover/focus/active/disabled;
- añadir una biblioteca de UI sin autorización;
- modificar la dirección visual por iniciativa propia.

---

# 28. Ownership visual

Los cambios principales afectan a:

```text
src/components/
src/components/map/
src/features/*/
```

El agente de UI/Frontend es responsable de mantener este documento.

El agente de Store Map debe respetarlo al representar:

- rutas;
- marcadores;
- incidencias;
- cajas;
- estados.

Cambiar un token global requiere revisar todas las pantallas afectadas.

---

# 29. Checklist por pantalla

Antes de considerar terminada una pantalla:

```text
[ ] Usa tokens existentes.
[ ] Usa Muli para interfaz.
[ ] Usa Playfair solo donde corresponde.
[ ] Acción primaria en verde.
[ ] No hay colores arbitrarios.
[ ] Radios consistentes.
[ ] Espaciado basado en escala.
[ ] Hover implementado donde aplica.
[ ] Active implementado donde aplica.
[ ] Focus-visible implementado.
[ ] Disabled implementado.
[ ] Error implementado donde aplica.
[ ] Mobile comprobado.
[ ] Desktop comprobado.
[ ] Targets táctiles suficientes.
[ ] No hay componentes duplicados.
[ ] No se transmite información solo por color.
```

---

# 30. Checklist del mapa

```text
[ ] Ruta legible en móvil.
[ ] Posición claramente diferenciada.
[ ] Próximo producto destacado.
[ ] Incidencias distinguibles.
[ ] Incidencias incluyen icono o etiqueta.
[ ] Cajas muestran estado.
[ ] Ruta recalculada se percibe claramente.
[ ] SVG escala correctamente.
[ ] El mapa no contiene lógica de routing.
[ ] Existe alternativa textual al próximo objetivo.
```

---

# 31. Patrones del CSS de referencia no prioritarios para el MVP

El CSS original incluye también patrones para:

- hero;
- footer corporativo;
- cookie banner;
- navegación web completa;
- tooltips promocionales;
- secciones editoriales.

Estos patrones pueden reutilizarse si una pantalla los necesita, pero **no deben implementarse únicamente para reproducir la web de referencia**.

Mercadona Sync es una herramienta de compra móvil y debe priorizar funcionalidad y claridad.

---

# 32. Referencia rápida

```text
PRIMARY              #00AB61
PRIMARY HOVER        #26B879
PRIMARY ACTIVE       #00894E

WARNING              #FCB831
WARNING STRONG       #ED6F00
INFO                 #346E78

DANGER               #D90000
DANGER HOVER         #DF2626
DANGER ACTIVE        #AE0000

BACKGROUND           #FFFFFF
TEXT PRIMARY         #000000
TEXT SECONDARY       #3B3935B3
FOOTER/DARK          #1C3037

DISPLAY FONT         PlayfairDisplay-ExtraBold
BODY FONT            Muli

BUTTON RADIUS        4px
CARD RADIUS          8px
STANDARD INPUT       48px
LARGE CONTROL        56px
MAIN CONTAINER       1136px

BREAKPOINTS          480 / 768 / 992 / 1200 / 1440 / 1920
```

---

# 33. Criterio final

Ante cualquier decisión visual:

> La interfaz debe parecer parte del mismo producto antes que una colección de pantallas diseñadas por personas o agentes diferentes.

Mercadona Sync debe mantener una identidad consistente, funcional, mobile-first y cercana al lenguaje visual definido por el CSS de referencia.

---

# 34. Procedencia

Este documento está adaptado para Mercadona Sync a partir del `DESIGN_SYSTEM.md` original generado desde `style.css`.

Los tokens y valores marcados como **Fuente CSS** proceden del documento original.

Las adaptaciones específicas del proyecto están marcadas como **Regla de Mercadona Sync** y no deben confundirse con tokens oficiales del CSS de origen.
