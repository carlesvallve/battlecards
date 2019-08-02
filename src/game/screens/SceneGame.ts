import SceneBasic from './SceneBasic';
import sounds from 'src/lib/sounds';
import uiConfig from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions } from 'src/lib/utils';
import { navigateToScene } from 'src/redux/shortcuts/ui';
import { blink } from 'src/lib/animations';
import i18n from 'src/lib/i18n/i18n';

export default class SceneGame extends SceneBasic {
  startLabel: LangBitmapFontTextView;

  constructor() {
    super();
    this.createViews();
    this.createNavSelector('game');
  }

  protected init() {
    console.log('Init game');
    sounds.playSong('win');
    blink(this.startLabel, 350);
  }

  private createViews() {
    const screen = getScreenDimensions();

    const bg = new ButtonView({
      superview: this.container,
      x: 10,
      y: 10,
      width: screen.width - 20,
      height: screen.height - 20,
      backgroundColor: '#222',
      onClick: () => navigateToScene('title'),
    });

    this.startLabel = new LangBitmapFontTextView({
      superview: this.container,
      x: screen.width / 2,
      y: 80 + screen.height / 2,
      visible: false,
      ...uiConfig.bitmapFontText,
      font: bitmapFonts('Title'),
      localeText: () => i18n('title.start'),
      size: 12,
      color: '#eee',
    });

    const button = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonGreen, {
        superview: this.container,
        x: screen.width / 2,
        y: screen.height / 2,
        width: 160,
        height: 60,
        centerOnOrigin: true,

        localeText: () => 'Button',
        fontSize: 25,
        font: bitmapFonts('Title'),

        onClick: () => console.log('>>> clicked on button!'),

        // labelOffsetY: -1,
        // labelOffsetX: 20,
        // iconData: {
        //   url: 'resources/images/ui/buttons/icon_hud_coin.png',
        //   size: 0.6,
        //   x: -30,
        //   y: -2,
        // },
      }),
    );
  }
}
