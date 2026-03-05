import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NavigationTab =
  | 'main'
  | 'about'
  | 'scj-info'
  | 'doctrine'
  | 'prevention'
  | 'withdrawal'
  | 'request';

interface NavigationState {
  tab: NavigationTab;
}

const initialState: NavigationState = {
  tab: 'main',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<NavigationTab>) => {
      state.tab = action.payload;
    },
  },
});

export type { NavigationTab };
export const { setTab } = navigationSlice.actions;
export default navigationSlice.reducer;
