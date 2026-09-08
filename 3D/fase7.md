La arquitectura base del juego (UI, raycasting, mejoras y cámara 3D) está completada. Ahora actúa como Diseñador de Niveles y Programador de Gameplay. Necesito generar el contenido del juego (niveles, oleadas, enemigos) y programar las nuevas mecánicas de daño.

**Restricciones y Arquitectura:**
1. **Diseño Data-Driven:** Todo el contenido debe estar estructurado en objetos/arrays constantes de JavaScript puro, fáciles de leer y balancear.
2. **Efectos de Estado Temporales:** Para la nueva mecánica de congelación, no cambies la velocidad base del enemigo de forma permanente. Usa variables temporales o temporizadores (ej. `setTimeout` o variables `slowTimer` en el update) para restaurar la velocidad original tras unos segundos.

**Tareas a entregar:**

1. **Catálogos de Entidades (Datos):**
   - Crea un `EnemyCatalog` con 3 tipos: `normal` (balanceado), `fast` (muy rápido, poca vida) y `tank` (muy lento, mucha vida, da mucho oro).
   - Actualiza el `TowerCatalog` con 3 tipos y sus niveles (coste, daño, rango, fireRate):
     - `basic`: Cadencia y daño medios.
     - `sniper`: Rango extremo, daño masivo, cadencia muy lenta (no requiere código nuevo).
     - `ice`: Daño muy bajo, rango corto, cadencia media. Propiedad extra: `slowFactor` (ej. 0.5) y `slowDuration` (ej. 2000 ms).

2. **Diseño de Niveles (Datos):**
   - Crea un objeto `LevelsData` con 3 niveles (Level 1, 2 y 3).
   - Cada nivel debe incluir: un `startingGold`, una matriz (grid) de 20x15 única (Level 1 fácil, Level 3 laberíntico) y un array de `waves`.
   - Balancea las oleadas matemáticamente para que el jugador empiece con enemigos normales, introduzca los rápidos, y termine con oleadas mixtas y tanques.

3. **Lógica de Combate Nueva (Código):**
   - Actualiza la clase `Projectile` para que reciba de qué tipo de torre proviene.
   - En el método de impacto (cuando el proyectil choca con el enemigo), añade la lógica para la Torre de Hielo:
     - Si el proyectil es de tipo `ice`, guarda la velocidad original del enemigo, multiplícala por el `slowFactor`, y cambia el color del material del enemigo a azul claro (para dar feedback visual).
     - Inicia un temporizador que, al pasar el `slowDuration`, restaure la velocidad original del enemigo y su color original, asegurándote de no acumular el efecto indefinidamente si recibe múltiples disparos de hielo.

Proporciona los tres objetos de datos (`EnemyCatalog`, `TowerCatalog`, `LevelsData`) y el bloque de código refactorizado del impacto en la clase `Projectile` o la clase `Enemy` que maneja el efecto de estado.