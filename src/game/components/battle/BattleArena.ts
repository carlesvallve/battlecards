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
import sounds from 'src/lib/sounds';
import ruleset from 'src/redux/ruleset';

type Props = {
  superview: View;
  monsterData: Monster;
  overlay: BattleOverlay;
  cardHand: BattleCardHand;
};

export default class BattleArena {
  private props: Props;
  private container: View;
  private monsterImage: MonsterImage;
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
    // combat start

    StateObserver.createSelector(({ ui }) => {
      return ui.scene === 'game' && ui.navState === 'entered';
    }).addListener((init) => {
      if (!init) return;

      blockUi(true);
      waitForIt(() => {
        changeTarget('hero');
        this.props.cardHand.showHand();
        waitForIt(() => blockUi(false), animDuration);
      }, 1000);
    });

    // combat flow

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
        sounds.playSound('item2', 1);
        resetCombat();
      }, 350);
      return true;
    }

    // hide the user's card hand
    this.props.cardHand.hideHand();

    waitForIt(() => {
      // this.props.cardHand.hideHand();

      const winner =
        combat[target].meter > combat[enemy].meter ? target : enemy;
      const loser = winner === 'hero' ? 'monster' : 'hero';
      const attacks = combat[winner].meter - combat[loser].meter;

      this.components[winner].meter.resolveTo(attacks, true);
      this.components[loser].meter.resolveTo(0, false);

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
      this.components[enemy].meter.resolveTo(overhead, true);

      // hide the user's card hand
      this.props.cardHand.hideHand();

      waitForIt(() => {
        this.createAttackIcons({
          winner: enemy,
          loser: target,
          attacks: overhead,
        });
        waitForIt(() => resetCombat(), (overhead + 0) * 600 + 600);
      }, animDuration * 1);
      return true;
    }

    if (combat[enemy].overhead > 0) {
      const overhead = combat[enemy].overhead;
      console.log('>>>', enemy, 'OVERHEAD!', overhead);
      this.components[enemy].meter.reset({ isOverhead: true });
      this.components[target].meter.resolveTo(overhead, true);

      // hide the user's card hand
      this.props.cardHand.hideHand();

      waitForIt(() => {
        this.createAttackIcons({
          winner: target,
          loser: enemy,
          attacks: overhead,
        });
        waitForIt(() => resetCombat(), (overhead + 0) * 600 + 600);
      }, animDuration * 1);
      return true;
    }

    return false;
  }

  displayMeters(value: boolean) {
    const y = this.container.style.height * ruleset.baselineY;

    if (value) {
      this.components['hero'].meter.showMeter();
      this.components['monster'].meter.showMeter();

      // sounds.playSound('swoosh4', 0.15);
      animate(this.monsterImage.getView())
        .clear()
        .then({ y: y - 115 }, animDuration, animate.easeInOut);
    } else {
      this.components['hero'].meter.hideMeter();
      this.components['monster'].meter.hideMeter();

      sounds.playSound('swoosh4', 0.15);
      animate(this.monsterImage.getView())
        .clear()
        .then({ y: y - 45 }, animDuration, animate.easeInOut);
    }
  }

  refreshMeters(combat) {
    const { target, enemy } = combat;

    // refresh both meters
    this.components[target].meter.refresh(true, !combat[target].resolved);
    this.components[enemy].meter.refresh(false, false);

    console.log(
      '>>>',
      `${target}(+${combat[target].meter}) attacks ${enemy}(+${
        combat[enemy].meter
      })`,
    );

    // unblock ui in case monster resolved and hero can keep playing
    waitForIt(() => {
      if (target === 'hero' && combat[enemy].resolved) {
        blockUi(false);
      }
    }, 350);
  }

  updateTurn(combat) {
    let { target, enemy } = combat;
    console.log('UPDATE TURN!');

    waitForIt(() => {
      if (target === 'hero' || combat['hero'].resolved) {
        if (!combat['monster'].resolved) this.executeAi(combat);
      } else {
        this.displayMeters(true);

        if (!combat[enemy].resolved) target = changeTarget();
        // unblock ui when turn is done
        blockUi(target !== 'hero');

        this.props.cardHand.showHand();
      }
    }, 600);
  }

  executeAi(combat) {
    this.displayMeters(true);

    // if we are in attackig phase,
    // we need a delay to trigger ai after meters have re-appeared
    const delay = this.components.hero.meter.getActive() ? 0 : 350;

    waitForIt(() => {
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
        sounds.playSound('unlock', 1);
        setResolved(target);
      }
    }, delay);
  }

  createAttackIcons(result: {
    winner: Target;
    loser: Target;
    attacks: number;
  }) {
    const { winner, loser, attacks } = result;
    if (!winner) return;
    this.components[winner].attackIcons.addIcons(attacks, 300, () => {
      // hide meters
      this.displayMeters(false);

      // start attacking sequence
      waitForIt(() => {
        const t = 350;
        for (let i = 0; i < result.attacks; i++) {
          waitForIt(() => {
            this.attack(i, result);
          }, i * t);
        }
      }, 300);
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
      .wait(250)
      .then(() => {
        sounds.playRandomSound(['punch1', 'punch2'], 1);
        sounds.playRandomSound(['sword1', 'sword2', 'sword3'], 0.02);
        sounds.playRandomSound(['', 'break1', 'break1'], 0.1);
      })
      .then({ scale: 1.3, r }, 50, animate.easeInOut)
      .then({ scale: 0.95 }, 100, animate.easeInOut)
      .then({ scale: 1, r: 0 }, 50, animate.easeInOut);

    // create damage label
    this.props.overlay.createDamageLabel(loser, damage);
  }

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

    const y = this.container.style.height * ruleset.baselineY;

    this.monsterImage = new MonsterImage({
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
