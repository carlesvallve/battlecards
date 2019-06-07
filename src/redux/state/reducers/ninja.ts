import { createSlice, PayloadAction } from 'redux-starter-kit';
import { entityState, point } from 'src/lib/types';
import Entity from 'src/game/components/Entity';

const slice = createSlice({
  initialState: {
    entityState: 'Idle',
    goal: null,
    jumpGoal: null,
    grounded: false,
    respawning: false,
    target: null,
  },
  reducers: {
    setEntityState: (state, { payload }: PayloadAction<entityState>) => {
      state.entityState = payload;
    },

    setGoal: (state, { payload }: PayloadAction<point>) => {
      state.goal = payload;
    },

    setJumpGoal: (state, { payload }: PayloadAction<point>) => {
      state.jumpGoal = payload;
    },

    setGrounded: (state, { payload }: PayloadAction<boolean>) => {
      state.grounded = payload;
    },

    setRespawning: (state, { payload }: PayloadAction<boolean>) => {
      state.respawning = payload;
    },

    setTarget: (state, { payload }: PayloadAction<Entity>) => {
      state.target = payload;
    },
  },
});

export const {
  setEntityState,
  setGoal,
  setJumpGoal,
  setGrounded,
  setRespawning,
  setTarget,
} = slice.actions;
export default slice.reducer;
