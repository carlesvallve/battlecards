import startApplication from 'startApplication';

import device from 'device';
import View from 'ui/View';
import StackView from 'ui/StackView';
import TitleScreen from 'src/game/screens/TitleScreen';
import GameScreen from 'src/game/screens/GameScreen';
import sounds from 'src/lib/sounds';

import platform from 'platform';

import loadingGroups from 'src/loadingGroups';

export default class Application extends View {
  constructor(opts) {
    super(opts);
    // console.log('Initializing Application...');

    this.loadAssets()
      .then(() => platform.startGameAsync())
      .then(() => this.startGame());
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
        // i18n.loadLocale('en')
        // .then(() => {
        setLoadingProgress(100);
        clearInterval(progressUpdateHandle);
        // entryStepComplete('initialAssetsLoaded');
        resolve();

        loadingGroups.soundAssets.load(() => {
          console.log('sounds were preloaded!');
        });
        // });
      });
    });
  }

  startGame() {
    // console.log('START GAME!');
    this.style.backgroundColor = '#444';

    var rootView = new StackView({
      parent: this,
      x: 0,
      y: 0,
      width: device.screen.width,
      height: device.screen.height,
      clip: false,
      scale: device.width / 320,
    });

    const titleScreen = new TitleScreen();
    const gameScreen = new GameScreen();

    rootView.push(titleScreen);
    sounds.playSong('win');

    titleScreen.on('titlescreen:start', () => {
      // sounds.playSong('dubesque');
      rootView.push(gameScreen, true);
      gameScreen.emit('game:start');
    });

    gameScreen.on('game:end', () => {
      rootView.pop(true);
      sounds.playSong('win');
    });
  }
}

startApplication(Application);