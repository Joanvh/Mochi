# DEMO_SCRIPT.md

## 1. Propósito

Este documento define la demostración principal de **Mercadona Sync** ante el jurado.

La demo debe contar una historia simple y visual. El objetivo no es enseñar todas las funcionalidades, sino demostrar con claridad el valor diferencial:

> La lista del cliente se convierte en una ruta dinámica que se adapta a lo que está ocurriendo dentro de la tienda.

El tiempo exacto de presentación no está fijado en esta documentación. El guion debe recortarse o ampliarse cuando la organización confirme la duración disponible.

---

# 2. Mensaje principal

La demo debe transmitir tres ideas:

1. Mercadona Sync reduce la fricción de una compra presencial.
2. La ruta se optimiza por tiempo, no únicamente por distancia.
3. Los reportes colaborativos permiten adaptar la experiencia y generan información potencialmente útil para Mercadona.

---

# 3. Lo que se explica pero no se demuestra

## NFC

La entrada conceptual al producto se realiza mediante una etiqueta NFC en el carro.

Mensaje recomendado:

> El cliente acerca el móvil al carro y accede directamente a Mercadona Sync, sin necesidad de buscar ni instalar una aplicación. Esto también facilita la entrada a clientes ocasionales o extranjeros.

La demo comienza directamente en la web.

## Sistemas reales de Mercadona

No se debe afirmar que existe integración real con:

- cuentas de Mercadona;
- stock;
- posicionamiento indoor;
- mapas reales de tiendas;
- sistemas de caja.

El prototipo utiliza productos reales y datos simulados para tienda, rutas, incidencias y colas.

---

# 4. Preparación previa

Antes de presentar:

- cargar el escenario `NORMAL`;
- ejecutar `RESET DEMO`;
- comprobar que el usuario demo principal existe;
- comprobar su lista;
- comprobar que todos los productos tienen ubicación;
- comprobar el fallback de recomendaciones;
- comprobar la ruta inicial;
- comprobar que el escenario de derrame afecta a esa ruta;
- comprobar que existe una ruta alternativa;
- comprobar las colas de caja;
- cerrar herramientas de desarrollo y ventanas innecesarias.

---

# 5. Roles recomendados

## Presentador

Explica problema, valor y resultado.

## Operador

Controla la aplicación principal.

## Operador de demo

Dispara la incidencia desde `/demo` cuando corresponde.

Con un equipo pequeño, operador y operador de demo pueden ser la misma persona.

---

# 6. Escenario principal

## Usuario

Utilizar un perfil estable, por ejemplo:

```text
Usuario Demo 1
```

## Lista

La lista debe tener entre 6 y 8 productos repartidos por distintas zonas.

Ejemplo:

```text
Leche
Huevos
Arroz
Tomate
Yogur
Detergente
```

La lista definitiva debe coincidir con el dataset real utilizado en la aplicación.

---

# 7. Escena 1 — Entrada

Mostrar la pantalla inicial.

Explicación:

> Hemos pensado Mercadona Sync como una web móvil a la que se puede entrar directamente desde un NFC colocado en el carro. Para la demo empezamos justo después de ese acceso.

Seleccionar el usuario demo.

No dedicar demasiado tiempo al login.

---

# 8. Escena 2 — Lista de compra

Mostrar que la lista se carga automáticamente.

Explicación:

> Un usuario identificado podría recuperar su lista de Mercadona. En nuestro prototipo usamos perfiles simulados para reproducir ese flujo.

Mostrar brevemente el modo invitado si ayuda a explicar el producto, pero no abandonar el escenario principal.

Mensaje secundario:

> Un invitado también puede pegar una lista manualmente. Si terminamos el OCR, podrá incluso fotografiarla.

No demostrar OCR si no está completamente estable.

---

# 9. Escena 3 — Cross-selling

Avanzar a recomendaciones.

Mostrar entre una y tres sugerencias.

Aceptar una.

Explicación:

> Antes de calcular la ruta podemos ofrecer un cross-selling contextual. La IA solo se utiliza en este punto y nunca añade productos sin confirmación del usuario.

Si se está usando el proveedor local de fallback, no afirmar que la recomendación mostrada ha sido generada en vivo por IA.

---

# 10. Escena 4 — Ruta inicial

Confirmar la lista.

Mostrar el plano superior de la tienda y la ruta.

Explicación:

> La tienda se representa como un mapa navegable. La aplicación conoce dónde están los productos y calcula el orden de visita buscando reducir el tiempo total de compra.

Destacar:

- posición;
- siguiente producto;
- productos pendientes;
- ruta;
- cajas.

Evitar explicar Dijkstra salvo que el jurado pregunte.

---

# 11. Escena 5 — Navegación

Marcar uno o dos productos como recogidos.

Mostrar cómo cambia el siguiente objetivo.

Explicación:

> A medida que avanzamos, Mercadona Sync actualiza la compra y mantiene la ruta sobre los productos pendientes.

---

# 12. Escena 6 — Momento principal

Mientras la ruta utiliza el tramo elegido para el escenario, disparar desde `/demo`:

```text
SPILL
```

La incidencia debe bloquear un tramo de la ruta actual.

Resultado esperado:

1. aparece la incidencia en el mapa;
2. se informa al usuario;
3. el tramo queda no transitable;
4. el motor recalcula;
5. aparece una ruta alternativa.

Mensaje recomendado:

> Acaba de aparecer un derrame en una zona por la que íbamos a pasar. Esa información cambia el estado de la tienda y Mercadona Sync recalcula automáticamente el recorrido.

Esperar un instante para que el jurado vea claramente el cambio visual.

Este es el momento más importante de la demo.

---

# 13. Escena 7 — Explicar el modelo colaborativo

Después del recalculado:

> El mismo mecanismo puede utilizarse para congestión, reposiciones, productos agotados o colas. En este prototipo simulamos el estado compartido; en una implantación real estos reportes podrían sincronizarse entre clientes y combinarse con información de los sistemas de tienda.

No afirmar que el prototipo ya sincroniza varios dispositivos.

---

# 14. Escena 8 — Cajas

Completar los productos o avanzar al estado de checkout.

Mostrar varias cajas.

Ejemplo:

```text
Caja 1 — 7 min
Caja 2 — 2 min
Caja 3 — cerrada
```

Explicación:

> La ruta no termina en cualquier caja. También considera el tiempo estimado de cola para elegir la opción más conveniente.

Mostrar la ruta hasta la caja seleccionada.

---

# 15. Escena 9 — Final

Mostrar `FinishPage`.

Cierre recomendado:

> Mercadona Sync no es solo un mapa. Es una capa dinámica sobre la tienda que adapta la compra a lo que está ocurriendo en cada momento. Hoy la usamos para ayudar al cliente; la misma información podría escalarse en el futuro para apoyar también a los trabajadores y a la operación de la tienda.

---

# 16. Segundo escenario de respaldo

Si falla el usuario demo:

```text
Invitado
↓
Lista manual
↓
Matching
↓
Ruta
```

Texto recomendado:

```text
leche, huevos, arroz, tomate
```

Este escenario debe estar probado antes de la presentación.

---

# 17. Plan B — IA

Si el proveedor de IA no responde:

- activar automáticamente `LocalRecommendationProvider`;
- continuar la demo;
- no detenerse a reparar la integración.

La interfaz debe comportarse igual.

---

# 18. Plan B — OCR

Si OCR no está listo o falla:

- no mostrarlo;
- utilizar lista de usuario o entrada manual.

OCR no forma parte del camino crítico.

---

# 19. Plan B — Incidencia

Si el reporte manual no provoca el efecto esperado:

- utilizar el escenario predefinido desde `/demo`;
- cargar `scenario_spill_main_route`;
- comprobar que entra por el mismo `IncidentManager`.

No modificar directamente la ruta para fingir el resultado.

---

# 20. Plan B — Despliegue

Mantener:

- build local funcional;
- aplicación desplegada si existe;
- copia local del dataset;
- navegador ya abierto antes de presentar.

La demo no debe depender exclusivamente de conexión a Internet.

---

# 21. Plan B — Segunda tienda

La segunda tienda no es necesaria para la demo principal.

Si está terminada y estable puede enseñarse al final para demostrar configurabilidad.

Si no lo está, explicarlo verbalmente:

> La distribución de la tienda se carga desde configuración, por lo que el motor no depende de un único plano.

---

# 22. Cosas que no se deben decir

Evitar afirmaciones como:

> Tenemos datos en tiempo real de Mercadona.

> Sabemos realmente dónde está cada cliente.

> Estamos conectados al stock de tienda.

> Nuestra IA genera esta recomendación.

si cualquiera de esas afirmaciones no es cierta en la versión presentada.

---

# 23. Checklist final de demo

```text
[ ] RESET DEMO funciona.
[ ] Usuario principal carga.
[ ] Lista principal carga.
[ ] Matching correcto.
[ ] Cross-selling funciona o activa fallback.
[ ] Ruta inicial utiliza el tramo esperado.
[ ] Derrame bloquea ese tramo.
[ ] Existe ruta alternativa.
[ ] El cambio se ve claramente.
[ ] Producto agotado funciona si se necesita.
[ ] Colas de caja funcionan.
[ ] FinishPage funciona.
[ ] Segundo escenario de invitado funciona.
[ ] Build local disponible.
```

---

# 24. Criterio final

Si hay que recortar la presentación, conservar siempre:

```text
Lista
↓
Ruta
↓
Incidencia
↓
Recalculado
```

Ese es el núcleo de Mercadona Sync.
