import animate from 'animate';
import uiConfig from 'src/lib/uiConfig';
import ImageScaleView from 'ui/ImageScaleView';
import Label from './Label';
import { waitForIt } from 'src/lib/utils';
import { getCurrentMeter, getColorByTarget } from 'src/redux/shortcuts/combat';
import View from 'ui/View';
import { Target } from 'src/types/custom';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  target: Target;
  stepLimit: number;
};

const totalSteps = 12;
const animDuration = 20;

export default class ProgressMeter {
  private container: View;
  private props: Props;

  private label: Label;
  private steps: ImageScaleView[];

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

    const box = new ImageScaleView({
      superview: this.container,
      ...uiConfig.frameWhite,
      width: this.container.style.width,
      height: this.container.style.height,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      scale: 1,
    });

    const bg = new ImageScaleView({
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
      localeText: () => '0',
      x: this.container.style.width / 2,
      y: -2,
      size: 30,
    });
  }

  createSteps(props) {
    const w = (this.container.style.width - totalSteps) / totalSteps;

    this.steps = [];
    for (let i = 0; i < totalSteps; i++) {
      const active = i <= props.stepLimit - 1;

      const step = new ImageScaleView({
        superview: this.container,
        ...getColorByTarget(this.props.target),
        centerOnOrigin: false,
        width: w - 1,
        height: this.container.style.height - 10,
        x: 6 + i * w,
        y: 5,
        opacity: active ? 1 : 0.5,
      });
      this.steps.push(step);
    }
  }

  refresh(enemyMeter: number, updateLabel: boolean) {
    const currentMeter = getCurrentMeter(this.props.target);
    if (currentMeter === 0) return;

    // update label
    if (updateLabel) {
      this.label.setProps({ localeText: () => currentMeter.toString() });
    }

    // update steps
    for (let i = 0; i < currentMeter; i++) {
      waitForIt(() => {
        const num = i + 1;
        const step = this.steps[num - 1];
        let color =
          enemyMeter < num ? uiConfig.frameYellow : uiConfig.frameOrange;
        if (step) step.updateOpts({ ...color, centerOnOrigin: false });
      }, i * animDuration);
    }
  }

  resolveTo(value: number, animated: boolean = true) {
    const current = getCurrentMeter(this.props.target);

    // update steps
    for (let i = 0; i < current; i++) {
      waitForIt(() => {
        const num = current - i - 1;
        const step = this.steps[num];
        let color = getColorByTarget(this.props.target);
        if (num < value) color = uiConfig.frameYellow;
        if (step) step.updateOpts({ ...color, centerOnOrigin: false });

        // update label
        if (num >= value) {
          this.label.setProps({ localeText: () => num.toString() });
        }
      }, i * animDuration);
    }
  }

  reset(overhead: number) {
    const target = this.props.target;

    for (let i = 0; i < totalSteps; i++) {
      const num = i + 1;
      const step = this.steps[i].updateOpts({
        ...(num > overhead ? getColorByTarget(target) : uiConfig.frameWhite),
        centerOnOrigin: false,
      });
      this.steps.push(step);
    }

    this.label.setProps({ localeText: () => '0' });
  }
}
