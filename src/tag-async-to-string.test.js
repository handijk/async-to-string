import { describe, test, expect, jest } from '@jest/globals';
import { tagAsyncToString } from './tag-async-to-string.js';

describe('async to string', () => {
  test('string', async () => {
    expect(
      await tagAsyncToString`Hallo ${Promise.resolve(
        'Bert'
      )}, waarom heb jij die bril op?`()
    ).toBe('Hallo Bert, waarom heb jij die bril op?');
  });

  test('override the asyncToString function', async () => {
    const asyncToStringFn = jest.fn();
    asyncToStringFn.mockReturnValueOnce('Henk');
    expect(
      await tagAsyncToString`Hallo ${Promise.resolve(
        'Bert'
      )}, waarom heb jij die bril op?`({ asyncToStringFn })
    ).toBe('Hallo Henk, waarom heb jij die bril op?');
  });
});
