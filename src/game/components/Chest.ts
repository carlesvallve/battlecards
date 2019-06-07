import View from 'ui/View';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import { getScreenDimensions, getRandomInt } from 'src/lib/utils';
import GameScreen from '../screens/GameScreen';
import Ninja from './Ninja';
import { screen } from 'src/lib/types';
import StateObserver from 'src/redux/StateObserver';
import { isGameActive, isNinjaDead } from 'src/redux/state/states';

export default class Chest extends View {
  sprite: ImageView;
  screen: screen;
  game: GameScreen;
  ninja: Ninja;
  gravity: number;
  impulse: number;
  vx: number;
  vy: number;
  sc: number;

  constructor(opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.sc = opts.sc;
    this.game = opts.parent.game;
    this.ninja = this.game.ninja;

    // initialize gravity and velocity
    this.gravity = 1.5;
    this.impulse = 24;
    this.vx = 0;
    this.vy = 0;

    // create chest sprite
    this.sprite = this.createSprite();

    this.style.x = opts.startX;
    this.style.y = opts.startY;
    this.vx = getRandomInt(-10, 10) * 0.5;
    this.vy = getRandomInt(-24, -12) * 0.75;
  }

  createSprite() {
    const size = 10;

    const sprite = new ImageView({
      parent: this,
      centerAnchor: true,
      width: size,
      height: size,
      x: 0,
      y: 0,
      scale: this.sc,
      image: new Image({ url: 'resources/images/8bit-ninja/chest-closed.png' }),
    });

    sprite.style.offsetX = -size / 2;
    sprite.style.offsetY = -size;

    return sprite;
  }

  tick(dt) {
    if (!isGameActive()) return;

    // uopdate sprite
    const me = this.style;

    // add gravity to velocity on y axis
    this.vy += this.gravity;

    // update position
    me.x += this.vx;
    me.y += this.vy;

    // check collision bottom
    const floorY = -4 + this.game.world.getFloorY(me.x);
    if (me.y + this.vy >= floorY) {
      me.y = floorY;
      this.vy = -this.vy * 0.8;
      this.vx *= 0.7;

      // check collision left
      const left = this.game.world.left;
      if (me.x + this.vx <= left) {
        this.die();
        return;
      }

      // // check collision right
      const right = this.game.world.right;
      if (me.x + this.vx >= right) {
        this.die();
        return;
      }
    }

    if (me.y === floorY) {
      this.checkNinjaDistance();
    }
  }

  checkNinjaDistance() {
    if (isNinjaDead()) return;

    const dist = Math.abs(this.style.x - this.ninja.style.x); // getDistanceBetweenViews(this, this.ninja);
    this.sprite.style.scale = this.sc;
    if (dist <= 12 * this.sc) {
      this.sprite.style.scale = 3;
      this.die();
    }
  }

  die() {
    this.game.emit('game:spawnStars', { chest: this });
    this.removeFromSuperview();
  }
}
