/* eslint-disable @typescript-eslint/no-explicit-any */

export type JSONableValue =
  | null
  | boolean
  | string
  | number
  | JSONableValue[]
  | { [key: string]: JSONableValue };

export const isJSONable = (value: any): value is JSONableValue => {
  return isJSONableImpl(value, []);
};

const isJSONableImpl = (
  value: any,
  objects: object[]
): value is JSONableValue => {
  switch (typeof value) {
    case 'boolean':
      return true;
    case 'string':
      return true;
    case 'number':
      return !Number.isNaN(value);
    case 'object': {
      // null
      if (value === null) {
        return true;
      }
      // cyclic object
      if (objects.indexOf(value) !== -1) {
        return false;
      }
      objects.push(value);
      // array
      if (Array.isArray(value)) {
        return value.every((element) => isJSONableImpl(element, objects));
      }
      // object
      const prototype = Object.getPrototypeOf(value);
      if (prototype === null || prototype === Object.prototype) {
        return Object.values(value).every((value) =>
          isJSONableImpl(value, objects)
        );
      }
      return false;
    }
    default:
      return false;
  }
};

/* eslint-enable @typescript-eslint/no-explicit-any */
