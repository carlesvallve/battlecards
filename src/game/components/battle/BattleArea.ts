import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import { getScreenDimensions } from 'src/lib/utils';
import ImageScaleView from 'ui/ImageScaleView';
import ProgressMeter from '../ui/ProgressMeter';
import StateObserver from 'src/redux/StateObserver';
import { updateTurn, getCurrentMeter, addHp } from 'src/redux/shortcuts/combat';
import AttackIcons from '../ui/AttackIcons';
import { Target } from 'src/types/custom';
import Label from '../ui/Label';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';

export default class BattleArea extends Basic {
  constructor(props: BasicProps) {
    super(props);
    this.createSelectors();
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  private createSelectors() {
    // StateObserver.createSelector(({ combat }) => combat).addListener(
    //   (combat) => {
    //     console.log('>>> combat', combat);
    //   },
    // );

    StateObserver.createSelector(
      ({ combat }) => combat.hero.attacks,
    ).addListener((attack) => {
      if (attack === 0) return;
      console.log('>>> hero attacking monster');
      this.attack('hero', 'monster');
    });

    StateObserver.createSelector(
      ({ combat }) => combat.monster.attacks,
    ).addListener((attack) => {
      if (attack === 0) return;
      console.log('>>> monster attacking hero');
      this.attack('monster', 'hero');
    });
  }

  private attack(attacker: Target, defender: Target) {
    const combat = StateObserver.getState().combat;
    const damage = combat[attacker].damage - combat[defender].armour;
    console.log('>>>', attacker, 'damage', damage);

    // remove defender's HP
    addHp(defender, -damage);

    // animate screen effect
    animate(this.container)
      .clear()
      .wait(100)
      .then({ scale: 1.15 }, 50, animate.easeInOut)
      .then({ scale: 1 }, 50, animate.easeOut);

    // create damage label
    const d = defender === 'hero' ? 1 : -1;
    const labelDamage = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      localeText: () => `${damage}`,
      x: this.container.style.width / 2,
      y: this.container.style.height / 2 - 20 + d * 85,
      size: 20,
      color: 'yellow',
      scale: 0,
      zIndex: 100,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    // animate damage label
    const y = this.container.style.height / 2 - 20 + d * 160;
    animate(labelDamage)
      .clear()
      .then({ scale: 1 }, 100, animate.easeInOut)
      .then({ y, opacity: 0 }, 600, animate.linear)
      .then({ scale: 0 }, 100, animate.easeInOut)
      .then(() => {
        labelDamage.removeFromSuperview();
      });
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    const screen = getScreenDimensions();
    this.container.updateOpts({
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

  // animations

  // animateAttack(target: Target, damage: number) {
  //   animate(this.container)
  //     .clear()
  //     .wait(100)
  //     .then({ scale: 1.15 }, 50, animate.easeInOut)
  //     .then({ scale: 1 }, 50, animate.easeOut);

  //   const d = target === 'hero' ? 150 : -150;

  //   const labelDamage = new Label({
  //     superview: this.container,
  //     localeText: () => '0',
  //     x: this.container.style.width / 2,
  //     y: this.container.height / 2 + d,
  //     size: 30,
  //     color: 'yellow',
  //   });
  // }

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
