import startApplication from 'startApplication';

import device from 'device';
import View from 'ui/View';
import StackView from 'ui/StackView';
import TitleScreen from 'src/game/screens/TitleScreen';
import GameScreen from 'src/game/screens/GameScreen';
import sounds from 'src/lib/sounds';

import platform from 'platform';

export default class Application extends View {
  constructor (opts) {
    super(opts);
    // console.log('Initializing Application...');

    this._loadAssets()
      .then(() =>  platform.startGameAsync())
      .then(() => this.startGame());
    // device.screen.on('Resize', () => this.resize());
  }

  _loadAssets () {
    // console.log('Start loading assets...');
    // var initialAssets = loadingGroups.initialAssets;
    var loadingProgress = 0;

    function setLoadingProgress (progress) {
      loadingProgress = progress;
      platform.setLoadingProgress(progress);
    }

    function updateLoadingProgress () {
      // Tricking the user by making the loading look fast
      // The progress incrementally increases by 0.5% every tick until next progress level
      // Capping at 99% to make sure we do not display 100% while game not entirely loaded
      // var nextProgress = initialAssets.nextProgress * 100;
      var progressStep = 0.5;
      // console.log('updateLoadingProgress:', loadingProgress + progressStep);
      setLoadingProgress(Math.min(99, loadingProgress + progressStep));
    }

    return new Promise ((resolve) => {
      var progressUpdateHandle = setInterval(() => updateLoadingProgress(), 16);
      // fake loading of initial assets
      setTimeout(() => {
        // console.log('Finished loading assets...');
        setLoadingProgress(100);
        clearInterval(progressUpdateHandle);
        resolve();
      }, 1000);

      // load initial assets
      //   initialAssets.load(() => {
      //     setLoadingProgress(100);
      //     clearInterval(progressUpdateHandle);
      //     // entryStepComplete('initialAssetsLoaded');
      //     resolve();
      //   });
    });
  }

  startGame () {
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
