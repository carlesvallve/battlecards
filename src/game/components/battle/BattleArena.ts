import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import { animDuration } from 'src/lib/uiConfig';
import {
  getScreenDimensions,
  waitForIt,
  getRandomInt,
  getRandomFloat,
} from 'src/lib/utils';

import StateObserver from 'src/redux/StateObserver';
import ruleset from 'src/redux/ruleset';
import { blockUi } from 'src/redux/shortcuts/ui';
import {
  newCombat,
  changeTarget,
  setResolved,
  resetCombatTurn,
  addStat,
  setMonsterID,
  getRandomMonsterID,
} from 'src/redux/shortcuts/combat';

import ProgressMeter from './ProgressMeter';
import AttackIcons from './AttackIcons';
import MonsterImage from './MonsterImage';
import BattleCardNumbers from './BattleCardNumbers';
import BattleCardHand from './BattleCardHand';
import BattleHeader from './BattleHeader';
import BattleFooter from './BattleFooter';
import BattleOverlay from './BattleOverlay';

import { CombatResult, Combat } from 'src/types/custom';
import playExplosion from './Explosion';

type Props = {
  superview: View;
};

export default class BattleArena {
  private props: Props;
  private container: View;
  private monsterImage: MonsterImage;
  private cardHand: BattleCardHand;
  private overlay: BattleOverlay;
  private components: {
    hero: {
      meter: ProgressMeter;
      attackIcons: AttackIcons;
      cardNumbers: BattleCardNumbers;
    };
    monster: {
      meter: ProgressMeter;
      attackIcons: AttackIcons;
      cardNumbers: BattleCardNumbers;
    };
  };

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  init() {
    // generate a new combat
    newCombat(getRandomMonsterID());
  }

  private createSelectors() {
    StateObserver.createSelector(({ combat }) => {
      return combat.index;
    }).addListener((index) => {
      console.log('combat-flow: ---------', index);
      const { combat } = StateObserver.getState();

      const id = combat.monster.id;
      if (id) this.monsterImage.setImage(ruleset.monsters[id].image);

      if (this.checkMonsterDeath(combat)) return;
      if (this.checkHeroDeath(combat)) return;

      if (this.checkCombatReset(combat)) return;
      if (this.checkCombatResult(combat)) return;

      this.refreshMeters(combat);
      this.updateTurn(combat);
    });
  }

  checkMonsterDeath(combat: Combat) {
    const hp = combat.monster.stats.hp.current;

    if (hp <= 0) {
      this.monsterImage.playDeathAnimation();
      waitForIt(() => {
        // generate a new combat
        newCombat(getRandomMonsterID());
      }, animDuration * 3);

      return true;
    }

    return false;
  }

  checkHeroDeath(combat: Combat) {
    const hp = combat.hero.stats.hp.current;
    if (hp <= 0) {
      // todo: open gameover popup
      return true;
    }
    return false;
  }

  checkCombatReset(combat: Combat) {
    // check for combat reset
    if (combat.index === 0) {
      const { target, enemy } = combat;
      if (target && enemy) {
        this.components[target].meter.reset({ isOverhead: false });
        this.components[enemy].meter.reset({ isOverhead: false });
        this.updateTurn(combat);
      }

      return true;
    }
    return false;
  }

  checkCombatResult(combat: Combat) {
    const { target, enemy } = combat;

    // if someone overheaded, resolve the combat
    if (combat[target].overhead > 0 || combat[enemy].overhead > 0) {
      const overhead = combat[target].overhead;
      console.log('combat-flow:', 'OVERHEAD!', overhead);
      this.resolveCombat({
        winner: combat[target].overhead > 0 ? enemy : target,
        loser: combat[target].overhead > 0 ? target : enemy,
        attacks: overhead,
        isOverhead: true,
      });
      return true;
    }

    // otherwise, only resolve if both hero and monster has resolved their turns
    if (!combat[target].resolved || !combat[enemy].resolved) {
      return false;
    }

    console.log('>>> COMBAT IS RESOLVED!');

    // if it's a draw, reset both meters to 0 and call it  day
    if (combat[target].meter === combat[enemy].meter) {
      waitForIt(() => {
        sounds.playSound('item2', 1);
        resetCombatTurn();
      }, 350);
      return true;
    }

    // if someone won, resolve the combat
    const winner = combat[target].meter > combat[enemy].meter ? target : enemy;
    const loser = winner === 'hero' ? 'monster' : 'hero';
    const attacks = combat[winner].meter - combat[loser].meter;
    this.resolveCombat({
      winner,
      loser,
      attacks,
      isOverhead: false,
    });

    return true;
  }

  resolveCombat(result: CombatResult) {
    const { winner, loser, attacks, isOverhead } = result;

    // set meters
    this.components[winner].meter.resolveTo(attacks, true);
    if (isOverhead) {
      this.components[loser].meter.reset({ isOverhead: true });
    } else {
      this.components[loser].meter.resolveTo(0, false);
    }

    // hide the user's card hand
    this.cardHand.hideHand();

    // create attack icons
    waitForIt(() => {
      this.createAttackIcons({ winner, loser, attacks }, () => {
        waitForIt(() => resetCombatTurn(), 150);
      });
    }, animDuration * 2);
  }

  displayMeters(value: boolean) {
    const y = this.container.style.height * ruleset.baselineY;

    if (value) {
      if (!this.components['hero'].meter.getActive()) {
        this.components['hero'].meter.showMeter();
        this.components['monster'].meter.showMeter();
        this.monsterImage.playAttackAnimationEnd();
      }
    } else {
      if (this.components['hero'].meter.getActive()) {
        this.components['hero'].meter.hideMeter();
        this.components['monster'].meter.hideMeter();
        this.monsterImage.playAttackAnimationStart();
      }
    }
  }

  refreshMeters(combat: Combat) {
    const { target, enemy } = combat;

    // refresh both meters
    this.components[target].meter.refresh(true, !combat[target].resolved);
    this.components[enemy].meter.refresh(false, false);

    console.log(
      'combat-flow: ',
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

  createAttackIcons(result: CombatResult, cb: () => void) {
    const { winner, loser, attacks } = result;
    if (!winner) return;

    const meter = this.components[winner].meter;

    this.components[winner].attackIcons.addIcons(meter, attacks, () => {
      // hide meters
      this.displayMeters(false);

      // start attacking sequence
      waitForIt(() => {
        const t = 350;
        for (let i = 0; i < result.attacks; i++) {
          waitForIt(() => {
            this.attack(i, result, () => {
              if (i === result.attacks - 1) cb && cb();
            });
          }, i * t);
        }
      }, 150);
    });
  }

  private attack(index: number, result: CombatResult, cb: () => void) {
    const { winner, loser } = result;

    // calculate damage
    const combat = StateObserver.getState().combat;
    const atk = combat[winner].stats.attack.current;
    const def = combat[loser].stats.defense.current;
    const damage = atk - def;
    console.log('combat-flow: attack', index + 1, '->', damage, 'damage');

    // remove loser's HP
    addStat(loser, 'hp', { current: -damage });

    // remove icon
    this.components[winner].attackIcons.removeIcon();

    // animate screen effect
    const screen = getScreenDimensions();
    const x = screen.width / 2;
    const y = screen.height / 2;
    const d = 10;
    const dx = getRandomFloat(-d, d);
    const dy = getRandomFloat(-d, d);
    const sc = getRandomFloat(1.2, 1.6);
    const r = getRandomFloat(-0.05, 0.05);

    const t = 50;

    animate(this.container)
      .clear()
      .wait(150)
      .then(() => {
        sounds.playRandomSound(['punch1', 'punch2'], 1);
        sounds.playRandomSound(['sword1', 'sword2', 'sword3'], 0.02);
        sounds.playRandomSound(['', 'break1', 'break1'], 0.1);
      })
      .then({ x: x + dx, y: y + dy, scale: sc, r }, t * 1, animate.easeInOut)
      .then({ scale: 0.95 }, t * 2, animate.easeInOut)
      .then({ x, y, scale: 1, r: 0 }, t * 2, animate.easeInOut)
      .then(() => cb && cb());

    // create damage label

    this.overlay.createDamageLabel(
      loser,
      damage,
      loser === 'hero'
        ? this.container.style.height / 2 + 205
        : this.monsterImage.getView().style.y - 50,
    );
  }

  executeAi(combat: Combat) {
    const target = changeTarget('monster');
    console.log('combat-flow: executing monster AI');

    // decide if we throw another dice or we resolve
    const currentMeter = combat[target].meter;
    const left = combat[target].maxSteps - currentMeter;

    const precaucious = 0.5; // 0: agressive 1: normal 2: coward
    const r = getRandomInt(1, 6) * precaucious;

    if (r <= left) {
      console.log('combat-flow: monster decides to spawn another card...');
      this.components[target].cardNumbers.spawnCard();
    } else {
      console.log('combat-flow: monster resolves combat');
      sounds.playSound('unlock', 1);
      setResolved(target);
    }
  }

  updateTurn(combat: Combat) {
    console.log('combat-flow: UPDATE TURN');

    let { target, enemy } = combat;
    this.displayMeters(true);

    if (target === 'hero' || combat['hero'].resolved) {
      // is monster turn
      if (!combat['monster'].resolved) {
        waitForIt(() => this.executeAi(combat), 500);
      }
    } else {
      // turn is done
      waitForIt(() => {
        if (!combat[enemy].resolved) target = changeTarget();
        this.cardHand.showHand();
        blockUi(target !== 'hero');
      }, 350);
    }
  }

  // ============================================================

  protected createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      // backgroundColor: 'rgba(0, 0, 0, 0.8)',
      width: screen.width,
      height: screen.height * 1,
      x: screen.width * 0.5,
      y: screen.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      infinite: true,
      canHandleEvents: false,
    });

    this.monsterImage = new MonsterImage({
      superview: this.container,
    });

    this.overlay = new BattleOverlay({
      superview: this.container,
      zIndex: 10,
    });

    const y = this.container.style.height * ruleset.baselineY;

    this.components = {
      hero: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y + 25,
          width: 220,
          height: 40,
          target: 'hero',
        }) as ProgressMeter,

        attackIcons: new AttackIcons({
          superview: this.overlay.getView(),
          x: this.container.style.width * 0.5,
          y: screen.height - 130, // y + 110,
          target: 'hero',
        }) as AttackIcons,

        cardNumbers: new BattleCardNumbers({
          superview: this.container,
          target: 'hero',
          zIndex: 2,
        }),
      },

      monster: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y - 25,
          width: 220,
          height: 40,
          target: 'monster',
        }) as ProgressMeter,

        attackIcons: new AttackIcons({
          superview: this.overlay.getView(),
          x: this.container.style.width * 0.5,
          y: 115, // y - 220,
          target: 'monster',
        }) as AttackIcons,

        cardNumbers: new BattleCardNumbers({
          superview: this.container,
          target: 'monster',
          zIndex: 2,
        }),
      },
    };

    this.cardHand = new BattleCardHand({
      superview: this.container,
      zIndex: 1,
    });

    const header = new BattleHeader({
      superview: this.container,
    });

    const footer = new BattleFooter({
      superview: this.container,
    });
  }
}
