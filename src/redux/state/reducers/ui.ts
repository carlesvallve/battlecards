import { createSlice, PayloadAction } from 'redux-starter-kit';
import { NavState, SceneID, PopupOpts } from 'src/types/custom';

const slice = createSlice({
  initialState: {
    locale: 'en',
    isLoading: false,
    isBlocked: false,
    previousScene: null,
    scene: 'title' as SceneID,
    navState: null as NavState,
    togglePopup: { id: '', enabled: false },
  },

  reducers: {
    setLocale: (state, { payload }: PayloadAction<string>) => {
      state.locale = payload;
    },

    selectNavState: (state, { payload }: PayloadAction<NavState>) => {
      state.navState = payload;
    },
    selectScene: (state, { payload }: PayloadAction<SceneID>) => {
      state.previousScene = state.scene;
      state.scene = payload;
    },

    togglePopup: (state, { payload }: PayloadAction<PopupOpts>) => {
      state.togglePopup = payload;
    },
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },

    action_blockUi: (
      state,
      { payload }: PayloadAction<{ blocked: boolean }>,
    ) => {
      state.isBlocked = payload.blocked;
    },
  },
});

export const {
  selectScene,
  selectNavState,
  togglePopup,
  showLoading,
  hideLoading,
  action_blockUi,
} = slice.actions;
export default slice.reducer;
