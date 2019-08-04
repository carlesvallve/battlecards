import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig from 'src/lib/uiConfig';
import ImageScaleView from 'ui/ImageScaleView';
import Label from './Label';
import { waitForIt, getRandomInt } from 'src/lib/utils';
import StateObserver from 'src/redux/StateObserver';
import {
  updateMeter,
  resetMeter,
  getCurrentMeter,
  getNumberOfAttacks,
} from 'src/redux/shortcuts/combat';
import View from 'ui/View';
import BattleArea from '../battle/BattleArea';

const totalSteps = 12;

export default class AttackIcons extends Basic {
  private icons: ImageScaleView[];

  constructor(props: BasicProps) {
    super(props);
    this.createSelectors();
  }

  private createSelectors() {
    const type = this.props.type;
    const enemyType = BattleArea.getEnemyType(type);

    // enemy meter went down to 0 -> add attacks
    StateObserver.createSelector(
      ({ combat }) => combat[enemyType].meter === 0,
    ).addListener((shouldAddAttacks) => {
      const maxAttacks = getNumberOfAttacks(type);
      console.log('>>> maxAttacks', type, maxAttacks);
      this.createIcons(maxAttacks);
    });
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);
    this.container.updateOpts({ backgroundColor: '#333' });
  }

  public createIcons(maxAttacks: number) {
    this.icons = [];
    for (let i = 0; i < maxAttacks; i++) {
      this.createIcon(i);
    }

    for (let i = 0; i < maxAttacks; i++) {
      const d = 40;
      this.icons[i].updateOpts({
        x: this.container.style.width / 2 + i * d - ((maxAttacks - 1) * d) / 2,
      });
    }
  }

  private createIcon(i: number) {
    const x = 0;
    const y = this.container.style.height / 2;

    const icon = new ImageScaleView({
      superview: this.container,
      image: 'resources/images/ui/icons/sword.png',
      width: 32,
      height: 32,
      x,
      y,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 0,
    });

    animate(icon)
      .clear()
      .then({ scale: 1 }, 100, animate.easeInOut);

    this.icons.push(icon);
    return icon;
  }
}
