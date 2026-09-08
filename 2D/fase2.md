Excelente. Ahora que tenemos el Grid base y el sistema de Ticks, vamos a implementar el movimiento de los enemigos. 

En esta fase no habrá oleadas complejas; solo queremos que una entidad lea la matriz y se mueva correctamente siguiendo las casillas del camino.

**Restricciones y Reglas:**
1. **Gráficos por Código:** El enemigo debe representarse como un simple círculo rojo usando `Phaser.GameObjects.Arc` o `.Graphics`.
2. **Object Pooling (Preparación):** Crea una clase o función constructora `Enemy` que herede o envuelva un objeto visual de Phaser. Debe tener propiedades lógicas: `hp` (salud), `speed` (velocidad) y `pathIndex` (en qué punto del camino se encuentra).
3. **Movimiento Fluido:** El enemigo NO debe teletransportarse de celda en celda. Debe moverse suavemente en píxeles hacia la siguiente coordenada central de la celda de destino en la función `update()`.

**Tareas a entregar (en `game.js`):**

1.  **Parseo del Camino (Waypoints):** Crea una función `generatePath()` que lea tu matriz 2D en el `create()`. Debe encontrar la celda de inicio del camino (el primer `0` en el borde) y rastrear las celdas conectadas secuencialmente hasta el final. Debe devolver un array de coordenadas de píxeles, donde cada coordenada es el centro de una celda del camino.
2.  **Clase Enemy:** Crea la estructura básica del enemigo con `speed = 100` (píxeles por segundo) y un método `move(delta)` para actualizar su posición hacia el siguiente waypoint.
3.  **Spawning y Movimiento:**
    *   En el `create()`, instancia un único Enemigo en la primera coordenada del camino.
    *   En el `update(time, delta)`, llama al método `move(delta)` del enemigo para que avance. Cuando alcance un waypoint, debe orientarse al siguiente. Al llegar al último, destrúyelo por ahora y restaura un texto en consola que diga "Base dañada".

Muestra cómo se integra esto con el código anterior, resaltando o proporcionando el nuevo código a añadir.