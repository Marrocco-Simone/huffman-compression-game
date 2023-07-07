import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import TreeVisualizer from "../components/TreeVisualizer";
import { getRandomWorld, letters } from "../functions/getRandomWorld";
import { FrequencyTreeNode, getHuffmanTree } from "../functions/getHuffmanTree";
import { getFrequencies } from "../functions/getFrequencies";

const left_branch_symbol = "1";
const right_branch_symbol = "0";
function isStringBinaryCode(s: string) {
  // const regex = /^[01]*$/;
  const regex = new RegExp(`^[${left_branch_symbol}${right_branch_symbol}]*$`);
  return regex.test(s);
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
      current_decode + left_branch_symbol
    );
    const right_encryption_table = recHuffmanAnalysis(
      node.right,
      encryption_table,
      current_decode + right_branch_symbol
    );
    return { ...left_encryption_table, ...right_encryption_table };
  }

  console.error({ node, encryption_table, current_decode });
  throw new Error("How did you get here?");
}

function getHuffmanEncryptionTable(random_world: string): EncryptionTable {
  const huffman_tree = getHuffmanTree(random_world);
  if (!huffman_tree) return {};
  const encryption_table: EncryptionTable = recHuffmanAnalysis(
    huffman_tree,
    {},
    ""
  );
  return encryption_table;
}

function getHuffmanEncryptedWord(random_world: string) {
  const encryption_table = getHuffmanEncryptionTable(random_world);
  const random_world_splitted = random_world.split("");
  const encrypted_word_splitted: string[] = [];
  for (const letter of random_world_splitted) {
    encrypted_word_splitted.push(encryption_table[letter]);
  }
  const encrypted_word = encrypted_word_splitted.join("");
  return encrypted_word;
}

const ambiguous_encoding_msg = "Encoding is ambiguous!";
const incomplete_tree_msg = "Tree has empty paths!";
function getHuffmanTreeFromTable(
  encryption_table: EncryptionTable
): FrequencyTreeNode {
  let id = 42;
  const huffman_tree: FrequencyTreeNode = {
    frequency: 0, // ? could delete
    id,
  };
  id++;

  let current_node = huffman_tree;
  for (const letter of Object.keys(encryption_table)) {
    const encryption_path = encryption_table[letter].split("");
    // * go to the leaf, creating the way if not existing
    for (const path of encryption_path) {
      // * we have a letter in this node, but we need to go further. We have something like a=1 and b=11
      if (current_node.letter) {
        throw new Error(ambiguous_encoding_msg);
      }
      if (path === left_branch_symbol) {
        if (!current_node.left) {
          current_node.left = { frequency: 0, id };
          id++;
        }
        current_node = current_node.left;
        continue;
      }
      if (path === right_branch_symbol) {
        if (!current_node.right) {
          current_node.right = { frequency: 0, id };
          id++;
        }
        current_node = current_node.right;
        continue;
      }
    }

    // * insert letter in leaf
    if (current_node.letter) {
      // * we already have another letter in this leaf
      throw new Error(ambiguous_encoding_msg);
    }
    current_node.letter = letter;
    current_node = huffman_tree;
  }

  // * check tree has no empty leaf or path that doesn't lead to a leaf
  const queue = [huffman_tree];
  while (queue.length > 0) {
    current_node = queue.shift()!;
    if (
      // * node has only one path
      (current_node.right && !current_node.left) ||
      (current_node.left && !current_node.right) ||
      // * node has both or neither paths and is a leaf
      (current_node.left && current_node.right && current_node.letter) ||
      (!current_node.left && !current_node.right && !current_node.letter)
    )
      throw new Error(incomplete_tree_msg);

    if (current_node.right && current_node.left) {
      queue.push(current_node.right);
      queue.push(current_node.left);
    }
  }

  return huffman_tree;
}

function decryptWord(
  encrypted_word: string,
  huffman_tree: FrequencyTreeNode
): string {
  const encrypted_word_splitted = encrypted_word.split("");
  let dectypted_word = "";

  let current_node = huffman_tree;
  for (const binary of encrypted_word_splitted) {
    if (binary === left_branch_symbol) current_node = current_node.left!;
    else if (binary === right_branch_symbol) current_node = current_node.right!;

    if (current_node.letter) {
      dectypted_word += current_node.letter;
      current_node = huffman_tree;
    }
  }

  return dectypted_word;
}

export default function Home() {
  const [random_world, setRandomWorld] = useState("");
  // * otherwise server and client render different words and nextjs bothers
  useEffect(() => setRandomWorld(getRandomWorld()), [setRandomWorld]);

  const [encrypted_word, setEncryptedWord] = useState("");
  const [user_encryption_word, setUserEncryptionWord] = useState("");
  const [user_encryption_table, setUserEncryptionTable] =
    useState<EncryptionTable>({});

  function getFrequenciesElements() {
    const frequencies = getFrequencies(random_world);
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
    const user_decrypted_word = decryptWord(user_encryption_word, user_huffman_tree);
    
    const best_encrypted_word = getHuffmanEncryptedWord(random_world);

    console.log(user_decrypted_word, random_world, user_decrypted_word === random_world)
    console.log(user_encryption_word.length, best_encrypted_word.length, user_encryption_word.length === best_encrypted_word.length)
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
      <form
        className={styles.random_world}
        onSubmit={(e) => {
          e.preventDefault();
          checkEncryption();
        }}
      >
        <div className={styles.frequencies}>{getFrequenciesElements()}</div>
        Put here your encrypted word:
        <input
          required
          value={user_encryption_word}
          onChange={(e) => {
            const new_encoding = e.target.value;
            if (!isStringBinaryCode(new_encoding)) return;
            setUserEncryptionWord(new_encoding);
          }}
        />
        <button type="submit">Check</button>
      </form>
      <p>{encrypted_word}</p>
      <TreeVisualizer random_world={random_world} />
    </main>
  );
}
