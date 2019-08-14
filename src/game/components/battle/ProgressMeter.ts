import animate from 'animate';
import sounds from 'src/lib/sounds';
import uiConfig from 'src/lib/uiConfig';
import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';
import Label from './Label';
import { waitForIt } from 'src/lib/utils';
import { Target } from 'src/types/custom';
import StateObserver from 'src/redux/StateObserver';
import {
  getCurrentMeter,
  getColorByTarget,
  getTargetEnemy,
} from 'src/redux/shortcuts/combat';
import bitmapFonts from 'src/lib/bitmapFonts';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  target: Target;
};

const totalSteps = 12;
const animDuration = 20;

export default class ProgressMeter {
  private container: View;
  private bg: View;
  private props: Props;

  private label: Label;
  private steps: ImageScaleView[];

  private active: boolean;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  private createSelectors() {
    const target = this.props.target;

    StateObserver.createSelector(
      ({ combat }) => combat[target].maxSteps,
    ).addListener((maxSteps) => {
      for (let i = 0; i < totalSteps; i++) {
        const riskyOpacity = i <= maxSteps - 4 ? 0.5 : 1;

        const active = i <= maxSteps - 1;
        this.steps[i].updateOpts({ opacity: active ? 1 : riskyOpacity });
      }
    });
  }

  getView() {
    return this.container;
  }

  getActive() {
    return this.active;
  }

  protected createViews(props: Props) {
    this.container = new View({
      ...props,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 0.75,
    });

    const box = new ImageScaleView({
      superview: this.container,
      ...uiConfig.frameWhite,
      width: this.container.style.width,
      height: this.container.style.height,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      scale: 1,
    });

    this.bg = new ImageScaleView({
      superview: this.container,
      ...uiConfig.frameBlack,
      width: this.container.style.width - 5,
      height: this.container.style.height - 5,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      scale: 1,
    });

    this.createSteps(props);

    this.label = new Label({
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      localeText: () => '0',
      width: this.container.style.width,
      x: this.container.style.width / 2,
      y: -9,
      size: 30,
      zIndex: 9,
    });
  }

  hideMeter() {
    this.active = false;
    animate(this.container).then(
      { scale: 0, opacity: 0 },
      250,
      animate.easeInOut,
    );
  }

  showMeter() {
    animate(this.container)
      .then({ scale: 0.75, opacity: 1 }, 250, animate.easeInOut)
      .then(() => (this.active = true));
  }

  createSteps(props: Props) {
    const w = (this.container.style.width - totalSteps) / totalSteps;

    this.steps = [];
    for (let i = 0; i < totalSteps; i++) {
      const active = false;

      const step = new ImageScaleView({
        superview: this.container,
        ...getColorByTarget(this.props.target),
        centerOnOrigin: false,
        width: w - 1,
        height: this.container.style.height - 10,
        x: 6 + i * w,
        y: 5,
        opacity: active ? 1 : 0,
      });
      this.steps.push(step);
    }
  }

  refresh(updateLabel: boolean, updateSound: boolean = false) {
    const currentMeter = getCurrentMeter(this.props.target);
    if (currentMeter === 0) return;

    const enemyMeter = getCurrentMeter(getTargetEnemy(this.props.target));

    // update bg
    this.bg.updateOpts({ ...uiConfig.frameBlack, zIndex: 0 });

    // update label
    if (updateLabel) {
      this.label.setProps({ localeText: () => currentMeter.toString() });
    }

    // update steps
    for (let i = 0; i < currentMeter; i++) {
      waitForIt(() => {
        const num = i + 1;

        const step = this.steps[num - 1];

        if (step) {
          let color =
            enemyMeter < num ? uiConfig.frameYellow : uiConfig.frameOrange;
          step.updateOpts({ ...color, centerOnOrigin: false });
        }

        if (i === currentMeter - 1) {
          if (updateSound) sounds.playSound('tick2', 0.2);
        }
      }, i * animDuration);
    }
  }

  resolveTo(
    value: number,
    animated: boolean = true,
    animatedLabel: boolean = true,
  ) {
    const current = getCurrentMeter(this.props.target);

    if (!animatedLabel) {
      this.label.setProps({ localeText: () => value.toString() });
    }

    // update steps
    // sounds.playSound('tick2', 0.2);
    for (let i = 0; i < current; i++) {
      waitForIt(
        () => {
          const num = current - i - 1;

          const step = this.steps[num];

          if (step) {
            let color = getColorByTarget(this.props.target);
            if (num < value) color = uiConfig.frameYellow;
            step.updateOpts({ ...color, centerOnOrigin: false });
          }

          // update label
          if (animatedLabel) {
            if (num >= value) {
              this.label.setProps({ localeText: () => num.toString() });
            }
          }

          if (i === current - 1) {
            sounds.playSound('tick2', 0.2);
          }
        },
        animated ? i * animDuration : 0,
      );
    }
  }

  reset(opts?: { isOverhead: boolean }) {
    const target = this.props.target;

    // update steps
    for (let i = 0; i < totalSteps; i++) {
      // const num = i + 1;
      this.steps[i].updateOpts({
        ...getColorByTarget(target),
        centerOnOrigin: false,
      });
    }

    // update bg
    if (opts && opts.isOverhead) {
      this.bg.updateOpts({ ...uiConfig.frameRed, zIndex: 2 });
    } else {
      this.bg.updateOpts({ ...uiConfig.frameBlack, zIndex: 0 });
    }

    // update label
    this.label.setProps({ localeText: () => '0' });
  }
}
