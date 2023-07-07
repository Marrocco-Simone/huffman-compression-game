export const letters = ["a", "b", "c"] as const;
export const max_lenght = 10;

export function getRandomNumber(max: number, min = 0) {
  return Math.floor(Math.random() * max) + min;
}

export function getRandomWorld() {
  let s = "";
  for (let i = 0; i < max_lenght; i++) {
    s += letters[getRandomNumber(letters.length)];
  }
  return s;
}