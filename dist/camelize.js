"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function hadnleMatch(_, char) {
  return char.toUpperCase();
}

// converts `foo-bar` to `fooBar`.
function camelize(str) {
  return str.replace(/[_.-](\w|$)/g, hadnleMatch);
}

exports.default = camelize;