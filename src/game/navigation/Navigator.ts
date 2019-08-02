import platform from 'platform';
import animate from 'animate';
import device from 'device';
import StackView from 'ui/StackView';
import View from 'ui/View';
import { setNavState } from 'src/redux/state/reducers/ui';
import { getScreenDimensions } from 'src/lib/utils';

import TitleScreen from 'src/game/screens/TitleScreen';
import GameScreen from 'src/game/screens/GameScreen';

import PopupPause from 'src/game/components/popups/PopupPause';
import StateObserver from 'src/redux/StateObserver';
import { SceneID, PopupID } from 'src/types/customTypes';

export default class Navigator {
  private rootView: StackView;
  public scenes: { [K in SceneID]: View };
  public popups: { [K in PopupID]: View };

  constructor(opts: { superview: View }) {
    const screen = getScreenDimensions();

    this.rootView = new StackView({
      superview: opts.superview,
      backgroundColor: '#010101',
      x: 0,
      y: 0,
      width: screen.width,
      height: screen.height,
      clip: false,
      scale: device.width / 320,
    });

    this.scenes = {
      title: new TitleScreen(),
      game: new GameScreen(),
    };

    this.popups = {
      popupPause: new PopupPause({
        superview: this.rootView,
        id: 'popupPause',
      }),
    };

    // this.popups = {
    //   pause: new PopupPause({
    //     id: 'popupPause',
    //     superview: this.rootView,
    //   }),
    // };

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
      setNavState('left');
      this.rootView.pop(true);
      this.rootView.push(scene, true);
      setNavState('entering');
    };

    const duration = 300;

    if (!fromScene) {
      changeScene();
      this.fadeIn(scene, duration);
      return;
    }

    setNavState('leaving');
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
