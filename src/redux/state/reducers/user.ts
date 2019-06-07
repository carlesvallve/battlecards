import { createSlice, PayloadAction } from 'redux-starter-kit';

const slice = createSlice({
  initialState: {
    score: 0,
    highscore: 0,
    stars: 0,
    hearts: 0,
    pause: false,
  },
  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    setScore: (state, { payload }: PayloadAction<number>) => {
      state.score = payload;
    },

    addScore: (state, { payload }: PayloadAction<number>) => {
      state.score += payload;
    },
    setHighscore: (state, { payload }: PayloadAction<number>) => {
      state.highscore = payload;
    },

    setStars: (state, { payload }: PayloadAction<number>) => {
      state.stars = payload;
    },
    addStars: (state, { payload }: PayloadAction<number>) => {
      state.stars += payload;
    },

    setHearts: (state, { payload }: PayloadAction<number>) => {
      state.hearts = payload;
    },
    addHearts: (state, { payload }: PayloadAction<number>) => {
      state.hearts += payload;
    },

    setPause: (state, { payload }: PayloadAction<boolean>) => {
      console.log('setting pause to ', payload);
      state.pause = payload;
    },
  },
});

export const {
  setScore,
  addScore,
  setHighscore,
  setStars,
  addStars,
  setHearts,
  addHearts,
  setPause,
} = slice.actions;
export default slice.reducer;
