import StateObserver from 'src/redux/StateObserver';
import { Target, TargetStat } from 'src/types/custom';
import {
  action_changeTarget,
  action_throwDice,
  action_setResolved,
  action_resetCombatTurn,
  action_addStat,
  action_setStat,
  action_setMonsterID,
  action_newCombat,
  action_setMeter,
} from 'src/redux/state/reducers/combat';
import uiConfig from 'src/lib/uiConfig';
import { CardNum } from 'src/game/components/cards/CardNumber';
import { State } from '../state';
import ruleset from '../ruleset';
import { getRandomItemFromArray } from 'src/lib/utils';
import { MonsterID, Monster } from '../ruleset/monsters';

// ======================================================

// getters without state

export const getRandomMonsterID = (): MonsterID => {
  return getRandomItemFromArray(ruleset.monsterIds);
};

export const getRandomMonster = (): Monster => {
  return ruleset.monsters[getRandomItemFromArray(ruleset.monsterIds)];
};

// ======================================================

// getters with state

export const getCurrentMeter = (target: Target) => {
  return StateObserver.getState().combat[target].meter;
};

export const getTarget = (state: State) => {
  return state.combat.target;
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

export const setMonsterID = (id: MonsterID) => {
  StateObserver.dispatch(action_setMonsterID({ id }));
  return id;
};

export const newCombat = (monsterID: MonsterID) => {
  StateObserver.dispatch(action_newCombat({ monsterID }));
  return StateObserver.getState().combat;
};

export const resetCombatTurn = () => {
  StateObserver.dispatch(action_resetCombatTurn());
};

export const changeTarget = (newTarget?: Target) => {
  StateObserver.dispatch(action_changeTarget({ newTarget }));
  return StateObserver.getState().combat.target;
};

export const throwDice = (target: Target, value: number) => {
  StateObserver.dispatch(action_throwDice({ target, value }));
};

export const setResolved = (target: Target) => {
  StateObserver.dispatch(action_setResolved({ target }));
};

export const setMeter = (target: Target, value: number) => {
  StateObserver.dispatch(action_setMeter({ target, value }));
};

export const addStat = (target: Target, type: string, value: TargetStat) => {
  StateObserver.dispatch(action_addStat({ target, type, value }));
  return StateObserver.getState().combat[target].stats.hp.current;
};

export const setStat = (target: Target, type: string, value: TargetStat) => {
  StateObserver.dispatch(action_setStat({ target, type, value }));
};

// ======================================================
