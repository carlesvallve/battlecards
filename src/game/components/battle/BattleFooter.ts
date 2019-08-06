import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import ProgressBar from './ProgressBar';
import ButtonCards from './ButtonCards';
import ButtonAction from './ButtonAction';


type Props = { superview: View };

export default class BattleFooter {
  private props: Props;
  private container: View;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      ...props,
      // backgroundColor: 'red',
      width: screen.width,
      height: 75,
      y: screen.height - 75,
    });

    const buttonCards = new ButtonCards({
      superview: this.container,
      x: 35,
      y: 35,
    });

    const buttonAction = new ButtonAction({
      superview: this.container,
      x: this.container.style.width - 35,
      y: 35,
    });

    const barHP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 20,
      width: 170,
      height: 25,
      type: 'hp',
      target: 'hero',
    });

    const barEP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 50,
      width: 170,
      height: 25,
      type: 'ep',
      target: 'hero',
    });
  }
}
