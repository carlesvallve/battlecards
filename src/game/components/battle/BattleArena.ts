import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import { getScreenDimensions, waitForIt, getRandomInt } from 'src/lib/utils';
import ImageScaleView from 'ui/ImageScaleView';
import ProgressMeter from './ProgressMeter';
import StateObserver from 'src/redux/StateObserver';
import {
  updateTurn,
  getCurrentMeter,
  addHp,
  resetCombat,
  getTargetEnemy,
  updateMeter,
  resetMeter,
  setCombatPhase,
  calculateNumberOfAttacksOverhead,
  resolveCombatOverhead,
  getCombatResult,
  executeAttacks,
  endTurn,
} from 'src/redux/shortcuts/combat';
import AttackIcons from './AttackIcons';
import { Target, CombatResult } from 'src/types/custom';
import Label from './Label';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';

export default class BattleArena extends Basic {
  private components;

  constructor(props: BasicProps) {
    super(props);
    this.createSelectors();
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  // ============================================================

  private createSelectors() {
    // phase 1: Dice.
    // Either target or enemy will throw a dice
    // Update meters and check for overhead
    StateObserver.createSelector(({ combat }) => {
      if (!combat.turn) return null;
      if (combat.turn.target === null) return null;
      if (combat.turn.index === 0) return null;
      if (combat.result) return null;
      return combat.turn;
    }).addListener((turn) => {
      if (!turn) return;
      console.log('------ Phase 1. Dice:', turn);
      // setCombatPhase('dice');
      this.throwDice(turn.target);
    });

    // phase 2: Resolve.
    // Can be normal or overhead mode
    // Calculate winner and number of attacks
    // Spawn attack icons
    StateObserver.createSelector(({ combat }) => {
      if (!combat.result) return null;
      if (combat.result.attacking) return null;
      return combat.result;
    }).addListener((result: CombatResult) => {
      if (!result) return;

      console.log('------ Phase 2. Resolve:', result);
      // setCombatPhase('resolve');

      this.resolveMeters(result);
      this.createAttackIcons(result);
    });

    // phase 3: Attack.
    // One action per attack
    // Calculate damage and apply it to enemy
    StateObserver.createSelector(({ combat }) => {
      if (!combat.result) return null;
      if (!combat.result.winner) return null;
      if (combat.result.attacks === 0) return null;
      if (!combat.result.attacking) return null;
      return combat.result;
    }).addListener((result) => {
      if (!result) return;

      console.log('------ Phase 3. Attack:', result);
      // setCombatPhase('attack');

      // start attacking sequence
      const t = 350;
      for (let i = 0; i < result.attacks; i++) {
        waitForIt(() => {
          this.attack(i, result);
        }, i * t);
      }

      // finish attack phase
      waitForIt(() => endTurn(), t + result.attacks * t);
    });

    // phase 4: Turn End.
    // switch active player
    // Wait for user to play, or initialize ai to throw a dice
    StateObserver.createSelector(({ combat }) => {
      if (combat.result) return;
      if (combat.hero.meter > 0 || combat.monster.meter > 0) return null;
      return true;
    }).addListener((isTurnEnding) => {
      if (!isTurnEnding) return;
      console.log('------ Phase 4. End Turn:', isTurnEnding);
      // setCombatPhase('end');
      this.components.hero.meter.reset(0);
      this.components.monster.meter.reset(0);
    });
  }

  // ============================================================
  // Phase 1: Dice

  throwDice(target: Target) {
    // get last meter position
    const lastMeter = getCurrentMeter(target);

    // throw dice
    const dice = getRandomInt(1, 6);

    // calucate and resolve possible overhead
    if (this.checkAndResolveOverhead(target, lastMeter, dice)) return;

    // update redux meter
    const currentMeter = updateMeter(target, dice);

    // refresh both meters
    const enemy = getTargetEnemy(target);
    this.components[target].meter.refresh(getCurrentMeter(enemy), true);
    this.components[enemy].meter.refresh(getCurrentMeter(target), false);

    // log target turn
    console.log(
      '>>>',
      target,
      'threw a',
      `(+${dice} dice)`,
      'and updated meter from',
      lastMeter,
      'to',
      currentMeter,
    );
  }

  checkAndResolveOverhead(target, lastMeter, dice) {
    // calucate overhead
    const overhead = lastMeter + dice - 12;
    if (overhead <= 0) return false;

    // log target overhead info
    console.log(
      '>>>',
      target,
      'threw a',
      `(+${dice} dice)`,
      'and updated meter from',
      lastMeter,
      'to',
      lastMeter + dice,
      'with an overhead of',
      overhead,
    );

    // redux: resolve combat overhead
    resolveCombatOverhead(target, overhead);

    // reset target meter to current overhead
    // resetMeter(target);
    // this.components[target].meter.reset(overhead);

    return true;
  }

  // ============================================================
  // Phase 2: Resolve

  resolveMeters(result: CombatResult) {
    const { winner, loser, attacks } = result;
    if (winner && loser) {
      this.components[winner].meter.resolveTo(attacks);
      this.components[loser].meter.resolveTo(0);
      updateMeter(winner, attacks);
      updateMeter(loser, 0);
    } else {
      this.components.hero.meter.resolveTo(0, false);
      this.components.monster.meter.resolveTo(0, false);
      updateMeter('hero', 0);
      updateMeter('monster', 0);
    }
  }

  createAttackIcons(result: CombatResult) {
    const { winner, attacks } = result;
    this.components[winner].attackIcons.createIcons(attacks, 900, () => {
      executeAttacks(); // redux: set attacking flag
    });
  }

  // ============================================================
  // Phase 3: Attack

  private attack(index: number, result: CombatResult) {
    const { winner, loser, attacks } = result;
    const combat = StateObserver.getState().combat;
    const damage = combat[winner].damage - combat[loser].armour;
    console.log('>>>', winner, 'is attacking for', damage, 'damage');

    // remove icon
    this.components[winner].attackIcons.removeIcon();

    // remove loser's HP
    addHp(loser, -damage);

    // animate screen effect
    animate(this.container)
      .clear()
      .wait(100)
      .then({ scale: 1.25 }, 50, animate.easeInOut)
      .then({ scale: 1 }, 50, animate.easeOut);

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

  // calculateNumberOfAttacks(target: Target) {
  //   const targetMeter = getCurrentMeter(target);
  //   const enemyMeter = getCurrentMeter(getTargetEnemy(target));
  //   return Math.max(targetMeter - enemyMeter, 0);
  // }

  // calculateNumberOfAttacksOverhead(target: Target, overhead: number) {
  //   // we are passing the loser target here, so get his enemy for the winner
  //   const enemyMeter = getCurrentMeter(getTargetEnemy(target));
  //   return Math.abs(overhead - enemyMeter);
  // }

  // private createSelectors() {
  //   const t = 500;
  //   // hero wins

  //   StateObserver.createSelector(
  //     ({ combat }) => combat.hero.attackIcons,
  //   ).addListener((attackIcons) => {
  //     console.log('    hero attack icons', attackIcons);
  //     if (attackIcons === 0) {
  //       waitForIt(() => {
  //         console.log('>>> resetting combat');
  //         resetCombat();
  //       }, t);
  //       return;
  //     }
  //   });

  //   StateObserver.createSelector(
  //     ({ combat }) => combat.hero.attacks,
  //   ).addListener((attack) => {
  //     if (attack === 0) return;
  //     console.log('     hero attacking monster', attack);
  //     this.attack('hero', 'monster');
  //   });

  //   // monster wins

  //   StateObserver.createSelector(
  //     ({ combat }) => combat.monster.attacks,
  //   ).addListener((attack) => {
  //     if (attack === 0) return;
  //     console.log('     monster attacking hero', attack);
  //     this.attack('monster', 'hero');
  //   });

  //   StateObserver.createSelector(
  //     ({ combat }) => combat.monster.attackIcons,
  //   ).addListener((attackIcons) => {
  //     console.log('    monster attack icons', attackIcons);
  //     if (attackIcons === 0) {
  //       waitForIt(() => {
  //         console.log('>>> resetting combat');
  //         resetCombat();
  //       }, t);
  //     }
  //   });
  // }

  // private attack(attacker: Target, defender: Target) {
  //   const combat = StateObserver.getState().combat;
  //   const damage = combat[attacker].damage - combat[defender].armour;
  //   console.log('    ', attacker, 'damage', damage);

  //   // remove defender's HP
  //   addHp(defender, -damage);

  //   // animate screen effect
  //   animate(this.container)
  //     .clear()
  //     .wait(100)
  //     .then({ scale: 1.15 }, 50, animate.easeInOut)
  //     .then({ scale: 1 }, 50, animate.easeOut);

  //   // create damage label
  //   const d = defender === 'hero' ? 1 : -1;
  //   const labelDamage = new LangBitmapFontTextView({
  //     ...uiConfig.bitmapFontText,
  //     superview: this.container,
  //     font: bitmapFonts('TitleStroke'),
  //     localeText: () => `${damage}`,
  //     x: this.container.style.width / 2,
  //     y: this.container.style.height / 2 - 20 + d * 85,
  //     size: 20,
  //     color: 'yellow',
  //     scale: 0,
  //     zIndex: 100,
  //     centerOnOrigin: true,
  //     centerAnchor: true,
  //   });

  //   // animate damage label
  //   const y = this.container.style.height / 2 - 20 + d * 160;
  //   animate(labelDamage)
  //     .clear()
  //     .wait(150)
  //     .then({ scale: 1 }, 100, animate.easeInOut)
  //     .then({ y, opacity: 0 }, 600, animate.linear)
  //     .then({ scale: 0 }, 100, animate.easeInOut)
  //     .then(() => {
  //       labelDamage.removeFromSuperview();
  //     });
  // }

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

    this.components = {
      hero: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: this.container.style.height * 0.5 + 35,
          width: 220,
          height: 50,
          target: 'hero',
          stepLimit: 12,
        }),

        attackIcons: new AttackIcons({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: this.container.style.height * 0.5 + 105,
          target: 'hero',
        }),
      },

      monster: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: this.container.style.height * 0.5 - 35,
          width: 220,
          height: 50,
          target: 'monster',
          stepLimit: 12,
        }),
        attackIcons: new AttackIcons({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: this.container.style.height * 0.5 - 110,
          target: 'monster',
        }),
      },
    };

    // const buttonHero = new ButtonScaleViewWithText({
    //   ...uiConfig.buttonMenu,
    //   superview: this.container,
    //   x: this.container.style.width * 0.33,
    //   y: this.container.style.height - 30,
    //   width: 80,
    //   height: 40,
    //   centerOnOrigin: true,
    //   centerAnchor: true,
    //   labelOffsetY: -3,
    //   localeText: () => 'Hero',
    //   size: 16,
    //   font: bitmapFonts('TitleStroke'),
    //   onClick: () => {
    //     updateTurn();
    //   },
    // });

    // const buttonMonster = new ButtonScaleViewWithText({
    //   ...uiConfig.buttonMenu,
    //   superview: this.container,
    //   x: this.container.style.width * 0.66,
    //   y: this.container.style.height - 30,
    //   width: 80,
    //   height: 40,
    //   centerOnOrigin: true,
    //   centerAnchor: true,
    //   labelOffsetY: -3,
    //   localeText: () => 'Monster',
    //   size: 16,
    //   font: bitmapFonts('TitleStroke'),
    //   onClick: () => {
    //     updateTurn();
    //   },
    // });
  }
}
