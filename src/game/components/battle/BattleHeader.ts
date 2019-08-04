import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import { getScreenDimensions } from 'src/lib/utils';
import ProgressBar from '../ui/ProgressBar';
import StatInfo from '../ui/StatInfo';
import MonsterInfo from '../ui/MonsterInfo';

export default class BattleHeader extends Basic {
  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    const screen = getScreenDimensions();
    this.container.updateOpts({
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
