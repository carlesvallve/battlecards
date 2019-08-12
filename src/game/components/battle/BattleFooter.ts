import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import ProgressBar from './ProgressBar';
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
      // backgroundColor: 'rgba(0, 255, 255, 0.5)',
      ...props,
      width: screen.width,
      height: 80,
      y: screen.height - 80,
      infinite: false,
      canHandleEvents: false,
    });

    const buttonAction = new ButtonAction({
      superview: this.container,
      x: this.container.style.width - 35,
      y: 40,
    });

    const barHP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 25,
      width: 170,
      height: 25,
      target: 'hero',
      type: 'hp',
    });

    const barEP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + 5,
      y: 55,
      width: 170,
      height: 25,
      target: 'hero',
      type: 'ep',
    });
  }
}
