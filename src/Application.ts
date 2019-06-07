import startApplication from 'startApplication';
import animate from 'animate';
import platform from 'platform';
import device from 'device';
import View from 'ui/View';
import StackView from 'ui/StackView';
import loadingGroups from 'src/loadingGroups';
import TitleScreen from 'src/game/screens/TitleScreen';
import GameScreen from 'src/game/screens/GameScreen';
import { waitForIt } from 'src/lib/utils';
import StateObserver from './redux/StateObserver';
import { SceneID } from './redux/state/reducers/ui';

export default class Application extends View {
  private rootView: StackView;
  public scenes: { [K in SceneID]: View };

  constructor(opts) {
    super(opts);

    this.loadAssets()
      .then(() => platform.startGameAsync())
      .then(() => platform.sendEntryFinalAnalytics({}, {}, {}))
      .then(() => this.initializeStateObserver())
      .then(() => {
        waitForIt(() => {
          this.startGame();
        }, 300);
      });

    // device.screen.on('Resize', () => this.resize());
  }

  loadAssets() {
    let loadingProgress = 0;

    const setLoadingProgress = (progress) => {
      loadingProgress = progress;
      platform.setLoadingProgress(progress);
    };

    const updateLoadingProgress = () => {
      // Tricking the user by making the loading look fast
      // The progress incrementally increases by 0.5% every tick until next progress level
      // Capping at 99% to make sure we do not display 100% while game not entirely loaded
      // var nextProgress = initialAssets.nextProgress * 100;
      const progressStep = 0.5;
      // console.log('updateLoadingProgress:', loadingProgress + progressStep);
      setLoadingProgress(Math.min(99, loadingProgress + progressStep));
    };

    return new Promise((resolve) => {
      const initialAssets = loadingGroups.initialAssets;

      const progressUpdateHandle = setInterval(() => {
        updateLoadingProgress();
      }, 16);

      // load initial assets
      initialAssets.load(() => {
        setLoadingProgress(100);
        clearInterval(progressUpdateHandle);
        resolve();

        loadingGroups.soundAssets.load(() => {
          console.log('sounds were preloaded!');
        });
      });
    });
  }

  async initializeStateObserver() {
    return StateObserver.init({
      playerId: platform.playerID,
      signature: platform.playerSignature,
      // errorHandler: () => console.error('There was an error'), // this.onReplicantError,
      // networkErrorHandler: () => console.error('There was a network error'), // this.onNetworkError,
    }).catch((e) => console.error(e));
  }

  startGame() {
    this.rootView = new StackView({
      parent: this,
      backgroundColor: '#010101',
      x: 0,
      y: 0,
      width: device.screen.width,
      height: device.screen.height,
      clip: false,
      scale: device.width / 320,
    });

    this.scenes = {
      title: new TitleScreen(),
      game: new GameScreen(),
    };

    // check for scene navigation
    StateObserver.createSelector((state) => state.ui.scene).addListener(
      (scene) => {
        console.log('scene:', scene);
        this.gotoScene(scene);
      },
    );
  }

  // gotoScene(scene: SceneID) {
  //   this.rootView.pop(true);
  //   this.rootView.push(this.scenes[scene], true);
  //   this.scenes[scene].init();
  // }

  gotoScene(name: SceneID, animated: boolean = false) {
    const scene = this.scenes[name];
    const fromScene = this.rootView.stack[this.rootView.stack.length - 1];
    // console.log(fromScene, '->', scene);

    if (!animated) {
      this.rootView.pop(true);
      this.rootView.push(this.scenes[name], true);
      this.scenes[name].init();
      return;
    }

    const duration = 300;

    if (!fromScene) {
      this.rootView.pop(true);
      this.rootView.push(scene, true);
      scene.init();
      this.fadeIn(scene, duration);
      return;
    }

    this.fadeOut(fromScene, duration, () => {
      this.rootView.pop(true);
      this.rootView.push(scene, true);
      scene.init();
      this.fadeIn(scene, duration, () => {});
    });
  }

  fadeIn(scene: View, duration: number = 500, cb?: () => void) {
    scene.updateOpts({ opacity: 0, y: 128 });
    scene.show();

    animate(scene)
      .clear()
      .then({ opacity: 1, y: 0 }, duration, animate.easeOut)
      .then(() => cb && cb());
  }

  fadeOut(scene: View, duration: number = 500, cb?: () => void) {
    animate(scene)
      .clear()
      .then({ opacity: 0, y: -64 }, duration, animate.easeOut)
      .then(() => {
        scene.hide();
        cb();
      });
  }
}

startApplication(Application);
