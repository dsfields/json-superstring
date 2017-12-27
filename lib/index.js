'use strict';

//
// CONSTANTS
//


const CIRCULAR = '[Circular]';
const ERR_OPEN = '[';
const ERR_SPEC = ': ';
const ERR_CLOSE = ']';


//
// SAFE COPIER
//


function copy(into, data, stack) {
  if (typeof data !== 'object' || data === null) return data;

  let result = into;

  if (result === null) {
    result = (Array.isArray(data))
      ? Array(data.length)
      : {};
  }

  for (const key in data) {
    let val;

    try {
      val = data[key];

      if (val !== null
        && typeof val !== 'undefined'
        && typeof val.toJSON === 'function'
      ) {
        val = val.toJSON();
      }
    } catch (err) {
      val = ERR_OPEN + err.name + ERR_SPEC + err.message + ERR_CLOSE;
    }

    if (typeof val === 'object') {
      if (stack.indexOf(val) > -1) {
        val = CIRCULAR;
      } else {
        stack.push(val);
        val = copy(null, val, stack);
        stack.pop();
      }
    }

    result[key] = val;
  }

  return result;
}


//
// STRINGIFY FUNCTION
//


function stringify(data, space) {
  const result = copy(null, data, [data]);
  if (!space) return JSON.stringify(result);
  return JSON.stringify(result, null, space);
}


//
// MERGE FUNCTION
//


function merge(...data) {
  if (data.length === 0) {
    throw new TypeError('At least one object is required');
  }

  let result = null;

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    result = copy(result, d, [d]);
  }

  return result;
}


stringify.merge = merge;


module.exports = stringify;
