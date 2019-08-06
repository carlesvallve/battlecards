import animate from 'animate';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import View from 'ui/View';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  data: {
    name: string;
    description: string;
  };
};

export default class MonsterInfo {
  private props: Props;
  private container: View;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
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

    const labelName = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Title'),
      size: 11,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.15,
      localeText: () => props.data.name,
    });

    const labelDescription = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Body'),
      size: 8,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.56,
      localeText: () => props.data.description,
    });
  }
}
