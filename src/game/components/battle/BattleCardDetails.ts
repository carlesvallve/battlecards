import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import bitmapFonts from 'src/lib/bitmapFonts';
import { getScreenDimensions } from 'src/lib/utils';
import uiConfig, { animDuration } from 'src/lib/uiConfig';
import Card from '../cards/Card';

type Props = { superview: View; zIndex: number };

export default class BattleCardDetails {
  private props: Props;
  private container: View;
  private bg: View;
  private buttonUse: View;
  private cards: Card[];
  private selectedCardData: {
    card: Card;
    x: number;
    y: number;
    scale: number;
    r: number;
  };
  private active: boolean = false;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: false,
      zIndex: props.zIndex,
    });

    this.bg = new ButtonView({
      superview: this.container,
      zIndex: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: true,
      visible: false,
      opacity: 0,
      onClick: () => {
        this.hideCardDetails();
      },
    });

    this.buttonUse = new ButtonScaleViewWithText({
      ...uiConfig.buttonGreen,
      superview: this.container,
      zIndex: 3,
      width: screen.width - 40,
      height: 100,
      x: 20,
      y: screen.height + 20,
      labelOffsetY: -3,
      localeText: () => 'USE',
      size: 16,
      font: bitmapFonts('TitleStroke'),
      onClick: () => {
        sounds.playSound('click1', 0.3);
        this.hideCardDetails();
      },
    });
  }

  showCardDetails(card: Card) {
    if (card.getMode() === 'full') return;

    sounds.playSound('swoosh4', 0.1);

    this.props.superview.updateOpts({ zIndex: 3 });
    card.getView().updateOpts({ zIndex: 100 });

    const screen = getScreenDimensions();

    const t = animDuration * 1;

    this.bg.show();
    animate(this.bg)
      .clear()
      .wait(0)
      .then({ opacity: 1 }, t, animate.easeOut);

    animate(this.buttonUse)
      .clear()
      .wait(t * 0.5)
      .then({ y: screen.height - 120 }, t, animate.easeInOut);

    const { x, y, scale, r } = card.getView().style;
    this.selectedCardData = { card, x, y, scale, r };
    card.setProps({ mode: 'full', side: 'front' });

    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        { x: screen.width / 2, y: screen.height * 0.425, scale: 0.5, r: r / 2 },
        t * 0.5,
        animate.easeOut,
      )
      .then({ scale: 1.2, r: 0 }, t * 0.5, animate.easeInOut)
      .then({ scale: 1.1 }, t * 0.5, animate.easeInOut);
  }

  hideCardDetails() {
    sounds.playSound('swoosh1', 0.1);

    const screen = getScreenDimensions();

    const t = animDuration;

    const { card, x, y, scale, r } = this.selectedCardData;

    animate(card.getView())
      .clear()
      .wait(t * 0.25)
      .then({ scale: scale * 1.5, r: r / 2 }, t * 0.25, animate.easeOut)
      .then(() => card.setProps({ mode: 'mini', side: 'front' }))
      .then({ x, y, scale, r }, t * 0.75, animate.easeInOut);

    animate(this.buttonUse)
      .wait(0)
      .then({ y: screen.height + 20 }, t * 1, animate.easeInOut);

    animate(this.bg)
      .wait(t * 0.5)
      .then({ opacity: 0 }, t, animate.easeOut)
      .then(() => {
        this.props.superview.updateOpts({ zIndex: 1 });
        card.getView().updateOpts({ zIndex: 1 });
        this.bg.hide();
      });
  }
}
