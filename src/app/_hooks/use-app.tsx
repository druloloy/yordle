import React from 'react';
import AppProviderContext from '../_providers/AppProvider/context';

export const useApp = () => {
  return React.useContext(AppProviderContext);
};
