import pubsub from 'pubsub-js';

import sounds from 'src/lib/sounds';
import PopupBasic from 'src/game/components/popups/PopupBasic';
import View from 'ui/View';
import i18n from 'src/lib/i18n/i18n';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { animateDefault } from 'src/lib/uiConfig';
import { waitForIt, clearWait } from 'src/lib/utils';
import StateObserver from 'src/redux/StateObserver';
import { setCountdown } from 'src/redux/state/reducers/user';
import { getCountdown } from 'src/redux/shortcuts';

export default class PopupContinue extends PopupBasic {
  container: View;
  titleLabel: BitmapFontTextView;
  continueLabel: BitmapFontTextView;
  continueNumber: BitmapFontTextView;
  waitInterval: object;

  constructor(opts) {
    super(opts);

    this.box.hide();
    this.baseY = 30 + this.bg.style.height / 6;

    this.container = new View({
      superview: this,
      x: this.screen.width / 2,
      y: 30 + this.screen.height / 6,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.titleLabel = new BitmapFontTextView({
      superview: this.container,
      text: i18n('hud.gameover'),
      x: 0,
      y: 0,
      align: 'center',
      verticalAlign: 'center',
      size: 44,
      color: '#CC0000',
      wordWrap: false,
      font: bitmapFonts('Body'),
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.continueLabel = new BitmapFontTextView({
      superview: this.container,
      text: i18n('hud.continue'),
      x: 0,
      y: 60,
      align: 'center',
      verticalAlign: 'center',
      size: 24,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts('Body'),
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.continueNumber = new BitmapFontTextView({
      superview: this.container,
      text: '9',
      x: 0,
      y: 100,
      align: 'center',
      verticalAlign: 'center',
      size: 32,
      color: '#fff',
      wordWrap: false,
      font: bitmapFonts('Body'),
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }

  init() {
    super.init();

    this.initCountdown();
    sounds.playSong('loose');

    animateDefault(this.container, {
      y: this.baseY,
      mode: 'in',
    });
  }

  close() {
    if (getCountdown() >= 9) return;
    super.close();

    clearWait(this.waitInterval);
    pubsub.publish('hud:continue');
    sounds.playSong('dubesque');

    animateDefault(this.container, {
      y: this.baseY,
      mode: 'out',
    });
  }

  initCountdown() {
    StateObserver.dispatch(setCountdown(9));
    this.continueNumber.text = getCountdown();
    this.updateCountdown();
  }

  updateCountdown() {
    this.waitInterval = {};
    this.waitInterval = waitForIt(() => {
      // decrease countdown
      StateObserver.dispatch(setCountdown(getCountdown() - 1));

      // render contdown
      const current = getCountdown();
      this.continueNumber.text = current === 0 ? '' : current;

      // end countdown
      if (current === 0) {
        clearWait(this.waitInterval);
        this.close();
        // end game
        pubsub.publish('game:end');
        return;
      }

      this.updateCountdown();
    }, 500);
  }
}
