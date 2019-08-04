import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import ImageScaleView from 'ui/ImageScaleView';
import { waitForIt } from 'src/lib/utils';
import StateObserver from 'src/redux/StateObserver';
import { getAttackIcons, executeAttack } from 'src/redux/shortcuts/combat';
import View from 'ui/View';
import BattleArea from '../battle/BattleArea';

const animDuration = 150;

export default class AttackIcons extends Basic {
  private center: number;
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
      if (!shouldAddAttacks) return;
      const maxAttacks = getAttackIcons(type);
      console.log('>>> attackIcons', type, maxAttacks);
      this.createIcons(maxAttacks);

      waitForIt(() => {
        this.executeAttacks(maxAttacks);
      }, (maxAttacks + 1) * (animDuration * 2));
    });
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);
    this.container.updateOpts({ backgroundColor: '#333' });
    this.center = this.container.style.x;
  }

  public createIcons(maxAttacks: number) {
    this.container.updateOpts({ x: this.center });

    this.icons = [];
    for (let i = 0; i < maxAttacks; i++) {
      waitForIt(() => {
        this.createIcon(i);
      }, i * animDuration * 2);
    }
  }

  private createIcon(i: number) {
    const d = 32;
    const x = this.container.style.width / 2 + i * d;
    const y = this.container.style.height / 2;

    const icon = new ImageScaleView({
      superview: this.container,
      image: 'resources/images/ui/icons/sword.png',
      width: 24,
      height: 24,
      x: x + d * 1.5,
      y,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 0,
    });

    const x2 = this.center - (this.icons.length * d) / 2;
    this.animateIcon(icon, { t: animDuration, x, x2, scale: 1 });

    this.icons.push(icon);
    return icon;
  }

  executeAttacks(maxAttacks: number) {
    for (let i = 0; i < maxAttacks; i++) {
      // this.icons.slice(1);
      waitForIt(() => {
        const icon = this.icons.shift();
        console.log('executing attack', i, '/', maxAttacks);
        const x2 = this.container.style.x - 32 / 2;
        this.animateIcon(icon, {
          t: animDuration,
          x: icon.style.x + 32 / 2,
          x2,
          scale: 0,
        });

        executeAttack(this.props.type);
      }, i * animDuration * 2);
    }
  }

  animateIcon(icon: View, { t, x, x2, scale }) {
    animate(icon)
      .clear()
      .then({ x, scale }, t, animate.easeInOut);

    animate(this.container)
      .clear()
      .then({ x: x2 }, t, animate.easeInOut);
  }
}
