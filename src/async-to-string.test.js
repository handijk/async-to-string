import { describe, test, expect, jest } from '@jest/globals';
import { asyncToString, safeString, unsafeString } from './async-to-string.js';

describe('async to string', () => {
  test('unsafe string', async () => {
    const encode = jest.fn();
    encode.mockReturnValueOnce('bert');
    expect(await asyncToString('henk', { encode })).toBe('bert');
    expect(encode).toBeCalledWith('henk');
  });

  test('safe string', async () => {
    const encode = jest.fn();
    encode.mockReturnValueOnce('bert');
    expect(unsafeString(safeString('henk'))).toBe('henk');
    expect(await asyncToString(safeString('henk'), { encode })).toBe('henk');
    expect(encode).not.toBeCalled();
  });

  test('number', async () => {
    expect(await asyncToString(2)).toBe('2');
  });

  test('undefined', async () => {
    expect(await asyncToString(undefined)).toBe('');
  });

  test('null', async () => {
    expect(await asyncToString(null)).toBe('');
  });

  test('false', async () => {
    expect(await asyncToString(false)).toBe('');
  });

  test('true', async () => {
    expect(await asyncToString(true)).toBe('true');
  });

  test('empty object', async () => {
    expect(await asyncToString({})).toBe('[object Object]');
  });

  test('empty object with no toString method', async () => {
    expect(await asyncToString({ toString: undefined })).toBe('');
  });

  test('string promise', async () => {
    expect(await asyncToString(Promise.resolve('henk'))).toBe('henk');
  });

  test('async iterable that yields a string value', async () => {
    async function* generateString() {
      yield 'henk';
    }

    expect(await asyncToString(generateString())).toBe('henk');
  });

  test('generator that yields a string value', async () => {
    const arg = Symbol();

    async function* generateString(input) {
      expect(input).toBe(arg);
      yield 'henk';
    }

    expect(await asyncToString(generateString, { args: [arg] })).toBe('henk');
  });

  test('array that yields all value types', async () => {
    const arg = Symbol();

    async function* generateString() {
      yield 'henk';
    }

    expect(
      await asyncToString(
        [
          'henk',
          safeString('henk'),
          2,
          undefined,
          null,
          false,
          true,
          {},
          Promise.resolve('henk'),
          generateString(),
          generateString,
        ],
        {
          args: [arg],
        }
      )
    ).toBe('henkhenk2true[object Object]henkhenkhenk');
  });
});
