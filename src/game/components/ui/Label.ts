import animate from 'animate';
import View from 'ui/View';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';

export type Props = {
  superview?: View;
  localeText?: () => string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
};

export default class Label {
  private container: LangBitmapFontTextView;
  private props: Props = {};

  constructor(props: Props) {
    this.createViews(props);
  }

  getView() {
    return this.container;
  }

  setProps(props: Props) {
    this.update(props);
    this.props = { ...props };
  }

  private update(props: Props) {
    if (props !== this.props) {
      const t = 100;
      animate(this.container)
        .clear()
        .then({ scale: 1.25 }, t, animate.easeInOut)
        .then(() => {
          if (props.localeText) this.container.localeText = props.localeText;
          this.container.updateOpts({ ...props });
        })
        .then({ scale: 1 }, t, animate.easeInOut);
    }
  }

  private createViews(props: Props) {
    this.container = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      ...props,
      font: bitmapFonts('TitleStroke'),
    });

    this.container.updateOpts({
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }
}
