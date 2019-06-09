import pubsub from 'pubsub-js';

import View from 'ui/View';
import {
  getRandomFloat,
  waitForIt,
  getRandomItemFromArray,
  getRandomInt,
  clearWait,
} from 'src/lib/utils';
import settings from 'src/conf/settings';
import { isGamePaused, isNinjaDead } from 'src/redux/shortcuts';
import Bat from './Bat';
import Slime from './Slime';
import World from './World';
import Ninja from './Ninja';
import Entity from './Entity';
import { addScore } from 'src/redux/state/reducers/user';
import StateObserver from 'src/redux/StateObserver';
import Star from './Star';
import Explosion from './Explosion';

export default class EntityManager {
  world: World;
  ninja: Ninja;

  slimes: Slime[];
  slimesInterval: object;

  bats: Bat[];
  batsInterval: object;

  stars: Star[];
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
    // console.log('spawning slimes...');

    // wait and create a new slime
    this.slimesInterval = {};
    const range = settings.slime.spawnInterval;
    const delay = getRandomFloat(range.min, range.max);

    this.slimesInterval = waitForIt(
      () => {
        // create new slime
        if (!isGamePaused() && !isNinjaDead()) {
          this.createSlime();
        }

        // recursevely iterate
        this.spawnSlimes();
      },
      delay
    );
  }

  createSlime() {
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
    // wait and create a new bat
    this.batsInterval = {};
    const range = settings.bat.spawnInterval;
    const delay = getRandomFloat(range.min, range.max);

    this.batsInterval = waitForIt(
      () => {
        // create new slime
        if (!isGamePaused() && !isNinjaDead()) {
          this.createBat();
        }

        // recursevely iterate
        this.spawnBats();
      },
      delay
    );
  }

  createBat() {
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

    new Star({
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
    const arr = this[entity.type];

    for (let i in arr) {
      if (arr[i] === entity) {
        arr.splice(parseInt(i, 10), 1);
        break;
      }
    }
  }
}
