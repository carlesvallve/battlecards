import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';
import { screen } from 'src/lib/customTypes';
import { getScreenDimensions } from 'src/lib/utils';
import StateObserver from 'src/redux/StateObserver';
import { PopupID } from 'src/redux/state/reducers/ui';
import { closePopup } from 'src/redux/shortcuts';
import { animDuration } from 'src/lib/uiConfig';

export default class PopupBasic extends View {
  screen: screen;
  id: PopupID;
  closeableWithBg: boolean;
  bg: View;
  box: View;
  baseY: number;

  constructor(opts) {
    super(opts);
    this.canHandleEvents(false, false);
    this.screen = getScreenDimensions();

    this.id = opts.id;
    this.closeableWithBg = true;

    const { width, height } = opts.superview.style;

    this.updateOpts({
      zIndex: 9998,
      width,
      height,
      visible: false,
      opacity: 0,
    });

    this.bg = new ButtonView({
      superview: this,
      backgroundColor: 'rgba(0,0,0,0.6)',
      width,
      height,
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
      scale: 1,
    });

    StateObserver.createSelector((state) => state.ui.togglePopup).addListener(
      ({ id, enabled }) => {
        if (id !== this.id) return;
        if (enabled) {
          this.init(opts);
        } else {
          this.fadeOut();
        }
      },
    );
  }

  init(opts?: any) {
    this.bg.canHandleEvents(true, false);
    this.fadeIn();
  }

  close() {
    this.bg.canHandleEvents(false, false);
    closePopup(this.id);
  }

  fadeIn() {
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
