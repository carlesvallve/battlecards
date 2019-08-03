import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';

export default class Label extends Basic {
  private text: LangBitmapFontTextView;

  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);

    // update localeText
    const t = 100;
    if (props.localeText) {
      animate(this.text)
        .then({ scale: 1.25 }, t, animate.easeInOut)
        .then(() => (this.text.localeText = props.localeText))
        .then({ scale: 1 }, t, animate.easeInOut);
    }

    // update color
    if (props.color) this.text.color = props.color;
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    this.text = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      ...props,
      superview: this.container,
      x: this.container.style.width / 2,
      y: this.container.style.height / 4,
      font: bitmapFonts('TitleStroke'),
    });
  }
}
