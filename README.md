# json-superstring

The native `JSON.stringify()` method is quite fast, but it lacks safety checks for things like circular references and enumerable getter properties that throw errors.  The `json-superstring` module wraps `JSON.stringify()`, and includes safety checks for these potential issues.

__Table of Contents__

* [Usage](#usage)
* [API](#api)
* [Motivation](#motivation)
* [Performance](#performance)

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
// {"foo":{"a":"1","b":2,"bar":"[Circular]"}}
```

## API

### `jsonSuperstring(data [, space])`

Stringifies a value in the same manner as `JSON.stringify()`.  The key difference is circular references and getter properties that throw errors do not prevent stringification.

_Parameters_

* `data`: _(required)_ the data to stringify.

* `space`: _(optional)_ a `String` or `Number` object that's used to insert white space into the output JSON string for readability purposes.  If this is a `Number`, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10).  Values less than 1 indicate that no space should be used.  If this is a `String`, the string (or the first 10 characters of the string, if it's longer than that) is used as white space.  If this parameter is not provided (or is `null`), no white space is used.

_Returns_

A JSON string.

### `jsonSuperstring.merge(...data)`

Safely merges n-number of objects together.  The resulting object can be safely used with `JSON.stringify()`.

_Parameters_

* `...data`: _(required)_ n-number of objects to merge.

_Returns_

An object.

## Motivation

There are a number of other safe JSON stringifiers out there, and they all provide some variation of performance and features.  The goals of this project are:

1. Best in class [performance](#performance).

2. Safety checks for both circular references and getter properties that errors.

3. No side effects.  Objects passed to `json-stringify` are not modified.

4. Provide ability to specify space param, consistent with `JSON.stringify()`'s functionality.

5. Provide ability to merge multiple objects together and stringify.

### Comparison

| Name                   | White Space | Circular Check | Error Check | No Side Effects |
|------------------------|-------------|----------------|-------------|-----------------|
| __`json-superstring`__ | ✔           | ✔              | ✔           | ✔               |
| `fast-safe-stringify`  | ✕           | ✔              | ✕           | ✕               |
| `json-stringify-safe`  | ✔           | ✔[*]           | ✕           | ✔               |
| `safe-json-stringify`  | ✕           | ✔[*][**]       | ✔           | ✕               |

[*] Does not check for circular references when calling an object's `toJSON()` method.

[**] While `safe-json-stringify` performs circular reference checks, it marks all duplicate object references in a JSON object as `[Circular]` regardless of whether they are actual circular references.

## Performance

Performance metrics should always be taken with a healthy level of skepticism.  Different software performs differently as the parameters change, and as the state of the host environment changes.

Moreover, not all software provides the same functionality.  As demonstrated in the [Comparison](#comparison) table above, that is the case with `json-superstring`, and other safe JSON stringifiers.

The goal here is to show that `json-superstring`'s performance is comparable with other libraries while providing a broader set of features.

Benchmark reports are generated using [`radargun`](https://www.npmjs.com/package/radargun), and built using data from 1 million runs of each utility.

__circular.bench.js__

```
┌─────────────────────┬─────────────┬─────────────┬─────────────┐
│ NAME                │ AVG         │ MIN         │ MAX         │
╞═════════════════════╪═════════════╪═════════════╪═════════════╡
│ json-superstring    │ 7582 ns     │ 5666 ns     │ 1794442 ns  │
├─────────────────────┼─────────────┼─────────────┼─────────────┤
│ fast-safe-stringify │ 8810 ns     │ 6216 ns     │ 3692754 ns  │
├─────────────────────┼─────────────┼─────────────┼─────────────┤
│ json-stringify-safe │ 10928 ns    │ 6397 ns     │ 16823572 ns │
├─────────────────────┼─────────────┼─────────────┼─────────────┤
│ safe-json-stringify │ 8231 ns     │ 4597 ns     │ 12536094 ns │
└─────────────────────┴─────────────┴─────────────┴─────────────┘
```

__throws.bench.js__

```
┌─────────────────────┬─────────────┬─────────────┬─────────────┐
│ NAME                │ AVG         │ MIN         │ MAX         │
╞═════════════════════╪═════════════╪═════════════╪═════════════╡
│ json-superstring    │ 9626 ns     │ 6157 ns     │ 7036140 ns  │
├─────────────────────┼─────────────┼─────────────┼─────────────┤
│ safe-json-stringify │ 13183 ns    │ 8427 ns     │ 12135604 ns │
└─────────────────────┴─────────────┴─────────────┴─────────────┘
```

__merge.bench.js__

```
┌──────────────────┬────────────┬────────────┬────────────┐
│ NAME             │ AVG        │ MIN        │ MAX        │
╞══════════════════╪════════════╪════════════╪════════════╡
│ json-superstring │ 9443 ns    │ 6137 ns    │ 5428283 ns │
└──────────────────┴────────────┴────────────┴────────────┘
```
