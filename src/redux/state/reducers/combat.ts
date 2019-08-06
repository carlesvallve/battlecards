import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  Target,
  CombatResult,
  CombatTurn,
  CombatStats,
} from 'src/types/custom';

const slice = createSlice({
  initialState: {
    result: null as CombatResult,

    turn: {
      target: null as Target,
      index: null as number,
    } as CombatTurn,

    // todo: grab this from ruleset
    hero: {
      meter: 0,
      hp: 20,
      hpMax: 20,
      ep: 20,
      epMax: 20,
      damage: 5,
      armour: 1,
    } as CombatStats,

    // todo: grab this from ruleset
    monster: {
      meter: 0,
      hp: 20,
      hpMax: 20,
      ep: 20,
      epMax: 20,
      damage: 5,
      armour: 1,
    } as CombatStats,
  },

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    action_updateTurn: (state) => {
      const target = state.turn.target === 'hero' ? 'monster' : 'hero';
      state.turn = {
        target,
        index: state.turn.index + 1,
      };
    },

    action_updateMeter: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].meter += value;
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
      const attacks = overhead;
      // const winnerMeter = state[winner].meter;
      // const attacks = Math.abs(overhead - winnerMeter);
      // const attacks = Math.abs(overhead - winnerMeter);

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
  },
});

export const {
  action_updateTurn,
  action_updateMeter,
  action_resolveCombat,
  action_resolveCombatOverhead,
  action_executeAttacks,
  action_endTurn,

  action_addHp,
  action_addHpMax,
  action_addEp,
  action_addEpMax,
} = slice.actions;
export default slice.reducer;
