import animate from 'animate';
import sounds from 'src/lib/sounds';
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

const iconSeparation = 40;
const iconDisplacement = 20;
const animDuration = 180;

export default class AttackIcons {
  private container: View;
  private props: Props;

  private center: number;
  private icons: ImageScaleView[];

  constructor(props: Props) {
    this.props = props;
    this.icons = [];
    this.createViews(props);
  }

  getIcons() {
    return this.icons;
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

  public addIcons(maxAttacks: number, cb: () => void) {
    this.container.updateOpts({ x: this.center });

    const t = animDuration * 1.5;

    // create icon sequence
    this.icons = [];
    for (let i = 0; i < maxAttacks; i++) {
      waitForIt(() => {
        this.addIcon();
        if (i === maxAttacks - 1) {
          waitForIt(() => cb && cb(), t);
        }
      }, i * t);
    }
  }

  public addIcon(cb?: () => void) {
    const i = this.getIcons().length;

    const d = iconSeparation;
    const x = this.container.style.width / 2 + i * d;
    const y = this.container.style.height / 2;

    const icon = new ImageScaleView({
      superview: this.container,
      image: 'resources/images/ui/icons/sword.png',
      width: 32,
      height: 32,
      x: x + iconDisplacement,
      y,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 0,
    });

    const t = animDuration;
    const x2 = this.center - (this.icons.length * d) / 2;
    this.animateIconIn(icon, { t, x, x2 }, cb);

    this.icons.push(icon);

    return icon;
  }

  public removeIcon(cb?: () => void) {
    const icon = this.icons.shift();
    if (!icon) return;

    const d = iconSeparation;
    const t = animDuration / 2;
    const x = icon.style.x + d / 2;
    const x2 = this.container.style.x - d / 2;

    this.animateIconOut(icon, { t, x, x2 }, () => {
      icon.removeFromSuperview();
      cb && cb();
    });
  }

  // animations

  private animateIconIn(icon: View, { t, x, x2 }, cb?: () => void) {
    sounds.playSound('swoosh3', 0.2);

    animate(icon)
      .then({ x, scale: 0.8 }, t * 1, animate.easeOut)
      .then({ x, scale: 1.25 }, t * 0.5, animate.easeInOut)
      .then({ x, scale: 1 }, t * 0.5, animate.easeInOut);

    animate(this.container).then({ x: x2 }, t * 1, animate.easeInOut);

    waitForIt(() => cb && cb(), t * 4);
  }

  private animateIconOut(icon: View, { t, x, x2 }, cb?: () => void) {
    sounds.playRandomSound(['swoosh1', 'swoosh3'], 0.15); // 'swoosh2', 'swoosh5'

    animate(icon).then({ x, scale: 0 }, t * 1, animate.easeInOut);

    animate(this.container)
      .then({ x: x2 }, t * 1, animate.easeInOut)
      .then(() => {
        cb && cb();
      });

    // waitForIt(() => {
    //   sounds.playRandomSound(['punch1', 'punch2'], 1);
    //   sounds.playRandomSound(['break1'], 0.25);
    // }, t * 2.5);
  }
}
