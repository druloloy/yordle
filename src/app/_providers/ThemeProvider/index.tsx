'use client';

import React, { useEffect, useReducer } from 'react';
import ThemeContext, { Theme } from './context';
import ThemeReducer, { ThemeAction } from './reducer';

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const systemTheme =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'light';

  const initialState = {
    theme: (typeof window !== 'undefined' ? (localStorage.__theme as Theme) : '') || systemTheme,
  };

  const [state, dispatch] = useReducer(ThemeReducer, initialState);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialState.theme);
  }, [initialState.theme]);

  const setTheme = (theme: Theme) => {
    dispatch({ type: `SET_${theme.toUpperCase()}` } as ThemeAction);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        setTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
