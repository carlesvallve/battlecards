import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import View from 'ui/View';

export default class ProgressBar extends Basic {
  bar: ImageScaleView;

  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);
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

    this.bar = new ImageScaleView({
      superview: this.container,
      ...(props.type === 'hp' ? uiConfig.frameRed : uiConfig.frameBlue),
      centerOnOrigin: false,
      width: this.container.style.width - 5,
      height: this.container.style.height - 5,
      x: 2.5,
      y: 2.5,
    });

    this.bar.tip = new View({
      superview: this.bar,
      // backgroundColor: props.type === 'hp' ? 'red' : 'blue',
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

    const label = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      size: size / 2,
      x: 22,
      y: this.container.style.height * 0.45,
      height: this.container.style.height,
      localeText: () => '20',
    });

    const labelMax = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      size: size / 2.5,
      x: this.container.style.width - 18,
      y: this.container.style.height * 0.45,
      height: this.container.style.height,
      localeText: () => '/20',
      opacity: 0.5,
    });
  }

  setProgress(value: number, maxValue: number) {
    const percent = (1 * value) / maxValue;
    const width = (this.container.style.width - 5) * percent;

    const t = 150;
    const ease = animate.easeInOut;

    animate(this.bar)
      .clear()
      .then({ width, t, ease });

    this.bar.tip.updateOpts({ visible: percent < 1 });
    animate(this.bar.tip)
      .clear()
      .then({ x: width - 5, t, ease })
      .then(() => {
        this.bar.tip.updateOpts({ visible: percent < 1 });
      });
  }
}
