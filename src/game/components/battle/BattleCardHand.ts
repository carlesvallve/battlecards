import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import { getScreenDimensions } from 'src/lib/utils';
import { animDuration } from 'src/lib/uiConfig';
import { getRandomCardID } from 'src/redux/shortcuts/cards';
import ruleset from 'src/redux/ruleset';
import { CardType, Target, CardPlayType } from 'src/types/custom';
import StateObserver from 'src/redux/StateObserver';

type Props = { superview: View; zIndex: number; target: Target };

// const maxCards = 5;

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private active: boolean = false;
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
    this.createHandCards(this.props);
  }

  reset() {
    // destroy all cards
    this.handCards = this.destroyDeck(this.handCards);
    this.usedCards = this.destroyDeck(this.usedCards);
    this.activeCards = this.destroyDeck(this.activeCards);
  }

  private destroyDeck(cards: Card[]) {
    cards.forEach((card) => {
      card.getView().removeFromSuperview();
    });
    return [];
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      // backgroundColor: 'rgba(255, 255, 0, 0.1)',
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
      target: props.target,
      zIndex: 2,
      cardHasBeenPlayedHandler: this.cardHasBeenPlayed.bind(this),
    });
  }

  // ===================================================

  private getMaxCards() {
    const { target } = this.props;
    return StateObserver.getState().combat[target].stats.maxCards;
  }

  private createHandCards(props: Props) {
    this.handCards = [];
    this.activeCards = [];
    this.usedCards = [];

    // on start, we want to shuffle the deck, then put the first 5 cards in to the hand
    // each time we need to pick a new card, we'll get it from the first position of the deck
    // each time we use or discard a card, we'll add it to the last position of the deck
    // when the deck is empty, or we use the last original card, it will be reshuffled

    // const { target } = props;
    // const maxCards = StateObserver.getState().combat[target].stats.maxCards;

    for (let i = 0; i < this.getMaxCards(); i++) {
      const card = this.createRandomCard(i);
      this.handCards.push(card);
    }

    this.updateCardHandPositions();

    console.log(
      '### createHandCards',
      this.props.target,
      this.getMaxCards(),
      this.handCards,
    );
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
      scale: this.getBaseScale(), // 0.225,
      onClick: () => this.cardDetails.showCardDetails(card),
    });

    return card;
  }

  private addRandomCardToDeck(index: number = 0) {
    // add a new random card to cards array
    const newCard = this.createRandomCard(index);
    this.handCards.splice(index, 0, newCard);
    this.updateCardHandPositions();
  }

  // ===================================================

  private updateCardHandPositions() {
    // if (this.active) sounds.playSound('swoosh4', 0.1);

    const screen = getScreenDimensions();
    const center = screen.width / 2;
    const max = this.handCards.length - 1;
    const dx = this.props.target === 'hero' ? 60 : 60 * 0.58; //0.465;

    const t = animDuration;

    this.handCards.forEach((card, index) => {
      const x = center - (max * dx) / 2 + index * dx;
      const y = this.getBasePosY();

      animate(card.getView()).then({ x, y }, t, animate.easeInOut);
    });
  }

  private updateCardActivePositions() {
    const screen = getScreenDimensions();
    const dTarget = this.props.target === 'hero' ? 35 : -35 * 3;
    const center = screen.height * ruleset.baselineY + dTarget;
    const max = this.activeCards.length - 1;
    const dy = 50; // this.props.target === 'hero' ? 50 : 200;

    const t = animDuration;

    this.activeCards.forEach((card, index) => {
      const x = this.props.target === 'hero' ? screen.width - 32 : 32;
      const y = center - max * dy + index * dy;

      animate(card.getView())
        .clear()
        .then({ x, y }, t, animate.easeInOut);
    });
  }

  private getBasePosY() {
    const screen = getScreenDimensions();
    const baseY = this.props.target === 'hero' ? screen.height - 130 : 95 + 10;
    const dy = this.props.target === 'hero' ? 30 : -30;
    return baseY + (this.active ? 0 : dy);
  }

  private getBaseScale() {
    const scale = this.props.target === 'hero' ? 0.225 : 0.225 * 0.58; //0.465;
    return scale;
  }

  // ===================================================

  showHand() {
    // console.log('############## cardHand showHand', this.active);
    if (this.active) return;

    // if we have less than maxCards, add random cards to deck
    const cardsToAdd = this.getMaxCards() - this.handCards.length;
    if (cardsToAdd > 0) {
      for (let i = 0; i < cardsToAdd; i++) {
        this.addRandomCardToDeck(0);
      }
    }

    // if (this.props.target === 'hero')
    sounds.playSound('swoosh4', 0.025);
    this.active = true;

    this.handCards.forEach((card) => {
      card.getView().show();
      animate(card.getView()).then(
        { y: this.getBasePosY(), opacity: 1 },
        animDuration * 1,
        animate.easeOut,
      );
    });
  }

  hideHand() {
    // console.log('############## cardHand hideHand', this.active);
    if (!this.active) return;

    // if (this.props.target === 'hero')
    sounds.playSound('swoosh4', 0.025);
    this.active = false;

    this.handCards.forEach((card) => {
      animate(card.getView())
        .then(
          { y: this.getBasePosY(), opacity: 0 },
          animDuration * 1,
          animate.easeOut,
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
    this.updateCardActivePositions();
  }

  activeCardHasBeenPlayed(card: Card) {
    // get position of card in array
    const index = this.activeCards.map((el) => el).indexOf(card);

    // remove card from active cards array
    const removedCard = this.activeCards.splice(index, 1)[0];

    // put card in used deck
    this.usedCards.push(removedCard);

    // reposition remaining cards
    this.updateCardActivePositions();

    console.log(
      '>>> active',
      card.getID(),
      'has been played by',
      this.props.target,
    );
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
    // this.updateCardActivePositions();
    console.log('>>>', card.getID(), 'has been returned to', this.props.target);
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
      const delay = index * animDuration * 0.2;
      console.log('>>> returning', card.getID(), 'to hand...');
      card.displayAsReturningToHand(this.props.target, delay, () =>
        this.returnCardToHand(card),
      );
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
