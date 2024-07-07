import { SelectItem } from 'primeng/api';

export const generateItemsCount = (num: number): SelectItem[] => {
  let arr: SelectItem[] = [];

  for (let i = 1; i <= num; i++) {
    arr.push({ label: `${i}`, value: i });
  }

  return arr;
};
