import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

// Persistent state key
const STORAGE_KEY = '3dgame_persist_v1';

export const LOOT_DEFS = {
  powercore_module: {
    id: 'powercore_module',
    name: 'Powercore Module',
    description: '+12% tower damage (applies to 1 tower permanently).',
    target: 'tower_individual',
    effect: { type: 'mul_damage', value: 1.12 },
    stackCapPerTower: 3,
    rarity: 'uncommon',
    persistent: true,
  },
  overclock_chip: {
    id: 'overclock_chip',
    name: 'Overclock Chip',
    description: '+30% fire rate for one tower (permanent, single).',
    target: 'tower_individual',
    effect: { type: 'mul_fireRate', value: 1.30 },
    stackCapPerTower: 1,
    rarity: 'rare',
    persistent: true,
  },
  sharpened_blade: {
    id: 'sharpened_blade',
    name: 'Sharpened Blade',
    description: '+18% player melee damage (permanent).',
    target: 'player',
    effect: { type: 'mul_playerDamage', value: 1.18 },
    stackCapPlayer: 2,
    rarity: 'uncommon',
    persistent: true,
  },
  gold_hoard: {
    id: 'gold_hoard',
    name: 'Gold Hoard Token',
    description: '+20% gold from kills (permanent, diminishing returns).',
    target: 'player',
    effect: { type: 'add_goldPercent', value: 0.20 },
    rarity: 'uncommon',
    persistent: true,
  }
};

export function loadPersistentState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { player: { upgrades: [] }, towers: {} };
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load persistent state', e);
    return { player: { upgrades: [] }, towers: {} };
  }
}

export function savePersistentState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save persistent state', e);
  }
}

// Small floating loot pickup class
export class Loot {
  constructor(scene, defId, pos, onPickup) {
    this.defId = defId;
    this.def = LOOT_DEFS[defId];
    this.scene = scene;
    this.onPickup = onPickup;
    this.mesh = this._createMesh();
    this.mesh.position.set(pos.x, pos.y + 0.5, pos.z);
    scene.add(this.mesh);
    this._t = 0;
    this.picked = false;
  }

  _createMesh() {
    const geom = new THREE.IcosahedronGeometry(0.4, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffd27b, emissive: 0x884400 });
    const m = new THREE.Mesh(geom, mat);
    return m;
  }

  update(delta) {
    this._t += delta;
    // float & rotate
    this.mesh.position.y += Math.sin(this._t * 2) * 0.002;
    this.mesh.rotation.y += 0.02;
  }

  dispose() {
    if (this.mesh) this.scene.remove(this.mesh);
    this.mesh = null;
  }
}
