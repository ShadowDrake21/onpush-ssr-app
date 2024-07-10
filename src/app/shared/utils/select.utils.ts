export const generateItemsCount = (num: number): number[] => {
  let arr: number[] = [];

  for (let i = 1; i <= num; i++) {
    arr.push(i);
  }

  return arr;
};
