import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import ProgressBar from './ProgressBar';
import StatInfo from './StatInfo';
import MonsterInfo from './MonsterInfo';

type Props = { superview: View };

export default class BattleHeader {
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
      width: screen.width,
      height: 80,
      y: 5,
    });

    const dBars = 55;

    const barHP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 - dBars,
      y: 17,
      width: 100,
      height: 20,
      type: 'hp',
      target: 'monster',
    });

    const barEP = new ProgressBar({
      superview: this.container,
      x: this.container.style.width / 2 + dBars,
      y: 17,

      width: 100,
      height: 20,
      type: 'ep',
      target: 'monster',
    });

    const mosnterInfo = new MonsterInfo({
      superview: this.container,
      x: this.container.style.width / 2,
      y: 48,
      width: 140,
      height: 30,
      data: {
        name: 'Monster',
        description: 'Vicious skavenger',
      },
    });

    const dStats = 91;

    const statAttack = new StatInfo({
      superview: this.container,
      x: this.container.style.width / 2 - dStats,
      y: 48,
      width: 30,
      height: 30,
      target: 'monster',
      type: 'armour',
    });

    const statDefense = new StatInfo({
      superview: this.container,
      x: this.container.style.width / 2 + dStats,
      y: 48,
      width: 30,
      height: 30,
      target: 'monster',
      type: 'damage',
    });
  }
}
