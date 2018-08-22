'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _SUPPORTED_STYLES;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _numberRange = require('./numberRange');

var _numberRange2 = _interopRequireDefault(_numberRange);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLASS_NAME_PREFIX = 'DocsCustomStyleSheet';

var BACKGROUND_COLOR = 'background-color';
var BACKGROUND_COLOR_VALUES = ['#FCE5CD'];

var FONT_SIZE = 'font-size';
var FONT_SIZE_VALUES = (0, _numberRange2.default)(16, 80).map(function (n) {
  return n + 'pt';
});

var LINE_HEIGHT = 'line-height';
var LINE_HEIGHT_VALUES = (0, _numberRange2.default)(1.10, 3, 0.05).map(function (n) {
  return String(n);
});

var TEXT_ALIGN = 'text-align';
var TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

// https://www.npmjs.com/package/color
// https://stackoverflow.com/questions/3849115/image-palette-reduction
// https://stackoverflow.com/questions/7650703/web-safe-colour-generator-or-algorithm
var SUPPORTED_STYLES = (_SUPPORTED_STYLES = {}, (0, _defineProperty3.default)(_SUPPORTED_STYLES, BACKGROUND_COLOR, new _set2.default(BACKGROUND_COLOR_VALUES)), (0, _defineProperty3.default)(_SUPPORTED_STYLES, FONT_SIZE, new _set2.default(FONT_SIZE_VALUES)), (0, _defineProperty3.default)(_SUPPORTED_STYLES, LINE_HEIGHT, new _set2.default(LINE_HEIGHT_VALUES)), (0, _defineProperty3.default)(_SUPPORTED_STYLES, TEXT_ALIGN, new _set2.default(TEXT_ALIGN_VALUES)), _SUPPORTED_STYLES);

function escapeCSSChars(className) {
  return className.replace(/[^a-zA-Z_0-9-]/g, '_-');
  // return className.replace(/[^a-zA-Z_0-9-]/g, '\\$&');
}

function buildClassName(styleName, styleValue) {
  var suffix = escapeCSSChars(styleValue);
  return CLASS_NAME_PREFIX + '-' + styleName + '-' + suffix;
}

function getClassName(styleName, styleValue) {
  var styleValues = SUPPORTED_STYLES[styleName];
  if (!styleValues) {
    return null;
  }

  if (styleName === BACKGROUND_COLOR) {
    styleValue = (0, _color2.default)(styleValue).hex();
  }

  if (styleValues.has(styleValue)) {
    return buildClassName(styleName, styleValue);
  }

  return null;
}

function getCSSTexts() {
  var cssTexts = [];
  (0, _keys2.default)(SUPPORTED_STYLES).forEach(function (styleName) {
    var styleValues = SUPPORTED_STYLES[styleName];
    styleValues.forEach(function (styleValue) {
      var suffix = escapeCSSChars(styleValue);
      var className = buildClassName(styleName, styleValue);
      cssTexts.push('.' + className + ' {' + styleName + ': ' + styleValue + ';}');
    });
  });
  return cssTexts.join('\n');
}

var DocsCustomStyleSheet = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsCustomStyleSheet, _React$PureComponent);

  function DocsCustomStyleSheet() {
    (0, _classCallCheck3.default)(this, DocsCustomStyleSheet);
    return (0, _possibleConstructorReturn3.default)(this, (DocsCustomStyleSheet.__proto__ || (0, _getPrototypeOf2.default)(DocsCustomStyleSheet)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsCustomStyleSheet, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var id = 'DocsCustomStyleSheet';
      var el = document.getElementById(id) || document.createElement('style');
      if (el.parentElement) {
        return;
      }
      el.id = id;
      el.appendChild(document.createTextNode(getCSSTexts()));
      var parent = document.head || document.body;
      parent && parent.appendChild(el);
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);
  return DocsCustomStyleSheet;
}(_react2.default.PureComponent);

DocsCustomStyleSheet.BACKGROUND_COLOR = BACKGROUND_COLOR;
DocsCustomStyleSheet.getClassName = getClassName;
exports.default = DocsCustomStyleSheet;