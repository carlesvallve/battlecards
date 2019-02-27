import View from 'ui/View';
import {
  getScreenDimensions,
  getRandomInt,
  getRandomFloat } from 'src/lib/utils';


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

    const sprite = new View({
      parent: this,
      x: startX,
      y: startY,
      width: size,
      height: size,
      backgroundColor: color,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: this.sc,
    });

    sprite.style.offsetX = -size / 2;
    sprite.style.offsetY = -size;

    sprite.vx = getRandomInt(-15, 15) * 0.5;
    sprite.vy = getRandomInt(-22, 15) * 0.75;

    return sprite;
  }

  tick (dt) {
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
      me.scaleX *= lifeSpeed;
      me.scaleY *= lifeSpeed;

      // kill particle when her life ends
      if (me.scaleX <= 0.4 || (sprite.style.y === floorY && sprite.vy === 0)) {
        sprite.hide();
        this.sprites.splice(i, 1);
      }
    }
  }
}
