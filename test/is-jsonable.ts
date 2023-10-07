import { isJSONable } from '~/lib/is-jsonable';

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
  test('symbol', () => {
    expect(isJSONable(Symbol.iterator)).toBe(false);
  });
  test('function', () => {
    expect(isJSONable(() => 'foo')).toBe(false);
  });
  test('array', () => {
    expect(isJSONable([null, true, 'foo', 42])).toBe(true);
  });
  test('array/nested', () => {
    expect(isJSONable(['foo', ['bar', 'baz']])).toBe(true);
  });
  test('array/same_array', () => {
    const array = ['foo', 'bar'];
    expect(isJSONable([array, array])).toBe(true);
  });
  test('array/same_object', () => {
    const object = { foo: 'foo' };
    expect(isJSONable([object, object])).toBe(true);
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
  test('object', () => {
    expect(isJSONable({ foo: 'foo', bar: 'bar' })).toBe(true);
  });
  test('object/empty', () => {
    expect(isJSONable({})).toBe(true);
    // eslint-disable-next-line no-new-object
    expect(isJSONable(new Object())).toBe(true);
    expect(isJSONable(Object.create(null))).toBe(true);
  });
  test('object/nested', () => {
    expect(isJSONable({ foo: { bar: 'baz' } })).toBe(true);
  });
  test('object/cyclic', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any = {};
    value['self'] = value;
    expect(isJSONable(value)).toBe(false);
  });
  test('object/symbol_key', () => {
    const symbol = Symbol();
    expect(isJSONable({ [symbol]: 'foo' })).toBe(true);
  });
  test('array/same_array', () => {
    const array = ['foo', 'bar'];
    expect(isJSONable({ foo: array, bar: array })).toBe(true);
  });
  test('object/same_object', () => {
    const object = { foo: 'foo' };
    expect(isJSONable({ bar: object, baz: object })).toBe(true);
  });
  test('class', () => {
    class Foo {}
    expect(isJSONable(new Foo())).toBe(false);
  });
});
