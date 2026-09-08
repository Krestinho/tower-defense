Actúa como un desarrollador experto en Babylon.js. Vamos a sustituir todas nuestras primitivas geométricas por modelos 3D del 'Tower Defense Kit' de Kenney (formato .glb). 

Para que este sistema sea escalable y fácil de mantener, necesito que implementes un "Diccionario de Assets" y refactorices la instanciación.

**Restricciones y Reglas Arquitectónicas:**
1. **Diccionario Centralizado:** Crea un objeto `AssetDictionary` en la parte superior del código. Este objeto contendrá las rutas a los archivos `.glb` para el mapa (camino y construible), los enemigos (normal, rápido, tanque) y las torres (base, basic, sniper, ice).
2. **Jerarquía de Torres (Padre-Hijo):** Los assets de Kenney suelen separar la torre del arma. Cuando instancies una torre, debes clonar primero la "base" y luego clonar el "arma", emparentando el arma a la base (`arma.parent = base`) y subiendo su posición en Y para que quede encima.
3. **Pivotes y Alturas (Offset):** Los assets de Kenney tienen el pivote en la base (Y=0). Asegúrate de que al instanciar celdas del mapa, enemigos o torres, no se hundan en el suelo ni queden flotando. Ajusta el `position.y` dinámicamente si es necesario.

**Tareas a entregar:**

1. **El Diccionario de Assets:**
   - Proporciona el objeto `AssetDictionary` con nombres de archivo de ejemplo (ej. `tile_grass.glb`, `weapon_cannon.glb`, `enemy_ufo.glb`). Lo editaré yo manualmente después.

2. **Refactorización del AssetManager:**
   - Modifica el `AssetManager` para que recorra el `AssetDictionary` y precargue todos esos archivos asíncronamente usando `SceneLoader.ImportMeshAsync`. 
   - Debe guardar la malla raíz (`meshes[0]`) de cada modelo, ocultarla (`isVisible = false`), y eliminar cualquier colisionador innecesario.

3. **Refactorización del Renderizado (Grid, Enemigos, Torres):**
   - **Grid:** En lugar de crear cubos, el bucle que lee la matriz de nivel debe clonar la malla `buildable` (para los 1) y la malla `path` (para los 0).
   - **Torres:** Modifica la función de construcción. Al hacer clic, clona la malla de la base, colócala en el grid, clona la malla del arma correspondiente según el tipo (`basic`, `sniper`, `ice`), empariéntala a la base y súbela en Y.
   - **Enemigos:** Al hacer spawn, clona la malla del enemigo correspondiente según el tipo definido en la oleada.

Proporciona el `AssetDictionary` y los bloques de código actualizados del `AssetManager` y las funciones de instanciación.