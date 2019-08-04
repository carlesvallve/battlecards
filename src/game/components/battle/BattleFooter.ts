import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import View from 'ui/View';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import { getScreenDimensions, getRandomInt } from 'src/lib/utils';
import ProgressBar from '../ui/ProgressBar';
import ImageScaleView from 'ui/ImageScaleView';
import { getRandomColor } from 'src/lib/colors';

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
      // backgroundColor: 'rgba(255, 128, 128, 0.5)',
      width: screen.width,
      height: 75,
      y: screen.height - 75,
    });

    // const bg = new ImageScaleView({
    //   superview: this.container,
    //   ...uiConfig.frameBlue,
    //   width: this.container.style.width,
    //   height: this.container.style.height,
    //   x: this.container.style.width * 0.5,
    //   y: this.container.style.height * 0.5,
    //   scale: 1,
    //   // centerOnOrigin: true,
    //   // centerAnchor: true,
    //   // image: 'resources/images/ui/frames/frame-black.png',
    //   // scaleMethod: '9slice',
    //   // sourceSlices: {
    //   //   horizontal: { left: 8, right: 8 },
    //   //   vertical: { top: 8, bottom: 8 },
    //   // },
    // });

    const buttonDraw = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonMenu, {
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
      Object.assign({}, uiConfig.buttonMenu, {
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
    });

    const barEP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 50,
      type: 'ep',
      width: 190,
      height: 25,
    });

    barHP.setProgress(20, 20);
    barEP.setProgress(19, 20);
  }
}
