import { createSlice, PayloadAction } from 'redux-starter-kit';
import { NavState, SceneID, PopupOpts } from 'src/types/customTypes';

const slice = createSlice({
  initialState: {
    isLoading: false,
    scene: 'title' as SceneID,
    navState: 'none',
    togglePopup: { id: '', enabled: false },
  },

  reducers: {
    setNavState: (state, { payload }: PayloadAction<NavState>) => {
      state.navState = payload;
    },
    selectScene: (state, { payload }: PayloadAction<SceneID>) => {
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
  setNavState,
  togglePopup,
  showLoading,
  hideLoading,
} = slice.actions;
export default slice.reducer;
