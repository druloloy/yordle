'use server';
import Session, { Sessions } from '@/database/models/Session';
import { WordBank, Yordle } from 'yordle';
import dayjs from 'dayjs';
import connectToDatabase from '@/database';

/**
 * Verifies a given word against the user's current wordle
 * @param word The word to verify
 * @param fingerprint The user's fingerprint
 * @returns An object with the result of the verification and a boolean indicating whether the user has solved the wordle
 */
export async function verifyWord(word: string, fingerprint: string) {
  await connectToDatabase();
  const session: Sessions | null = await Session.findOne({ fingerprint });

  if (!session) {
    return {
      result: null,
      isSolved: false,
    };
  }

  if (session.solved) {
    return {
      result: null,
      isSolved: true,
    };
  }

  const yordle = new Yordle(session.word);
  const guess = yordle.guess(word);
  const isSolved = word === session.word || session.solved;
  const streak = isSolved
    ? session.streak + 1
    : !isSolved && Array.isArray(session.tries) && session.tries?.length >= 5
      ? 0
      : session.streak;

  await session.updateOne({
    tries: session?.tries && session.tries.concat([guess]),
    solved: isSolved,
    solvedAt: isSolved ? new Date() : null,
    streak,
  });

  return {
    result: guess,
    isSolved: isSolved || false,
  };
}

/**
 * Generates a new word and associates it with the given fingerprint. If the user has already solved a word and it's a new day, generate a new word. Otherwise, return the existing word.
 * @param fingerprint The fingerprint that identifies the user
 * @returns The new word
 */
export async function createWord(fingerprint: string) {
  await connectToDatabase();
  const session: Sessions | null = await Session.findOne({ fingerprint });

  if (!session) {
    const newWord = WordBank.draw();

    await Session.create({
      fingerprint,
      word: newWord,
    });

    return newWord;
  }

  if (dayjs().isAfter(dayjs(session.wordGivenAt), 'day')) {
    const newWord = WordBank.draw();

    await Session.updateOne(
      {
        fingerprint,
      },
      {
        $set: {
          word: newWord,
          tries: [],
          solved: false,
          solvedAt: null,
          wordGivenAt: new Date(),
        },
      }
    );

    return newWord;
  }

  return session.word;
}

/**
 * Gets the list of tries for the given fingerprint
 * @param fingerprint The fingerprint identifying the user
 * @returns An array of tries, or an empty array if none are found
 */

export async function getTries(fingerprint: string) {
  await connectToDatabase();
  const session: Sessions | null = await Session.findOne({ fingerprint });
  return session?.tries || [];
}

/**
 * Checks if the wordle puzzle is solved for the given fingerprint.
 * @param fingerprint The fingerprint identifying the user
 * @returns A boolean indicating whether the puzzle is solved
 */
export async function checkIsSolved(fingerprint: string) {
  await connectToDatabase();
  const session: Sessions | null = await Session.findOne({ fingerprint });
  return session?.solved || false;
}

/**
 * Retrieves the current word associated with the given fingerprint.
 * @param fingerprint The fingerprint identifying the user
 * @returns A string representing the current word, or an empty string if none is found
 */
export async function getCurrentWord(fingerprint: string) {
  await connectToDatabase();

  const session: Sessions | null = await Session.findOne({ fingerprint });
  return session?.word || '';
}

/**
 * Retrieves the current streak associated with the given fingerprint.
 * @param fingerprint The fingerprint identifying the user
 * @returns The current streak value, or 0 if none is found
 */
export async function getCurrentStreak(fingerprint: string) {
  await connectToDatabase();
  const session: Sessions | null = await Session.findOne({ fingerprint });
  return session?.streak || 0;
}
