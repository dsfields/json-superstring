# json-superstring

The native `JSON.stringify()` method is quite fast, but it lacks safety checks for things like circular references and getter properties that throw errors.  The `json-superstring` module wraps `JSON.stringify()`, and includes safety checks for these potentials issues.

## Usage

Add `json-superstring` as a dependency in `package.json`:

```sh
$ npm install json-superstring -S
```

Then simply call `json-superstring`...

```js
const jsonSuperstring = require('json-superstring');

const data = {
  foo: {
    a: '1',
    b: 2
  }
};
data.foo.bar = data.foo;

console.log(jsonSuperstring(data));
// prints: {"foo":{"a":"1","b":2,"bar":"[Circular]"}}
```

## API

  * `jsonSuperstring(data [, options])`:
    Stringifies a value in the same manner as `JSON.stringify()`, but prevents circular reference errors.

    Parameters include:

      + `data`: _(required)_ the data to stringify.

      + `options`: _(optional)_ an object to customize various behavioral aspects of `json-superstring`.  Keys include:

        - `space`: _(optional)_ a `String` or `Number` to pass as `JSON.stringify()`'s `space` parameter.  Defaults to `undefined`.

        - `checkProps` _(optional)_ a `Boolean` indicating whether or not `json-superstring` should perform safety checks on getter properties.  Only enable if absolutely necessary, as this check requires an additional pass over all keys on an object.  Not all use cases require this check, and leaving it turned off can dramatically improve performance.  Defaults to `false`.

## Motivation

There are a number of safe JSON stringify modules out there, and this module has drawn inspiration from them (primarily [`safe-json-stringify`](https://www.npmjs.com/package/safe-json-stringify)).  However, the bulk of them focus on ensuring compatibility with the broadest set of legacy browsers as possible.  This module is focused on usage within Node.js, and, so, can take advantage of a number of various structures in ECMA Script 2015 that significantly boost performance without working about legacy browser support.
