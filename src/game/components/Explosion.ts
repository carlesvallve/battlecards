import View from 'ui/View';
import QuickViewPool from 'ui/ViewPool2';
import { getRandomInt, getRandomFloat } from 'src/lib/utils';
import { GameStates } from 'src/lib/enums';
import { rayCast } from 'src/lib/raycast';

const pool = new QuickViewPool({
  ctor: View,
  initOpts: {
    centerOnOrigin: true,
    centerAnchor: true,
  },
});

// todo: we should turn this into an abstract class since we are not the parent anymore

export default class Explosion extends View {
  constructor(opts) {
    super(opts);

    this.game = opts.parent.game;

    // initialize gravity and velocity
    this.gravity = 0.5;
    this.impulse = 16;
    this.vx = 0;
    this.vy = 0;

    // create explosion sprite particles
    this.sprites = [];
    for (let i = 0; i < opts.max; i++) {
      this.sprites.push(this.createSprite(opts));
    }
  }

  createSprite({ startX, startY, color, sc }) {
    const size = getRandomFloat(1.5, 3);

    // using timestep's ViewPool2
    // sprite pooling system to increase performance
    const sprite = pool.obtainView();
    this.game.world.addSubview(sprite);
    sprite.style.backgroundColor = color;
    sprite.style.scale = sc;
    sprite.style.x = startX;
    sprite.style.y = startY - 8;
    sprite.style.width = size;
    sprite.style.height = size;
    sprite.style.offsetX = -size / 2;
    sprite.style.offsetY = -size;

    sprite.vx = getRandomInt(-15, 15) * 0.5;
    sprite.vy = getRandomInt(-22, 3) * 0.75;

    return sprite;
  }

  tick(dt) {
    if (this.game.gameState === GameStates.Pause) {
      return;
    }

    // remove explosion when there are no sprites left alive
    if (this.sprites.length === 0) {
      this.removeFromSuperview();
      return;
    }

    // uopdate particles
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      const me = sprite.style;

      me.x += sprite.vx;
      me.y += sprite.vy;
      this.castRayDown(sprite, 0);
      this.castRayForward(sprite, 0);

      // scale down
      const lifeSpeed = getRandomFloat(0.98, 0.995) * 1;
      me.scale *= lifeSpeed;

      // kill particle when her life ends
      if (me.scale <= 0.4 && sprite.grounded && sprite.vy === 0) {
        pool.releaseView(sprite);
        this.sprites.splice(i, 1);
      }
    }
  }

  castRayDown(sprite, dx, debug = false) {
    const me = sprite.style;
    const up = 1;
    const forward = 0;
    const offset = this.game.terrain.offset;

    const hit = rayCast(
      { x: me.x - forward, y: me.y - up },
      { x: 0, y: 1 },
      32,
      offset,
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    if (hit && hit.distance <= up) {
      // set y to hit point and reset gravity vector
      me.y = hit.position.y;
      sprite.vy = -sprite.vy * 0.3; // 0.4;
      sprite.grounded = true;
    } else {
      // add gravity to velocity on y axis
      sprite.vy += this.gravity;
      sprite.grounded = false;
    }
  }

  castRayForward(sprite, dy, debug = false) {
    const me = sprite.style;
    const d = 2;
    const up = 2;
    const offset = this.game.terrain.offset;

    const hit = rayCast(
      { x: me.x, y: me.y - up },
      { x: this.vx > 0 ? 1 : -1, y: 0 },
      16,
      offset,
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    if (hit && hit.distance <= d) {
      sprite.vx = -sprite.vx * 0.75;
    }
  }
}
