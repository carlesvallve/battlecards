import StateObserver from '../StateObserver';
import { NavState, PopupID, SceneID } from 'src/types/customTypes';
import { togglePopup } from '../state/reducers/ui';

export const getScene = () => {
  return StateObserver.getState().ui.scene;
};

export const isLoading = () => {
  return StateObserver.getState().ui.isLoading;
};

export const openPopup = (id: PopupID) => {
  return StateObserver.dispatch(togglePopup({ id, enabled: true }));
};

export const closePopup = (id: PopupID) => {
  return StateObserver.dispatch(togglePopup({ id, enabled: false }));
};

export const setNavState = (navState: NavState) => {
  return StateObserver.dispatch(setNavState(navState));
};

export const getSceneNavState = (scene: SceneID) => {
  const ui = StateObserver.getState().ui;
  if (ui.scene === scene) {
    return ui.navState;
  }
  return null;
};
