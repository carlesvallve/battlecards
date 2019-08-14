import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions, getRandomInt, waitForIt } from 'src/lib/utils';

import uiConfig, { animDuration } from 'src/lib/uiConfig';
import Card from '../cards/Card';

import StateObserver from 'src/redux/StateObserver';
import ruleset from 'src/redux/ruleset';
import {
  throwDice,
  addStat,
  getTarget,
  getTargetEnemy,
} from 'src/redux/shortcuts/combat';
import playExplosion from './Explosion';

type Props = {
  superview: View;
  zIndex: number;
  cardHasBeenPlayedHandler: (card: Card, remainActive: boolean) => void;
};

export default class BattleCardDetails {
  private props: Props;
  private container: View;
  private bg: View;
  private buttonUse: View;

  private selectedCardData: {
    card: Card;
    x: number;
    y: number;
    scale: number;
    r: number;
  };

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: false,
      zIndex: props.zIndex,
    });

    this.bg = new ButtonView({
      superview: this.container,
      zIndex: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: true,
      visible: false,
      opacity: 0,
      onClick: () => {
        this.hideCardDetails(false);
      },
    });

    this.buttonUse = new ButtonScaleViewWithText({
      ...uiConfig.buttonGreen,
      superview: this.container,
      zIndex: 3,
      width: screen.width - 80,
      height: 75,
      x: 40,
      y: screen.height + 20,
      labelOffsetY: -3,
      localeText: () => 'USE',
      size: 16,
      font: bitmapFonts('TitleStroke'),
      onClick: () => {
        sounds.playSound('click1', 0.3);
        this.hideCardDetails(true);
      },
    });
  }

  // ===============================================================
  // show / hide card details

  showCardDetails(card: Card) {
    if (card.getMode() === 'full') return;

    console.log('SHOWCARDDETAILS', card.getID());
    sounds.playSound('swoosh4', 0.1);

    this.props.superview.updateOpts({ zIndex: 3 });
    card.getView().updateOpts({ zIndex: 100 });

    const screen = getScreenDimensions();
    const t = animDuration * 1;

    this.bg.show();
    animate(this.bg)
      .clear()
      .wait(0)
      .then({ opacity: 1 }, t, animate.easeOut);

    animate(this.buttonUse)
      .clear()
      .wait(t * 0.5)
      .then({ y: screen.height - 105 }, t, animate.easeInOut);

    const { x, y, scale, r } = card.getView().style;
    this.selectedCardData = { card, x, y, scale, r };
    card.setProps({ mode: 'full', side: 'front' });

    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        { x: screen.width / 2, y: screen.height * 0.45, scale: 0.5, r: r / 2 },
        t * 0.5,
        animate.easeOut,
      )
      .then({ scale: 1.05, r: 0 }, t * 0.5, animate.easeInOut)
      .then({ scale: 0.95 }, t * 0.5, animate.easeInOut);
  }

  hideCardDetails(usingCard: boolean) {
    sounds.playSound('swoosh1', 0.1);

    const screen = getScreenDimensions();

    const t = animDuration;

    const { card, x, y, scale, r } = this.selectedCardData;

    const tempY = screen.height * ruleset.baselineY;

    // animate card to first phase
    animate(card.getView())
      .clear()
      .wait(t * 0.25)
      .then({ scale: scale * 1.35, r: 0, y: tempY }, t * 0.25, animate.easeOut)
      .then(() => {
        // are we using the card, or putting it back?
        if (usingCard) {
          this.playCard(card);
        } else {
          this.placeCardBackToHand();
        }
      });

    // hide button
    animate(this.buttonUse)
      .wait(0)
      .then({ y: screen.height + 20 }, t * 1, animate.easeInOut);

    // hide background
    animate(this.bg)
      .wait(t * 0.5)
      .then({ opacity: 0 }, t, animate.easeOut)
      .then(() => {
        this.props.superview.updateOpts({ zIndex: 1 });
        card.getView().updateOpts({ zIndex: 1 });
        this.bg.hide();
      });
  }

  // ===============================================================
  // Play cards

  placeCardBackToHand() {
    const { card, x, y, scale, r } = this.selectedCardData;

    card.setProps({ mode: 'mini', side: 'front' });
    animate(card.getView())
      .clear()
      .then({ x, y, scale, r }, animDuration * 0.75, animate.easeInOut);
  }

  playCard(card: Card) {
    switch (card.getType()) {
      case 'modifier':
        this.playModifier(card);
        break;
      case 'shield':
      case 'weapon':
        this.playEquipment(card);
        break;
      case 'potion':
        this.playPotion(card);
        break;
      case 'spell':
        this.playSpell(card);
        break;
      default:
        card.displayAsConsumed();
    }
  }

  playModifier(card: Card) {
    // get card data
    const data = ruleset.cards[card.getID()];
    console.log('PLAYING MODIFIER', card.getID(), data);

    // get modifier dice
    let diceModifier = data.value.min;

    if (data.value.randomMode) {
      if (data.value.randomMode === 'BETWEEN') {
        diceModifier = getRandomInt(data.value.min, data.value.max);
      } else if (data.value.randomMode === 'OR') {
        diceModifier = Math.random() < 0.5 ? data.value.min : data.value.max;
      }
    }

    // put card in usedCards array
    this.props.cardHasBeenPlayedHandler(card, false);

    card.displayModifierResult(diceModifier, () => {
      // make the card disappear
      card.displayAsConsumed();

      // throw the redux dice
      const { target } = StateObserver.getState().combat;
      throwDice(target, diceModifier);

      // // throw the redux dice
      // waitForIt(() => {
      //   const { target } = StateObserver.getState().combat;
      //   throwDice(target, diceModifier);
      // }, animDuration);
    });
  }

  playEquipment(card: Card) {
    // get card data
    const data = ruleset.cards[card.getID()];
    console.log('PLAYING EQUIPMENT', card.getID(), data);

    // put card in activeCards array
    this.props.cardHasBeenPlayedHandler(card, true);

    // transform card into status card icon
    card.displayAsStatus(() => {});
  }

  playPotion(card: Card) {
    // get card data
    const data = ruleset.cards[card.getID()];
    console.log('PLAYING POTION', card.getID(), data);

    const screen = getScreenDimensions();
    const x = screen.width * 0.5;
    const y = screen.height - 60;

    card.displayAsInstant(x, y, () => {
      card.displayAsConsumed();
      const target = getTarget(StateObserver.getState());
      addStat(target, data.value.type, { current: data.value.min });
      sounds.playSound('break2', 0.2);
    });

    // put card in usedCards array
    this.props.cardHasBeenPlayedHandler(card, false);
  }

  playSpell(card: Card) {
    // get card data
    const data = ruleset.cards[card.getID()];
    console.log('PLAYING POTION', card.getID(), data);

    const screen = getScreenDimensions();
    const x = screen.width * 0.5;
    const y = screen.height * ruleset.baselineY - 100;

    card.displayAsInstant(x, y, () => {
      card.displayAsConsumed();
      const target = getTarget(StateObserver.getState());
      const enemy = getTargetEnemy(target);
      addStat(enemy, 'hp', { current: -data.value.min });

      // sounds.playSound('break1', 0.2);
      // sounds.playRandomSound(['punch1', 'punch2'], 1);
      playExplosion({
        superview: this.container,
        sc: 1,
        max: 20,
        startX: this.container.style.width / 2,
        startY: this.container.style.height / 2,
      });
    });

    // put card in usedCards array
    this.props.cardHasBeenPlayedHandler(card, false);
  }

  // ===============================================================
}
