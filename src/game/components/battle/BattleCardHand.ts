import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import { getScreenDimensions, getRandomInt } from 'src/lib/utils';
import { animDuration } from 'src/lib/uiConfig';
import { getRandomCardID } from 'src/redux/shortcuts/cards';
import { CardID } from 'src/redux/ruleset/cards';
import { throwDice } from 'src/redux/shortcuts/combat';
import StateObserver from 'src/redux/StateObserver';
import ruleset from 'src/redux/ruleset';

type Props = { superview: View; zIndex: number };

const maxCards = 5;

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private active: boolean;
  private cards: Card[];
  private usedCards: Card[];
  private cardDetails: BattleCardDetails;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createCards(props);
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

  createCards(props: Props) {
    this.cards = [];
    this.usedCards = [];

    for (let i = 0; i < maxCards; i++) {
      const card = this.createRandomCard(i);
      this.cards.push(card);
    }

    this.updateCardPositions();
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
      r: 0, // rotations[i],
      scale: 0.225,
      onClick: () => this.cardDetails.showCardDetails(card),
    });

    return card;
  }

  addRandomCardToDeck(index: number = 0) {
    // add a new random card to cards array
    const newCard = this.createRandomCard(index);
    this.cards.splice(index, 0, newCard);
    this.updateCardPositions();
  }

  private updateCardPositions() {
    // todo: locate cards in an arc (?)
    // const rotations = [-0.25, -0.125, 0, 0.125, 0.25];
    // const ys = [0, -12, -15, -12, 0];

    if (this.active) sounds.playSound('swoosh4', 0.1);

    const screen = getScreenDimensions();
    const center = screen.width / 2;
    const max = this.cards.length - 1;
    const dx = 60;

    this.cards.forEach((card, index) => {
      const x = center - (max * dx) / 2 + index * dx;
      const y = this.getBasePosY();

      animate(card.getView())
        .clear()
        .then({ x, y }, animDuration, animate.easeInOut);
    });
  }

  private getBasePosY() {
    const screen = getScreenDimensions();
    const baseY = screen.height - 130;
    return baseY + (this.active ? 0 : 30);
  }

  showHand() {
    if (this.active) return;

    // if we have less than maxCards, add random cards to deck
    const cardsToAdd = maxCards - this.cards.length;
    if (cardsToAdd > 0) {
      for (let i = 0; i < cardsToAdd; i++) {
        this.addRandomCardToDeck(0);
      }
    }

    sounds.playSound('swoosh4', 0.1);
    this.active = true;

    this.cards.forEach((card, index) => {
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
    this.active = false;

    sounds.playSound('swoosh4', 0.1);

    this.cards.forEach((card, index) => {
      animate(card.getView())
        .then(
          { y: this.getBasePosY(), opacity: 0 },
          animDuration,
          animate.easeInOut,
        )
        .then(() => card.getView().hide());
    });
  }

  cardHasBeenPlayed(card: Card) {
    console.log(
      '>>> Card has been played',
      card.getID(),
      this.cards,
      this.usedCards,
    );

    // get position of card in array
    const index = this.cards.map((el) => el).indexOf(card);
    console.log('>>> index', index);

    // remove card from cards array
    const removedCard = this.cards.splice(index, 1)[0];

    // put card in used deck
    this.usedCards.push(removedCard);

    console.log(
      '>>> Card has been switched from decks',
      card.getID(),
      this.cards,
      this.usedCards,
    );

    // reposition remaining cards
    this.updateCardPositions();
  }
}
