import { isJSONable } from '../src/lib/is-jsonable';

describe('is-jsonable', () => {
  test('null', () => {
    expect(isJSONable(null)).toBe(true);
  });
  test('undefined', () => {
    expect(isJSONable(undefined)).toBe(false);
  });
  test('boolean/true', () => {
    expect(isJSONable(true)).toBe(true);
  });
  test('boolean/false', () => {
    expect(isJSONable(false)).toBe(true);
  });
  test('string', () => {
    expect(isJSONable('foo')).toBe(true);
  });
  test('number', () => {
    expect(isJSONable(42)).toBe(true);
  });
  test('number/NaN', () => {
    expect(isJSONable(Number.NaN)).toBe(false);
  });
});
