import { createSlice, PayloadAction } from 'redux-starter-kit';
import { GameState } from 'src/types/custom';

const slice = createSlice({
  initialState: {
    gameState: 'title',
  },
  reducers: {
    setGameState: (state, { payload }: PayloadAction<GameState>) => {
      state.gameState = payload;
      // console.log('gameState:', state.gameState);
    },
  },
});

export const { setGameState } = slice.actions;
export default slice.reducer;
