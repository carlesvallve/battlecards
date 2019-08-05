import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Target, CombatPhase, CombatResult } from 'src/types/custom';
import {
  calculateNumberOfAttacks,
  getTargetEnemy,
  calculateNumberOfAttacksOverhead,
} from 'src/redux/shortcuts/combat';

const slice = createSlice({
  initialState: {
    phase: null as CombatPhase,

    result: null as CombatResult,

    turn: {
      target: null as Target,
      index: 0 as number,
    },

    hero: {
      hp: 20,
      hpMax: 20,

      ep: 20,
      epMax: 20,

      damage: 5,
      armour: 1,

      turn: 0,
      dice: 0,
      meter: 0,
      overhead: 0,
      attackIcons: 0,
      attacks: 0,
    },

    monster: {
      hp: 20,
      hpMax: 20,

      ep: 20,
      epMax: 20,

      damage: 5,
      armour: 1,

      turn: 0,
      dice: 0,
      meter: 0,
      overhead: 0,
      attackIcons: 0,
      attacks: 0,
    },
  },

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    action_setPhase: (
      state,
      { payload }: PayloadAction<{ value: CombatPhase }>,
    ) => {
      // toggle target
      state.phase = payload.value;
      // if (state.phase !== 'resolve') state.result = null;
    },

    action_updateTurn: (state) => {
      // toggle target
      const target = state.turn.target === 'hero' ? 'monster' : 'hero';
      // set turn data
      state.turn = {
        target,
        index: state.turn.index + 1,
      };
    },

    action_resolveCombat: (state) => {
      // get winner and loser
      let winner: Target =
        state.hero.meter > state.monster.meter ? 'hero' : 'monster';
      let loser: Target =
        state.hero.meter <= state.monster.meter ? 'hero' : 'monster';

      let attacks = 0;
      if (winner) {
        // calculate number of attacks
        const winnerMeter = state[winner].meter;
        const loserMeter = state[loser].meter;
        attacks = Math.max(winnerMeter - loserMeter, 0);
      }

      // no winner if is a draw
      // if (attacks === 0) winner = null;

      // set result
      state.result = {
        winner: attacks > 0 ? winner : null,
        loser: attacks > 0 ? loser : null,
        attacks,
        isOverhead: false,
        isCritical: state[winner].meter === 12,
        attacking: false,
      };
    },

    action_resolveCombatOverhead: (
      state,
      { payload }: PayloadAction<{ target: Target; overhead: number }>,
    ) => {
      const { target, overhead } = payload;

      // target is the loser, so get the winner
      const winner = target === 'hero' ? 'monster' : 'hero';

      // calculate number of overhead attacks
      const targetMeter = state[target].meter;
      const attacks = Math.abs(overhead - targetMeter);

      // set result
      // set result
      state.result = {
        winner,
        loser: target,
        attacks,
        isOverhead: true,
        isCritical: state[winner].meter === 12,
        attacking: false,
      };
    },

    action_executeAttacks: (state) => {
      state.result.attacking = true;
    },

    action_endTurn: (state) => {
      state.turn.index = 0;
      state.result = null;
      state.hero.meter = 0;
      state.monster.meter = 0;
    },

    // ====================

    action_addHp: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].hp += value;
    },

    action_addHpMax: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].hpMax = value;
    },

    action_addEp: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].ep += value;
    },

    action_addEpMax: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].epMax = value;
    },

    action_setDice: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].dice = value;
    },

    action_updateMeter: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].meter += value;
    },

    action_resetMeter: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
      state[target].meter = 0;
    },

    action_addAttackIcons: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].attackIcons += value;
    },

    // action_resolveCombat: (
    //   state,
    //   { payload }: PayloadAction<{ winner: Target | null }>,
    // ) => {
    //   let winner = payload.winner;
    //   if (winner === null) {
    //     winner = state.hero.meter > state.monster.meter ? 'hero' : 'monster';
    //   }

    //   const loser = winner === 'hero' ? 'monster' : 'hero';

    //   const diff = Math.abs(state[winner].meter - state[loser].meter);
    //   if (diff === 0) winner = null;

    //   state.result = { winner, attacks: diff };
    //   console.log('>>> combat result', state.result);
    // },

    action_resetCombat: (state) => {
      state.result = null;

      state.hero.turn = 0;
      state.hero.meter = 0;
      state.hero.attackIcons = 0;
      state.hero.attacks = 0;

      state.monster.turn = 0;
      state.monster.meter = 0;
      state.monster.attackIcons = 0;
      state.monster.attacks = 0;
    },
  },
});

export const {
  action_setPhase,
  action_updateTurn,
  action_resolveCombat,
  action_resolveCombatOverhead,
  action_executeAttacks,
  action_endTurn,

  // setLevel,
  // setCoin,
  // setHP,
  // setEP,
  action_addHp,
  action_addHpMax,

  action_addEp,
  action_addEpMax,

  action_setDice,
  action_updateMeter,
  action_resetMeter,

  action_addAttackIcons,

  action_resetCombat,
} = slice.actions;
export default slice.reducer;
