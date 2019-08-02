import { createSlice, PayloadAction } from 'redux-starter-kit';
import { NavState, SceneID, PopupOpts } from 'src/types/customTypes';

const slice = createSlice({
  initialState: {
    locale: 'en',
    isLoading: false,
    previousScene: null,
    scene: 'title' as SceneID,
    navState: null,
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
  },
});

export const {
  selectScene,
  selectNavState,
  togglePopup,
  showLoading,
  hideLoading,
} = slice.actions;
export default slice.reducer;
