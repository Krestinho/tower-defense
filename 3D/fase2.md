Los enemigos ya recorren los waypoints en 3D correctamente. Ahora vamos a convertir los cubos construidos (Torres) en entidades activas que detectan enemigos mediante distancias tridimensionales y disparan proyectiles teledirigidos.

**Restricciones y Reglas Arquitectónicas:**
1. **Sin Motor de Físicas:** Todo el combate se resolverá matemáticamente usando `BABYLON.Vector3.Distance`. No uses colliders complejos.
2. **Control del Eje Y (Altura):** Las torres y los proyectiles deben tener en cuenta la altura. Los proyectiles deben instanciarse en la parte superior de la torre, no en la base (Y = 0).
3. **Proyectiles Homing (Teledirigidos):** El proyectil no va a una coordenada estática, persigue la posición de la malla del enemigo en cada frame.

**Tareas a entregar (en tu archivo JavaScript):**

1. **Estructura de la Torre:**
   - Cada vez que se hace clic y se crea un cubo azul (Torre), guárdalo en un array global `towers`.
   - Asígnale propiedades lógicas: `range = 4.0` (unidades 3D), `fireRate = 1000` (ms), `lastFired = 0`.
   - Crea un método o función `checkTargets(time, enemies)` que busque el primer enemigo a una distancia menor o igual al `range`. Si lo encuentra y el cooldown lo permite, instancia un proyectil.

2. **Clase Projectile:**
   - Crea una pequeña esfera amarilla (`MeshBuilder.CreateSphere` escalada a 0.2).
   - El origen (posición inicial) debe ser `tower.position.clone()` pero sumando altura (ej. `y + 1`).
   - Propiedades: `target` (referencia al objeto enemigo) y `speed` (unidades por segundo).
   - En su método `update(deltaTime)`, mueve la esfera hacia `target.mesh.position` usando `BABYLON.Vector3.MoveTowards`.
   - **Manejo de Errores:** Si `target.mesh` es nulo o ha sido destruido por otra torre, el proyectil debe destruirse a sí mismo (`dispose()`).
   - **Colisión:** Si la distancia entre el proyectil y el enemigo es menor a 0.5 unidades, resta salud al enemigo y destruye el proyectil.

3. **Ciclo de Vida y Combate:**
   - Añade el enemigo a un array global `enemies` al instanciarlo.
   - Si un enemigo llega a HP <= 0, aplica `mesh.dispose()`, elimínalo del array y suma oro.
   - En el `scene.onBeforeRenderObservable.add`, ejecuta el `checkTargets` de todas las torres y el `update` de todos los proyectiles vivos.

Proporciona exclusivamente el código de estas clases/funciones y el bloque del Game Loop, asegurándote de usar las funciones nativas de tiempo y vectores de Babylon.js.