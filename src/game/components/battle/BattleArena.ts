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
  getRandomMonsterID,
  setMeter,
} from 'src/redux/shortcuts/combat';

import ProgressMeter from './ProgressMeter';
import AttackIcons from './AttackIcons';
import MonsterImage from './MonsterImage';
import BattleCardNumbers from './BattleCardNumbers';
import BattleCardHand from './BattleCardHand';
import BattleHeader from './BattleHeader';
import BattleFooter from './BattleFooter';
import BattleOverlay from './BattleOverlay';

import { CombatResult, Combat, Target, TargetStat } from 'src/types/custom';

type Props = {
  superview: View;
};

export default class BattleArena {
  private props: Props;
  private container: View;
  private battleGround: View;
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
    // ==========================================
    // combat flow

    StateObserver.createSelector(({ combat }) => {
      return combat.index;
    }).addListener((index) => {
      const { combat } = StateObserver.getState();
      // console.log('combat-flow: ---------', index);

      if (combat.index.turn === 0) {
        setMeter('hero', 0);
        setMeter('monster', 0);
        return;
      }

      // unblock ui in case monster resolved and hero can keep playing
      if (combat.target === 'hero' && combat.monster.resolved) {
        blockUi(false);
      }

      // update monster image
      const id = combat.monster.id;
      if (id) this.monsterImage.setImage(ruleset.monsters[id].image);

      // if (this.checkCombatReset(combat)) return;
      if (this.checkCombatResult(combat)) return;

      // both meters need to refresh their colors
      // since they depend on each other
      this.components.hero.meter.updateMeterColors();
      this.components.monster.meter.updateMeterColors();

      // this.refreshMeters(combat);
      this.updateTurn(combat);
    });

    // ==========================================
    // selector for applying damage and killing
    // ONLY to be used while we are not physically attacking

    StateObserver.createSelector(({ combat }) => {
      if (!combat.hero || !combat.monster) return;
      return {
        hero: combat.hero.stats['hp'],
        monster: combat.monster.stats['hp'],
      };
    }).addListener((values) => {
      if (!values) return;
      const { combat } = StateObserver.getState();

      const bothResolved = combat.hero.resolved && combat.monster.resolved;
      const isOverhead = !!combat.hero.overhead || !!combat.monster.overhead;
      const attackType = bothResolved || isOverhead ? 'combat' : 'spell';
      if (attackType === 'combat') return;
      // console.log('===', attackType, bothResolved, isOverhead);

      Object.keys(values).forEach((target) => {
        let damage = values[target].last - values[target].current;
        if (damage > 0) {
          this.renderDamage('melee', combat.enemy, damage);
          if (values[target].current <= 0) this.killMonster();
        }
      });
    });
    // ==========================================
  }

  displayMeters(value: boolean) {
    if (value) {
      this.components.hero.meter.showMeter();
      this.components.monster.meter.showMeter();
      this.monsterImage.playAttackAnimationEnd();
    } else {
      this.components.hero.meter.hideMeter();
      this.components.monster.meter.hideMeter();
      this.monsterImage.playAttackAnimationStart();
      this.cardHand.hideHand();
    }
  }

  killMonster() {
    // render monster death
    this.monsterImage.playDeathAnimation();
    this.displayMeters(false);

    // generate a new combat
    waitForIt(() => {
      newCombat(getRandomMonsterID());
    }, animDuration * 5);
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

    // update meters to combat result
    setMeter(winner, attacks);
    setMeter(loser, 0);

    // hide the user's card hand
    this.cardHand.hideHand();

    // all active cards that cannot be played are returned to the user hand
    // const weaponCards = this.cardHand.getActiveCardsOfType('weapon');
    // if (loser === 'hero') {
    this.cardHand.hideHand();
    this.cardHand.returnActiveCardsToHand();

    // }

    // create attack icons
    waitForIt(() => {
      this.createAttackIcons({ winner, loser, attacks }, () => {
        // apply additional attacks if wevhave any active cards on the right
        this.applyAdditionalAttacks(result, (newAttacks: number) => {
          // start attacking sequence
          result.attacks += newAttacks;

          this.startAttackingSequence(result, () => {
            waitForIt(() => {
              resetCombatTurn();
            }, 150);
          });
        });
      });
    }, animDuration * 2);
  }

  applyAdditionalAttacks(
    result: CombatResult,
    cb: (newAttacks: number) => void,
  ) {
    // currentAttacks: number) {
    const { winner, loser, attacks, isOverhead } = result;
    let newAttacks = 0;

    // todo: enemies will be able to add attacks too in the future
    if (winner !== 'hero') {
      waitForIt(() => cb && cb(newAttacks), 0);
      return;
    }

    const screen = getScreenDimensions();
    const weaponCards = []; //this.cardHand.getActiveCardsOfType('weapon');
    console.log('>>> weaponCards', weaponCards);

    // for each card
    weaponCards.forEach((card, index) => {
      waitForIt(() => {
        card.displayAsActiveWeapon(
          screen.width * 0.5 + (attacks * 40) / 2,
          screen.height - 120,
          () => {
            const index = attacks + newAttacks;
            this.components.hero.attackIcons.addIcon(index, () => {});
            newAttacks++;
          },
        );
        this.cardHand.activeCardHasBeenPlayed(card);
      }, index * 1000);
    });

    // return callback once all attacks have been added
    waitForIt(() => cb && cb(newAttacks), 1100 * weaponCards.length);
  }

  createAttackIcons(result: CombatResult, cb: () => void) {
    const { winner, loser, attacks } = result;
    if (!winner) return;

    const meter = this.components[winner].meter;

    this.components[winner].attackIcons.addIcons(meter, attacks, () => {
      cb && cb();
    });
  }

  private startAttackingSequence(result: CombatResult, cb: () => void) {
    // hide meters
    this.displayMeters(false);

    const t = 350;
    console.log('========== ATTACKS', result.attacks);

    waitForIt(() => {
      for (let i = 0; i < result.attacks; i++) {
        waitForIt(() => {
          // apply damage and play the attack animation
          this.attack(i, result, () => {
            if (i === result.attacks - 1) cb && cb();
          });
        }, i * t);
      }
    }, 350);
  }

  private attack(index: number, result: CombatResult, cb: () => void) {
    const { winner, loser } = result;
    const combat = StateObserver.getState().combat;

    // calculate and render damage
    const atk = combat[winner].stats.attack.current;
    const def = combat[loser].stats.defense.current;
    const damage = atk - def;
    this.renderDamage('melee', loser, damage);

    // remove icon
    this.components[winner].attackIcons.removeIcon();

    // // remove loser's HP
    const enemyHP = addStat(loser, 'hp', { current: -damage });

    // check if enemy died on the last blow
    // if so, kill it and escape
    console.log('###', index, '/', result.attacks - 1, 'enemyHP', enemyHP);
    if (index === result.attacks - 1) {
      if (enemyHP <= 0) {
        this.killMonster();
        return;
      }
    }

    // execute next attack
    waitForIt(() => cb && cb(), 350);
  }

  private renderDamage(mode: 'melee' | 'spell', loser: Target, damage: number) {
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

    animate(this.battleGround)
      .clear()
      .wait(150)
      .then(() => {
        if (mode === 'melee')
          sounds.playRandomSound(['sword1', 'sword2', 'sword3'], 0.05);
        sounds.playRandomSound(['punch1', 'punch2'], 0.8);
        sounds.playRandomSound(['', 'break1', 'break1'], 0.1);
      })
      .then({ x: x + dx, y: y + dy, scale: sc, r }, t * 1, animate.easeInOut)
      .then({ scale: 0.95 }, t * 2, animate.easeInOut)
      .then({ x, y, scale: 1, r: 0 }, t * 2, animate.easeInOut);

    // create damage label
    this.overlay.createDamageLabel(
      loser,
      damage,
      loser === 'hero'
        ? screen.height - 85
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
        // if (
        //   (combat.hero.resolved && combat.monster.resolved) ||
        //   (!!combat.hero.overhead || !!combat.monster.overhead)
        // ) {
        //   console.log('*************************************************');
        // }

        console.log('*************************************************');

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
      height: screen.height,
      x: screen.width * 0.5,
      y: screen.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      infinite: true,
      canHandleEvents: false,
    });

    this.battleGround = new View({
      superview: this.container,
      // backgroundColor: 'rgba(0, 0, 0, 0.8)',
      width: screen.width,
      height: screen.height,
      x: screen.width * 0.5,
      y: screen.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      infinite: true,
      canHandleEvents: false,
    });

    this.monsterImage = new MonsterImage({
      superview: this.battleGround,
    });

    this.overlay = new BattleOverlay({
      superview: this.container,
      zIndex: 10,
    });

    const y = this.container.style.height * ruleset.baselineY;

    this.components = {
      hero: {
        meter: new ProgressMeter({
          superview: this.battleGround,
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
          superview: this.battleGround,
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
