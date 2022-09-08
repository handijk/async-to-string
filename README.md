# async-to-string

Turn every (async or sync) value into a string by calling `asyncToString` or by creating a tag function.

- [Installation](#installation)
- [Method usage](#method usage)
- [Tag usage](#tag usage)

## Installation

```
npm i async-to-string
```

## Method usage

Any value passed into the `asyncToString` method will be converted into a string.

```js
import { asyncToString } from 'async-to-string';

console.log(await asyncToString(1)); // -> '1'
console.log(await asyncToString(null)); // -> ''
```

Promise values will be awaited and the result will be passed into the `asyncToString` method and returned.

```js
import { asyncToString } from 'async-to-string';

console.log(await asyncToString(Promise.resolve(1))); // -> '1'
```

Async iterables will be looped and the last yield will be passed into the `asyncToString` method and returned.

```js
import { asyncToString } from 'async-to-string';

async function* generate() {
  yield 1;
  yield 2;
  yield 3;
}

console.log(await asyncToString(generate())); // -> '3'
```

Iterables will be joined together after every value was be passed into the `asyncToString` method.

```js
import { asyncToString } from 'async-to-string';

async function* generate() {
  yield 1;
  yield 2;
  yield 3;
}

const list = [1, Promise.resolve(2), generate()];

console.log(await asyncToString(list)); // -> '123'
```

Even methods can be passed in, they will be called and their return value will be passed into the `asyncToString` method before being returned.

```js
import { asyncToString } from 'async-to-string';

async function* generate() {
  yield 1;
  yield 2;
  yield 3;
}

console.log(await asyncToString(generate)); // -> '3'
```

An optional `args` iterable can be provided in the second options argument, it's items will be used as the arguments for calling any methods.

```js
import { asyncToString } from 'async-to-string';

console.log(await asyncToString((x, y) => x + y, { args: [6, 3] })); // -> '9'
```

Values will be passed on recursively so deeply nested hierarchies will all be turned into a single string.

```js
import { asyncToString } from 'async-to-string';

console.log(
  await asyncToString(
    [
      Promise.resolve(1),
      [(x, y) => x + y, Promise.resolve(['string', (x, y) => x - y])],
    ],
    { args: [6, 3] }
  )
); // -> '19string3'
```

If string encoding is required an `encode` option can be provided as method for instance to generate html safe strings.

```js
import { asyncToString } from 'async-to-string';
import { encode } from 'html-entities';

console.log(await asyncToString('< > " \' &', { encode })); // -> '&lt; &gt; &quot; &apos; &amp;'
```

To exclude a string from being encoded it can be marked as "safe".

```js
import { asyncToString, safeString } from 'async-to-string';
import { encode } from 'html-entities';

console.log(
    await asyncToString([
      '< > " \' &',
      safeString('< > " \' &'),
    ]
    { encode }
  )
); // -> '&lt; &gt; &quot; &apos; &amp;< > " \' &'
```

# Tag usage

The factory method `TagAsyncToString` takes the options that `asyncToString` also uses as the only argument and returns the tag function.

```js
import { TagAsyncToString } from 'async-to-string';

const myTag = TagAsyncToString({ /* asyncToString options can be provided here */ });

console.log(
  await myTag`This is some string with an ${Promise.resolve('async replacement')}`
)
); // -> 'This is some string with an async replacement'
```

All values that `asyncToString` will convert to strings can be used as placeholders

```js
import { TagAsyncToString } from 'async-to-string';

const myTag = TagAsyncToString({ args: [6, 3] });

console.log(
  await myTag`This is some string with an ${Promise.resolve('async replacement')}
Just showing off: ${[(x, y) => x + y, Promise.resolve(['string', (x, y) => x - y])]}`
);
// -> 'This is some string with an async replacement
// -> 'Just showing off: 19string3'
```
