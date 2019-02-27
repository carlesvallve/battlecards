// webpackGameEntrypoint must go at top of file!
import webpackGameEntrypoint from 'devkitCore/clientapi/webpackGameEntrypoint';

import device from 'device';
import View from 'ui/View';
import StackView from 'ui/StackView';
import TitleScreen from 'src/game/screens/TitleScreen';
import GameScreen from 'src/game/screens/GameScreen';
import sounds from 'src/lib/sounds';

// TODO: game breaks on WebGLTextureManager since for some reason
// we don't have CONFIG.ios, only CONFIG.android and CONFIG.browser

export default class Application extends View {
  constructor (opts) {
    super(opts);
    this.startGame();
    // device.screen.on('Resize', () => this.resize());
  }

  startGame () {
		this.style.backgroundColor = '#444';

		var rootView = new StackView({
			parent: this,
			x: 0,
			y: 0,
			width: device.screen.width, // 320,
			height: device.screen.height, // 480,
			clip: false,
			scale: device.width / 320,
		});

		const titleScreen = new TitleScreen();
		const gameScreen = new GameScreen();

		rootView.push(titleScreen);
		sounds.playSong('win');

		titleScreen.on('titlescreen:start', () => {
			sounds.playSong('dubesque');
			rootView.push(gameScreen, true);
			gameScreen.emit('game:start');
		});

		gameScreen.on('game:end', () => {
			rootView.pop(true);
			sounds.playSong('win');
		});
	}
}

webpackGameEntrypoint(Application);
