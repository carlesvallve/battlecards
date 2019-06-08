import pubsub from 'pubsub-js';

import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions, waitForIt, clearWait } from 'src/lib/utils';
import { screen } from 'src/lib/customTypes';
import StateObserver from 'src/redux/StateObserver';
import { setCountdown } from 'src/redux/state/reducers/user';
import { getCountdown } from 'src/redux/state/states';
import i18n from 'src/lib/i18n/i18n';

export default class GameOver extends View {
  screen: screen;
  titleLabel: BitmapFontTextView;
  continueLabel: BitmapFontTextView;
  continueNumber: BitmapFontTextView;

  constructor(opts: { parent: View }) {
    super(opts);
    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();

    this.createElements();
    this.hide();
  }

  createElements() {
    const fontName = 'Body';

    this.titleLabel = new BitmapFontTextView({
      superview: this,
      text: i18n('hud.gameover'),
      x: this.screen.width / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 44,
      color: '#CC0000',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.continueLabel = new BitmapFontTextView({
      superview: this,
      text: i18n('hud.continue'),
      x: this.screen.width / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 20,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.continueNumber = new BitmapFontTextView({
      superview: this,
      x: this.screen.width / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 32,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts(fontName),
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }

  init() {
    sounds.playSong('loose');

    const t = 350;
    const easing = animate.easeInOut;

    // gameover label
    this.titleLabel.updateOpts({ visible: true, opacity: 0 });
    let y = -10 + this.screen.height * 0.225;
    animate(this.titleLabel)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // continue label
    this.continueLabel.updateOpts({ visible: true, opacity: 0 });
    y = 53 + this.screen.height * 0.225;
    animate(this.continueLabel)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // continue number
    this.continueNumber.updateOpts({ visible: true, opacity: 0 });
    y = 90 + this.screen.height * 0.225;
    animate(this.continueNumber)
      .clear()
      .now({ y: y + 10, opacity: 0 }, 0, easing)
      .then({ y: y + 0, opacity: 1 }, t, easing);

    // countdown
    StateObserver.dispatch(setCountdown(9));
    this.continueNumber.text = getCountdown();
    this.updateCountdown();
  }

  updateCountdown() {
    waitForIt(
      () => {
        // decrease countdown
        StateObserver.dispatch(setCountdown(getCountdown() - 1));

        // render contdown
        const current = getCountdown();
        this.continueNumber.text = current;

        // end countdown
        if (current === 0) {
          clearWait(this);
          // end game
          pubsub.publish('game:end');
          return;
        }

        this.updateCountdown();
      },
      500,
      this,
    );
  }

  hide() {
    this.titleLabel.hide();
    this.continueLabel.hide();
    this.continueNumber.hide();
    clearWait(this);
  }
}
