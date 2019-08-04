import { createSlice, PayloadAction } from 'redux-starter-kit';

const slice = createSlice({
  initialState: {
    kills: 0,
  },

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    setKills: (state, { payload }: PayloadAction<number>) => {
      state.kills = payload;
    },
  },
});

export const { setKills } = slice.actions;
export default slice.reducer;
