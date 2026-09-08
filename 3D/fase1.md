Actúa como un desarrollador experto en Babylon.js. Ya tenemos nuestro tablero 3D dibujado a partir de la matriz bidimensional (X e Z) y el raycasting configurado. Ahora vamos a implementar la extracción del camino (waypoints) y el movimiento del primer enemigo en 3D.

**Restricciones y Reglas Arquitectónicas:**
1. **Sistema de Coordenadas 3D:** El mapa se despliega en los ejes X y Z. La altura será el eje Y (ej. Y = 1 para que el enemigo ruede sobre el suelo).
2. **Matemáticas, no Físicas:** NO utilices un motor de físicas (como Ammo.js o Cannon.js). El movimiento debe calcularse de forma estrictamente matemática utilizando vectores y el tiempo transcurrido (Delta Time).
3. **Movimiento Fluido:** Utiliza la función `BABYLON.Vector3.MoveTowards` (o un cálculo manual de dirección vectorizada) para desplazar al enemigo desde su posición actual al siguiente waypoint.

**Tareas a entregar (en tu archivo JavaScript):**

1. **Parseo de Waypoints en 3D:**
   - Crea una función `generateWaypoints(matrix, cellSize)`.
   - Esta función debe recorrer la matriz buscando el camino (valor `0`), desde el inicio hasta el final, y devolver un array de objetos `BABYLON.Vector3`.
   - Asegúrate de que las coordenadas `x` y `z` calculadas apunten exactamente al centro geométrico del cubo/celda del mapa en el espacio 3D.

2. **Clase/Estructura Enemy:**
   - Crea una clase `Enemy` que instancie una esfera roja (`BABYLON.MeshBuilder.CreateSphere`).
   - Propiedades obligatorias: `speed` (unidades por segundo), `currentWaypointIndex` (empezando en 0), y el array de waypoints.
   - Crea un método `update(deltaTime)` que mueva la malla del enemigo hacia el waypoint actual. Si la distancia al waypoint es muy pequeña (ej. < 0.1), debe avanzar al siguiente waypoint del array.

3. **Integración en el Bucle Principal:**
   - Instancia un enemigo al principio del nivel.
   - Registra su actualización en el render loop de Babylon.js (por ejemplo, usando `scene.onBeforeRenderObservable.add`). 
   - Obtén el delta time con `engine.getDeltaTime()` y pásaselo al método `update` del enemigo para asegurar un movimiento constante a cualquier framerate. Si el enemigo llega al final, destrúyelo (`mesh.dispose()`) e imprime "Meta alcanzada" en consola.

Devuelve únicamente el código de estas implementaciones y explica brevemente cómo se integran en la escena de Babylon que ya tenemos.