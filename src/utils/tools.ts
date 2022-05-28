import type { StoreKeyValue } from '../interface';

export function slash(str: string) {
  return str.replace(/\\/g, '/');
}

export const filterProperty = (data: StoreKeyValue, keys: string[]) => {
  return Object.keys(data).reduce((res: StoreKeyValue, key) => {
    if (!keys.includes(key)) {
      res[key] = data[key];
    }

    return res;
  }, {});
};
