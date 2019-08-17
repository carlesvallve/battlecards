import StateObserver from '../StateObserver';
import { NavState, PopupID, SceneID } from 'src/types/custom';
import {
  togglePopup,
  selectScene,
  selectNavState,
  action_blockUi,
} from '../state/reducers/ui';


export const getScene = () => {
  return StateObserver.getState().ui.scene;
};

export const isLoading = () => {
  return StateObserver.getState().ui.isLoading;
};

export const blockUi = (blocked: boolean) => {
  return StateObserver.dispatch(action_blockUi({ blocked }));
};

export const openPopup = (id: PopupID) => {
  return StateObserver.dispatch(togglePopup({ id, enabled: true }));
};

export const closePopup = (id: PopupID) => {
  return StateObserver.dispatch(togglePopup({ id, enabled: false }));
};

export const navigateToScene = (scene: SceneID) => {
  return StateObserver.dispatch(selectScene(scene));
};

export const setNavState = (navState: NavState) => {
  return StateObserver.dispatch(selectNavState(navState));
};

export const getSceneNavState = (scene: SceneID) => {
  const ui = StateObserver.getState().ui;
  if (ui.scene !== scene) return null;
  return ui.navState;
};
