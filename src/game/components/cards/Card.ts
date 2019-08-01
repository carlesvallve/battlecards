import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
// import CardBadge from './CardBadge';
import CardStars from './CardStars';
import i18n from 'src/lib/i18n/i18n';
import StateObserver from 'src/redux/StateObserver';
import ruleset from 'src/ruleset';
import { CardID } from 'src/ruleset/cards';
import { format } from 'url';
import { animDuration } from 'src/lib/uiConfig';
// import { CardSetID } from 'src/replicant/ruleset/cardSets';
// import {
//   getCardInstancesOwned,
//   isCardLocked,
// } from 'src/replicant/getters/cards';

type Opts = {
  superview: View;
  id: CardID;
  side?: 'front' | 'back';
  x?: number;
  y?: number;
  scale?: number;
  onClick?: (id: CardID) => void;
};

export type Props = {
  id: CardID;
  side: 'front' | 'back';
  fakeRarity?: number;
};

export default class Card {
  private props: Props = { id: null, side: 'back' };
  private container: View;
  private imageMask: View;
  private pic: ImageView;
  private ribbon: ImageScaleView;
  private title: BitmapFontTextView;
  // private badge: CardBadge;
  private stars: CardStars;
  private lock: BitmapFontTextView;
  private button: ButtonView;

  constructor(opts: Opts) {
    this.props.id = opts.id;
    this.props.side = opts.side || 'back';

    this.createViews(opts);
    this.createSelectors();
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

  getSide(): 'front' | 'back' {
    return this.props.side;
  }

  setProps(props: Props) {
    this.update(props);
    this.props = props;
  }

  private update(props: Props) {
    if (props !== this.props) {
      // const owned = getCardInstancesOwned(
      //   StateObserver.getState().user,
      //   props.id,
      // );

      // title
      this.title.localeText = () => i18n(`cardNames.${props.id}`);

      // ribbon
      this.ribbon.updateOpts({
        visible: props.side === 'front',
        image: 'resources/images/ui/cards/card_title_bg.png',
      });

      // image
      const image = ruleset.cards[props.id].image;
      this.pic.updateOpts({
        image:
          props.side === 'front'
            ? `resources/images/ui/cards/sets/${image}`
            : 'resources/images/ui/cards/card_blank.png',
      });

      this.pic.updateOpts({
        x: this.imageMask.style.width * 0.5 - 0,
        y: this.imageMask.style.height * 0.5 - 4,
        centerOnOrigin: true,
        centerAnchor: true,
      });

      // badge
      // this.badge.setProps({
      //   visible: props.side === 'front' && owned > 0,
      //   owned,
      // });

      // stars
      this.stars.setProps({
        level: ruleset.cards[props.id].rarity,
        visible: props.side === 'front',
        active: true, // owned > 0,
        scale: 1,
      });

      // lock
      const unlockLevel = ruleset.cards[props.id].unlockLevel;
      // const isLocked = isCardLocked(StateObserver.getState().user, props.id);
      // this.lock.updateOpts({ visible: isLocked && !owned });
      // this.lock.localeText = () => i18n('cards.unlock', { value: unlockLevel });
      // this.button.canHandleEvents(!isLocked, false);

      // fake rarity for icon cards
      // if (props.fakeRarity) {
      //   this.stars.setProps({
      //     level: props.fakeRarity,
      //     visible: true,
      //     active: true,
      //     scale: 2,
      //   });
      // }
    }
  }

  private createSelectors() {}

  private createViews({ superview, id, x, y, scale, onClick }: Opts) {
    // 120 x 170

    this.container = new View({
      superview,
      x: x,
      y: y,
      width: 120 * 2,
      height: 170 * 2,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: scale || 1,
    });

    // image-bg
    const imageBg = new View({
      superview: this.container,
      backgroundColor: '#333',
      x: 5 * 2,
      y: 8,
      width: 111 * 2,
      height: 136 * 2,
    });

    // image-mask
    this.imageMask = new View({
      superview: this.container,
      backgroundColor: '#333',
      x: 5 * 2,
      y: 8,
      width: 111 * 2,
      height: 136 * 2,
      clip: true,
    });

    this.pic = new ImageScaleView({
      superview: this.imageMask,
      x: this.imageMask.style.width * 0.5 - 0,
      y: this.imageMask.style.height * 0.5 - 4,
      autoSize: true,
    });
    this.pic.updateOpts({ centerOnOrigin: true, centerAnchor: true });

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

    this.ribbon = new ImageScaleView({
      superview: this.container,
      visible: this.props.side === 'front',
      x: this.container.style.width / 2,
      y: this.container.style.height - 26 * 2,
      width: this.container.style.width * 1.075,
      height: this.container.style.width * 0.2,
      image: 'resources/images/ui/cards/card_title_bg.png',
      centerOnOrigin: true,
      centerAnchor: true,
      scaleMethod: '9slice',
      sourceSlices: {
        horizontal: { left: 60, right: 60 },
        vertical: { top: 25, bottom: 25 },
      },
    });

    this.title = new BitmapFontTextView({
      superview: this.ribbon,
      // backgroundColor: 'rgba(255,0,0,0.5)',
      y: 5 * 2,
      x: 17,
      width: this.container.style.width - 20,
      localeText: () => i18n(`cardNames.${id}`),
      size: 12 * 2,
      font: bitmapFonts('TitleStroke'),
      align: 'center',
      verticalAlign: 'center',
    });

    // this.badge = new CardBadge({
    //   superview: this.container,
    //   visible: true,
    //   x: this.container.style.width - 14 * 2,
    //   y: this.container.style.height - 52 * 2,
    // });

    this.stars = new CardStars({
      superview: this.container,
      visible: this.props.side === 'front',
      level: ruleset.cards[this.props.id].rarity,
    });

    // locked
    // this.lock = new BitmapFontTextView({
    //   superview: this.container,
    //   backgroundColor: 'rgba(255, 0, 0 ,0.5)',
    //   centerOnOrigin: true,
    //   x: this.container.style.width * 0.5,
    //   y: this.container.style.height * 0.45,
    //   width: this.container.style.width - 20,
    //   size: 12 * 2,
    //   font: bitmapFonts('TitleStroke'),
    //   align: 'center',
    //   verticalAlign: 'center',
    //   wordWrap: true,
    // });

    // const lockIcon = new ImageView({
    //   superview: this.lock,
    //   image: 'resources/images/ui/cards/icon_lock.png',
    //   centerOnOrigin: true,
    //   x: this.lock.style.width * 0.5,
    //   y: -25 * 2,
    //   width: 22 * 2,
    //   height: 28 * 2,
    // });

    this.button = new ButtonView({
      superview: this.container,
      width: 120 * 2,
      height: 170 * 2,
      onClick: () => onClick && onClick(this.props.id),
    });
  }

  private spawnCard(
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

  private flipCard() {
    const t = animDuration * 0.5;
    animate(this.getView())
      .clear()
      .then({ scaleX: 0 }, t, animate.easeInOut)
      .then(() => {
        this.setProps({ id: this.props.id, side: this.toggleSide() });
      })
      .then({ scaleX: 1 }, t, animate.easeInOut);
  }

  private toggleSide() {
    return this.props.side === 'front' ? 'back' : 'front';
  }
}
