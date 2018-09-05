'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _createPaletteColors = require('./createPaletteColors');

var _createPaletteColors2 = _interopRequireDefault(_createPaletteColors);

var _createWebSafeColors = require('./createWebSafeColors');

var _createWebSafeColors2 = _interopRequireDefault(_createWebSafeColors);

var _getNearestColor = require('./getNearestColor');

var _getNearestColor2 = _interopRequireDefault(_getNearestColor);

var _hyphenize = require('./hyphenize');

var _hyphenize2 = _interopRequireDefault(_hyphenize);

var _numberRange = require('./numberRange');

var _numberRange2 = _interopRequireDefault(_numberRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles that can be safely added as inline-style (e.g. style="color: red")
// to element directly.
var InlineStyles = {};

// Styles that should be linked a className that is added to the block element.
// via className which will be stored at `inlineStyleRanges` for a block.
var BlockStyles = {};

var STYLES_SHEET_ID = 'DocsCustomStyleMap';
var STYLE_KEY_PREFIX = 'DOCS_STYLE';
var LIST_MAX_DEPTH = 20;
var WEB_SAFE_COLORS = (0, _createWebSafeColors2.default)();

// This files defined the supported Custom Styles.
// These styles will be used by `convertFromHTML()`.
// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52

// =============================================================================
// DO NOT RENAME THE KEY (e.g. "FONT_SIZE_KEY") because exiting saved document
// might have save these keys into `contentState => inlineStyleRanges`.
// =============================================================================

// http://www.color-hex.com/216-web-safe-colors/

// Background Color defaults to be brighter.
var BACKGROUND_COLOR_KEY = STYLE_KEY_PREFIX + '_BACKGROUND_COLOR';
var BACKGROUND_COLOR_VALUES = [(0, _color2.default)('#4b4b96')].concat(WEB_SAFE_COLORS, (0, _createPaletteColors2.default)(90, 90));

var FONT_SIZE_KEY = STYLE_KEY_PREFIX + '_FONT_SIZE';
var FONT_SIZE_VALUES = (0, _numberRange2.default)(4, 86);

// Text Color defaults to be darker.
var COLOR_KEY = STYLE_KEY_PREFIX + '_COLOR';
var COLOR_VALUES = WEB_SAFE_COLORS.concat((0, _createPaletteColors2.default)(90, 20));

var LINE_HEIGHT_KEY = STYLE_KEY_PREFIX + '_LINE_HEIGHT';
var LINE_HEIGHT_VALUES = (0, _numberRange2.default)(0.8, 3, 0.0);

var LIST_STYLE_TYPE_KEY = STYLE_KEY_PREFIX + '_LIST_STYLE_TYPE';
var LIST_STYLE_TYPE_VALUES = ['armenian', 'circle', 'cjk-ideographic', 'decimal', 'decimal-leading-zero', 'disc', 'georgian', 'hebrew', 'hiragana', 'hiragana-iroha', 'inherit', 'katakana', 'katakana-iroha', 'lower-alpha', 'lower-greek', 'lower-latin', 'lower-roman', 'square', 'upper-alpha', 'upper-greek', 'upper-latin', 'upper-roman'];

var LIST_START_KEY = STYLE_KEY_PREFIX + '_LIST_START';
var LIST_START_VALUES = (0, _numberRange2.default)(2, 100);

var TEXT_ALIGN_KEY = STYLE_KEY_PREFIX + '_TEXT_ALIGN';
var TEXT_ALIGN_VALUES = ['left', 'center', 'right'];

var VERTICAL_ALIGN_KEY = STYLE_KEY_PREFIX + '_VERTICAL_ALIGN';
var VERTICAL_ALIGN_VALUES = ['baseline', 'sub', 'super', 'text-bottom', 'text-top'];

var TRANSPARENT_COLORS = new _set2.default(['default', 'transparent', 'rgba(0, 0, 0, 0)', 'inherit', 'none']);

function defineListStartStyle(styleMap, listStart) {
  var suffix = listStart.toString();
  styleMap[LIST_START_KEY + '_' + suffix] = {};
  var dd = 0;
  while (dd <= LIST_MAX_DEPTH) {
    styleMap[LIST_START_KEY + '_' + suffix + ('.public-DraftStyleDefault-depth' + dd) + '.public-DraftStyleDefault-reset'] = {
      'counter-reset': 'ol' + dd + ' ' + (listStart - 1)
    };
    dd++;
  }
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
  if (fontSize > 24) {
    styleMap[FONT_SIZE_KEY + '_' + suffix + 'PX'] = {
      'fontSize': fontSize + 'px',
      'lineHeight': '1.2'
    };
    styleMap[FONT_SIZE_KEY + '_' + suffix + 'PT'] = {
      'fontSize': fontSize + 'pt',
      'lineHeight': '1.2'
    };
  } else {
    styleMap[FONT_SIZE_KEY + '_' + suffix + 'PX'] = {
      'fontSize': fontSize + 'px'
    };
    styleMap[FONT_SIZE_KEY + '_' + suffix + 'PT'] = {
      'fontSize': fontSize + 'pt'
    };
  }
}

function defineLineHeightStyle(styleMap, lineHeight) {
  var suffix = String(lineHeight).replace(/[\.]/, '-');
  styleMap[LINE_HEIGHT_KEY + '_' + suffix] = {
    'lineHeight': '' + lineHeight
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
  styleMap[LIST_STYLE_TYPE_KEY + '_' + suffix] = {};
  var dd = 0;
  while (dd < LIST_MAX_DEPTH) {
    styleMap[LIST_STYLE_TYPE_KEY + '_' + suffix + '.public-DraftStyleDefault-orderedListItem' + ('.public-DraftStyleDefault-depth' + dd + '::before')] = {
      'content': 'counter(ol' + dd + ', ' + listStyleType + ') ". "'
    };
    dd++;
  }
}

function defineVerticalAlignStyle(styleMap, align) {
  var suffix = align.toUpperCase();
  styleMap[VERTICAL_ALIGN_KEY + '_' + suffix] = {
    'verticalAlign': '' + align
  };
}

function injectCSSIntoDocument(styleMap) {
  if (document.getElementById(STYLES_SHEET_ID)) {
    return;
  }
  var cssTexts = [];
  (0, _keys2.default)(styleMap).sort().forEach(function (styleName) {
    if (InlineStyles[styleName]) {
      // If this style is meant to be applied inline, we don't need to map it to
      // a global className, except for the `<td />` element.
      // by <td />.
      cssTexts.push('td.' + styleName + ' {');
    } else {
      cssTexts.push('.' + styleName + ' {');
    }
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

  if (TRANSPARENT_COLORS.has(colorStr)) {
    return null;
  }
  var color = (0, _getNearestColor2.default)((0, _color2.default)(colorStr), COLOR_VALUES);
  var suffix = color ? color.hex().substr(1) : '';
  var key = COLOR_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forBackgroundColor(styleMap, colorStr) {
  if (TRANSPARENT_COLORS.has(colorStr)) {
    return null;
  }
  var color = (0, _getNearestColor2.default)((0, _color2.default)(colorStr), BACKGROUND_COLOR_VALUES);
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
  var suffix = textAlign.toUpperCase();
  var key = TEXT_ALIGN_KEY + '_' + suffix;
  return styleMap[key] ? key : null;
}

function forVerticalAlign(styleMap, verticalAlign) {
  var suffix = verticalAlign.toUpperCase();
  var key = VERTICAL_ALIGN_KEY + '_' + suffix;
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

function forListStart(styleMap, listStart) {
  var suffix = listStart;
  var key = LIST_START_KEY + '_' + listStart;
  return styleMap[key] ? key : null;
}

BACKGROUND_COLOR_VALUES.forEach(defineBackgroundColorStyle.bind(null, InlineStyles));
COLOR_VALUES.forEach(defineColorStyle.bind(null, InlineStyles));
FONT_SIZE_VALUES.forEach(defineFontSizeStyle.bind(null, InlineStyles));
LINE_HEIGHT_VALUES.forEach(defineLineHeightStyle.bind(null, BlockStyles));
LIST_STYLE_TYPE_VALUES.forEach(defineListStyleTypeStyle.bind(null, BlockStyles));
LIST_START_VALUES.forEach(defineListStartStyle.bind(null, BlockStyles));
TEXT_ALIGN_VALUES.forEach(defineTextAlignStyle.bind(null, BlockStyles));
VERTICAL_ALIGN_VALUES.forEach(defineVerticalAlignStyle.bind(null, InlineStyles));

var AllStyles = (0, _extends3.default)({}, InlineStyles, BlockStyles);

var DocsCustomStyleMap = (0, _extends3.default)({}, InlineStyles, {
  LIST_STYLE_TYPE_VALUES: LIST_STYLE_TYPE_VALUES,
  forBackgroundColor: forBackgroundColor.bind(null, InlineStyles),
  forColor: forColor.bind(null, AllStyles),
  forFontSize: forFontSize.bind(null, AllStyles),
  forLineHeight: forLineHeight.bind(null, AllStyles),
  forListStart: forListStart.bind(null, AllStyles),
  forListStyleType: forListStyleType.bind(null, AllStyles),
  forTextAlign: forTextAlign.bind(null, AllStyles),
  forVerticalAlign: forVerticalAlign.bind(null, AllStyles),
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, AllStyles)
});

exports.default = DocsCustomStyleMap;