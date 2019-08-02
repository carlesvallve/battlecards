import SceneBasic from './SceneBasic';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions } from 'src/lib/utils';

export default class GameScreen extends SceneBasic {
  startLabel: BitmapFontTextView;

  constructor() {
    super();
    this.createViews();
    this.createNavSelector('game');
  }

  protected init() {
    console.log('Init game');
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
      backgroundColor: 'pink',
    });

    const fontName = 'Body';
    const dy = 110;

    this.startLabel = new BitmapFontTextView({
      superview: this.container,
      text: 'THis is the game scene',
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
