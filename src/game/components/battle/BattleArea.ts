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
import StatInfo from '../ui/StatInfo';
import MonsterInfo from '../ui/MonsterInfo';
import ProgressMeter from '../ui/ProgressMeter';
import StateObserver from 'src/redux/StateObserver';
import {
  setDice,
  updateTurn,
  getCurrentMeter,
} from 'src/redux/shortcuts/combat';
import AttackIcons from '../ui/AttackIcons';
import { Target } from 'src/types/custom';

export default class BattleArea extends Basic {
  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);
    // this.createSelectors();
  }

  // createSelectors() {
  //   StateObserver.createSelector(({ combat }) => combat).addListener(
  //     (dice) => {

  //     },
  //   );
  // }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    const screen = getScreenDimensions();
    this.container.updateOpts({
      // backgroundColor: 'rgba(255, 128, 128, 0.5)',
      width: screen.width - 20,
      height: screen.height * 0.7,
      x: screen.width / 2,
      y: screen.height / 2,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    const bg = new ImageScaleView({
      superview: this.container,
      ...uiConfig.frameBlack,
      width: this.container.style.width,
      height: this.container.style.height,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
    });

    const meterMonster = new ProgressMeter({
      superview: this.container,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5 - 35,
      width: 220,
      height: 50,

      type: 'monster',
      stepLimit: 12,
    });

    const attackMonster = new AttackIcons({
      superview: this.container,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5 - 110,
      width: 220,
      height: 50,
      type: 'monster',
    });

    const meterHero = new ProgressMeter({
      superview: this.container,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5 + 35,
      width: 220,
      height: 50,

      type: 'hero',
      stepLimit: 12,
    });

    const attackHero = new AttackIcons({
      superview: this.container,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5 + 105,
      width: 220,
      height: 50,
      type: 'hero',
    });

    const buttonHero = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonMenu, {
        superview: this.container,
        x: this.container.style.width * 0.33,
        y: this.container.style.height - 30,
        width: 80,
        height: 40,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => 'Hero',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        onClick: () => {
          updateTurn('hero');
        },
      }),
    );

    const buttonMonster = new ButtonScaleViewWithText(
      Object.assign({}, uiConfig.buttonMenu, {
        superview: this.container,
        x: this.container.style.width * 0.66,
        y: this.container.style.height - 30,
        width: 80,
        height: 40,
        centerOnOrigin: true,
        centerAnchor: true,
        labelOffsetY: -3,
        localeText: () => 'Monster',
        size: 16,
        font: bitmapFonts('TitleStroke'),
        onClick: () => {
          updateTurn('monster');
        },
      }),
    );
  }

  // utility functions

  static getEnemyType(type: Target) {
    return type === 'hero' ? 'monster' : 'hero';
  }

  static getColorByType(type: Target) {
    return type === 'hero' ? uiConfig.frameBlue : uiConfig.frameRed;
  }

  static getColorByDiff(type: Target, currentMeter: number) {
    const enemyMeter = getCurrentMeter(this.getEnemyType(type));
    return enemyMeter < currentMeter
      ? uiConfig.frameYellow
      : uiConfig.frameOrange;
  }
}
