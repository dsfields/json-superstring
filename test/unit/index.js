'use strict';

const { assert } = require('chai');

const jsonStringify = require('../../lib');


const date = new Date(267210300000);
const dateStr = date.toISOString();


describe('json-superstring', () => {

  it('stringifies with spaces when option provided', (done) => {
    const result = jsonStringify({ foo: 'bar' }, 1);
    assert.strictEqual(result, '{\n "foo": "bar"\n}');
    done();
  });

  it('does not flag null with [Circular]', (done) => {
    const result = jsonStringify({ foo: null, bar: null });
    assert.strictEqual(result, '{"foo":null,"bar":null}');
    done();
  });

  it('does not flag non-objects as [Circular]', (done) => {
    const result = jsonStringify({ foo: 42, bar: 42 });
    assert.strictEqual(result, '{"foo":42,"bar":42}');
    done();
  });

  it('does not flag arrays as [Circular]', (done) => {
    const result = jsonStringify({ foo: [42], bar: [42] });
    assert.strictEqual(result, '{"foo":[42],"bar":[42]}');
    done();
  });

  it('does not flag dates as [Circular]', (done) => {
    const result = jsonStringify({ foo: date, bar: date });
    assert.strictEqual(result, `{"foo":"${dateStr}","bar":"${dateStr}"}`);
    done();
  });

  it('flags nested, circular references with [Circular]', (done) => {
    const data = {
      foo: { a: '1' },
    };
    data.foo.bar = data.foo;

    const result = jsonStringify(data);
    assert.strictEqual(result, '{"foo":{"a":"1","bar":"[Circular]"}}');
    done();
  });

  it('does not flag seen object references with [Circular]', (done) => {
    const data = {
      foo: { a: '1' },
    };
    data.bar = data.foo;

    const result = jsonStringify(data);
    assert.strictEqual(result, '{"foo":{"a":"1"},"bar":{"a":"1"}}');
    done();
  });

  it('flags seen deeply nested object references with [Circular]', (done) => {
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
    done();
  });

  it('flags getter props with [Error]', (done) => {
    const data = {};
    Object.defineProperty(data, 'bar', {
      enumerable: true,
      get: function () { throw new Error('Hi'); },
    });

    const result = jsonStringify(data);
    const val = '{"bar":"[Error: Hi]"}';
    assert.strictEqual(result, val);
    done();
  });

});
