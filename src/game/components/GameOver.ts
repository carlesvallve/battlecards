import animate from 'animate';
import View from 'ui/View';
import FixedTextView from 'src/lib/ui/FixedTextView';
import { getScreenDimensions } from 'src/lib/utils';

export default class Hud extends View {
  constructor(opts: { parent: View }) {
    super(opts);
    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();
    this.hud = opts.parent;

    this.createGameOverLabels();
  }

  createGameOverLabels() {
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

    this.continueLabel = new FixedTextView({
      parent: this,
      centerOnOrigin: true,
      centerAnchor: true,
      text: 'CONTINUE',
      color: '#ffffff',
      x: this.screen.width / 2,
      y: 0,
      width: 320,
      height: 100,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 2,
      strokeColor: '#000000',
      size: 20,
      autoFontSize: false,
      autoSize: false,
    });

    this.continueNumber = new FixedTextView({
      parent: this,
      centerOnOrigin: true,
      centerAnchor: true,
      text: '9',
      color: '#ffffff',
      x: this.screen.width / 2,
      y: 0,
      width: 320,
      height: 100,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 2,
      strokeColor: '#000000',
      size: 20,
      autoFontSize: false,
      autoSize: false,
    });

    this.hide();
  }

  init() {
    this.gameoverLabel.style.opacity = 0;
    this.continueLabel.style.opacity = 0;
    this.continueNumber.style.opacity = 0;
    this.gameoverLabel.show();
    this.continueLabel.show();
    this.continueNumber.show();

    const t = 350;
    const easing = animate.easeInOut;

    // gameover label
    let y = -24 + this.screen.height * 0.225;
    animate(this.gameoverLabel)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // continue label
    y = 28 + this.screen.height * 0.225;
    animate(this.continueLabel)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // continue number
    y = 72 + this.screen.height * 0.225;
    animate(this.continueNumber)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // countdown
    this.time = 9;
    this.continueNumber.setText(this.time.toString());
    this.interval = setInterval(() => {
      this.time -= 1;
      this.continueNumber.setText(this.time.toString());
      // back to game screen
      if (this.time === 0) {
        clearInterval(this.interval);
        this.hud.game.emit('game:end');
        return;
      }
    }, 500);
  }

  hide() {
    this.gameoverLabel.hide();
    this.continueLabel.hide();
    this.continueNumber.hide();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
