import { asyncToString, safeString } from './async-to-string.js';

export const TagAsyncToString =
  ({ asyncToStringFn = asyncToString, ...rest } = {}) =>
  async (strings, ...promises) =>
    (
      await Promise.all(
        promises.map((item) => asyncToStringFn(item, { ...rest }))
      )
    )
      .reduce((acc, curr, i) => [...acc, curr, strings[i + 1]], [strings[0]])
      .join('');

export const TagAsyncToSafeString = ({
  safeStringFn = safeString,
  ...rest
} = {}) => {
  const tagAsyncToString = TagAsyncToString({ ...rest });
  return async (...args) => safeStringFn(await tagAsyncToString(...args));
};
