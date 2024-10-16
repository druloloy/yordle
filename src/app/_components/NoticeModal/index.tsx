'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../atoms/alert-dialog';
import { ResultType } from 'yordle';
import { useEffect, useState } from 'react';

type Props = {
  entries: ResultType[];
  isSolved: boolean;
  word: string;
};

export function NoticeModal({ entries, isSolved, word }: Props) {
  const [openNotice, setOpenNotice] = useState(isSolved || entries.length === 6);

  useEffect(() => {
    if (isSolved || entries.length === 6) {
      setOpenNotice(true);
    }
  }, [isSolved, entries]);
  const closeNotice = () => {
    setOpenNotice(false);
  };

  if ((isSolved || entries.length === 6) && !word) {
    return null;
  }

  return (
    <div>
      <AlertDialog open={openNotice}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSolved
                ? 'You got lucky this time!'
                : !isSolved && entries.length === 6
                  ? 'I know you tried, but you are not good enough.'
                  : 'Start guessing!'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSolved
                ? 'Wait for the next 24 hours for a new word.'
                : !isSolved && entries.length === 6
                  ? `The word was: ${word}. Wait for the next 24 hours for a new word.`
                  : 'You have 24 hours before the word changes.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => closeNotice()}>Ok!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
