'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _createPaletteColors = require('./createPaletteColors');

var _createPaletteColors2 = _interopRequireDefault(_createPaletteColors);

var _getNearestColor = require('./getNearestColor');

var _getNearestColor2 = _interopRequireDefault(_getNearestColor);

var _hyphenize = require('./hyphenize');

var _hyphenize2 = _interopRequireDefault(_hyphenize);

var _numberRange = require('./numberRange');

var _numberRange2 = _interopRequireDefault(_numberRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STYLES_SHEET_ID = 'DocsCustomStyleMap';

var STYLE_KEY_PREFIX = 'DOCS_STYLE';

// Supported Custom Styles.
// These styles will be used at `convertFromHTML()`.
var BACKGROUND_COLOR_KEY = STYLE_KEY_PREFIX + '_BACKGROUND_COLOR';
var BACKGROUND_COLOR_VALUES = [(0, _color2.default)('#ffff00')].concat((0, _createPaletteColors2.default)(90, 90));

var FONT_SIZE_KEY = STYLE_KEY_PREFIX + '_FONT_SIZE';
var FONT_SIZE_VALUES = (0, _numberRange2.default)(4, 86);

var LINE_HEIGHT_KEY = STYLE_KEY_PREFIX + '_LINE_HEIGHT';
var LINE_HEIGHT_VALUES = (0, _numberRange2.default)(0.8, 5, 0.1);

// We support this cause google doc uses margin-left for indentation for <li />.
var MARGIN_LEFT_KEY = STYLE_KEY_PREFIX + '_TEXT_ALIGN';
var MARGIN_LEFT_VALUES = (0, _numberRange2.default)(12, 12 * 10, 12);

var TEXT_ALIGN_KEY = STYLE_KEY_PREFIX + '_TEXT_ALIGN';
var TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

var StyleMap = {};

function defineBackgroundColorStyle(styleMap, color) {
  // Get `#FFFFFF`.
  var hex = color.hex();
  var suffix = hex.substr(1);
  styleMap[BACKGROUND_COLOR_KEY + '_' + suffix] = {
    'backgroundColor': hex
  };
}

function defineFontSizeStyle(styleMap, fontSize) {
  // 1.5px => 1-5PT.
  var suffix = String(fontSize).replace(/[\.]/, '-');
  styleMap[FONT_SIZE_KEY + '_' + suffix + 'PX'] = {
    'fontSize': fontSize + 'px'
  };
  styleMap[FONT_SIZE_KEY + '_' + suffix + 'PT'] = {
    'fontSize': fontSize + 'pt'
  };
}

function defineLineHeightStyle(styleMap, lineHeight) {
  var suffix = String(lineHeight).replace(/[\.]/, '-');
  styleMap[LINE_HEIGHT_KEY + '_' + suffix] = {
    'lineHeight': '' + lineHeight
  };
}

function defineMarginLeftStyle(styleMap, marginLeft) {
  var suffix = String(marginLeft);
  styleMap[MARGIN_LEFT_KEY + '_' + suffix + 'PT'] = {
    'marginLeft': marginLeft + 'pt'
  };
}

function defineTextAlignStyle(styleMap, align) {
  var suffix = align.toUpperCase();
  styleMap['TEXT_ALIGN_' + suffix] = {
    'textAlign': '' + align
  };
}

function injectCSSIntoDocument(styleMap) {
  if (document.getElementById(STYLES_SHEET_ID)) {
    return;
  }
  var cssTexts = [];
  (0, _keys2.default)(styleMap).forEach(function (styleName) {
    cssTexts.push('.' + styleName + ' {');
    var rules = styleMap[styleName];
    (0, _keys2.default)(rules).forEach(function (attr) {
      cssTexts.push((0, _hyphenize2.default)(attr) + ': ' + rules[attr] + ' !important;');
    });
    cssTexts.push('}');
  });

  var el = document.createElement('style');
  el.id = STYLES_SHEET_ID;
  el.appendChild(document.createTextNode(cssTexts.join('\n')));
  var root = document.head || document.body;
  root && root.appendChild(el);
}

function forBackgroundColor(styleMap, backgroundColor) {
  var color = (0, _color2.default)(backgroundColor);
  var suffix = color.hex().substr(1);
  var key = BACKGROUND_COLOR_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forFontSize(styleMap, fontSize) {
  // 12.5pt => 12-5PT
  var suffix = String(fontSize).replace(/[\.]/, '-').toUpperCase();
  var key = FONT_SIZE_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forTextAlign(styleMap, textAlign) {
  var suffix = textAlign.substr(1);
  var key = TEXT_ALIGN_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forLineHeight(styleMap, lineHeight) {
  var suffix = String(lineHeight).replace(/[\.]/, '-');
  var key = LINE_HEIGHT_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forMarginLeft(styleMap, marginLeft) {
  var suffix = String(marginLeft).toUpperCase();
  var key = MARGIN_LEFT_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

BACKGROUND_COLOR_VALUES.forEach(defineBackgroundColorStyle.bind(null, StyleMap));
FONT_SIZE_VALUES.forEach(defineFontSizeStyle.bind(null, StyleMap));
LINE_HEIGHT_VALUES.forEach(defineLineHeightStyle.bind(null, StyleMap));
MARGIN_LEFT_VALUES.forEach(defineMarginLeftStyle.bind(null, StyleMap));
TEXT_ALIGN_VALUES.forEach(defineTextAlignStyle.bind(null, StyleMap));

var DocsCustomStyleMap = (0, _extends3.default)({}, StyleMap, {
  forBackgroundColor: forBackgroundColor.bind(null, StyleMap),
  forFontSize: forFontSize.bind(null, StyleMap),
  forLineHeight: forLineHeight.bind(null, StyleMap),
  forMarginLeft: forMarginLeft.bind(null, StyleMap),
  forTextAlign: forTextAlign.bind(null, StyleMap),
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, StyleMap)
});

// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52
exports.default = DocsCustomStyleMap;