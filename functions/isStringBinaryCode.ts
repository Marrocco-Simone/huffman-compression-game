export const left_branch_symbol = "1";
export const right_branch_symbol = "0";
export function isStringBinaryCode(s: string) {
  // const regex = /^[01]*$/;
  const regex = new RegExp(`^[${left_branch_symbol}${right_branch_symbol}]*$`);
  return regex.test(s);
}