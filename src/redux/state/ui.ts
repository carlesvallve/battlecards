import { createSlice, PayloadAction } from 'redux-starter-kit';

export type SceneID = 'title' | 'game' | 'over';
export type PopupOpts = {
  id: string;
  enabled: boolean;
  opts: any;
};

const slice = createSlice({
  initialState: {
    loading: false,
    scene: 'mapUpgrade' as SceneID,
    togglePopup: { id: '', enabled: false, opts: {} as any },
    autoSpin: false,
    animating: false,
  },
  reducers: {
    selectScene: (state, { payload }: PayloadAction<SceneID>) => {
      if (state.animating) return;
      state.scene = payload;
    },
    togglePopup: (state, { payload }: PayloadAction<PopupOpts>) => {
      state.togglePopup = payload;
    },
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  selectScene,
  togglePopup,
  showLoading,
  hideLoading,
} = slice.actions;
export default slice.reducer;
