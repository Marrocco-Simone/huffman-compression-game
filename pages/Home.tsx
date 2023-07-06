import React, { useState } from "react";
import styles from "../styles/Home.module.css";

const letters = ["a", "b", "c", "d", "e"] as const;
const max_lenght = 50;

export default function Home() {
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

  const [random_world, setRandomWorld] = useState(getRandomWorld());

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
        <p key={letter}>
          {letter}:{frequencies[letter]}
          {"■".repeat(frequencies[letter])}
        </p>
      );
    }

    return elements;
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
    </main>
  );
}
