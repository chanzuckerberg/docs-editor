'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _warn = require('./warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tryFindDOMNode(component) {
  try {
    return _reactDom2.default.findDOMNode(component);
  } catch (ex) {
    (0, _warn2.default)(ex);
    return null;
  }
}

exports.default = tryFindDOMNode;