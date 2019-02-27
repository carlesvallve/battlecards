import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions, getRandomInt, debugPoint } from 'src/lib/utils';

export default class World extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent;
    this.elasticity = 0.25;

    this.center = 1500;
    this.walkableDistance = -60 + this.screen.width / 2;
    this.left = this.center - this.walkableDistance;
    this.right = this.center + this.walkableDistance;

    debugPoint();
  }

  init (ninja) {
    this.centerAt(ninja);

    const t = 500;
    const easing = animate.easeOut;

    animate(this)
      .now({ opacity: 1, y: 64 }, 0, easing)
      .then({ opacity: 1, y: 0 }, t, easing);
  }

  getFloorY (x) {
    let floorY = 0 + this.screen.height / 2;
    if (x < this.left - 16 || x > this.right + 16) { floorY += 10; }
    return floorY;
  }

  getRandomPos () {
    const ninja = this.game.ninja;
    const y = getRandomInt(this.screen.height / 3, -4 + this.screen.height / 2);

    const left = ninja.style.x - getRandomInt(this.game.options.slimeSpawnDistance, this.screen.width / 2);
    const right = ninja.style.x + getRandomInt(this.game.options.slimeSpawnDistance, this.screen.width / 2);
    const x = getRandomInt(1, 100) <= 50 ? left : right;

    return { x, y };
  }

  centerAt (ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    this.style.x = targetX;
  }

  interpolate (ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    const dx = (targetX - this.style.x) * this.elasticity;
    this.style.x += dx;
  }

  tick (dt) {
    const ninja = this.game.ninja;
    if (!this.game.ninja) {
      return;
    }

    this.interpolate(ninja);
  }
}
