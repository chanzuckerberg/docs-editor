"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// @overflow

function numberRange(from, to, increment) {
  if (increment && Math.round(increment) !== increment) {
    // increment has decimal, need to fix the float point adding issue.
    var scale = 100000;
    var range = numberRange(from * scale, to * scale, increment * scale);
    return range.map(function (n) {
      return Math.round(n) / scale;
    });
  }

  var result = [];
  var min = from;
  var max = to;
  var delta = increment || 1;
  while (min <= max) {
    result.push(min);
    min += delta;
  }
  var last = result.pop();
  if (last !== undefined) {
    result.push(last);
    if (last < max) {
      result.push(max);
    }
  }
  return result;
}

exports.default = numberRange;