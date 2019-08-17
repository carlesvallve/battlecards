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
  setMeter,
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
    // meter value changed
    StateObserver.createSelector(({ ui, combat }) => {
      if (ui.scene !== 'game') return null;
      return combat[this.props.target].meter;
    }).addListener((meter) => {
      if (meter === null) return;

      const playSound = StateObserver.getState().combat.index.turn > 1;
      this.updateMeter(meter, playSound);
    });

    // new combat
    StateObserver.createSelector(({ ui, combat }) => {
      if (ui.scene !== 'game') return null;
      return combat[this.props.target].stats.maxSteps;
    }).addListener((maxSteps) => {
      if (maxSteps === null) return;

      this.updateMeter(0, false);
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
      scale: 0, // 0.75,
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
    if (!this.active) return;
    this.active = false;
    animate(this.container).then(
      { scale: 0, opacity: 0 },
      250,
      animate.easeInOut,
    );
  }

  showMeter() {
    if (this.active) return;

    setMeter(this.props.target, 0);

    // update bg
    this.updateMeterBg();

    animate(this.container)
      .then({ scale: 0.75, opacity: 1 }, 250, animate.easeInOut)
      .then(() => (this.active = true));
  }

  createSteps(props: Props) {
    const w = (this.container.style.width - totalSteps) / totalSteps;

    this.steps = [];
    for (let i = 0; i < totalSteps; i++) {
      const allowed = false;

      const step = new ImageScaleView({
        active: false,

        superview: this.container,
        ...getColorByTarget(this.props.target),
        centerOnOrigin: false,
        width: w - 1,
        height: this.container.style.height - 10,
        x: 6 + i * w,
        y: 5,
        opacity: allowed ? 1 : 0,
      });
      this.steps.push(step);
    }
  }

  updateMeter(meter: number, playSound: boolean = false) {
    const target = this.props.target;
    const { combat } = StateObserver.getState();
    const maxSteps = combat[target].stats.maxSteps;

    // update bg
    this.updateMeterBg();

    // update label
    this.label.setProps({ localeText: () => meter.toString() });

    // update sound
    // console.log('==============================', target, meter, playSound);
    if (playSound) sounds.playSound('tick2', 0.1);

    // update steps
    for (let i = 0; i < totalSteps; i++) {
      const step = this.steps[i];

      // basic color (red or blue)
      this.steps[i].updateOpts({
        ...getColorByTarget(target),
        centerOnOrigin: false,
      });

      // hide steps that are not allowed
      const allowed = i <= maxSteps - 1;
      step.updateOpts({ opacity: allowed ? 1 : 0 });

      // dim steps that re risky
      const risky = i >= maxSteps - 4;
      if (allowed && risky) {
        step.updateOpts({ opacity: 0.7 });
      }
    }

    // update yellow/orange colors
    this.updateMeterColors();
  }

  updateMeterBg() {
    const { combat } = StateObserver.getState();
    if (combat[this.props.target].overhead > 0) {
      this.bg.updateOpts({ ...uiConfig.frameRed, zIndex: 2 });
    } else {
      this.bg.updateOpts({ ...uiConfig.frameBlack, zIndex: 0 });
    }
  }

  updateMeterColors() {
    const { target } = this.props;
    const meter = getCurrentMeter(target);
    const enemyMeter = getCurrentMeter(getTargetEnemy(target));

    // tint steps that are active (orange or yellow)
    for (let i = 0; i < totalSteps; i++) {
      const step = this.steps[i];

      const active = i < meter;
      if (active) {
        let stepColor =
          enemyMeter <= i ? uiConfig.frameYellow : uiConfig.frameOrange;

        step.updateOpts({
          opacity: 1,
          ...stepColor,
          centerOnOrigin: false,
        });
      }
    }
  }
}
