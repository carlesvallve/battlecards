import platform from 'platform';
import animate from 'animate';
import device from 'device';
import StackView from 'ui/StackView';
import View from 'ui/View';

import { getScreenDimensions } from 'src/lib/utils';

import SceneTitle from 'src/game/screens/SceneTitle';
import SceneGame from 'src/game/screens/SceneGame';

import PopupPause from 'src/game/components/popups/PopupPause';
import StateObserver from 'src/redux/StateObserver';
import { SceneID, PopupID } from 'src/types/custom';
import { setNavState } from 'src/redux/shortcuts/ui';

export default class Navigator {
  private rootView: StackView;
  public scenes: { [K in SceneID]: View };
  public popups: { [K in PopupID]: View };

  constructor(opts: { superview: View }) {
    const screen = getScreenDimensions();

    this.rootView = new StackView({
      superview: opts.superview,
      backgroundColor: '#000',
      x: 0,
      y: 0,
      width: device.width * 2,
      height: device.height * 2,
      clip: false,
      scale: device.width / 320,
    });

    this.scenes = {
      title: new SceneTitle(),
      game: new SceneGame(),
    };

    this.popups = {
      popupPause: new PopupPause({
        superview: this.rootView,
        id: 'popupPause',
      }),
    };

    // check for scene navigation
    StateObserver.createSelector((state) => state.ui.scene).addListener(
      (scene) => {
        console.log('scene:', scene);
        this.gotoScene(scene);
      },
    );
  }

  gotoScene(name: SceneID) {
    const scene = this.scenes[name].getView();
    const fromScene = this.rootView.stack[this.rootView.stack.length - 1];
    // console.log(fromScene, '->', scene);

    const changeScene = () => {
      this.rootView.pop(true);
      this.rootView.push(scene, true);
    };

    const duration = 300;

    if (!fromScene) {
      changeScene();
      this.fadeIn(scene, duration);
      return;
    }

    this.fadeOut(fromScene, duration, () => {
      this.rootView.pop(true);
      this.rootView.push(scene, true);
      this.fadeIn(scene, duration);
    });
  }

  fadeIn(scene: View, duration: number = 500, cb?: () => void) {
    setNavState('entering');
    scene.updateOpts({ opacity: 0, y: 128 });
    scene.show();

    animate(scene)
      .clear()
      .then({ opacity: 1, y: 0 }, duration, animate.easeOut)
      .then(() => {
        setNavState('entered');
        cb && cb();
      });
  }

  fadeOut(scene: View, duration: number = 500, cb?: () => void) {
    setNavState('leaving');
    animate(scene)
      .clear()
      .then({ opacity: 0, y: -64 }, duration, animate.easeOut)
      .then(() => {
        scene.hide();
        setNavState('left');
        cb();
      });
  }
}
