import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import Card from '../cards/Card';
import { animDuration } from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import BattleCardNumbers from './BattleCardNumbers';
import sounds from 'src/lib/sounds';

type Props = { superview: View; zIndex: number };

const maxCards = 5;

export default class BattleCardHand {
  private props: Props;
  private container: View;
  private overlay: View;
  private cardBox: View;
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
      y: 0,
      infinite: true,
      canHandleEvents: false,
      zIndex: props.zIndex,
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

    const rotations = [-0.25, -0.125, 0, 0.125, 0.25];
    const ys = [0, -12, -15, -12, 0];

    this.cardBox = new View({
      superview: this.container,
      // backgroundColor: 'rgba(255, 255, 0, 0.5)',
      width: screen.width,
      height: screen.height,
      y: 40,
      opacity: 0,
      visible: false,
      infinite: true,
      canHandleEvents: false,
    });

    this.cards = [];
    for (let i = 0; i < maxCards; i++) {
      const card = new Card({
        superview: this.cardBox,
        id: 'ak47',
        side: 'front',
        mode: 'mini',
        // x: 35 + i * 62,
        x: 40 + i * 60,
        y: screen.height - 120 + ys[i],
        scale: 0.2,
        r: rotations[i],
        onClick: () => this.showCardDetails(card),
      });
      this.cards.push(card);
    }
  }

  showHand() {
    if (this.cardBox.style.y === 0) return;

    sounds.playSound('swoosh4', 0.1);
    this.cardBox.show();
    animate(this.cardBox).then(
      { y: 0, opacity: 1 },
      animDuration,
      animate.easeInOut,
    );
  }

  hideHand() {
    if (this.cardBox.style.y !== 0) return;

    sounds.playSound('swoosh4', 0.1);
    animate(this.cardBox)
      .then({ y: 40, opacity: 0 }, animDuration, animate.easeInOut)
      .then(() => this.cardBox.hide());
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
