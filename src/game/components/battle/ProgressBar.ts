import animate from 'animate';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import View from 'ui/View';
import StateObserver from 'src/redux/StateObserver';
import { Target, TargetStat } from 'src/types/custom';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  target: Target;
  type: string;
};

const animDuration = 150;

export default class ProgressBar {
  bar: ImageScaleView;
  barTip: View;
  labelStat: LangBitmapFontTextView;
  labelStatMax: LangBitmapFontTextView;

  private props: Props;
  private container: View;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  private createSelectors() {
    const target = this.props.target;
    const type = this.props.type;

    StateObserver.createSelector(
      ({ combat }) => combat[target].stats[type],
    ).addListener((value: TargetStat) => {
      if (!value) return;
      // console.log('### value:', value);
      this.setProgress(value);
    });
  }

  protected createViews(props: Props) {
    this.container = new View({ ...props, centerOnOrigin: true });

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

    this.bar = new ImageScaleView({
      superview: this.container,
      ...(props.type === 'hp' ? uiConfig.frameRed : uiConfig.frameBlue),
      centerOnOrigin: false,
      width: this.container.style.width - 5,
      height: this.container.style.height - 5,
      x: 2.5,
      y: 2.5,
    });

    this.barTip = new View({
      superview: this.bar,
      backgroundColor:
        props.type === 'hp' ? uiConfig.colors.red : uiConfig.colors.blue,
      width: 5,
      height: this.container.style.height - 5,
      x: this.bar.style.width - 5,
      y: 0,
    });

    const size = props.height;

    const icon = new ImageView({
      superview: this.container,
      width: size,
      height: size,
      x: 2,
      y: this.container.style.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      image: `resources/images/ui/icons/${
        props.type === 'hp' ? 'heart' : 'diamond2'
      }.png`,
    });

    this.labelStat = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      size: size / 2,
      align: 'left',
      x: size * 0.7,
      y: this.container.style.height * 0.45,
      height: this.container.style.height,
      localeText: () => '0',
    });

    this.labelStatMax = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      size: size / 2.5,
      align: 'right',
      x: this.container.style.width - size * 0.4,
      y: this.container.style.height * 0.45,
      height: this.container.style.height,
      localeText: () => '/0',
      opacity: 0.5,
    });
  }

  setProgress(value: TargetStat) {
    this.labelStat.localeText = () => `${Math.max(value.current, 0)}`;
    this.labelStatMax.localeText = () => `/${Math.max(value.max, 0)}`;

    const percent = (1 * value.current) / value.max;
    const width = (this.container.style.width - 5) * percent;
    const tipVisible = percent > 0 && percent < 1;

    animate(this.bar)
      .clear()
      .wait(animDuration)
      .then({ width }, animDuration, animate.easeInOut);

    this.barTip.updateOpts({ visible: tipVisible });
    animate(this.barTip)
      .clear()
      .wait(animDuration)
      .then({ x: width - 5 }, animDuration, animate.easeInOut)
      .then(() => {
        this.barTip.updateOpts({ visible: tipVisible });
      });
  }
}
