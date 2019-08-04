import ImageScaleView from 'ui/ImageScaleView';
import { initTapBehavior, addTapBehavior } from './tapBehavior';
import { waitForIt } from '../utils';

export default class ButtonScaleView extends ImageScaleView {
  protected preventDefault: boolean;
  protected normalImage: string;
  protected pressedImage: string;
  protected disabledImage: string;
  protected pressedOffsetX: number;
  protected pressedOffsetY: number;
  protected pressed: boolean;
  protected disabled: boolean;
  protected icon: ImageScaleView;
  protected onClick: any; // () => void;

  constructor(opts) {
    super(opts);
    initTapBehavior(this);

    if (!opts.imagePressed) {
      opts.imagePressed = opts.image;
    }

    if (!opts.imageDisabled) {
      opts.imageDisabled = opts.image;
    }

    this.preventDefault = opts.preventDefault;

    this.normalImage = opts.image;
    this.pressedImage = opts.imagePressed;
    this.disabledImage = opts.imageDisabled;

    // button up and down callbacks
    this.onDown = opts.onDown || this.onDown;
    this.onUp = opts.onUp || this.onUp;

    // button action
    this.onClick = opts.onClick || this.onClick; // a derived class can also redefine onClick method

    // pressed state subview offsets, i.e. text subview is lowered to look pressed
    this.pressedOffsetX = opts.pressedOffsetX || 0;
    this.pressedOffsetY = opts.pressedOffsetY || 0;

    // button states
    this.pressed = false;
    this.disabled = false;

    // add an icon subview if included
    opts.icon &&
      this.addIcon(
        opts.icon.image,
        opts.icon.width,
        opts.icon.height,
        opts.icon.offset,
      );
  }
  addIcon(img, width, height, offset) {
    const s = this.style;
    width = width || s.width;
    height = height || s.height;
    offset = offset || { x: 0, y: 0 };

    if (!this.icon) {
      this.icon = new ImageScaleView({
        parent: this,
        canHandleEvents: false,
      });
    }

    const is = this.icon.style;
    is.x = (s.width - width) / 2 + offset.x;
    is.y = (s.height - height) / 2 + offset.y;
    is.width = width;
    is.height = height;
    this.icon.setImage(img);
  }
  setDisabled(disabled) {
    this.disabled = disabled;

    if (disabled) {
      this.setImage(this.disabledImage);
    } else {
      this.setImage(this.normalImage);
    }
  }
  setPressed(pressed) {
    this.pressed = pressed;

    if (pressed) {
      if (this.pressedImage) this.setImage(this.pressedImage);
      this.onDown && this.onDown();
      this.offsetSubviews();
    } else {
      waitForIt(() => {
        if (!this.disabled) {
          if (this.normalImage) this.setImage(this.normalImage);
        }
        this.onUp && this.onUp();
        this.onsetSubviews();
      }, 100);
    }
  }
  getPressed() {
    return this.pressed;
  }

  onTap(pt?: { x: number; y: number }) {
    this.onClick && this.onClick(pt);
  }

  onDown() {
    this.onPress && this.onPress();
  }

  onUp() {
    this.onRelease && this.onRelease();
  }

  offsetSubviews() {
    const subviews = this.getSubviews();
    for (const i in subviews) {
      const view = subviews[i];

      view.style.x += this.pressedOffsetX;
      view.style.y += this.pressedOffsetY;
    }
  }
  onsetSubviews() {
    const subviews = this.getSubviews();
    for (const i in subviews) {
      const view = subviews[i];

      view.style.x -= this.pressedOffsetX;
      view.style.y -= this.pressedOffsetY;
    }
  }

  setPressedOffset(value: { x?: number; y?: number }) {
    if (this.pressed) {
      // Restore view positions if needed.
      this.onsetSubviews();
    }

    this.pressedOffsetX = value.x || 0;
    this.pressedOffsetY = value.y || 0;

    if (this.pressed) {
      // Update view positions if needed.
      this.offsetSubviews();
    }
  }
}

addTapBehavior(ButtonScaleView);
