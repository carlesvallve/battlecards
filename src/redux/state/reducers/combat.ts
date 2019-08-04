import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Target } from 'src/types/custom';

const slice = createSlice({
  initialState: {
    hero: {
      // level: 0,
      // coin: 0,
      // HP: 20,
      // EP: 20,
      turn: 0,
      dice: 0,
      meter: 0,
      attacks: 0,
    },

    monster: {
      // level: 0,
      // coin: 0,
      // HP: 20,
      // EP: 20,

      turn: 0,
      dice: 0,
      meter: 0,
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

    action_addAttacks: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].attacks += value;
    },
  },
});

export const {
  // setLevel,
  // setCoin,
  // setHP,
  // setEP,
  action_updateTurn,
  action_setDice,
  action_updateMeter,
  action_resetMeter,
  action_addAttacks
} = slice.actions;
export default slice.reducer;
