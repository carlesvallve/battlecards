import { createSlice, PayloadAction } from 'redux-starter-kit';
import { gameState } from 'src/lib/types';


const slice = createSlice({
  initialState: {
    gameState: 'Idle',
  },
  reducers: {
    setGameState: (state, { payload }: PayloadAction<gameState>) => {
      state.gameState = payload;
    },
  },
});

export const { setGameState } = slice.actions;
export default slice.reducer;
