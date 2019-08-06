import StateObserver from 'src/redux/StateObserver';
import { Target } from 'src/types/custom';
import {
  action_updateTurn,
  action_updateMeter,
  action_resolveCombat,
  action_resolveCombatOverhead,
  action_executeAttacks,
  action_endTurn,
  action_addHpMax,
  action_addHp,
  action_addEp,
  action_addEpMax,
  action_setMeter,
} from 'src/redux/state/reducers/combat';
import uiConfig from 'src/lib/uiConfig';

// ======================================================

// getters

// ======================================================

export const getCurrentMeter = (target: Target) => {
  return StateObserver.getState().combat[target].meter;
};

export const getTargetEnemy = (target: Target) => {
  return target === 'hero' ? 'monster' : 'hero';
};

export const getColorByTarget = (target: Target) => {
  return target === 'hero' ? uiConfig.frameBlue : uiConfig.frameRed;
};

export const getColorByDiff = (target: Target, currentMeter: number) => {
  const enemyMeter = getCurrentMeter(getTargetEnemy(target));
  return enemyMeter < currentMeter
    ? uiConfig.frameYellow
    : uiConfig.frameOrange;
};

// ======================================================

// setters

// ======================================================

export const updateTurn = () => {
  StateObserver.dispatch(action_updateTurn());
};

export const setMeter = (target: Target, value: number) => {
  StateObserver.dispatch(action_setMeter({ target, value }));
  return getCurrentMeter(target);
};

export const updateMeter = (target: Target, value: number) => {
  StateObserver.dispatch(action_updateMeter({ target, value }));
  return getCurrentMeter(target);
};

export const resolveCombat = () => {
  StateObserver.dispatch(action_resolveCombat());
};

export const resolveCombatOverhead = (target: Target, overhead: number) => {
  StateObserver.dispatch(action_resolveCombatOverhead({ target, overhead }));
};

export const executeAttacks = () => {
  StateObserver.dispatch(action_executeAttacks());
};

export const endTurn = () => {
  StateObserver.dispatch(action_endTurn());
};

// ======================================================

export const addHp = (target: Target, value: number) => {
  StateObserver.dispatch(action_addHp({ target, value }));
};

export const addHpMax = (target: Target, value: number) => {
  StateObserver.dispatch(action_addHpMax({ target, value }));
};

export const addEp = (target: Target, value: number) => {
  StateObserver.dispatch(action_addEp({ target, value }));
};

export const addEpMax = (target: Target, value: number) => {
  StateObserver.dispatch(action_addEpMax({ target, value }));
};

// ======================================================
