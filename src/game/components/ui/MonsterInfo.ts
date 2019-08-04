import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';

export default class MonsterInfo extends Basic {
  constructor(props: BasicProps) {
    super(props);
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    this.container.updateOpts({
      // backgroundColor: 'rgba(128, 255, 128, 0.5)',
      // width: props.width || 140,
      // height: props.height || 25,
      // scale: props.scale || 1,
      // centerOnOrigin: true,
      // centerAnchor: true,
    });

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

    // const icon = new ImageView({
    //   superview: this.container,
    //   width: 16,
    //   height: 16,
    //   x: this.container.style.width * 0.5,
    //   y: this.container.style.height * 0.5,
    //   centerOnOrigin: true,
    //   centerAnchor: true,
    //   image: `resources/images/ui/icons/${
    //     props.type === 'attack' ? 'sword' : 'helmet'
    //   }.png`,
    // });

    const labelName = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Title'),
      size: 12,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.15,
      localeText: () => props.data.name,
    });

    const labelDescription = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Body'),
      size: 9,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.55,
      localeText: () => props.data.description,
    });
  }
}
