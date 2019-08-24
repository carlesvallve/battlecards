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
  kill,
} from 'src/redux/shortcuts/combat';

import ProgressMeter from './ProgressMeter';
import AttackIcons from './AttackIcons';
import MonsterImage from './MonsterImage';
import BattleCardNumbers from './BattleCardNumbers';
import BattleCardHand from './BattleCardHand';
import BattleHeader from './BattleHeader';
import BattleFooter from './BattleFooter';
import BattleOverlay from './BattleOverlay';

import {
  CombatResult,
  Combat,
  Target,
  TargetStat,
  CardType,
} from 'src/types/custom';
import BattleCardDeck from './BattleCardDeck';
import Card from '../cards/Card';

type Props = {
  superview: View;
};

export default class BattleArena {
  private props: Props;
  private container: View;
  private header: BattleHeader;
  private footer: BattleFooter;
  private battleGround: View;
  private monsterImage: MonsterImage;
  private cardDeck: BattleCardDeck;
  private overlay: BattleOverlay;

  private components: {
    hero: {
      meter: ProgressMeter;
      attackIcons: AttackIcons;
      cardNumbers: BattleCardNumbers;
      cardHand: BattleCardHand;
    };
    monster: {
      meter: ProgressMeter;
      attackIcons: AttackIcons;
      cardNumbers: BattleCardNumbers;
      cardHand: BattleCardHand;
    };
  };

  /*
  - on entering game, hero deck is generated, and first cards assigned to hero hand
  - on entering new combat, monster is generated, monster deck is generated and first crds assigned to monster hand
  */

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  init() {
    // this.cardDeck.init();
    this.startGame();
  }

  startGame() {
    // display footer and header
    this.header.init();
    this.footer.init();

    // generate card-number decks
    this.components.hero.cardNumbers.init();
    this.components.monster.cardNumbers.init();

    // generate card decks
    this.components.hero.cardHand.init();
    this.components.monster.cardHand.init();

    // generate a new combat
    newCombat(getRandomMonsterID());
  }

  endGame() {
    // display footer and header
    this.header.reset();
    this.footer.reset();

    // reset card-number decks
    this.components.hero.cardNumbers.reset();
    this.components.monster.cardNumbers.reset();

    // reset card decks
    this.components.hero.cardHand.reset();
    this.components.monster.cardHand.reset();
  }

  private createSelectors() {
    // ==========================================
    // new combat

    StateObserver.createSelector(({ ui, combat }) => {
      if (ui.scene !== 'game') return;

      return combat.index.combat;
    }).addListener((combatIndex) => {
      if (!combatIndex) return;
      console.log('############## New Combat Started ##############');
      // make a new deck for new monster.
      // Probably this should be moved on some kind of monster generation class
      this.components.monster.cardHand.reset();
      this.components.monster.cardHand.init();
    });

    // ==========================================
    // combat flow

    StateObserver.createSelector(({ ui, combat }) => {
      if (ui.scene !== 'game') return;

      return combat.index;
    }).addListener((index) => {
      const { combat } = StateObserver.getState();
      // console.log('combat-flow: ---------', index);
      if (combat.hero.isDead) return;
      if (combat.monster.isDead) return;

      if (combat.index.turn === 0) {
        return;
      }

      // unblock ui in case monster resolved and hero can keep playing
      if (combat.target === 'hero' && combat.monster.resolved) {
        blockUi(false);
      }

      // update monster image
      const id = combat.monster.id;
      if (id) this.monsterImage.setImage(ruleset.monsters[id].image);

      // check for combat resolve
      if (this.checkCombatResult(combat)) return;

      // both meters need to refresh their colors
      // since they depend on each other
      this.components.hero.meter.updateMeterColors();
      this.components.monster.meter.updateMeterColors();

      // update the turn index so the selector triggers again
      this.updateTurn(combat);
    });

    // ==========================================
    // target damage and kills

    (['hero', 'monster'] as Target[]).forEach((target) => {
      const lastHP = { hero: 0, monster: 0 };
      StateObserver.createSelector(({ ui, combat }) => {
        if (ui.scene !== 'game') return;
        return combat[target].stats.hp;
      }).addListener((value: TargetStat) => {
        if (!value) return;

        // escape if is the beginning of the combat
        const { combat } = StateObserver.getState();
        if (combat.index.turn === 1) {
          lastHP[target] = value.current;
          return;
        }

        // get damage
        const damage = lastHP[target] - value.current;

        console.log(
          `  - ${target} ${lastHP[target]} -> ${value.current} = ${damage}`,
        );

        // update local last hp
        lastHP[target] = value.current;

        if (damage > 0) {
          // render damage on target
          this.playDamageAnimation(target, damage);

          // check if we have to kill the target,
          // once the enemy has ended all attacks
          const enemy = target === 'hero' ? 'monster' : 'hero';
          const attacks = this.getAttacksTotal(enemy);
          if (attacks === 0 && value.current <= 0) {
            console.log('killing target...');
            kill(target);
          }
        }
      });
    });

    // ==========================================
    // deaths

    (['hero', 'monster'] as Target[]).forEach((target) => {
      StateObserver.createSelector(({ ui, combat }) => {
        if (ui.scene !== 'game') return;
        return combat[target].isDead;
      }).addListener((targetIsDead) => {
        if (!targetIsDead) return;

        // hide meters
        this.displayMeters(false);

        // all active cards are returned to both contender hands
        this.components.hero.cardHand.returnActiveCardsToHand(null);
        this.components.monster.cardHand.returnActiveCardsToHand(null);

        // if hero died, reset all combat components.
        // Gameover component will be displayed by itself
        if (target === 'hero') {
          this.endGame();
          return;
        }

        // if monster died, render death and genearte a new combat
        if (target === 'monster') {
          this.monsterImage.playDeathAnimation();
          waitForIt(() => {
            newCombat(getRandomMonsterID());
          }, animDuration * 5);
        }
      });
    });

    // ==========================================
  }

  // ============================================================

  private createViews(props: Props) {
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

        cardHand: new BattleCardHand({
          superview: this.container,
          target: 'hero',
          zIndex: 1,
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

        cardHand: new BattleCardHand({
          superview: this.container,
          target: 'monster',
          zIndex: 1,
        }),
      },
    };

    // this.cardDeck = new BattleCardDeck({
    //   superview: this.container,
    //   zIndex: 1,
    //   target: 'hero',
    //   startGame: this.startGame.bind(this),
    // });

    this.header = new BattleHeader({
      superview: this.container,
    });

    this.footer = new BattleFooter({
      superview: this.container,
    });
  }

  // ============================================================

  private displayMeters(value: boolean) {
    if (value) {
      this.components.hero.meter.showMeter();
      this.components.monster.meter.showMeter();
      this.monsterImage.playAttackAnimationEnd();
    } else {
      this.components.hero.meter.hideMeter();
      this.components.monster.meter.hideMeter();
      this.components.hero.cardHand.hideHand();
      this.components.monster.cardHand.hideHand();
      this.monsterImage.playAttackAnimationStart();
    }
  }

  private checkCombatResult(combat: Combat) {
    const { target, enemy } = combat;

    // if someone overheaded, resolve the combat as an overhead
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

    // if it's a draw, resolve the combat as a draw
    if (combat[target].meter === combat[enemy].meter) {
      this.resolveCombatDraw();
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

  private resolveCombatDraw() {
    sounds.playSound('item2', 0.7);
    sounds.playSound('error1', 0.5);
    this.components.hero.cardHand.hideHand();
    this.components.monster.cardHand.hideHand();

    waitForIt(() => {
      sounds.playSound('item3', 0.7);
      waitForIt(() => {
        resetCombatTurn();

        // return unused active cards to hand
        this.components.hero.cardHand.returnActiveCardsToHand(null);
        this.components.monster.cardHand.returnActiveCardsToHand(null);
      }, 150);
    }, 350);
  }

  // =====================================================
  // Attack building phase

  private resolveCombat(result: CombatResult) {
    const { winner, loser, attacks, isOverhead } = result;

    // update meters to combat result
    setMeter(winner, attacks);
    setMeter(loser, 0);

    // hide the user's card hand
    this.components.hero.cardHand.hideHand();
    this.components.monster.cardHand.hideHand();

    // create attack icons
    waitForIt(() => {
      this.createAttackIcons(result, () => {
        this.applyAdditionalAttacks(result, () => {
          this.applyAdditionalBlocks(result, () => {
            // all active cards that cannot be played are returned to the user hand
            this.components[winner].cardHand.returnActiveCardsToHand(winner);
            this.components[loser].cardHand.returnActiveCardsToHand(winner);

            // set final number of attacks
            result.attacks = this.getAttacksTotal(winner);

            // escape if all attacks were blocked
            if (result.attacks <= 0) {
              resetCombatTurn();
              return;
            }

            // start attacking sequence
            this.startAttackingSequence(result, () => {
              waitForIt(() => resetCombatTurn(), 150);
            });
          });
        });
      });
    }, animDuration * 2);
  }

  private createAttackIcons(result: CombatResult, cb: () => void) {
    const { winner, loser, attacks } = result;
    if (!winner) return;

    this.components[winner].attackIcons.addIcons(attacks, () => {
      cb && cb();
    });
  }

  private getAttacksTotal(target: Target) {
    return this.components[target].attackIcons.getIcons().length;
  }

  private applyAdditionalAttacks(result: CombatResult, cb: () => void) {
    const { winner } = result;
    this.addEffectFromActiveCard(winner, winner, 'weapon', () => {
      cb && cb();
    });
  }

  private applyAdditionalBlocks(result: CombatResult, cb: () => void) {
    const { winner, loser } = result;
    this.addEffectFromActiveCard(loser, winner, 'shield', () => {
      cb && cb();
    });
  }

  private addEffectFromActiveCard(
    target: Target,
    winner: Target,
    cardType: CardType,
    cb: () => void,
  ) {
    // get remaining cards of given type to be played
    const cards = this.components[target].cardHand.getActiveCardsOfType(
      cardType,
    );

    // return if no there are no active cards left to play
    if (cards.length === 0) {
      console.log(`>>> no additional ${cardType}s. returning callback...`);
      cb && cb();
      return;
    }

    // return if next card to be played is a shield, and winner has no attacks left
    if (cardType === 'shield' && this.getAttacksTotal(winner) === 0) {
      console.log(
        `>>> no additional attacks to be blocked by a ${cardType}. returning callback...`,
      );
      cb && cb();
      return;
    }

    // get next card to be played and play it
    const card = cards[0];
    this.playActiveCard(card, winner, () => {
      this.components[target].cardHand.activeCardHasBeenPlayed(card);
      console.log(`>>>> played ${cardType} card`, cards.length);

      // iterate recursively
      waitForIt(() => {
        this.addEffectFromActiveCard(target, winner, cardType, cb);
      }, animDuration);
    });
  }

  private playActiveCard(card: Card, winner: Target, cb: () => void) {
    console.log('PLAYING ACTIVE CARD', card.getID());

    // decide how many attacks will be added or removed
    const { playType, value } = ruleset.cards[card.getID()];

    const attacks = this.getAttacksTotal(winner);
    const attackNum = playType === 'offensive' ? attacks : -attacks;

    const screen = getScreenDimensions();
    let x = screen.width * 0.5 + (attackNum * 40) / 2;
    let y = screen.height - 120;

    if (winner === 'monster') {
      x = screen.width * 0.5 + (attackNum * 40) / 2;
      y = 120;
    }

    card.displayAsAlteringAttacks(x, y, () => {
      const t = animDuration * 2;

      for (let i = 0; i < value.min; i++) {
        const delay = i * t; // playType === 'offensive' ? i * t : 0;

        waitForIt(() => {
          if (playType === 'offensive') {
            this.components[winner].attackIcons.addIcon();
          } else {
            this.components[winner].attackIcons.removeIcon();
          }

          console.log('>>> adding attack', i, '/', value.min - 1);
          if (i === value.min - 1) {
            console.log('>>> all attacks added. returning callback');
            cb && cb();
          }
        }, delay);
      }
    });
  }

  // =====================================================
  // Attack execution phase

  private startAttackingSequence(result: CombatResult, cb: () => void) {
    // hide meters
    this.displayMeters(false);

    const t = 350;

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

    // remove icon
    this.components[winner].attackIcons.removeIcon();

    // calculate damage
    const atk = combat[winner].stats.attack.current;
    const def = combat[loser].stats.defense.current;
    const damage = atk - def;

    // remove HP from loser
    addStat(loser, 'hp', { current: -damage });

    // add EP to winner
    addStat(winner, 'ep', { current: 5 });

    // execute next attack
    waitForIt(() => cb && cb(), 350);
  }

  private playDamageAnimation(loser: Target, damage: number) {
    // render damage on target

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

    sounds.playRandomSound(['swoosh1', 'swoosh3'], 0.15);

    animate(this.battleGround)
      .clear()
      .wait(150)
      .then(() => {
        if (Math.random() < 0.5) {
          sounds.playSound('punch1', 0.75);
        } else {
          sounds.playSound('punch2', 0.25);
        }
        if (Math.random() < 0.5) {
          sounds.playSound('punch1', 0.75);
        } else {
          sounds.playSound('punch2', 0.25);
        }
        sounds.playRandomSound(['break1', 'break1'], 0.05);

        // sounds.playRandomSound(['sword1', 'sword2', 'sword3'], 0.05);
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

  // =====================================================

  private executeAi(combat: Combat) {
    const target = changeTarget('monster');
    console.log('combat-flow: executing monster AI');

    // decide if we throw another dice or we resolve
    const currentMeter = combat[target].meter;
    const left = combat[target].stats.maxSteps - currentMeter;

    const precaucious = 1.0; // 0: agressive 1: normal 2: coward
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

  // =====================================================

  private updateTurn(combat: Combat) {
    if (combat.hero.isDead || combat.monster.isDead) return;

    console.log('combat-flow: UPDATE TURN', combat.index.turn, combat);

    let { target, enemy } = combat;

    // if is the start of a new turn
    if (combat.index.turn === 1) {
      this.initializeNewCombatTurn(combat);
    }

    this.displayMeters(true);

    if (target === 'hero' || combat['hero'].resolved) {
      // is monster turn
      if (!combat['monster'].resolved) {
        waitForIt(() => this.executeAi(combat), 500);
      }
    } else {
      // turn is done
      waitForIt(() => {
        console.log('*************************************************');
        this.components.hero.cardHand.showHand();
        this.components.monster.cardHand.showHand();
        if (!combat[enemy].resolved) target = changeTarget();
        blockUi(target !== 'hero');
      }, animDuration * 2);
    }
  }

  private initializeNewCombatTurn(combat: Combat) {
    // update +5 EP points to both contenders
    addStat('hero', 'ep', { current: 5 });
    addStat('monster', 'ep', { current: 5 });
  }
}
