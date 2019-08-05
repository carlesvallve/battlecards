import animate from 'animate';
import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';
import { waitForIt } from 'src/lib/utils';
import { Target } from 'src/types/custom';

type Props = {
  superview: View;
  x: number;
  y: number;
  target: Target;
};

const iconSeparation = 36;
const iconDisplacement = 24;
const animDuration = 180;

export default class AttackIcons {
  private container: View;
  private props: Props;

  private center: number;
  private icons: ImageScaleView[];

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  protected createViews(props: Props) {
    this.container = new View({
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      ...props,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.center = this.container.style.x;
  }

  public addIcons(maxAttacks: number, delay: number = 0, cb: () => void) {
    this.container.updateOpts({ x: this.center });

    // create icon sequence
    this.icons = [];
    waitForIt(() => {
      for (let i = 0; i < maxAttacks; i++) {
        waitForIt(() => this.addIcon(i), i * animDuration * 2);
      }
    }, delay);

    // wait and return callback
    const callbackDelay = delay + maxAttacks * animDuration * 2;
    waitForIt(() => cb && cb(), callbackDelay);
  }

  private addIcon(i: number) {
    const d = iconSeparation;
    const x = this.container.style.width / 2 + i * d;
    const y = this.container.style.height / 2;

    const icon = new ImageScaleView({
      superview: this.container,
      image: 'resources/images/ui/icons/sword.png',
      width: 24,
      height: 24,
      x: x + iconDisplacement,
      y,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 0,
    });

    const t = animDuration;
    const x2 = this.center - (this.icons.length * d) / 2;
    this.animateIconIn(icon, { t, x, x2 });

    this.icons.push(icon);
    return icon;
  }

  removeIcon() {
    const icon = this.icons.shift();

    const d = iconSeparation;
    const t = animDuration;
    const x = icon.style.x + d / 2;
    const x2 = this.container.style.x - d / 2;

    this.animateIconOut(icon, { t, x, x2 }, () => icon.removeFromSuperview());
  }

  // animations

  animateIconIn(icon: View, { t, x, x2 }, cb?: () => void) {
    animate(icon)
      .then({ x, scale: 1.5 }, t * 1, animate.easeInOut)
      .then({ x, scale: 1 }, t * 0.5, animate.easeInOut);

    animate(this.container)
      .then({ x: x2 }, t, animate.easeInOut)
      .then(() => cb && cb());
  }

  animateIconOut(icon: View, { t, x, x2 }, cb?: () => void) {
    animate(icon).then({ x, scale: 0, opacity: 0 }, t * 0.5, animate.easeInOut);

    animate(this.container)
      .then({ x: x2 }, t * 0.5, animate.easeInOut)
      .then(() => cb && cb());
  }
}
