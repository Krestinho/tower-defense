Vamos a darle vida al juego añadiendo "Game Feel" mediante sistemas de partículas en Babylon.js. Queremos feedback visual para dos eventos críticos: cuando se construye una torre y cuando un proyectil impacta en un enemigo.

**Restricciones y Reglas Arquitectónicas:**
1. **Prevención de Memory Leaks:** Todo sistema de partículas que crees debe ser de un solo uso (One-shot). Es OBLIGATORIO configurar `particleSystem.disposeOnStop = true` para que el sistema se elimine de la memoria en cuanto deje de emitir.
2. **Cero Assets Externos para Partículas:** Para la textura de la partícula, no cargues imágenes externas. Genera una textura dinámica en tiempo de ejecución o usa un color base plano.
3. **Desacoplamiento:** Las funciones de partículas no deben interrumpir la lógica de combate.

**Tareas a entregar:**

1. **Sistema de Partículas de Construcción:**
   - Crea una función `playBuildEffect(position)`.
   - Genera una nube de polvo cilíndrica o esférica corta (ej. `emitRate = 100`, `minLifeTime = 0.2`, `maxLifeTime = 0.5`) que suba desde el suelo en la coordenada `position`.
   - Color: Tonos grises/marrones.

2. **Sistema de Partículas de Impacto:**
   - Crea una función `playHitEffect(position)`.
   - Genera una pequeña explosión (chispas) que salte en todas direcciones desde el centro del impacto (coordenada del enemigo al morir).
   - Color: Tonos amarillos y naranjas.

3. **Integración:**
   - Muestra cómo inyectas `playBuildEffect` en la función donde el jugador hace clic para colocar la torre.
   - Muestra cómo inyectas `playHitEffect` dentro de la clase `Projectile`, justo antes de llamar a `target.mesh.dispose()` y `this.dispose()`.

Proporciona el código de las dos funciones de partículas completas con sus parámetros de velocidad, color y tiempo de vida, y los pequeños fragmentos de código de dónde se llaman.