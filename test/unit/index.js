'use strict';

const { assert } = require('chai');

const jsonStringify = require('../../lib');


const date = new Date(267210300000);
const dateStr = date.toISOString();


describe('json-superstring', function() {

  describe('#stringify', function() {
    it('stringifies with spaces when option provided', function() {
      const result = jsonStringify({ foo: 'bar' }, 1);
      assert.strictEqual(result, '{\n "foo": "bar"\n}');
    });

    it('does not flag null with [Circular]', function() {
      const result = jsonStringify({ foo: null, bar: null });
      assert.strictEqual(result, '{"foo":null,"bar":null}');
    });

    it('does not flag non-objects as [Circular]', function() {
      const result = jsonStringify({ foo: 42, bar: 42 });
      assert.strictEqual(result, '{"foo":42,"bar":42}');
    });

    it('does not flag arrays as [Circular]', function() {
      const result = jsonStringify({ foo: [42], bar: [42] });
      assert.strictEqual(result, '{"foo":[42],"bar":[42]}');
    });

    it('does not flag dates as [Circular]', function() {
      const result = jsonStringify({ foo: date, bar: date });
      assert.strictEqual(result, `{"foo":"${dateStr}","bar":"${dateStr}"}`);
    });

    it('flags circular references of root with [Circular]', function() {
      const data = {
        foo: 42,
      };
      data.bar = data;
      const result = jsonStringify(data);
      assert.strictEqual(result, '{"foo":42,"bar":"[Circular]"}');
    });

    it('flags nested, circular references with [Circular]', function() {
      const data = {
        foo: { a: '1' },
      };
      data.foo.bar = data.foo;

      const result = jsonStringify(data);
      assert.strictEqual(result, '{"foo":{"a":"1","bar":"[Circular]"}}');
    });

    it('does not flag seen object references with [Circular]', function() {
      const data = {
        foo: { a: '1' },
      };
      data.bar = data.foo;

      const result = jsonStringify(data);
      assert.strictEqual(result, '{"foo":{"a":"1"},"bar":{"a":"1"}}');
    });

    it('flags seen deeply nested object references with [Circular]', function() {
      const data = {
        foo: 'hello world',
        bar: 42,
        baz: {
          qux: true,
        },
      };
      data.baz.quux = data.baz;

      const result = jsonStringify(data);
      const expected = '{"foo":"hello world","bar":42,"baz":{"qux":true,"quux":"[Circular]"}}';
      assert.strictEqual(result, expected);
    });

    it('flags getter props with [Error]', function() {
      const data = {};
      Object.defineProperty(data, 'bar', {
        enumerable: true,
        get: function () { throw new Error('Hi'); },
      });

      const result = jsonStringify(data);
      const val = '{"bar":"[Error: Hi]"}';
      assert.strictEqual(result, val);
    });
  });


  describe('#merge', function() {
    it('throws if no data provided', function() {
      assert.throws(() => {
        jsonStringify.merge();
      }, TypeError);
    });

    it('merges two objects, a has circular reference, b has error', function() {
      const a = { foo: 1 };
      a.bar = a;

      const b = {};
      Object.defineProperty(b, 'baz', {
        enumerable: true,
        get: function () { throw new Error('Hi'); },
      });

      const result = jsonStringify.merge(a, b);
      const expected = {
        foo: 1,
        bar: '[Circular]',
        baz: '[Error: Hi]',
      };

      assert.deepEqual(result, expected);

      assert.doesNotThrow(() => {
        JSON.stringify(result);
      });
    });

    it('merges an array into an object', function() {
      const a = { foo: 1 };
      a.bar = a;

      const b = [a];

      const result = jsonStringify.merge(a, b);
      const expected = {
        foo: 1,
        bar: '[Circular]',
        0: { foo: 1, bar: '[Circular]' },
      };

      assert.deepEqual(result, expected);

      assert.doesNotThrow(() => {
        JSON.stringify(result);
      });
    });

    it('merges an object into an array', function() {
      const aval = { foo: 1 };
      aval.bar = aval;
      const a = [aval];

      const b = {};
      Object.defineProperty(b, 'baz', {
        enumerable: true,
        get: function () { throw new Error('Hi'); },
      });

      const result = jsonStringify.merge(a, b);
      const expected = [{
        foo: 1,
        bar: '[Circular]',
      }];
      expected.baz = '[Error: Hi]';

      assert.deepEqual(result, expected);

      assert.doesNotThrow(() => {
        JSON.stringify(result);
      });
    });

    it('merges two arrays', function() {
      const a = [42];

      const b0 = { foo: 1 };
      b0.bar = b0;

      const b1 = {};
      Object.defineProperty(b1, 'baz', {
        enumerable: true,
        get: function () { throw new Error('Hi'); },
      });

      const b = [b0, b1];

      const result = jsonStringify.merge(a, b);
      const expected = [
        {
          foo: 1,
          bar: '[Circular]',
        },
        {
          baz: '[Error: Hi]',
        },
      ];

      assert.deepEqual(result, expected);

      assert.doesNotThrow(() => {
        JSON.stringify(result);
      });
    });
  });

});
