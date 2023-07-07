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

function getHuffmanTree(random_world: string) {
  type FrequencyTreeNode = {
    letter?: string;
    frequency: number;
    left?: FrequencyTreeNode;
    right?: FrequencyTreeNode;
  };
  const sortByFrequency = (a: FrequencyTreeNode, b: FrequencyTreeNode) => {
    return a.frequency - b.frequency;
  };

  const frequencies = getFrequencies(random_world);
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

  return queue.shift();
}

export default function Home() {
  const [random_world, setRandomWorld] = useState("");
  // * otherwise server and client render different words and nextjs bothers
  useEffect(() => setRandomWorld(getRandomWorld()), [setRandomWorld]);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  // load only on client, should be deleted later on
  useEffect(() => {
    setEdges([
      {
        id: "1->2",
        source: "n-1",
        target: "n-2",
        label: "Edge 1-2",
      },
    ]);
    setNodes([
      {
        id: "n-1",
        label: "1",
      },
      {
        id: "n-2",
        label: "2",
      },
    ]);
  }, []);

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

  function loadHuffmanTree() {
    const huffmanTree = getHuffmanTree(random_world);
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
        <button onClick={() => console.log(getHuffmanTree(random_world))}>
          Check
        </button>
      </div>
      {nodes.length > 0 && edges.length > 0 && (
        <div
          style={{
            border: "solid 1px black",
            height: "100vh",
            width: "30%",
            position: "relative",
          }}
        >
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            layoutType="treeTd2d"
            animated={false}
          />
        </div>
      )}
    </main>
  );
}
