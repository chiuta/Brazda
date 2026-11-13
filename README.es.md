# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 1.1.6 · Última actualización: 2026-11-13

Un decodificador y codificador paso a paso del **Disco de Oro de la Voyager** (Voyager Interstellar Record). Un solo archivo HTML (`index.html`), sin dependencias externas, sin servidor, sin rastreadores. Funciona sin conexión: abre el archivo en un navegador.

La aplicación está disponible en **8 idiomas** (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Elige el idioma con los botones de la parte superior de la página; la elección se recuerda, y `index.html?lang=de` abre directamente un idioma determinado.

## Qué hace

La aplicación tiene 12 pasos:

1. **El disco y su cubierta**: un diagrama interactivo con zonas que puedes tocar.
2. **Velocidad**: 16⅔ rpm comparadas con otras velocidades, y el efecto sobre la duración de una línea.
3. **El reloj del hidrógeno**: la transición de 1420.405751768 MHz (período ≈ 0.704 ns) y un conversor binario → tiempo.
4. **El mapa de los púlsares**: período en segundos → número binario de unidades de hidrógeno.
5. **La señal de una imagen**: 512 líneas × 8 ms × 384 muestras a 48 kHz; escucha y exporta WAV.
6. **Calibración con el círculo**: estimación automática de la longitud de la línea, refinada por la redondez del círculo.
7. **Decodificación línea a línea**: animación, velocidad ajustable, ruido de pista.
8. **Color**: tres fotogramas, R, G, B.
9. **Tu propio archivo**: carga una grabación de audio y decodifícala localmente (canal, inicio, L, desplazamiento vertical, modo de color, exportación a PNG).
10. **Contribuir**: cualquiera puede enviar un saludo escrito, una imagen o un mensaje de voz (de hasta 15 s) como paquete `.json`. Nada sale del navegador por sí solo. La dirección `…/index.html#contribute` abre este paso directamente.
11. **Codificación 2026–2027**: construye el disco de una sonda lanzada ahora. Las imágenes (con un círculo de calibración y una página de texto) se convierten en un WAV de 48 kHz; importas las contribuciones del público tras su moderación; puedes añadir una pista musical, solo con una ficha de derechos completada; exportas el WAV, un índice, los números para la cubierta y los períodos de los púlsares en la fecha de lanzamiento.
12. **El disco original (1977)**: las 27 piezas de música, los 55 idiomas, las imágenes, los mensajes y la situación de los derechos de autor.

## Derechos de autor y música

La aplicación **no contiene** ninguna música ni ninguna grabación protegida. La pista musical del paso 11 requiere un archivo que aportes tú, además de los titulares de los derechos y una referencia de licencia. No se puede añadir una pista con derechos poco claros.

El ejemplo «Here Comes the Sun» (Beatles) se incluye como ficha de partida precisamente porque muestra el problema: la canción está protegida y, para la grabación original de los Beatles, se necesita una licencia tanto para la composición como para la grabación. Para una interpretación propia solo se necesita la licencia de la composición. Los detalles y las fuentes están en el paso 12.

Esto no es asesoramiento jurídico.

## Limitaciones conocidas

- **Las imágenes de los pasos 1–8 son esquemáticas**, generadas en la aplicación; no son las imágenes de la NASA. Para las imágenes reales usa el paso 9 con un segmento de audio de una grabación del disco.
- **La decodificación de una grabación real no se ha probado**, porque no hay ningún archivo real en el repositorio. El método está verificado con señales sintéticas; puede ser necesario un ajuste manual (inicio, L, desplazamiento vertical).
- **La calibración automática** tiene dos etapas. La estimación por autocorrelación da L con una precisión de ~1 muestra, lo que supone una inclinación visible a lo largo de 512 columnas. Solo el refinamiento con el círculo alcanza ~0.002. Las imágenes periódicas (tableros de ajedrez, rayas diagonales) y los tonos puros son ambiguos por naturaleza.
- **Los períodos de los púlsares** (paso 11) se extrapolan linealmente a partir de valores de referencia aproximados. Para un disco real usa los períodos medidos de los 14 púlsares del catálogo ATNF.
- **La lista de «Sonidos de la Tierra»** del paso 12 está hecha de memoria y debe contrastarse con las fuentes de la NASA. La clasificación de derechos (A–D) es orientativa y es propia del autor.
- **Memoria**: una codificación grande necesita mucha memoria. El límite es de 160 fotogramas en ordenador y de 60 en dispositivos táctiles.
- **Traducciones**: el texto en rumano es el original; los demás idiomas se produjeron mediante traducción automática y no han sido revisados por hablantes nativos.
- Probada solo en **Chromium** (Playwright). Safari y Firefox no se probaron; la grabación con micrófono solo se probó con un dispositivo de audio simulado.

## Pruebas

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

La prueba en navegador comprueba, en cada tamaño: todos los pasos, el desbordamiento horizontal, el tamaño de los elementos táctiles, los errores de JS, los archivos de audio e imagen dañados, los paquetes de contribución maliciosos (XSS, WAV con frecuencia 0 o enorme, base64 truncado, contaminación de prototipos), los valores extremos de los campos, la codificación con comprobación de PSNR y el bloqueo de las pistas sin derechos.

## Traducción

Los textos están en `i18n/<lang>.json` (el archivo en rumano es la fuente). Tras editarlos, ejecuta `python3 tools/build-i18n.py` para incrustarlos en `index.html`; `npm run test:i18n` comprueba que cada idioma tenga todas las claves, con los mismos marcadores de posición y el mismo marcado en línea.

## Seguridad y privacidad

Todo se queda en el navegador. La página tiene una CSP que prohíbe cualquier conexión de red (`connect-src 'none'`). Las contribuciones son archivos que el usuario envía por su cuenta; la dirección de recogida es la constante `COLLECT_EMAIL` de `index.html`.

## Fuentes

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Detalles oficiales sobre el disco: NASA/JPL.

## Apoyo

Si el proyecto te resulta útil: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licencia

MIT. Consulta `LICENSE`.
