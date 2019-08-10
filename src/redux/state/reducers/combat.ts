import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  Target,
  TargetData,
  // CombatResult,
  // CombatTurn,
  // CombatStats,
} from 'src/types/custom';
import { CardNum } from 'src/game/components/cards/CardNumber';
// import ruleset from 'src/redux/ruleset';
// import { getTargetEnemy } from 'src/redux/shortcuts/combat';

const slice = createSlice({
  initialState: {
    index: 0,

    target: null as Target,
    enemy: null as Target,

    hero: {
      meter: 0,
      overhead: 0,
      resolved: false,
    } as TargetData,

    monster: {
      meter: 0,
      overhead: 0,
      resolved: false,
    } as TargetData,

    // result: null as CombatResult,

    // turn: {
    //   target: null as Target,
    //   index: null as number,
    //   dice: null as CardNum,
    // } as CombatTurn,

    // // todo: grab this from ruleset
    // hero: {
    //   resolved: false,
    //   meter: 0,
    //   hp: 20,
    //   hpMax: 20,
    //   ep: 20,
    //   epMax: 20,
    //   damage: 5,
    //   armour: 1,
    // } as CombatStats,

    // // todo: grab this from ruleset
    // monster: {
    //   resolved: false,
    //   meter: 0,
    //   hp: 20,
    //   hpMax: 20,
    //   ep: 20,
    //   epMax: 20,
    //   damage: 5,
    //   armour: 1,
    // } as CombatStats,
  },

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    action_changeTarget: (
      state,
      { payload }: PayloadAction<{ newTarget?: Target }>,
    ) => {
      if (payload.newTarget) {
        state.target = payload.newTarget;
      } else {
        state.target = state.target === 'hero' ? 'monster' : 'hero';
      }
      state.enemy = state.target === 'hero' ? 'monster' : 'hero';

      console.log('action > changeTarget:', state.target);
    },

    action_throwDice: (
      state,
      { payload }: PayloadAction<{ target: Target; value: CardNum }>,
    ) => {
      const { target, value } = payload;

      if (!state.target) {
        state.target = target;
        state.enemy = state.target === 'hero' ? 'monster' : 'hero';
      }

      state[target].overhead = 0;
      state[target].meter += value;
      if (state[target].meter > 12) {
        state[target].overhead = state[target].meter - 12;
        state[target].meter = 0;
      }

      state.index += 1;

      console.log('action > throwDice:', target, { ...state[target] });
    },

    action_setResolved: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
      state[target].resolved = true;
      state.index += 1;
      console.log('action > setResolved:', target, { ...state[target] });
    },
  },

  // ==============================================

  //   action_updateTurn: (
  //     state,
  //     { payload }: PayloadAction<{ value: CardNum }>,
  //   ) => {
  //     let target = state.turn.target;
  //     const enemy = getTargetEnemy(target);

  //     if (state[enemy].resolved && state[enemy].resolved) {
  //       console.error(
  //         'Both contendands resolved their combat.  Cannot update turn...',
  //       );
  //       return;
  //     }

  //     if (!state[enemy].resolved) {
  //       target = enemy;
  //     }

  //     // const target = state.turn.target === 'hero' ? 'monster' : 'hero';
  //     state.turn = {
  //       target,
  //       index: state.turn.index + 1,
  //       dice: payload.value,
  //     };
  //   },

  //   action_setMeter: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: number }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].meter = value;
  //   },

  //   action_updateMeter: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: number }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].meter += value;
  //   },

  //   action_setResolved: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: boolean }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].resolved = value;
  //     console.log('>>> action_setResolved', target, value);
  //   },

  //   action_resolveCombat: (state) => {
  //     // get winner and loser
  //     let winner: Target =
  //       state.hero.meter > state.monster.meter ? 'hero' : 'monster';
  //     let loser: Target =
  //       state.hero.meter <= state.monster.meter ? 'hero' : 'monster';

  //     let attacks = 0;
  //     if (winner) {
  //       // calculate number of attacks
  //       const winnerMeter = state[winner].meter;
  //       const loserMeter = state[loser].meter;
  //       attacks = Math.max(winnerMeter - loserMeter, 0);
  //     }

  //     // set result
  //     state.result = {
  //       winner: attacks > 0 ? winner : null,
  //       loser: attacks > 0 ? loser : null,
  //       attacks,
  //       isOverhead: false,
  //       isCritical: state[winner].meter === 12,
  //       attacking: false,
  //     };
  //   },

  //   action_resolveCombatOverhead: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; overhead: number }>,
  //   ) => {
  //     const { target, overhead } = payload;

  //     // target is the loser, so get the winner
  //     const winner = target === 'hero' ? 'monster' : 'hero';

  //     // calculate number of overhead attacks
  //     const attacks = overhead;
  //     // const winnerMeter = state[winner].meter;
  //     // const attacks = Math.abs(overhead - winnerMeter);
  //     // const attacks = Math.abs(overhead - winnerMeter);

  //     // set result
  //     state.result = {
  //       winner,
  //       loser: target,
  //       attacks,
  //       isOverhead: true,
  //       isCritical: state[winner].meter === 12,
  //       attacking: false,
  //     };
  //   },

  //   action_executeAttacks: (state) => {
  //     state.result.attacking = true;
  //   },

  //   action_endTurn: (state) => {
  //     state.turn.index = 0;
  //     state.result = null;
  //     state.hero.meter = 0;
  //     state.monster.meter = 0;
  //   },

  //   // ====================

  //   action_addHp: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: number }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].hp += value;
  //   },

  //   action_addHpMax: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: number }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].hpMax = value;
  //   },

  //   action_addEp: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: number }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].ep += value;
  //   },

  //   action_addEpMax: (
  //     state,
  //     { payload }: PayloadAction<{ target: Target; value: number }>,
  //   ) => {
  //     const { target, value } = payload;
  //     state[target].epMax = value;
  //   },
  // },
});

export const {
  action_changeTarget,
  action_throwDice,
  action_setResolved,

  // action_updateTurn,
  // action_setMeter,
  // action_updateMeter,
  // action_setResolved,
  // action_resolveCombat,
  // action_resolveCombatOverhead,
  // action_executeAttacks,
  // action_endTurn,

  // action_addHp,
  // action_addHpMax,
  // action_addEp,
  // action_addEpMax,
} = slice.actions;
export default slice.reducer;
