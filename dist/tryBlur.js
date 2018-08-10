'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tryBlur(obj) {
  if (obj && typeof obj.blur === 'function') {
    try {
      obj.blur();
    } catch (ex) {
      (0, _warn2.default)(ex);
    }
  }
}

exports.default = tryBlur;