import View from 'ui/View';
import Image from 'ui/resource/Image';
import ImageView from 'ui/ImageView';
import QuickViewPool from 'ui/ViewPool2';
import { getRandomInt, getRandomFloat } from 'src/lib/utils';

class ExplosionSprite extends ImageView {
  f: number;
  fmax: number;
  vx: number;
  vy: number;
  delay: number;
}

const pool = new QuickViewPool({
  ctor: ExplosionSprite,
  initOpts: {
    centerOnOrigin: true,
    centerAnchor: true,
  },
});

type Opts = {
  // View opts.
  superview: View;
  zIndex?: number;

  // Explosion opts.
  sc: number;
  image?: string;
  max: number;
  startX: number;
  startY: number;
};

class Explosion extends View {
  sc: number;
  imageUrl: string;
  gravity: number;
  sprites: ExplosionSprite[];

  constructor(opts: Opts, private onExplosionEnd: () => void) {
    super(opts);

    this.sc = opts.sc;
    this.imageUrl = opts.image;

    // initialize gravity and velocity
    this.gravity = 1.25;

    // create explosion sprite particles
    this.sprites = [];
    for (let i = 0; i < opts.max; i++) {
      this.sprites.push(this.createSprite(opts));
    }
  }

  createSprite({ startX, startY }) {
    // todo: pass this from outside
    const size = getRandomInt(2, 8); // getRandomInt(32, 76);

    // using timestep's ViewPool2
    // sprite pooling system to increase performance
    const sprite = pool.obtainView();
    this.addSubview(sprite);

    // update timestep view props
    sprite.updateOpts({
      backgroundColor: this.imageUrl ? null : 'white',
      image: new Image({ url: this.imageUrl }),
      scale: this.sc,
      x: startX,
      y: startY,
      width: size,
      height: size,
      offsetX: -size / 2,
      offsetY: -size / 2,
      visible: false,
      r: getRandomFloat(-0.5, 0.5),
    });

    // update custom props
    sprite.vx = getRandomInt(-15, 15); // * 1.5;
    sprite.vy = getRandomInt(-30, 15); // * 1.5;
    sprite.f = 0;
    sprite.fmax = 32; // life duration of each particle in frames

    // set it to 2 for fountain style. Need to implement better...
    sprite.delay = -1; // getRandomInt(-1, 2);

    return sprite;
  }

  tick(dt: number) {
    // remove explosion when there are no sprites left alive
    if (this.sprites.length === 0) {
      this.removeFromSuperview();
      return;
    }

    // uopdate particles
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      const me = sprite.style;

      sprite.f += 1;
      me.visible = sprite.f >= sprite.delay;
      if (!me.visible) {
        return;
      }

      // add gravity to velocity on y axis
      sprite.vy += this.gravity;

      // update position
      me.x += sprite.vx;
      me.y += sprite.vy;

      // kill particle when her life ends
      if (sprite.f === sprite.fmax) {
        pool.releaseView(sprite);
        this.sprites.splice(i, 1);
      }
    }

    // disable animating state
    if (this.sprites.length === 0) {
      this.onExplosionEnd();
    }
  }
}

export default function playExplosion(opts: Opts) {
  return new Promise<void>((resolve) => new Explosion(opts, resolve));
}
