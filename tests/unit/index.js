'use strict';

const assert = require('chai').assert;

const jsonStringify = require('../../lib');

const date = new Date(267210300000);
const dateStr = date.toISOString();

describe('json-superstring', () => {

  it('should throw if space not string or number', () => {
    assert.throws(() => {
      jsonStringify({ foo: 'bar' }, { space: {} });
    });
  });

  it('should throw if checkProps not Boolean', () => {
    assert.throws(() => {
      jsonStringify({ foo: 'bar' }, { checkProps: 42 });
    });
  });

  it('should stringify with spaces when option provided', (done) => {
    const result = jsonStringify({ foo: 'bar' }, { space: 1 });
    assert.strictEqual(result, '{\n "foo": "bar"\n}');
    done();
  });

  it('should not flag null with [Circular]', (done) => {
    const result = jsonStringify({ foo: null, bar: null });
    assert.strictEqual(result, '{"foo":null,"bar":null}');
    done();
  });

  it('should not flag non-objects as [Circular]', (done) => {
    const result = jsonStringify({ foo: 42, bar: 42 });
    assert.strictEqual(result, '{"foo":42,"bar":42}');
    done();
  });

  it('should not flag arrays as [Circular]', (done) => {
    const result = jsonStringify({ foo: [42], bar: [42] });
    assert.strictEqual(result, '{"foo":[42],"bar":[42]}');
    done();
  });

  it('should not flag dates as [Circular]', (done) => {
    const result = jsonStringify({ foo: date, bar: date });
    assert.strictEqual(result, `{"foo":"${dateStr}","bar":"${dateStr}"}`);
    done();
  });

  it('should flag nested, circular references with [Circular]', (done) => {
    const data = {
      foo: { a: '1' }
    };
    data.foo.bar = data.foo;

    const result = jsonStringify(data);
    assert.strictEqual(result, '{"foo":{"a":"1","bar":"[Circular]"}}');
    done();
  });

  it('should flag seen object references with [Circular]', (done) => {
    const data = {
      foo: { a: '1' }
    };
    data.bar = data.foo;

    const result = jsonStringify(data);
    assert.strictEqual(result, '{"foo":{"a":"1"},"bar":"[Circular]"}');
    done();
  });

  it('should flag getter props with {throws} when checkProps=true', (done) => {
    class Test {
      constructor() {
        this.foo = { a: 1 };
        Object.defineProperty(this, 'bar', { enumerable: true });
      }
    }

    const data = {};
    Object.defineProperty(data, 'bar', {
      enumerable: true,
      get: function () { throw new Error('Hi'); }
    });

    const result = jsonStringify(data, { checkProps: true });
    const val = '{"bar":{"throws":{"name":"Error","message":"Hi"}}}';
    assert.strictEqual(result, val);
    done();
  });

});
