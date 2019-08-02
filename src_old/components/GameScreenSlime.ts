import pubsub from 'pubsub-js';

import sounds from 'src/lib/sounds';
import ImageScaleView from 'ui/ImageScaleView';
import InputView from 'src/game/ui/InputView';

import settings from 'src/conf/settings';
import World from 'src/game/components/World';
import Terrain from 'src/game/components/Terrain';
import Ninja from 'src/game/components/Ninja';
import Hud from 'src/game/components/Hud';
import EntityManager from 'src/game/components/EntityManager';
import Vector from 'src/lib/vector';
import { getScreenDimensions } from 'src/lib/utils';
import { onSwipe } from 'src/lib/swipe';
import level, { mapWidth } from 'src/conf/levels';
import { screen } from 'src/types/customTypes';
import StateObserver from 'src/redux/StateObserver';
import { setGameState } from 'src/redux/state/reducers/game';
import { isGameOver, isGamePaused, getCountdown } from 'src/redux/shortcuts';
import { selectScene } from 'src/redux/state/reducers/ui';

export default class GameScreenSlime extends InputView {
  screen: screen;
  world: World;
  ninja: Ninja;
  entityManager: EntityManager;

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

    // entities
    this.entityManager = new EntityManager({
      world: this.world,
      ninja: this.ninja,
    });

    // setup hud overlay
    const hud = new Hud({ parent: this });

    // setup game interaction
    this.setInput();

    // game events
    pubsub.subscribe('game:start', this.init.bind(this));
    pubsub.subscribe('game:end', this.endGame.bind(this));
  }

  endGame() {
    this.entityManager.reset();
    StateObserver.dispatch(selectScene('title'));
  }

  init() {
    StateObserver.dispatch(setGameState('Play'));
    sounds.playSong('dubesque');

    // reset entities
    this.entityManager.init();

    // reset ninja
    pubsub.publish('ninja:start');

    // reset hud
    pubsub.publish('hud:start');

    // init world animation
    pubsub.publish('world:start', { target: this.ninja });
  }

  // ======================== game input =======================

  setInput() {
    const inputView = new InputView({
      parent: this,
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
    // ninja move to tapped point
    if (this.ninja) {
      this.ninja.moveTo({
        x: x - this.world.style.x,
        y: y - this.world.style.y,
      });
    }
  }

  onSwipe(vec: Vector) {
    // ninja jump to swipe end point
    const d = 32;
    vec.multiplyScalar(d).limit(128);
    const pos = {
      x: this.ninja.style.x + vec.x,
      y: this.ninja.style.y + vec.y,
    };

    this.ninja.jumpTo(pos);
  }

  // ===================================================================
}
