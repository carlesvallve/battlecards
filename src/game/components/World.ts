import pubsub from 'pubsub-js';

import View from 'ui/View';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import { screen } from 'src/lib/customTypes';
import { isGameActive } from 'src/redux/state/states';
import GameScreen from 'src/game/screens/GameScreen';
import Ninja from 'src/game/components/Ninja';

export default class World extends View {
  screen: screen;
  game: GameScreen;
  ninja: Ninja;
  elasticity: number;

  constructor(opts: { parent: GameScreen }) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent;
    this.elasticity = 0.25;

    pubsub.subscribe('world:start', this.init.bind(this));

    debugPoint(this);
  }

  init() {
    this.centerAt(this.game.ninja);
  }

  centerAt(ninja: Ninja) {
    const targetX = -ninja.style.x + this.screen.width / 2;
    const targetY = -ninja.style.y + this.screen.height / 2;
    this.updateOpts({
      x: targetX,
      y: targetY,
    });
  }

  interpolate(ninja: Ninja) {
    if (!ninja) return;

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
    if (!isGameActive()) return;

    const ninja = this.game.ninja;
    this.interpolate(ninja);
  }
}
