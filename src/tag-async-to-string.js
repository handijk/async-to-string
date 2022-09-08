import { asyncToString } from './async-to-string.js';

export const tagAsyncToString =
  (strings, ...promises) =>
  async ({ asyncToStringFn = asyncToString, ...rest } = {}) =>
    (
      await Promise.all(
        promises.map((item) => asyncToStringFn(item, { ...rest }))
      )
    )
      .reduce((acc, curr, i) => [...acc, curr, strings[i + 1]], [strings[0]])
      .join('');
