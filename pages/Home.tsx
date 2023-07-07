import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import TreeVisualizer from "../components/TreeVisualizer";
import { getRandomWorld, letters } from "../functions/getRandomWorld";
import { FrequencyTreeNode, getHuffmanTree } from "../functions/getHuffmanTree";
import { getFrequencies } from "../functions/getFrequencies";

export default function Home() {
  const [random_world, setRandomWorld] = useState("");
  // * otherwise server and client render different words and nextjs bothers
  useEffect(() => setRandomWorld(getRandomWorld()), [setRandomWorld]);

  const [computed_encryption, setComputedEncryption] = useState("");

  function getFrequenciesElements() {
    const frequencies = getFrequencies(random_world);
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

  function getHuffmanEncryption(): string {
    type EncryptionTable = { [letter: string]: string };
    function recHuffmanAnalysis(
      node: FrequencyTreeNode,
      encryption_table: EncryptionTable,
      current_decode: string
    ): EncryptionTable {
      if (!node) return encryption_table;

      if (node.letter) {
        return {
          ...encryption_table,
          [node.letter]: current_decode,
        };
      }

      if (node.left && node.right) {
        const left_encryption_table = recHuffmanAnalysis(
          node.left,
          encryption_table,
          current_decode + "0"
        );
        const right_encryption_table = recHuffmanAnalysis(
          node.right,
          encryption_table,
          current_decode + "1"
        );
        return { ...left_encryption_table, ...right_encryption_table };
      }

      console.error({ node, encryption_table, current_decode });
      throw new Error("How did you get here?");
    }

    const huffmanTree = getHuffmanTree(random_world);
    if (!huffmanTree) return "";
    const encryption_table: EncryptionTable = recHuffmanAnalysis(
      huffmanTree,
      {},
      ""
    );
    console.log(encryption_table);
    return "";
  }

  return (
    <main className={styles.main}>
      <div className={styles.random_world}>
        Random World:
        <input readOnly value={random_world} />
        <button onClick={() => setRandomWorld(getRandomWorld())}>
          Get new word
        </button>
      </div>
      <div className={styles.frequencies}>{getFrequenciesElements()}</div>
      <div className={styles.random_world}>
        Put here your encrypted word:
        <input typeof="number" />
        <button onClick={() => getHuffmanEncryption()}>Check</button>
      </div>
      {computed_encryption}
      <TreeVisualizer random_world={random_world} />
    </main>
  );
}
