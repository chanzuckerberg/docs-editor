'use strict';

/**
 * modified from keyMirror in fbjs/lib
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
function keyMirror(obj) {
  var ret = {};
  var key = void 0;
  if (!(obj instanceof Object) || Array.isArray(obj)) {
    throw 'keyMirror(...): Argument must be an object.';
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
}

module.exports = keyMirror;