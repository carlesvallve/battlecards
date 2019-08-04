import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import View from 'ui/View';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import { getScreenDimensions } from 'src/lib/utils';
import ProgressBar from '../ui/ProgressBar';
import ImageScaleView from 'ui/ImageScaleView';
import StatInfo from '../ui/StatInfo';
import MonsterInfo from '../ui/MonsterInfo';

export default class BattleHeader extends Basic {
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
      height: 80,
      y: 5,
    });

    // const bg = new ImageScaleView({
    //   superview: this.container,
    //   ...uiConfig.frameBlack,
    //   width: this.container.style.width - 0,
    //   height: this.container.style.height - 0,
    //   x: this.container.style.width * 0.5,
    //   y: this.container.style.height * 0.5,
    //   scale: 1,
    // });

    // const buttonDraw = new ButtonScaleViewWithText(
    //   Object.assign({}, uiConfig.buttonMenu, {
    //     superview: bg,
    //     x: 35,
    //     y: 35,
    //     width: 50,
    //     height: 50,
    //     centerOnOrigin: true,
    //     centerAnchor: true,
    //     labelOffsetY: -3,
    //     localeText: () => '24',
    //     size: 16,
    //     font: bitmapFonts('TitleStroke'),
    //     onClick: () => {},
    //   }),
    // );

    // const buttonAction = new ButtonScaleViewWithText(
    //   Object.assign({}, uiConfig.buttonMenu, {
    //     superview: bg,
    //     x: bg.style.width - 35,
    //     y: 35,
    //     width: 50,
    //     height: 50,
    //     centerOnOrigin: true,
    //     centerAnchor: true,
    //     labelOffsetY: -3,
    //     localeText: () => 'A',
    //     size: 16,
    //     font: bitmapFonts('TitleStroke'),
    //     onClick: () => {},
    //   }),
    // );

    const dBars = 55;

    const barHP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 - dBars,
      y: 17,
      width: 100,
      height: 20,
      type: 'hp',
      // scale: 0.6,
    });

    const barEP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + dBars,
      y: 17,
      type: 'ep',
      width: 100,
      height: 20
,
      // scale: 0.6,
    });

    const mosnterInfo = new MonsterInfo({
      superview: this.container,
      x: this.container.style.width / 2,
      y: 48,
      width: 140,
      height: 30,
      data: {
        name: 'Toktick',
        description: 'Encouraging warrior',
      },
    });

    const dStats = 91;

    const statAttack = new StatInfo({
      superview: this.container,
      x: this.container.style.width / 2 - dStats,
      y: 48,
      type: 'defense',
      width: 30,
      height: 30,
    });

    const statDefense = new StatInfo({
      superview: this.container,
      x: this.container.style.width / 2 + dStats,
      y: 48,
      type: 'attack',
      width: 30,
      height: 30,
    });
  }
}
