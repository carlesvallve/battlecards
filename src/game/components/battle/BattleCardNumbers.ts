import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions, getRandomInt, waitForIt } from 'src/lib/utils';
import Card from '../cards/Card';
import { animDuration } from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import CardNumber, { CardNum } from '../cards/CardNumber';
import { updateTurn } from 'src/redux/shortcuts/combat';

type Props = { superview: View };

const maxCards = 6 * 4;

export default class BattleCardNumbers {
  private props: Props;
  private container: View;
  private cards: Card[];
  private selectedCardData: {
    card: Card;
    x: number;
    y: number;
    scale: number;
  };

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
      x: 0, // props.x,
      y: 0, // props.y, //screen.height - 75 * 2,
      infinite: true,
      canHandleEvents: false,
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
          x: 35 + i * 0,
          y: screen.height - 45 + i * 1,
          scale: 0.125,
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
    const yy = screen.height * 0.425;

    // todo: locate final pos at current target meter step position
    // up: yy - 20
    // sown: yy + 50

    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        { x: screen.width / 2, y: yy, scale: 0.3, scaleY: 0.75 },
        t * 0.5,
        animate.easeInOut,
      )
      .then({ scale: 0.4, scaleY: 1 }, t * 0.5, animate.easeInOut)
      .then({ scale: 0.35, scaleY: 1 }, t * 0.5, animate.easeInOut)
      .then(() => {
        waitForIt(() => updateTurn(card.getNum()), t * 0.5);
      })
      .then({ scale: 0, scaleY: 0.75, y: yy - 20 }, t * 1, animate.easeInOut);
  }
}
