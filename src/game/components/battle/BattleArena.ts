import animate from 'animate';
import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import uiConfig from 'src/lib/uiConfig';
import { getScreenDimensions, waitForIt, getRandomInt } from 'src/lib/utils';

import ProgressMeter from './ProgressMeter';
import AttackIcons from './AttackIcons';

import StateObserver from 'src/redux/StateObserver';
import { Target, CombatResult, CombatTurn } from 'src/types/custom';
import {
  getCurrentMeter,
  addHp,
  getTargetEnemy,
  updateMeter,
  resolveCombatOverhead,
  executeAttacks,
  endTurn,
  setMeter,
} from 'src/redux/shortcuts/combat';

type Props = { superview: View };

export default class BattleArena {
  private props: Props;
  private container: View;
  private components;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
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
      this.throwDice(turn);
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
      this.resolveMeters(result);

      if (result.winner) {
        // someone won, so generate attack icons
        console.log(
          '>>>',
          result.winner,
          'won this turn for',
          result.attacks,
          'attacks',
        );
        this.createAttackIcons(result);
      } else {
        // was a draw, so just end the turn
        console.log('>>> combat turn was a draw');
        endTurn();
      }
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
      console.log('>>>', result.winner, 'is attacking:');
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
      if (combat.turn.index === null) return;
      if (combat.result) return;
      if (combat.hero.meter > 0 || combat.monster.meter > 0) return null;
      return true;
    }).addListener((isTurnEnding) => {
      if (!isTurnEnding) return;

      console.log('------ Phase 4. End Turn:', isTurnEnding);
      this.components.hero.meter.reset();
      this.components.monster.meter.reset();
    });
  }

  // ============================================================
  // Phase 1: Dice

  throwDice(turn: CombatTurn) {
    const  { target, dice } = turn;
    // get last meter position
    const lastMeter = getCurrentMeter(target);

    // throw dice
    // const dice = getRandomInt(1, 6);

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
      'throws a',
      `(+${dice} dice)`,
      'and updates his meter from',
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
      'throws a',
      `(+${dice} dice)`,
      'and updates his meter from',
      lastMeter,
      'to',
      lastMeter + dice,
      'with an overhead of',
      overhead,
    );

    // redux: resolve combat overhead
    resolveCombatOverhead(target, overhead);

    // update meters, both in redux and ui
    const enemy = getTargetEnemy(target);
    this.components[target].meter.reset({ isOverhead: true });
    this.components[enemy].meter.resolveTo(overhead);
    setMeter(target, 0);
    setMeter(enemy, overhead);

    return true;
  }

  // ============================================================
  // Phase 2: Resolve

  resolveMeters(result: CombatResult) {
    const { winner, loser, attacks } = result;

    if (winner && loser) {
      if (!result.isOverhead) {
        // someone won, without overhead
        this.components[winner].meter.resolveTo(attacks);
        this.components[loser].meter.resolveTo(0);
        updateMeter(winner, attacks);
        updateMeter(loser, 0);
      }
    }
  }

  createAttackIcons(result: CombatResult) {
    const { winner, attacks } = result;
    if (!winner) return;
    this.components[winner].attackIcons.addIcons(attacks, 300, () => {
      executeAttacks(); // redux: set attacking flag
    });
  }

  // ============================================================
  // Phase 3: Attack

  private attack(index: number, result: CombatResult) {
    const { winner, loser, attacks } = result;
    const combat = StateObserver.getState().combat;
    const damage = combat[winner].damage - combat[loser].armour;
    console.log('  >>> attack', index + 1, ':', damage, 'damage');

    // remove icon
    this.components[winner].attackIcons.removeIcon();

    // remove loser's HP
    addHp(loser, -damage);

    // animate screen effect
    animate(this.container)
      .clear()
      .wait(50)
      .then({ scale: 1.05 }, 50, animate.easeInOut)
      .then({ scale: 0.95 }, 100, animate.easeInOut)
      .then({ scale: 1 }, 50, animate.easeInOut);

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
      width: screen.width - 0, //20,
      height: screen.height * 1, //0.69,
      x: screen.width * 0.5,
      y: screen.height * 0.5, //0.493,
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

    const y = this.container.style.height * 0.45;

    this.components = {
      hero: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y + 30,
          width: 220,
          height: 50,
          target: 'hero',
          stepLimit: 12,
        }) as ProgressMeter,

        attackIcons: new AttackIcons({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y + 85,
          target: 'hero',
        }) as AttackIcons,
      },

      monster: {
        meter: new ProgressMeter({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y - 30,
          width: 220,
          height: 50,
          target: 'monster',
          stepLimit: 12,
        }) as ProgressMeter,
        attackIcons: new AttackIcons({
          superview: this.container,
          x: this.container.style.width * 0.5,
          y: y - 80,
          target: 'monster',
        }) as AttackIcons,
      },
    };
  }
}
