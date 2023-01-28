/* eslint-disable @typescript-eslint/no-explicit-any */

export type JSONableValue =
  | null
  | boolean
  | string
  | number
  | JSONableValue[]
  | { [key: string]: JSONableValue };

export const isJSONable = (value: any): value is JSONableValue => {
  switch (typeof value) {
    case 'boolean':
      return true;
    case 'string':
      return true;
    case 'number':
      return !Number.isNaN(value);
    case 'object':
      if (value === null) {
        return true;
      }
      return false;
    default:
      return false;
  }
};

/* eslint-enable @typescript-eslint/no-explicit-any */
