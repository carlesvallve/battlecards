import View from 'ui/View';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import { rayCast } from 'src/lib/raycast';
import { screen } from 'src/types/customTypes';
import { isGameActive } from 'src/redux/shortcuts';

export default class Entity extends View {
  screen: screen;
  parent: View;
  scale: number;

  gravity: number;
  impulse: number;
  vx: number;
  vy: number;
  grounded: boolean;

  action: string;
  dir: number;
  speed: number;
  color: string;

  constructor(opts: { parent: any; scale: number }) {
    super(opts);
    this.screen = getScreenDimensions();
    this.parent = opts.parent;
    this.scale = opts.scale;

    // initialize gravity and velocity
    this.gravity = 0.25;
    this.impulse = 10;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;

    this.speed = 1;

    debugPoint(this);
  }

  onCollisionGround() {}

  onCollisionWall() {}

  tick(dt) {
    if (!isGameActive()) return;

    this.castRayDown(0);
    // this.castRayDown(1);
    // this.castRayDown(-1);
    this.castRayForward(0);

    if (this.grounded) {
      this.vy = 0;
    } else {
      // this.gravity = 0.5;
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

    const hit = rayCast(
      { x: me.x - forward, y: me.y - up }, // position,
      { x: 0, y: 1 }, // direction,
      128, // rayLength,
      { x: 0, y: 0 },
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    if (hit && hit.distance <= up) {
      // set y to hit point and reset gravity vector
      me.y = hit.position.y;
      // this.vy = 0;
      this.grounded = true;
      this.onCollisionGround();
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

    const hit = rayCast(
      { x: me.x, y: me.y - up },
      { x: this.dir, y: 0 },
      16,
      { x: 0, y: 0 },
      { enabled: debug, debugView: this.parent, duration: 100 },
    );

    if (hit && hit.distance <= d) {
      // check if we can climb forward
      const hasClimbed = this.castRayClimb(d);

      // stop moving if we cannot climb
      if (!hasClimbed) {
        // lock character x to hit point and apply bounce back
        me.x = hit.position.x - d * this.dir;
        this.onCollisionWall();
      }
    }
  }

  castRayClimb(dx: number, debug: boolean = false) {
    const me = this.style;
    const up = 24;

    // check if we can climb to next step forward
    const hit = rayCast(
      { x: me.x + this.dir * 8, y: me.y - up },
      { x: 0, y: 1 },
      32,
      { x: 0, y: 0 },
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

  isGrounded() {
    return this.grounded;
  }
}
