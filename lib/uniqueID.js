'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function randomInt(range) {
  return Math.round(range * Math.random());
}

function randomStr(range) {
  return Math.round(randomInt(range)).toString(36);
}

// This prefix should ensure that id is unique across multiple
// web pages and sessions.
var ID_PREFIX = 'id-' + randomStr(9999) + '-' + Date.now().toString(36) + '-';

var seed = 0;

function uniqueID() {
  return ID_PREFIX + String(seed++);
}

exports.default = uniqueID;