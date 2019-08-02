import SceneBasic from './SceneBasic';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';
import i18n from 'src/lib/i18n/i18n';

export default class TitleScreen extends SceneBasic {
  startLabel: BitmapFontTextView;

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

    const bg = new View({
      superview: this.container,
      x: 10,
      y: 10,
      width: screen.width - 20,
      height: screen.height - 20,
      backgroundColor: '#010101',
    });

    const fontName = 'Title';
    const dy = 110;

    const titleTop = new BitmapFontTextView({
      superview: this.container,
      text: i18n('title.battle'),
      x: screen.width / 2,
      y: -dy + screen.height / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 64,
      color: '#CC0000',
      strokeColor: '#ff0000',
      wordWrap: false,
      font: bitmapFonts(fontName),
    });

    const titleBottom = new BitmapFontTextView({
      superview: this.container,
      text: i18n('title.cards'),
      x: screen.width / 2,
      y: -dy + 50 + screen.height / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 72,
      color: '#ddd',
      wordWrap: false,
      font: bitmapFonts(fontName),
    });

    this.startLabel = new BitmapFontTextView({
      superview: this.container,
      text: i18n('title.start'),
      x: screen.width / 2,
      y: 200 - dy + screen.height / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 12,
      color: '#eee',
      wordWrap: false,
      font: bitmapFonts(fontName),
      visible: false,
    });
  }
}
