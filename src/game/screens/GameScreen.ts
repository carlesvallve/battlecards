import animate from 'animate';
import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';
import InputView from 'src/lib/InputView';

import World from 'src/game/components/World';
import Terrain from 'src/game/components/Terrain';
import Ninja from 'src/game/components/Ninja';
import Slime from 'src/game/components/Slime';
import Chest from 'src/game/components/Chest';
import Stars from 'src/game/components/Stars';
import Explosion from 'src/game/components/Explosion';
import Hud from 'src/game/components/Hud';
import sounds from 'src/lib/sounds';

import { GameStates, Actions } from 'src/lib/enums';
import {
  getScreenDimensions,
  getRandomFloat,
  getRandomInt,
  getRandomItemFromArray } from 'src/lib/utils';
import Vector from '../../lib/vector';


export default class GameScreen extends View {
  constructor () {
    super({});
    this.screen = getScreenDimensions();
    this.generalScale = 1.75;

    // gameplay options
    this.options = {
      autoAttackMode: true,
      slimeSpawnDistance: 80,
      slimeSpawnDelay: 500,
    };

    // create bg
    this.bg = new ImageScaleView({
      superview: this,
      x: 0,
      y: 0,
      anchorX: 0,
      anchorY: 0,
      width: 3000,
      height: this.screen.height / 2,
      scale: 1,
      image: 'resources/images/bg/gradient.jpg',
      scaleMethod: 'tile',
      columns: 3,
    });

    // create world
    this.world = new World({
      parent: this,
      width: screen.width,
      height: screen.height,
    });

    // create terrain
    this.terrain = new Terrain({
      parent: this.world,
      zIndex: 997,
    });

    // create ninja
    this.ninja = new Ninja({
      parent: this.world,
      x: this.world.center,
      y: this.screen.height / 2,
      scale:this.generalScale,
    });

    // slimes
    this.slimes = [];
    this.stars = [];

    // setup game interaction overlay
    this.setInput();

    // setup hud overlay
    this.hud = new Hud({
      parent: this,
      x: 5,
      y: 5 + 30,
      width: this.screen.width - 10,
      height: this.screen.height - 10,
      zIndex: 999,
    });

    // game events
    this.on('game:start', this.init.bind(this));
    this.on('game:explosion', this.explosion.bind(this));
    this.on('game:spawnchest', this.spawnChest.bind(this));
    this.on('game:spawnstars', this.spawnStars.bind(this));
    this.on('game:gameover', this.gameOver.bind(this));
  }

  init () {
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
    this.world.init(this.ninja);

    // start spawning slimes
    animate({}).
      wait(this.options.slimeSpawnDelay)
      .then(() => {
        this.createSlime(this.world.getRandomPos());
      });
  }

  gameOver () {
    this.gameState = GameStates.GameOver;
    sounds.playSong('loose');
    this.hud.emit('hud:gameover');
  }

  createSlime (pos) {
    if (this.gameState === GameStates.Pause) {
      return;
    }

    // wait and create a new slime
    const delay = getRandomFloat(500, 1000);
    animate(this)
      .clear()
      .wait(delay)
      .then(() => {
        // create new slime
        if (this.ninja.action !== Actions.Die) {
          const slime = new Slime({
            parent: this.world,
            x: pos.x,
            y: pos.y,
            scale: this.generalScale,
            color: getRandomItemFromArray(['black', 'black', 'black', 'red']),
          });
          this.slimes.push(slime);
        }

        // recursevely iterate
        this.createSlime(this.world.getRandomPos());
      });
  }

  explosion ({ slime }) {
    // escape if no slime exist
    if (!slime) {
      return;
    }

    // create explosion particles
    new Explosion({
      parent: this.world,
      // backgroundColor: 'yellow', width: 20, height: 20,
      sc: this.generalScale * 0.9,
      max: getRandomInt(16, 32),
      startX: slime.style.x,
      startY: slime.style.y + 4 * this.generalScale,
      color: slime.color,
    });

    if (slime === this.ninja) {
      return;
    }

    // add score
    this.hud.emit('hud:updateScore', { points: slime.scorePoints });

    // remove slime
    slime.removeFromSuperview();
    this.removeSlimeFromArray(slime);
    slime = null;
  }

  removeSlimeFromArray (slime) {
    for (let i in this.slimes ){
      if (this.slimes[i] === slime) {
        this.slimes.splice(i, 1);
        break;
      }
    }
  }

  spawnChest ({ slime }) {
    // escape if no slime exist
    if (!slime) {
      return;
    }

    // create chest
    new Chest({
      parent: this.world,
      sc: this.generalScale,
      startX: slime.style.x,
      startY: slime.style.y + 4 * this.generalScale,
      color: slime.color,
    });
  }

  spawnStars ({ chest }) {
    // escape if no chest exist
    if (!chest) {
      return;
    }

    // create chest
    // new Stars({
    //   parent: this.world,
    //   sc: this.generalScale,
    //   startX: chest.style.x,
    //   startY: chest.style.y + 4 * this.generalScale,
    //   color: chest.color,
    // });

    new Stars({
      parent: this.world,
      backgroundColor: 'yellow', width: 20, height: 20,
      sc: this.generalScale,
      max: getRandomInt(1, 3),
      startX: chest.style.x,
      startY: chest.style.y + 4 * this.generalScale,
      color: chest.color,
    });
  }

  // ======================== game input =======================

  setInput () {
    this.inputView = new InputView({
      parent: this,
      zIndex: 998,
      width: this.screen.width,
      height: this.screen.height,
      dragThreshold: 0,
      // backgroundColor: 'rgba(1, 0, 0, 0.5)',
    });

    // this.inputView.style.backgroundColor = 'rgba(255, 0, 0, 0.5)',

    // set input handlers
    this.inputView.registerHandlerForTouch((x, y) => this.onTap(x, y));
    // this.inputView.registerHandlerForDoubleClick((x, y) => this.onDoubleClick(x, y));
    this.inputView.registerHandlerForDrag((x, y) => this.onDrag(x, y));
    // this.inputView.registerHandlerForDragFinish((dx, dy) => this.onDragFinish(dx, dy));
  }

  onTap (x, y) {
    // console.log('onTap', x, y);

    // clicking anywhere while paused will resume the game
    if (this.gameState === GameStates.Pause) {
      this.hud.onResume();
      // return;
    }

    // if we are in 'continue' screen
    if (this.gameState === GameStates.GameOver) {
      // actually, if we click here means we want to continue.
      // so respawn the ninja and refill one life!
      if (this.hud.gameOver.time <= 8) {
        this.gameState = GameStates.Play;
        this.ninja.emit('ninja:start');
        this.hud.emit('hud:continue');
        sounds.playSong('dubesque');
      }
      return;
    }

    // interact with the ninja
    if (this.ninja) {
      x = x - this.world.style.x;
      y = y - this.world.style.y;
      this.ninja.emit('ninja:moveTo', { x, y });
    }
  }

  // onDoubleClick (x, y) {
  //   console.log('doubleClick', x, y);
  //   if (this.ninja) {
  //     this.ninja.emit('ninja:jumpTo', { x, y });
  //   }
  // }

  onDrag (dx, dy) {
    // first attempt on jump feature
    const d = 16;
    const vec = new Vector(dx, dy).multiplyScalar(d).limit(64);
    const pos = {
      x: this.ninja.style.x + vec.x,
      y: this.ninja.style.y + vec.y,
    };

    this.ninja.jumpTo(pos);
  }

  // onDragFinish (dx, dy) {
  //   console.log('onDragFinish', dx, dy);
  // }

  // ===================================================================

}
