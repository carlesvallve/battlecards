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

export const updateTurn = (target: Target) => {
  StateObserver.dispatch(action_updateTurn({ target }));
  return StateObserver.getState().combat[target].turn;
};

export const setDice = (target: Target, value: number) => {
  StateObserver.dispatch(action_setDice({ target, value }));
};

export const updateMeter = (target: Target, value: number) => {
  StateObserver.dispatch(action_updateMeter({ target, value }));
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
