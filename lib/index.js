'use strict';

const msg = {
  spaceType: 'Type of options.space must be string, number, or undefined',
  checkPropsType: 'Type of options.checkProps must be Boolean or undefined'
};

const getProp = function(obj, key) {
  try {
    return obj[key];
  } catch(err) {
    return {
      throws: {
        name: err.name,
        message: err.message,
        stackTrace: err.stackTrace,
        code: err.code
      }
    };
  }
};

const visit = function(data, seen, checkProps) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return data;
  if (seen.has(data)) return '[Circular]';

  seen.add(data);
  if (!checkProps) return data;

  const result = {};
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = getProp(data, key);
  }

  return result;
};

module.exports = function(data, options) {
  let space = undefined;
  let checkProps = false;

  if (typeof options === 'object' && options !== null) {
    const spaceT = typeof options.space;
    const checkPropsT = typeof options.checkProps;

    if (spaceT !== 'undefined') {
      if (spaceT !== 'string' && spaceT !== 'number') {
        throw new TypeError(msg.spaceType);
      }
      space = options.space;
    }

    if (checkPropsT !== 'undefined') {
      if (checkPropsT !== 'boolean') {
        throw new TypeError(msg.checkPropsType);
      }
      checkProps = options.checkProps;
    }
  }

  const seen = new Set();

  return JSON.stringify(data, (key, value) => {
    return visit(value, seen, checkProps);
  }, space);
};
