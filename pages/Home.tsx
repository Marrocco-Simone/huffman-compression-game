import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import TreeVisualizer from "../components/TreeVisualizer";
import { getRandomWord, letters } from "../functions/getRandomWord";
import { getFrequencies } from "../functions/getFrequencies";
import { EncryptionTable } from "../functions/getBestHuffmanEncryptionTable";
import { isStringBinaryCode } from "../functions/isStringBinaryCode";
import { getHuffmanTreeFromTable } from "../functions/getHuffmanTreeFromTable";
import { decryptWord } from "../functions/decryptWord";
import { getBestHuffmanEncryptedWord } from "../functions/getBestHuffmanEncryptedWord";

export default function Home() {
  const [random_word, setRandomWord] = useState("");
  // * otherwise server and client render different words and nextjs bothers
  useEffect(() => setRandomWord(getRandomWord()), [setRandomWord]);

  const [encrypted_word, setEncryptedWord] = useState("");
  const [user_encryption_word, setUserEncryptionWord] = useState("");
  const [user_encryption_table, setUserEncryptionTable] =
    useState<EncryptionTable>({});

  function getFrequenciesElements() {
    const frequencies = getFrequencies(random_word);
    const elements: React.ReactNode[] = [];

    for (const letter of letters) {
      elements.push(
        <label key={letter} className={styles.letter_description}>
          {letter}:{frequencies[letter]}
          <input
            required
            value={user_encryption_table[letter] ?? ""}
            onChange={(e) => {
              const new_encoding = e.target.value;
              if (!isStringBinaryCode(new_encoding)) return;

              setUserEncryptionTable((old_table) => {
                return { ...old_table, [letter]: new_encoding };
              });
            }}
          />
        </label>
      );
    }

    return elements;
  }

  function checkEncryption() {
    if (!isStringBinaryCode(user_encryption_word)) return;

    let user_huffman_tree;
    try {
      user_huffman_tree = getHuffmanTreeFromTable(user_encryption_table);
    } catch (e) {
      alert(e);
      return;
    }
    const user_decrypted_word = decryptWord(
      user_encryption_word,
      user_huffman_tree
    );

    const best_encrypted_word = getBestHuffmanEncryptedWord(random_word);

    console.log(
      user_decrypted_word,
      random_word,
      user_decrypted_word === random_word
    );
    console.log(
      user_encryption_word.length,
      best_encrypted_word.length,
      user_encryption_word.length === best_encrypted_word.length
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.random_word}>
        Random Word:
        <input readOnly value={random_word} />
        <button onClick={() => setRandomWord(getRandomWord())}>
          Get new word
        </button>
      </div>

      <form
        className={styles.random_word}
        onSubmit={(e) => {
          e.preventDefault();
          checkEncryption();
        }}
      >
        <div className={styles.frequencies}>
          {getFrequenciesElements()}
        </div>
        Put here your encrypted word:
        <input
          required
          value={user_encryption_word}
          onChange={(e) => {
            const new_encoding = e.target.value;
            setUserEncryptionWord(new_encoding);
          }}
        />
        <button type="submit">Check</button>
      </form>
      <p>{encrypted_word}</p>
      <TreeVisualizer word={random_word} />
    </main>
  );
}
