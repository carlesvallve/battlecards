import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import { getScreenDimensions, getRandomInt } from 'src/lib/utils';
import ProgressBar from '../ui/ProgressBar';

export default class BattleFooter extends Basic {
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
      width: screen.width,
      height: 75,
      y: screen.height - 75,
    });

    const buttonDraw = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonGreen, {
        superview: this.container,
        x: 30,
        y: 38,
        width: 50,
        height: 60,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => '24',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        onClick: () => {},
      }),
    );

    const buttonAction = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonGreen, {
        superview: this.container,
        x: this.container.style.width - 30,
        y: 38,
        width: 50,
        height: 60,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => 'A',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        onClick: () => {
          barHP.setProgress(getRandomInt(1, 20), 20);
          barEP.setProgress(getRandomInt(1, 20), 20);
        },
      }),
    );

    const barHP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 20,
      width: 190,
      height: 25,
      type: 'hp',
      target: 'hero',
    });

    const barEP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 50,

      width: 190,
      height: 25,
      type: 'ep',
      target: 'hero',
    });
  }
}
