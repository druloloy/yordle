import React from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: Theme;
}

const ThemeContext = React.createContext<ThemeContextValue>({} as ThemeContextValue);

export default ThemeContext;
