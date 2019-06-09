import pubsub from 'pubsub-js';
import { Actions } from 'src/lib/enums';

import animate from 'animate';
import SpriteView from 'ui/SpriteView';
import settings from 'src/conf/settings';
import level, { mapHeight } from 'src/conf/levels';
import { point } from 'src/lib/customTypes';
import Entity from 'src/game/components/Entity';
import Ninja from './Ninja';

import {
  getRandomInt,
  getDistanceBetweenViews,
  debugPoint,
  getRandomItemFromArray,
} from 'src/lib/utils';
import {
  isGameActive,
  isNinjaDead,
  isNinjaRespawning,
  isNinjaIdle,
} from 'src/redux/shortcuts';
import View from 'ui/View';

export default class Monster extends Entity {
  sprite: SpriteView;
  type: string;
  ninja: Ninja;
  scorePoints: number;
  starProbability: number;

  constructor(opts: {
    parent: View;
    ninja: Ninja;
    scale: number;
    color: string;
    type: string;
  }) {
    super(opts);
    this.ninja = opts.ninja;
    this.type = opts.type;
    this.color = opts.color || 'black';

    const multiplier = this.color === 'black' ? 1 : 2;

    const scorePoints = settings[this.type].scorePoints;
    this.scorePoints =
      getRandomInt(scorePoints.min, scorePoints.max) * multiplier;

    const starProbability = settings[this.type].starProbability;
    this.starProbability =
      getRandomInt(starProbability.min, starProbability.max) * multiplier;

    this.action = Actions.Idle;

    const pos = this.getSpawnPosition();
    this.updateOpts({
      x: pos.x,
      y: pos.y,
      zIndex: 100,
    });

    this.createSprite();
    this.setDirection(getRandomItemFromArray([-1, 1]));

    // this.on('collision:ground', () => {
    //   console.log('monster: collision:ground');
    // });

    // this.on('collision:wall', () => {
    //   console.log('monster: collision:ground');
    // });
  }

  onCollisionGround() {}

  onCollisionWall() {}

  getSpawnPosition(): point {
    const { mapData, tileSize } = level;

    const min = settings[this.type].spawnDistance.min.x;
    const max = settings[this.type].spawnDistance.max.x;
    let left = this.ninja.style.x - getRandomInt(min, max);
    let right = this.ninja.style.x + getRandomInt(min, max);

    // always between map limits
    if (left < tileSize) left = tileSize;
    if (right > (mapData[0].length - 1) * tileSize) {
      right = (mapData[0].length - 1) * tileSize;
    }

    // get x
    const x = getRandomInt(1, 100) <= 50 ? left : right;

    // get y
    const minY = settings[this.type].spawnDistance.min.y;
    const maxY = settings[this.type].spawnDistance.max.y;
    const y = this.ninja.style.y + getRandomInt(minY, -maxY);

    return { x, y };
  }

  createSprite() {
    // create animated sprite
    this.sprite = new SpriteView({
      parent: this,
      width: 16,
      height: 16,
      url: `resources/images/8bit-ninja/${this.type}`,
      defaultAnimation: this.color,
      frameRate: 10,
      delay: 0,
      autoStart: true,
      loop: true,
      scale: 1.0,
    });

    this.sprite.style.offsetX = -8;
    this.sprite.style.offsetY = -16;

    debugPoint(this);
  }

  tick(dt) {
    if (!isGameActive()) return;

    const me = this.style;
    me.x += this.speed * this.dir;

    super.tick(dt);
    this.checkNinjaDistance();
  }

  setDirection(dir: number) {
    this.dir = dir;
    this.style.flipX = dir === -1;
  }

  checkOutOfMapBounds() {
    // kill the slime if it drops out of map height
    if (this.style.y > mapHeight) {
      this.die();
    }
  }

  checkNinjaDistance() {
    // escape if the slime is dying or already attacking
    if (this.action === Actions.Attack || this.action === Actions.Die) {
      return;
    }

    // if the monster is far away from the ninja and walking in opposite direction, turn around
    if (settings[this.type].turnOnScreenLimit) {
      const max = this.screen.width / 2;
      const dx = this.style.x - this.ninja.style.x;
      if ((this.dir === -1 && dx <= -max) || (this.dir === 1 && dx >= max)) {
        this.setDirection(-this.dir);
      }
    }

    // escape if ninja is alredy dying
    if (isNinjaDead()) return;

    // if the monster gets near enough to the ninja...
    const dist = getDistanceBetweenViews(this, this.ninja);
    if (dist <= 6 * this.scale) {
      // if the monster is facing towards the ninja's back (or just near enough with autoAttackMode disabled) then he will attack
      const dir = Math.sign(this.style.x - this.ninja.style.x);
      if (dir !== this.dir) {
        // -> if the slime is looking in the ninja direction
        if (
          dir !== this.ninja.dir ||
          (!settings.player.autoAttack && isNinjaIdle())
        ) {
          this.attack();
          return;
        }
      }

      // otherwise, the ninja will attack the monster and make him explode
      this.action = Actions.Die;
      this.setDirection(0);

      // make ninja attack the monster
      pubsub.publish('ninja:attack', { target: this });

      // wait and die
      animate(this)
        .clear()
        .wait(100)
        .then(() => {
          this.die();
        });
    }
  }

  attack() {
    if (isNinjaRespawning()) return;

    this.action = Actions.Attack;
    pubsub.publish('ninja:die');

    animate(this)
      .clear()
      .now({ x: this.style.x, y: this.style.y }, 0, animate.easeOut)
      .then(
        { x: this.ninja.style.x, y: this.ninja.style.y - 8 },
        200,
        animate.easeOut,
      )
      .then(() => {
        this.action = Actions.Idle;
      });
  }

  die() {
    pubsub.publish('game:explosion', { entity: this });

    const r = getRandomInt(1, 100);
    if (r <= this.starProbability) {
      pubsub.publish('game:spawnstars', { entity: this });
    }
  }
}
