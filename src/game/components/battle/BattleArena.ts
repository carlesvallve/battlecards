import animate from 'animate';
import View from 'ui/View';
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
} from 'src/redux/shortcuts/combat';

import ProgressMeter from './ProgressMeter';
import AttackIcons from './AttackIcons';
import MonsterImage from './MonsterImage';

import { Monster } from 'src/redux/ruleset/monsters';
import { CardNum } from '../cards/CardNumber';
import { Target } from 'src/types/custom';
import BattleOverlay from './BattleOverlay';
import { blockUi } from 'src/redux/shortcuts/ui';
import BattleCardHand from './BattleCardHand';
import { animDuration } from 'src/lib/uiConfig';

type Props = {
  superview: View;
  monsterData: Monster;
  overlay: BattleOverlay;
  cardHand: BattleCardHand;
};

export default class BattleArena {
  private props: Props;
  private container: View;
  private components: {
    hero: { meter: ProgressMeter; attackIcons: AttackIcons };
    monster: { meter: ProgressMeter; attackIcons: AttackIcons };
  };

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  private createSelectors() {
    StateObserver.createSelector(({ ui }) => {
      return ui.scene === 'game' && ui.navState === 'entered';
    }).addListener((init) => {
      if (!init) return;
      blockUi(true);
      waitForIt(() => {
        this.props.cardHand.showHand();
        waitForIt(() => blockUi(false), animDuration);
      }, 1000);
    });

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
      waitForIt(() => resetCombat(), 350);
      return true;
    }

    this.props.cardHand.hideHand();

    waitForIt(() => {
      // this.props.cardHand.hideHand();

      const winner =
        combat[target].meter > combat[enemy].meter ? target : enemy;
      const loser = winner === 'hero' ? 'monster' : 'hero';
      const attacks = combat[winner].meter - combat[loser].meter;

      this.components[winner].meter.resolveTo(attacks);
      this.components[loser].meter.resolveTo(0);

      this.createAttackIcons({ winner, loser, attacks });

      waitForIt(() => resetCombat(), (attacks + 1) * 600 + 600);
    }, animDuration * 2);

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
        waitForIt(() => resetCombat(), (overhead + 0) * 600 + 600);
      }, 100);
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
        waitForIt(() => resetCombat(), (overhead + 0) * 600 + 600);
      }, 100);
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

    // unblock ui in case monster resolved
    // and hero can keep playing
    waitForIt(() => {
      if (target === 'hero' && combat[enemy].resolved) {
        blockUi(false);
      }
    }, 350);
  }

  updateTurn(combat) {
    let { target, enemy } = combat;

    waitForIt(() => {
      if (target === 'hero' || combat['hero'].resolved) {
        if (!combat['monster'].resolved) this.executeAi(combat);
      } else {
        if (!combat[enemy].resolved) target = changeTarget();
        // unblock ui when turn is done
        blockUi(target !== 'hero');
        this.props.cardHand.showHand();
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
    this.props.overlay.createDamageLabel(loser, damage);
  }

  // endTurn(target: Target) {
  //   // unblock the combat ui
  //   blockUi(target !== 'hero');
  // }

  // ============================================================

  protected createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      ...props,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      width: screen.width,
      height: screen.height * 1,
      x: screen.width * 0.5,
      y: screen.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      infinite: true,
      canHandleEvents: false,
    });

    // baseline
    const y = this.container.style.height * 0.58;

    const monsterImage = new MonsterImage({
      superview: this.container,
      x: this.container.style.width / 2,
      y: y - 115,
      width: 100,
      height: 100,
      image: props.monsterData.image,
    });

    this.components = {
      hero: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y + 25,
          width: 220,
          height: 40,
          target: 'hero',
          stepLimit: 12,
        }) as ProgressMeter,

        attackIcons: new AttackIcons({
          superview: this.props.overlay.getView(), // this.container,
          x: this.container.style.width * 0.5,
          y: y + 110,
          target: 'hero',
        }) as AttackIcons,
      },

      monster: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y - 25,
          width: 220,
          height: 40,
          target: 'monster',
          stepLimit: 12,
        }) as ProgressMeter,

        attackIcons: new AttackIcons({
          superview: this.props.overlay.getView(), // this.container,
          x: this.container.style.width * 0.5,
          y: y - 210,
          target: 'monster',
        }) as AttackIcons,
      },
    };
  }
}
