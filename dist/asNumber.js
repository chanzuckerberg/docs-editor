'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asNumber(value) {
  (0, _invariant2.default)(typeof value === 'number' && !isNaN(value), 'not a number');
  return value;
}

exports.default = asNumber;