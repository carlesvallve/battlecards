import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import ruleset from 'src/redux/ruleset';
import { CardID } from 'src/redux/ruleset/cards';
import { animDuration } from 'src/lib/uiConfig';
import { CardType, CardPlayType } from 'src/types/custom';
import { getScreenDimensions } from 'src/lib/utils';

export type CardMode = 'mini' | 'full';
export type CardSide = 'front' | 'back';

export type Props = {
  superview?: View;
  x?: number;
  y?: number;
  scale?: number;
  r?: number;
  onClick?: (id: CardID) => void;

  id?: CardID;
  mode?: CardMode;
  side?: CardSide;
};

export default class Card {
  private props: Props = {
    superview: null,
    id: null,
    side: 'back',
    mode: 'mini',
  };
  private container: View;
  private frame: ImageScaleView;
  private backImage: View;
  private imageMask: View;
  private image: ImageView;
  private infoHand: View;
  private infoDetails: View;
  private infoModifier: View;
  private labelModifierResult: LangBitmapFontTextView;

  constructor(props: Props) {
    this.props.id = props.id;

    this.createViews(props);
    this.setProps(props);
  }

  // ===============================================================

  destroy() {
    // note: don't forget to remove listeners if any by doing:
    // -> selector.removeListener(x)
    this.container.removeFromSuperview();
  }

  getView() {
    return this.container;
  }

  getID(): CardID {
    return this.props.id;
  }

  getSide(): CardSide {
    return this.props.side;
  }

  getMode(): CardMode {
    return this.props.mode;
  }

  getType(): CardType {
    return ruleset.cards[this.props.id].type;
  }

  getPlayType(): CardPlayType {
    return ruleset.cards[this.props.id].playType;
  }

  setProps(props: Props) {
    if (props === this.props) return;
    this.update(props);

    if (props.id) this.props.id = props.id;
    if (props.side) this.props.side = props.side;
    if (props.mode) this.props.mode = props.mode;
  }

  private update(props: Props) {
    const { mode, side } = props;

    this.frame.updateOpts({
      visible: true,
      opacity: 1,
    });

    this.backImage.updateOpts({
      visible: side === 'back', //  || mode === 'modifier',
    });

    this.infoHand.updateOpts({
      visible: mode === 'mini' && side === 'front',
    });

    this.infoDetails.updateOpts({
      visible: mode === 'full' && side === 'front',
    });

    this.image.updateOpts({
      visible: side === 'front',
    });
  }

  // ===============================================================

  private createViews(props: Props) {
    // 120 x 170

    this.container = new View({
      superview: props.superview,
      x: props.x,
      y: props.y,
      width: 120 * 2,
      height: 170 * 2,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: props.scale || 1,
      opacity: 0,
      visible: false,
      r: props.r,
    });

    this.imageMask = new View({
      superview: this.container,
      backgroundColor: '#000',
      x: this.container.style.width / 2,
      y: this.container.style.width / 2,
      width: 222,
      height: 222,
      clip: true,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    const image = ruleset.cards[props.id].image;
    this.image = new ImageView({
      superview: this.imageMask,
      x: 111,
      y: 111,
      width: 222,
      height: 222,
      centerOnOrigin: true,
      centerAnchor: true,
      image:
        props.side === 'front'
          ? image
          : 'resources/images/ui/cards/card_blank.png',
    });

    // modifier text
    if (this.getPlayType() === 'modifier') {
      const labelModifier = new LangBitmapFontTextView({
        superview: this.imageMask,
        // backgroundColor: '#fff',
        font: bitmapFonts('TitleStroke'),
        size: 85,
        color: 'white',
        align: 'center',
        verticalAlign: 'center',
        centerOnOrigin: true,
        centerAnchor: true,
        x: this.imageMask.style.width / 2,
        y: this.imageMask.style.height / 2,
        width: this.imageMask.style.width - 10,
        height: this.imageMask.style.height,
        localeText: () => ruleset.cards[props.id].name,
      });
    }

    this.frame = new ImageScaleView({
      superview: this.container,
      width: this.container.style.width,
      height: this.container.style.height,
      image: 'resources/images/ui/cards/card_frame.png',
      scaleMethod: '9slice',
      sourceSlices: {
        horizontal: { left: 14 * 2, right: 14 * 2 },
        vertical: { top: 16 * 2, bottom: 33 * 2 },
      },
    });

    this.backImage = new View({
      superview: this.container,
      backgroundColor: 'white',
      x: 10,
      y: 10,
      width: 120 * 2 - 20,
      height: 170 * 2 - 20,
    });

    this.createInfoHand();
    this.createInfoDetails();
    this.createInfoModifier();

    const button = new ButtonView({
      superview: this.container,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: 120 * 2,
      height: 170 * 2,
      onClick: () => props.onClick && props.onClick(this.props.id),
    });
  }

  // ===============================================================

  private createInfoModifier() {
    this.infoModifier = new View({
      superview: this.container,
      backgroundColor: 'white',
      x: 10,
      y: 10,
      width: 120 * 2 - 20,
      height: 170 * 2 - 20,
      visible: false,
    });

    this.labelModifierResult = new LangBitmapFontTextView({
      superview: this.infoModifier,
      // backgroundColor: '#fff',
      font: bitmapFonts('TitleStroke'),
      size: 90,
      color: 'white',
      align: 'center',
      verticalAlign: 'center',
      centerOnOrigin: true,
      centerAnchor: true,
      x: this.infoModifier.style.width / 2,
      y: this.infoModifier.style.height / 2,
      width: this.infoModifier.style.width - 10,
      height: this.infoModifier.style.height,
      localeText: () => '?',
    });
  }

  private createInfoDetails() {
    this.infoDetails = new View({
      superview: this.container,
      backgroundColor: 'white', // 'rgba(255, 0, 0, 0.5)',
      x: 5,
      y: 222,
      width: 120 * 2 - 10,
      height: 90,
    });

    this.createInfoParagraph(
      3,
      () => ruleset.cards[this.getID()].name, // 'PROS',
      () => ruleset.cards[this.getID()].desc, // 'Lorem ipsum dolor estavitas dolor versus ipsum dolor est.',
    );
    // this.createInfoParagraph(
    //   53,
    //   () => 'CONS',
    //   () => 'Lorem ipsum dolor estavitas dolor versus ipsum dolor est.',
    // );
  }

  private createInfoParagraph(
    y: number,
    name: () => string,
    desc: () => string,
  ) {
    const nameLabel = new LangBitmapFontTextView({
      superview: this.infoDetails,
      // backgroundColor: 'cyan',
      font: bitmapFonts('Title'),
      size: 24,
      color: 'black',
      align: 'center',
      verticalAlign: 'top',
      x: 15,
      y: y + 12,
      width: this.infoHand.style.width - 32,
      height: this.infoHand.style.height - 10,
      localeText: name,
    });

    const descLabel = new LangBitmapFontTextView({
      superview: this.infoDetails,
      // backgroundColor: 'pink',
      font: bitmapFonts('Title'),
      size: 16,
      color: 'black',
      align: 'center',
      wordWrap: true,
      verticalAlign: 'top',
      x: 15,
      y: y + 50,
      width: this.infoHand.style.width - 32,
      height: this.infoHand.style.height - 40,
      localeText: desc,
    });
  }

  private createInfoHand() {
    this.infoHand = new View({
      superview: this.container,
      backgroundColor: 'white', //'rgba(255, 0, 0, 0.5)',
      x: 5,
      y: 222 + 5,
      width: 120 * 2 - 10,
      height: 170 * 2 - 250,
    });

    const label = new LangBitmapFontTextView({
      superview: this.infoHand,
      font: bitmapFonts('Title'),
      size: 60,
      color: 'black',
      align: 'right',
      verticalAlign: 'center',
      x: 0,
      y: 5,
      width: this.infoHand.style.width - 30,
      height: this.infoHand.style.height - 10,
      localeText: () => ruleset.cards[this.props.id].ep,
    });

    const icon = new ImageView({
      superview: this.infoHand,
      x: 52,
      y: 52,
      width: 64,
      height: 64,
      centerOnOrigin: true,
      centerAnchor: true,
      image: 'resources/images/ui/icons/diamond2.png',
    });
  }

  // ==========================================================
  // Display modes

  displayAsConsumed() {
    const t = animDuration;

    // transition the card to final goal position
    animate(this.container)
      .clear()
      // .then({ scaleY: 1 }, t, animate.easeInOut)
      .then(() => sounds.playSound('swoosh3', 0.1))
      .then({ scale: 0, scaleY: 0.75 }, t, animate.easeInOut);
  }

  displayModifierResult(result: number, cb: () => void) {
    this.infoModifier.show();
    this.labelModifierResult.localeText = () => '?';

    animate(this.container)
      .then({ scale: 0.45, scaleY: 0.8 }, animDuration, animate.easeInOut)
      .then(() => {
        sounds.playSound('blip2', 0.5);
        this.labelModifierResult.localeText = () => result.toString();
      })
      .then({ scale: 0.55, scaleY: 0.9 }, animDuration, animate.easeInOut)
      .then({ scale: 0.45, scaleY: 0.8 }, animDuration * 0.5, animate.easeInOut)
      .then({ scaleY: 1 }, animDuration, animate.easeInOut)
      .then(() => {
        cb && cb(); // apply modifier effect
      })
      .then(() => this.infoModifier.hide());
  }

  displayAsStatus(cb: () => void) {
    const screen = getScreenDimensions();

    this.infoModifier.hide();
    this.infoDetails.hide();

    const x = screen.width - 32;
    const y = screen.height * ruleset.baselineY + 35;
    const h = this.container.style.width + 5;

    //container
    animate(this.container)
      .clear()
      .then({ scale: 0.15, scaleY: 0.8, x, y }, animDuration, animate.easeInOut)
      .then({ scale: 0.2, scaleY: 1.1 }, animDuration, animate.easeInOut)
      .then({ scale: 0.175, scaleY: 1 }, animDuration, animate.easeInOut)
      .then(() => {
        cb && cb(); // set the card as an active status
      });

    // frame
    animate(this.frame).then(
      { height: h },
      animDuration * 0.5,
      animate.easeInOut,
    );

    // imageMask
    animate(this.imageMask).then(
      { scale: 0.95, zIndex: 2 },
      animDuration * 0.5,
      animate.easeInOut,
    );
  }

  displayAsInstant(x: number, y: number, cb: () => void) {
    const t = animDuration;

    // transition the card to final goal position
    animate(this.container)
      .clear()
      .then({ scale: 0.15, scaleY: 0.8, x, y }, animDuration, animate.easeInOut)
      .then({ scale: 0.2, scaleY: 1.1 }, animDuration, animate.easeInOut)
      .then({ scale: 0.175, scaleY: 1 }, animDuration, animate.easeInOut)
      .then(() => {
        cb && cb(); // set the card as an active status
      });
  }

  // ===============================================================
}
