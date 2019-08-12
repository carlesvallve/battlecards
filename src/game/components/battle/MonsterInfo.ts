import animate from 'animate';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ImageScaleView from 'ui/ImageScaleView';
import View from 'ui/View';
import { Target } from 'src/types/custom';
import StateObserver from 'src/redux/StateObserver';
import ruleset from 'src/redux/ruleset';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  target: Target;
};

export default class MonsterInfo {
  private props: Props;
  private container: View;
  private labelName: LangBitmapFontTextView;
  private labelDesc: LangBitmapFontTextView;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  private createSelectors() {
    const target = this.props.target;

    StateObserver.createSelector(({ combat }) => combat[target].id).addListener(
      (id) => {
        if (!id) return;

        this.labelName.localeText = () => ruleset.monsters[id].name;
        this.labelDesc.localeText = () => ruleset.monsters[id].desc;

        const desc = !!ruleset.monsters[id].desc;
        this.labelName.updateOpts({
          size: desc ? 11 : 14,
          y: this.container.style.height * (desc ? 0.15 : 0.28),
        });
      },
    );
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

    this.labelName = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Title'),
      size: 11,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.15,
      localeText: () => '',
    });

    this.labelDesc = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Body'),
      size: 8,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.56,
      localeText: () => '',
    });
  }
}
