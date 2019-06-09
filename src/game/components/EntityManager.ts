import pubsub from 'pubsub-js';

import settings from 'src/conf/settings';
import { isGamePaused, isNinjaDead } from 'src/redux/shortcuts';
import Bat from './Bat';
import Slime from './Slime';
import World from './World';
import Ninja from './Ninja';
import Entity from './Entity';
import { addScore } from 'src/redux/state/reducers/user';
import StateObserver from 'src/redux/StateObserver';
import Explosion from './Explosion';
import ExplosionStars from './ExplosionStars';
import {
  getRandomFloat,
  waitForIt,
  getRandomItemFromArray,
  getRandomInt,
  clearWait,
} from 'src/lib/utils';

export default class EntityManager {
  world: World;
  ninja: Ninja;

  slimes: Slime[];
  slimesInterval: object;

  bats: Bat[];
  batsInterval: object;

  stars: ExplosionStars[];
  starsInterval: object;

  constructor(opts: { world: World; ninja: Ninja }) {
    this.world = opts.world;
    this.ninja = opts.ninja;

    this.slimes = [];
    this.bats = [];
    this.stars = [];

    pubsub.subscribe('game:explosion', this.explosion.bind(this));
    pubsub.subscribe('game:spawnstars', this.spawnStars.bind(this));
  }

  init() {
    this.spawnSlimes();
    this.spawnBats();
  }

  reset() {
    this.resetSlimes();
    this.resetBats();
    this.resetStars();
  }

  // =============================================================

  resetSlimes() {
    for (let i = 0; i < this.slimes.length; i++) {
      this.slimes[i].removeFromSuperview();
    }
    this.slimes = [];
    clearWait(this.slimesInterval);
  }

  spawnSlimes() {
    if (settings.slime.maxSpawned === 0) return;

    // wait and create a new slime
    this.slimesInterval = {};
    const range = settings.slime.spawnInterval;
    const delay = getRandomFloat(range.min, range.max);

    this.slimesInterval = waitForIt(() => {
      // create new slime
      if (!isGamePaused() && !isNinjaDead()) {
        this.createSlime();
      }

      // recursevely iterate
      this.spawnSlimes();
    }, delay);
  }

  createSlime() {
    if (settings.slime.maxSpawned < this.slimes.length) return;

    const color = getRandomItemFromArray(['black', 'black', 'black', 'red']);
    const slime = new Slime({
      parent: this.world,
      ninja: this.ninja,
      scale: settings.worldScale,
      color,
    });
    this.slimes.push(slime);
  }

  // =============================================================

  resetBats() {
    for (let i = 0; i < this.bats.length; i++) {
      this.bats[i].removeFromSuperview();
    }
    this.bats = [];
    clearWait(this.batsInterval);
  }

  spawnBats() {
    if (settings.bat.maxSpawned === 0) return;

    // wait and create a new bat
    this.batsInterval = {};
    const range = settings.bat.spawnInterval;
    const delay = getRandomFloat(range.min, range.max);

    this.batsInterval = waitForIt(() => {
      // create new slime
      if (!isGamePaused() && !isNinjaDead()) {
        this.createBat();
      }

      // recursevely iterate
      this.spawnBats();
    }, delay);
  }

  createBat() {
    if (settings.bat.maxSpawned <= this.bats.length) return;

    const color = getRandomItemFromArray(['black', 'black', 'black', 'red']);
    const bat = new Bat({
      parent: this.world,
      ninja: this.ninja,
      scale: settings.worldScale,
      color,
    });
    this.bats.push(bat);
  }

  // =============================================================

  resetStars() {
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].removeFromSuperview();
    }
    this.stars = [];
    clearWait(this.starsInterval);
  }

  spawnStars(evt: string, opts: { entity: Entity }) {
    const { entity } = opts;
    if (!entity) return;

    new ExplosionStars({
      parent: this.world,
      ninja: this.ninja,
      max: getRandomInt(1, 3),
      startX: entity.style.x,
      startY: entity.style.y + 4 * settings.worldScale,
    });
  }

  // =============================================================

  explosion(evt: string, opts: { entity: Entity }) {
    const { entity } = opts;
    if (!entity) return;

    // create explosion particles
    new Explosion({
      parent: this.world,
      sc: settings.worldScale * 0.9,
      max: getRandomInt(16, 32),
      startX: entity.style.x,
      startY: entity.style.y + 4 * settings.worldScale,
      color: entity.color,
    });

    if (entity === this.ninja) return;

    this.destroyEntity(entity);
  }

  destroyEntity(entity: Entity) {
    // add score
    StateObserver.dispatch(addScore(entity.scorePoints));

    // remove entity
    entity.removeFromSuperview();
    this.removeEntityFromArray(entity);
  }

  removeEntityFromArray(entity: Entity) {
    const arr = this[`${entity.type}s`];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === entity) {
        arr.splice(i, 1);
        return;
      }
    }
  }
}
