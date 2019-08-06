import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import Label from '../battle/Label';
import StateObserver from 'src/redux/StateObserver';
import View from 'ui/View';
import { Target } from 'src/types/custom';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  target: Target;
  type: string;
};

export default class StatInfo {
  label: LangBitmapFontTextView;

  private props: Props;
  private container: View;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    // this.createSelectors();
  }

  private createSelectors() {
    const target = this.props.target;
    const type = this.props.type;

    StateObserver.createSelector(
      ({ combat }) => combat[target][type],
    ).addListener((value) => {
      console.log('    ', target, type, value);
      this.label.localeText = () => value;
    });
  }

  private createViews(props: Props) {
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

    const icon = new ImageView({
      superview: this.container,
      width: 16,
      height: 16,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      image: `resources/images/ui/icons/${
        props.type === 'damage' ? 'sword' : 'helmet'
      }.png`,
    });

    this.label = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      size: 11,
      x: this.container.style.width * 0.46,
      y: this.container.style.height * 0.5 + 8,
      localeText: () => '0',
    });
  }
}
