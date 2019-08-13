import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';

export default class Label extends Basic {
  private text: LangBitmapFontTextView;

  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);

    // update localeText
    this.text.localeText = props.localeText;

    const t = 100;
    if (props.localeText) {
      animate(this.text)
        .clear()
        .then({ scale: 1.5 }, t * 0.5, animate.easeInOut)
        .then(() => (this.text.localeText = props.localeText))
        .then({ scale: 1 }, t * 1, animate.easeInOut);
    }

    // update color
    if (props.color) this.text.color = props.color;

    this.text.updateOpts({
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    this.text = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      ...props,
      superview: this.container,
    });
  }
}
