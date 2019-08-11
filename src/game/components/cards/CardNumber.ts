import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ImageScaleView from 'ui/ImageScaleView';
import bitmapFonts from 'src/lib/bitmapFonts';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';

export type CardNum = 1 | 2 | 3 | 4 | 5 | 6;

export type Props = {
  superview?: View;
  x?: number;
  y?: number;
  scale?: number;
  onClick?: (id: CardNum) => void;

  num: CardNum;
};

export default class CardNumber {
  private props: Props = {
    superview: null,
    num: null,
  };
  private container: View;
  private label: LangBitmapFontTextView;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.setProps(props);
  }

  destroy() {
    // note: don't forget to remove listeners if any by doing:
    // -> selector.removeListener(x)
    this.container.removeFromSuperview();
  }

  getView() {
    return this.container;
  }

  getNum(): CardNum {
    return this.props.num;
  }

  updateLabel(str: string) {
    this.label.localeText = () => str;
  }

  setProps(props: Props) {
    if (props === this.props) return;
    this.update(props);
    this.props = props;
  }

  private update(props: Props) {
    const { num } = props;
    this.label.localeText = () => num.toString();
  }

  private createViews(props: Props) {
    // 120 x 170

    this.container = new View({
      superview: props.superview,
      x: props.x,
      y: props.y,
      width: 120 * 2,
      height: 170 * 2,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: props.scale || 1,
      r: -0.1 + Math.random() * 0.2,
    });

    // image-bg
    const imageBg = new View({
      superview: this.container,
      backgroundColor: '#333',
      x: 10,
      y: 10,
      width: 222,
      height: 222, // 136 * 2,
    });

    const frame = new ImageScaleView({
      superview: this.container,
      width: this.container.style.width,
      height: this.container.style.height,
      image: 'resources/images/ui/cards/card_frame.png',
      scaleMethod: '9slice',
      sourceSlices: {
        horizontal: { left: 14 * 2, right: 14 * 2 },
        vertical: { top: 16 * 2, bottom: 33 * 2 },
      },
    });

    const backImage = new View({
      superview: this.container,
      backgroundColor: 'white',
      x: 10,
      y: 10,
      width: 120 * 2 - 20,
      height: 170 * 2 - 20,
    });

    this.label = new LangBitmapFontTextView({
      superview: this.container,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      font: bitmapFonts('Title'),
      size: 100,
      color: 'black',
      align: 'center',
      verticalAlign: 'center',
      x: this.container.style.width / 2,
      y: this.container.style.height / 2,
      width: this.container.style.width,
      height: 120,
      centerOnOrigin: true,
      centerAnchor: true,
      localeText: () => this.props.num.toString(),
    });

    const button = new ButtonView({
      superview: this.container,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: 120 * 2,
      height: 170 * 2,
      onClick: () => props.onClick && props.onClick(this.props.num),
    });
  }
}
