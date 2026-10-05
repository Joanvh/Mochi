# PRODUCT_REQUIREMENTS.md

## 1. Información general

### Nombre provisional
Mercadona Sync

### Contexto
Proyecto desarrollado para el Hackathon de la Cátedra Mercadona IT - UPV bajo el reto:

> "Hack the Future: construye el supermercado del futuro"

### Objetivo del documento
Este documento define qué debe hacer el producto, qué problemas pretende resolver, qué funcionalidades forman parte del MVP y cuáles quedan fuera del alcance inicial.

Debe utilizarse como referencia funcional durante todo el desarrollo.

Las decisiones técnicas concretas se documentarán posteriormente en `ARCHITECTURE.md`, `COMPONENTS.md` y `DATA_MODEL.md`.

---

# 2. Visión del producto

Mercadona Sync es una experiencia web móvil para acompañar al cliente durante su compra presencial en Mercadona.

El sistema transforma la lista de la compra del usuario en una ruta dinámica por el supermercado, optimizada para reducir el tiempo de compra.

La ruta no depende únicamente de la distancia. Debe adaptarse al estado de la tienda teniendo en cuenta incidencias como congestión, productos agotados, reposiciones, pasillos bloqueados, derrames o colas elevadas en las cajas.

Los propios usuarios pueden generar reportes durante la compra, de forma similar al modelo colaborativo de Waze.

Esta información beneficia directamente al resto de clientes y, de forma agregada, puede convertirse también en una fuente de información útil para Mercadona.

---

# 3. Problema

Durante una compra presencial pueden producirse diferentes situaciones que generan pérdida de tiempo y una peor experiencia:

- El cliente no sabe dónde se encuentran los productos.
- Recorre varias veces las mismas zonas.
- Desconoce la distribución de una tienda que no frecuenta.
- Un producto de su lista puede estar agotado.
- Una zona puede estar congestionada.
- Puede haber pasillos temporalmente bloqueados.
- Puede coincidir con procesos de reposición.
- Puede encontrarse con una incidencia como un derrame.
- Al terminar la compra puede dirigirse a una caja con una cola elevada.

Los mapas estáticos o las rutas calculadas únicamente por distancia no solucionan estos problemas porque no tienen en cuenta lo que está ocurriendo en la tienda en cada momento.

---

# 4. Propuesta de valor

## Para el cliente

El producto pretende ofrecer:

- Menos tiempo dedicado a localizar productos.
- Un recorrido adaptado a su lista de compra.
- Navegación por tiendas que no conoce.
- Información sobre incidencias antes de llegar a ellas.
- Recalculado automático de la ruta cuando cambia el estado de la tienda.
- Ayuda para evitar productos agotados o zonas problemáticas.
- Una mejor elección de caja al finalizar la compra.
- Recomendaciones complementarias antes de iniciar el recorrido.

## Para Mercadona

Aunque el MVP está orientado principalmente al cliente, los reportes generados durante el uso pueden aportar información sobre:

- congestión;
- posibles roturas de stock;
- incidencias;
- problemas recurrentes en determinadas zonas;
- interacción entre reposición y flujo de clientes;
- presión sobre las cajas.

En una evolución futura, esta misma plataforma podría disponer de herramientas específicas para trabajadores.

---

# 5. Punto de entrada

Conceptualmente, el usuario accede al sistema mediante una etiqueta NFC situada en el carro de compra.

Al acercar su teléfono, el NFC abriría directamente la aplicación web correspondiente.

El NFC no se implementará físicamente durante el hackathon.

La demostración comenzará directamente en la página que se abriría después de utilizarlo.

Durante la presentación se explicará el NFC como una forma de reducir la fricción de entrada al sistema y facilitar especialmente su descubrimiento por parte de clientes que no tengan instalada ninguna aplicación, incluidos turistas y visitantes extranjeros.

---

# 6. Usuarios

## 6.1 Usuario identificado

El usuario podrá seleccionar un perfil de Mercadona simulado.

Para el prototipo existirán varios usuarios ficticios con listas de compra previamente definidas.

Al iniciar sesión:

1. se recupera automáticamente su lista;
2. la lista puede revisarse;
3. los elementos se relacionan con productos del catálogo;
4. se ofrecen recomendaciones;
5. el usuario confirma la lista definitiva;
6. comienza la navegación.

No se implementará autenticación real con sistemas de Mercadona.

---

## 6.2 Usuario invitado

El usuario podrá continuar sin iniciar sesión.

Debe poder introducir su lista de compra manualmente mediante un campo de texto.

Ejemplo:

`leche, huevos, arroz, tomate, yogures, detergente`

El sistema deberá interpretar los elementos y relacionarlos con productos del catálogo.

### OCR

Como funcionalidad adicional, se podrá incorporar la posibilidad de fotografiar una lista y extraer automáticamente sus elementos.

El OCR es una funcionalidad de prioridad baja.

El funcionamiento completo del producto no puede depender de su implementación.

---

# 7. Flujo principal del usuario

El flujo objetivo es:

1. Acceso a la aplicación.
2. Selección entre usuario identificado o invitado.
3. Obtención de la lista de compra.
4. Interpretación de sus elementos.
5. Relación con productos reales del catálogo.
6. Presentación de recomendaciones de cross-selling.
7. Aceptación o rechazo de las recomendaciones.
8. Confirmación de la lista definitiva.
9. Generación de una ruta inicial.
10. Inicio de la compra guiada.
11. Marcado progresivo de productos como recogidos.
12. Visualización de incidencias.
13. Creación de nuevos reportes por parte del usuario.
14. Recalculado automático de la ruta cuando sea necesario.
15. Selección de una caja adecuada.
16. Finalización de la compra.

---

# 8. Catálogo de productos

El prototipo utilizará productos reales de Mercadona.

Para garantizar la estabilidad durante la demostración, el subconjunto necesario para la demo se almacenará localmente.

No se debe hacer depender el MVP de una API externa de Mercadona.

El catálogo deberá contener como mínimo:

- identificador;
- nombre;
- categoría;
- información necesaria para mostrar el producto;
- ubicación dentro de cada tienda configurada.

El documento inicial contemplaba obtener los productos mediante una API y posteriormente utilizarlos para generar recomendaciones y la ruta. :chatgpt-content-reference{index="0"}

Para el hackathon, el producto debe poder funcionar aunque ninguna API externa esté disponible.

---

# 9. Representación del supermercado

Cada supermercado se representará mediante una vista superior simplificada.

Debe mostrar visualmente:

- pasillos;
- estanterías;
- zonas transitables;
- ubicación de productos;
- entrada;
- cajas;
- incidencias relevantes;
- ruta actual del usuario.

La distribución del supermercado será simulada.

El sistema debe diseñarse de forma que una tienda pueda cambiarse por otra modificando su configuración, sin necesidad de reprogramar la aplicación.

La compatibilidad con varias tiendas es deseable, pero una única tienda completamente funcional tiene prioridad sobre varias tiendas incompletas.

---

# 10. Motor de rutas

## Objetivo

El algoritmo debe optimizar principalmente el tiempo estimado de compra.

La ruta no debe calcularse exclusivamente en función de la distancia física.

Debe considerar también el estado actual de la tienda.

## Factores que pueden afectar a la ruta

Como mínimo:

- distancia;
- congestión;
- pasillos bloqueados;
- derrames u otras incidencias de seguridad;
- reposición en curso;
- productos agotados;
- colas en cajas.

Cada tipo de incidencia puede afectar de forma diferente.

### Ejemplo

Una zona congestionada:

- sigue siendo transitable;
- aumenta su coste estimado.

Un derrame o pasillo bloqueado:

- puede considerarse temporalmente no transitable.

Una reposición:

- genera una penalización moderada.

Una cola elevada:

- aumenta el coste asociado a una determinada caja.

---

# 11. Navegación durante la compra

Durante el recorrido el usuario debe poder visualizar:

- su posición simulada;
- la ruta completa o siguiente tramo;
- el próximo producto;
- productos pendientes;
- productos ya recogidos;
- incidencias relevantes;
- destino final.

Cuando recoge un producto deberá poder marcarlo como completado.

El sistema actualizará entonces el siguiente objetivo de la ruta.

Si aparece una incidencia que afecta al recorrido, la ruta debe recalcularse automáticamente.

El usuario debe recibir una indicación visible de que la ruta ha cambiado y del motivo.

Ejemplo:

> Ruta actualizada: se evita el pasillo 4 debido a una incidencia.

---

# 12. Sistema colaborativo de reportes

Uno de los elementos principales del producto será la capacidad de los usuarios para reportar situaciones que afectan a la experiencia de compra.

El concepto toma como referencia el modelo colaborativo utilizado por aplicaciones de navegación como Waze. El documento inicial ya establece que los reportes realizados por los usuarios deben poder modificar la ruta y generar además información útil para el supermercado. :chatgpt-content-reference{index="1"}

## Tipos iniciales de reporte

### PRODUCT_OUT_OF_STOCK
Producto aparentemente agotado.

Consecuencia:
- advertir a otros usuarios;
- evitar que la ruta intente localizarlo;
- permitir en el futuro recomendar una alternativa.

### CONGESTION
Zona con acumulación elevada de personas.

Consecuencia:
- aumentar el tiempo estimado para atravesarla;
- buscar una alternativa cuando sea conveniente.

### BLOCKED_AISLE
Pasillo temporalmente bloqueado.

Consecuencia:
- impedir temporalmente que la ruta lo utilice.

### SPILL
Derrame u otra incidencia que pueda dificultar o impedir el paso.

Consecuencia:
- evitar la zona;
- recalcular la ruta.

### RESTOCKING
Proceso de reposición que dificulta el tránsito.

Consecuencia:
- penalizar temporalmente el paso por esa zona.

### LONG_CHECKOUT_QUEUE
Cola elevada en una caja.

Consecuencia:
- aumentar el tiempo estimado de esa caja;
- recomendar otra si resulta más conveniente.

---

# 13. Valor secundario de los reportes

El sistema de reportes está diseñado principalmente para mejorar la experiencia del cliente.

Sin embargo, esta información puede generar también señales útiles para Mercadona.

Ejemplos:

- concentración recurrente de clientes en determinados puntos;
- productos reportados repetidamente como agotados;
- incidencias frecuentes;
- zonas con problemas de circulación;
- cajas con elevada presión;
- interacción entre tareas de reposición y circulación.

El prototipo no incluirá un sistema completo de análisis interno para Mercadona.

Esta posibilidad se presentará como evolución futura.

---

# 14. Cross-selling mediante IA

La inteligencia artificial generativa tendrá un papel limitado y claramente definido.

Su única funcionalidad obligatoria será generar recomendaciones de productos complementarios antes de iniciar la compra.

Ejemplo:

Lista:

- pasta;
- tomate;
- carne picada.

Recomendación:

> ¿Quieres añadir queso rallado?

Las recomendaciones deberán mostrarse antes de calcular la ruta definitiva.

El usuario debe poder:

- aceptar;
- rechazar;
- ignorar.

La IA nunca añadirá automáticamente productos.

## Principio fundamental

El funcionamiento principal del producto no debe depender de la IA.

Si la IA no está disponible:

- la lista debe seguir funcionando;
- la navegación debe seguir funcionando;
- los reportes deben seguir funcionando;
- la ruta debe seguir recalculándose.

---

# 15. Feedback mediante IA

Si el desarrollo principal está completamente terminado, podrá añadirse como funcionalidad adicional un pequeño chat al finalizar la compra.

Su objetivo sería recopilar feedback del cliente sobre su experiencia.

Esta funcionalidad queda explícitamente fuera del MVP.

---

# 16. MVP obligatorio

El proyecto se considerará funcional si permite completar este flujo:

1. Abrir la aplicación.
2. Acceder como usuario simulado o invitado.
3. Obtener una lista de compra.
4. Relacionarla con productos.
5. Mostrar recomendaciones de cross-selling.
6. Aceptar o rechazar recomendaciones.
7. Mostrar el supermercado.
8. Calcular una ruta.
9. Iniciar navegación.
10. Marcar productos como recogidos.
11. Mostrar o crear una incidencia.
12. Recalcular la ruta debido a esa incidencia.
13. Llegar a una caja.
14. Finalizar la compra.

Todo elemento que impida completar este flujo tiene prioridad máxima durante el desarrollo.

---

# 17. Funcionalidades secundarias

Una vez completado y estabilizado el MVP, las siguientes funcionalidades podrán desarrollarse en este orden aproximado:

1. OCR de listas.
2. Soporte para varias tiendas.
3. Confirmación colaborativa de reportes.
4. Alternativas ante productos agotados.
5. Mejoras visuales de navegación.
6. Métricas de tiempo ahorrado.
7. Chat de feedback.
8. Funcionalidades específicas para trabajadores.

Ninguna de ellas debe comprometer el funcionamiento del MVP.

---

# 18. Fuera de alcance

El hackathon no pretende implementar:

- integración real con cuentas de Mercadona;
- autenticación real;
- infraestructura NFC real;
- posicionamiento indoor real;
- sensorización real de las tiendas;
- integración con sistemas internos de Mercadona;
- stock real en tiempo real;
- infraestructura de producción;
- analítica empresarial completa;
- herramientas completas para trabajadores;
- reconocimiento automático de la posición física del usuario;
- modelos predictivos de afluencia;
- optimización global de todos los clientes simultáneamente.

Estos elementos podrán mencionarse como posibles evoluciones.

---

# 19. Datos del prototipo

## Datos reales

- nombres y características del subconjunto de productos utilizado en la demo.

## Datos simulados

- usuarios;
- listas asociadas;
- distribución de tiendas;
- ubicación de productos;
- posición del usuario;
- congestión;
- incidencias;
- colas;
- tiempos;
- stock;
- reposiciones.

La interfaz debe evitar presentar datos simulados como si procedieran realmente de los sistemas de Mercadona.

---

# 20. Requisitos de experiencia de usuario

La aplicación debe diseñarse principalmente para smartphone.

Debe cumplir los siguientes principios:

- interfaz sencilla;
- acciones principales fácilmente accesibles;
- poco texto durante la navegación;
- mapa comprensible de un vistazo;
- incidencias diferenciables visualmente;
- confirmación clara cuando cambia la ruta;
- navegación utilizable con una sola mano cuando sea razonable;
- número reducido de interacciones para reportar una incidencia.

La aplicación también debe visualizarse correctamente en un ordenador para facilitar la presentación ante el jurado.

---

# 21. Requisitos no funcionales

## Independencia de servicios externos

El flujo principal debe funcionar aunque no exista conexión con servicios externos.

## Rendimiento

Las operaciones de navegación y recalculado deben sentirse inmediatas durante la demostración.

## Modularidad

Las funcionalidades deben estar desacopladas para permitir que distintos miembros del equipo y agentes de IA trabajen en paralelo.

## Configurabilidad

La distribución de la tienda y sus productos no debe estar codificada directamente en los componentes visuales.

## Robustez

La demo principal debe poder ejecutarse repetidamente obteniendo resultados predecibles.

## Simplicidad

Se evitará introducir infraestructura que no aporte valor directo al prototipo.

---

# 22. Tecnologías previstas

Como orientación inicial:

- React para interfaz.
- TypeScript para lógica de aplicación.
- Python para procesamiento o consultas donde resulte conveniente.
- JSON como almacenamiento principal de los datos simulados.

Las decisiones definitivas pertenecen a `ARCHITECTURE.md`.

Este documento no obliga a utilizar Python cuando la misma funcionalidad pueda resolverse de forma más sencilla dentro de TypeScript.

---

# 23. Demostración objetivo

La demo deberá contar una historia continua.

## Escena 1 — Inicio

Se explica brevemente que el acceso real se produciría acercando el móvil al NFC del carro.

La demostración comienza directamente en la web.

## Escena 2 — Lista

Se carga una lista asociada a un usuario o se introduce manualmente.

Si el OCR está disponible, podrá utilizarse para aumentar el impacto visual.

## Escena 3 — Cross-selling

La IA propone uno o varios productos complementarios.

El usuario acepta o rechaza las sugerencias.

## Escena 4 — Ruta

La aplicación muestra el supermercado y calcula el recorrido.

Comienza la compra.

## Escena 5 — Incidencia

Durante el recorrido se genera una incidencia.

Por ejemplo:

> Derrame en pasillo 4.

El sistema modifica el estado de la tienda y recalcula inmediatamente la ruta.

## Escena 6 — Final

El cliente completa sus productos y se dirige a la caja con menor coste estimado.

La compra finaliza.

---

# 24. Momentos clave de la demo

La presentación debe intentar transmitir visualmente tres ideas:

### 1. Convertir una lista en una experiencia guiada

El usuario no necesita conocer la tienda.

### 2. El supermercado cambia y la ruta cambia con él

Este es el principal elemento diferenciador.

### 3. Los clientes generan información útil para otros clientes y potencialmente para Mercadona

La aplicación no es únicamente un navegador.

Es un sistema colaborativo.

---

# 25. Criterios de aceptación del MVP

El MVP puede darse por terminado cuando se cumplan todos estos criterios:

- [ ] Se puede acceder a la pantalla inicial.
- [ ] Existe al menos un usuario de demostración.
- [ ] Se puede utilizar el sistema como invitado.
- [ ] Puede cargarse una lista.
- [ ] Los elementos de la lista se relacionan con productos.
- [ ] Se pueden mostrar recomendaciones.
- [ ] Las recomendaciones pueden aceptarse o rechazarse.
- [ ] Existe al menos una tienda navegable.
- [ ] Los productos tienen ubicaciones.
- [ ] Puede calcularse una ruta completa.
- [ ] El usuario puede marcar productos como recogidos.
- [ ] Puede crearse al menos un reporte.
- [ ] El reporte modifica el estado de la tienda.
- [ ] Una incidencia relevante provoca recalculado.
- [ ] El cambio de ruta se muestra visualmente.
- [ ] Existen varias cajas o destinos finales.
- [ ] El usuario puede completar la compra.
- [ ] Toda la demo principal funciona sin OCR.
- [ ] Toda la demo principal funciona aunque falle la IA.

---

# 26. Principio de desarrollo

Durante el hackathon se priorizará:

> Una experiencia completa, estable y visualmente convincente antes que un gran número de funcionalidades incompletas.

El orden de prioridad será:

1. flujo completo;
2. estabilidad;
3. recalculado dinámico;
4. claridad visual;
5. experiencia de demostración;
6. funcionalidades adicionales.

No se añadirá ninguna funcionalidad secundaria si pone en riesgo el funcionamiento del flujo principal.