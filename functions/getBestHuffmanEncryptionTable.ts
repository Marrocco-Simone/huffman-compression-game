import { FrequencyTreeNode, getBestHuffmanTreeFromWord } from "./getBestHuffmanTreeFromWord";
import { left_branch_symbol, right_branch_symbol } from "./isStringBinaryCode";

export type EncryptionTable = { [letter: string]: string };

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

export function getBestHuffmanEncryptionTable(word: string): EncryptionTable {
  const huffman_tree = getBestHuffmanTreeFromWord(word);
  if (!huffman_tree) return {};
  const encryption_table: EncryptionTable = recHuffmanAnalysis(
    huffman_tree,
    {},
    ""
  );
  return encryption_table;
}