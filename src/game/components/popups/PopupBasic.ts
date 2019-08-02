import animate from 'animate';
import View from 'ui/View';
import ButtonView from 'ui/widget/ButtonView';

import StateObserver from 'src/redux/StateObserver';
import { animDuration } from 'src/lib/uiConfig';
import { PopupID } from 'src/types/custom';
import { closePopup } from 'src/redux/shortcuts/ui';

export default class PopupBasic {
  protected container = new View({ opacity: 0, backgroundColor: 'black' });
  protected id: PopupID;
  protected closeableWithBg: boolean;
  protected bg: View;
  protected box: View;

  constructor(opts: { superview: View, id: PopupID }) {
    this.id = opts.id;
    this.closeableWithBg = true;
    this.container.canHandleEvents(false, false);
  }

  protected createViews(opts) {
    const { width, height } = opts.superview.style;

    this.container.updateOpts({
      zIndex: 9998,
      width,
      height,
      visible: false,
      opacity: 0,
    });

    this.bg = new ButtonView({
      superview: this.container,
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
      superview: this.container,
      backgroundColor: 'black',
      width: 480,
      height: 640,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      centerOnOrigin: true,
      centerAnchor: true,
      scale: 1,
    });
  }

  protected createNavSelector(opts) {
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

  protected init(opts?: any) {
    this.bg.canHandleEvents(true, false);
    this.fadeIn();
  }

  protected close() {
    this.bg.canHandleEvents(false, false);
    closePopup(this.id);
  }

  private fadeIn() {
    this.container.show();
    animate(this)
      .clear()
      .then({ opacity: 1 }, animDuration, animate.easeOut);

    animate(this.box)
      .clear()
      .wait(animDuration)
      .then({ scale: 1 }, animDuration, animate.easeOut);
  }

  private fadeOut() {
    animate(this)
      .clear()
      .wait(animDuration)
      .then({ opacity: 0 }, animDuration, animate.easeOut)
      .then(() => {
        this.container.hide();
        // this.cb && this.cb();
      });

    animate(this.box)
      .clear()
      .wait(0)
      .then({ scale: 0 }, animDuration, animate.easeOut);
  }
}
