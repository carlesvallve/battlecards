import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import {
  getScreenDimensions,
  getRandomItemsFromArr,
  shuffleArray,
} from 'src/lib/utils';
import { animDuration } from 'src/lib/uiConfig';
import ruleset from 'src/redux/ruleset';
import { CardType, Target, CardPlayType } from 'src/types/custom';
import StateObserver from 'src/redux/StateObserver';
import { CardID } from 'src/redux/ruleset/cards';

type Props = { superview: View; zIndex: number; target: Target };

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private active: boolean = false;
  private deck: CardID[];
  private handCards: Card[] = [];
  private activeCards: Card[] = [];
  private cardDetails: BattleCardDetails;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  init() {
    this.deck = this.createDeck();
    this.createHandCards();
  }

  reset() {
    // destroy all cards
    this.deck = [];
    this.handCards = this.destroyCards(this.handCards);
    this.activeCards = this.destroyCards(this.activeCards);
  }

  // ========================================================

  private createDeck(): CardID[] {
    const modifiers = []; // this.getRandomCardsOfType('modifier', 4);
    const weapons = this.getRandomCardsOfType('weapon', 4);
    const shields = this.getRandomCardsOfType('shield', 2);
    const spells = this.getRandomCardsOfType('spell', 2);
    const potions = this.getRandomCardsOfType('potion', 2);

    const deck = [...modifiers, ...weapons, ...shields, ...spells, ...potions];
    const shuffled = shuffleArray(deck);

    console.log('Creating a new', this.props.target, 'deck:', shuffled);
    return shuffled;
  }

  private extractCardFromDeck(): CardID {
    // console.log('#################', this.props.target, this.cards);
    return this.deck.splice(0, 1)[0] as CardID;
  }

  private insertCardInDeck(card: Card) {
    this.deck.push(card.getID());
    // this.destroyCard(card);
  }

  private getRandomCardsOfType(type: CardType, max: number): CardID[] {
    return getRandomItemsFromArr(this.getAllCardsOfType(type), max);
  }

  private getAllCardsOfType(type: CardType): CardID[] {
    return ruleset.cardIds.filter((id) => {
      const card = ruleset.cards[id];
      return card.type === type;
    });
  }

  // public static reshuffle(target: Target) {
  //   shuffleArray(BattleCardDeck.cards[target]);
  // }

  // ========================================================

  private destroyCard(card: Card) {
    if (card) card.getView().removeFromSuperview();
  }

  private destroyCards(cards: Card[]) {
    cards.forEach((card) => this.destroyCard(card));
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

  private createHandCards() {
    this.handCards = [];
    this.activeCards = [];

    for (let i = 0; i < this.getMaxCards(); i++) {
      const id = this.extractCardFromDeck();
      const card = this.createCard(id, i);
      this.handCards.push(card);
    }

    this.updateCardHandPositions();

    console.log(
      'Creating a new',
      this.props.target,
      'card hand:',
      this.handCards,
    );
  }

  private createCard(id: CardID, index: number) {
    const card = new Card({
      superview: this.container,
      id,
      side: 'front',
      mode: 'mini',
      x: 40 + index * 60,
      y: this.getBasePosY(),
      r: 0,
      scale: this.getBaseScale(),
      onClick: () => this.cardDetails.showCardDetails(card),
    });

    return card;
  }

  // ===================================================

  private updateCardHandPositions() {
    if (this.active) sounds.playSound('swoosh4', 0.1);

    const screen = getScreenDimensions();
    const center = screen.width / 2;
    const max = this.handCards.length - 1;
    const dx = this.props.target === 'hero' ? 60 : 60 * 0.58; //0.465;

    const t = animDuration;

    this.handCards.forEach((card, index) => {
      const x = center - (max * dx) / 2 + index * dx;
      const y = this.getBasePosY();

      if (card) {
        animate(card.getView()).then({ x, y }, t, animate.easeInOut);
      }
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
    const scale = this.props.target === 'hero' ? 0.225 : 0.225 * 0.58;
    return scale;
  }

  // ===================================================

  private refillHand() {
    const cardsToAdd = this.getMaxCards() - this.handCards.length;
    if (cardsToAdd <= 0) return;

    for (let i = 0; i < cardsToAdd; i++) {
      // extract first card from deck
      const id = this.extractCardFromDeck();
      const newCard = this.createCard(id, i);
      // add new card to hand
      this.handCards.splice(i, 0, newCard);
    }
    // rearrange hand cards
    this.updateCardHandPositions();
  }

  showHand() {
    if (this.active) return;

    // if we have less than maxCards, refill hand with cards from deck
    this.refillHand();

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
    if (!this.active) return;

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

    // put card in active cards, or return it to normal deck
    if (remainActive) {
      this.activeCards.push(removedCard); // equipment, status cards
    } else {
      this.insertCardInDeck(removedCard); // modifiers, instant cards
    }

    console.log(
      '>>> Card has been played',
      card.getID(),
      // `deck: ${this.deck}`,
      // `hand: ${this.handCards}`,
      // `activeCards: ${this.activeCards}`,
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
    this.insertCardInDeck(removedCard);

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

    console.log(
      '>>>',
      card.getID(),
      'has been returned to',
      this.props.target,
      'hand',
    );
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
      console.log(
        '>>> returning',
        card.getID(),
        'to',
        this.props.target,
        'hand...',
      );

      const delay = index * animDuration * 0.2;
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
