/**
 * Tower Defense — Fase 6
 * Puntuación y ranking global vía REST de Supabase (fetch nativo).
 */

// --- Constantes del mapa ---
const CELL_SIZE = 40;
const COLS = 20;
const ROWS = 15;
const GAME_WIDTH = COLS * CELL_SIZE;   // 800
const GAME_HEIGHT = ROWS * CELL_SIZE;  // 600

// Paleta
const COLOR_BUILDABLE = 0x1a5c2e;
const COLOR_PATH = 0x8b5a2b;
const COLOR_ENEMY = 0xff0000;
const COLOR_TOWER = 0x2244ff;
const COLOR_PROJECTILE = 0xffff00;
const COLOR_BUTTON = 0x1e3a5f;

const ENEMY_RADIUS = 12;
const WAYPOINT_REACH_PX = 2;

const TOWER_SIZE = 32;
const TOWER_COST = 50;
const TOWER_RANGE = 120;
const TOWER_DAMAGE = 50;
const TOWER_FIRE_RATE = 1000;

const PROJECTILE_RADIUS = 4;
const PROJECTILE_SPEED = 280;
const IMPACT_DISTANCE = 5;
const KILL_GOLD = 20;

/**
 * Configuración de oleadas (data-driven).
 * No hardcodear estos valores dentro de startWave().
 */
const waveData = [
  { enemyCount: 5, spawnInterval: 900, enemyHP: 100, enemySpeed: 90 },
  { enemyCount: 8, spawnInterval: 700, enemyHP: 150, enemySpeed: 110 },
  { enemyCount: 12, spawnInterval: 550, enemyHP: 220, enemySpeed: 130 },
];

// --- Estado del jugador ---
let playerGold = 100;
let playerLives = 10;
let currentWave = 0;
let score = 0;

const LEADERBOARD_URL = `${String(typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '').replace(/\/$/, '')}/rest/v1/leaderboard`;
const LEADERBOARD_KEY = typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '';
const towers = [];
const enemies = [];
const projectiles = [];

/**
 * Matriz 2D del mapa (fuente de verdad).
 * 0 = camino, 1 = área construible, 2 = torre construida.
 */
const GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const PATH_DIRS = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

function cellCenter(col, row) {
  return {
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2,
  };
}

function isBorderCell(col, row) {
  return col === 0 || col === COLS - 1 || row === 0 || row === ROWS - 1;
}

function inBounds(col, row) {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}

function removeFromArray(list, item) {
  const index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

function generatePath() {
  let start = null;

  outer: for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (GRID[row][col] === 0 && isBorderCell(col, row)) {
        start = { col, row };
        break outer;
      }
    }
  }

  if (!start) {
    return [];
  }

  const visited = new Set();
  const path = [];
  let current = start;

  while (current) {
    visited.add(`${current.col},${current.row}`);
    path.push(cellCenter(current.col, current.row));

    let next = null;
    for (const dir of PATH_DIRS) {
      const col = current.col + dir.col;
      const row = current.row + dir.row;
      if (!inBounds(col, row) || GRID[row][col] !== 0) {
        continue;
      }
      if (visited.has(`${col},${row}`)) {
        continue;
      }
      next = { col, row };
      break;
    }
    current = next;
  }

  return path;
}

class Enemy {
  constructor(scene, path, hp, speed) {
    this.scene = scene;
    this.path = path;
    this.pathIndex = 0;
    this.speed = speed;
    this.maxHp = hp;
    this.hp = hp;
    this.alive = true;

    const start = path[0];
    this.sprite = scene.add.circle(start.x, start.y, ENEMY_RADIUS, COLOR_ENEMY);
  }

  move(delta) {
    if (!this.alive || !this.sprite) {
      return;
    }

    const nextIndex = this.pathIndex + 1;
    if (nextIndex >= this.path.length) {
      this.reachBase();
      return;
    }

    const target = this.path[nextIndex];
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const distance = Math.hypot(dx, dy);
    const step = (this.speed * delta) / 1000;

    if (distance <= step || distance <= WAYPOINT_REACH_PX) {
      this.sprite.setPosition(target.x, target.y);
      this.pathIndex = nextIndex;

      if (this.pathIndex >= this.path.length - 1) {
        this.reachBase();
      }
      return;
    }

    this.sprite.x += (dx / distance) * step;
    this.sprite.y += (dy / distance) * step;
  }

  takeDamage(amount) {
    if (!this.alive) {
      return;
    }
    this.hp -= amount;
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    if (!this.alive) {
      return;
    }
    this.destroyVisual();
    removeFromArray(enemies, this);
    playerGold += KILL_GOLD;
    score += this.maxHp;
    this.scene.updateHud();
    this.scene.refreshWaveButton();
  }

  reachBase() {
    if (!this.alive) {
      return;
    }
    this.destroyVisual();
    removeFromArray(enemies, this);
    playerLives -= 1;
    this.scene.updateHud();
    this.scene.refreshWaveButton();

    if (playerLives <= 0) {
      this.scene.triggerGameOver();
    }
  }

  destroyVisual() {
    this.alive = false;
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}

class Tower {
  constructor(scene, col, row) {
    this.scene = scene;
    this.col = col;
    this.row = row;
    this.range = TOWER_RANGE;
    this.damage = TOWER_DAMAGE;
    this.fireRate = TOWER_FIRE_RATE;
    this.lastFired = 0;

    const { x, y } = cellCenter(col, row);
    this.sprite = scene.add.rectangle(x, y, TOWER_SIZE, TOWER_SIZE, COLOR_TOWER);
  }

  tryFire(time) {
    if (time <= this.lastFired + this.fireRate) {
      return;
    }

    const originX = this.sprite.x;
    const originY = this.sprite.y;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy.alive || !enemy.sprite) {
        continue;
      }

      const distance = Phaser.Math.Distance.Between(
        originX,
        originY,
        enemy.sprite.x,
        enemy.sprite.y
      );

      if (distance <= this.range) {
        this.fire(originX, originY, enemy);
        this.lastFired = time;
        return;
      }
    }
  }

  fire(originX, originY, enemy) {
    const projectile = new Projectile(this.scene, originX, originY, enemy, this.damage);
    projectiles.push(projectile);
  }
}

class Projectile {
  constructor(scene, originX, originY, target, damage) {
    this.target = target;
    this.damage = damage;
    this.alive = true;
    this.sprite = scene.add.circle(originX, originY, PROJECTILE_RADIUS, COLOR_PROJECTILE);
    this.sprite.setDepth(50);
  }

  update(delta) {
    if (!this.alive || !this.sprite) {
      return;
    }

    if (!this.target || !this.target.alive || !this.target.sprite) {
      this.destroy();
      return;
    }

    const targetX = this.target.sprite.x;
    const targetY = this.target.sprite.y;
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      targetX,
      targetY
    );

    if (distance < IMPACT_DISTANCE) {
      this.impact();
      return;
    }

    const step = (PROJECTILE_SPEED * delta) / 1000;
    if (distance <= step) {
      this.sprite.setPosition(targetX, targetY);
      this.impact();
      return;
    }

    const angle = Math.atan2(targetY - this.sprite.y, targetX - this.sprite.x);
    this.sprite.x += Math.cos(angle) * step;
    this.sprite.y += Math.sin(angle) * step;
  }

  impact() {
    if (this.target && this.target.alive) {
      this.target.takeDamage(this.damage);
    }
    this.destroy();
  }

  destroy() {
    this.alive = false;
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {}

  create() {
    this.gameEnded = false;
    this.waveStarted = false;
    this.spawnFinished = true;
    this.spawnEvent = null;

    this.drawGrid();
    this.path = generatePath();

    this.hudText = this.add.text(8, 8, this.hudLabel(), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
    });
    this.hudText.setDepth(100);

    this.createWaveButton();

    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.keyboard.on('keydown-SPACE', this.tryStartWave, this);

    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: this.logicTick,
      callbackScope: this,
    });
  }

  createWaveButton() {
    const width = 280;
    const height = 40;
    const x = GAME_WIDTH / 2;
    const y = GAME_HEIGHT - 28;

    this.waveButton = this.add.rectangle(x, y, width, height, COLOR_BUTTON);
    this.waveButton.setStrokeStyle(2, 0xffffff);
    this.waveButton.setDepth(100);
    this.waveButton.setInteractive({ useHandCursor: true });
    this.waveButton.on('pointerdown', this.tryStartWave, this);

    this.waveButtonText = this.add.text(x, y, 'ESPACIO: iniciar oleada', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
    });
    this.waveButtonText.setOrigin(0.5);
    this.waveButtonText.setDepth(101);

    this.refreshWaveButton();
  }

  hudLabel() {
    const waveDisplay = this.waveStarted ? currentWave + 1 : 1;
    return `Oro: ${playerGold}   Vidas: ${playerLives}   Oleada: ${waveDisplay}/${waveData.length}   Score: ${score}`;
  }

  updateHud() {
    this.hudText.setText(this.hudLabel());
  }

  canStartWave() {
    if (this.gameEnded || !this.spawnFinished || enemies.length > 0) {
      return false;
    }
    const nextIndex = this.waveStarted ? currentWave + 1 : 0;
    return nextIndex < waveData.length;
  }

  refreshWaveButton() {
    const show = this.canStartWave();
    this.waveButton.setVisible(show);
    this.waveButtonText.setVisible(show);
  }

  tryStartWave() {
    if (!this.canStartWave()) {
      return;
    }
    this.startWave();
  }

  /**
   * Lee waveData[currentWave] y spawnea con time.addEvent (repeat: enemyCount - 1).
   */
  startWave() {
    if (this.waveStarted) {
      currentWave += 1;
    }
    this.waveStarted = true;

    const data = waveData[currentWave];
    this.spawnFinished = false;
    this.spawnedThisWave = 0;
    this.updateHud();
    this.refreshWaveButton();

    this.spawnEvent = this.time.addEvent({
      delay: data.spawnInterval,
      repeat: data.enemyCount - 1,
      callback: this.onSpawnTick,
      callbackScope: this,
    });
  }

  onSpawnTick() {
    const data = waveData[currentWave];
    this.spawnEnemy(data);
    this.spawnedThisWave += 1;

    if (this.spawnedThisWave >= data.enemyCount) {
      this.spawnFinished = true;
      this.spawnEvent = null;
      this.refreshWaveButton();
    }
  }

  spawnEnemy(data) {
    if (this.gameEnded || this.path.length === 0) {
      return;
    }
    const enemy = new Enemy(this, this.path, data.enemyHP, data.enemySpeed);
    enemies.push(enemy);
  }

  update(time, delta) {
    if (this.gameEnded) {
      return;
    }

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].move(delta);
    }

    for (let i = 0; i < projectiles.length; i++) {
      projectiles[i].update(delta);
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (!projectiles[i].alive) {
        projectiles.splice(i, 1);
      }
    }

    this.checkVictory();
  }

  checkVictory() {
    const isLastWave = this.waveStarted && currentWave === waveData.length - 1;
    if (isLastWave && this.spawnFinished && enemies.length === 0) {
      this.triggerVictory();
    }
  }

  triggerGameOver() {
    this.endGame('GAME OVER');
  }

  triggerVictory() {
    this.endGame('¡VICTORIA!');
  }

  endGame(message) {
    if (this.gameEnded) {
      return;
    }
    this.gameEnded = true;

    if (this.spawnEvent) {
      this.spawnEvent.remove(false);
      this.spawnEvent = null;
    }

    this.refreshWaveButton();

    const overlay = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.55
    );
    overlay.setDepth(200);

    const endText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, message, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '56px',
      color: '#ffffff',
    });
    endText.setOrigin(0.5);
    endText.setDepth(201);

    this.scene.pause();

    setTimeout(async () => {
      const submitted = await submitScore(score);
      await showLeaderboard();
      if (!submitted) {
        console.warn('Puntuación no enviada. El ranking se muestra igual si Supabase está configurado.');
      }
    }, 50);
  }

  drawGrid() {
    const graphics = this.add.graphics();

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = GRID[row][col];
        graphics.fillStyle(cell === 0 ? COLOR_PATH : COLOR_BUILDABLE, 1);
        graphics.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  onPointerDown(pointer) {
    if (this.gameEnded) {
      return;
    }

    if (this.waveButton.visible && this.waveButton.getBounds().contains(pointer.x, pointer.y)) {
      return;
    }

    const col = Math.floor(pointer.x / CELL_SIZE);
    const row = Math.floor(pointer.y / CELL_SIZE);
    this.tryBuildTower(col, row);
  }

  tryBuildTower(col, row) {
    if (this.gameEnded || !inBounds(col, row)) {
      return;
    }

    const cell = GRID[row][col];
    const isBuildable = cell === 1;
    const isEmpty = cell !== 2;
    const canAfford = playerGold >= TOWER_COST;

    if (!isBuildable || !isEmpty || !canAfford) {
      return;
    }

    playerGold -= TOWER_COST;
    GRID[row][col] = 2;

    const tower = new Tower(this, col, row);
    towers.push(tower);
    this.updateHud();
  }

  logicTick() {
    if (this.gameEnded) {
      return;
    }
    const time = this.time.now;
    for (let i = 0; i < towers.length; i++) {
      towers[i].tryFire(time);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game',
  backgroundColor: '#000000',
  scene: MainScene,
};

const game = new Phaser.Game(config);

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('TU_PROYECTO') &&
    SUPABASE_ANON_KEY !== 'TU_ANON_KEY'
  );
}

function supabaseHeaders() {
  return {
    apikey: LEADERBOARD_KEY,
    Authorization: `Bearer ${LEADERBOARD_KEY}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Prompt de nombre + POST a Supabase. Devuelve true si el envío fue correcto.
 */
async function submitScore(finalScore) {
  const rawName = window.prompt('¡Juego terminado! Introduce tu nombre:');
  if (!rawName) {
    return false;
  }

  const playerName = rawName.trim().slice(0, 32);
  if (!playerName) {
    return false;
  }

  if (!isSupabaseConfigured()) {
    console.warn('Rellena SUPABASE_URL y SUPABASE_ANON_KEY en config.js');
    return false;
  }

  try {
    const response = await fetch(LEADERBOARD_URL, {
      method: 'POST',
      headers: {
        ...supabaseHeaders(),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        player_name: playerName,
        score: finalScore,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Error al enviar puntuación:', response.status, detail);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al enviar puntuación:', error);
    return false;
  }
}

/**
 * GET Top 5 y overlay HTML sobre el canvas.
 */
async function showLeaderboard() {
  const existing = document.getElementById('leaderboard-overlay');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'leaderboard-overlay';
  overlay.innerHTML = `
    <div class="panel">
      <h2>Ranking Top 5</h2>
      <p class="status">Cargando...</p>
      <div class="actions">
        <button type="button" data-action="close">Cerrar</button>
        <button type="button" data-action="restart">Reiniciar Juego</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (event) => {
    const action = event.target && event.target.getAttribute('data-action');
    if (action === 'close') {
      overlay.remove();
    }
    if (action === 'restart') {
      window.location.reload();
    }
  });

  const panel = overlay.querySelector('.panel');
  const status = overlay.querySelector('.status');

  if (!isSupabaseConfigured()) {
    status.className = 'error';
    status.textContent = 'Configura config.js con tu URL y anon key de Supabase.';
    return;
  }

  try {
    const response = await fetch(
      `${LEADERBOARD_URL}?select=*&order=score.desc&limit=5`,
      {
        method: 'GET',
        headers: supabaseHeaders(),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`${response.status} ${detail}`);
    }

    const rows = await response.json();
    status.remove();

    if (!rows.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Aún no hay puntuaciones.';
      panel.insertBefore(empty, panel.querySelector('.actions'));
      return;
    }

    const list = document.createElement('ol');
    rows.forEach((row) => {
      const item = document.createElement('li');
      item.textContent = `${row.player_name} — ${row.score}`;
      list.appendChild(item);
    });
    panel.insertBefore(list, panel.querySelector('.actions'));
  } catch (error) {
    console.error('Error al cargar el ranking:', error);
    status.className = 'error';
    status.textContent = 'No se pudo cargar el ranking.';
  }
}
