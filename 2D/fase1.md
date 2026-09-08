**Modelo de Datos Inicial (Contexto):**
- **Grid:** Tamaño del canvas de 800x600. Celdas de 40x40 píxeles (matriz de 20 columnas x 15 filas).
- **Player:** Empieza con 100 de oro y 20 vidas.

**Tareas a entregar:**
1. El archivo `index.html` básico cargando Phaser 3 vía CDN.
2. El archivo `game.js` con:
   - Configuración base del juego (`Phaser.Game`).
   - Una Escena principal con `preload`, `create` y `update`.
   - Una matriz 2D codificada a mano (hardcodeada) que represente un camino serpenteante simple de un lado al otro del mapa (usa 0 para camino y 1 para área construible).
   - Una función `drawGrid()` que pinte el mapa: celdas construibles en verde oscuro y el camino en color tierra/marrón.
   - La estructura del Timer (Tick) imprimiendo "Tick de lógica" en consola cada 200ms.

Devuelve únicamente el código necesario, estructurado y bien comentado.