import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import Card from '../cards/Card';
import { animDuration } from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import BattleCardNumbers from './BattleCardNumbers';

type Props = { superview: View };

const maxCards = 5;

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private overlay: View;
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
      x: 0,
      y: 0, //screen.height - 75 * 2,
      infinite: true,
      canHandleEvents: false,
    });

    const cardNumbers = new BattleCardNumbers({
      superview: this.container,
    });

    this.overlay = new ButtonView({
      superview: this.container,
      zIndex: 1,
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
        this.hideCardDetails();
      },
    });
  }

  createCards(props: Props) {
    const screen = getScreenDimensions();

    this.cards = [];
    for (let i = 0; i < maxCards; i++) {
      const card = new Card({
        superview: this.container,
        id: 'ak47',
        side: 'front',
        mode: 'mini',
        x: 35 + i * 62,
        y: screen.height - 120,
        scale: 0.22,
        onClick: () => this.showCardDetails(card),
      });
      this.cards.push(card);
    }
  }

  showCardDetails(card: Card) {
    if (card.getMode() === 'full') return;

    const screen = getScreenDimensions();

    this.overlay.show();
    animate(this.overlay)
      .wait(0)
      .then({ opacity: 1 }, animDuration, animate.easeOut);

    card.setProps({ mode: 'full', side: 'front' });

    const { x, y, scale } = card.getView().style;
    this.selectedCardData = { card, x, y, scale };

    const t = animDuration * 1;
    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        { x: screen.width / 2, y: screen.height * 0.425, scale: 0.5 },
        t * 1,
        animate.easeInOut,
      )
      .then({ scale: 1.05 }, t * 0.5, animate.easeInOut)
      .then({ scale: 1 }, t * 0.5, animate.easeInOut);
  }

  hideCardDetails() {
    animate(this.overlay)
      .wait(0)
      .then({ opacity: 0 }, animDuration, animate.easeOut)
      .then(() => this.overlay.hide());

    const { card, x, y, scale } = this.selectedCardData;

    animate(card.getView())
      .clear()
      .wait(0)
      .then({ scale: scale * 1.5 }, animDuration * 0.5, animate.easeOut)
      .then({ x, y, scale }, animDuration, animate.easeInOut);

    card.setProps({ mode: 'mini', side: 'front' });
  }
}
