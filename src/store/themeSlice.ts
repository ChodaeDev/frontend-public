import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeState = {
  darkMode: boolean;
};

const initialState: ThemeState = {
  darkMode: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    initTheme: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          state.darkMode = savedTheme === 'dark';
        } else {
          state.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});

export const { toggleTheme, setTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
