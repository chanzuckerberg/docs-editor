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

// This files defined the supported Custom Styles.
// These styles will be used by `convertFromHTML()`.
// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52

// =============================================================================
// DO NOT RENAME THE KEY (e.g. "FONT_SIZE_KEY") because exiting saved document
// might have save these keys into `contentState => inlineStyleRanges`.
// =============================================================================

// Background Color defaults to be brighter.
var BACKGROUND_COLOR_KEY = STYLE_KEY_PREFIX + '_BACKGROUND_COLOR';
var BACKGROUND_COLOR_VALUES = [(0, _color2.default)('#ffff00'), (0, _color2.default)('#4b4b96')].concat((0, _createPaletteColors2.default)(90, 90));

var FONT_SIZE_KEY = STYLE_KEY_PREFIX + '_FONT_SIZE';
var FONT_SIZE_VALUES = (0, _numberRange2.default)(4, 86);

// Text Color defaults to be darker.
var COLOR_KEY = STYLE_KEY_PREFIX + '_COLOR';
var COLOR_VALUES = [(0, _color2.default)('#222222'), (0, _color2.default)('#ffffff')].concat((0, _createPaletteColors2.default)(90, 20));

var LINE_HEIGHT_KEY = STYLE_KEY_PREFIX + '_LINE_HEIGHT';
var LINE_HEIGHT_VALUES = (0, _numberRange2.default)(0.8, 5, 0.1);

var LIST_STYLE_IMAGE_KEY = STYLE_KEY_PREFIX + '_LIST_STYLE_IMAGE';
var LIST_STYLE_IMAGE_VALUES = ['25a0', '25cb', '25cd', '25cf'];

var LIST_STYLE_TYPE_KEY = STYLE_KEY_PREFIX + '_LIST_STYLE_TYPE';
var LIST_STYLE_TYPE_VALUES = ['none', 'disc'];

// We only support this cause google doc uses margin-left for indentation for
// <li />.
var MARGIN_LEFT_KEY = STYLE_KEY_PREFIX + '_TEXT_ALIGN';
var MARGIN_LEFT_VALUES = (0, _numberRange2.default)(12, 12 * 10, 12);

var TEXT_ALIGN_KEY = STYLE_KEY_PREFIX + '_TEXT_ALIGN';
var TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

function defineListStyleImage(styleMap, listStyleImage) {
  var suffix = listStyleImage.toUpperCase();
  var childSelector = '.public-DraftStyleDefault-block > span::before';

  // This className is just a placeholder, the actual style will be defined
  // at `...::before` below.
  styleMap[LIST_STYLE_IMAGE_KEY + '_' + suffix] = {};
  styleMap[LIST_STYLE_IMAGE_KEY + '_' + suffix + ' > ' + childSelector] = {
    'content': '"\\00' + listStyleImage + '  "'
  };
}

function defineColorStyle(styleMap, color) {
  // Get `#FFFFFF`.
  var hex = color.hex();
  var suffix = hex.substr(1);
  styleMap[COLOR_KEY + '_' + suffix] = {
    'color': hex
  };
}

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
  styleMap[TEXT_ALIGN_KEY + '_' + suffix] = {
    'textAlign': '' + align
  };
}

function defineListStyleTypeStyle(styleMap, listStyleType) {
  var suffix = listStyleType.toUpperCase();
  styleMap[LIST_STYLE_TYPE_KEY + '_' + suffix] = {
    'listStyleType': '' + listStyleType
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

function forColor(styleMap, colorStr) {
  var color = (0, _getNearestColor2.default)((0, _color2.default)(colorStr), COLOR_VALUES);
  var suffix = color ? color.hex().substr(1) : '';
  var key = COLOR_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forBackgroundColor(styleMap, backgroundColor) {
  var color = (0, _getNearestColor2.default)((0, _color2.default)(backgroundColor), BACKGROUND_COLOR_VALUES);
  var suffix = color ? color.hex().substr(1) : '';
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

function forListStyleType(styleMap, listStyleType) {
  var suffix = String(listStyleType).toUpperCase();
  var key = LIST_STYLE_TYPE_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forMarginLeft(styleMap, marginLeft) {
  var suffix = String(marginLeft).toUpperCase();
  var key = MARGIN_LEFT_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forListStyleImage(styleMap, listStyleImage) {
  var url = listStyleImage.replace(/^url/, '').replace(/[\(\)\"\']/g, '');
  var content = window.decodeURIComponent(url.replace(/-/g, '%'));
  var suffix = content.charCodeAt(0).toString(16).toUpperCase();
  var key = LIST_STYLE_IMAGE_KEY + '_' + suffix;
  return styleMap[key] ? key : 'DOCS_STYLE_LIST_STYLE_IMAGE_25CB';
}

// Styles that can be safely added as inline-style (e.g. style="color: red")
// to element directly.
var InlineStyles = {};

// Styles that should be linked a className that is added to the block element.
// via className which will be stored at `inlineStyleRanges` for a block.
var BlockStyles = {};

BACKGROUND_COLOR_VALUES.forEach(defineBackgroundColorStyle.bind(null, InlineStyles));
COLOR_VALUES.forEach(defineColorStyle.bind(null, InlineStyles));
FONT_SIZE_VALUES.forEach(defineFontSizeStyle.bind(null, InlineStyles));
LINE_HEIGHT_VALUES.forEach(defineLineHeightStyle.bind(null, BlockStyles));
LIST_STYLE_IMAGE_VALUES.forEach(defineListStyleImage.bind(null, BlockStyles));
LIST_STYLE_TYPE_VALUES.forEach(defineListStyleTypeStyle.bind(null, BlockStyles));
MARGIN_LEFT_VALUES.forEach(defineMarginLeftStyle.bind(null, BlockStyles));
TEXT_ALIGN_VALUES.forEach(defineTextAlignStyle.bind(null, BlockStyles));

var AllStyles = (0, _extends3.default)({}, InlineStyles, BlockStyles);

var DocsCustomStyleMap = (0, _extends3.default)({}, InlineStyles, {
  forColor: forColor.bind(null, AllStyles),
  forBackgroundColor: forBackgroundColor.bind(null, AllStyles),
  forFontSize: forFontSize.bind(null, AllStyles),
  forLineHeight: forLineHeight.bind(null, AllStyles),
  forListStyleImage: forListStyleImage.bind(null, AllStyles),
  forListStyleType: forListStyleType.bind(null, AllStyles),
  forMarginLeft: forMarginLeft.bind(null, AllStyles),
  forTextAlign: forTextAlign.bind(null, AllStyles),
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, AllStyles)
});

exports.default = DocsCustomStyleMap;