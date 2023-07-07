import { letters } from "./getRandomWord";

export function getFrequencies(word: string) {
  const frequencies: {
    [letter: string]: number;
  } = {};

  for (const key of letters) {
    frequencies[key] = 0;
  }

  for (const letter of word.split("")) {
    if (frequencies[letter] == null)
      throw new Error("In random word there is a never seen letter");

    frequencies[letter]++;
  }

  return frequencies;
}
