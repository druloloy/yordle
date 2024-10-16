import type { Theme } from './context';

export type ThemeAction = {
  type: 'SET_DARK' | 'SET_LIGHT' | 'SET_SYSTEM';
};

export type ThemeStateType = {
  theme: Theme;
};
type ThemeReducerType = (state: ThemeStateType, action: ThemeAction) => ThemeStateType;

const ThemeReducer: ThemeReducerType = (state, action) => {
  switch (action.type) {
    case 'SET_DARK': {
      document.documentElement.classList.replace('light', 'dark');
      localStorage.setItem('__theme', 'dark');
      return {
        ...state,
        theme: 'dark',
      };
    }
    case 'SET_LIGHT': {
      document.documentElement.classList.replace('dark', 'light');
      localStorage.setItem('__theme', 'light');
      return {
        ...state,
        theme: 'light',
      };
    }
    default: {
      return state;
    }
  }
};

export default ThemeReducer;
