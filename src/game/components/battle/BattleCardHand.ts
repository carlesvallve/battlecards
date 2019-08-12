import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import { getScreenDimensions } from 'src/lib/utils';
import { animDuration } from 'src/lib/uiConfig';
import { getRandomCardID } from 'src/redux/shortcuts/cards';

type Props = { superview: View; zIndex: number };

const maxCards = 5;

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private active: boolean;
  private cards: Card[];
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
    });
  }

  createCards(props: Props) {
    const screen = getScreenDimensions();

    const rotations = [-0.25, -0.125, 0, 0.125, 0.25];
    const ys = [0, -12, -15, -12, 0];

    this.cards = [];
    for (let i = 0; i < maxCards; i++) {
      const id = getRandomCardID();
      console.log('>>> id:', id);

      const card = new Card({
        superview: this.container,
        id,
        side: 'front',
        mode: 'mini',
        x: 40 + i * 60,
        y: screen.height - 120 + ys[i] + 40,
        scale: 0.2,
        r: rotations[i],
        onClick: () => this.cardDetails.showCardDetails(card),
      });
      this.cards.push(card);
    }
  }

  showHand() {
    if (this.active) return;
    this.active = true;

    sounds.playSound('swoosh4', 0.1);

    this.cards.forEach((card, index) => {
      card.getView().show();
      animate(card.getView()).then(
        { y: card.getView().style.y - 40, opacity: 1 },
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
          { y: card.getView().style.y + 40, opacity: 0 },
          animDuration,
          animate.easeInOut,
        )
        .then(() => card.getView().hide());
    });
  }
}
