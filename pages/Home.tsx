import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const letters = ["a", "b", "c", "d", "e"] as const;
const max_lenght = 50;

function getRandomNumber(max: number, min = 0) {
  return Math.floor(Math.random() * max) + min;
}

function getRandomWorld() {
  let s = "";
  for (let i = 0; i < max_lenght; i++) {
    s += letters[getRandomNumber(letters.length)];
  }
  return s;
}

export default function Home() {
  const [random_world, setRandomWorld] = useState("");
  // * otherwise server and client render different words and nextjs bothers
  useEffect(() => setRandomWorld(getRandomWorld()), [setRandomWorld]);

  function getFrequencies() {
    const frequencies: {
      [letter: string]: number;
    } = {};

    for (const key of letters) {
      frequencies[key] = 0;
    }

    for (const letter of random_world.split("")) {
      if (frequencies[letter] == null)
        throw new Error("In random word there is a never seen letter");

      frequencies[letter]++;
    }

    return frequencies;
  }

  function getFrequenciesElement() {
    const frequencies = getFrequencies();
    const elements: React.ReactNode[] = [];

    for (const letter of letters) {
      elements.push(
        <p key={letter} className={styles.letter_description}>
          {letter}:{frequencies[letter]}
          <input type="number" />
        </p>
      );
    }

    return elements;
  }

  function getHuffmanTree() {
    type FrequencyTreeNode = {
      letter?: string;
      frequency: number;
      left?: FrequencyTreeNode;
      right?: FrequencyTreeNode;
    };
    const sortByFrequency = (a: FrequencyTreeNode, b: FrequencyTreeNode) => {
      return a.frequency - b.frequency;
    };

    const frequencies = getFrequencies();
    const queue: FrequencyTreeNode[] = [];
    for (const letter of letters) {
      if (frequencies[letter] == null)
        throw new Error("In random word there is a never seen letter");

      queue.push({
        letter,
        frequency: frequencies[letter],
      });
    }
    queue.sort(sortByFrequency);

    while (queue.length > 1) {
      const z1 = queue.shift();
      const z2 = queue.shift();
      if (!z1 || !z2) break;

      queue.push({
        frequency: z1.frequency + z2.frequency,
        left: z1,
        right: z2,
      });
    }

    console.log(queue);
    return queue.shift();
  }

  return (
    <main className={styles.main}>
      <div className={styles.random_world}>
        Random World:
        <input readOnly value={random_world} />
        <button onClick={() => setRandomWorld(getRandomWorld())}>
          get new word
        </button>
      </div>
      <div className={styles.frequencies}>{getFrequenciesElement()}</div>
      <div className={styles.random_world}>
        Put here your encripted word:
        <input typeof="number" />
        <button onClick={() => console.log(getHuffmanTree())}>Check</button>
      </div>
    </main>
  );
}
