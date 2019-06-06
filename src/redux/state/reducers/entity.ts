import { createSlice, PayloadAction } from 'redux-starter-kit';
import { entityState } from 'src/lib/types';

const slice = createSlice({
  initialState: {
    entityState: 'Idle',
  },
  reducers: {
    setEntityState: (state, { payload }: PayloadAction<entityState>) => {
      state.entityState = payload;
    },
  },
});

export const { setEntityState } = slice.actions;
export default slice.reducer;
