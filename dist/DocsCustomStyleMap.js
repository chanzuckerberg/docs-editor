'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _createPaletteColors = require('./createPaletteColors');

var _createPaletteColors2 = _interopRequireDefault(_createPaletteColors);

var _hyphenize = require('./hyphenize');

var _hyphenize2 = _interopRequireDefault(_hyphenize);

var _numberRange = require('./numberRange');

var _numberRange2 = _interopRequireDefault(_numberRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STYLES_SHEET_ID = 'DocsCustomStyleMap';

var StyleMap = {};

function defineFontSizeStyle(styleMap, fontSize) {
  styleMap['FONT_SIZE_' + fontSize + 'px'] = {
    'fontSize': fontSize + 'px'
  };
  styleMap['FONT_SIZE_' + fontSize + 'pt'] = {
    'fontSize': fontSize + 'pt'
  };
}

function defineLineHeightStyle(styleMap, lineHeight) {
  styleMap['LINE_HEIGHT_' + lineHeight] = {
    'lineHeight': '' + lineHeight
  };
}

function defineTextAlignStyle(styleMap, align) {
  styleMap['TEXT_ALIGN_' + align] = {
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
      cssTexts.push((0, _hyphenize2.default)(attr, '-') + ': ' + rules[attr] + ';');
    });
    cssTexts.push('}');
  });

  var el = document.createElement('style');
  el.id = STYLES_SHEET_ID;
  el.appendChild(document.createTextNode(cssTexts.join('\n')));
  var root = document.head || document.body;
  root && root.appendChild(el);
}

(0, _numberRange2.default)(6, 86).forEach(defineFontSizeStyle.bind(null, StyleMap));
(0, _numberRange2.default)(0.8, 5, 0.1).forEach(defineLineHeightStyle.bind(null, StyleMap));
['left', 'center', 'right'].forEach(defineTextAlignStyle.bind(null, StyleMap));

var DocsCustomStyleMap = (0, _extends3.default)({}, StyleMap, {
  injectCSSIntoDocument: injectCSSIntoDocument.bind(null, StyleMap)
});

// See
// https://github.com/facebook/draft-js/blob/a33fbcdc98832a6d12e30e1491a772c5a35aaaa9/examples/draft-0-10-0/color/color.html
// https://github.com/facebook/draft-js/issues/52
exports.default = DocsCustomStyleMap;