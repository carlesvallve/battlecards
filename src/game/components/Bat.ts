import animate from 'animate';
import View from 'ui/View';
import Monster from 'src/game/components/Monster';
import Ninja from 'src/game/components/Ninja';
import { getRandomFloat } from 'src/lib/utils';

export default class Bat extends Monster {
  constructor(opts: {
    parent: View;
    ninja: Ninja;
    scale: number;
    color: string;

    // dirY: number;
    // speedY: number;
  }) {
    super({ ...opts, type: 'bat' });

    this.gravity = 0.01;
    this.speed = getRandomFloat(0.5, 1.5); // bigger is faster
  }

  onCollisionGround() {
    this.vy = getRandomFloat(-1, -2.5);
    this.grounded = false;
  }

  onCollisionWall() {}

  tick(dt) {
    super.tick(dt);

    const me = this.style;
    me.x += this.speed * this.dir;
  }
}
