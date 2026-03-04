import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  tab: 'main';
}

const initialState: NavigationState = {
  tab: 'main',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<'main'>) => {
      state.tab = action.payload;
    },
  },
});

export const { setTab } = navigationSlice.actions;
export default navigationSlice.reducer;
