'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function hadnleMatch(matched) {
  return matched[0] + '-' + matched[1].toLowerCase();
}

// converts `fooBar` to `foo-bar`.
function hyphenize(str) {
  return str.replace(/[a-z][A-Z]/g, hadnleMatch);
}

exports.default = hyphenize;