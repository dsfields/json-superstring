'use strict';

const fastSafeStringify = require('fast-safe-stringify');
const jsonStringifySafe = require('json-stringify-safe');
const safeJsonStringify = require('safe-json-stringify');

const jsonSuperstring = require('../lib');


bench(
  [
    {
      label: 'json-superstring',
      fn: function benchJsonSuperstring() {
        const value = {
          foo: {
            bar: 'baz',
            qux: 42,
            quux: {},
            corge: { grault: true },
            waldo: [],
          },
          blah: {},
        };
        value.foo.quux.quuz = value.foo;
        value.foo.garply = value.foo.corge;
        value.foo.waldo.push(value.foo);
        value.blah.huh = value.blah;

        jsonSuperstring(value);
      },
    },
    {
      label: 'fast-safe-stringify',
      fn: function benchFastSafeStringify() {
        const value = {
          foo: {
            bar: 'baz',
            qux: 42,
            quux: {},
            corge: { grault: true },
            waldo: [],
          },
          blah: {},
        };
        value.foo.quux.quuz = value.foo;
        value.foo.garply = value.foo.corge;
        value.foo.waldo.push(value.foo);
        value.blah.huh = value.blah;

        fastSafeStringify(value);
      },
    },
    {
      label: 'json-stringify-safe',
      fn: function benchJsonStringifySafe() {
        const value = {
          foo: {
            bar: 'baz',
            qux: 42,
            quux: {},
            corge: { grault: true },
            waldo: [],
          },
          blah: {},
        };
        value.foo.quux.quuz = value.foo;
        value.foo.garply = value.foo.corge;
        value.foo.waldo.push(value.foo);
        value.blah.huh = value.blah;

        jsonStringifySafe(value);
      },
    },
    {
      label: 'safe-json-stringify',
      fn: function benchSafeJsonStringify() {
        const value = {
          foo: {
            bar: 'baz',
            qux: 42,
            quux: {},
            corge: { grault: true },
            waldo: [],
          },
          blah: {},
        };
        value.foo.quux.quuz = value.foo;
        value.foo.garply = value.foo.corge;
        value.foo.waldo.push(value.foo);
        value.blah.huh = value.blah;

        safeJsonStringify(value);
      },
    },
  ],
  { runs: 100000 }
);
