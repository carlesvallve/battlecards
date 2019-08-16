import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import {
  getScreenDimensions,
  getRandomItemFromArray,
  getRandomItemsFromArr,
} from 'src/lib/utils';
import uiConfig, { animDuration } from 'src/lib/uiConfig';
import { getRandomCardID } from 'src/redux/shortcuts/cards';
import ruleset from 'src/redux/ruleset';
import { CardType, CombatResult, Target, CardPlayType } from 'src/types/custom';
import { CardData, CardID } from 'src/redux/ruleset/cards';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import bitmapFonts from 'src/lib/bitmapFonts';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';

type Props = { superview: View; zIndex: number; target: Target };

const maxCards = 5;

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private active: boolean;
  private deckCards: Card[];
  private handCards: Card[];
  private activeCards: Card[];
  private usedCards: Card[];
  private cardDetails: BattleCardDetails;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  init() {
    // this.createDeckCards(this.props);
    this.createHandCards(this.props);
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

    this.cardDetails = new BattleCardDetails({
      superview: this.container,
      zIndex: 2,
      cardHasBeenPlayedHandler: this.cardHasBeenPlayed.bind(this),
    });
  }

  // ===================================================

  createHandCards(props: Props) {
    this.handCards = [];
    this.activeCards = [];
    this.usedCards = [];

    for (let i = 0; i < maxCards; i++) {
      const card = this.createRandomCard(i);
      this.handCards.push(card);
    }

    this.updateCardHandPositions();
  }

  private createRandomCard(i: number) {
    const id = getRandomCardID();

    const card = new Card({
      superview: this.container,
      id,
      side: 'front',
      mode: 'mini',
      x: 40 + i * 60,
      y: this.getBasePosY(),
      r: 0,
      scale: 0.225,
      onClick: () => this.cardDetails.showCardDetails(card),
    });

    return card;
  }

  addRandomCardToDeck(index: number = 0) {
    // add a new random card to cards array
    const newCard = this.createRandomCard(index);
    this.handCards.splice(index, 0, newCard);
    this.updateCardHandPositions();
  }

  // ===================================================

  private updateCardHandPositions() {
    // todo: locate cards in an arc (?)
    // const rotations = [-0.25, -0.125, 0, 0.125, 0.25];
    // const ys = [0, -12, -15, -12, 0];

    // if (this.active) sounds.playSound('swoosh4', 0.1);

    const screen = getScreenDimensions();
    const center = screen.width / 2;
    const max = this.handCards.length - 1;
    const dx = 60;

    const t = animDuration; //this.active ? animDuration : 0;

    this.handCards.forEach((card, index) => {
      const x = center - (max * dx) / 2 + index * dx;
      const y = this.getBasePosY();

      animate(card.getView())
        // .clear()
        .then({ x, y }, t, animate.easeInOut);
    });
  }

  private updateCardStatusPositions() {
    const screen = getScreenDimensions();
    const center = screen.height * ruleset.baselineY + 35;
    const max = this.activeCards.length - 1;
    const dy = 50;

    const t = animDuration; //this.active ? animDuration : 0;

    this.activeCards.forEach((card, index) => {
      const x = screen.width - 32;
      const y = center - max * dy + index * dy;

      animate(card.getView())
        .clear()
        .then({ x, y }, t, animate.easeInOut);
    });
  }

  private getBasePosY() {
    const screen = getScreenDimensions();
    const baseY = screen.height - 130;
    return baseY + (this.active ? 0 : 30);
  }

  // ===================================================

  showHand() {
    if (this.active) return;

    // if we have less than maxCards, add random cards to deck
    const cardsToAdd = maxCards - this.handCards.length;
    if (cardsToAdd > 0) {
      for (let i = 0; i < cardsToAdd; i++) {
        this.addRandomCardToDeck(0);
      }
    }

    sounds.playSound('swoosh1', 0.1);
    this.active = true;

    this.handCards.forEach((card, index) => {
      card.getView().show();
      animate(card.getView()).then(
        { y: this.getBasePosY(), opacity: 1 },
        animDuration,
        animate.easeInOut,
      );
    });
  }

  hideHand() {
    if (!this.active) return;

    sounds.playSound('swoosh1', 0.1);
    this.active = false;

    this.handCards.forEach((card, index) => {
      animate(card.getView())
        .then(
          { y: this.getBasePosY(), opacity: 0 },
          animDuration,
          animate.easeInOut,
        )
        .then(() => card.getView().hide());
    });
  }

  // ===================================================

  cardHasBeenPlayed(card: Card, remainActive: boolean = false) {
    // get position of card in array
    const index = this.handCards.map((el) => el).indexOf(card);

    // remove card from cards array
    const removedCard = this.handCards.splice(index, 1)[0];

    // put card in used or active deck
    if (remainActive) {
      this.activeCards.push(removedCard); // equipment, status cards
    } else {
      this.usedCards.push(removedCard); // modifiers, instant cards
    }

    console.log(
      '>>> Card has been played',
      card.getID(),
      `cards: ${this.handCards}`,
      `usedCards: ${this.usedCards}`,
      `activeCards: ${this.activeCards}`,
    );

    // reposition remaining cards
    this.updateCardHandPositions();
    this.updateCardStatusPositions();
  }

  activeCardHasBeenPlayed(card: Card) {
    // get position of card in array
    const index = this.activeCards.map((el) => el).indexOf(card);

    // remove card from active cards array
    const removedCard = this.activeCards.splice(index, 1)[0];

    // put card in used deck
    this.usedCards.push(removedCard);

    // reposition remaining cards
    this.updateCardStatusPositions();
  }

  returnCardToHand(card: Card) {
    // get position of card in array
    const index = this.activeCards.map((el) => el).indexOf(card);

    // remove card from active cards array
    const removedCard = this.activeCards.splice(index, 1)[0];

    // put card in hand deck
    this.handCards.push(removedCard);

    // reposition remaining cards
    this.updateCardHandPositions();
    // this.updateCardStatusPositions();
  }

  returnActiveCardsToHand(winner: Target) {
    // get active cards that cannot be played
    let cardsToDiscard = [];
    if (winner) {
      const isWin = winner === this.props.target;
      cardsToDiscard = this.getActiveCardsOfPlayType(
        isWin ? 'defensive' : 'offensive',
      );
    } else {
      cardsToDiscard = this.activeCards;
    }

    // return discarded cards to hand
    cardsToDiscard.forEach((card, index) => {
      const delay = index * animDuration * 0.5;
      card.displayAsHand(delay, () => this.returnCardToHand(card));
    });
  }

  // ===================================================

  getActiveCards(): Card[] {
    console.log('==== activeCards', this.activeCards);
    return this.activeCards;
  }

  getActiveCardsOfType(type: CardType): Card[] {
    return this.activeCards.filter((card, index) => {
      return ruleset.cards[card.getID()].type === type;
    });
  }

  getActiveCardsOfPlayType(type: CardPlayType): Card[] {
    return this.activeCards.filter((card, index) => {
      return ruleset.cards[card.getID()].playType === type;
    });
  }
}
