'use client';
import { Gutter } from '@/app/_components/atoms/gutter';
import Link from 'next/link';
import { Button } from './_components/atoms/button';
import { getCurrentStreak } from './_actions/word';
import { useEffect, useState } from 'react';
import { useApp } from './_hooks/use-app';

const WelcomeText: React.FC<{ text: string }> = ({ text }) => {
  const Text = text.split('').map((letter, idx) => {
    return (
      <span
        className="uppercase text-xl border border-white/50 w-12 h-12 flex justify-center items-center lg:text-4xl lg:w-16 lg:h-16"
        key={idx}
      >
        {letter}
      </span>
    );
  });

  return <section className="inline-flex justify-center items-center flex-wrap gap-4 ">{Text}</section>;
};

export default function Home() {
  const { fingerprint } = useApp();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getCurrentStreak(fingerprint).then((streak) => setStreak(streak));
  }, [fingerprint]);

  if (!fingerprint) return null;

  return (
    <Gutter className="space-y-4">
      <section className="flex flex-col justify-center items-center">
        <WelcomeText text="Welcome To Yordle!" />
      </section>
      <section className="flex flex-col justify-center items-center">
        <h2 className="text-center">You are on a {streak} streak!</h2>
        <Link href="/start">
          <Button className="text-2xl" variant="outline">
            Start Game
          </Button>
        </Link>
      </section>
    </Gutter>
  );
}
