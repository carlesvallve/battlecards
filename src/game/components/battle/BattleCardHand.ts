import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import Card from '../cards/Card';

type Props = { superview: View };

const maxCards = 5;

export default class BattleCardHand {
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
      width: screen.width - 0,
      height: 80,
      x: 0,
      y: screen.height - 75 * 2,
    });
  }

  createCards(props: Props) {
    this.cards = [];
    for (let i = 0; i < maxCards; i++) {
      const card = new Card({
        superview: this.container,
        id: 'ak47',
        side: 'front',
        x: 35 + i * 62,
        y: 30,
        scale: 0.22,
        onClick: () => this.useCard(card),
      });
      this.cards.push(card);

      card.setProps({
        id: 'ak47',
        side: 'front',
      });
    }
  }

  useCard(card) {}
}
