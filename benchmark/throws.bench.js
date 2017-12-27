'use strict';

const safeJsonStringify = require('safe-json-stringify');

const jsonSuperstring = require('../lib');


bench(
  [
    {
      label: 'json-superstring',
      fn: function benchJsonSuperstring() {
        const value = {
          foo: 42,
        };
        Object.defineProperty(value, 'bar', {
          enumerable: true,
          get: function () { throw new Error('Hi'); },
        });

        jsonSuperstring(value);
      },
    },
    {
      label: 'safe-json-stringify',
      fn: function benchSafeJsonStringify() {
        const value = {
          foo: 42,
        };
        Object.defineProperty(value, 'bar', {
          enumerable: true,
          get: function () { throw new Error('Hi'); },
        });

        safeJsonStringify(value);
      },
    },
  ],
  { runs: 1000000 }
);
