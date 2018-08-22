'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// e.g. '.my-class-name': {'color': 'red'}
var babelPluginFlowReactPropTypes_proptype_CSSStyleDeclarationLike = require('./Types').babelPluginFlowReactPropTypes_proptype_CSSStyleDeclarationLike || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_DocumentLike = require('./Types').babelPluginFlowReactPropTypes_proptype_DocumentLike || require('prop-types').any;

function getCSSRules(domDocument) {
  if (!domDocument) {
    return new _map2.default();
  }

  var result = new _map2.default();
  (0, _from2.default)(domDocument.querySelectorAll('style')).forEach(function (el) {
    var sheet = el.sheet;
    if (!sheet) {
      return;
    }
    var cssRules = sheet.cssRules;
    if (!cssRules) {
      return;
    }

    (0, _from2.default)(cssRules).forEach(function (rule) {
      var selectorText = String(rule.selectorText || '');
      if (!selectorText) {
        // This could be `CSSImportRule.` created by @import().
        return;
      }
      var styleMap = rule.styleMap;
      if (!styleMap) {
        return;
      }
      var rules = result.get(selectorText) || {};
      rule.styleMap.forEach(function (cssStyleValue, key) {
        // e.g. rules['color'] = 'red'.
        rules[String(key)] = String(cssStyleValue);
      });
      result.set(selectorText, rules);
    });
  });
  return result;
}

exports.default = getCSSRules;