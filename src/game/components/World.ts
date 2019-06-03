import animate from 'animate';
import View from 'ui/View';
import settings from 'src/conf/settings';
import { getScreenDimensions, getRandomInt, debugPoint } from 'src/lib/utils';
import { GameStates } from 'src/lib/enums';
import level from 'src/conf/levels/index';

export default class World extends View {
  constructor(opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent;
    this.elasticity = 0.25;

    debugPoint(this);
  }

  init() {
    this.centerAt(this.game.ninja);
  }

  centerAt(ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    const targetY = -ninja.style.y + this.screen.height / 2;
    this.updateOpts({
      x: targetX,
      y: targetY,
    });
  }

  interpolate(ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    const targetY = -ninja.style.y + this.screen.height / 2;
    const dx = (targetX - this.style.x) * this.elasticity;
    this.style.x += dx;

    if (ninja.isGrounded()) {
      const dy = (targetY - this.style.y) * this.elasticity;
      this.style.y += dy;
    }
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
