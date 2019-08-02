import pubsub from 'pubsub-js';

import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import InputView from 'src/game/ui/InputView';
import { getScreenDimensions } from 'src/lib/utils';
import { blink } from 'src/lib/animations';
import { Screen, NavState, SceneID } from 'src/types/customTypes';
import StateObserver from 'src/redux/StateObserver';
import { selectScene } from 'src/redux/state/reducers/ui';
import { setGameState } from 'src/redux/state/reducers/game';
import i18n from 'src/lib/i18n/i18n';
import { getSceneNavState } from 'src/redux/shortcuts/ui';

export default class SceneBasic {
  protected container = new View({ opacity: 0, backgroundColor: 'black' });

  constructor() {
  }

  getView() {
    return this.container;
  }

  protected init() {}

  protected createNavSelector(scene: SceneID) {
    StateObserver.createSelector(({ ui }) => getSceneNavState('title')).addListener(
      (navState: NavState) => {
        if (navState === 'entering') this.init();
      },
    );
  }
}
