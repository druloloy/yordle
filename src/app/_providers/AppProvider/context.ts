import React, { Dispatch, SetStateAction } from 'react';
import type { ResultType } from 'yordle';

export interface AppProviderValue {
  fingerprint: string;
  entries: ResultType[];
  setEntries: Dispatch<SetStateAction<ResultType[]>>;
  isSolved: boolean;
}

const AppProviderContext = React.createContext<AppProviderValue>({} as AppProviderValue);

export default AppProviderContext;
