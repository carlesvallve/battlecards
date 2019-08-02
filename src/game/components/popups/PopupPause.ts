import PopupBasic from 'src/game/components/popups/PopupBasic';
import i18n from 'src/lib/i18n/i18n';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import StateObserver from 'src/redux/StateObserver';
import { setGameState } from 'src/redux/state/reducers/game';
import { animateDefault } from 'src/lib/uiConfig';

export default class PopupPause extends PopupBasic {
  pauseLabel: BitmapFontTextView;

  constructor(opts) {
    super(opts);

    // this.box.hide();
    // this.baseY = 20 + this.screen.height / 4;

    // this.pauseLabel = new BitmapFontTextView({
    //   superview: this,
    //   text: i18n('hud.pause'),
    //   x: screen.width / 2,
    //   y: this.baseY,
    //   align: 'center',
    //   verticalAlign: 'center',
    //   size: 44,
    //   color: '#fff',
    //   wordWrap: false,
    //   font: bitmapFonts('Body'),
    //   centerOnOrigin: true,
    //   centerAnchor: true,
    // });
  }

  init() {
    super.init();

    // animateDefault(this.pauseLabel, {
    //   y: this.baseY,
    //   mode: 'in',
    // });
  }

  close() {
    super.close();

    // animateDefault(this.pauseLabel, {
    //   y: this.baseY,
    //   mode: 'out',
    // });
  }
}
