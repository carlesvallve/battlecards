import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import ruleset from 'src/redux/ruleset';
import { CardID } from 'src/redux/ruleset/cards';
import { animDuration } from 'src/lib/uiConfig';
import { CardType } from 'src/types/custom';
import { waitForIt } from 'src/lib/utils';
import sounds from 'src/lib/sounds';

export type CardMode = 'mini' | 'full'; //  | 'modifier';
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
  private backImage: View;
  private image: ImageView;
  private labelModifier: ImageView;
  private button: ButtonView;
  private infoDetails: View;
  private infoHand: View;
  private infoModifier: View;
  private labelModifierResult: LangBitmapFontTextView;

  constructor(props: Props) {
    this.props.id = props.id;

    this.createViews(props);
    this.setProps(props);
  }

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

  setProps(props: Props) {
    if (props === this.props) return;
    this.update(props);

    if (props.id) this.props.id = props.id;
    if (props.side) this.props.side = props.side;
    if (props.mode) this.props.mode = props.mode;
  }

  private update(props: Props) {
    const { mode, side } = props;

    // this.getView().updateOpts({
    //   zIndex: mode === 'full' ? 9 : 0,
    // });

    this.backImage.updateOpts({
      visible: side === 'back', //  || mode === 'modifier',
    });

    this.infoHand.updateOpts({
      visible: mode === 'mini' && side === 'front',
    });

    this.infoDetails.updateOpts({
      visible: mode === 'full' && side === 'front',
    });

    // this.infoModifier.updateOpts({
    //   visible: mode === 'modifier' && side === 'front',
    // });

    this.image.updateOpts({
      visible: side === 'front',
    });

    // if (mode === 'modifier') {
    //   console.log('Displaying modifier result !!!!!');
    // }

    // this.props.mode = props.mode;
    // this.props.side = props.side;
  }

  private createSelectors() {}

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

    const imageMask = new View({
      superview: this.container,
      backgroundColor: '#000',
      x: 10,
      y: 10,
      width: 222,
      height: 222,
      clip: true,
    });

    const image = ruleset.cards[props.id].image;
    this.image = new ImageView({
      superview: imageMask,
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
    if (this.getType() === 'modifier') {
      this.labelModifier = new LangBitmapFontTextView({
        superview: imageMask,
        backgroundColor: '#fff',
        font: bitmapFonts('Title'),
        size: 90,
        color: 'black',
        align: 'center',
        verticalAlign: 'center',
        centerOnOrigin: true,
        centerAnchor: true,
        x: imageMask.style.width / 2,
        y: imageMask.style.height / 2,
        width: imageMask.style.width,
        height: imageMask.style.height,
        localeText: () => ruleset.cards[props.id].name,
      });
    }

    const frame = new ImageScaleView({
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

    const bottom = new View({
      superview: this.container,
      backgroundColor: 'white',
      x: 5,
      y: 222,
      width: 230,
      height: 90,
    });

    this.createInfoHand();
    this.createInfoDetails();
    this.createInfoModifier();

    this.button = new ButtonView({
      superview: this.container,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: 120 * 2,
      height: 170 * 2,
      onClick: () => props.onClick && props.onClick(this.props.id),
    });
  }

  createInfoModifier() {
    this.infoModifier = new View({
      superview: this.container,
      backgroundColor: 'red',
      x: 10,
      y: 10,
      width: 120 * 2 - 20,
      height: 170 * 2 - 20,
      visible: false,
    });

    this.labelModifierResult = new LangBitmapFontTextView({
      superview: this.infoModifier,
      backgroundColor: '#fff',
      font: bitmapFonts('Title'),
      size: 90,
      color: 'black',
      align: 'center',
      verticalAlign: 'center',
      centerOnOrigin: true,
      centerAnchor: true,
      x: this.infoModifier.style.width / 2,
      y: this.infoModifier.style.height / 2,
      width: this.infoModifier.style.width,
      height: this.infoModifier.style.height,
      localeText: () => '?',
    });
  }

  createInfoDetails() {
    this.infoDetails = new View({
      superview: this.container,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      x: 18,
      y: 222 + 5,
      width: 120 * 2 - 36,
      height: 90,
    });

    this.createInfoParagraph(
      3,
      () => 'PROS',
      () => 'Lorem ipsum dolor estavitas dolor versus ipsum dolor est.',
    );
    this.createInfoParagraph(
      53,
      () => 'CONS',
      () => 'Lorem ipsum dolor estavitas dolor versus ipsum dolor est.',
    );
  }

  createInfoParagraph(y: number, name: () => string, desc: () => string) {
    const nameLabel = new LangBitmapFontTextView({
      superview: this.infoDetails,
      font: bitmapFonts('TitleStroke'),
      size: 13,
      color: 'cyan',
      align: 'left',
      verticalAlign: 'top',
      x: 0,
      y,
      width: this.infoHand.style.width - 0,
      height: this.infoHand.style.height - 10,
      localeText: name,
    });

    const descLabel = new LangBitmapFontTextView({
      superview: this.infoDetails,
      font: bitmapFonts('Title'),
      size: 11,
      color: 'black',
      align: 'left',
      wordWrap: true,
      verticalAlign: 'top',
      x: 0,
      y: y + 20,
      width: this.infoHand.style.width - 0,
      height: this.infoHand.style.height - 10,
      localeText: desc,
    });
  }

  createInfoHand() {
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

  spawn(
    from: { x: number; y: number; scale: number },
    to: { x: number; y: number; scale: number },
    delay: number,
    cb?: () => void,
  ) {
    this.getView().updateOpts({
      x: from.x,
      y: from.y,
    });

    const t = animDuration;
    animate(this.getView())
      .clear()
      .wait(delay)
      .then({ x: to.x, y: to.y, scale: to.scale }, t, animate.easeInOut)
      .then(() => cb && cb());
  }

  flip() {
    const t = animDuration * 0.5;
    animate(this.getView())
      .clear()
      .then({ scaleX: 0 }, t, animate.easeInOut)
      .then(() => {
        this.setProps({ mode: this.props.mode, side: this.toggleSide() });
      })
      .then({ scaleX: 1 }, t, animate.easeInOut);
  }

  private toggleSide() {
    return this.props.side === 'front' ? 'back' : 'front';
  }

  transform(opts: {
    mode: CardMode;
    x: number;
    y: number;
    scale: number;
    cb?: () => void;
  }) {
    const { mode, x, y, scale, cb } = opts;

    this.update({ mode, side: 'front' });

    const t = animDuration;
    animate(this.getView())
      .clear()
      .wait(0)
      .then({ x, y, scale: scale * 1.1 }, t, animate.easeInOut)
      .then({ x, y, scale }, t, animate.easeOutBounce)
      .then(() => cb && cb());
  }

  displayModifierResult(result: number, cb: () => void) {
    this.infoModifier.show();
    this.labelModifierResult.localeText = () => '?';

    animate(this.infoModifier)
      .wait(500)
      .then(() => {
        sounds.playSound('click1', 0.2);
        this.labelModifierResult.localeText = () => result.toString();
      })
      .wait(350)
      .then(() => cb && cb()) // apply modifier effect
      .wait(350)
      .then(() => this.infoModifier.hide());
  }
}
