import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import View from 'ui/View';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import { getScreenDimensions } from 'src/lib/utils';

export default class BattleFooter extends Basic {
  private text: LangBitmapFontTextView;

  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    const screen = getScreenDimensions();

    this.container.updateOpts({
      backgroundColor: 'rgba(255, 128, 128, 0.5)',
      width: screen.width,
      height: 70,

      // x: screen.width / 2,
      y: screen.height - 70,
    });

    const buttonDraw = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonMenu, {
        superview: this.container,
        x: 35,
        y: 35,
        width: 50,
        height: 50,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => '24',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        onClick: () => {},

        // iconData: {
        //   url: 'resources/images/ui/buttons/icon_cards.png',
        //   size: 0.6,
        //   x: 0,
        //   y: -2,
        // },
      }),
    );

    const buttonAction = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonMenu, {
        superview: this.container,
        x: this.container.style.width - 35,
        y: 35,
        width: 50,
        height: 50,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => 'A',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        onClick: () => {},

        // iconData: {
        //   url: 'resources/images/ui/buttons/icon_cards.png',
        //   size: 0.6,
        //   x: 0,
        //   y: -2,
        // },
      }),
    );

    // this.text = new LangBitmapFontTextView({
    //   ...uiConfig.bitmapFontText,
    //   ...props,
    //   superview: this.container,
    //   font: bitmapFonts('TitleStroke'),

    //   x: 0,
    //   y: -props.size / 2,
    // });
  }
}
