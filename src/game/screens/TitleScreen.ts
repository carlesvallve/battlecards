
import View from 'ui/View';
import FixedTextView from 'src/lib/FixedTextView';
import InputView from 'src/lib/InputView';


import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';

export default class TitleScreen extends View {

  constructor () {
    super({});
    this.screen = getScreenDimensions();
    console.log('dimensions:', this.screen.width, this.screen.height);

    new View({
      parent: this,
      width: this.screen.width,
      height: this.screen.height,
      backgroundColor: '#010101',
    });

    const offsetY = 110;

    // title
    new FixedTextView({
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

    new FixedTextView({
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
      // y: 172 - offsetY + this.screen.height / 2,
      width: 320,
      height: 32,
      fontWeight: 'bold',
      fontFamily: 'Verdana',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      size: 11,
      autoFontSize: false,
      autoSize: false,
    });

    startLabel.hide();
    blink(startLabel, 350);

    this.inputView = new InputView({
      parent: this,
      width: this.screen.width,
      height: this.screen.height,
      dragThreshold: 0,
    });

    this.inputView.registerHandlerForTouch((x, y) => {
      this.emit('titlescreen:start');
    });
  }
}
