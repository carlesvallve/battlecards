import View from 'ui/View';
import StateObserver from 'src/redux/StateObserver';
import { NavState, SceneID } from 'src/types/custom';
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
      if (navState === 'entering') this.onEntering();
      else if (navState === 'entered') this.onEntered();
      else if (navState === 'leaving') this.onLeaving();
      else if (navState === 'left') this.onLeft();
    });
  }

  protected onEntering() {
    this.init();
  }

  protected onEntered() {}

  protected onLeaving() {}

  protected onLeft() {}
}
