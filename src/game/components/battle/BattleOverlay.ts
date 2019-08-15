import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions, getRandomInt } from 'src/lib/utils';
import { Target } from 'src/types/custom';
import uiConfig from 'src/lib/uiConfig';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import StateObserver from 'src/redux/StateObserver';
import ruleset from 'src/redux/ruleset';

type Props = { superview: View; zIndex: number };

export default class BattleOverlay {
  private props: Props;
  private container: View;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createSelectors();
  }

  private createSelectors() {
    StateObserver.createSelector(({ ui }) => {
      return ui.isBlocked;
    }).addListener((isBlocked) => {
      this.container.updateOpts({
        backgroundColor: isBlocked ? 'rgba(255, 0, 0, 0.25)' : '',
        canHandleEvents: isBlocked,
      });
    });
  }

  getView() {
    return this.container;
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      ...props,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: screen.width,
      height: screen.height,
      infinite: true,
      canHandleEvents: false,
    });
  }

  createDamageLabel(loser: Target, damage: number, startY: number) {
    const startX = this.container.style.width / 2 + getRandomInt(-15, 15);
    // let yy = this.container.style.height / 2 + 205;
    // if (loser === 'monster') {
    //   yy = this.container.style.height * ruleset.baselineY - 60;
    // }

    const labelDamage = new LangBitmapFontTextView({
      ...uiConfig.bitmapFontText,
      superview: this.container,
      font: bitmapFonts('TitleStroke'),
      localeText: () => `${damage}`,
      x: startX,
      y: startY,
      size: 18,
      color: 'yellow',
      scale: 0,
      opacity: 0,
      zIndex: 100,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    const y = startY - 60;
    animate(labelDamage)
      .clear()
      .wait(150)
      .then({ scale: 1, opacity: 1 }, 100, animate.easeInOut)
      .then({ y }, 600, animate.linear)
      .then({ scale: 0, opacity: 0 }, 100, animate.easeInOut)
      .then(() => {
        labelDamage.removeFromSuperview();
      });
  }
}
