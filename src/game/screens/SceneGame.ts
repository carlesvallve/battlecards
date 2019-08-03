import SceneBasic from './SceneBasic';
import uiConfig from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions } from 'src/lib/utils';
import { navigateToScene } from 'src/redux/shortcuts/ui';
import Card from '../components/cards/Card';
import Label from '../components/ui/Label';
import { getRandomColor } from 'src/lib/colors';

export default class SceneGame extends SceneBasic {
  private counter: number = 0;

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

    const bg = new ButtonView({
      superview: this.container,
      x: 10,
      y: 10,
      width: screen.width - 20,
      height: screen.height - 20,
      backgroundColor: '#222',
      onClick: () => navigateToScene('title'),
    });

    const title = new Label({
      superview: this.container,
      x: screen.width / 2,
      y: 40,
      ...uiConfig.bitmapFontText,
      localeText: () => 'Battle Start',
      size: 32,
      color: '#eee',
    })

    const card = new Card({
      superview: this.container,
      id: 'airForce',
      x: screen.width / 2,
      y: screen.height / 2,
    });

    const label = new Label({
      superview: this.container,
      localeText: () => this.counter.toString(),
      x: screen.width / 2,
      y: screen.height / 2 - 20,
      size: 20,
      color: 'yellow',
    });

    const button = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonGreen, {
        superview: this.container,
        x: screen.width / 2,
        y: screen.height - 50,
        width: 100,
        height: 50,
        centerOnOrigin: true,
        labelOffsetY: -2,
        localeText: () => 'FLIP',
        size: 16,
        font: bitmapFonts('Title'),
        onClick: () => {
          // card.flip();

          this.counter++;
          label.setProps({
            localeText: () => this.counter.toString(),
            color: getRandomColor(),
            x: screen.width / 2 - 50 + Math.random() * 100,
            y: screen.height / 2 - 50 + Math.random() * 100,
            // size: Math.random() * 50,
          });
          
        },

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
