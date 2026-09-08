Actúa como un desarrollador experto en videojuegos y especialista en Phaser 3. Vamos a desarrollar un juego de Tower Defense paso a paso. 

Para esta primera fase, necesito que construyas la arquitectura base: la configuración del motor, el sistema de cuadrícula (Grid) y la estructura del Game Loop.

**Restricciones y Reglas Arquitectónicas:**
1. **Código Vainilla:** Usa JavaScript moderno (ES6+) en un solo archivo `game.js` acompañado de un `index.html` mínimo.
2. **Cero Assets Externos:** Usa exclusivamente primitivas geométricas de Phaser (`Phaser.GameObjects.Graphics` o `Phaser.GameObjects.Rectangle`) para dibujar. No uses imágenes externas.
3. **Separación Lógica/Visual:** La cuadrícula debe existir como una matriz 2D de datos (0 = camino, 1 = construible). El dibujado de la cuadrícula debe leer esta matriz.
4. **Optimización del Loop:** No pongas lógica de juego (como buscar enemigos) en el `update()` a 60fps. Crea un sistema de "Ticks" usando los timers de Phaser (ej. `time.addEvent`) que se ejecute cada 200ms para la lógica pesada.
5. **Tareas:** Las distintas tareas de implementación vendrán dadas como ficheros llamados fasex.md donde x es el numero de la fase. Antes de empezar con una fase debes solucitar confirmación 
