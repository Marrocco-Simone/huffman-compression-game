import { getBestHuffmanEncryptionTable } from "./getBestHuffmanEncryptionTable";

export function getBestHuffmanEncryptedWord(word: string) {
  const encryption_table = getBestHuffmanEncryptionTable(word);
  const word_splitted = word.split("");
  const encrypted_word_splitted: string[] = [];
  for (const letter of word_splitted) {
    encrypted_word_splitted.push(encryption_table[letter]);
  }
  const encrypted_word = encrypted_word_splitted.join("");
  return encrypted_word;
}
