Ahora que el enemigo recorre el camino, vamos a permitir que el jugador construya torres haciendo clic en el mapa.

En esta fase NO implementaremos el disparo ni la detección de enemigos. Solo nos centraremos en la validación de casillas, la economía básica (gastar oro) y la instanciación visual de la torre centrada en la cuadrícula.

**Restricciones y Reglas:**
1. **Validación Estricta:** Una torre solo se puede construir si se cumplen estas tres condiciones: 
   - La celda clicada tiene el valor `1` (área construible en nuestra matriz).
   - La celda está vacía (no hay otra torre ahí).
   - El jugador tiene oro suficiente (coste de la torre = 50).
2. **Mutación de la Matriz:** Cuando se coloque una torre, actualiza el valor de esa celda en la matriz a `2` (torre construida) para bloquear futuras construcciones en el mismo sitio.
3. **Gráficos por Código:** La torre debe ser un simple cuadrado azul (`Phaser.GameObjects.Rectangle`) que encaje dentro de la celda de 40x40 píxeles.

**Tareas a entregar (en `game.js`):**
1. **Estado del Jugador:** Añade una variable de estado `playerGold = 100`. Crea un texto simple (`this.add.text`) en la esquina superior izquierda de la pantalla que muestre y actualice el oro disponible.
2. **Input del Ratón:** En la función `create()`, añade un evento `this.input.on('pointerdown', ...)` para capturar los clics del jugador.
3. **Conversión de Coordenadas:** En la función del clic, convierte los píxeles del ratón (`pointer.x`, `pointer.y`) a índices de la matriz (columna y fila) usando el tamaño de celda (40px). 
4. **Instanciación:** Si la validación es correcta, resta 50 de oro, actualiza el texto, marca la matriz y dibuja el cuadrado azul exactamente en el centro geométrico de esa celda.
5. **Array de Torres:** Guarda la instancia de la torre en un array global `towers = []`. Lo usaremos en el próximo paso para calcular rangos.

Proporciona el código de estas nuevas funciones y muestra exactamente dónde conectarlas dentro del código existente de Phaser.