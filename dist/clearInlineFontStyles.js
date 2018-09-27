'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = clearInlineFontStyles;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeFontStyles(el) {
  var style = el.style;
  if (style) {
    style.fontSize = '';
    style.fontWeight = '';
    style.lineHeight = '';
    style.color = '';
  }
}

function clearInlineFontStyles(el) {
  removeFontStyles(el);
  var all = el.querySelectorAll('*');
  (0, _from2.default)(all).forEach(removeFontStyles);
}