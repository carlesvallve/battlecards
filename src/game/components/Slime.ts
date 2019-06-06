import animate from 'animate';
import SpriteView from 'ui/SpriteView';

import settings from 'src/conf/settings';

import Entity from 'src/game/components/Entity';
import { GameStates, Actions } from 'src/lib/enums';
import {
  getRandomFloat,
  getRandomInt,
  getDistanceBetweenViews,
  debugPoint,
  getRandomItemFromArray,
  getScreenDimensions,
} from 'src/lib/utils';
import View from 'ui/View';
import level from 'src/conf/levels';
import { point } from 'src/lib/types';
import Ninja from './Ninja';

export default class Slime extends Entity {
  sprite: SpriteView;
  ninja: Ninja;
  scorePoints: number;
  starProbability: number;
  
  constructor(opts: {
    parent: View;
    x: number;
    y: number;
    scale: number;
    color: string;
  }) {
    super(opts);
    this.ninja = this.game.ninja;
    this.screen = getScreenDimensions();

    this.dir = -1;
    this.speed = getRandomFloat(0.5, 1.5); // bigger is faster // 0.5, 3.0
    this.color = opts.color || 'black';
    this.scorePoints =
      this.color === 'black' ? getRandomInt(10, 20) : getRandomInt(30, 50);
    this.starProbability =
      this.color === 'black' ? getRandomInt(10, 30) : getRandomInt(30, 50);

    this.action = Actions.Idle;

    const pos = this.getSpawnPosition();
    this.updateOpts({
      x: pos.x,
      y: pos.y,
      zIndex: 100,
    });

    this.createSprite();
    this.setDirection(getRandomItemFromArray([-1, 1]));

    this.on('collision.ground', () => {});
    this.on('collision:wall', () => {
      // change slime direction
      animate(this).clear();
      this.setDirection(-this.dir);
    });
  }

  getSpawnPosition(): point {
    const { mapData, tileSize } = level;
    const ninja = this.ninja;

    const y = ninja.style.y + getRandomInt(0, -100);

    const min = settings.slimes.spawnDistance[0];
    const max = settings.slimes.spawnDistance[1];

    let left = ninja.style.x - getRandomInt(min, max);
    let right = ninja.style.x + getRandomInt(min, max);

    // always between map limits
    if (left < tileSize) {
      left = tileSize;
    }
    if (right > (mapData[0].length - 1) * tileSize) {
      right = (mapData[0].length - 1) * tileSize;
    }

    // choose left or right
    const x = getRandomInt(1, 100) <= 50 ? left : right;

    return { x, y };
  }

  createSprite() {
    // create animated sprite
    this.sprite = new SpriteView({
      parent: this,
      width: 16,
      height: 16,
      url: 'resources/images/8bit-ninja/slime',
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
    if (this.game.gameState === GameStates.Pause) {
      return;
    }

    if (this.action === Actions.Attack) {
      return;
    }

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
  }

  checkNinjaDistance() {
    // escape if the slime is dying or already attacking
    if (this.action === Actions.Attack || this.action === Actions.Die) {
      return;
    }

    // if the slime is far away from the ninja and walking in opposite direction, turn around
    if (settings.slimes.turnOnScreenLimit) {
      const max = this.screen.width / 2;
      const dx = this.style.x - this.ninja.style.x;
      if ((this.dir === -1 && dx <= -max) || (this.dir === 1 && dx >= max)) {
        this.setDirection(-this.dir);
      }
    }

    // escape if ninja is alredy dying
    if (this.ninja.action === Actions.Die) {
      return;
    }

    // if the slime gets near enough to the ninja...
    const dist = getDistanceBetweenViews(this, this.ninja);
    if (dist <= 6 * this.scale) {
      // if the slime is facing towards the ninja's back (or just near enough with autoAttackMode disabled) then he will attack
      const dir = Math.sign(this.style.x - this.ninja.style.x);
      if (dir !== this.dir) {
        // -> if the slime is looking in the ninja direction
        if (
          dir !== this.ninja.dir ||
          (!settings.player.autoAttack && this.ninja.action === Actions.Idle)
        ) {
          this.attack();
          return;
        }
      }

      // otherwise, the ninja will attack the slime and make him explode
      this.action = Actions.Die;
      this.setDirection(0);

      // make ninja attack us
      this.ninja.emit('ninja:attack', { target: this });

      // wait and explode
      animate(this)
        .clear()
        .wait(100)
        .then(() => {
          this.die();
        });
    }
  }

  attack() {
    if (this.ninja.respawning) {
      return;
    }

    this.action = Actions.Attack;
    this.ninja.emit('ninja:die');

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
    this.game.emit('game:explosion', { slime: this });

    const r = getRandomInt(1, 100);
    if (r <= this.starProbability) {
      this.game.emit('game:spawnstars', { chest: this });
    }
  }
}
