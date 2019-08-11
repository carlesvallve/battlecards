import animate from 'animate';
import View from 'ui/View';
import {
  getScreenDimensions,
  waitForIt,
  getRandomFloat,
  getRandomInt,
} from 'src/lib/utils';
import { animDuration } from 'src/lib/uiConfig';
import CardNumber, { CardNum } from '../cards/CardNumber';
import { getTarget, throwDice } from 'src/redux/shortcuts/combat';
import StateObserver from 'src/redux/StateObserver';
import { blockUi } from 'src/redux/shortcuts/ui';

type Props = { superview: View };

export default class BattleCardNumbers {
  private props: Props;
  private container: View;
  private cards: CardNumber[];
  private usedCards: CardNumber[];

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createCards(props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: false,
      zIndex: 100,
    });
  }

  generateNumbers() {
    // add numbers
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 4; j++) {}
    }
  }

  createCards(props: Props) {
    const screen = getScreenDimensions();

    this.usedCards = [];
    this.cards = [];

    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 4; j++) {
        const card = new CardNumber({
          superview: this.container,
          num: i as CardNum,
          x: 31 + j * 2,
          y: screen.height - 48 + j * 2,
          scale: 0.15,
          onClick: () => this.spawnCard(card),
        });
        this.cards.push(card);
      }
    }

    // shuffle the card deck
    this.shuffleCards();

    // display remaining cards
    this.cards[this.cards.length - 1].updateLabel(this.cards.length.toString());
  }

  shuffleCards() {
    const screen = getScreenDimensions();

    const shuffled = this.cards.sort(() => 0.5 - Math.random());

    shuffled.forEach((card, index) => {
      card.getView().updateOpts({
        zIndex: index * 0.1,
        x: 35 + getRandomInt(-2, 2) * 1,
        y: screen.height - 40 + getRandomInt(-2, 2) * 1,
        scale: 0.15,
        scaleY: 1,
        opacity: 1,
        visible: true,
      });
    });

    // display remaining cards
    this.cards[this.cards.length - 1].updateLabel(this.cards.length.toString());
  }

  spawnCard(card: CardNumber) {
    // block the combat ui
    blockUi(true);

    this.updateCardLabels(card);

    const screen = getScreenDimensions();
    const target = getTarget(StateObserver.getState());
    const t = animDuration * 1;

    const xx = screen.width / 2;
    const yy = screen.height * 0.5;
    const dx = 2;
    const dy = target === 'hero' ? -25 : 25;

    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        {
          x: xx,
          y: yy,
          scale: 0.3,
          scaleY: 0.75,
          r: 0,
        },
        t * 0.5,
        animate.easeInOut,
      )
      .then({ scale: 0.4, scaleY: 1 }, t * 0.5, animate.easeInOut)
      .then({ scale: 0.35, scaleY: 1 }, t * 0.5, animate.easeInOut)
      .then(() => {
        waitForIt(() => {
          throwDice('hero', card.getNum()); // use the card with redux
        }, t * 0.5);
      })
      .then(
        {
          scale: 0.0,
          scaleY: 0.75,
          x: xx + dx,
          y: yy + dy - 15,
          r: getRandomFloat(-0.1, 0.1),
        },
        t * 1,
        animate.easeInOut,
      )
      .then(() => {
        this.usedCards.push(this.cards.pop());
        if (this.cards.length === 0) {
          this.cards = this.usedCards;
          this.usedCards = [];
          this.shuffleCards();
        }
      });
  }

  updateCardLabels(card?: CardNumber) {
    if (this.cards.length > 1) {
      this.cards[this.cards.length - 2].updateLabel(
        (this.cards.length - 1).toString(),
      );
    }

    card.updateLabel(card.getNum().toString());
  }
}
