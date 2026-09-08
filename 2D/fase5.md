El bucle principal (caminar, construir, disparar, economía) funciona perfecto. Ahora vamos a convertir este prototipo en un juego completo implementando un Sistema de Oleadas (Waves) y Condiciones de Victoria/Derrota.

**Restricciones y Reglas Arquitectónicas:**
1. **Diseño Data-Driven:** La configuración de las oleadas debe residir en un array de objetos (JSON) al principio del código, no hardcodeada dentro de funciones.
2. **Temporizadores Nativos:** Usa `this.time.addEvent` de Phaser para espaciar el nacimiento (spawn) de los enemigos, NO uses contadores manuales en el `update()`.
3. **Gestión de Estado Fuerte:** Si las vidas del jugador llegan a 0, el juego debe detenerse (Game Over). Si se superan todas las oleadas y no quedan enemigos vivos, el jugador gana (Victory).

**Tareas a entregar (en `game.js`):**

1. **Configuración de Datos:**
   - Añade el estado del jugador: `playerLives = 10` y `currentWave = 0`.
   - Crea un array `waveData` con al menos 3 oleadas. Cada objeto debe definir: `enemyCount` (cantidad), `spawnInterval` (milisegundos entre apariciones), `enemyHP` (salud base) y `enemySpeed`.

2. **Interfaz de Usuario (UI):**
   - Actualiza los textos en pantalla para mostrar: "Vidas: 10" y "Oleada: 1/3".

3. **Gestor de Oleadas (Wave Spawner):**
   - Crea una función `startWave()`. Esta función leerá los datos de `waveData[currentWave]`.
   - Usa un temporizador en bucle (`time.addEvent` con propiedad `repeat: enemyCount - 1`) que instancie un enemigo cada `spawnInterval` milisegundos, asignándole la vida y velocidad correspondientes.
   - Crea un botón visual simple en pantalla (o detecta la tecla 'Espacio') para que el jugador inicie la siguiente oleada manualmente cuando esté listo.

4. **Condiciones de Fin de Juego (Win/Loss):**
   - **Derrota:** Modifica la lógica de cuando un enemigo llega al final del camino. Además de destruirlo, resta 1 a `playerLives`. Si `playerLives <= 0`, detén todas las lógicas (pausa el juego o muestra un texto gigante de "GAME OVER").
   - **Victoria:** En el `update()`, verifica continuamente si `currentWave` es la última oleada, si el temporizador de spawn ha terminado, y si el array `enemies.length === 0`. Si todo esto se cumple, muestra un texto de "¡VICTORIA!".

Proporciona la estructura del array de datos y las funciones actualizadas, indicando cómo encajan en la Escena de Phaser.