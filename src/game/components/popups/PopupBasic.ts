import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import Image from 'ui/resource/Image';
import bitmapFonts from 'src/lib/bitmapFonts';
import uiConfig from 'src/lib/uiConfig';
import i18n from 'src/lib/i18n/i18n';
import { togglePopup } from 'src/redux/state/reducers/ui';
import StateObserver from 'src/redux/StateObserver';

export default class PopupBasic extends View {
  id: string;
  enabled: boolean;
  closeableWithBg: boolean;
  bg: View;
  box: View;
  buttonClose: View;

  constructor(opts) {
    super(opts);

    this.id = opts.id;
    this.enabled = false;
    this.closeableWithBg = true;

    this.updateOpts({
      zIndex: 9998,
      x: 0,
      y: 0,
      width: opts.superview.style.width,
      height: opts.superview.style.height,
      visible: false,
      opacity: 0,
    });

    this.bg = new ButtonView({
      superview: this,
      backgroundColor: 'rgba(0,0,0,0.6)',
      x: 0,
      y: 0,
      width: opts.superview.style.width,
      height: opts.superview.style.height,
      onClick: () => {
        if (this.closeableWithBg) {
          this.close();
        }
      },
    });

    this.box = new View({
      superview: this,
      backgroundColor: 'black',
      width: 480,
      height: 640,
      x: this.style.width * 0.5,
      y: this.style.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 0,
    });

    this.box = new ButtonView({
      superview: this,
      backgroundColor: 'black',
      width: 480,
      height: 640,
      x: this.style.width * 0.5,
      y: this.style.height * 0.5,
      scale: 0,
      centerOnOrigin: true,
      centerAnchor: true,
      image: 'resources/images/ui/buttons/map-frame_dialog.png',
      imagePressed: 'resources/images/ui/buttons/map-frame_dialog.png',
      pressedOffsetY: 2,
      scaleMethod: '9slice',
      sourceSlices: {
        horizontal: { left: 18, right: 18 },
        vertical: { top: 18, bottom: 18 },
      },
      onClick: () => {},
      onUp: () => {},
      onDown: () => {},
    });

    this.buttonClose = new ButtonView(
      Object.assign({}, uiConfig.buttonRed, {
        superview: this.box,
        labelOffsetY: -1,
        text: i18n('popup.close'),
        fontSize: 40,
        font: bitmapFonts('Title'),
        x: this.box.style.width / 2,
        y: this.box.style.height - 20,
        width: 200,
        height: 78,
        centerOnOrigin: true,
        onClick: () => {
          this.close();
        },
      }),
    );

    StateObserver.createSelector((state) => state.ui.togglePopup).addListener(
      ({ id, enabled }) => {
        if (id !== this.id) return;
        if (enabled) {
          this.init(opts);
          this.enabled = true;
        } else {
          this.fadeOut();
          this.enabled = false;
        }
      },
    );

    // Listen to togglePopup action
    // StateObserver.addListener(({ ui }) => {
    //   if (ui.togglePopup.id === this.id) {
    //     // console.log('ui.togglePopup.id', ui.togglePopup.id);
    //     const opts = ui.togglePopup.opts || {};
    //     if (ui.togglePopup.enabled && !this.enabled) {
    //       this.init(opts);
    //       this.enabled = true;
    //       // console.log('opened popup', this.id);
    //     } else if (!ui.togglePopup.enabled && this.enabled) {
    //       this.fadeOut();
    //       this.enabled = false;
    //       // console.log('closed popup', this.id);
    //     }
    //     // console.log('>>>', ui.togglePopup);
    //   }
    // });
  }

  init(opts) {
    this.fadeIn();
  }

  close() {
    // dispatch close popup action
    StateObserver.dispatch(
      togglePopup({ id: this.id, enabled: false, opts: {} }),
    );
  }

  fadeIn() {
    const animDuration = 300;
    this.show();
    animate(this)
      .clear()
      .then({ opacity: 1 }, animDuration, animate.easeOut);

    animate(this.box)
      .clear()
      .wait(animDuration)
      .then({ scale: 1 }, animDuration, animate.easeOut);
  }

  fadeOut() {
    const animDuration = 300;
    animate(this)
      .clear()
      .wait(animDuration)
      .then({ opacity: 0 }, animDuration, animate.easeOut)
      .then(() => {
        this.hide();
        this.cb && this.cb();
      });

    animate(this.box)
      .clear()
      .wait(0)
      .then({ scale: 0 }, animDuration, animate.easeOut);
  }
}
