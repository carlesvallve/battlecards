import { createSlice, PayloadAction } from 'redux-starter-kit';
import { State } from './';

const slice = createSlice({
  initialState: {
    score: 0,
    stars: 0,
    isPlaying: false,
    loading: false,
  },
  reducers: {
    update: (_, { payload }: PayloadAction<any>) => payload,
    setScore: (state, { payload }: PayloadAction<number>) => {
      state.score = payload;
    },
    setStars: (state, { payload }: PayloadAction<number>) => {
      state.stars = payload;
    },
    setPlaying: (state, { payload }: PayloadAction<boolean>) => {
      state.isPlaying = payload;
    },
  },
});

export const {
  update,
  setScore,
  setStars,
  setPlaying,
} = slice.actions;
export default slice.reducer;
