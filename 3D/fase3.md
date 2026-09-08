El núcleo de combate y movimiento 3D en Babylon.js funciona perfectamente. Ahora necesitamos estabilizar la arquitectura creando un "Director de Juego" (Game State Manager) y una Interfaz de Usuario (UI) externa en HTML/CSS, desacoplada por completo del renderizado 3D.

**Restricciones y Reglas Arquitectónicas:**
1. **Separación Estricta:** El motor 3D (Babylon) NO debe renderizar ningún texto ni elemento de interfaz de usuario.
2. **UI Superpuesta:** Crea un `<div>` superpuesto (`position: absolute; z-index: 10`) encima del elemento `<canvas>`. Este div contendrá los contadores de Oro, Vidas y Oleada Actual usando elementos HTML estándar (`<span>`, `<h1>`, etc.).
3. **Estado Global Centralizado:** Toda la información lógica (vidas, oro, estado de pausa) debe residir en una única clase/objeto JavaScript (ej. `GameManager`), que será la única autorizada para modificar el DOM.

**Tareas a entregar:**

1. **Estructura HTML/CSS:**
   - Proporciona el código de un `index.html` que incluya el `<canvas>` para Babylon y un `<div>` llamado `ui-layer` que cubra toda la pantalla, con pointer-events: none (excepto en los botones, si los hay).
   - Añade etiquetas HTML para "Oro", "Vidas" y un botón de "Empezar Oleada".

2. **Clase GameManager:**
   - Crea un objeto/clase con propiedades: `gold = 100`, `lives = 20`, `currentWave = 1`.
   - Crea métodos: `addGold(amount)`, `loseLife()`, y un método `updateUI()` que inyecte los valores actuales en los elementos del DOM usando `document.getElementById().innerText`.

3. **Conexión (Eventos, no acoplamiento directo):**
   - Refactoriza brevemente cómo Babylon notifica las cosas. En lugar de que el enemigo o el proyectil modifiquen la UI o el oro directamente, deben llamar a los métodos del `GameManager` (ej. `GameManager.addGold(enemy.bounty)` o `GameManager.loseLife()`).

Proporciona el HTML actualizado con su CSS en línea (o en bloque style) para que la UI flote correctamente sobre el canvas, y el código de la clase `GameManager`.