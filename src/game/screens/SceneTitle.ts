import SceneBasic from './SceneBasic';
import sounds from 'src/lib/sounds';
import uiConfig from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { blink } from 'src/lib/animations';
import { getScreenDimensions } from 'src/lib/utils';
import { navigateToScene } from 'src/redux/shortcuts/ui';
import i18n from 'src/lib/i18n/i18n';

export default class SceneTitle extends SceneBasic {
  startLabel: LangBitmapFontTextView;

  constructor() {
    super();
    this.createViews();
    this.createNavSelector('title');
  }

  protected init() {
    console.log('Init title');
    sounds.playSong('win');
    blink(this.startLabel, 350);
  }

  private createViews() {
    const screen = getScreenDimensions();
    console.log('dimensions:', screen.width, screen.height);

    const bg = new ButtonView({
      superview: this.container,
      backgroundColor: '#010101',
      width: screen.width,
      height: screen.height,
      onClick: () => navigateToScene('game'),
    });

    const fontName = 'Title';
    const dy = -80;

    const titleTop = new LangBitmapFontTextView({
      superview: this.container,
      x: screen.width / 2,
      y: dy + screen.height / 2,
      ...uiConfig.bitmapFontText,
      font: bitmapFonts(fontName),
      localeText: () => i18n('title.battle'),
      size: 64,
      color: '#444444',
    });

    const titleBottom = new LangBitmapFontTextView({
      superview: this.container,
      x: screen.width / 2,
      y: dy + 50 + screen.height / 2,
      ...uiConfig.bitmapFontText,
      localeText: () => i18n('title.cards'),
      font: bitmapFonts(fontName),
      size: 72,
      color: '#ddd',
    });

    this.startLabel = new LangBitmapFontTextView({
      superview: this.container,
      x: screen.width / 2,
      y: 80 + screen.height / 2,
      visible: false,
      ...uiConfig.bitmapFontText,
      font: bitmapFonts(fontName),
      localeText: () => i18n('title.start'),
      size: 12,
      color: '#eee',
    });
  }
}
