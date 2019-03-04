import View from 'ui/View';
import QuickViewPool from 'ui/ViewPool2';
import {
  getScreenDimensions,
  getRandomInt,
  getRandomFloat } from 'src/lib/utils';
  import { GameStates } from 'src/lib/enums';



const pool = new QuickViewPool({
  ctor: View,
  initOpts: {
    centerOnOrigin: true,
    centerAnchor: true
  }
});

export default class Explosion extends View {
  constructor (opts) {
    super(opts);

    this.screen = getScreenDimensions();
    this.sc = opts.sc;
    this.game = opts.parent.game;

    // initialize gravity and velocity
    this.gravity = 0.75;
    this.impulse = 16;
    this.vx = 0;
    this.vy = 0;

    // create explosion sprite particles
    this.sprites = [];
    for (let i = 0; i < opts.max; i++) {
      this.sprites.push(this.createSprite(opts));
    }
  }

  createSprite ({ startX, startY, color }) {
    const size = getRandomFloat(1.5, 3);

    // using timestep's ViewPool2
    // sprite pooling system to increase performance
    const sprite = pool.obtainView();
    this.addSubview(sprite);
    sprite.style.backgroundColor = color;
    sprite.style.scale = this.sc;
    sprite.style.x = startX;
    sprite.style.y = startY;
    sprite.style.width = size;
    sprite.style.height = size;
    sprite.style.offsetX = -size / 2;
    sprite.style.offsetY = -size;

    sprite.vx = getRandomInt(-15, 15) * 0.5;
    sprite.vy = getRandomInt(-22, 15) * 0.75;

    return sprite;
  }

  tick (dt) {
    if (this.game.gameState === GameStates.Pause) {
      return;
    }

    // remove explosion when there are no sprites left alive
    if ( this.sprites.length === 0) {
      this.removeFromSuperview();
      return;
    }

    // uopdate particles
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      const me = sprite.style;

      // add gravity to velocity on y axis
      sprite.vy += this.gravity;

      // update position
      me.x += sprite.vx;
      me.y += sprite.vy;

      // check collision left
      const left = this.game.ninja.style.x - this.screen.width / 2;
      if (me.x + sprite.vx <= left) {
        me.x = 0;
        sprite.vx = -sprite.vx * 0.75;
      }

      // check collision right
      const right = this.game.ninja.style.x + this.screen.width / 2;
      if (me.x + sprite.vx >= right) {
        me.x = this.screen.width;
        sprite.vx = -sprite.vx * 0.75;
      }

      // check collision bottom
      const floorY = this.game.world.getFloorY(me.x);
      if (me.y + sprite.vy >= floorY) {
        me.y = floorY;
        sprite.vy = -sprite.vy * 0.9;
      }

      // scale down
      const lifeSpeed = getRandomFloat(0.97, 0.99) * 1;
      me.scale *= lifeSpeed;

      // kill particle when her life ends
      if (me.scale <= 0.4 || (sprite.style.y === floorY && sprite.vy === 0)) {
        pool.releaseView(sprite);
        this.sprites.splice(i, 1);
      }
    }
  }
}
