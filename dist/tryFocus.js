'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tryFocus(obj, resumeSelection) {
  if (obj) {
    try {
      obj.focus(resumeSelection);
    } catch (ex) {
      (0, _warn2.default)(ex);
    }
  }
}

exports.default = tryFocus;