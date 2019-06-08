import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import FixedTextView from 'src/lib/ui/FixedTextView';
import { getScreenDimensions } from 'src/lib/utils';
import { screen } from 'src/lib/customTypes';
import StateObserver from 'src/redux/StateObserver';
import { selectScene } from 'src/redux/state/reducers/ui';
import { setCountdown } from 'src/redux/state/reducers/user';
import { getCountdown } from 'src/redux/state/states';

export default class GameOver extends View {
  screen: screen;
  titleLabel: FixedTextView;
  continueLabel: FixedTextView;
  continueNumber: FixedTextView;
  interval: any; // todo: NodeJS.Timeout;

  constructor(opts: { parent: View }) {
    super(opts);
    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();

    this.createElements();
  }

  createElements() {
    this.titleLabel = new FixedTextView({
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
  }

  init() {
    sounds.playSong('loose');

    this.titleLabel.style.opacity = 0;
    this.continueLabel.style.opacity = 0;
    this.continueNumber.style.opacity = 0;
    this.titleLabel.show();
    this.continueLabel.show();
    this.continueNumber.show();

    const t = 350;
    const easing = animate.easeInOut;

    // gameover label
    let y = 35 - 24 + this.screen.height * 0.225;
    animate(this.titleLabel)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // continue label
    y = 35 + 28 + this.screen.height * 0.225;
    animate(this.continueLabel)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // continue number
    y = 30 + 72 + this.screen.height * 0.225;
    animate(this.continueNumber)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // countdown
    StateObserver.dispatch(setCountdown(9));
    this.continueNumber.setText(getCountdown().toString());

    this.interval = setInterval(() => {
      StateObserver.dispatch(setCountdown(getCountdown() - 1));
      this.continueNumber.setText(getCountdown().toString());
      // back to game screen
      if (getCountdown() === 0) {
        clearInterval(this.interval);
        StateObserver.dispatch(selectScene('title'));
        return;
      }
    }, 500);
  }

  hide() {
    this.titleLabel.hide();
    this.continueLabel.hide();
    this.continueNumber.hide();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
