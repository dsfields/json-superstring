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


function copy(data, stack) {
  if (typeof data !== 'object' || data === null) return data;

  const isArray = Array.isArray(data);
  const result = (isArray) ? [] : {};

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
        val = copy(val, stack);
        stack.pop();
      }
    }

    if (isArray) result.push(val);
    else result[key] = val;
  }

  return result;
}


//
// MODULE INTERFACE
//


function stringify(data, space) {
  const result = copy(data, []);
  if (!space) return JSON.stringify(result);
  return JSON.stringify(result, null, space);
}


module.exports = stringify;
