import View from 'ui/View';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import { GameStates } from 'src/lib/enums';
import { rayCast } from 'src/lib/raycast';

export default class Entity extends View {
  constructor(opts: { parent: View; scale: number }) {
    super(opts);
    this.screen = getScreenDimensions();
    this.scale = opts.scale;
    this.game = opts.parent.game;
    this.parent = opts.parent;

    // initialize gravity and velocity
    this.gravity = 0.25;
    this.impulse = 10;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;

    debugPoint(this);
  }

  tick(dt) {
    if (this.game.gameState === GameStates.Pause) {
      return;
    }

    this.castRayDown(0);
    // this.castRayDown(1);
    // this.castRayDown(-1);
    this.castRayForward(0);

    if (this.grounded) {
      this.vy = 0;
    } else {
      this.gravity = 0.5;
      this.vy += this.gravity;
      this.style.y = this.style.y + this.vy;
    }
  }

  // ===============================================================
  // Raycasting logic
  // ===============================================================

  castRayDown(dx: number, debug: boolean = false) {
    if (this.vy < 0) {
      return;
    }

    const me = this.style;
    const up = 8;
    const forward = this.dir * 4 * dx;
    const offset = this.game.terrain.offset;

    const hit = rayCast(
      { x: me.x - forward, y: me.y - up }, // position,
      { x: 0, y: 1 }, // direction,
      128, // rayLength,
      offset,
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    if (hit && hit.distance <= up) {
      // set y to hit point and reset gravity vector
      me.y = hit.position.y;
      // this.vy = 0;
      this.grounded = true;
      this.emit('collision:ground');
    } else {
      // add gravity to velocity on y axis
      // this.gravity = 0.5;
      // this.vy += this.gravity;
      // me.y = me.y + this.vy;
      this.grounded = false;
    }
  }

  castRayForward(dy: number, debug: boolean = false) {
    const me = this.style;
    const d = 8;
    const up = 8;
    const offset = this.game.terrain.offset;

    const hit = rayCast(
      { x: me.x, y: me.y - up },
      { x: this.dir, y: 0 },
      16,
      offset,
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    if (hit && hit.distance <= d) {
      // check if we can climb forward
      const hasClimbed = this.castRayClimb(d);

      // stop moving if we cannot climb
      if (!hasClimbed) {
        // lock character x to hit point and apply bounce back
        me.x = hit.position.x - d * this.dir;

        this.emit('collision:wall');
        // // stop interpolating and animating character
        // animate(this).clear();
        // this.idle();
      }
    }
  }

  castRayClimb(dx: number, debug: boolean = false) {
    const me = this.style;
    const up = 24;
    const offset = this.game.terrain.offset;

    // check if we can climb to next step forward
    const hit = rayCast(
      { x: me.x + this.dir * 8, y: me.y - up },
      { x: 0, y: 1 },
      32,
      offset,
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    // if there is a platform and the distance is not to high, we can climb
    if (hit) {
      const dy = Math.abs(hit.position.y - me.y);
      if (dy <= 16) {
        // castRayDown will automatically put us on the upper platform
        // so just return hasClimbed value
        return true;
      }
    }

    return false;
  }
}
