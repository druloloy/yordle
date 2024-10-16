'use client';
import ThemeContext, { Theme } from '@/app/_providers/ThemeProvider/context';
import React from 'react';

export const useTheme = () => {
  const { theme, setTheme: _setTheme, systemTheme } = React.useContext(ThemeContext);
  const toggleTheme = () => {
    if (theme === 'light') {
      _setTheme('dark');
    } else if (theme === 'dark') {
      _setTheme('light');
    }
  };

  const setTheme = (theme: Theme | 'system') => {
    if (theme === 'system') {
      _setTheme(systemTheme);
    } else {
      _setTheme(theme);
    }
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
