import { getFrequencies } from "./getFrequencies";
import { letters } from "./getRandomWord";

// TODO enforce that you can either have letter or left/right
// TODO frequency may not be strictly necessary
export type FrequencyTreeNode = {
  letter?: string;
  frequency: number;
  left?: FrequencyTreeNode;
  right?: FrequencyTreeNode;

  id: number;
  parent?: number;
};

export function getBestHuffmanTreeFromWord(word: string) {
  const sortByFrequency = (a: FrequencyTreeNode, b: FrequencyTreeNode) => {
    return a.frequency - b.frequency;
  };

  const frequencies = getFrequencies(word);
  const queue: FrequencyTreeNode[] = [];
  let id = 42;
  for (const letter of letters) {
    if (frequencies[letter] == null)
      throw new Error("In random word there is a never seen letter");

    queue.push({
      letter,
      frequency: frequencies[letter],
      id,
    });

    id++;
  }
  queue.sort(sortByFrequency);

  while (queue.length > 1) {
    const z1 = queue.shift();
    const z2 = queue.shift();
    if (!z1 || !z2) break;

    z1.parent = z2.parent = id;
    queue.push({
      frequency: z1.frequency + z2.frequency,
      left: z1,
      right: z2,
      id,
    });

    id++;
  }

  return queue.shift();
}
