import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig, { animDuration } from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import StateObserver from 'src/redux/StateObserver';
import { setResolved, getTarget } from 'src/redux/shortcuts/combat';
import View from 'ui/View';
import { blockUi, navigateToScene } from 'src/redux/shortcuts/ui';
import sounds from 'src/lib/sounds';
import ButtonView from 'ui/widget/ButtonView';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import { getScreenDimensions, waitForIt } from 'src/lib/utils';

type Props = { superview: View };

export default class GameOver {
  private props: Props;
  private container: View;
  private label: LangBitmapFontTextView;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  init() {
    this.container.updateOpts({ opacity: 0, visible: false });
  }

  private createSelectors() {
    StateObserver.createSelector(({ combat }) => combat).addListener(
      (combat) => {},
    );

    // hero's death

    StateObserver.createSelector(
      ({ combat }) => combat.hero.isDead,
    ).addListener((heroIsDead) => {
      if (!heroIsDead) return;

      this.fadeIn();
    });
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new ButtonView({
      ...props,
      backgroundColor: 'rgba(0, 0 , 0, 0.9)',
      width: screen.width,
      height: screen.height,
      // centerOnOrigin: true,
      // centerAnchor: true,
      opacity: 0,
      visible: false,
      onClick: () => {
        if (this.container.style.opacity < 1) return;
        // this.fadeOut();

        navigateToScene('title');
      },
    });

    this.label = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('Title'),
      size: 36,
      color: 'red',
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      opacity: 0,
      localeText: () => 'GAME OVER',
    });
  }

  private fadeIn() {
    const screen = getScreenDimensions();
    const t = animDuration * 2;
    const y = screen.height * 0.5;

    this.container.updateOpts({ opacity: 0, visible: true });

    waitForIt(() => {
      animate(this.container).then({ opacity: 1 }, t, animate.easeInOut);

      this.label.updateOpts({ y: y + 40 });
      animate(this.label).then({ opacity: 1, y }, t * 2, animate.easeInOut);
    }, 300);
  }

  private fadeOut() {
    const screen = getScreenDimensions();
    const t = animDuration * 1;
    const y = screen.height * 0.5;
    +140;

    animate(this.container)
      .then({ opacity: 0 }, t, animate.easeInOut)
      .then(() => this.container.hide());

    animate(this.label).then({ opacity: 0, y }, t * 2, animate.easeInOut);
  }
}
