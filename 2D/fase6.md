El juego ya es funcional con sus condiciones de victoria y derrota. Ahora vamos a implementar un sistema de puntuación y conectarlo a un Ranking global (Leaderboard) utilizando la API REST de Supabase mediante 'fetch' nativo. NO utilices SDKs externos.

**Datos de Conexión (Supabase):**
- URL: [TU_URL]/rest/v1/leaderboard
- API KEY: [TU_ANON_KEY]
- Estos dos campos irán en un fichero donde se podrán asignar los valores. Este fichero estará en el gitignore para evitar que se suban datos privados a GitHub

**Restricciones y Reglas Arquitectónicas:**
1. **Cero SDKs:** Usa exclusivamente la API `fetch` de JavaScript.
2. **UI Minimalista:** Para pedir el nombre al jugador al morir/ganar, usa un simple `window.prompt()`. Para mostrar el ranking, crea un elemento HTML `<div>` superpuesto al canvas usando DOM, es más fácil de formatear que el texto de Phaser.
3. **Puntuación:** Introduce una variable global `score = 0`. Cada vez que un enemigo muera por un proyectil, suma los mismos puntos que su `hp` máximo o su recompensa de oro a la puntuación.

**Tareas a entregar (en `game.js`):**

1. **Gestión de Puntuación:**
   - Muestra el `score` en la pantalla junto al oro y las vidas.
   - Actualízalo correctamente al matar enemigos.

2. **Envío de Datos (POST):**
   - Crea una función asíncrona `submitScore(finalScore)`.
   - Cuando se active el Game Over o la Victoria, llama a esta función.
   - Debe abrir un `window.prompt("¡Juego terminado! Introduce tu nombre:")`.
   - Si el jugador introduce un nombre, haz un POST con `fetch` a la URL de Supabase pasando en el body el JSON `{ "player_name": nombre, "score": finalScore }`. Asegúrate de incluir los headers 'apikey' y 'Content-Type'.

3. **Visualización del Ranking (GET):**
   - Crea una función asíncrona `showLeaderboard()`.
   - Haz un GET a la URL de Supabase añadiendo los parámetros `?select=*&order=score.desc&limit=5` para obtener el Top 5.
   - Construye un bloque HTML con los resultados y añádelo al `document.body` posicionado de forma absoluta sobre el canvas con un botón para "Cerrar" o "Reiniciar Juego".
   - Llama a esta función inmediatamente después de que el `submitScore` termine con éxito.

Proporciona el código de las funciones asíncronas de fetch y muestra dónde inyectarlas en el Game Loop actual (en los bloques de victoria/derrota).