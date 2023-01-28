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
  test('array', () => {
    expect(isJSONable([null, true, 'foo', 42])).toBe(true);
  });
  test('array/nested', () => {
    expect(isJSONable(['foo', ['bar', 'baz']])).toBe(true);
  });
  test('array/cyclic/tail', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any[] = ['foo'];
    value.push(value);
    expect(isJSONable(value)).toBe(false);
  });
  test('array/cyclic/head', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any[] = ['foo'];
    value.unshift(value);
    expect(isJSONable(value)).toBe(false);
  });
  test('array/cyclic/middle', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any[] = ['foo'];
    value.push(value, 'baz');
    expect(isJSONable(value)).toBe(false);
  });
});
