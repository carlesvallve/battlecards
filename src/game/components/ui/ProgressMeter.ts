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
  addAttackIcons,
} from 'src/redux/shortcuts/combat';
import { Target } from 'src/types/custom';
import BattleArea from '../battle/BattleArea';

const totalSteps = 12;
const animDuration = 100;

export default class ProgressMeter extends Basic {
  private label: Label;
  private steps: ImageScaleView[];

  constructor(props: BasicProps) {
    super(props);
    this.createSelectors();
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  private createSelectors() {
    const type = this.props.type;

    // turn was played -> throw dice and add steps
    StateObserver.createSelector(({ combat }) => combat[type].turn).addListener(
      (turn) => {
        if (turn === 0) return;

        const dice = getRandomInt(1, 6);
        // console.log('>>>', type, 'turn', turn, 'dice', dice);
        this.addSteps(dice);
      },
    );

    // enemy meter changed -> update meter colors
    StateObserver.createSelector(
      ({ combat }) => combat[BattleArea.getEnemyType(type)].meter,
    ).addListener((enemyMeter) => {
      this.refreshColors(enemyMeter);
    });
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    this.container.updateOpts({});

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
        ...BattleArea.getColorByType(this.props.type),
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

  resetSteps(over: number) {
    for (let i = 0; i < totalSteps; i++) {
      const step = this.steps[i].updateOpts({
        ...BattleArea.getColorByType(this.props.type),
        centerOnOrigin: false,
      });
      this.steps.push(step);
    }

    console.log('>>> adding attacks to redux:', this.props.type, over);
    addAttackIcons(BattleArea.getEnemyType(this.props.type), over);

    resetMeter(this.props.type);
    this.label.setProps({ localeText: () => '0' });
  }

  addSteps(dice: number) {
    // get start position
    const lastMeter = getCurrentMeter(this.props.type);
    const start = lastMeter;

    // escape if overhead
    let end = start + dice;
    const over = end - this.props.stepLimit;
    if (over > 0) {
      this.resetSteps(over);
      return;
    }

    // update label
    this.label.setProps({ localeText: () => end.toString() });

    // iterate all steps
    for (let i = 0; i < dice; i++) {
      waitForIt(() => {
        const num = i + start + 1;
        const step = this.steps[num - 1];

        step.updateOpts({
          ...BattleArea.getColorByDiff(this.props.type, num),
          centerOnOrigin: false,
        });

        updateMeter(this.props.type, 1); // update redux meter
      }, animDuration * i);
    }
  }

  refreshColors(enemyMeter: number) {
    const currentMeter = getCurrentMeter(this.props.type);

    for (let i = 1; i <= currentMeter; i++) {
      const step = this.steps[i - 1];
      let color = enemyMeter < i ? uiConfig.frameYellow : uiConfig.frameOrange;
      step.updateOpts({
        ...color,
        centerOnOrigin: false,
      });
    }
  }
}
