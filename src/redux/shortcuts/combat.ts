import StateObserver from 'src/redux/StateObserver';
import { Target } from 'src/types/custom';
import {
  action_changeTarget,
  action_throwDice,
  action_setResolved,
} from 'src/redux/state/reducers/combat';
import uiConfig from 'src/lib/uiConfig';
import { CardNum } from 'src/game/components/cards/CardNumber';
import { State } from '../state';
import ruleset from '../ruleset';
import { getRandomItemFromArray } from 'src/lib/utils';
import { MonsterID, Monster } from '../ruleset/monsters';

// ======================================================

// getters

export const getRandomMonsterID = (): MonsterID => {
  return getRandomItemFromArray(ruleset.monsterIds);
};

export const getRandomMonster = (): Monster => {
  return ruleset.monsters[getRandomItemFromArray(ruleset.monsterIds)];
};

// ======================================================

export const getCurrentMeter = (target: Target) => {
  return StateObserver.getState().combat[target].meter;
};

export const getTarget = (state: State) => {
  return state.combat.target;
  // return state.combat.turn.target;
};

export const getTargetEnemy = (target: Target): Target => {
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

export const changeTarget = (newTarget?: Target) => {
  StateObserver.dispatch(action_changeTarget({ newTarget }));
  return StateObserver.getState().combat.target;
};

export const throwDice = (target: Target, value: CardNum) => {
  StateObserver.dispatch(action_throwDice({ target, value }));
};

export const setResolved = (target: Target) => {
  StateObserver.dispatch(action_setResolved({ target }));
};

// ======================================================

// export const updateTurn = (num: CardNum) => {
//   StateObserver.dispatch(action_updateTurn({ value: num }));
// };

// export const setMeter = (target: Target, value: number) => {
//   StateObserver.dispatch(action_setMeter({ target, value }));
//   return getCurrentMeter(target);
// };

// export const updateMeter = (target: Target, value: number) => {
//   StateObserver.dispatch(action_updateMeter({ target, value }));
//   return getCurrentMeter(target);
// };

// export const setResolved = (target: Target, value: boolean) => {
//   StateObserver.dispatch(action_setResolved({ target, value }));
// };

// export const resolveCombat = () => {
//   StateObserver.dispatch(action_resolveCombat());
// };

// export const resolveCombatOverhead = (target: Target, overhead: number) => {
//   StateObserver.dispatch(action_resolveCombatOverhead({ target, overhead }));
// };

// export const executeAttacks = () => {
//   StateObserver.dispatch(action_executeAttacks());
// };

// export const endTurn = () => {
//   StateObserver.dispatch(action_endTurn());
// };

// ======================================================

// export const addHp = (target: Target, value: number) => {
//   StateObserver.dispatch(action_addHp({ target, value }));
// };

// export const addHpMax = (target: Target, value: number) => {
//   StateObserver.dispatch(action_addHpMax({ target, value }));
// };

// export const addEp = (target: Target, value: number) => {
//   StateObserver.dispatch(action_addEp({ target, value }));
// };

// export const addEpMax = (target: Target, value: number) => {
//   StateObserver.dispatch(action_addEpMax({ target, value }));
// };

// ======================================================
