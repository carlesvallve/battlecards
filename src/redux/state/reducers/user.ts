import { createSlice, PayloadAction } from 'redux-starter-kit';
import { CardID } from 'src/redux/ruleset/cards';

const slice = createSlice({
  initialState: {
    score: 0,
    level: 0,
    HP: 20,
    EP: 20,
  },

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    setScore: (state, { payload }: PayloadAction<number>) => {
      state.score = payload;
    },
    addScore: (state, { payload }: PayloadAction<number>) => {
      state.score += payload;
    },

    setLevel: (state, { payload }: PayloadAction<number>) => {
      state.level = payload;
    },
    addLevel: (state, { payload }: PayloadAction<number>) => {
      state.level += payload;
    },

    setHP: (state, { payload }: PayloadAction<number>) => {
      state.HP = payload;
    },
    addHP: (state, { payload }: PayloadAction<number>) => {
      state.HP += payload;
    },

    setEP: (state, { payload }: PayloadAction<number>) => {
      state.EP = payload;
    },
    addEP: (state, { payload }: PayloadAction<number>) => {
      state.EP += payload;
    },
  },
});

export const {
  setScore,
  addScore,
  setLevel,
  addLevel,
  setHP,
  addHP,
  setEP,
  addEP,
} = slice.actions;
export default slice.reducer;
