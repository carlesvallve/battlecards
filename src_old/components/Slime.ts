import animate from 'animate';
import View from 'ui/View';
import Monster from 'src/game/components/Monster';
import Ninja from 'src/game/components/Ninja';
import { getRandomFloat } from 'src/lib/utils';

export default class Slime extends Monster {
  constructor(opts: {
    parent: View;
    ninja: Ninja;
    scale: number;
    color: string;
  }) {
    super({ ...opts, type: 'slime' });

    this.gravity = 0.25;
    this.speed = getRandomFloat(0.5, 1.5); // bigger is faster
  }

  onCollisionGround() {}

  onCollisionWall() {
    // change direction
    animate(this).clear();
    this.setDirection(-this.dir);
  }
}
