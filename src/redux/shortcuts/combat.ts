import StateObserver from 'src/redux/StateObserver';
import { Target } from 'src/types/custom';
import {
  action_setDice,
  action_updateMeter,
  action_resetMeter,
  action_updateTurn,
  action_addAttackIcons,
  action_executeAttack,
  action_addHpMax,
  action_addHp,
  action_addEp,
  action_addEpMax,
  action_resolveCombat,
  action_resetCombat,
} from 'src/redux/state/reducers/combat';
import uiConfig from 'src/lib/uiConfig';

// export const getCoin = (target: Target) => {
//   return StateObserver.getState().target.coin;
// };

// export const getLevel = (target: Target) => {
//   return StateObserver.getState().target.level;
// };

// export const getHP = (target: Target) => {
//   return StateObserver.getState().target.HP;
// };

// export const getEP = (target: Target) => {
//   return StateObserver.getState().target.HP;
// };

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

// getters

export const getCurrentMeter = (target: Target) => {
  return StateObserver.getState().combat[target].meter;
};

export const getAttackIcons = (target: Target) => {
  return StateObserver.getState().combat[target].attackIcons;
};

// setters

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

export const updateTurn = () => {
  StateObserver.dispatch(action_updateTurn());
  // return StateObserver.getState().combat[target].turn;
};

export const setDice = (target: Target, value: number) => {
  StateObserver.dispatch(action_setDice({ target, value }));
};

export const updateMeter = (target: Target, value: number) => {
  StateObserver.dispatch(action_updateMeter({ target, value }));
  return getCurrentMeter(target);
};

export const resetMeter = (target: Target) => {
  StateObserver.dispatch(action_resetMeter({ target }));
};

export const addAttackIcons = (target: Target, value: number) => {
  StateObserver.dispatch(action_addAttackIcons({ target, value }));
};

export const executeAttack = (target: Target) => {
  StateObserver.dispatch(action_executeAttack({ target }));
};

export const resolveCombat = (winner: Target | null) => {
  StateObserver.dispatch(action_resolveCombat({ winner }));
};

export const resetCombat = () => {
  StateObserver.dispatch(action_resetCombat());
};
