import pubsub from 'pubsub-js';

import animate from 'animate';
import SpriteView from 'ui/SpriteView';
import Entity from 'src/game/components/Entity';
import { Actions } from 'src/lib/enums';
import sounds from 'src/lib/sounds';
import { debugPoint, waitForIt } from 'src/lib/utils';
import { point } from 'src/lib/customTypes';
import level, { getTileTypeAtPixel } from 'src/conf/levels';
import World from './World';
import StateObserver from 'src/redux/StateObserver';
import { addHearts } from 'src/redux/state/reducers/user';
import { setGameState } from 'src/redux/state/reducers/game';
import {
  setEntityState,
  setGoal,
  setRespawning,
} from 'src/redux/state/reducers/ninja';
import {
  isGameActive,
  isNinjaRunning,
  isNinjaIdle,
  isNinjaDead,
  isNinjaJumping,
  getNinjaGoal,
  isNinjaAttacking,
  isNinjaRespawning,
  isGamePaused,
  getHearts,
} from 'src/redux/state/states';

export default class Ninja extends Entity {
  sprite: SpriteView;

  constructor(opts: { parent: World; x: number; y: number; scale: number }) {
    super(opts);

    this.gravity = 0.25;
    this.impulse = 10;

    StateObserver.dispatch(setGoal(null));

    this.createSprite();

    const startPos = { x: opts.x, y: opts.y };
    pubsub.subscribe('ninja:start', this.init.bind(this, startPos));
    pubsub.subscribe('ninja:attack', this.attack.bind(this));
    pubsub.subscribe('ninja:die', this.die.bind(this));

    // collisions are emitted from superclass,
    // so no need to use pubsub
    this.on('collision:ground', () => {
      // console.log('collision:ground');
      if (isNinjaJumping()) {
        animate(this).clear();
        this.idle();
      }
    });
    this.on('collision:wall', () => {
      // console.log('collision:wall');
      // stop interpolating and animating character
      if (!isNinjaRunning()) {
        animate(this).clear();
        this.idle();
      }
    });

    // entityState check
    // StateObserver.createSelector(
    //   (state) => state.ninja.entityState,
    // ).addListener((entityState) => {
    //   console.log('ninjaState:', entityState);
    // });
  }

  createSprite() {
    this.sprite = new SpriteView({
      parent: this,
      width: 16,
      height: 16,
      url: 'resources/images/8bit-ninja/ninja',
      defaultAnimation: 'idle',
      frameRate: 5,
      delay: 0,
      autoStart: true,
      loop: true,
      scale: 1.0,
      offsetX: -8,
      offsetY: -16,
    });

    debugPoint(this);
  }

  init(pos: point) {
    StateObserver.dispatch(setEntityState('Idle'));
    StateObserver.dispatch(setRespawning(false));

    this.dir = 1;
    this.speed = 0.1;
    this.color = 'black';

    this.updateOpts({
      x: pos.x,
      y: pos.y,
    });

    animate(this).clear();

    this.setDirection(this.dir);
    this.idle();
    this.show();

    this.respawn();
  }

  setDirection(dir: number) {
    this.dir = dir;
    this.style.flipX = dir === -1;
  }

  idle() {
    if (isNinjaAttacking() || isNinjaIdle()) return;
    StateObserver.dispatch(setEntityState('Idle'));

    this.sprite.setFramerate(6);
    this.sprite.startAnimation('idle', { loop: true });
    animate(this).clear();
  }

  run() {
    if (isNinjaDead() || isNinjaRunning()) return;
    StateObserver.dispatch(setEntityState('Run'));

    this.sprite.setFramerate(10);
    this.sprite.startAnimation('run', { loop: true });
    this.setDirection(1);
  }

  jump() {
    if (isNinjaDead() || isNinjaJumping()) return;
    StateObserver.dispatch(setEntityState('Jump'));

    this.setDirection(1);
    this.sprite.setFramerate(16); // 12
    this.sprite.startAnimation('roll', {
      loop: false,
      callback: () => {
        this.idle();
      },
    });
  }

  attack(evt: string, opts: { target: Entity }) {
    if (isNinjaDead()) return;
    if (opts.target.action === Actions.Attack) return; // todo: slime states

    StateObserver.dispatch(setEntityState('Attack'));

    this.sprite.setFramerate(12);
    this.sprite.startAnimation('attack', {
      loop: false,
      callback: () => {
        this.idle();
        this.moveTo(getNinjaGoal());
      },
    });

    // play attack sfx
    animate(this)
      .clear()
      .wait(0)
      .then(() => {
        sounds.playSound('swap');
      })
      .wait(150)
      .then(() => {
        sounds.playSound('fall', 1);
      });
  }

  die() {
    if (isGamePaused() || isNinjaDead() || isNinjaRespawning()) return;

    // this.idle();
    StateObserver.dispatch(setEntityState('Die'));

    // remove heart
    StateObserver.dispatch(addHearts(-1));

    // wait and die
    const anim = animate(this)
      .clear()
      .wait(100)
      .then(() => {
        sounds.playSound('explode');
        pubsub.publish('game:explosion', { entity: this });
        this.hide();
      })
      .wait(500)
      .then(() => {
        // if no more hearts, gameover!
        if (getHearts() === 0) {
          anim.clear();
          StateObserver.dispatch(setGameState('GameOver'));
        }
      })
      .wait(500)
      .then(() => {
        // respawn ninja if we have hearts left
        this.respawn();
      });
  }

  respawn() {
    StateObserver.dispatch(setGoal(null));
    StateObserver.dispatch(setRespawning(true));

    sounds.playSound('destroy');
    this.style.opacity = 0.6;
    this.show();
    this.idle();

    const t = 100;
    animate({})
      .wait(t)
      .then(() => (this.style.opacity = 0))
      .wait(t)
      .then(() => (this.style.opacity = 0.6))
      .wait(t)
      .then(() => (this.style.opacity = 0))
      .wait(t)
      .then(() => (this.style.opacity = 0.6))
      .wait(t)
      .then(() => (this.style.opacity = 0))
      .wait(t)
      .then(() => (this.style.opacity = 0.6))
      .wait(t)
      .then(() => (this.style.opacity = 0))
      .wait(t)
      .then(() => (this.style.opacity = 0.6))
      .wait(t)
      .then(() => {
        this.style.opacity = 1;
        StateObserver.dispatch(setRespawning(false));
      });
  }

  moveTo(pos: point) {
    if (isNinjaDead() || !pos) return;
    StateObserver.dispatch(setEntityState('Run'));

    this.setDirection(pos.x >= this.style.x ? 1 : -1);

    const speed = 10; // bigger is slower
    const d = Math.abs(pos.x - this.style.x);
    const duration = d * speed;

    this.sprite.setFramerate(12);
    this.sprite.startAnimation('run', { loop: true });

    StateObserver.dispatch(setGoal(pos));

    animate(this)
      .clear()
      .then({ x: pos.x }, duration, animate.linear)
      .then(() => {
        this.idle();
        StateObserver.dispatch(setGoal(null));
      });
  }

  jumpTo(pos: point) {
    if (isNinjaDead()) return;

    StateObserver.dispatch(setEntityState('Jump'));
    StateObserver.dispatch(setGoal(null));
    sounds.playSound('woosh');

    const { x, y } = pos;
    this.vy = -16;
    const duration = 300;

    this.sprite.setFramerate(12);
    this.sprite.startAnimation('roll', { loop: true });
    this.setDirection(x >= this.style.x ? 1 : -1);

    animate(this)
      .clear()
      .then({ x: x, y: y }, duration, animate.linear);
  }

  tick(dt) {
    if (!isGameActive()) return;
    super.tick(dt);
    this.checkDeathByLava();
  }

  checkForLava() {
    if (isNinjaDead() || isNinjaRespawning()) return false;
    const { x, y } = this.style;
    const tileType = getTileTypeAtPixel(x, y - level.tileSize);
    if (tileType === 2) {
      return true;
    }
    return false;
  }

  checkDeathByLava() {
    if (this.checkForLava()) {
      waitForIt(() => {
        if (isNinjaDead() || isNinjaRespawning()) return;
        if (!this.checkForLava()) return;
        console.log('Lava death!');
        this.die();
      }, 0);
    }
  }
}
