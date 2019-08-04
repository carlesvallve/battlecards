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
    const hp = combat[defender].hp;
    console.log('>>>', attacker, 'damage', damage);
    addHp(defender, -damage);
    this.animateAttack();
  }

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

  animateAttack() {
    animate(this.container)
      .clear()
      .wait(100)
      .then({ scale: 1.15 }, 50, animate.easeInOut)
      .then({ scale: 1 }, 50, animate.easeOut);
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
