import animate from 'animate';
import View from 'ui/View';

export type BasicProps = {
  superview?: View;
  x?: number;
  y?: number;
  scale?: number;

  localeText?: () => string;
  size?: number;
  color?: string;
};

export type DefaultProps = {
  superview: View;
};

export default class Basic {
  protected container: View;
  protected props: BasicProps = {};
  protected previousProps: BasicProps;

  constructor(props: BasicProps) {
    this.props = props;
    this.createViews(props);
  }

  getView() {
    return this.container;
  }

  setProps(props: BasicProps) {
    this.previousProps = Object.assign({}, this.props);
    const changedProps = {} as BasicProps;
    for (let i in props) {
      if (this.props[i] !== props[i]) {
        changedProps[i] = props[i];
      }
    }

    this.update(changedProps);
    this.props = Object.assign({}, this.props, props);
  }

  protected update(props: BasicProps) {
    // xxanimate(this.container).clear();

    const t = 150;
    animate(this.container)
      // .clear()
      .then({ ...props }, t, animate.easeInOut);
  }

  protected createViews(props: BasicProps) {
    this.container = new View({
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: 4,
      height: 4,
      centerOnOrigin: true,
      centerAnchor: true,
      ...props,
    });
  }

  protected transform({ x, y, scale }) {
    x = x || this.props.x;
    y = y || this.props.y;
    scale = scale || this.props.scale;

    const t = 100;
    animate(this.container)
      .clear()
      .then({ x, y, scale }, t, animate.easeInOut);
  }
}
