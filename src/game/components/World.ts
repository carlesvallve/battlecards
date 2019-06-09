import pubsub from 'pubsub-js';

import View from 'ui/View';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import { screen } from 'src/lib/customTypes';
import { isGameActive } from 'src/redux/shortcuts';
import GameScreen from 'src/game/screens/GameScreen';
import Entity from './Entity';

// World contains all game elements (terrain, entities, ninja)
// and behaves like a Camera class, following the target.

export default class World extends View {
  screen: screen;
  target: Entity;
  elasticity: number;

  constructor(opts: { parent: GameScreen }) {
    super(opts);
    this.screen = getScreenDimensions();
    this.elasticity = 0.25;

    pubsub.subscribe('world:start', this.init.bind(this));

    debugPoint(this);
  }

  init(evt: string, opts: { target: Entity }) {
    this.setTarget(opts.target);
    this.centerAtTarget();
  }

  setTarget(target: Entity) {
    this.target = target;
  }

  isTarget() {
    if (!this.target) {
      console.error('No camera target has been set!');
      return false;
    }

    return true;
  }

  centerAtTarget() {
    if (!this.isTarget()) return;

    const targetX = -this.target.style.x + this.screen.width / 2;
    const targetY = -this.target.style.y + this.screen.height / 2;
    this.updateOpts({
      x: targetX,
      y: targetY,
    });
  }

  interpolateToTarget() {
    if (!this.isTarget()) return;

    const targetX = -this.target.style.x + this.screen.width / 2;
    const targetY = -this.target.style.y + this.screen.height / 2;
    const dx = (targetX - this.style.x) * this.elasticity;
    this.style.x += dx;

    if (this.target.isGrounded()) {
      const dy = (targetY - this.style.y) * this.elasticity;
      this.style.y += dy;
    }
  }

  tick(dt) {
    if (!isGameActive()) return;
    if (this.target) this.interpolateToTarget();
  }
}
