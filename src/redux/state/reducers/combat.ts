import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Target } from 'src/types/custom';

const slice = createSlice({
  initialState: {
    result: null,

    turn: {
      target: 'hero',
      index: 0,
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
      attackIcons: 0,
      attacks: 0,
    },
  },

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    // setLevel: (state, { payload }: PayloadAction<{ target: Target, value: number }>) => {
    //   const { target, value } = payload;
    //   state[target].level = value;
    // },
    // setCoin: (state, { payload }: PayloadAction<{ target: Target, value: number }>) => {
    //   const { target, value } = payload;
    //   state[target].coin = value;
    // },
    // setHP: (state, { payload }: PayloadAction<{ target: Target, value: number }>) => {
    //   const { target, value } = payload;
    //   state[target].HP = value;
    // },
    // setEP: (state, { payload }: PayloadAction<{ target: Target, value: number }>) => {
    //   const { target, value } = payload;
    //   state[target].EP = value;
    // },

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

    action_updateTurn: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
      (state.turn.target = target === 'hero' ? 'monster' : 'hero'),
        (state.turn.index += 1);
      state[target].turn += 1;
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

    action_executeAttack: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
      state[target].attackIcons -= 1;
      state[target].attacks += 1;
    },

    action_resolveCombat: (
      state,
      { payload }: PayloadAction<{ winner: Target | null }>,
    ) => {
      let winner = payload.winner;
      if (winner === null) {
        winner = state.hero.meter > state.monster.meter ? 'hero' : 'monster';
      }

      const loser = winner === 'hero' ? 'monster' : 'hero';

      const diff = Math.abs(state[winner].meter - state[loser].meter);
      if (diff === 0) winner = null;

      state.result = { winner, attacks: diff };
      console.log('>>> combat result', state.result);
    },

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
  // setLevel,
  // setCoin,
  // setHP,
  // setEP,
  action_addHp,
  action_addHpMax,

  action_addEp,
  action_addEpMax,

  action_updateTurn,
  action_setDice,
  action_updateMeter,
  action_resetMeter,

  action_addAttackIcons,
  action_executeAttack,

  action_resolveCombat,
  action_resetCombat,
} = slice.actions;
export default slice.reducer;
