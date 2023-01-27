/* eslint-disable @typescript-eslint/no-explicit-any */

export type JSONableValue =
  | null
  | boolean
  | string
  | number
  | JSONableValue[]
  | { [key: string]: JSONableValue };

export const isJSONable = (value: any): value is JSONableValue => {
  return false;
};

/* eslint-enable @typescript-eslint/no-explicit-any */
