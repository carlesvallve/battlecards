import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions, getRandomInt, debugPoint } from 'src/lib/utils';
import { GameStates } from 'src/lib/enums';
import level from 'src/conf/levels/index';

export default class World extends View {
  constructor(opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent;
    this.elasticity = 0.25;

    this.center = this.screen.width / 2; // 1500;
    this.walkableDistance = -60 + this.screen.width / 2;
    this.left = this.center - this.walkableDistance;
    this.right = this.center + this.walkableDistance;

    debugPoint({});
  }

  init(ninja) {
    this.centerAt(ninja);

    const t = 500;
    const easing = animate.easeOut;

    animate(this)
      .now({ opacity: 1, y: 64 }, 0, easing)
      .then({ opacity: 1, y: 0 }, t, easing);
  }

  getFloorY(x) {
    let floorY = 0 + this.screen.height / 2;
    if (x < this.left - 16 || x > this.right + 16) {
      floorY += 10;
    }
    return floorY;
  }

  getRandomPos() {
    const { mapData, tileSize } = level;
    const ninja = this.game.ninja;

    const y = getRandomInt(this.screen.height / 3, -4 + this.screen.height / 2);

    let left =
      ninja.style.x -
      getRandomInt(this.game.options.slimeSpawnDistance, this.screen.width / 3);
    if (left < tileSize) {
      left = tileSize;
    }
    let right =
      ninja.style.x +
      getRandomInt(this.game.options.slimeSpawnDistance, this.screen.width / 3);
    if (right > (mapData[0].length - 1) * tileSize) {
      right = (mapData[0].length - 1) * tileSize;
    }

    const x = getRandomInt(1, 100) <= 50 ? left : right;

    return { x, y };
  }

  centerAt(ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    const targetY = -ninja.style.y + this.screen.height / 2;
    this.style.x = targetX;
    this.style.y = targetY;
  }

  interpolate(ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    const targetY = -ninja.style.y + this.screen.height / 2;
    const dx = (targetX - this.style.x) * this.elasticity;
    const dy = (targetY - this.style.y) * this.elasticity;
    this.style.x += dx;
    this.style.y += dy;
  }

  tick(dt) {
    if (this.game.gameState === GameStates.Pause) {
      return;
    }

    const ninja = this.game.ninja;
    if (!this.game.ninja) {
      return;
    }

    this.interpolate(ninja);
  }
}
