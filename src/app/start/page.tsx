'use client';
import React, { useEffect } from 'react';
import { Yordle } from 'yordle';
import { GuessTray } from '../_components/GuessTray';
import { useApp } from '../_hooks/use-app';
import { createWord, getCurrentWord } from '../_actions/word';
import { NoticeModal } from '../_components/NoticeModal';

export type TryType = { [key: string]: 'exact' | 'wrong' | 'exists' }[];

export default function Start() {
  const { entries, isSolved, fingerprint } = useApp();

  const [unavailableLetters, setUnavailableLetters] = React.useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = React.useState<string[]>([]);
  const [givenWord, setGivenWord] = React.useState<string>('');

  useEffect(() => {
    if (isSolved || entries.length === 6) {
      getCurrentWord(fingerprint).then((word) => {
        setGivenWord(word);
      });
    }
  }, [isSolved, entries, fingerprint]);

  useEffect(() => {
    async function init() {
      if (!fingerprint) return;

      const word = await createWord(fingerprint);
      const yordle = new Yordle(word);
      yordle.loadEntries(entries);

      setUnavailableLetters(Array.from(yordle.unavailableLetters));
      setAvailableLetters(Array.from(yordle.availableLetters));
    }

    init();
  }, [entries, fingerprint]);

  return (
    <>
      <section className="w-full h-full flex flex-col lg:flex-row justify-center items-center">
        <section className="px-8 flex flex-col gap-4 items-center justify-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <GuessTray key={index} disabled={index !== entries.length || isSolved} value={entries[index]} />
          ))}
        </section>
        <section className="w-full lg:max-w-48 flex flex-col gap-2 items-center justify-center p-4">
          <p className="text-md font-thin text-primary underline">Wrong Letters</p>
          <section className="w-full flex-wrap flex flex-row gap-2 items-center justify-center">
            {unavailableLetters.map((letter, i) => (
              <span key={i} className="uppercase text-xs lg:text-md font-bold text-red-600 text-center">
                {letter}
              </span>
            ))}
          </section>
          <p className="text-md font-thin text-primary underline">Possible Letters</p>
          <section className="w-full flex-wrap flex flex-row gap-2 items-center justify-center">
            {availableLetters.map((letter, i) => (
              <span key={i} className="uppercase text-xs lg:text-md font-bold text-blue-600 text-center">
                {letter}
              </span>
            ))}
          </section>
        </section>
      </section>
      <NoticeModal isSolved={isSolved} entries={entries} word={givenWord} />
    </>
  );
}
