El núcleo gráfico y visual ya está completo. Ahora vamos a implementar la interfaz avanzada en HTML/CSS y el sistema de selección/mejora de torres, manteniendo la UI completamente separada del motor 3D (Babylon.js).

**Restricciones y Reglas Arquitectónicas:**
1. **Catálogo de Datos (Data-Driven):** Crea un objeto global `TowerCatalog` que defina al menos dos tipos de torre (ej. 'basic', 'sniper'). Cada tipo debe tener un array `levels` donde cada índice represente un nivel y contenga: `cost`, `damage`, `range`, `fireRate`.
2. **UI en DOM puro:** Crea dos nuevos paneles en el HTML (superpuestos al canvas, con `pointer-events: none` excepto en los botones):
   - `build-menu`: Una barra inferior con botones para seleccionar qué torre construir.
   - `upgrade-panel`: Un panel lateral (oculto por defecto) que se muestra al hacer clic en una torre construida.
3. **Vista Previa de Mejora:** El `upgrade-panel` debe mostrar las estadísticas actuales y, si no está al nivel máximo, el incremento. Ejemplo de formato HTML deseado: "Daño: 10 <span>-> 15</span>" (usando CSS para poner el incremento en verde).

**Tareas a entregar (Código HTML/CSS y JS):**

1. **Gestión de Interacción (GameManager):**
   - Añade variables de estado: `selectedBuildType = 'basic'` (tipo de torre a construir) y `selectedTower = null` (instancia de la torre clicada).
   - Crea métodos en el UI Manager para poblar dinámicamente el `upgrade-panel` leyendo los datos del nivel actual de `selectedTower` y el siguiente nivel (si existe).

2. **Lógica de Raycasting (Actualización del Clic):**
   - Modifica el evento de clic en el canvas:
     - Si el Raycast golpea una **Torre** (malla de torre): Asigna esa torre a `selectedTower`, abre el `upgrade-panel` con sus datos, y resalta la torre en 3D (ej. añadiéndole un borde o emitiendo una luz bajo ella).
     - Si el Raycast golpea una **Celda Vacía** del mapa: Oculta el `upgrade-panel`. Si el jugador tiene oro suficiente según el coste del nivel 0 del `selectedBuildType`, instancia la torre, deduce el oro y guarda su tipo y nivel actual (`level = 0`).

3. **Mecánica de Mejora (Upgrade):**
   - El botón "Mejorar" del panel HTML debe llamar a una función `upgradeSelectedTower()`.
   - Valida si hay oro suficiente para el costo del siguiente nivel.
   - Si es válido: resta el oro, incrementa `selectedTower.level`, actualiza visualmente la torre (puedes escalar ligeramente la malla o cambiarle un color sutilmente para denotar mejora), reproduce el efecto de partículas de construcción, y actualiza los textos del panel.

Proporciona la estructura del `TowerCatalog`, el código del HTML/CSS de los paneles, y la refactorización de la lógica del Raycast y el GameManager. Asegúrate de que los clics en los botones HTML usen `pointer-events: auto` para que funcionen y no disparen el raycast del 3D detrás de ellos.