Hemos logrado colocar torres y los enemigos se mueven. Ahora vamos a darle vida al combate: las torres deben detectar a los enemigos, dispararles y derrotarlos.

**Restricciones y Reglas Arquitectónicas:**
1. **Cero Físicas Complejas:** NO uses `this.physics.add` ni el motor Arcade de Phaser. Haremos toda la detección mediante cálculo de distancia matemática (`Phaser.Math.Distance.Between`).
2. **Proyectiles Teledirigidos (Homing):** En lugar de disparar a una coordenada estática, el proyectil debe guardar una referencia a su objetivo (el enemigo) y perseguirlo en cada frame.
3. **Control de Cadencia (Cooldown):** Las torres NO pueden disparar en cada frame. Deben respetar un `fireRate` (ej. 1 disparo por segundo).
4. **Gráficos por Código:** El proyectil será un pequeño círculo amarillo (`Phaser.GameObjects.Arc`).

**Tareas a entregar (en `game.js`):**

1. **Ampliación de Torres y Enemigos:** 
   - A la torre añádele las propiedades: `range = 120`, `damage = 50`, `fireRate = 1000` (milisegundos) y `lastFired = 0`.
   - Al enemigo añádele: `hp = 100`.
   - Asegúrate de tener un array global `enemies = []` (añade cada enemigo instanciado aquí).

2. **Lógica de Detección (Targeting):** 
   - En tu sistema de "Ticks" (o en el update, controlando el tiempo), recorre el array de `towers`. Por cada torre, busca el primer enemigo en el array `enemies` cuya distancia a la torre sea menor o igual al `range`.
   - Si encuentra un enemigo y `time > lastFired + fireRate`, dispara. Actualiza `lastFired`.

3. **Clase Projectile:**
   - Crea un objeto/clase que reciba (origenX, origenY, targetEnemigo, damage).
   - En su método `update()`, debe moverse hacia la posición actual de `targetEnemigo`.
   - Si la distancia entre el proyectil y el enemigo es menor a 5 píxeles, se considera un "Impacto": 
     - Resta el `damage` al `hp` del enemigo.
     - Destruye el proyectil.
   - Si el objetivo muere o desaparece antes de que el proyectil impacte, el proyectil debe destruirse.

4. **Gestión de Muerte (Kill & Reward):**
   - Si un enemigo llega a `hp <= 0`, destrúyelo visualmente, elimínalo del array `enemies` y suma +20 al oro del jugador (actualizando el texto).

Por favor, proporciona las nuevas clases/funciones y muestra cómo y dónde se llaman dentro del `update()` o del Game Loop.