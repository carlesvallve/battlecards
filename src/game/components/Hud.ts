import pubsub from 'pubsub-js';

import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';
import { screen } from 'src/lib/customTypes';
import GameOver from 'src/game/components/GameOver';

import StateObserver from 'src/redux/StateObserver';
import {
  setHighscore,
  setScore,
  setStars,
  setHearts,
} from 'src/redux/state/reducers/user';
import { setGameState } from 'src/redux/state/reducers/game';
import { isGamePaused } from 'src/redux/state/states';
import settings from 'src/conf/settings';

export default class Hud extends View {
  screen: screen;
  hearts: ImageView[];
  gameOver: GameOver;
  starLabel: BitmapFontTextView;
  scoreLabel: BitmapFontTextView;
  pauseLabel: BitmapFontTextView;
  pauseButton: ButtonView;

  constructor(opts: { parent: View }) {
    super(opts);

    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();

    this.updateOpts({
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      width: this.screen.width - 0,
      height: this.screen.height - 0,
      zIndex: 999,
    });

    this.createStars(35);
    this.createScoreLabel(35);
    this.createPauseButton();

    this.gameOver = new GameOver({ parent: this });

    pubsub.subscribe('hud:start', this.init.bind(this));
    pubsub.subscribe('hud:continue', this.continue.bind(this));
    pubsub.subscribe('hud:gameover', this.onGameOver.bind(this));

    // score
    StateObserver.createSelector((state) => state.user.score).addListener(
      (score) => {
        // console.log('score:', score);
        this.onUpdateScore(score);
      },
    );

    // stars
    StateObserver.createSelector((state) => state.user.stars).addListener(
      (stars) => {
        // console.log('stars:', stars);
        this.onUpdateStars(stars);
      },
    );

    // hearts
    StateObserver.createSelector((state) => state.user.hearts).addListener(
      (hearts) => {
        // console.log('hearts:', hearts);
        this.onUpdateHearts(hearts);
      },
    );

    // game states (play / pause/ gameover)
    StateObserver.createSelector((state) => state.game.gameState).addListener(
      (gameState) => {
        switch (gameState) {
          case 'Play':
            this.onResume();
            break;
          case 'Pause':
            this.onPause();
            break;
          case 'GameOver':
            this.onGameOver();
            break;
        }
      },
    );
  }

  init() {
    const gameData = this.loadGameData();
    console.log('gameData:', gameData);
    StateObserver.dispatch(setScore(0));
    StateObserver.dispatch(setHighscore(gameData.highscore || 0));
    StateObserver.dispatch(setStars(gameData.stars || 0));

    this.scoreLabel.text = '0';
    this.createHearts(settings.user.maxHearts, 35);

    this.gameOver.hide();
    this.pauseButton.show();
  }

  continue() {
    this.createHearts(1);
    this.gameOver.hide();
    this.pauseButton.show();
  }

  // =====================================================================
  // Hud Events (pause, resume, score, stars, hearts, gameOver)
  // =====================================================================

  onPause() {
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.pauseLabel.show();
  }

  onResume() {
    // todo: this happens more often than when it should...
    this.style.backgroundColor = null;
    this.pauseLabel.hide();
  }

  onUpdateScore(score: number) {
    const t = 100;
    const easing = animate.easeOut;

    animate(this.scoreLabel)
      .now({ scale: 1 }, 0, easing)
      .then({ scale: 1.6 }, t, easing)
      .then({ scale: 1.6 }, t, easing)
      .then(() => {
        this.scoreLabel.text = score;
      })
      .then({ scale: 1 }, t, easing);
  }

  onUpdateStars(stars: number) {
    const t = 100;
    const easing = animate.easeOut;

    animate(this.starLabel)
      .now({ scale: 1 }, 0, easing)
      .then({ scale: 1.3 }, t, easing)
      .then({ scale: 1.3 }, t, easing)
      .then(() => {
        this.starLabel.text = stars;
      })
      .then({ scale: 1 }, t, easing);
  }

  onUpdateHearts(hearts: number) {
    if (!this.hearts) return;
    if (this.hearts.length === 0) return;
    if (hearts >= this.hearts.length) return;

    // remove heart
    const heart = this.hearts[this.hearts.length - 1];
    blink(heart, 50);
    animate(this)
      .wait(300)
      .then(() => {
        heart.removeFromSuperview();
        this.hearts.splice(this.hearts.length - 1, 1);
      });
  }

  onGameOver() {
    this.saveGameData();
    this.gameOver.init();
    this.pauseButton.hide();
  }

  // =====================================================================
  // Create hud header elements (stars, score, hearts)
  // =====================================================================

  createStars(dy: number) {
    const fontName = 'Body';

    const starIcon = new ImageView({
      parent: this,
      x: 11,
      y: dy + 11,
      width: 8,
      height: 8,
      centerOnOrigin: false,
      centerAnchor: false,
      scale: 1,
      image: new Image({ url: 'resources/images/8bit-ninja/star-yellow.png' }),
    });

    this.starLabel = new BitmapFontTextView({
      // backgroundColor: 'grey',
      // width: 320,
      superview: this,
      x: 26,
      y: dy + 10,
      height: 12,
      horizontalAlign: 'left',
      verticalAlign: 'center',
      size: 10,
      color: '#fff',
      strokeColor: '#000',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerAnchor: true,
    });
  }

  createScoreLabel(dy: number) {
    const fontName = 'Body';

    const scoreTitle = new BitmapFontTextView({
      // backgroundColor: 'pink',
      superview: this,
      text: 'SCORE',
      x: 2 + this.screen.width / 2,
      y: dy + 17,
      height: 12,
      align: 'center',
      verticalAlign: 'center',
      size: 10,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.scoreLabel = new BitmapFontTextView({
      superview: this,
      x: this.screen.width / 2,
      y: dy + 40,
      height: 32,
      align: 'center',
      verticalAlign: 'center',
      size: 20,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }

  createHearts(amount: number, dy = 35) {
    StateObserver.dispatch(setHearts(amount));

    this.hearts = [];
    for (let i = 0; i < amount; i++) {
      const heart = new ImageView({
        parent: this,
        width: 16,
        height: 16,
        x: this.screen.width - 36 - 14 * i,
        y: dy - 8,
        scale: 1.75,
        image: new Image({ url: 'resources/images/8bit-ninja/heart16.png' }),
        visible: true,
      });

      this.hearts.push(heart);
    }
  }

  // =====================================================================
  // Create hud footer elements (pause)
  // =====================================================================

  createPauseButton() {
    const fontName = 'Body';

    this.pauseLabel = new BitmapFontTextView({
      superview: this,
      text: 'PAUSE',
      x: this.screen.width / 2,
      y: 5 + this.screen.height / 4,
      align: 'center',
      verticalAlign: 'center',
      size: 44,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerOnOrigin: true,
      centerAnchor: true,
      visible: false,
    });

    this.pauseButton = new ButtonView({
      parent: this,
      image: new Image({ url: 'resources/images/hud/icon-pause.png' }),
      width: 24,
      height: 24,
      x: this.screen.width - 40,
      y: this.screen.height - 72 + 30,
      scale: 1.0,
      onClick: () => {
        if (isGamePaused()) {
          StateObserver.dispatch(setGameState('Play'));
        } else {
          StateObserver.dispatch(setGameState('Pause'));
        }
      },
    });
  }

  // =====================================================================
  // Load and save game data
  // =====================================================================

  saveGameData() {
    // save highscore and current stars to localstorage
    const { score, highscore, stars } = StateObserver.getState().user;

    localStorage.setItem(
      'gameData',
      JSON.stringify({
        stars,
        highscore: score > highscore ? score : highscore,
      }),
    );
  }

  loadGameData() {
    // Retrieve game data from local storage.
    const data = JSON.parse(localStorage.getItem('gameData'));
    return data || { stars: 0, highscore: 0 };
  }
}
