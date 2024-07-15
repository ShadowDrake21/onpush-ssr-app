export const fromNumberToArr = (number: number): number[] => {
  return Array.from({ length: Math.round(number) }, (_, i) => i + 1);
};
