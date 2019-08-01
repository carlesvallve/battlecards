import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';

type Opts = {
  superview: View;
  level: number;
  visible: boolean;
};

export type Props = {
  level: number;
  scale: number;
  visible: boolean;
  active: boolean;
};

export default class CardStars {
  private props: Props = { level: 0, scale: 1, visible: false, active: false };
  private container: View;
  private stars: ImageScaleView[];
  private totalWidth: number;

  constructor(opts: Opts) {
    this.totalWidth = opts.superview.style.width;
    this.createViews(opts);
  }

  getView() {
    return this.container;
  }

  setProps(props: Props) {
    this.update(props);
    this.props = props;
  }

  private update(props: Props) {
    if (props !== this.props) {
      this.container.updateOpts({ visible: props.visible });

      this.container.updateOpts({
        x: (this.totalWidth - (props.level - 1) * 20 * 2) / 2,
      });

      for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].updateOpts({
          visible: i < props.level,
          x: i * 20 * 2,
          image: props.active
            ? 'resources/images/ui/cards/card_star_active.png'
            : 'resources/images/ui/cards/card_star_disabled.png',
        });
      }

      for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].updateOpts({ scale: props.scale });
      }
    }
  }

  private createViews({ superview, visible, level }: Opts) {
    this.container = new View({
      superview,
      backgroundColor: 'rgba(255,0,0,0.5)',
      visible,
      x: (superview.style.width - (level - 1) * 20) / 2,
      y: 2,
    });

    this.stars = [];
    const w = 20 * 2;
    for (let i = 0; i < 5; i++) {
      this.stars.push(
        new ImageScaleView({
          superview: this.container,
          x: i * w,
          width: w,
          height: w,
          image: 'resources/images/ui/cards/card_star_active.png',
          centerOnOrigin: true,
          centerAnchor: true,
        }),
      );
    }
  }
}
