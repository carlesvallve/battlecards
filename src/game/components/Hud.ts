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

import StateObserver from 'src/redux/StateObserver';
import {
  setHighscore,
  setScore,
  setStars,
  setHearts,
} from 'src/redux/state/reducers/user';
import { setGameState } from 'src/redux/state/reducers/game';
import {
  isGamePaused,
  getStars,
  openPopup,
  closePopup,
  isNinjaDead,
} from 'src/redux/shortcuts';
import settings from 'src/conf/settings';
import i18n from 'src/lib/i18n/i18n';

export default class Hud extends View {
  screen: screen;
  hearts: ImageView[];
  starLabel: BitmapFontTextView;
  scoreLabel: BitmapFontTextView;
  pauseButton: ButtonView;

  constructor(opts: { parent: View }) {
    super(opts);

    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();

    this.updateOpts({
      backgroundColor: null, // 'rgba(255, 0, 0, 0.7)',
      width: this.screen.width,
      height: this.screen.height,
      zIndex: 100,
    });

    this.createStars(35);
    this.createScoreLabel(35);
    this.createPauseButton();

    pubsub.subscribe('hud:start', this.init.bind(this));
    pubsub.subscribe('hud:gameover', this.onGameOver.bind(this));
    pubsub.subscribe('hud:continue', this.onContinue.bind(this));

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

    // game states (play / pause / gameover)
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
    // load game data
    const gameData = this.loadGameData();
    console.log('gameData:', gameData);

    // init score, highsore, stars, hearts
    StateObserver.dispatch(setScore(0));
    StateObserver.dispatch(setHighscore(gameData.highscore || 0));
    StateObserver.dispatch(setStars(gameData.stars || 0));

    // refresh ui immediately
    this.scoreLabel.text = 0;
    this.starLabel.text = getStars();
    this.createHearts(settings.user.maxHearts, 35);
  }

  // =====================================================================
  // Hud Events (score, stars, hearts, pause, resume, gameOver, continue)
  // =====================================================================

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

  onPause() {
    openPopup('pause');
  }

  onResume() {
    closePopup('pause');
  }

  onGameOver() {
    this.saveGameData();
    openPopup('continue');
  }

  onContinue() {
    this.createHearts(1);
    StateObserver.dispatch(setGameState('Play'));
    pubsub.publish('ninja:start');
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
      size: 11,
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
      superview: this,
      text: i18n('hud.score'),
      x: 1 + this.screen.width / 2,
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

  createPauseButton() {
    this.pauseButton = new ButtonView({
      parent: this,
      image: new Image({ url: 'resources/images/ui/icon-pause.png' }),
      width: 28,
      height: 24,
      x: this.screen.width - 40,
      y: this.screen.height - 72 + 30,
      onClick: () => {
        if (!isGamePaused() && !isNinjaDead()) {
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
