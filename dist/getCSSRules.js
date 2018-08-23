'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSS_SELECTOR_TEXT = exports.CSS_SELECTOR_PRIORITY = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// e.g. '.my-class-name': {'color': 'red'}
var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

var CSS_SELECTOR_PRIORITY = exports.CSS_SELECTOR_PRIORITY = '--docs-css-selector-priority';
var CSS_SELECTOR_TEXT = exports.CSS_SELECTOR_TEXT = '--docs-css-selector-text';

var EMPTY_MAP = new _immutable.OrderedMap();

function getCSSRules(domDocument) {
  return EMPTY_MAP.withMutations(function (mutableCSSRules) {
    if (!domDocument) {
      return;
    }
    (0, _from2.default)(domDocument.querySelectorAll('style')).forEach(function (el) {
      var sheet = el.sheet;
      if (!sheet) {
        // TODO: Find out why the browser does not support this.
        return;
      }

      var cssRules = sheet.cssRules;
      if (!cssRules) {
        // TODO: Find out why the browser does not support this.
        return;
      }

      (0, _from2.default)(cssRules).forEach(function (rule, cssRuleIndex) {
        var selectorText = String(rule.selectorText || '');
        if (!selectorText) {
          // This could be `CSSImportRule.` created by @import().
          return;
        }

        if (!rule.styleMap) {
          // TODO: Find out why the browser does not support this.
          return;
        }

        var styleMap = mutableCSSRules.get(selectorText) || EMPTY_MAP;
        styleMap = styleMap.withMutations(function (mutableStyleMap) {
          rule.styleMap.forEach(function (cssStyleValue, key) {
            // e.g. rules['color'] = 'red'.
            mutableStyleMap.set(String(key), String(cssStyleValue));
          });
          // We need to remember the order of css selector so we could compare
          // its priority later.
          mutableStyleMap.set(CSS_SELECTOR_PRIORITY, cssRuleIndex);
          mutableStyleMap.set(CSS_SELECTOR_TEXT, selectorText);
        });
        if (styleMap.size > 0) {
          mutableCSSRules.set(selectorText, styleMap);
        }
      });
    });
  });
}

exports.default = getCSSRules;