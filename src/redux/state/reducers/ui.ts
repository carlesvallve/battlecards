import { createSlice, PayloadAction } from 'redux-starter-kit';

export type SceneID = 'title' | 'game' | 'over';
export type PopupOpts = {
  id: string;
  enabled: boolean;
  opts: any;
};

const slice = createSlice({
  initialState: {
    isLoading: false,
    scene: 'title' as SceneID,
    togglePopup: { id: '', enabled: false, opts: {} as any },
  },
  reducers: {
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
  togglePopup,
  showLoading,
  hideLoading,
} = slice.actions;
export default slice.reducer;
