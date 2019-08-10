import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions, waitForIt, getRandomFloat } from 'src/lib/utils';
import Card from '../cards/Card';
import { animDuration } from 'src/lib/uiConfig';
import CardNumber, { CardNum } from '../cards/CardNumber';
import { getTarget, throwDice } from 'src/redux/shortcuts/combat'; // updateTurn,
import StateObserver from 'src/redux/StateObserver';

type Props = { superview: View };

const maxCards = 6 * 4;

export default class BattleCardNumbers {
  private props: Props;
  private container: View;
  private cards: Card[];

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

    const shuffled = this.cards.sort(() => 0.5 - Math.random());
    shuffled.forEach((card, index) => {
      card.getView().updateOpts({ zIndex: index * 0.1 });
    });
  }

  spawnCard(card: CardNumber) {
    const screen = getScreenDimensions();
    const t = animDuration * 1;

    const target = getTarget(StateObserver.getState());
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
          throwDice('hero', card.getNum());
          // updateTurn(card.getNum()), t * 0.5;
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
      );
  }
}
