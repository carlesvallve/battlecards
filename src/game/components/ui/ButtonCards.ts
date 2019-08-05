import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';

export default class ButtonCards extends Basic {
  constructor(props: BasicProps) {
    super(props);
    this.createSelectors();
  }

  private createSelectors() {}

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    this.container.updateOpts({ infinite: true, canHandleEvents: true });

    const button = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonMenu, {
        superview: this.container,
        width: 60,
        height: 70,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => '',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        iconData: {
          url: 'resources/images/ui/icons/cards.png',
          size: 0.6,
          x: 0,
          y: -1,
        },
        onClick: () => {},
      }),
    );
  }
}
