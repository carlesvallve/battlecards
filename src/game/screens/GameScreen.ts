import pubsub from 'pubsub-js';

import sounds from 'src/lib/sounds';
import ImageScaleView from 'ui/ImageScaleView';
import InputView from 'src/game/ui/InputView';

import settings from 'src/conf/settings';

import World from 'src/game/components/World';
import Terrain from 'src/game/components/Terrain';
import Ninja from 'src/game/components/Ninja';
import Slime from 'src/game/components/Slime';
import Stars from 'src/game/components/Stars';
import Explosion from 'src/game/components/Explosion';
import Hud from 'src/game/components/Hud';
import Vector from 'src/lib/vector';

import {
  getScreenDimensions,
  getRandomFloat,
  getRandomInt,
  getRandomItemFromArray,
  waitForIt,
  clearWait,
} from 'src/lib/utils';
import { onSwipe } from 'src/lib/swipe';
import level, { mapWidth } from 'src/conf/levels';
import { screen } from 'src/lib/customTypes';
import Entity from '../components/Entity';
import StateObserver from 'src/redux/StateObserver';
import { addScore } from 'src/redux/state/reducers/user';
import { setGameState } from 'src/redux/state/reducers/game';
import {
  isGameOver,
  isGamePaused,
  isNinjaDead,
  getCountdown,
} from 'src/redux/state/states';
import { selectScene } from 'src/redux/state/reducers/ui';

export default class GameScreen extends InputView {
  screen: screen;
  world: World;
  ninja: Ninja;
  slimes: any; // todo splice problem with Slime[];
  stars: Stars[];
  waitInterval: object;

  constructor() {
    super({});
    this.screen = getScreenDimensions();

    // create bg
    const w = Math.max(mapWidth * level.tileSize, this.screen.width * 2);
    const bg = new ImageScaleView({
      superview: this,
      x: 0,
      y: 0,
      anchorX: 0,
      anchorY: 0,
      width: w,
      height: this.screen.height * 2,
      image: 'resources/images/bg/gradient.jpg',
    });

    // create world
    this.world = new World({ parent: this });

    // create terrain
    const terrain = new Terrain({ parent: this.world });

    // create ninja
    this.ninja = new Ninja({
      parent: this.world,
      x: level.start.x * level.tileSize,
      y: level.start.y * level.tileSize,
      scale: settings.worldScale,
    });

    // slimes
    this.slimes = [];
    this.stars = [];

    // setup hud overlay
    const hud = new Hud({ parent: this });

    // setup game interaction
    this.setInput();

    // game events
    pubsub.subscribe('game:start', this.init.bind(this));
    pubsub.subscribe('game:end', this.endGame.bind(this));
    pubsub.subscribe('game:explosion', this.explosion.bind(this));
    pubsub.subscribe('game:spawnstars', this.spawnStars.bind(this));
  }

  endGame() {
    clearWait(this.waitInterval);
    StateObserver.dispatch(selectScene('title'));
  }

  init() {
    StateObserver.dispatch(setGameState('Play'));
    sounds.playSong('dubesque');

    // reset slimes
    for (let i = 0; i < this.slimes.length; i++) {
      this.slimes[i].removeFromSuperview();
    }
    this.slimes = [];

    // reset stars
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].removeFromSuperview();
    }
    this.stars = [];

    // reset ninja
    pubsub.publish('ninja:start');

    // reset hud
    pubsub.publish('hud:start');

    // init world animation
    pubsub.publish('world:start', { target: this.ninja });

    // start spawning slimes
    this.spawnSlimesSequence();
  }

  spawnSlimesSequence() {
    // console.log('spawning slimes...');

    // wait and create a new slime
    this.waitInterval = {};
    const range = settings.slimes.spawnInterval;
    const delay = getRandomFloat(range[0], range[1]);

    waitForIt(
      () => {
        // create new slime
        if (!isGamePaused() && !isNinjaDead()) {
          this.createSlime();
        }

        // recursevely iterate
        this.spawnSlimesSequence();
      },
      delay,
      this.interval,
    );
  }

  createSlime() {
    const color = getRandomItemFromArray(['black', 'black', 'black', 'red']);
    const slime = new Slime({
      parent: this.world,
      ninja: this.ninja,
      scale: settings.worldScale,
      color,
    });
    this.slimes.push(slime);
  }

  explosion(evt: string, opts: { entity: Entity }) {
    const { entity } = opts;
    if (!entity) return;

    // create explosion particles
    new Explosion({
      parent: this.world,
      sc: settings.worldScale * 0.9,
      max: getRandomInt(16, 32),
      startX: entity.style.x,
      startY: entity.style.y + 4 * settings.worldScale,
      color: entity.color,
    });

    if (entity === this.ninja) return;

    const slime = <Slime>entity;

    // add score
    StateObserver.dispatch(addScore(slime.scorePoints));

    // remove slime
    slime.removeFromSuperview();
    this.removeSlimeFromArray(slime);
  }

  removeSlimeFromArray(slime) {
    for (let i in this.slimes) {
      if (this.slimes[i] === slime) {
        this.slimes.splice(i, 1);
        break;
      }
    }
  }

  spawnStars(evt: string, opts: { entity: Entity }) {
    const { entity } = opts;
    if (!entity) return;

    new Stars({
      parent: this.world,
      ninja: this.ninja,
      max: getRandomInt(1, 3),
      startX: entity.style.x,
      startY: entity.style.y + 4 * settings.worldScale,
    });
  }

  // ======================== game input =======================

  setInput() {
    const inputView = new InputView({
      parent: this,
      zIndex: 998,
      width: this.screen.width,
      height: this.screen.height,
      dragThreshold: 0,
    });

    onSwipe(this, 32, (v: Vector) => this.onSwipe(v));

    // set input handlers
    inputView.registerHandlerForTouch((x, y) => this.onTap(x, y));
    // inputView.registerHandlerForDoubleClick((x, y) => this.onDoubleClick(x, y));
    // inputView.registerHandlerForDrag((x, y) => this.onDrag(x, y));
    // inputView.registerHandlerForDragFinish((dx, dy) => this.onDragFinish(dx, dy));
  }

  onTap(x: number, y: number) {
    // console.log('onTap', x, y);

    // if we are in gameover mode, continue playing
    if (isGameOver()) {
      if (getCountdown() <= 8) {
        StateObserver.dispatch(setGameState('Play'));
        pubsub.publish('ninja:start');
        pubsub.publish('hud:continue');
        sounds.playSong('dubesque');
      }
      return;
    }

    // clicking anywhere while paused will resume the game
    if (isGamePaused()) {
      StateObserver.dispatch(setGameState('Play'));
    }

    // interact with the ninja
    if (this.ninja) {
      this.ninja.moveTo({
        x: x - this.world.style.x,
        y: y - this.world.style.y,
      });
    }
  }

  onSwipe(vec: Vector) {
    const d = 32;
    vec.multiplyScalar(d).limit(128);

    // console.log(vec);
    const pos = {
      x: this.ninja.style.x + vec.x,
      y: this.ninja.style.y + vec.y,
    };

    this.ninja.jumpTo(pos);
  }

  // ===================================================================
}
