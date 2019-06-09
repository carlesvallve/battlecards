import PopupBasic from 'src/game/components/popups/PopupBasic';
import i18n from 'src/lib/i18n/i18n';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';

export default class PopupError extends PopupBasic {
  title: View;
  message: View;
  image: View;

  constructor(opts) {
    super(opts);

    this.style.zIndex = 10000;

    this.box.updateOpts({
      centerOnOrigin: true,
      width: 460,
    });

    this.title = new BitmapFontTextView({
      superview: this.box,
      x: 20,
      y: -23,
      width: this.box.style.width - 40,
      align: 'center',
      verticalAlign: 'center',
      size: 50,
      color: 'white',
      wordWrap: false,
      font: bitmapFonts('TitleStroke'),
    });

    this.message = new BitmapFontTextView({
      superview: this.box,
      x: 20,
      y: 55,
      width: this.box.style.width - 40,
      align: 'center',
      verticalAlign: 'center',
      size: 30,
      color: 'white',
      wordWrap: true,
      font: bitmapFonts('Title'),
      isRichText: true,
    });

    this.image = new ImageView({
      superview: this.box,
      image: null,
      width: 320,
      height: 320,
      x: this.box.style.width * 0.5 - 160,
      y: this.box.style.height * 0.4 - 160,
    });

    this.buttonClose.updateOpts({
      x: this.box.style.width / 2,
      y: this.box.style.height - 10,
    });
  }

  init(opts) {
    super.init(opts);

    // update popup text
    this.title.text = opts.title || i18n('basic.error');
    this.message.text = opts.message.toUpperCase();

    // update popup height depending on number of lines
    const numberOfLines = opts.numberOfLines || 1;
    let h = this.message.style.y + numberOfLines * 38 + 60;

    // resize and relocate rest of elements
    this.box.style.height = h;
    this.buttonClose.style.y = h - 10;

    // re-center popup
    this.box.style.y = this.style.height / 2 + this.box.style.height;
  }
}
