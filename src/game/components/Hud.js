import animate from 'animate';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import FixedTextView from 'src/lib/FixedTextView';
import InputView from 'src/lib/InputView';
import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';


export default class Hud extends View {
  constructor (opts) {
    super(opts);
    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();
    this.game = opts.parent;

    this.highscore = 0;
    this.score = 0;
    this.stars = 0;

    this.createStars();
    this.createScoreLabel();
    this.createGameOverView();
    this.createPauseButton();

    this.on('hud:start', this.init.bind(this));
    this.on('hud:updateScore', this.updateScore.bind(this));
    this.on('hud:updateStars', this.updateStars.bind(this));
    this.on('hud:removeHeart', this.removeHeart.bind(this));
    this.on('hud:gameover', this.gameOver.bind(this));
  }

  init () {
    const gameData = this.loadGameData();
    console.log('gameData:', gameData);
    this.stars = gameData.stars;
    this.highscore = gameData.highscore;

    this.score = 0;
    this.scoreLabel.setText(this.score.toString());
    this.starLabel.setText(this.stars.toString());
    this.createHearts(3);
    this.gameoverLabel.hide();
  }

  gameOver () {
    this.gameoverLabel.style.opacity = 0;
    this.gameoverLabel.show();

    const t = 350;
    const easing = animate.easeInOut;

    const y = 16 + this.screen.height * 0.25;

    animate(this.gameoverLabel)
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // save game data
    this.saveGameData();
  }

  saveGameData () {
    // save highscore and current stars to localstorage
    localStorage.setItem('gameData', JSON.stringify({
      stars: this.stars,
      highscore: this.score > this.highscore ? this.score : this.highscore,
    }));
  }

  loadGameData () {
    // Retrieve game data from local storage.
    const data = JSON.parse(localStorage.getItem('gameData'));
    return data || { stars: 0, highscore: 0 };
  }

  updateScore ({ points }) {
    const t = 100;
    const easing = animate.easeOut;

    animate(this.scoreLabel)
      .now({ scale: 1 }, 0, easing)
      .then({ scale: 1.6 }, t, easing)
      .then({ scale: 1.6 }, t, easing)
      .then(() => {
        this.score += points;
        this.scoreLabel.setText(this.score.toString());
      })
      .then({ scale: 1 }, t, easing);
  }

  updateStars ({ ammount }) {
    const t = 100;
    const easing = animate.easeOut;

    animate(this.starLabel)
      .now({ scale: 1 }, 0, easing)
      .then({ scale: 1.3 }, t, easing)
      .then({ scale: 1.3 }, t, easing)
      .then(() => {
        this.stars += ammount;
        this.starLabel.setText(this.stars.toString());
      })
      .then({ scale: 1 }, t, easing);
  }

  createStars () {
    new ImageView({ // star icon
      parent: this,
      x: 11,
      y: 11,
      width: 8,
      height: 8,
      centerOnOrigin: false,
      centerAnchor: false,
      scale: 1, // this.sc,
      image: new Image({ url: 'resources/images/8bit-ninja/star-yellow.png' }),
    });

    this.starLabel = new FixedTextView({
      parent: this,
      text: '0',
      color: '#fff',
      x: 26,
      y: 10,
      // width: 40,
      height: 12,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'left',
      verticalAlign: 'middle',
      strokeWidth: 0,
      strokeColor: '#000',
      size: 10,
      autoFontSize: false,
      autoSize: false,
      centerOnOrigin: false,
      centerAnchor: true,
    });
  }

  createScoreLabel () {
    new FixedTextView({ // score label
      parent: this,
      text: 'SCORE',
      color: '#fff',
      x: this.screen.width / 2,
      y: 10,
      // width: 40,
      height: 12,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 0,
      strokeColor: '#000',
      size: 10,
      autoFontSize: false,
      autoSize: false,
      centerOnOrigin: false,
      centerAnchor: true,
    });

    this.scoreLabel = new FixedTextView({
      parent: this,
      text: '000',
      color: '#fff',
      x: this.screen.width / 2,
      y: 40, // -72 + this.screen.height / 4,
      width: 320,
      height: 32,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 0,
      strokeColor: '#000',
      size: 20,
      autoFontSize: false,
      autoSize: false,
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }

  createGameOverView () {
    this.gameoverLabel = new FixedTextView({
      parent: this,
      centerOnOrigin: true,
      centerAnchor: true,
      text: 'GAME OVER',
      color: '#CC0000',
      x: this.screen.width / 2,
      y: 0,
      width: 320,
      height: 100,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 4,
      strokeColor: '#ff0000',
      size: 36,
      autoFontSize: false,
      autoSize: false,
    });

    this.gameoverLabel.hide();
  }

  createHearts (max) {
    this.hearts = [];
    for (let i = 0; i < max; i++) {
      const heart = new ImageView({
        parent: this,
        width: 16,
        height: 16,
        x: this.screen.width - 36 - 14 * i,
        y: -8,
        scale: 1.75,
      });

      heart.setImage(new Image({ url: 'resources/images/8bit-ninja/heart16.png' }));
      heart.show();

      this.hearts.push(heart);
    }
  }

  removeHeart () {
    const heart = this.hearts[this.hearts.length - 1];
    if (!heart) {
      return;
    }

    blink(heart, 50);
    animate(this)
      .wait(300)
      .then(() => {
        heart.removeFromSuperview();
        this.hearts.splice(this.hearts.length - 1, 1);
      });
  }

  createPauseButton () {
    // const button = new ImageView({
    //   parent: this,
    //   width: 16,
    //   height: 16,
    //   x: this.screen.width - 32,
    //   y: this.screen.height - 32,
    //   scale: 1.0,
    // });

    // button.setImage(new Image({ url: 'resources/images/hud/icon-pause.png' }));
    // button.show();

    // const inputView = new InputView({
    //   parent: this,
    //   width: 16,
    //   height: 16,
    //   x: this.screen.width - 32,
    //   y: this.screen.height - 32,
    //   dragThreshold: 0,
    //   backgroundColor: '#f00',
    // });

    // inputView.registerHandlerForTouch((x, y) => {
    //   console.log('Clicking on pause inputView...', e, localPt);
    // });

    // button.onInputSelect = (e, localPt) => {
    //   console.log('Clicking on pause button...', e, localPt);
    // };

    // console.log('>>>', button);
  }
}
