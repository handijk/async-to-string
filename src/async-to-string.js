const safeSymbol = Symbol('async-to-string safe symbol');

export const asyncToString = async (
  item,
  { args = [], encode, ...rest } = {}
) => {
  if (typeof item?.[Symbol.asyncIterator] === 'function') {
    let finalValue = null;
    for await (const value of item) {
      finalValue = value;
    }
    return asyncToString(finalValue, { args: [...args], encode, ...rest });
  } else if (typeof item === 'function') {
    return asyncToString(item(...args), { args: [...args], encode, ...rest });
  } else if (item?.then) {
    return asyncToString(await item, { args: [...args], encode, ...rest });
  } else if (item?.[safeSymbol]) {
    return asyncToString(item[safeSymbol], { args: [...args], ...rest });
  } else if (typeof item === 'string') {
    return encode ? encode(item) : item;
  } else if (typeof item?.[Symbol.iterator] === 'function') {
    return item.reduce(
      async (acc, curr) =>
        `${await acc}${await asyncToString(curr, {
          args: [...args],
          encode,
          ...rest,
        })}`,
      ''
    );
  } else if (item === undefined || item === null || item === false) {
    return '';
  } else {
    return typeof item?.toString === 'function' ? item.toString() : '';
  }
};

export const safeString = (string) => ({
  [safeSymbol]: string,
});

export const unsafeString = (safeString) => safeString[safeSymbol];
