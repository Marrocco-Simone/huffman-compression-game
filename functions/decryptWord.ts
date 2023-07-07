import { FrequencyTreeNode } from "./getBestHuffmanTreeFromWord";
import { left_branch_symbol, right_branch_symbol } from "./isStringBinaryCode";

export function decryptWord(
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
