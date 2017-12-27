'use strict';

const jsonSuperstring = require('../lib');

const a = { foo: 42 };
a.bar = a;

const b = { baz: 'ta da' };
Object.defineProperty(b, 'qux', {
  enumerable: true,
  get: function () { throw new Error('Hi'); },
});

bench(
  [
    {
      label: 'json-superstring',
      fn: jsonSuperstring.merge,
      params: [a, b],
    },
  ],
  { runs: 1000000 }
);
