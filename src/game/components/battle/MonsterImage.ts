import animate from 'animate';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import { MonsterID } from 'src/redux/ruleset/monsters';

type Props = {
  superview: View;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default class MonsterImage {
  private props: Props;
  private container: View;
  private image: ImageView;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  private createViews(props: Props) {
    this.container = new View({ ...props, centerOnOrigin: true });

    this.image = new ImageView({
      superview: this.container,
      image: `resources/images/monsters/${props.image}.png`,
      width: this.container.style.width,
      height: this.container.style.height,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      scale: 1,
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }
}
