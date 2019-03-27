import animate from 'animate';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import { Actions } from 'src/lib/enums.js';
import { getScreenDimensions, getRandomInt, getDistanceBetweenViews } from 'src/lib/utils';
import sounds from 'src/lib/sounds';
import { GameStates } from 'src/lib/enums';
import { rayCast } from 'src/lib/raycast';


export default class Stars extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.sc = opts.sc;
    this.game = opts.parent.game;
    this.ninja = this.game.ninja;

    // initialize gravity and velocity
    this.gravity = 0.5;
    this.impulse = 16;
    this.vx = 0;
    this.vy = 0;
    this.rot = 1;

    // create explosion sprite particles
    this.sprites = [];
    for (let i = 0; i < opts.max; i++) {
      this.sprites.push(this.createSprite(opts));
    }
  }

  createSprite ({ startX, startY }) {
    const size = 6;

    const sprite = new ImageView({
      parent: this,
      x: startX,
      y: startY,
      width: size,
      height: size,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 1, // this.sc,
      image: new Image({ url: 'resources/images/8bit-ninja/star-yellow.png' }),
    });

    sprite.style.offsetX = -size / 2;
    sprite.style.offsetY = -size;

    sprite.vx = getRandomInt(-15, 15) * 0.5;
    sprite.vy = getRandomInt(-16, -4) * 0.75; // 0.75;

    sprite.action = Actions.Run;
    animate(sprite)
      .clear()
      .wait(300)
      .then(() => {
        if (sprite.action === Actions.Run) { sprite.action = Actions.Idle; }
      })
      .wait(3000)
      .then(() => {
        // this.die(sprite);
      });

    return sprite;
  }

  tick (dt) {
    if (this.game.gameState === GameStates.Pause) {
      return;
    }

    // update particles
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      const me = sprite.style;

      // kill particle if already gameover
      if (this.game.state === GameStates.GameOver) {
        this.die(sprite);
        continue;
      }

      // attract particle to ninja
      if (sprite.action === Actions.Die) {
        const vel = 0.5;
        const targetX = this.ninja.targetX || this.ninja.style.x;
        const dx = (targetX - me.x) * vel;
        const dy = (-7 + this.ninja.style.y - me.y) * vel;
        me.x += dx;
        me.y += dy;
        if (dx <= 1 && dy <= 1) {
          this.collect(sprite);
        }
        continue;
      }

      sprite.vx *= 0.99;
      me.x += sprite.vx;
      me.y += sprite.vy;
      this.castRayDown(sprite, 0);
      this.castRayForward(sprite, 0);

      // // add gravity to velocity on y axis
      // sprite.vy += this.gravity;

      // // update position
      // me.x += sprite.vx;
      // me.y += sprite.vy;

      // // check collision left
      // const left = this.game.ninja.style.x - this.screen.width / 2;
      // if (me.x + sprite.vx <= left) {
      //   me.x = 0;
      //   sprite.vx = -sprite.vx * 0.75;
      // }

      // // check collision right
      // const right = this.game.ninja.style.x + this.screen.width / 2;
      // if (me.x + sprite.vx >= right) {
      //   me.x = this.screen.width;
      //   sprite.vx = -sprite.vx * 0.75;
      // }

      // // check collision bottom
      // const floorY = this.game.world.getFloorY(me.x);
      // if (me.y + sprite.vy >= floorY) {
      //   me.y = floorY;
      //   sprite.vy = -sprite.vy * 0.9;
      //   sprite.vx *= 0.8;
      // }

      sprite.style.r += sprite.vx * 0.1; //  * 0.01;

      if (sprite.action === Actions.Idle) {
        this.checkNinjaDistance(sprite);
      }
    }
  }

  checkNinjaDistance (sprite) {
    if (this.ninja.action === Actions.Die) {
      return;
    }

    const dist = getDistanceBetweenViews(sprite, this.ninja);
    if (dist <= 16) {
      sprite.action = Actions.Die;
      // sounds.playSound('combo_x' + getRandomInt(2, 6), 0.4);
    }
  }

  collect (sprite) {
    this.removeSprite(sprite);
    sounds.playSound('combo_x' + getRandomInt(2, 6), 0.4);
    this.game.hud.emit('hud:updateStars', { ammount: 1 });
  }

  die (sprite) {
    animate(sprite).clear()
    .now({ scale: sprite.style.scale }, 0, animate.linear)
    .then({ scale: 0 }, 300, animate.linear)
    .then(() => {
      this.removeSprite(sprite);
    });
  }

  removeSprite (sprite) {
    sprite.removeFromSuperview();
    for (let i in this.sprites ){
      if (this.sprites[i] === sprite) {
        this.sprites.splice(i, 1);
        if (this.sprites.length === 0) {
          this.removeFromSuperview();
        }
        break;
      }
    }
  }

  castRayDown (sprite, dx, debug = false) {
    const me = sprite.style;
    const up = 3;
    const forward = 0;
    const offset = this.game.terrain.offset;

    const hit = rayCast(
      { x: me.x - forward, y: me.y - up },
      { x: 0, y: 1 },
      32,
      offset,
      debug ? { debugView: this.parent, duration: 100 } : {}
    );

    if (hit && hit.distance <= up) {
      // set y to hit point and reset gravity vector
      me.y = hit.position.y;
      sprite.vy = -sprite.vy * 0.75; // 0.4;
      sprite.grounded = true;
    } else {
      // add gravity to velocity on y axis
      sprite.vy += this.gravity;
      sprite.grounded = false;
    }
  }

  castRayForward (sprite, debug = false) {
    const me = sprite.style;
    const d = 3;
    const up = 3;
    const offset = this.game.terrain.offset;

    const hit = rayCast(
      { x: me.x, y: me.y -up },
      { x: this.vx > 0 ? 1 : -1, y: 0 },
      16,
      offset,
      debug ? { debugView: this.parent, duration: 100 } : {}
    );

    if (hit && hit.distance <= d) {
      sprite.vx = -sprite.vx * 0.9; // 0.75;
    }
  }
}
