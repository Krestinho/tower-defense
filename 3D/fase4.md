La lógica del juego funciona perfecta con primitivas geométricas. Ahora vamos a sustituir los cubos y esferas por modelos 3D reales en formato .glb usando Babylon.js.

**Restricciones y Reglas Arquitectónicas:**
1. **Rendimiento (Instancing):** NO uses `SceneLoader` cada vez que se crea un enemigo o torre. Debes cargar el modelo .glb ORIGINAL una sola vez al inicio del juego, ocultarlo (`isVisible = false`), y luego usar `instantiateModelsToScene` o el método `clone()` para crear copias cuando se haga spawn.
2. **Normalización de Escala:** Los modelos de internet suelen venir con tamaños impredecibles. Crea una función de utilidad que lea el `BoundingBox` del modelo cargado y ajuste su escala (`scaling`) matemáticamente para que el modelo encaje exactamente dentro de un área de 1x1x1 unidades de nuestro grid 3D.
3. **Gestión de Animaciones:** Al instanciar un enemigo, debes extraer sus `animationGroups`. Inicia automáticamente la animación llamada "Walk" o la primera animación disponible en bucle (`play(true)`).

**Tareas a entregar:**

1. **Gestor de Assets (AssetManager):**
   - Crea un objeto o clase `AssetManager` con un método asíncrono `loadAssets(scene)`.
   - Simula la carga de dos archivos: `"torre.glb"` y `"enemigo.glb"` desde una carpeta `./assets/`. 
   - Guarda las referencias de estos modelos base (y sus animaciones) para clonarlos más tarde.

2. **Refactorización de Spawns:**
   - Modifica la clase `Enemy` y la lógica de construcción de Torres. En lugar de hacer `MeshBuilder.CreateSphere` o `CreateBox`, deben solicitar un clon al `AssetManager`, posicionarlo en sus coordenadas X y Z correspondientes, e iniciar sus animaciones.

Devuelve únicamente el código del `AssetManager`, la función de normalización de escala, y cómo queda la instanciación en la clase `Enemy` modificada.