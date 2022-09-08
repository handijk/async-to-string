import { describe, test, expect, jest } from '@jest/globals';
import { unsafeString } from './async-to-string.js';
import {
  TagAsyncToString,
  TagAsyncToSafeString,
} from './tag-async-to-string.js';

describe('async to string', () => {
  test('string', async () => {
    const tag = TagAsyncToString();
    expect(
      await tag`Hallo ${Promise.resolve('Bert')}, waarom heb jij die bril op?`
    ).toBe('Hallo Bert, waarom heb jij die bril op?');
  });

  test('override the asyncToString function', async () => {
    const asyncToStringFn = jest.fn();
    const tag = TagAsyncToString({ asyncToStringFn });
    asyncToStringFn.mockReturnValueOnce('Henk');
    expect(
      await tag`Hallo ${Promise.resolve('Bert')}, waarom heb jij die bril op?`
    ).toBe('Hallo Henk, waarom heb jij die bril op?');
  });

  test('safe string', async () => {
    const tag = TagAsyncToSafeString();
    expect(
      unsafeString(
        await tag`Hallo ${Promise.resolve('Bert')}, waarom heb jij die bril op?`
      )
    ).toBe('Hallo Bert, waarom heb jij die bril op?');
  });

  test('override the safeString function', async () => {
    const safeStringFn = jest.fn();
    const tag = TagAsyncToSafeString({ safeStringFn });
    safeStringFn.mockReturnValueOnce('Henk');
    expect(
      await tag`Hallo ${Promise.resolve('Bert')}, waarom heb jij die bril op?`
    ).toBe('Henk');
  });
});
