import View from 'ui/View';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
// import { GameStates } from 'src/lib/enums';
import { screen } from 'src/lib/types';
import Ninja from './Ninja';
import GameScreen from '../screens/GameScreen';
import StateObserver from 'src/redux/StateObserver';
import { isGameActive } from 'src/redux/state/states';

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
    if (!ninja) return;

    this.interpolate(ninja);
  }
}
