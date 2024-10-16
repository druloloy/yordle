'use client';

import { useEffect, useState } from 'react';
import AppProviderContext from './context';
import type { ResultType } from 'yordle';
import { checkIsSolved, getTries } from '@/app/_actions/word';

interface Props {
  children: React.ReactNode;
}

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [fingerprint, setFingerprint] = useState<string>('');
  const [entries, setEntries] = useState<Array<ResultType>>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  /**Load fingerprint  */
  useEffect(() => {
    const storedFingerprint = window?.localStorage?.getItem('fingerprint');
    const newFingerprint = storedFingerprint || crypto.randomUUID();
    setFingerprint(newFingerprint);
    window?.localStorage?.setItem('fingerprint', newFingerprint);
  }, []);

  /** Load Entries */
  useEffect(() => {
    getTries(fingerprint).then((tries) => setEntries(tries));
  }, [fingerprint]);

  useEffect(() => {
    checkIsSolved(fingerprint).then((isSolved) => setIsSolved(isSolved));
  }, [fingerprint, entries]);

  return (
    <AppProviderContext.Provider
      value={{
        fingerprint,
        entries,
        setEntries,
        isSolved,
      }}
    >
      {children}
    </AppProviderContext.Provider>
  );
};
