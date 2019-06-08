import pubsub from 'pubsub-js';

import sounds from 'src/lib/sounds';
import View from 'ui/View';
import FixedTextView from 'src/lib/ui/FixedTextView';
import InputView from 'src/lib/ui/InputView';
import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';
import { screen } from 'src/lib/customTypes';
import StateObserver from 'src/redux/StateObserver';
import { selectScene } from 'src/redux/state/reducers/ui';

export default class TitleScreen extends View {
  screen: screen;

  constructor() {
    super({});
    this.screen = getScreenDimensions();
    console.log('dimensions:', this.screen.width, this.screen.height);

    this.createElements();

    const inputView = new InputView({
      parent: this,
      width: this.screen.width,
      height: this.screen.height,
      dragThreshold: 0,
    });

    inputView.registerHandlerForTouch((x: number, y: number) => {
      StateObserver.dispatch(selectScene('game'));
    });

    pubsub.subscribe('title:start', this.init.bind(this));
  }

  init() {
    sounds.playSong('win');
  }

  createElements() {
    const bg = new View({
      parent: this,
      width: this.screen.width,
      height: this.screen.height,
      backgroundColor: '#010101',
    });

    const offsetY = 110;

    const titleTop = new FixedTextView({
      parent: this,
      text: 'SLIME',
      color: '#CC0000',
      x: 0,
      y: -offsetY + this.screen.height / 2,
      width: 320,
      height: 100,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 4,
      strokeColor: '#ff0000',
      size: 64,
      autoFontSize: false,
      autoSize: false,
    });

    const titleBottom = new FixedTextView({
      parent: this,
      text: 'SMASH',
      color: '#ddd',
      x: 0,
      y: -0 + -offsetY + 68 + this.screen.height / 2,
      width: 320,
      height: 100,
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      strokeWidth: 4,
      strokeColor: '#fff',
      size: 57,
      autoFontSize: false,
      autoSize: false,
    });

    const startLabel = new FixedTextView({
      parent: this,
      text: 'START',
      color: '#eee',
      x: 0,
      y: 200 - offsetY + this.screen.height / 2,
      width: 320,
      height: 32,
      fontWeight: 'bold',
      fontFamily: 'Verdana',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      size: 11,
      autoFontSize: false,
      autoSize: false,
      visible: false,
    });

    blink(startLabel, 350);
  }
}
