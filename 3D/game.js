/**
 * Tower Defense 3D — Fase 8
 * Kenney Tower Defense Kit: diccionario de assets, tiles clonados y torres base+arma.
 */

const CELL_SIZE = 1;
const COLS = 20;
const ROWS = 15;
const TILE_HEIGHT = 0.2;

/**
 * Rutas de los .glb (Kenney Tower Defense Kit).
 * Edita solo este objeto si cambias o renombras archivos en /assets/.
 */
const AssetDictionary = {
  map: {
    path: './assets/tile-dirt.glb',
    buildable: './assets/tile.glb',
  },
  enemies: {
    normal: './assets/enemy-ufo-a.glb',
    fast: './assets/enemy-ufo-b.glb',
    tank: './assets/enemy-ufo-d.glb',
  },
  towers: {
    base: './assets/tower-round-base.glb',
    basic: './assets/weapon-cannon.glb',
    sniper: './assets/weapon-ballista.glb',
    ice: './assets/weapon-turret.glb',
    bottom: {
      a: './assets/tower-round-bottom-a.glb',
      b: './assets/tower-round-bottom-b.glb',
      c: './assets/tower-round-bottom-c.glb',
    },
    middle: {
      a: './assets/tower-round-middle-a.glb',
      b: './assets/tower-round-middle-b.glb',
      c: './assets/tower-round-middle-c.glb',
    },
  },
};

const TOWER_TIER_SUFFIX = ['a', 'b', 'c'];

function towerTierSuffix(level) {
  return TOWER_TIER_SUFFIX[Math.min(Math.max(level, 0), TOWER_TIER_SUFFIX.length - 1)];
}

function flattenAssetDictionary() {
  const jobs = [
    { key: 'path', path: AssetDictionary.map.path, kind: 'tile' },
    { key: 'buildable', path: AssetDictionary.map.buildable, kind: 'tile' },
    { key: 'enemy_normal', path: AssetDictionary.enemies.normal, kind: 'enemy' },
    { key: 'enemy_fast', path: AssetDictionary.enemies.fast, kind: 'enemy' },
    { key: 'enemy_tank', path: AssetDictionary.enemies.tank, kind: 'enemy' },
    { key: 'tower_base', path: AssetDictionary.towers.base, kind: 'tower' },
    { key: 'weapon_basic', path: AssetDictionary.towers.basic, kind: 'weapon' },
    { key: 'weapon_sniper', path: AssetDictionary.towers.sniper, kind: 'weapon' },
    { key: 'weapon_ice', path: AssetDictionary.towers.ice, kind: 'weapon' },
  ];
  TOWER_TIER_SUFFIX.forEach((tier) => {
    jobs.push({ key: `tower_bottom_${tier}`, path: AssetDictionary.towers.bottom[tier], kind: 'tower' });
    jobs.push({ key: `tower_middle_${tier}`, path: AssetDictionary.towers.middle[tier], kind: 'tower' });
  });
  return jobs;
}

const EnemyCatalog = {
  normal: { name: 'Normal', hp: 100, speed: 2.8, bounty: 20, scale: 1 },
  fast: { name: 'Rápido', hp: 55, speed: 5.2, bounty: 15, scale: 0.78 },
  tank: { name: 'Tanque', hp: 320, speed: 1.35, bounty: 55, scale: 1.38 },
};

const TowerCatalog = {
  basic: {
    name: 'Básica',
    levels: [
      { cost: 50, damage: 50, range: 4.0, fireRate: 1000 },
      { cost: 75, damage: 80, range: 4.5, fireRate: 850 },
      { cost: 120, damage: 120, range: 5.0, fireRate: 700 },
    ],
  },
  sniper: {
    name: 'Francotirador',
    levels: [
      { cost: 80, damage: 110, range: 8.5, fireRate: 1800 },
      { cost: 120, damage: 170, range: 9.5, fireRate: 1700 },
      { cost: 170, damage: 240, range: 11.0, fireRate: 1600 },
    ],
  },
  ice: {
    name: 'Hielo',
    levels: [
      { cost: 60, damage: 15, range: 3.2, fireRate: 900, slowFactor: 0.5, slowDuration: 2000 },
      { cost: 90, damage: 22, range: 3.6, fireRate: 800, slowFactor: 0.4, slowDuration: 2500 },
      { cost: 130, damage: 30, range: 4.0, fireRate: 700, slowFactor: 0.35, slowDuration: 3000 },
    ],
  },
};

const LevelsData = [
  {
    name: 'Nivel 1',
    startingGold: 100,
    grid: [
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
    ],
    waves: [
      { spawnInterval: 900, queue: ['normal', 'normal', 'normal', 'normal', 'normal'] },
      { spawnInterval: 750, queue: ['normal', 'normal', 'fast', 'normal', 'fast', 'fast'] },
      { spawnInterval: 700, queue: ['normal', 'fast', 'fast', 'normal', 'tank'] },
    ],
  },
  {
    name: 'Nivel 2',
    startingGold: 120,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    waves: [
      { spawnInterval: 800, queue: ['normal', 'normal', 'normal', 'fast', 'fast', 'normal'] },
      { spawnInterval: 650, queue: ['fast', 'fast', 'normal', 'fast', 'normal', 'fast', 'tank'] },
      { spawnInterval: 600, queue: ['normal', 'fast', 'fast', 'tank', 'fast', 'normal', 'tank'] },
    ],
  },
  {
    name: 'Nivel 3',
    startingGold: 150,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    waves: [
      { spawnInterval: 700, queue: ['fast', 'fast', 'normal', 'fast', 'normal', 'fast', 'normal'] },
      { spawnInterval: 550, queue: ['fast', 'tank', 'fast', 'fast', 'normal', 'tank', 'fast'] },
      { spawnInterval: 500, queue: ['fast', 'fast', 'tank', 'fast', 'tank', 'normal', 'tank', 'fast'] },
    ],
  },
];

const ENEMY_RADIUS = 0.35;
const WAYPOINT_REACH = 0.1;
const PROJECTILE_DIAMETER = 0.2;
const PROJECTILE_SPEED = 8;
const IMPACT_DISTANCE = 0.5;
const FROZEN_COLOR = new BABYLON.Color3(0.35, 0.7, 1.0);

function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

let GRID = cloneGrid(LevelsData[0].grid);

const towers = [];
const enemies = [];
const projectiles = [];
let tileMeshes = [];
let waypoints = [];
let meshId = 0;

let canvas;
let engine;
let scene;
let camera;
let matBuildable;
let matPath;
let matTower;
let matEnemy;
let matEnemyFast;
let matEnemyTank;
let matWeaponSniper;
let matProjectile;
let matIceProjectile;
let selectionMarker;
let groundY = TILE_HEIGHT;

const PATH_DIRS = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

/**
 * Única fuente de estado lógico y única capa que escribe en el DOM.
 */
class GameDirector {
  constructor() {
    this.gold = 100;
    this.lives = 20;
    this.currentLevelIndex = 0;
    this.currentWaveIndex = 0;
    this.paused = false;
    this.waveInProgress = false;
    this.spawnFinished = true;
    this.spawnTimeout = null;
    this.assetsReady = false;
    this.statusMessage = '';
    this.onStartWave = null;
    this.selectedBuildType = 'basic';
    this.selectedTower = null;
  }

  addGold(amount) {
    this.gold += amount;
    this.updateUI();
  }

  spendGold(amount) {
    if (this.gold < amount) {
      return false;
    }
    this.gold -= amount;
    this.updateUI();
    return true;
  }

  loseLife() {
    if (this.lives <= 0) {
      return;
    }
    this.lives -= 1;
    if (this.lives <= 0) {
      this.paused = true;
      this.waveInProgress = false;
      this.spawnFinished = true;
      if (this.spawnTimeout) {
        clearTimeout(this.spawnTimeout);
        this.spawnTimeout = null;
      }
    }
    this.updateUI();
  }

  startWave() {
    if (!this.assetsReady || this.paused || this.waveInProgress) {
      return;
    }
    const level = LevelsData[this.currentLevelIndex];
    if (this.currentWaveIndex >= level.waves.length) {
      return;
    }
    this.waveInProgress = true;
    this.spawnFinished = false;
    this.statusMessage = '';
    this.updateUI();
    if (typeof this.onStartWave === 'function') {
      this.onStartWave(level.waves[this.currentWaveIndex]);
    }
  }

  onEnemyRemoved(remainingEnemies) {
    if (this.paused || this.lives <= 0) {
      return;
    }
    if (!this.spawnFinished || remainingEnemies > 0) {
      return;
    }
    this.waveInProgress = false;
    this.currentWaveIndex += 1;
    const level = LevelsData[this.currentLevelIndex];
    if (this.currentWaveIndex >= level.waves.length) {
      if (this.currentLevelIndex >= LevelsData.length - 1) {
        this.paused = true;
        this.statusMessage = '¡VICTORIA!';
      } else {
        this.statusMessage = 'Nivel completado. Elige el siguiente.';
      }
    }
    this.updateUI();
  }

  selectLevel(index) {
    if (!this.assetsReady || (this.waveInProgress && !this.paused)) {
      return;
    }
    loadLevel(index);
  }

  updateUI() {
    document.getElementById('gold-value').innerText = String(this.gold);
    document.getElementById('lives-value').innerText = String(this.lives);
    const level = LevelsData[this.currentLevelIndex];
    const totalWaves = level.waves.length;
    const waveDisplay = Math.min(this.currentWaveIndex + 1, totalWaves);
    document.getElementById('wave-value').innerText = `${waveDisplay}/${totalWaves}`;
    const levelLabel = document.getElementById('level-value');
    if (levelLabel) {
      levelLabel.innerText = String(this.currentLevelIndex + 1);
    }

    const status = document.getElementById('status-value');
    if (this.lives <= 0) {
      status.innerText = 'GAME OVER';
    } else if (!this.assetsReady) {
      status.innerText = 'Cargando modelos...';
    } else {
      status.innerText = this.statusMessage;
    }

    const button = document.getElementById('start-wave-btn');
    const wavesDone = this.currentWaveIndex >= level.waves.length;
    button.disabled = !this.assetsReady || this.paused || this.waveInProgress || wavesDone;
    const levelBtnDisabled = !this.assetsReady || (this.waveInProgress && !this.paused);
    document.querySelectorAll('[data-level]').forEach((levelButton) => {
      const index = Number(levelButton.dataset.level);
      levelButton.disabled = levelBtnDisabled;
      levelButton.classList.toggle('active', index === this.currentLevelIndex);
    });

    this.updateBuildMenu();
    this.refreshUpgradePanel();
  }

  setAssetsReady(ready) {
    this.assetsReady = ready;
    this.updateUI();
  }

  populateBuildMenu() {
    const menu = document.getElementById('build-menu');
    menu.innerHTML = '';
    Object.keys(TowerCatalog).forEach((type) => {
      const def = TowerCatalog[type];
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.type = type;
      button.innerHTML = `${def.name}<span class="cost">${def.levels[0].cost} oro</span>`;
      button.addEventListener('click', () => {
        this.selectBuildType(type);
      });
      menu.appendChild(button);
    });
    this.updateBuildMenu();
  }

  selectBuildType(type) {
    this.selectedBuildType = type;
    this.updateBuildMenu();
  }

  updateBuildMenu() {
    const menu = document.getElementById('build-menu');
    if (!menu) {
      return;
    }
    menu.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button.dataset.type === this.selectedBuildType);
    });
  }

  selectTower(tower) {
    this.selectedTower = tower;
    highlightTower(tower);
    this.refreshUpgradePanel();
  }

  clearTowerSelection() {
    this.selectedTower = null;
    highlightTower(null);
    this.refreshUpgradePanel();
  }

  setStatLine(id, current, nextValue) {
    document.getElementById(`stat-${id}`).innerText = String(current);
    const nextEl = document.getElementById(`next-${id}`);
    if (nextValue != null && nextValue !== current) {
      nextEl.innerText = `-> ${nextValue}`;
    } else {
      nextEl.innerText = '';
    }
  }

  refreshUpgradePanel() {
    const panel = document.getElementById('upgrade-panel');
    if (!panel) {
      return;
    }

    const tower = this.selectedTower;
    if (!tower) {
      panel.classList.add('hidden');
      return;
    }

    const def = TowerCatalog[tower.type];
    const current = def.levels[tower.level];
    const next = def.levels[tower.level + 1];

    panel.classList.remove('hidden');
    document.getElementById('upgrade-title').innerText = def.name;
    document.getElementById('upgrade-level').innerText = `Nivel ${tower.level + 1}`;
    this.setStatLine('damage', current.damage, next && next.damage);
    this.setStatLine('range', current.range, next && next.range);
    this.setStatLine('fireRate', current.fireRate, next && next.fireRate);

    const slowRow = document.getElementById('slow-row');
    if (slowRow) {
      if (current.slowFactor != null) {
        slowRow.classList.remove('hidden');
        const slowPct = Math.round((1 - current.slowFactor) * 100);
        const nextSlowPct = next && next.slowFactor != null
          ? Math.round((1 - next.slowFactor) * 100)
          : null;
        this.setStatLine('slow', `${slowPct}%`, nextSlowPct != null && nextSlowPct !== slowPct ? `${nextSlowPct}%` : null);
      } else {
        slowRow.classList.add('hidden');
      }
    }

    const upgradeBtn = document.getElementById('upgrade-btn');
    const costLabel = document.getElementById('upgrade-cost');
    if (!next) {
      upgradeBtn.disabled = true;
      upgradeBtn.innerText = 'Nivel máximo';
      costLabel.innerText = '';
      return;
    }

    upgradeBtn.disabled = this.gold < next.cost;
    upgradeBtn.innerText = 'Mejorar';
    costLabel.innerText = `Coste: ${next.cost}`;
  }

  upgradeSelectedTower() {
    const tower = this.selectedTower;
    if (!tower) {
      return;
    }
    const next = TowerCatalog[tower.type].levels[tower.level + 1];
    if (!next || !this.spendGold(next.cost)) {
      return;
    }
    tower.level += 1;
    tower.applyStats();
    tower.refreshVisual();
    playBuildEffect(new BABYLON.Vector3(tower.mesh.position.x, groundY, tower.mesh.position.z));
    this.refreshUpgradePanel();
  }
}

const GameManager = new GameDirector();

function splitAssetPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const index = normalized.lastIndexOf('/');
  if (index === -1) {
    return { rootUrl: './', filename: normalized };
  }
  return {
    rootUrl: normalized.slice(0, index + 1),
    filename: normalized.slice(index + 1),
  };
}

function hierarchyBounds(root) {
  root.computeWorldMatrix(true);
  return root.getHierarchyBoundingVectors(true);
}

function hierarchyHeight(root) {
  const bounds = hierarchyBounds(root);
  return Math.max(bounds.max.y - bounds.min.y, 0);
}

function fitXZToCell(root, cellSize) {
  const bounds = hierarchyBounds(root);
  const extentX = bounds.max.x - bounds.min.x;
  const extentZ = bounds.max.z - bounds.min.z;
  const maxXZ = Math.max(extentX, extentZ, 1e-4);
  root.scaling.scaleInPlace(cellSize / maxXZ);
}

function centerOnOriginXZ(root) {
  const bounds = hierarchyBounds(root);
  root.position.x += -((bounds.min.x + bounds.max.x) * 0.5);
  root.position.z += -((bounds.min.z + bounds.max.z) * 0.5);
}

function sitOnGround(root, surfaceY = 0) {
  const bounds = hierarchyBounds(root);
  root.position.y += surfaceY - bounds.min.y;
}

function placeOnCell(root, x, z, surfaceY = 0) {
  root.position.x = x;
  root.position.z = z;
  sitOnGround(root, surfaceY);
}

function hideTemplateRoot(root) {
  if (root.setEnabled) {
    root.setEnabled(false);
  }
  if ('isPickable' in root) {
    root.isPickable = false;
  }
}

function stripColliders(meshes) {
  meshes.forEach((mesh) => {
    mesh.checkCollisions = false;
    mesh.isPickable = false;
    if (/collider|collision/i.test(mesh.name)) {
      mesh.setEnabled(false);
      mesh.isVisible = false;
    }
  });
}

function softenImportedPbr(meshes) {
  meshes.forEach((mesh) => {
    const mat = mesh.material;
    if (!mat) {
      return;
    }
    if (typeof mat.metallic === 'number') {
      mat.metallic = Math.min(mat.metallic, 0.15);
    }
    if (typeof mat.roughness === 'number') {
      mat.roughness = Math.max(mat.roughness, 0.4);
    }
    if (typeof mat.directIntensity === 'number') {
      mat.directIntensity = 1.8;
    }
  });
}

function refreshGroundHeight() {
  const template = assets.templates.path || assets.templates.buildable;
  if (!template) {
    groundY = TILE_HEIGHT;
    return;
  }
  const height = template.height != null ? template.height : hierarchyHeight(template.root);
  groundY = height > 1e-3 ? height : TILE_HEIGHT;
}

function revealHierarchy(node, pickable = false) {
  const stack = [node];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current.setEnabled) {
      current.setEnabled(true);
    }
    if ('isVisible' in current) {
      current.isVisible = true;
    }
    if ('isPickable' in current) {
      current.isPickable = pickable;
    }
    if (current.getChildren) {
      current.getChildren().forEach((child) => stack.push(child));
    }
  }
}

function playWalkAnimation(animationGroups) {
  if (!animationGroups || animationGroups.length === 0) {
    return;
  }
  animationGroups.forEach((group) => group.stop());
  const walk = animationGroups.find((group) => /walk/i.test(group.name)) || animationGroups[0];
  walk.play(true);
}

/**
 * Precarga el AssetDictionary con ImportMeshAsync.
 * Cada plantilla se oculta y luego se clona al instanciar.
 */
class GameAssetManager {
  constructor() {
    this.templates = {};
  }

  async loadAssets(scene) {
    const jobs = flattenAssetDictionary();
    await Promise.all(jobs.map(async (job) => {
      try {
        this.templates[job.key] = await this.loadTemplate(scene, job.path, job.kind);
      } catch (error) {
        console.warn(`Asset no encontrado (${job.path}). Se usará una primitiva.`, error);
      }
    }));
    this.createPrimitiveFallbacks(scene);
  }

  async loadTemplate(scene, filePath, kind) {
    const { rootUrl, filename } = splitAssetPath(filePath);
    const result = await BABYLON.SceneLoader.ImportMeshAsync('', rootUrl, filename, scene);
    const root = result.meshes[0];
    stripColliders(result.meshes);
    softenImportedPbr(result.meshes);

    const fitSize = {
      tile: CELL_SIZE,
      enemy: CELL_SIZE * 0.8,
    }[kind];
    if (fitSize) {
      fitXZToCell(root, fitSize);
    }
    centerOnOriginXZ(root);
    sitOnGround(root, 0);
    const height = hierarchyHeight(root);
    hideTemplateRoot(root);
    if (result.animationGroups) {
      result.animationGroups.forEach((group) => group.stop());
    }
    return { root, kind, height };
  }

  createHiddenRoot(name, scene) {
    const root = new BABYLON.TransformNode(name, scene);
    hideTemplateRoot(root);
    return root;
  }

  attachHiddenPrimitive(root, mesh) {
    mesh.parent = root;
    mesh.isVisible = true;
    mesh.isPickable = false;
    mesh.checkCollisions = false;
  }

  ensureTemplate(key, kind, factory, height) {
    if (this.templates[key]) {
      return;
    }
    this.templates[key] = { root: factory(), kind, height };
  }

  createPrimitiveFallbacks(scene) {
    this.ensureTemplate('path', 'tile', () => {
      const root = this.createHiddenRoot('path_template', scene);
      const tile = BABYLON.MeshBuilder.CreateBox('path_template_mesh', {
        width: CELL_SIZE * 0.98,
        height: TILE_HEIGHT,
        depth: CELL_SIZE * 0.98,
      }, scene);
      tile.material = matPath;
      tile.position.y = TILE_HEIGHT / 2;
      this.attachHiddenPrimitive(root, tile);
      return root;
    }, TILE_HEIGHT);

    this.ensureTemplate('buildable', 'tile', () => {
      const root = this.createHiddenRoot('buildable_template', scene);
      const tile = BABYLON.MeshBuilder.CreateBox('buildable_template_mesh', {
        width: CELL_SIZE * 0.98,
        height: TILE_HEIGHT,
        depth: CELL_SIZE * 0.98,
      }, scene);
      tile.material = matBuildable;
      tile.position.y = TILE_HEIGHT / 2;
      this.attachHiddenPrimitive(root, tile);
      return root;
    }, TILE_HEIGHT);

    const enemyFallback = (key, diameter, material) => {
      this.ensureTemplate(key, 'enemy', () => {
        const root = this.createHiddenRoot(`${key}_template`, scene);
        const body = BABYLON.MeshBuilder.CreateSphere(`${key}_template_mesh`, { diameter }, scene);
        body.material = material;
        body.position.y = diameter / 2;
        this.attachHiddenPrimitive(root, body);
        return root;
      }, diameter);
    };
    enemyFallback('enemy_normal', ENEMY_RADIUS * 2, matEnemy);
    enemyFallback('enemy_fast', ENEMY_RADIUS * 1.6, matEnemyFast);
    enemyFallback('enemy_tank', ENEMY_RADIUS * 2.6, matEnemyTank);

    this.ensureTemplate('tower_base', 'tower', () => {
      const root = this.createHiddenRoot('tower_base_template', scene);
      const base = BABYLON.MeshBuilder.CreateBox('tower_base_template_mesh', {
        width: CELL_SIZE * 0.55,
        height: 0.45,
        depth: CELL_SIZE * 0.55,
      }, scene);
      base.material = matTower;
      base.position.y = 0.225;
      this.attachHiddenPrimitive(root, base);
      return root;
    }, 0.45);

    const weaponFallback = (key, size, height, material) => {
      this.ensureTemplate(key, 'weapon', () => {
        const root = this.createHiddenRoot(`${key}_template`, scene);
        const weapon = BABYLON.MeshBuilder.CreateBox(`${key}_template_mesh`, {
          width: size,
          height,
          depth: size,
        }, scene);
        weapon.material = material;
        weapon.position.y = height / 2;
        this.attachHiddenPrimitive(root, weapon);
        return root;
      }, height);
    };
    weaponFallback('weapon_basic', 0.28, 0.4, matTower);
    weaponFallback('weapon_sniper', 0.18, 0.7, matWeaponSniper);
    weaponFallback('weapon_ice', 0.3, 0.35, matIceProjectile);

    const bodyFallback = (key, height) => {
      this.ensureTemplate(key, 'tower', () => {
        const root = this.createHiddenRoot(`${key}_template`, scene);
        const piece = BABYLON.MeshBuilder.CreateCylinder(`${key}_template_mesh`, {
          diameter: CELL_SIZE * 0.5,
          height,
        }, scene);
        piece.material = matTower;
        piece.position.y = height / 2;
        this.attachHiddenPrimitive(root, piece);
        return root;
      }, height);
    };
    bodyFallback('tower_bottom_a', 0.28);
    bodyFallback('tower_bottom_b', 0.34);
    bodyFallback('tower_bottom_c', 0.4);
    bodyFallback('tower_middle_a', 0.32);
    bodyFallback('tower_middle_b', 0.4);
    bodyFallback('tower_middle_c', 0.48);
  }

  instantiate(key, name, options = {}) {
    const template = this.templates[key];
    if (!template) {
      throw new Error(`Asset no cargado: ${key}`);
    }
    const root = template.root.clone(name, null);
    revealHierarchy(root, options.pickable === true);
    return { root, animationGroups: [] };
  }

  templateHeight(key) {
    const template = this.templates[key];
    if (!template) {
      return 0;
    }
    if (template.height != null) {
      return template.height;
    }
    return hierarchyHeight(template.root);
  }
}

const assets = new GameAssetManager();

function nextMeshName(prefix) {
  meshId += 1;
  return `${prefix}_${meshId}`;
}

function removeFromArray(list, item) {
  const index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

function cellCenter(col, row, y = 0) {
  return new BABYLON.Vector3(col * CELL_SIZE, y, row * CELL_SIZE);
}

function isBorderCell(col, row, cols, rows) {
  return col === 0 || col === cols - 1 || row === 0 || row === rows - 1;
}

function generateWaypoints(matrix, cellSize) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let start = null;

  outer: for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (matrix[row][col] === 0 && isBorderCell(col, row, cols, rows)) {
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
    path.push(new BABYLON.Vector3(
      current.col * cellSize,
      groundY,
      current.row * cellSize
    ));

    let next = null;
    for (const dir of PATH_DIRS) {
      const col = current.col + dir.col;
      const row = current.row + dir.row;
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        continue;
      }
      if (matrix[row][col] !== 0 || visited.has(`${col},${row}`)) {
        continue;
      }
      next = { col, row };
      break;
    }
    current = next;
  }

  return path;
}

function moveTowards(current, target, maxDistanceDelta) {
  if (typeof BABYLON.Vector3.MoveTowards === 'function') {
    return BABYLON.Vector3.MoveTowards(current, target, maxDistanceDelta);
  }

  const offset = target.subtract(current);
  const distance = offset.length();
  if (distance <= maxDistanceDelta || distance < 1e-6) {
    return target.clone();
  }
  return current.add(offset.scaleInPlace(maxDistanceDelta / distance));
}

function snapshotEnemyMaterials(root) {
  const meshes = root.getChildMeshes ? root.getChildMeshes(false).concat(root) : [root];
  const seen = new Set();
  const entries = [];
  meshes.forEach((mesh) => {
    let mat = mesh.material;
    if (!mat || seen.has(mat)) {
      return;
    }
    const cloned = mat.clone(`${mesh.name}_mat`);
    meshes.forEach((other) => {
      if (other.material === mat) {
        other.material = cloned;
      }
    });
    mat = cloned;
    seen.add(mat);
    const useAlbedo = !!mat.albedoColor;
    const color = useAlbedo ? mat.albedoColor : mat.diffuseColor;
    if (!color) {
      return;
    }
    entries.push({
      material: mat,
      useAlbedo,
      original: color.clone(),
    });
  });
  return entries;
}

function tintEnemyMaterials(entries, frozen) {
  entries.forEach((entry) => {
    const color = frozen ? FROZEN_COLOR : entry.original;
    if (entry.useAlbedo) {
      entry.material.albedoColor = color.clone();
    } else if (entry.material.diffuseColor) {
      entry.material.diffuseColor = color.clone();
    }
  });
}

class Enemy {
  constructor(scene, waypoints, type = 'normal') {
    const typeId = EnemyCatalog[type] ? type : 'normal';
    const def = EnemyCatalog[typeId];
    this.type = typeId;
    this.waypoints = waypoints;
    this.currentWaypointIndex = 0;
    this.baseSpeed = def.speed;
    this.speed = def.speed;
    this.hp = def.hp;
    this.bounty = def.bounty;
    this.alive = true;
    this.slowTimer = 0;
    this.animationGroups = [];
    this.materialEntries = [];

    const instance = assets.instantiate(`enemy_${typeId}`, nextMeshName('enemy'));
    this.mesh = instance.root;
    this.animationGroups = instance.animationGroups;
    this.mesh.scaling.scaleInPlace(def.scale);
    this.materialEntries = snapshotEnemyMaterials(this.mesh);

    if (waypoints.length > 0) {
      placeOnCell(this.mesh, waypoints[0].x, waypoints[0].z, groundY);
    }
  }

  applySlow(factor, durationMs) {
    if (!this.alive || factor == null || durationMs == null) {
      return;
    }
    this.speed = this.baseSpeed * factor;
    this.slowTimer = durationMs / 1000;
    tintEnemyMaterials(this.materialEntries, true);
  }

  clearSlow() {
    this.speed = this.baseSpeed;
    this.slowTimer = 0;
    tintEnemyMaterials(this.materialEntries, false);
  }

  update(deltaTime) {
    if (!this.alive || !this.mesh) {
      return;
    }

    if (this.slowTimer > 0) {
      this.slowTimer -= deltaTime;
      if (this.slowTimer <= 0) {
        this.clearSlow();
      }
    }

    if (this.currentWaypointIndex >= this.waypoints.length) {
      this.reachGoal();
      return;
    }

    const target = this.waypoints[this.currentWaypointIndex];
    const distance = BABYLON.Vector3.Distance(this.mesh.position, target);

    if (distance < WAYPOINT_REACH) {
      this.currentWaypointIndex += 1;
      if (this.currentWaypointIndex >= this.waypoints.length) {
        this.reachGoal();
      }
      return;
    }

    this.mesh.position = moveTowards(
      this.mesh.position,
      target,
      this.speed * deltaTime
    );

    const lookTarget = new BABYLON.Vector3(target.x, this.mesh.position.y, target.z);
    if (BABYLON.Vector3.DistanceSquared(this.mesh.position, lookTarget) > 0.0001) {
      this.mesh.lookAt(lookTarget);
    }
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
    GameManager.addGold(this.bounty);
    GameManager.onEnemyRemoved(enemies.length);
  }

  reachGoal() {
    if (!this.alive) {
      return;
    }
    this.destroyVisual();
    removeFromArray(enemies, this);
    GameManager.loseLife();
    GameManager.onEnemyRemoved(enemies.length);
  }

  destroyVisual() {
    this.alive = false;
    this.slowTimer = 0;
    if (this.animationGroups) {
      this.animationGroups.forEach((group) => {
        group.stop();
        group.dispose();
      });
      this.animationGroups = [];
    }
    if (this.materialEntries) {
      this.materialEntries.forEach((entry) => {
        if (entry.material) {
          entry.material.dispose();
        }
      });
      this.materialEntries = [];
    }
    if (this.mesh) {
      this.mesh.dispose(false, false);
      this.mesh = null;
    }
  }
}

class Tower {
  constructor(col, row, type) {
    this.mesh = null;
    this.col = col;
    this.row = row;
    this.type = type;
    this.level = 0;
    this.lastFired = 0;
    this.applyStats();
    this.refreshVisual();
  }

  applyStats() {
    const stats = TowerCatalog[this.type].levels[this.level];
    this.damage = stats.damage;
    this.range = stats.range;
    this.fireRate = stats.fireRate;
    this.slowFactor = stats.slowFactor;
    this.slowDuration = stats.slowDuration;
  }

  refreshVisual() {
    const previous = this.mesh;
    this.mesh = instantiateTowerVisual(this.type, nextMeshName('tower'), this.col, this.row, this.level);
    tagTowerMeshes(this.mesh, this);
    if (previous) {
      previous.dispose(false, false);
    }
    if (GameManager.selectedTower === this) {
      highlightTower(this);
    }
  }

  checkTargets(time, enemyList) {
    if (time < this.lastFired + this.fireRate) {
      return;
    }

    for (let i = 0; i < enemyList.length; i++) {
      const enemy = enemyList[i];
      if (!enemy.alive || !enemy.mesh) {
        continue;
      }

      const distance = BABYLON.Vector3.Distance(
        this.mesh.position,
        enemy.mesh.position
      );

      if (distance <= this.range) {
        this.fire(enemy);
        this.lastFired = time;
        return;
      }
    }
  }

  fire(enemy) {
    const origin = this.mesh.position.clone();
    origin.y += Math.max(hierarchyHeight(this.mesh) * 0.85, 0.8);
    const projectile = new Projectile(
      scene,
      origin,
      enemy,
      this.damage,
      this.type,
      this.slowFactor,
      this.slowDuration
    );
    projectiles.push(projectile);
  }
}

class Projectile {
  constructor(scene, origin, target, damage, towerType, slowFactor, slowDuration) {
    this.target = target;
    this.speed = PROJECTILE_SPEED;
    this.damage = damage;
    this.towerType = towerType;
    this.slowFactor = slowFactor;
    this.slowDuration = slowDuration;
    this.alive = true;

    this.mesh = BABYLON.MeshBuilder.CreateSphere(nextMeshName('projectile'), {
      diameter: PROJECTILE_DIAMETER,
    }, scene);
    this.mesh.position = origin.clone();
    this.mesh.material = towerType === 'ice' ? matIceProjectile : matProjectile;
    this.mesh.isPickable = false;
  }

  update(deltaTime) {
    if (!this.alive || !this.mesh) {
      return;
    }

    if (!this.target || !this.target.alive || !this.target.mesh) {
      this.destroy();
      return;
    }

    const targetPos = this.target.mesh.position;
    const distance = BABYLON.Vector3.Distance(this.mesh.position, targetPos);

    if (distance < IMPACT_DISTANCE) {
      const hitPos = this.target.mesh.position.clone();
      hitPos.y += 0.45;
      playHitEffect(hitPos, this.towerType === 'ice');
      this.target.takeDamage(this.damage);
      if (this.towerType === 'ice' && this.target.alive) {
        this.target.applySlow(this.slowFactor, this.slowDuration);
      }
      this.destroy();
      return;
    }

    this.mesh.position = moveTowards(
      this.mesh.position,
      targetPos,
      this.speed * deltaTime
    );
  }

  destroy() {
    this.alive = false;
    if (this.mesh) {
      this.mesh.dispose();
      this.mesh = null;
    }
  }
}

function createMaterials() {
  matBuildable = new BABYLON.StandardMaterial('matBuildable', scene);
  matBuildable.diffuseColor = new BABYLON.Color3(0.10, 0.36, 0.18);

  matPath = new BABYLON.StandardMaterial('matPath', scene);
  matPath.diffuseColor = new BABYLON.Color3(0.55, 0.35, 0.17);

  matTower = new BABYLON.StandardMaterial('matTower', scene);
  matTower.diffuseColor = new BABYLON.Color3(0.13, 0.27, 1.0);

  matEnemy = new BABYLON.StandardMaterial('matEnemy', scene);
  matEnemy.diffuseColor = new BABYLON.Color3(0.90, 0.10, 0.10);

  matEnemyFast = new BABYLON.StandardMaterial('matEnemyFast', scene);
  matEnemyFast.diffuseColor = new BABYLON.Color3(0.95, 0.75, 0.15);

  matEnemyTank = new BABYLON.StandardMaterial('matEnemyTank', scene);
  matEnemyTank.diffuseColor = new BABYLON.Color3(0.35, 0.38, 0.42);

  matWeaponSniper = new BABYLON.StandardMaterial('matWeaponSniper', scene);
  matWeaponSniper.diffuseColor = new BABYLON.Color3(0.45, 0.2, 0.55);

  matProjectile = new BABYLON.StandardMaterial('matProjectile', scene);
  matProjectile.diffuseColor = new BABYLON.Color3(1.0, 0.85, 0.1);
  matProjectile.emissiveColor = new BABYLON.Color3(0.35, 0.28, 0.0);

  matIceProjectile = new BABYLON.StandardMaterial('matIceProjectile', scene);
  matIceProjectile.diffuseColor = new BABYLON.Color3(0.45, 0.85, 1.0);
  matIceProjectile.emissiveColor = new BABYLON.Color3(0.12, 0.35, 0.55);
}

/**
 * Textura procedural (círculo suave). Cada sistema tiene la suya porque
 * disposeOnStop también libera la textura del ParticleSystem.
 */
function createSoftParticleTexture() {
  const size = 32;
  const texture = new BABYLON.DynamicTexture('particleTex', { width: size, height: size }, scene, false);
  const ctx = texture.getContext();
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size / 2 - 1);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  texture.hasAlpha = true;
  texture.update();
  return texture;
}

function playBuildEffect(position) {
  const ps = new BABYLON.ParticleSystem('buildDust', 80, scene);
  ps.particleTexture = createSoftParticleTexture();
  ps.emitter = position.clone();
  ps.createCylinderEmitter(0.35, 0.12, 1, 0);
  ps.color1 = new BABYLON.Color4(0.48, 0.40, 0.28, 0.85);
  ps.color2 = new BABYLON.Color4(0.62, 0.56, 0.48, 0.55);
  ps.colorDead = new BABYLON.Color4(0.30, 0.28, 0.24, 0);
  ps.minSize = 0.08;
  ps.maxSize = 0.24;
  ps.minLifeTime = 0.2;
  ps.maxLifeTime = 0.5;
  ps.emitRate = 100;
  ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
  ps.gravity = new BABYLON.Vector3(0, -1.5, 0);
  ps.direction1 = new BABYLON.Vector3(-0.35, 1.1, -0.35);
  ps.direction2 = new BABYLON.Vector3(0.35, 2.0, 0.35);
  ps.minEmitPower = 0.5;
  ps.maxEmitPower = 1.3;
  ps.minAngularSpeed = -1;
  ps.maxAngularSpeed = 1;
  ps.updateSpeed = 0.02;
  ps.targetStopDuration = 0.28;
  ps.disposeOnStop = true;
  ps.start();
}

function playHitEffect(position, ice = false) {
  const ps = new BABYLON.ParticleSystem('hitSparks', 60, scene);
  ps.particleTexture = createSoftParticleTexture();
  ps.emitter = position.clone();
  ps.createSphereEmitter(0.12);
  if (ice) {
    ps.color1 = new BABYLON.Color4(0.55, 0.9, 1.0, 1);
    ps.color2 = new BABYLON.Color4(0.2, 0.55, 1.0, 0.9);
    ps.colorDead = new BABYLON.Color4(0.05, 0.2, 0.45, 0);
  } else {
    ps.color1 = new BABYLON.Color4(1.0, 0.92, 0.25, 1);
    ps.color2 = new BABYLON.Color4(1.0, 0.45, 0.08, 0.9);
    ps.colorDead = new BABYLON.Color4(0.6, 0.12, 0.0, 0);
  }
  ps.minSize = 0.04;
  ps.maxSize = 0.12;
  ps.minLifeTime = 0.12;
  ps.maxLifeTime = 0.32;
  ps.emitRate = 220;
  ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  ps.gravity = new BABYLON.Vector3(0, -6, 0);
  ps.direction1 = new BABYLON.Vector3(-1, -0.4, -1);
  ps.direction2 = new BABYLON.Vector3(1, 1.4, 1);
  ps.minEmitPower = 1.8;
  ps.maxEmitPower = 4.2;
  ps.updateSpeed = 0.015;
  ps.targetStopDuration = 0.12;
  ps.disposeOnStop = true;
  ps.start();
}

function ensureSelectionMarker() {
  if (selectionMarker) {
    return;
  }
  selectionMarker = BABYLON.MeshBuilder.CreateDisc('selectionMarker', { radius: 0.55 }, scene);
  selectionMarker.rotation.x = Math.PI / 2;
  const mat = new BABYLON.StandardMaterial('selectionMat', scene);
  mat.emissiveColor = new BABYLON.Color3(0.15, 0.65, 1.0);
  mat.diffuseColor = new BABYLON.Color3(0.1, 0.35, 0.7);
  mat.alpha = 0.55;
  selectionMarker.material = mat;
  selectionMarker.isPickable = false;
  selectionMarker.setEnabled(false);
}

function highlightTower(tower) {
  ensureSelectionMarker();
  if (!tower || !tower.mesh) {
    selectionMarker.setEnabled(false);
    return;
  }
  selectionMarker.position.set(tower.mesh.position.x, groundY + 0.04, tower.mesh.position.z);
  selectionMarker.setEnabled(true);
}

function findTowerFromMesh(mesh) {
  let node = mesh;
  while (node) {
    if (node.metadata && node.metadata.kind === 'tower' && node.metadata.tower) {
      return node.metadata.tower;
    }
    node = node.parent;
  }
  return null;
}

function tagTileMeshes(root, col, row) {
  const meta = { col, row, kind: 'tile' };
  root.metadata = meta;
  root.isPickable = true;
  if (root.getChildMeshes) {
    root.getChildMeshes(false).forEach((child) => {
      child.metadata = meta;
      child.isPickable = true;
    });
  }
}

function tagTowerMeshes(root, tower) {
  const meta = { col: tower.col, row: tower.row, kind: 'tower', tower };
  root.metadata = meta;
  if (root.getChildMeshes) {
    root.getChildMeshes(false).forEach((child) => {
      child.metadata = meta;
      child.isPickable = true;
    });
  }
}

function instantiateTowerVisual(type, name, col, row, level = 0) {
  const tier = towerTierSuffix(level);
  const root = new BABYLON.TransformNode(name, scene);
  const center = cellCenter(col, row);
  root.position.set(center.x, groundY, center.z);

  let offsetY = 0;
  const stack = [
    ['tower_base', 'base'],
    [`tower_bottom_${tier}`, 'bottom'],
    [`tower_middle_${tier}`, 'middle'],
    [`weapon_${type}`, 'weapon'],
  ];
  stack.forEach(([key, suffix]) => {
    const piece = assets.instantiate(key, `${name}_${suffix}`, { pickable: true }).root;
    piece.parent = root;
    piece.position.x = 0;
    piece.position.z = 0;
    piece.position.y = offsetY;
    offsetY += assets.templateHeight(key);
  });

  return root;
}

function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const key = GRID[row][col] === 0 ? 'path' : 'buildable';
      const instance = assets.instantiate(key, `tile_${col}_${row}`, { pickable: true });
      const center = cellCenter(col, row);
      placeOnCell(instance.root, center.x, center.z, 0);
      tagTileMeshes(instance.root, col, row);
      tileMeshes.push(instance.root);
    }
  }
}

function tryBuildTower(col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
    return;
  }
  if (GRID[row][col] !== 1) {
    GameManager.clearTowerSelection();
    return;
  }
  if (!GameManager.assetsReady) {
    return;
  }

  const type = GameManager.selectedBuildType;
  const cost = TowerCatalog[type].levels[0].cost;
  if (!GameManager.spendGold(cost)) {
    GameManager.clearTowerSelection();
    return;
  }

  GRID[row][col] = 2;

  const tower = new Tower(col, row, type);
  playBuildEffect(new BABYLON.Vector3(tower.mesh.position.x, groundY, tower.mesh.position.z));
  towers.push(tower);
  GameManager.clearTowerSelection();
}

function spawnEnemyOfType(type) {
  if (waypoints.length === 0) {
    return;
  }
  const enemy = new Enemy(scene, waypoints, type);
  enemies.push(enemy);
}

function startWaveSpawning(wave) {
  let index = 0;
  const spawnNext = () => {
    if (GameManager.paused || GameManager.lives <= 0) {
      GameManager.spawnTimeout = null;
      return;
    }
    if (index >= wave.queue.length) {
      GameManager.spawnFinished = true;
      GameManager.spawnTimeout = null;
      GameManager.onEnemyRemoved(enemies.length);
      return;
    }
    spawnEnemyOfType(wave.queue[index]);
    index += 1;
    GameManager.spawnTimeout = setTimeout(spawnNext, wave.spawnInterval);
  };
  spawnNext();
}

function clearLevelEntities() {
  if (GameManager.spawnTimeout) {
    clearTimeout(GameManager.spawnTimeout);
    GameManager.spawnTimeout = null;
  }
  GameManager.clearTowerSelection();

  tileMeshes.forEach((tile) => tile.dispose(false, false));
  tileMeshes = [];

  towers.forEach((tower) => {
    if (tower.mesh) {
      tower.mesh.dispose(false, false);
      tower.mesh = null;
    }
  });
  towers.length = 0;

  enemies.forEach((enemy) => enemy.destroyVisual());
  enemies.length = 0;

  projectiles.forEach((projectile) => projectile.destroy());
  projectiles.length = 0;
}

function loadLevel(index) {
  const level = LevelsData[index];
  if (!level) {
    return;
  }

  clearLevelEntities();

  GRID = cloneGrid(level.grid);
  GameManager.currentLevelIndex = index;
  GameManager.currentWaveIndex = 0;
  GameManager.gold = level.startingGold;
  GameManager.lives = 20;
  GameManager.paused = false;
  GameManager.waveInProgress = false;
  GameManager.spawnFinished = true;
  GameManager.statusMessage = '';

  drawGrid();
  waypoints = generateWaypoints(GRID, CELL_SIZE);
  GameManager.updateUI();
}

function setupRightClickOrbit() {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  const sensibility = 0.01;

  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 2) {
      return;
    }
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) {
      return;
    }
    camera.alpha -= (event.clientX - lastX) * sensibility;
    camera.beta -= (event.clientY - lastY) * sensibility;
    camera.beta = Math.max(camera.lowerBetaLimit, Math.min(camera.upperBetaLimit, camera.beta));
    lastX = event.clientX;
    lastY = event.clientY;
  });

  const stopDrag = () => {
    dragging = false;
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
}

function setupRaycasting() {
  setupRightClickOrbit();

  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type !== BABYLON.PointerEventTypes.POINTERPICK) {
      return;
    }
    if (pointerInfo.event.button !== 0) {
      return;
    }

    const pick = pointerInfo.pickInfo;
    if (!pick || !pick.hit || !pick.pickedMesh) {
      GameManager.clearTowerSelection();
      return;
    }

    const selected = findTowerFromMesh(pick.pickedMesh);
    if (selected) {
      GameManager.selectTower(selected);
      return;
    }

    const meta = pick.pickedMesh.metadata;
    if (!meta || meta.kind !== 'tile') {
      GameManager.clearTowerSelection();
      return;
    }

    tryBuildTower(meta.col, meta.row);
  });
}

function createScene() {
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.45, 0.62, 0.82, 1);
  scene.ambientColor = new BABYLON.Color3(0.45, 0.45, 0.5);
  scene.environmentIntensity = 0.9;
  try {
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
      enableGroundShadow: false,
    });
  } catch (error) {
    console.warn('No se pudo crear el environment IBL.', error);
  }

  const mapCenter = new BABYLON.Vector3(
    ((COLS - 1) / 2) * CELL_SIZE,
    0,
    ((ROWS - 1) / 2) * CELL_SIZE
  );

  camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    0.95,
    28,
    mapCenter,
    scene
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 45;
  camera.lowerBetaLimit = 0.25;
  camera.upperBetaLimit = Math.PI / 2.15;
  camera.panningSensibility = 0;
  if (camera.inputs.attached.pointers) {
    camera.inputs.remove(camera.inputs.attached.pointers);
  }

  const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0.2, 1, 0.3), scene);
  hemi.intensity = 1.15;

  const dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(-0.35, -1, -0.25), scene);
  dir.position = mapCenter.add(new BABYLON.Vector3(8, 18, 10));
  dir.intensity = 0.75;

  createMaterials();
  setupRaycasting();

  GameManager.onStartWave = startWaveSpawning;

  scene.onBeforeRenderObservable.add(() => {
    if (GameManager.paused) {
      return;
    }

    const deltaTime = engine.getDeltaTime() / 1000;
    const time = performance.now();

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].update(deltaTime);
    }

    for (let i = 0; i < towers.length; i++) {
      towers[i].checkTargets(time, enemies);
    }

    for (let i = 0; i < projectiles.length; i++) {
      projectiles[i].update(deltaTime);
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (!projectiles[i].alive) {
        projectiles.splice(i, 1);
      }
    }
  });

  return scene;
}

function start() {
  canvas = document.getElementById('renderCanvas');
  engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  createScene();

  document.getElementById('start-wave-btn').addEventListener('click', () => {
    GameManager.startWave();
  });
  document.getElementById('upgrade-btn').addEventListener('click', () => {
    GameManager.upgradeSelectedTower();
  });
  document.getElementById('upgrade-close-btn').addEventListener('click', () => {
    GameManager.clearTowerSelection();
  });
  document.querySelectorAll('[data-level]').forEach((button) => {
    button.addEventListener('click', () => {
      GameManager.selectLevel(Number(button.dataset.level));
    });
  });
  GameManager.populateBuildMenu();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  GameManager.updateUI();
  assets.loadAssets(scene).then(() => {
    refreshGroundHeight();
    GameManager.setAssetsReady(true);
    loadLevel(0);
  }).catch((error) => {
    console.error('No se pudieron cargar los .glb, usando primitivas.', error);
    assets.createPrimitiveFallbacks(scene);
    refreshGroundHeight();
    GameManager.setAssetsReady(true);
    loadLevel(0);
  });
}

window.addEventListener('DOMContentLoaded', start);
