import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Target } from 'src/types/custom';

const slice = createSlice({
  initialState: {
    hero: {
      hp: 20,
      hpMax: 20,

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

    action_updateTurn: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
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
  },
});

export const {
  // setLevel,
  // setCoin,
  // setHP,
  // setEP,
  action_addHp,
  action_addHpMax,

  action_updateTurn,
  action_setDice,
  action_updateMeter,
  action_resetMeter,
  action_addAttackIcons,
  action_executeAttack,
} = slice.actions;
export default slice.reducer;
