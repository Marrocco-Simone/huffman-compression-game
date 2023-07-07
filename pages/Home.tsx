import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { GraphCanvasProps, GraphEdge, GraphNode } from "reagraph";
import dynamic from "next/dynamic";
const GraphCanvas = dynamic<GraphCanvasProps>(
  () => import("reagraph").then((x) => x.GraphCanvas),
  {
    ssr: false,
  }
);

const letters = ["a", "b", "c", "d", "e"] as const;
const max_lenght = 200;

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

function getFrequencies(random_world: string) {
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

// TODO enforce that you can either have letter or left/right
type FrequencyTreeNode = {
  letter?: string;
  frequency: number;
  left?: FrequencyTreeNode;
  right?: FrequencyTreeNode;

  id: number;
  parent?: number;
};
function getHuffmanTree(random_world: string) {
  const sortByFrequency = (a: FrequencyTreeNode, b: FrequencyTreeNode) => {
    return a.frequency - b.frequency;
  };

  const frequencies = getFrequencies(random_world);
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

export default function Home() {
  const [random_world, setRandomWorld] = useState("");
  // * otherwise server and client render different words and nextjs bothers
  useEffect(() => setRandomWorld(getRandomWorld()), [setRandomWorld]);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [computed_encryption, setComputedEncryption] = useState("");

  function getFrequenciesElement() {
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

  // ! THIS TREE DOES NOT SHOW CORRECTLY LEFT/RIGHT (EVEN IF THEY ARE ANALYZED IN CORRECT ORDER)
  function loadHuffmanTree() {
    const huffmanTree = getHuffmanTree(random_world);
    if (!huffmanTree) return;

    const queue: FrequencyTreeNode[] = [huffmanTree];
    const new_nodes: GraphNode[] = [];
    const new_edges: GraphEdge[] = [];

    while (queue.length > 0) {
      const new_node = queue.shift();
      if (!new_node) return;

      new_nodes.push({
        id: `${new_node.id}`,
        label: new_node.letter ?? "",
      });

      if (new_node.parent) {
        new_edges.push({
          id: `${new_node.parent}->${new_node.id}`,
          source: `${new_node.parent}`,
          target: `${new_node.id}`,
          label: `${new_node.parent}->${new_node.id}`,
        });
      }

      if (new_node.left) queue.push(new_node.left);
      if (new_node.right) queue.push(new_node.right);
    }

    setNodes(new_nodes);
    setEdges(new_edges);
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
          get new word
        </button>
      </div>
      <div className={styles.frequencies}>{getFrequenciesElement()}</div>
      <div className={styles.random_world}>
        Put here your encrypted word:
        <input typeof="number" />
        <button
          onClick={() => {
            loadHuffmanTree();
            getHuffmanEncryption();
          }}
        >
          Check
        </button>
      </div>
      {computed_encryption}
      {nodes.length > 0 && edges.length > 0 && (
        <div
          style={{
            border: "solid 1px black",
            height: "100vh",
            width: "100%",
            position: "relative",
          }}
        >
          <GraphCanvas nodes={nodes} edges={edges} layoutType="treeTd2d" />
        </div>
      )}
    </main>
  );
}
