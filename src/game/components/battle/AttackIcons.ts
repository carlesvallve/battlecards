import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import ImageScaleView from 'ui/ImageScaleView';
import { waitForIt } from 'src/lib/utils';
import StateObserver from 'src/redux/StateObserver';
import {
  executeAttack,
  addAttackIcons,
  resetCombat,
  getTargetEnemy,
} from 'src/redux/shortcuts/combat';
import View from 'ui/View';
import BattleArena from './BattleArena';

const animDuration = 150;

export default class AttackIcons extends Basic {
  private center: number;
  private icons: ImageScaleView[];

  constructor(props: BasicProps) {
    super(props);
    // this.createSelectors();
  }

  private createSelectors() {
    const target = this.props.target;
    const enemy = getTargetEnemy(target);

    // combat was resolved -> add attacks
    StateObserver.createSelector(({ combat }) => combat.result).addListener(
      (result) => {
        if (!result) return;

        // reset combat if it's a draw
        if (result.winner === null) {
          console.log('>>> combat is a draw. resetting...', result);
          waitForIt(() => resetCombat(), animDuration);
          return;
        }

        if (result.winner !== target) return;

        console.log('>>> selector result', result);

        const maxAttacks = result.attacks;
        if (maxAttacks > 0) {
          console.log('>>> adding', maxAttacks, 'attackIcons to', target);
          addAttackIcons(target, maxAttacks);
          this.createIcons(maxAttacks);

          waitForIt(() => {
            this.executeAttacks(maxAttacks);
          }, (maxAttacks + 0.5) * (animDuration * 2));
        }
      },
    );
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

        const x2 = this.container.style.x - 32 / 2;
        this.animateIcon(icon, {
          t: animDuration,
          x: icon.style.x + 32 / 2,
          x2,
          scale: 0,
        });

        console.log(
          'executing',
          this.props.target,
          'attack',
          i + 1,
          '/',
          maxAttacks,
        );

        executeAttack(this.props.target);
      }, i * animDuration * 3);
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
