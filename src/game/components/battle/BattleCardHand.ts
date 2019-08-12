import animate from 'animate';
import View from 'ui/View';
import { getScreenDimensions } from 'src/lib/utils';
import Card from '../cards/Card';
import uiConfig, { animDuration } from 'src/lib/uiConfig';
import ButtonView from 'ui/widget/ButtonView';
import sounds from 'src/lib/sounds';
import { getRandomCardID } from 'src/redux/shortcuts/cards';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import bitmapFonts from 'src/lib/bitmapFonts';

type Props = { superview: View; zIndex: number };

const maxCards = 5;

export default class BattleCardHand {
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
    this.createCards(props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
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

    // this.buttons = new View({
    //   superview: this.container,
    //   x: 0,
    //   y: screen.height + 10,
    //   infinite: true,
    //   canHandleEvents: false,
    // });

    // const buttonCancel = new ButtonScaleViewWithText({
    //   ...uiConfig.buttonClose,
    //   superview: this.buttons,
    //   width: 70,
    //   height: 80,
    //   x: 10, // screen.width * 0.,
    //   y: 0,
    //   // labelOffsetY: -3,
    //   // localeText: () => 'CANCEL',
    //   // size: 16,
    //   // font: bitmapFonts('TitleStroke'),
    //   onClick: () => {
    //     sounds.playSound('click-3', 1);
    //     this.hideCardDetails();
    //   },
    // });

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
        sounds.playSound('click-3', 1);
        this.hideCardDetails();
      },
    });
  }

  createCards(props: Props) {
    const screen = getScreenDimensions();

    const rotations = [-0.25, -0.125, 0, 0.125, 0.25];
    const ys = [0, -12, -15, -12, 0];

    // this.cardBox = new View({
    //   superview: this.container,
    //   // backgroundColor: 'rgba(255, 255, 0, 0.5)',
    //   width: screen.width,
    //   height: screen.height,
    //   y: 40,
    //   opacity: 0,
    //   visible: false,
    //   infinite: true,
    //   canHandleEvents: false,
    // });

    this.cards = [];
    for (let i = 0; i < maxCards; i++) {
      const id = getRandomCardID();
      console.log('>>> id:', id);

      const card = new Card({
        superview: this.container,
        id,
        side: 'front',
        mode: 'mini',
        // x: 35 + i * 62,
        x: 40 + i * 60,
        y: screen.height - 120 + ys[i] + 40,
        scale: 0.2,
        r: rotations[i],
        onClick: () => this.showCardDetails(card),
      });
      this.cards.push(card);
    }
  }

  showHand() {
    if (this.active) return;
    this.active = true;

    // const screen = getScreenDimensions();
    // const ys = [0, -12, -15, -12, 0];

    sounds.playSound('swoosh4', 0.1);

    this.cards.forEach((card, index) => {
      card.getView().show();
      animate(card.getView()).then(
        { y: card.getView().style.y - 40, opacity: 1 },
        animDuration,
        animate.easeInOut,
      );
    });
  }

  hideHand() {
    if (!this.active) return;
    this.active = false;

    sounds.playSound('swoosh4', 0.1);

    this.cards.forEach((card, index) => {
      animate(card.getView())
        .then(
          { y: card.getView().style.y + 40, opacity: 0 },
          animDuration,
          animate.easeInOut,
        )
        .then(() => card.getView().hide());
    });
  }

  showCardDetails(card: Card) {
    if (card.getMode() === 'full') return;

    this.container.updateOpts({ zIndex: 3 });
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
      .wait(t * 1)
      .then({ y: screen.height - 120 }, t, animate.easeInOut);

    card.setProps({ mode: 'full', side: 'front' });

    const { x, y, scale, r } = card.getView().style;
    this.selectedCardData = { card, x, y, scale, r };

    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        { x: screen.width / 2, y: screen.height * 0.425, scale: 0.5, r: r / 2 },
        t * 1,
        animate.easeInOut,
      )
      .then({ scale: 1.2, r: 0 }, t * 0.5, animate.easeInOut)
      .then({ scale: 1.1 }, t * 0.5, animate.easeInOut);
  }

  hideCardDetails() {
    const screen = getScreenDimensions();

    const t = animDuration;

    const { card, x, y, scale, r } = this.selectedCardData;
    card.setProps({ mode: 'mini', side: 'front' });
    animate(card.getView())
      .clear()
      .wait(t * 0.5)
      .then({ scale: scale * 1.5, r: r / 2 }, t * 0.5, animate.easeOut)
      .then({ x, y, scale, r }, t, animate.easeInOut);

    animate(this.buttonUse)
      .wait(0)
      .then({ y: screen.height + 20 }, t * 1, animate.easeInOut);

    animate(this.bg)
      .wait(t * 0.5)
      .then({ opacity: 0 }, t, animate.easeOut)
      .then(() => {
        this.container.updateOpts({ zIndex: 1 });
        card.getView().updateOpts({ zIndex: 1 });
        this.bg.hide();
      });
  }
}
