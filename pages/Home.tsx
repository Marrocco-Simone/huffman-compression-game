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

  const [encrypted_word, setEncryptedWord] = useState("");

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

  function getHuffmanEncryptionTable(): EncryptionTable {
    const huffmanTree = getHuffmanTree(random_world);
    if (!huffmanTree) return {};
    const encryption_table: EncryptionTable = recHuffmanAnalysis(
      huffmanTree,
      {},
      ""
    );
    return encryption_table;
  }

  function getHuffmanEncryptedWord() {
    const encryption_table = getHuffmanEncryptionTable();
    const random_world_splitted = random_world.split("");
    const encrypted_word_splitted: string[] = [];
    for (const letter of random_world_splitted) {
      encrypted_word_splitted.push(encryption_table[letter]);
    }
    const encrypted_word = encrypted_word_splitted.join("");
    return encrypted_word;
  }

  // TODO doesnt work yet
  function decryptWord(encrypted_word: string): string {
    const huffmanTree = getHuffmanTree(random_world);
    if (!huffmanTree) return "";

    const encrypted_word_splitted = encrypted_word.split("");
    let dectypted_word = "";

    let current_node = huffmanTree;
    for (const binary of encrypted_word_splitted) {
      if (binary === "1") current_node = current_node.left!;
      else if (binary === "0") current_node = current_node.right!;
      // TODO check before for ambiguity and other symbols in encrypted_word

      if (current_node.letter) {
        dectypted_word += current_node.letter;
        current_node = huffmanTree;
      }
    }

    return dectypted_word;
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
        <button
          onClick={() => {
            setEncryptedWord(decryptWord(getHuffmanEncryptedWord()));
            alert(random_world === decryptWord(getHuffmanEncryptedWord()));
          }}
        >
          Check
        </button>
      </div>
      {encrypted_word}
      <TreeVisualizer random_world={random_world} />
    </main>
  );
}
