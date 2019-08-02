import View from 'ui/View';
import StateObserver from 'src/redux/StateObserver';
import { NavState, SceneID } from 'src/types/customTypes';
import { getSceneNavState } from 'src/redux/shortcuts/ui';
import { State } from 'src/redux/state';

export default class SceneBasic {
  protected container = new View({ opacity: 0, backgroundColor: 'black' });

  constructor() {}

  getView() {
    return this.container;
  }

  protected init() {}

  protected createNavSelector(scene: SceneID) {
    StateObserver.createSelector((state: State) =>
      getSceneNavState(scene),
    ).addListener((navState: NavState) => {
      if (navState === 'entering') this.init();
    });
  }
}
