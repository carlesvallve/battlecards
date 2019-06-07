import animate from 'animate';
import ImageScaleView from 'ui/ImageScaleView';
import InputView from 'src/lib/ui/InputView';

import settings from 'src/conf/settings';

import World from 'src/game/components/World';
import Terrain from 'src/game/components/Terrain';
import Ninja from 'src/game/components/Ninja';
import Slime from 'src/game/components/Slime';
import Chest from 'src/game/components/Chest';
import Stars from 'src/game/components/Stars';
import Explosion from 'src/game/components/Explosion';
import Hud from 'src/game/components/Hud';
import sounds from 'src/lib/sounds';

import Vector from 'src/lib/vector';
import { GameStates, Actions } from 'src/lib/enums';
import {
  getScreenDimensions,
  getRandomFloat,
  getRandomInt,
  getRandomItemFromArray,
} from 'src/lib/utils';
import { onSwipe } from 'src/lib/swipe';
import level, { mapWidth } from 'src/conf/levels';
import { screen } from 'src/lib/types';
import Entity from '../components/Entity';
import StateObserver from 'src/redux/StateObserver';
import { addScore } from 'src/redux/state/reducers/user';

export default class GameScreen extends InputView {
  screen: screen;
  bg: ImageScaleView;
  world: World;
  terrain: Terrain;
  ninja: Ninja;
  slimes: any; // todo splice problem with Slime[];
  stars: Stars[];
  hud: Hud;
  gameState: string; // todo setup type
  inputView: InputView;

  constructor() {
    super({});
    this.screen = getScreenDimensions();

    // create bg
    const w = Math.max(mapWidth * level.tileSize, this.screen.width * 2); // 3000
    this.bg = new ImageScaleView({
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
    this.terrain = new Terrain({ parent: this.world });

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

    // setup game interaction
    this.setInput();

    // setup hud overlay
    this.hud = new Hud({ parent: this });

    // game events
    this.on('game:start', this.init.bind(this));
    this.on('game:explosion', this.explosion.bind(this));
    this.on('game:spawnchest', this.spawnChest.bind(this));
    this.on('game:spawnstars', this.spawnStars.bind(this));
    this.on('game:gameover', this.gameOver.bind(this));
  }

  init() {
    this.gameState = GameStates.Play;
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
    this.ninja.emit('ninja:start');

    // reset hud
    this.hud.emit('hud:start');

    // init world animation
    this.world.init();

    // start spawning slimes
    this.spawnSlimesSequence();
  }

  gameOver() {
    this.gameState = GameStates.GameOver;
    sounds.playSong('loose');
    this.hud.emit('hud:gameover');
  }

  spawnSlimesSequence() {
    if (this.gameState === GameStates.Pause) {
      return;
    }

    // wait and create a new slime
    const interval = settings.slimes.spawnInterval;
    const delay = getRandomFloat(interval[0], interval[1]);

    animate(this)
      .clear()
      .wait(delay)
      .then(() => {
        // create new slime
        if (this.ninja.action !== Actions.Die) {
          this.createSlime();
        }

        // recursevely iterate
        this.spawnSlimesSequence();
      });
  }

  createSlime() {
    const color = getRandomItemFromArray(['black', 'black', 'black', 'red']);
    const slime = new Slime({
      parent: this.world,
      x: 0,
      y: 0,
      scale: settings.worldScale,
      color,
    });
    this.slimes.push(slime);
  }

  explosion(opts: { entity: Entity }) {
    const { entity } = opts;

    // escape if no entity exist
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
    // this.hud.emit('hud:updateScore', { points: slime.scorePoints });
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

  spawnChest(opts: { entity: Entity }) {
    const { entity } = opts;

    // escape if no slime exist
    if (!entity) {
      return;
    }

    // create chest
    new Chest({
      parent: this.world,
      sc: settings.worldScale,
      startX: entity.style.x,
      startY: entity.style.y + 4 * settings.worldScale,
      color: entity.color,
    });
  }

  spawnStars(opts: { entity: Entity }) {
    const { entity } = opts;

    // escape if no chest exist
    if (!entity) {
      return;
    }

    new Stars({
      parent: this.world,
      max: getRandomInt(1, 3),
      startX: entity.style.x,
      startY: entity.style.y + 4 * settings.worldScale,
    });
  }

  // ======================== game input =======================

  setInput() {
    this.inputView = new InputView({
      parent: this,
      zIndex: 998,
      width: this.screen.width,
      height: this.screen.height,
      dragThreshold: 0,
    });

    onSwipe(this, 32, (v: Vector) => this.onSwipe(v));

    // set input handlers
    this.inputView.registerHandlerForTouch((x, y) => this.onTap(x, y));
    // this.inputView.registerHandlerForDoubleClick((x, y) => this.onDoubleClick(x, y));
    // this.inputView.registerHandlerForDrag((x, y) => this.onDrag(x, y));
    // this.inputView.registerHandlerForDragFinish((dx, dy) => this.onDragFinish(dx, dy));
  }

  onTap(x: number, y: number) {
    // if we are in 'continue' screen
    if (this.gameState === GameStates.GameOver) {
      // actually, if we click here means we want to continue.
      // so respawn the ninja and refill one life!
      if (this.hud.gameOver.time <= 8) {
        this.gameState = GameStates.Play;
        // this.world.init();
        this.ninja.emit('ninja:start');
        this.hud.emit('hud:continue');
        sounds.playSong('dubesque');
      }
      return;
    }

    // clicking anywhere while paused will resume the game
    if (this.gameState === GameStates.Pause) {
      this.hud.onResume();
    }

    // interact with the ninja
    if (this.ninja) {
      x = x - this.world.style.x;
      y = y - this.world.style.y;
      this.ninja.emit('ninja:moveTo', { x, y });
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
