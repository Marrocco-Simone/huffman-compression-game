import { EncryptionTable } from "./getBestHuffmanEncryptionTable";
import { FrequencyTreeNode } from "./getBestHuffmanTreeFromWord";
import { left_branch_symbol, right_branch_symbol } from "./isStringBinaryCode";

const ambiguous_encoding_msg = "Encoding is ambiguous!";
const incomplete_tree_msg = "Tree has empty paths!";
export function getHuffmanTreeFromTable(
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