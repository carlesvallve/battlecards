import animate from 'animate';
import View from 'ui/View';
import SpriteView from 'ui/SpriteView';
import Entity from 'src/game/components/Entity';
import { GameStates, Actions } from 'src/lib/enums';
import sounds from 'src/lib/sounds';
import { debugPoint, waitForIt } from 'src/lib/utils';
import { point } from 'src/lib/types';
import level, { getTileTypeAtPixel } from 'src/conf/levels';
import World from './World';
import StateObserver from 'src/redux/StateObserver';

export default class Ninja extends Entity {
  sprite: SpriteView;
  respawning: boolean;
  goal: point;

  constructor(opts: { parent: World; x: number; y: number; scale: number }) {
    super(opts);

    this.gravity = 0.25;
    this.impulse = 10;
    this.goal = null;

    this.createSprite();

    this.on('ninja:start', this.init.bind(this, { x: opts.x, y: opts.y }));
    this.on('ninja:idle', this.idle.bind(this));
    this.on('ninja:run', this.run.bind(this));
    this.on('ninja:jump', this.jump.bind(this));
    this.on('ninja:attack', this.attack.bind(this));
    this.on('ninja:die', this.die.bind(this));
    this.on('ninja:moveTo', this.moveTo.bind(this));
    this.on('ninja:jumpTo', this.jumpTo.bind(this));

    this.on('collision:ground', () => {
      // console.log('collision:ground');
      if (this.action === Actions.Jump) {
        animate(this).clear();
        this.idle();
      }
    });
    this.on('collision:wall', () => {
      // console.log('collision:wall');
      // stop interpolating and animating character
      if (this.action === Actions.Run) {
        animate(this).clear();
        this.idle();
      }
    });

    // StateObserver.createSelector(
    //   (state) => state.user.isPlaying === true,
    // ).addListener((active) => {
    //   console.log('playing...');
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
    this.action = Actions.Idle;
    this.respawning = false;
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
    if (this.action === Actions.Idle) {
      return;
    }
    this.action = Actions.Idle;
    this.sprite.setFramerate(6);
    this.sprite.startAnimation('idle', { loop: true });
    animate(this).clear();
  }

  run() {
    if (this.action === Actions.Die) return;
    if (this.action === Actions.Run) return;

    this.action = Actions.Run;
    this.sprite.setFramerate(10);
    this.sprite.startAnimation('run', { loop: true });
    this.setDirection(1);
  }

  jump() {
    if (this.action === Actions.Die) return;
    if (this.action === Actions.Jump) return;

    this.action = Actions.Jump;
    this.setDirection(1);
    this.sprite.setFramerate(16); //12);
    this.sprite.startAnimation('roll', {
      loop: false,
      callback: () => {
        this.idle();
      },
    });
  }

  attack(opts: { target: Entity }) {
    if (this.action === Actions.Die || opts.target.action === Actions.Attack) {
      return;
    }

    this.action = Actions.Attack;
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('attack', {
      loop: false,
      callback: () => {
        this.idle();
        if (this.goal) {
          this.moveTo({ x: this.goal.x, y: this.goal.y });
        }
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
    if (this.game.gameState === GameStates.Pause) {
      return;
    }
    if (this.action === Actions.Die || this.respawning) {
      return;
    }
    this.idle();
    this.action = Actions.Die;

    this.game.hud.emit('hud:removeHeart');

    // wait and die
    const anim = animate(this)
      .clear()
      .wait(100)
      .then(() => {
        this.game.hud.onResume();
        sounds.playSound('explode');
        this.game.emit('game:explosion', { entity: this });
        this.hide();
      })
      .wait(500)
      .then(() => {
        this.game.hud.onResume();
        // if no more hearts, gameover!
        if (this.game.hud.hearts.length === 0) {
          anim.clear();
          this.game.emit('game:gameover');
        }
      })
      .wait(500)
      .then(() => {
        // respawn ninja if we have hearts left
        this.respawn();
      });
  }

  respawn() {
    sounds.playSound('destroy');
    this.goal = null;
    // this.updateOpts({ y: -2 });
    this.respawning = true;
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
        this.respawning = false;
      });
  }

  moveTo(pos: point) {
    if (this.action === Actions.Die) return;

    const { x, y } = pos;
    this.setDirection(x >= this.style.x ? 1 : -1);

    const speed = 10; // bigger is slower
    const d = Math.abs(x - this.style.x);
    const duration = d * speed;

    this.action = Actions.Run;
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('run', { loop: true });

    this.goal = { x, y };

    animate(this)
      .clear()
      .now({ x: this.style.x }, 0, animate.linear)
      .then({ x: x }, duration, animate.linear)
      .then(() => {
        this.idle();
        this.goal = null;
      });
  }

  jumpTo(pos: point) {
    if (this.action === Actions.Die) {
      return;
    }

    const { x, y } = pos;

    // if (!this.isGrounded()) return;
    // if (this.vy < 0) return;
    // if (this.action === Actions.Jump) return;

    sounds.playSound('woosh');

    this.vy = -16;
    const duration = 300;
    this.goal = null;

    this.action = Actions.Jump;
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('roll', { loop: true });
    this.setDirection(x >= this.style.x ? 1 : -1);

    animate(this)
      .clear()
      .then({ x: x, y: y }, duration, animate.linear);
    // .then(() => this.idle());
  }

  tick(dt) {
    if (this.game.gameState === GameStates.Pause) return;

    super.tick(dt);

    this.checkDeathByLava();
  }

  checkForLava() {
    if (this.isDeadOrSpawning()) return false;
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
        if (this.isDeadOrSpawning()) return;
        if (!this.checkForLava()) return;
        console.log('Lava death!');
        this.die();
      }, 0);
    }
  }

  isDeadOrSpawning() {
    return this.action === Actions.Die || this.respawning;
  }
}
