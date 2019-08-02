import animate from 'animate';
import View from 'ui/View';
import Monster from 'src/game/components/Monster';
import Ninja from 'src/game/components/Ninja';
import { getRandomFloat, waitForIt } from 'src/lib/utils';
import { isGamePaused } from 'src/redux/shortcuts';
import settings from 'src/conf/settings';

export default class Bat extends Monster {
  flyInterval: object;

  constructor(opts: {
    parent: View;
    ninja: Ninja;
    scale: number;
    color: string;
  }) {
    super({ ...opts, type: 'bat' });

    this.gravity = 0.01;
    this.speed = getRandomFloat(0.5, 1.5); // bigger is faster

    this.setFlyInterval();
  }

  onCollisionGround() {
    const d = this.speed * 2;
    this.vy = getRandomFloat(-d / 2, -d);
    // this.vy = getRandomFloat(-1, -2.5);
    this.grounded = false;
  }

  onCollisionWall() {}

  tick(dt) {
    super.tick(dt);

    const me = this.style;
    me.x += this.speed * this.dir;

    this.checkVerticalDistance();
  }

  setFlyInterval() {
    // wait and create a new bat
    const range = settings.bat.flyInterval;
    const delay = getRandomFloat(range.min, range.max);

    this.flyInterval = waitForIt(() => {
      // create new slime
      if (!isGamePaused()) {
        const d = this.speed * 2;
        this.vy = getRandomFloat(-d, d);
        this.grounded = false;
      }

      this.setFlyInterval();
    }, delay);
  }

  checkVerticalDistance() {
    // if the monster is far away from the ninja
    // and flying in opposite direction, turn around
    const max = this.screen.height / 4;
    const dy = this.style.y - this.ninja.style.y;
    if ((this.vy < 0 && dy <= -max) || (this.vy > 0 && dy >= max)) {
      this.vy = -this.vy;
    }
  }
}
