import animate from 'animate';
import View from 'ui/View';
import SpriteView from 'ui/SpriteView';
import { Actions } from 'src/lib/enums.js';
import {
  getScreenDimensions,
  getRandomFloat,
  getRandomInt,
  getDistanceBetweenViews,
  debugPoint,
  getRandomItemFromArray } from 'src/lib/utils';


export default class Slime extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.scale = opts.scale;
    this.game = opts.parent.game;
    this.ninja = this.game.ninja;

    this.dir = -1;
    this.speed = getRandomFloat(0.5, 3.0);
    this.color = opts.color || 'black';
    this.scorePoints = this.color === 'black' ? getRandomInt(10, 20) :  getRandomInt(30, 50);
    this.starProbability = this.color === 'black' ? getRandomInt(10, 30) :  getRandomInt(30, 50);

    this.action = Actions.Idle;

    // initialize gravity and velocity
    this.gravity = 1.5;
    this.impulse = 0;
    this.vx = getRandomFloat(-10, 10);
    this.vy = 0;

    this.style.zIndex = 100;

    this.createSprite();
    this.setDirection(getRandomItemFromArray([-1, 1]));
  }

  createSprite () {
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

  tick () { // dt
    if (this.action === Actions.Attack) {
      return;
    }

    const me = this.style;
    me.x += this.speed * this.dir;

    const floorY = this.game.world.getFloorY(me.x);

    // reverse direction if we go out of screen limits
    if (me.y === floorY) {
      const left  = this.ninja.style.x - this.screen.width / 2;
      const right = this.ninja.style.x + this.screen.width / 2;

      if (this.dir > 0 && me.x > right - this.speed - me.width / 2) {
        this.setDirection(-1);
      }
      if (this.dir < 0 && me.x < left + this.speed + me.width / 2) {
        this.setDirection(1);
      }
    }

    // add gravity to velocity on y axis
    this.vy += this.gravity;
    me.y = me.y + this.vy;

    // check for rebound at floor level
    if (me.y + this.vy >= floorY) {
      me.y = floorY;
      // this.impulse = getRandomFloat(5, 20);
      // this.speed = getRandomFloat(this.speed - 0.5, this.speed + 0.5);
      this.vy = this.impulse * -this.gravity;
    }

    this.checkNinjaDistance();
  }

  setDirection (dir) {
    this.dir = dir;
    this.style.flipX = dir === -1;
  }

  jump () {
    this.impulse = 26;
  }

  checkNinjaDistance () {
    // escape if the slime is dying or already attacking
    if (this.action === Actions.Attack || this.action === Actions.Die) {
      return;
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
      if (dir !== this.dir) { // -> if the slime is looking in the ninja direction
        if (dir !== this.ninja.dir || (!this.game.options.autoAttackMode && this.ninja.action === Actions.Idle)) {
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

  attack () {
    if (this.ninja.respawning) { return; }

    this.action = Actions.Attack;
    this.ninja.emit('ninja:die');

    animate(this).clear()
    .now({ x: this.style.x, y: this.style.y }, 0, animate.easeOut)
    .then({ x: this.ninja.style.x, y: this.ninja.style.y - 8 }, 200, animate.easeOut)
    .then(() => {
      this.action = Actions.Idle;
    });
  }

  die () {
    this.game.emit('game:explosion', { slime: this });

    const r = getRandomInt(1, 100);
    if (r <= this.starProbability) {
      this.game.emit('game:spawnstars', { chest: this });
    }
  }
}
