import ButtonScaleView from './ButtonScaleView';
import LangBitmapFontTextView from './LangBitmapFontTextView';
import Image from 'ui/resource/Image';
import ImageView from 'ui/ImageView';

export default class ButtonScaleViewWithText extends ButtonScaleView {
  private iconImage;
  private onPress: any;
  private onRelease;
  private font;
  private disabledFont;
  private disabledFontOffsetY;
  private textColor;
  private disabledTextColor;
  private label;

  constructor(opts) {
    super(opts);

    if (opts.iconData) {
      let { url, x, y, size } = opts.iconData;
      size = this.style.height * size;

      this.iconImage = new ImageView({
        superview: this,
        x: (this.style.width - size) / 2 + x,
        y: (this.style.height - size * 1.1) / 2 + y, // most button has a bottom bevel, so account for it
        width: size,
        height: size,
        image: new Image({ url: url }),
      });
    }

    this.onPress = opts.onPress;
    this.onRelease = opts.onRelease;

    this.font = opts.font || null;
    this.disabledFont = opts.disabledFont || null;
    this.disabledFontOffsetY = opts.disabledFontOffsetY || 0;

    this.textColor = opts.textColor || 'white';
    this.disabledTextColor = opts.disabledTextColor || '';

    const labelPaddingX = opts.labelPaddingX || this.style.width / 12;
    const labelPaddingY = opts.labelPaddingY || this.style.height / 10;

    const labelOffsetX = opts.labelOffsetX || 0;
    const labelOffsetY = opts.labelOffsetY || 0;

    this.label = new LangBitmapFontTextView({
      superview: this,
      // text: opts.text,
      localeText: opts.localeText, // this component renders localized texts as () => string
      x: labelOffsetX + labelPaddingX,
      y: labelOffsetY + labelPaddingY * 0.75, // there is a shadow under most buttons, hence label is a bit higher than center
      width: this.style.width - labelPaddingX * 2,
      height: this.style.height - labelPaddingY * 2,
      font: opts.font,
      align: 'center',
      verticalAlign: 'center',
      wordWrap: opts.wordWrap || false,
      size: opts.fontSize || this.style.height * 0.25,
      color: opts.textColor,
    });

    this.label.setHandleEvents(false, true);
  }

  set localeText(value: () => string) {
    this.label.localeText = value;
  }

  setDisabled(disabled) {
    super.setDisabled(disabled);

    if (disabled) {
      if (this.disabledFont) {
        this.label.font = this.disabledFont;
        this.label.style.offsetY = this.disabledFontOffsetY;
      }
      if (this.disabledTextColor) {
        this.label.color = this.disabledTextColor;
      } else {
        this.label.color = this.textColor;
      }
    } else {
      this.label.font = this.font;
      this.label.color = this.textColor;
      this.label.style.offsetY = 0;
    }
  }

  get text() {
    return this.label.text;
  }

  set text(value) {
    this.label.text = value;
  }

  updateButtonImage(img) {
    this.setImage(img);
    this.normalImage = img;
    this.pressedImage = img;
    this.disabledImage = img;
  }

  updateButtonImages(opts) {
    this.setImage(opts.image);
    this.normalImage = opts.image;
    this.pressedImage = opts.imagePressed;
    this.disabledImage = opts.imageDisabled;
  }

  onTap() {
    this.onClick && this.onClick();
  }

  onDown() {
    this.onPress && this.onPress();
  }

  onUp() {
    this.onRelease && this.onRelease();
  }

  setBaseButton(baseButton: {
    image: string;
    imagePressed: string;
    imageDisabled: string;
    scaleMethod: string;
    sourceSlices: {
      horizontal: { left: number; right: number };
      vertical: { top: number; bottom: number };
    };
    pressedOffsetY: number;
  }) {
    this.updateButtonImages({
      image: baseButton.image,
      imagePressed: baseButton.imagePressed,
      imageDisabled: baseButton.imageDisabled,
    });

    this.updateOpts({
      scaleMethod: baseButton.scaleMethod,
      sourceSlices: baseButton.sourceSlices,
    });

    this.setPressedOffset({ y: baseButton.pressedOffsetY });
  }

  setLabelPosition(position: { x?: number; y?: number }) {
    if ('x' in position) {
      const offset = this.pressed ? this.pressedOffsetX : 0;
      this.label.style.x = position.x + offset;
    }

    if ('y' in position) {
      const offset = this.pressed ? this.pressedOffsetY : 0;
      this.label.style.y = position.y + offset;
    }
  }
}
