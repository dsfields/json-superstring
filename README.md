# json-superstring

The native `JSON.stringify()` method is quite fast, but it lacks safety checks for things like circular references and enumerable getter properties that throw errors.  The `json-superstring` module wraps `JSON.stringify()`, and includes safety checks for these potential issues.

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

* `jsonSuperstring(data [, space])`: stringifies a value in the same manner as `JSON.stringify()`, but prevents circular reference errors.

  _Parameters_

  + `data`: _(required)_ the data to stringify.

  + `space`: _(optional)_ a `String` or `Number` object that's used to insert white space into the output JSON string for readability purposes.  If this is a `Number`, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10).  Values less than 1 indicate that no space should be used.  If this is a `String`, the string (or the first 10 characters of the string, if it's longer than that) is used as white space.  If this parameter is not provided (or is `null`), no white space is used.

## Motivation

There are a number of other safe JSON stringifiers out there, and they all provide some variation of performance and features.  The goals of this project are:

1. Best in class [performance](#performance).

2. Safety checks for both circular references and getter properties that errors.

3. No side effects.  Objects passed to `json-stringify` are not modified.

4. Provide ability to specify space param, consistent with `JSON.stringify()`'s functionality.

5. Provide ability to merge multiple objects together and stringify.

### Comparison

| Name                   | Performance | White Space | Circular Check | Error Check | No Side Effects |
|------------------------|-------------|-------------|----------------|-------------|-----------------|
| __`json-superstring`__ | #1          | ✔           | ✔              | ✔           | ✔               |
| `fast-safe-stringify`  | #4          | ✕           | ✔              | ✕           | ✕               |
| `json-stringify-safe`  | #3          | ✔           | ✔[*]           | ✕           | ✔               |
| `safe-json-stringify`  | #2          | ✕           | ✔[*][**]       | ✔           | ✕               |

[*] Does not check for circular references when calling an object's `toJSON()` method.

[**] While `safe-json-stringify` performs circular reference checks, it marks all duplicate object references in a JSON object as `[Circular]` regardless if whether or not they are actual circular references.

## Performance

The `json-stringify` module is very fast compared to other safe JSON stringifiers.

```
┌─────────────────────┬────────────┬────────────┬────────────┐
│ NAME                │ AVG        │ MIN        │ MAX        │
╞═════════════════════╪════════════╪════════════╪════════════╡
│ json-superstring    │ 6766 ns    │ 5096 ns    │ 630665 ns  │
├─────────────────────┼────────────┼────────────┼────────────┤
│ fast-safe-stringify │ 9094 ns    │ 6922 ns    │ 1511836 ns │
├─────────────────────┼────────────┼────────────┼────────────┤
│ json-stringify-safe │ 8738 ns    │ 6295 ns    │ 1755434 ns │
├─────────────────────┼────────────┼────────────┼────────────┤
│ safe-json-stringify │ 6807 ns    │ 4546 ns    │ 4177514 ns │
└─────────────────────┴────────────┴────────────┴────────────┘
```
