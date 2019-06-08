import pubsub from 'pubsub-js';

import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import InputView from 'src/game/ui/InputView';
import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';
import { screen } from 'src/lib/customTypes';
import StateObserver from 'src/redux/StateObserver';
import { selectScene } from 'src/redux/state/reducers/ui';
import { setGameState } from 'src/redux/state/reducers/game';
import i18n from 'src/lib/i18n/i18n';

export default class TitleScreen extends View {
  screen: screen;
  startLabel: BitmapFontTextView;

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
      animate(this.startLabel).clear();
      this.startLabel.hide();
      StateObserver.dispatch(selectScene('game'));
    });

    pubsub.subscribe('title:start', this.init.bind(this));
  }

  init() {
    StateObserver.dispatch(setGameState('Title'));
    sounds.playSong('win');
    blink(this.startLabel, 350);
  }

  createElements() {
    const bg = new View({
      parent: this,
      width: this.screen.width,
      height: this.screen.height,
      backgroundColor: '#010101',
    });

    const fontName = 'Title';
    const dy = 110;

    const titleTop = new BitmapFontTextView({
      superview: this,
      text: i18n('title.slime'),
      x: this.screen.width / 2,
      y: -dy + this.screen.height / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 66,
      color: '#CC0000',
      strokeColor: '#ff0000',
      wordWrap: false,
      font: bitmapFonts(fontName),
    });

    const titleBottom = new BitmapFontTextView({
      superview: this,
      text: i18n('title.smash'),
      x: this.screen.width / 2,
      y: -dy + 68 + this.screen.height / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 57,
      color: '#ddd',
      wordWrap: false,
      font: bitmapFonts(fontName),
    });

    this.startLabel = new BitmapFontTextView({
      superview: this,
      text: i18n('title.start'),
      x: this.screen.width / 2,
      y: 200 - dy + this.screen.height / 2,
      align: 'center',
      verticalAlign: 'center',
      size: 12,
      color: '#eee',
      wordWrap: false,
      font: bitmapFonts(fontName),
      visible: false,
    });
  }
}
