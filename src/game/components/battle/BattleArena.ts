import animate from 'animate';
import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import uiConfig from 'src/lib/uiConfig';
import {
  getScreenDimensions,
  waitForIt,
  getRandomInt,
  getRandomFloat,
} from 'src/lib/utils';

import StateObserver from 'src/redux/StateObserver';
import {
  changeTarget,
  throwDice,
  setResolved,
  resetCombat,
  addStat,
  // addHp,
} from 'src/redux/shortcuts/combat';

import ProgressMeter from './ProgressMeter';
import AttackIcons from './AttackIcons';
import MonsterImage from './MonsterImage';

import { Monster } from 'src/redux/ruleset/monsters';
import { CardNum } from '../cards/CardNumber';
import { Target } from 'src/types/custom';

type Props = { superview: View; monsterData: Monster };

export default class BattleArena {
  private props: Props;
  private container: View;
  private components;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();

    // changeTarget();
  }

  private createSelectors() {
    StateObserver.createSelector(({ combat }) => {
      return combat.index;
    }).addListener((index) => {
      const { combat } = StateObserver.getState();

      console.log('---------');

      // check for combat reset
      if (index === 0) {
        const { target, enemy } = combat;
        if (target && enemy) {
          this.components[target].meter.reset({ isOverhead: false });
          this.components[enemy].meter.reset({ isOverhead: false });
          this.updateTurn(combat);
        }
        return;
      }

      if (this.resolveCombat(combat)) return;
      if (this.resolveOverheads(combat)) return;

      this.refreshMeters(combat);

      this.updateTurn(combat);
    });
  }

  resolveCombat(combat) {
    const { target, enemy } = combat;

    if (!combat[target].resolved || !combat[enemy].resolved) {
      return false;
    }

    console.log('>>> COMBAT IS RESOLVED!');

    // if it's a draw, reset both meters to 0 and call it  day
    if (combat[target].meter === combat[enemy].meter) {
      waitForIt(() => {
        this.components[target].meter.reset({ isOverhead: false });
        this.components[enemy].meter.reset({ isOverhead: false });
        waitForIt(() => resetCombat(), 600);
      }, 600);
      return true;
    }

    waitForIt(() => {
      const winner =
        combat[target].meter > combat[enemy].meter ? target : enemy;
      const loser = winner === 'hero' ? 'monster' : 'hero';
      const attacks = combat[winner].meter - combat[loser].meter;

      this.components[winner].meter.resolveTo(attacks);
      this.components[loser].meter.resolveTo(0);

      this.createAttackIcons({ winner, loser, attacks });

      waitForIt(() => resetCombat(), attacks * 600 + 600);
    }, 350);

    return true;
  }

  resolveOverheads(combat) {
    const { target, enemy } = combat;

    if (combat[target].overhead > 0) {
      const overhead = combat[target].overhead;
      console.log('>>>', target, 'OVERHEAD!', overhead);
      this.components[target].meter.reset({ isOverhead: true });
      this.components[enemy].meter.resolveTo(overhead);
      waitForIt(() => {
        this.createAttackIcons({
          winner: enemy,
          loser: target,
          attacks: overhead,
        });
        waitForIt(() => resetCombat(), overhead * 600 + 600);
      }, 350);
      return true;
    }

    if (combat[enemy].overhead > 0) {
      const overhead = combat[enemy].overhead;
      console.log('>>>', enemy, 'OVERHEAD!', overhead);
      this.components[enemy].meter.reset({ isOverhead: true });
      this.components[target].meter.resolveTo(overhead);
      waitForIt(() => {
        this.createAttackIcons({
          winner: target,
          loser: enemy,
          attacks: overhead,
        });
        waitForIt(() => resetCombat(), overhead * 600 + 600);
      }, 350);
      return true;
    }

    return false;
  }

  refreshMeters(combat) {
    const { target, enemy } = combat;

    // refresh both meters
    this.components[target].meter.refresh(true);
    this.components[enemy].meter.refresh(false);

    console.log(
      '>>>',
      `${target}(+${combat[target].meter}) attacks ${enemy}(+${
        combat[enemy].meter
      })`,
    );
  }

  updateTurn(combat) {
    const { target, enemy } = combat;

    waitForIt(() => {
      if (target === 'hero' || combat['hero'].resolved) {
        if (!combat['monster'].resolved) this.executeAi(combat);
      } else {
        if (!combat[enemy].resolved) changeTarget();
      }
    }, 600);
  }

  executeAi(combat) {
    const target = changeTarget('monster');
    console.log('>>> executing monster AI');

    // decide if we throw another dice or we resolve
    const currentMeter = combat[target].meter;
    const left = 12 - currentMeter;

    const precaucious = 1.5;
    const r = getRandomInt(1, 6) * precaucious;

    if (r <= left) {
      const dice = getRandomInt(1, 6) as CardNum;
      console.log('>>> monster throws another dice (+', dice, ')');
      throwDice(target, dice);
    } else {
      console.log('>>> monster resolves combat');
      setResolved(target);
    }
  }

  createAttackIcons(result: {
    winner: Target;
    loser: Target;
    attacks: number;
  }) {
    const { winner, attacks } = result;
    if (!winner) return;
    this.components[winner].attackIcons.addIcons(attacks, 300, () => {
      // start attacking sequence
      const t = 350;
      for (let i = 0; i < result.attacks; i++) {
        waitForIt(() => {
          this.attack(i, result);
        }, i * t);
      }
    });
  }

  private attack(
    index: number,
    result: { winner: Target; loser: Target; attacks: number },
  ) {
    const { winner, loser } = result;

    // calculate damage
    const combat = StateObserver.getState().combat;
    const atk = combat[winner].stats.attack.current;
    const def = combat[loser].stats.defense.current;
    const damage = atk - def;
    console.log('  >>> attack', index + 1, '->', damage, 'damage');

    // remove loser's HP
    addStat(loser, 'hp', { current: -damage });

    // remove icon
    this.components[winner].attackIcons.removeIcon();

    // animate screen effect
    const r = getRandomFloat(-0.1, 0.1);
    animate(this.container)
      .clear()
      .wait(50)
      .then({ scale: 1.25, r }, 50, animate.easeInOut)
      .then({ scale: 0.95 }, 100, animate.easeInOut)
      .then({ scale: 1, r: 0 }, 50, animate.easeInOut);

    // create damage label
    const d = loser === 'hero' ? 1 : -1;
    const labelDamage = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      localeText: () => `${damage}`,
      x: this.container.style.width / 2,
      y: this.container.style.height / 2 - 20 + d * 85,
      size: 24,
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
      .wait(150)
      .then({ scale: 1 }, 100, animate.easeInOut)
      .then({ y, opacity: 0 }, 600, animate.linear)
      .then({ scale: 0 }, 100, animate.easeInOut)
      .then(() => {
        labelDamage.removeFromSuperview();
      });
  }

  // ============================================================

  protected createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      ...props,
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: screen.width,
      height: screen.height * 1,
      x: screen.width * 0.5,
      y: screen.height * 0.5,
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

    const monsterImage = new MonsterImage({
      superview: this.container,
      x: this.container.style.width / 2,
      y: 128 + 40,
      width: 72,
      height: 72,
      image: props.monsterData.image,
    });

    const y = this.container.style.height * 0.5;

    this.components = {
      hero: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y + 25,
          width: 220,
          height: 45,
          target: 'hero',
          stepLimit: 12,
        }) as ProgressMeter,

        attackIcons: new AttackIcons({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y + 80,
          target: 'hero',
        }) as AttackIcons,
      },

      monster: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y - 25,
          width: 220,
          height: 45,
          target: 'monster',
          stepLimit: 12,
        }) as ProgressMeter,
        attackIcons: new AttackIcons({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y - 170,
          target: 'monster',
        }) as AttackIcons,
      },
    };
  }
}
