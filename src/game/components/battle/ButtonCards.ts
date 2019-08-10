import animate from 'animate';
import View from 'ui/View';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import StateObserver from 'src/redux/StateObserver';
import { updateTurn } from 'src/redux/shortcuts/combat';

type Props = { superview: View; x: number; y: number };

export default class ButtonCards {
  private button: ButtonScaleViewWithText;
  private props: Props;
  private container: View;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  private createViews(props: Props) {
    this.container = new View({
      ...props,
      // backgroundColor: 'yellow',
      width: 60,
      height: 70,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.button = new ButtonScaleViewWithText({
      ...uiConfig.buttonMenu,
      superview: this.container,
      width: 60,
      height: 70,
      labelOffsetY: -3,
      localeText: () => '',
      size: 16,
      font: bitmapFonts('TitleStroke'),
      // iconData: {
      //   url: 'resources/images/ui/icons/cards.png',
      //   size: 0.6,
      //   x: 0,
      //   y: -1,
      // },
      onClick: () => {
        // updateTurn();
      },
    });
  }
}
